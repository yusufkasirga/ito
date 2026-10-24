import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';
import { assertPublicUrl, canonicalizeUrl, collectSources, isPublicAddress, isRobotsAllowed, parseFeed, parseHtmlListing, parsePublishedDate, safeFetchText } from './collect.mjs';

const now = new Date('2026-10-24T09:00:00Z');
const source = { id: 'official', name: 'Official source', url: 'https://example.com/news/', type: 'rss', category: 'transport', authority: 'primary', language: 'en', enabled: true };
const rss = `<rss version="2.0"><channel><title>Example</title><lastBuildDate>Sat, 24 Oct 2026 00:00:00 GMT</lastBuildDate>
  <item><title>Rail &amp; tourism timetable</title><link>https://example.com/news/rail/?utm_source=feed#section</link><description><![CDATA[<p>New <strong>rail</strong> service</p>]]></description><pubDate>Thu, 22 Oct 2026 10:00:00 GMT</pubDate></item>
  <item><title>Rail &amp; tourism timetable</title><link>https://example.com/news/rail</link><pubDate>Thu, 22 Oct 2026 10:00:00 GMT</pubDate></item>
  <item><title>Undated official notice</title><link>https://example.com/news/undated</link></item>
  <item><title>Old timetable information</title><link>https://example.com/news/old</link><pubDate>Fri, 01 May 2026 10:00:00 GMT</pubDate></item>
  <item><title>Missing link should disappear</title></item>
  <item><title>Private link should disappear</title><link>https://127.0.0.1/private</link></item>
</channel></rss>`;

test('RSS uses item publication dates and safely decodes text', () => {
  const items = parseFeed(rss, source, now);
  assert.equal(items.length, 4);
  assert.equal(items[0].title, 'Rail & tourism timetable');
  assert.equal(items[0].summary, 'New rail service');
  assert.equal(items[0].publishedAt, '2026-10-22T10:00:00.000Z');
  assert.equal(items[2].publishedAt, null, 'channel lastBuildDate must never become article publication date');
});

