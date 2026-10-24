import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import https from 'node:https';
import { isIP } from 'node:net';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse, parseFragment } from 'parse5';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const USER_AGENT = 'ITOResearchBot/1.0 (+https://itineraryofturkiye.com)';
const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 15_000;
const asArray = value => value == null ? [] : Array.isArray(value) ? value : [value];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const children = node => node.childNodes ?? [];
const descendants = node => children(node).flatMap(child => [child, ...descendants(child)]);

function nodeText(node) {
  if (['script', 'style', 'noscript'].includes(node.nodeName)) return '';
  return node.nodeName === '#text' ? node.value : children(node).map(nodeText).join(' ');
}

function cleanText(value, max = 1000) {
  if (typeof value === 'object') value = Object.entries(value ?? {}).filter(([key]) => !key.startsWith('@_')).map(([, child]) => cleanText(child, max)).join(' ');
  const markup = String(value ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gu, '$1');
  return nodeText(parseFragment(markup)).replace(/\s+/gu, ' ').trim().slice(0, max);
}

export function assertPublicUrl(value) {
  const url = value instanceof URL ? new URL(value) : new URL(value);
  const host = url.hostname.toLowerCase().replace(/\.$/u, '');
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) {
    throw new Error('Only credential-free public HTTPS URLs on port 443 are allowed');
  }
  // Hostnames only: IP literals, local names and single-label intranet names are rejected.
  if (isIP(host) || host.startsWith('[') || !host.includes('.') || /(^|\.)(localhost|local|internal|invalid|test)$/u.test(host)) {
    throw new Error('Local, private or IP-literal URLs are not allowed');
  }
  return url;
}

export function isPublicAddress(address) {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 0 || b === 168)) ||
      (a === 192 && b === 88 && c === 99) || (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113));
  }
  if (isIP(address) === 6) {
    const lower = address.toLowerCase();
    // Accept global unicast only; exclude special-purpose 2001::/23 and documentation ranges.
    const first = Number.parseInt(lower.split(':')[0], 16);
    const second = Number.parseInt(lower.split(':')[1] || '0', 16);
    return first >= 0x2000 && first <= 0x3fff &&
      !(first === 0x2001 && (second < 0x200 || second === 0xdb8)) &&
      !(first === 0x2002) && !(first === 0x3fff && second < 0x1000);
  }
  return false;
}

export function canonicalizeUrl(value, base) {
  const url = assertPublicUrl(new URL(value, base));
  url.hash = '';
  url.hostname = url.hostname.toLowerCase().replace(/\.$/u, '');
  for (const key of [...url.searchParams.keys()]) {
    if (/^utm_/iu.test(key) || /^(fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|ref_src)$/iu.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  // Collapse only the final slash; preserve case, path escaping and meaningful query parameters.
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/$/u, '');
  return url.toString();
}

export async function safeFetchText(value, { timeoutMs = TIMEOUT_MS, maxBytes = MAX_BYTES, resolver = lookup, transport = https.request, redirectCount = 0, onRedirect } = {}) {
  const url = assertPublicUrl(value);
  if (redirectCount > 4) throw new Error('Too many redirects');
  const addresses = await Promise.race([
    resolver(url.hostname, { all: true, verbatim: true }),
    new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('DNS lookup timed out')), timeoutMs); timer.unref?.(); }),
  ]);
  if (!addresses.length || addresses.some(item => !isPublicAddress(item.address))) throw new Error('DNS resolves to a non-public address');
  // Pin the vetted DNS answer to this connection, including after every redirect.
  const address = addresses.find(item => item.family === 4) ?? addresses[0];
  const response = await new Promise((resolve, reject) => {
    const req = transport(url, {
      method: 'GET', maxHeaderSize: 16_384, agent: false,
      headers: { 'user-agent': USER_AGENT, accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html, text/plain;q=0.8', 'accept-encoding': 'identity' },
      lookup: (_hostname, options, done) => {
        if (options?.all) done(null, [address]);
        else done(null, address.address, address.family);
      },
    }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        res.resume();
        resolve({ status: res.statusCode, location: res.headers.location });
        return;
      }
      const buffers = [];
      let size = 0;
      res.on('data', chunk => {
        size += chunk.length;
        if (size > maxBytes) req.destroy(new Error('Response exceeds size limit'));
        else buffers.push(chunk);
      });
      res.on('error', reject);
      res.on('end', () => {
        const type = String(res.headers['content-type'] ?? '');
        const charset = type.match(/charset\s*=\s*["']?([^\s;"']+)/iu)?.[1] ?? 'utf-8';
        let text;
        try { text = new TextDecoder(charset).decode(Buffer.concat(buffers)); }
        catch { text = Buffer.concat(buffers).toString('utf8'); }
        resolve({ status: res.statusCode, contentType: type, text, url: url.toString() });
      });
    });
    const timer = setTimeout(() => req.destroy(new Error('Request timed out')), timeoutMs);
    req.on('close', () => clearTimeout(timer));
    req.on('error', reject);
    req.end();
  });
  if (response.location) {
    const destination = assertPublicUrl(new URL(response.location, url));
    if (onRedirect) await onRedirect(destination);
    return safeFetchText(destination, { timeoutMs, maxBytes, resolver, transport, redirectCount: redirectCount + 1, onRedirect });
  }
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  if (response.contentType && !/xml|html|text\/plain|json/iu.test(response.contentType)) throw new Error('Unsupported response content type');
  return response;
}

export function isRobotsAllowed(text, value, userAgent = 'itoresearchbot') {
  const groups = [];
  let group = { agents: [], rules: [] };
  for (const raw of String(text).split(/\r?\n/u)) {
    const line = raw.replace(/#.*$/u, '').trim();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const rule = line.slice(colon + 1).trim();
    if (key === 'user-agent') {
      if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] }; }
      group.agents.push(rule.toLowerCase());
    } else if (['allow', 'disallow'].includes(key) && group.agents.length && rule) group.rules.push({ allow: key === 'allow', path: rule.slice(0, 500) });
  }
  groups.push(group);
  const strength = item => Math.max(-1, ...item.agents.map(agent => agent === '*' ? 0 : userAgent.includes(agent) ? agent.length : -1));
  const strongest = Math.max(-1, ...groups.map(strength));
  if (strongest < 0) return true;
  const url = new URL(value);
  const target = url.pathname + url.search;
  const matching = groups.filter(item => strength(item) === strongest).flatMap(item => item.rules).filter(rule => {
    const escaped = rule.path.replace(/[.+?^${}()|[\]\\]/gu, '\\$&').replace(/\*/gu, '.*').replace(/\\\$$/u, '$');
    return new RegExp(`^${escaped}`, 'u').test(target);
  }).sort((a, b) => b.path.replace(/\*/gu, '').length - a.path.replace(/\*/gu, '').length || Number(b.allow) - Number(a.allow));
  return !matching.length || matching[0].allow;
}

export function parsePublishedDate(value, now = new Date()) {
  if (!value) return null;
  const raw = String(value).trim();
  let date;
  const numeric = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})(?:\s|$)/u);
  const months = ['ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'];
  const turkish = raw.toLocaleLowerCase('tr').match(/^(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})(?:\s|$)/u);
  if (numeric || (turkish && months.includes(turkish[2]))) {
    const day = Number((numeric ?? turkish)[1]);
    const month = numeric ? Number(numeric[2]) : months.indexOf(turkish[2]) + 1;
    const year = numeric ? Number(numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3]) : Number(turkish[3]);
    date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  } else if (/^\d{4}-\d{2}-\d{2}(?:T|$)/u.test(raw) || /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/iu.test(raw)) {
    date = new Date(raw);
    if (/^\d{4}-\d{2}-\d{2}/u.test(raw)) {
      const [year, month, day] = raw.slice(0, 10).split('-').map(Number);
      const calendar = new Date(Date.UTC(year, month - 1, day));
      if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) return null;
    }
  } else return null;
  return Number.isFinite(date?.valueOf()) && date.valueOf() <= now.valueOf() + 300_000 ? date.toISOString() : null;
}

function itemRecord(raw, source, now) {
  if (!raw.url || !String(raw.url).trim()) return null;
  let url;
  try { url = canonicalizeUrl(raw.url, source.url); } catch { return null; }
  const title = cleanText(raw.title, 500);
  if (title.length < 8) return null;
  return {
    id: createHash('sha256').update(url).digest('hex').slice(0, 24), url, title,
    summary: cleanText(raw.summary, 1000), publishedAt: parsePublishedDate(raw.publishedAt, now),
    discoveredAt: now.toISOString(), sourceId: source.id, sourceName: source.name,
    authority: source.authority, category: source.category, language: source.language,
  };
}