test('Atom respects alternate links and does not invent publication dates from updated timestamps', () => {
  const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Official cultural exhibition</title><link rel="self" href="https://example.com/feed/1"/><link rel="alternate" href="https://example.com/culture/1"/><summary>Original exhibit information</summary><updated>2026-10-24T00:00:00Z</updated></entry></feed>`;
  const [item] = parseFeed(atom, source, now);
  assert.equal(item.url, 'https://example.com/culture/1');
  assert.equal(item.publishedAt, null);
  const [prefixed] = parseFeed('<atom:feed xmlns:atom="http://www.w3.org/2005/Atom"><atom:entry><atom:title type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml">Museum <b>opening</b> announcement</div></atom:title><atom:link href="https://example.com/culture/2"/><atom:published>2026-10-23T12:00:00Z</atom:published></atom:entry></atom:feed>', source, now);
  assert.match(prefixed.title, /Museum.*opening/u);
  assert.equal(prefixed.publishedAt, '2026-10-23T12:00:00.000Z');
});

test('XML validation rejects malformed data and all DTD/entity declarations', () => {
  assert.throws(() => parseFeed('<rss><channel></rss>', source, now), /Invalid feed XML/u);
  assert.throws(() => parseFeed('<!DOCTYPE rss [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><rss><channel><item>&xxe;</item></channel></rss>', source, now), /forbidden/u);
  assert.throws(() => parseFeed('<html><body>Access denied</body></html>', source, now), /not an RSS or Atom/u);
});

test('HTML discovery stays within article paths and associates only nearby dates', () => {
  const htmlSource = { ...source, type: 'html', linkPattern: '^/news/[^/]+/?$' };
  const html = `<html><header>24 Ekim 2026 <a href="/news/navigation">Navigation headline</a></header><main>
  <article><h2><a href="/news/rail">Rail service announcement</a></h2><time datetime="2026-10-22">22 Ekim 2026</time><p>Official timetable changes.</p></article>
  <article><h2><a href="/news/undated">Museum service announcement</a></h2><p>This notice has no publication date.</p></article>
  <a href="https://other.example.com/news/third">External third party article</a><a href="http://example.com/news/http">Insecure article link</a>
  </main><footer>© 2026</footer></html>`;
  const items = parseHtmlListing(html, htmlSource, now);
  assert.equal(items.length, 2);
  assert.equal(items[0].publishedAt, '2026-10-22T00:00:00.000Z');
  assert.equal(items[1].publishedAt, null);
  const [undated] = parseHtmlListing('<html><header>24 Ekim 2026</header><main><div><a href="/news/event">Cultural event announcement</a><p>The event runs on 22 Ekim 2026.</p></div></main></html>', htmlSource, now);
  assert.equal(undated.publishedAt, null, 'masthead and event dates are not publication evidence');
});

test('canonical URLs strip tracking and fragments while preserving meaningful identifiers', () => {
  assert.equal(canonicalizeUrl('https://EXAMPLE.com/news/item/?id=7&utm_campaign=a&fbclid=x#anchor'), 'https://example.com/news/item?id=7');
  assert.equal(canonicalizeUrl('/news/item?b=2&a=1', source.url), 'https://example.com/news/item?a=1&b=2');
});

test('date parsing rejects invalid and far-future dates and handles Turkish dates', () => {
  assert.equal(parsePublishedDate('22 Ekim 2026', now), '2026-10-22T00:00:00.000Z');
  assert.equal(parsePublishedDate('15.10.26 Perşembe', now), '2026-10-15T00:00:00.000Z');
  assert.equal(parsePublishedDate('31.02.2026', now), null);
  assert.equal(parsePublishedDate('2026-02-31', now), null);
  assert.equal(parsePublishedDate('2027-01-01', now), null);
  assert.equal(parsePublishedDate('2026', now), null);
});

test('robots uses most specific agent and path rules without mixing unrelated agents', () => {
  assert.equal(isRobotsAllowed('User-agent: OtherBot\nDisallow: /', source.url), true);
  assert.equal(isRobotsAllowed('User-agent: *\nDisallow: /news\nAllow: /news/public', 'https://example.com/news/private'), false);
  assert.equal(isRobotsAllowed('User-agent: *\nDisallow: /news\nAllow: /news/public', 'https://example.com/news/public/item'), true);
  assert.equal(isRobotsAllowed('User-agent: *\nDisallow: /\nUser-agent: ITOResearchBot\nAllow: /', source.url), true);
});

test('URL and DNS validation reject localhost, credentials, insecure and private destinations', () => {
  for (const url of ['http://example.com/', 'https://user:pass@example.com/', 'https://example.com:8443/', 'https://127.0.0.1/', 'https://[::1]/', 'https://localhost/', 'https://service.internal/', 'https://metadata/']) assert.throws(() => assertPublicUrl(url));
  for (const address of ['127.0.0.1', '10.0.0.1', '100.100.100.200', '169.254.169.254', '172.16.1.1', '192.168.1.1', '::1', 'fc00::1', 'fe80::1', '::ffff:127.0.0.1', '2001:db8::1', '2002:7f00:1::']) assert.equal(isPublicAddress(address), false, address);
  assert.equal(isPublicAddress('93.184.216.34'), true);
  assert.equal(isPublicAddress('2606:4700:4700::1111'), true);
});

function fakeTransport(responses, calls = []) {
  return (url, options, callback) => {
    calls.push({ url: String(url), options });
    const req = new EventEmitter();
    req.destroy = error => { req.emit('error', error); req.emit('close'); };
    req.end = () => queueMicrotask(() => {
      const response = responses.shift();
      const res = new EventEmitter();
      res.statusCode = response.status ?? 200;
      res.headers = response.headers ?? { 'content-type': 'text/xml; charset=utf-8' };
      res.resume = () => req.emit('close');
      callback(res);
      if (!res.headers.location) { res.emit('data', Buffer.from(response.body ?? 'ok')); res.emit('end'); req.emit('close'); }
    });
    return req;
  };
}

test('network fetch pins a validated DNS answer and revalidates redirect destinations', async () => {
  const calls = [];
  const resolver = async hostname => [{ address: hostname === 'evil.example.com' ? '127.0.0.1' : '93.184.216.34', family: 4 }];
  await assert.rejects(safeFetchText(source.url, { resolver, transport: fakeTransport([{ status: 302, headers: { location: 'https://evil.example.com/private' } }], calls) }), /non-public/u);
  assert.equal(calls.length, 1, 'private redirected request must never be opened');
  const pinned = await new Promise((resolve, reject) => calls[0].options.lookup('example.com', {}, (error, address) => error ? reject(error) : resolve(address)));
  assert.equal(pinned, '93.184.216.34');
});

test('network fetch rejects unsafe redirects, oversized bodies, and inaccessible servers', async () => {
  const resolver = async () => [{ address: '93.184.216.34', family: 4 }];
  await assert.rejects(safeFetchText(source.url, { resolver, transport: fakeTransport([{ status: 302, headers: { location: 'http://example.com/no' } }]) }), /HTTPS/u);
  await assert.rejects(safeFetchText(source.url, { resolver, maxBytes: 3, transport: fakeTransport([{ body: 'large' }]) }), /size limit/u);
  await assert.rejects(safeFetchText(source.url, { resolver, transport: fakeTransport([{ status: 403 }]) }), /HTTP 403/u);
});

test('collection deduplicates, filters stale items, preserves failures and reports honest fresh shortfalls', async () => {
  const broken = { ...source, id: 'broken', url: 'https://broken.example.com/feed' };
  const fetchText = async value => {
    const url = new URL(value);
    if (url.pathname === '/robots.txt') return { text: 'User-agent: *\nAllow: /' };
    if (url.hostname === 'broken.example.com') throw new Error('HTTP 503');
    return { text: rss };
  };
  const result = await collectSources({ sources: [source, broken], limit: 100, maxAgeDays: 45, now, fetchText });
  assert.equal(result.items.length, 2);
  assert.equal(result.freshItemCount, 1);
  assert.equal(result.undatedItemCount, 1);
  assert.equal(result.shortfall, 99);
  assert.equal(result.failures[0].sourceId, 'broken');
});

test('collection fails closed for robots fetch errors and skips disallowed sources', async () => {
  let requests = 0;
  const result = await collectSources({ sources: [source], now, fetchText: async url => {
    requests++;
    assert.equal(new URL(url).pathname, '/robots.txt');
    return { text: 'User-agent: *\nDisallow: /news/' };
  } });
  assert.equal(requests, 1);
  assert.equal(result.items.length, 0);
  assert.match(result.failures[0].error, /robots/u);
  const unavailable = await collectSources({ sources: [source], now, fetchText: async () => { throw new Error('timeout'); } });
  assert.match(unavailable.failures[0].error, /robots.txt unavailable/u);
});

test('source scope excludes whole-site feed drift and records excluded item counts', async () => {
  const scoped = { ...source, itemUrlPattern: '^/news/rail$', allowedItemHosts: ['example.com'] };
  const result = await collectSources({ sources: [scoped], now, fetchText: async value => ({ text: new URL(value).pathname === '/robots.txt' ? 'User-agent: *\nAllow: /' : rss }) });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].url, 'https://example.com/news/rail');
  assert.equal(result.excludedByScopeCount, 2);
  assert.equal(result.sourceStats[0].discoveredItems, 4);
  assert.equal(result.sourceStats[0].excludedByScope, 2);
});