export function parseFeed(xml, source, now = new Date()) {
  if (/<!DOCTYPE|<!ENTITY/iu.test(xml)) throw new Error('DTD and entity declarations are forbidden');
  const validation = XMLValidator.validate(xml);
  if (validation !== true) throw new Error(`Invalid feed XML: ${validation.err.msg}`);
  const data = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', removeNSPrefix: true, trimValues: true, processEntities: false, parseTagValue: false,
    // Keep embedded XHTML in document order, then sanitize its text with the HTML parser.
    stopNodes: ['*.title', '*.description', '*.summary', '*.content', '*.encoded'],
  }).parse(xml);
  let entries;
  if (data.rss?.channel) entries = asArray(data.rss.channel.item).map(item => ({
    url: typeof item.link === 'string' ? item.link : item.link?.['#text'] ?? (item.guid?.['@_isPermaLink'] !== 'false' ? item.guid?.['#text'] : ''),
    title: item.title, summary: item.description ?? item.encoded, publishedAt: item.pubDate ?? item.date ?? item.issued,
  }));
  else if (data.feed) entries = asArray(data.feed.entry).map(item => ({
    url: asArray(item.link).find(link => !link['@_rel'] || link['@_rel'] === 'alternate')?.['@_href'],
    title: item.title, summary: item.summary ?? item.content, publishedAt: item.published,
  }));
  else if (data.RDF) entries = asArray(data.RDF.item).map(item => ({ url: item.link, title: item.title, summary: item.description, publishedAt: item.date }));
  else throw new Error('Response is not an RSS or Atom feed');
  return entries.map(item => itemRecord(item, source, now)).filter(Boolean);
}

export function parseHtmlListing(html, source, now = new Date()) {
  if (!source.linkPattern) throw new Error('HTML source requires a bounded article linkPattern');
  const pattern = new RegExp(source.linkPattern, 'iu');
  const tree = parse(html);
  const anchors = descendants(tree).filter(node => node.tagName === 'a' && attr(node, 'href'));
  const candidates = [];
  for (const anchor of anchors) {
    let url;
    try { url = assertPublicUrl(new URL(attr(anchor, 'href'), source.url)); } catch { continue; }
    if (url.origin !== new URL(source.url).origin || !pattern.test(url.pathname + url.search) || canonicalizeUrl(url) === canonicalizeUrl(source.url)) continue;
    let parent = anchor;
    let ignored = false;
    while (parent) { if (['nav', 'header', 'footer'].includes(parent.tagName)) ignored = true; parent = parent.parentNode; }
    if (ignored) continue;
    let title = cleanText(nodeText(anchor), 500) || attr(anchor, 'title') || attr(anchor, 'aria-label') || '';
    let publishedAt = null;
    let summary = '';
    parent = anchor.parentNode;
    for (let depth = 0; parent && depth < 4; depth++, parent = parent.parentNode) {
      if (['main', 'body', 'html'].includes(parent.tagName)) break;
      const nodes = descendants(parent);
      const articleLinks = new Set(nodes.filter(node => node.tagName === 'a' && attr(node, 'href')).map(node => {
        try { const link = new URL(attr(node, 'href'), source.url); return pattern.test(link.pathname + link.search) ? canonicalizeUrl(link) : null; } catch { return null; }
      }).filter(Boolean));
      if (articleLinks.size > 1) break;
      const heading = nodes.find(node => /^h[1-6]$/u.test(node.tagName));
      if (title.length < 15 && heading) title = cleanText(nodeText(heading), 500);
      const time = nodes.find(node => node.tagName === 'time');
      if (time) publishedAt = parsePublishedDate(attr(time, 'datetime') || nodeText(time), now);
      if (!publishedAt) {
        // A standalone date label is evidence; dates embedded in an event description are not publication dates.
        const dateLabel = nodes.map(node => cleanText(nodeText(node), 120)).find(text =>
          /^\(?\d{1,2}\.\d{1,2}\.\d{2,4}\)?(?:\s+(?:Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar))?$/iu.test(text) ||
          /^\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+\d{4}(?:\s+(?:Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar))?$/iu.test(text) ||
          /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}$/iu.test(text));
        if (dateLabel) publishedAt = parsePublishedDate(dateLabel.replace(/[()]/gu, ''), now);
      }
      const paragraph = nodes.find(node => node.tagName === 'p');
      if (paragraph) summary = cleanText(nodeText(paragraph));
      if (publishedAt && title.length >= 15) break;
    }
    const item = itemRecord({ url, title, summary, publishedAt }, source, now);
    if (item) candidates.push(item);
  }
  return candidates;
}

export async function collectSources({ sources, limit = 100, maxAgeDays = 45, concurrency = 3, now = new Date(), fetchText = safeFetchText } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new Error('limit must be an integer from 1 to 1000');
  if (!Number.isFinite(maxAgeDays) || maxAgeDays < 1 || maxAgeDays > 365) throw new Error('maxAgeDays must be from 1 to 365');
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 5) throw new Error('concurrency must be an integer from 1 to 5');
  if (!sources) sources = JSON.parse(await readFile(path.join(ROOT, 'config/blog-sources.json'), 'utf8')).sources;
  const enabled = sources.filter(source => source.enabled);
  const failures = [];
  const sourceStats = [];
  const robots = new Map();
  async function ensureAllowed(url) {
    const safe = assertPublicUrl(url);
    if (!robots.has(safe.origin)) robots.set(safe.origin, (async () => {
      try { return (await fetchText(new URL('/robots.txt', safe.origin))).text; }
      catch (error) { if ([404, 410].includes(error.status)) return ''; throw new Error(`robots.txt unavailable: ${error.message}`); }
    })());
    if (!isRobotsAllowed(await robots.get(safe.origin), safe)) throw new Error('Disallowed by robots.txt');
    return safe;
  }
  async function allowedFetch(url) {
    const safe = await ensureAllowed(url);
    return fetchText(safe, { onRedirect: ensureAllowed });
  }
  let position = 0;
  const buckets = [];
  await Promise.all(Array.from({ length: Math.min(Math.max(1, concurrency), 5, enabled.length) }, async () => {
    while (position < enabled.length) {
      const source = enabled[position++];
      try {
        const response = await allowedFetch(source.url);
        const discovered = source.type === 'html' ? parseHtmlListing(response.text, source, now) : parseFeed(response.text, source, now);
        const scope = source.itemUrlPattern ? new RegExp(source.itemUrlPattern, 'iu') : null;
        const items = discovered.filter(item => {
          const url = new URL(item.url);
          return (!scope || scope.test(url.pathname + url.search)) && (!source.allowedItemHosts || source.allowedItemHosts.includes(url.hostname));
        });
        sourceStats.push({ sourceId: source.id, discoveredItems: discovered.length, excludedByScope: discovered.length - items.length });
        buckets.push({ sourceId: source.id, items });
      } catch (error) { failures.push({ sourceId: source.id, url: source.url, error: error.message }); }
    }
  }));
  const cutoff = now.valueOf() - maxAgeDays * 86_400_000;
  const seen = new Map();
  // Prefer original sources for identical URLs; keep source diversity through round-robin selection.
  buckets.sort((a, b) => enabled.findIndex(source => source.id === a.sourceId) - enabled.findIndex(source => source.id === b.sourceId));
  for (const bucket of buckets) {
    const before = bucket.items.length;
    bucket.items = bucket.items.filter(item => !item.publishedAt || new Date(item.publishedAt).valueOf() >= cutoff).sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
    const stats = sourceStats.find(item => item.sourceId === bucket.sourceId);
    stats.excludedAsStale = before - bucket.items.length;
    stats.eligibleItems = bucket.items.length;
  }
  const pool = [];
  for (let index = 0; buckets.some(bucket => index < bucket.items.length); index++) for (const bucket of buckets) {
    const item = bucket.items[index];
    if (!item) continue;
    const existing = seen.get(item.url);
    if (existing) {
      if (existing.authority !== 'primary' && item.authority === 'primary') Object.assign(existing, item);
      continue;
    }
    seen.set(item.url, item);
    pool.push(item);
  }
  const dated = pool.filter(item => item.publishedAt);
  const undated = pool.filter(item => !item.publishedAt);
  // Preserve undated official reference candidates only when capacity remains. They do not fill the fresh-item target.
  const items = [...dated.slice(0, limit), ...undated.slice(0, Math.max(0, limit - dated.length))];
  const freshItemCount = items.filter(item => item.publishedAt).length;
  return {
    collectedAt: now.toISOString(), target: limit, maxAgeDays, sourcesAttempted: enabled.length,
    sourcesSucceeded: buckets.length, freshItemCount, undatedItemCount: items.length - freshItemCount,
    excludedByScopeCount: sourceStats.reduce((sum, item) => sum + item.excludedByScope, 0), sourceStats: sourceStats.sort((a, b) => a.sourceId.localeCompare(b.sourceId)),
    items, failures: failures.sort((a, b) => a.sourceId.localeCompare(b.sourceId)), shortfall: Math.max(0, limit - freshItemCount),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const options = {};
  let output = path.join(ROOT, 'work/blog-runs', new Date().toISOString().slice(0, 10), 'sources.json');
  for (let i = 0; i < args.length; i++) {
    const value = args[++i];
    if (!value) throw new Error('Each option requires a value');
    if (args[i - 1] === '--output') output = path.resolve(value);
    else if (args[i - 1] === '--limit') options.limit = Number(value);
    else if (args[i - 1] === '--max-age-days') options.maxAgeDays = Number(value);
    else throw new Error(`Unknown argument: ${args[i - 1]}`);
  }
  const result = await collectSources(options);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Collected ${result.freshItemCount} dated and ${result.undatedItemCount} undated items from ${result.sourcesSucceeded}/${result.sourcesAttempted} sources. Fresh-item shortfall: ${result.shortfall}. Saved ${output}`);
  if (!result.items.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
