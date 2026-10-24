import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { LOCALES, discoverInventory, getJsonRecords, istanbulDate, lexicalSimilarity, rankCandidates, validateRecords, publishBundle } from './pipeline.mjs';

const date = '2026-10-24';
const config = {
  timezone: 'Europe/Istanbul', targetSourceItems: 100, maxTopicsPerDay: 3,
  locales: LOCALES, minimumQualityScore: 85, minimumWords: { en: 10, de: 10, es: 10 },
  minimumCharacters: { 'zh-CN': 20, ko: 20 }, primaryDomains: ['goturkiye.com', 'unesco.org'],
};
const existing = { slug: 'existing', title: 'Existing historic city guide', locale: 'en', source: 'journal', body: [{ type: 'p', text: 'An existing article.' }] };
const knownRoutes = new Set(['/blog/existing', '/about']);
const sourceSet = [
  { title: 'Official visitor information', url: 'https://goturkiye.com/visitor-information', accessedISO: date },
  { title: 'Official heritage reference', url: 'https://unesco.org/heritage', accessedISO: date },
];

function bundle(slug = 'museum-walk', status = 'published') {
  return LOCALES.map((locale) => ({
    schemaVersion: 1, id: `article-${slug}`, slug, locale, status,
    title: `Planning a museum walk ${locale} ${slug}`, excerpt: 'Practical planning for a cultural visit.', category: 'Culture',
    cover: '/images/test.jpg', dateISO: date, readTime: '4 min',
    body: [{ type: 'h2', text: 'Plan time for a thoughtful visit' }, { type: 'p', text: 'Visitors can choose a comfortable route with time to explore the local streets carefully. Read the [existing guide](/blog/existing) and learn [about the team](/about) before planning the day.' }],
    sources: structuredClone(sourceSet), seo: { intent: 'Plan a cultural visit', keywords: ['museum', 'Türkiye'], topicKey: slug, uniqueValue: 'A practical sequence that helps visitors plan a calm cultural day.' },
    quality: { score: 92, factChecked: true, semanticReviewed: true, localizationReviewed: true, risk: 'low', reviewNotes: 'Checked against both official sources; practical suggestions and publication dates were reviewed individually for this article.' },
  }));
}

function evidence(slugs = ['museum-walk']) {
  return {
    schemaVersion: 1, date, sourceScan: { collectedAt: `${date}T06:00:00Z`, itemsInspected: 100, freshItems: 100, shortfall: 0 },
    decisions: slugs.map((slug) => ({ slug, topicKey: slug, decision: 'publish', intent: 'Plan a cultural visit',
      reason: 'This practical visitor question adds a distinct and useful planning perspective to the existing cultural content.',
      semanticReview: { reviewedSlugs: ['existing'], closestSlugs: ['existing'], whyDifferent: 'The existing article describes the historic city generally. This article focuses on sequencing a museum visit and offers a different practical decision for the reader.' },
      sourceUrls: sourceSet.map((source) => source.url),
    })), publishedSlugs: [], state: 'prepared',
  };
}

function validate(records, overrides = {}) {
  return validateRecords(records, { config, inventory: [existing], knownRoutes, review: evidence([...new Set(records.map((record) => record.slug))]), today: date, ...overrides });
}

function fixture(slugs = ['museum-walk']) {
  const root = mkdtempSync(path.join(tmpdir(), 'ito-publish-test-'));
  mkdirSync(path.join(root, 'public/images'), { recursive: true });
  writeFileSync(path.join(root, 'public/images/test.jpg'), 'fixture image');
  const folders = { en: 'en', de: 'de', 'zh-CN': 'zh-cn', ko: 'ko', es: 'es' };
  for (const slug of slugs) for (const record of bundle(slug, 'draft')) {
    const directory = path.join(root, 'content/blog', folders[record.locale]);
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, `${slug}.json`), `${JSON.stringify(record, null, 2)}\n`);
  }
  mkdirSync(path.join(root, 'docs/blog-runs'), { recursive: true });
  const reviewPath = path.join(root, 'docs/blog-runs', `${date}.json`);
  writeFileSync(reviewPath, `${JSON.stringify(evidence(slugs), null, 2)}\n`);
  return { root, reviewPath, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

test('Istanbul date follows the client timezone across the UTC day boundary', () => {
  assert.equal(istanbulDate(new Date('2026-10-23T21:30:00Z')), date);
});

test('ranker shortlists relevant primary travel sources and labels lexical overlap honestly', () => {
  const result = rankCandidates([
    { title: 'Istanbul museum visitor routes', summary: 'Türkiye heritage visits and museum travel planning', url: 'https://goturkiye.com/one', publishedAt: `${date}T05:00:00Z` },
    { title: 'Istanbul football transfer window', summary: 'Turkey sports betting', url: 'https://sports.example/one', publishedAt: date },
    { title: 'Paris museum visitor guide', summary: 'France cultural tourism', url: 'https://travel.example/paris', publishedAt: date },
    { title: 'Türkiye election campaign', summary: 'President and parliament tourism comments', url: 'https://news.example/election', publishedAt: date },
    { title: 'Türkiye heritage visitor guide', url: 'https://travel.example/future', publishedAt: '2027-01-01' },
  ], config, [existing], new Date(`${date}T10:00:00Z`));
  assert.equal(result.ranked.length, 1);
  assert.equal(result.rejected.length, 4);
  assert.equal(result.shortlist[0].requiresSemanticReview, true);
  assert.equal(result.semanticReviewRequired, true);
  assert.ok(result.shortlist[0].rankingFactors.primaryAuthority > 0);
  assert.ok(lexicalSimilarity('historic museum visit', 'historic museum tour') > 0);
});

test('official Turkish titles retain dotted-I and Turkish visitor/transport relevance', () => {
  const result = rankCandidates([
    { title: 'İstanbul müzeleri için ziyaret saatleri', summary: 'Türkiye kültür ve turizm haberleri, müze ziyaretine ilişkin duyuru.', url: 'https://goturkiye.com/muze', publishedAt: date },
    { title: 'İstanbul Havalimanı yolcu ulaşımı duyurusu', summary: 'Yeni tren ve otobüs seferleri hakkında bilgi.', url: 'https://goturkiye.com/ulasim', publishedAt: date },
  ], config, [], new Date(`${date}T10:00:00Z`));
  assert.equal(result.ranked.length, 2);
  assert.equal(result.rejected.length, 0);
});

test('tracking parameters and page fragments do not fabricate a second source', () => {
  const records = bundle();
  for (const record of records) record.sources = [
    { title: 'First section', url: 'https://goturkiye.com/page#one', accessedISO: date },
    { title: 'Same source with tracking', url: 'https://goturkiye.com/page?utm_source=feed#two', accessedISO: date },
  ];
  assert.match(validate(records).errors.join('\n'), /two distinct HTTPS sources/);
});

test('inventory transcribes legacy TS arrays without losing their full bodies', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ito-inventory-test-'));
  try {
    mkdirSync(path.join(root, 'app/blog'), { recursive: true });
    mkdirSync(path.join(root, 'app/blogs'), { recursive: true });
    writeFileSync(path.join(root, 'app/blog/blogPosts.ts'), "export const blogArticles = [{slug:'journal',title:'Journal',body:[{type:'p',text:'Complete original text.'}]}];");
    writeFileSync(path.join(root, 'app/blogs/blogData.ts'), "export const blogPosts = [{slug:'guide',title:'Guide',content:['## Heading','Complete original guide.']}];");
    writeFileSync(path.join(root, 'app/blogs/blogDataDe.ts'), "export const blogPostsDe = [{slug:'guide',title:'Ratgeber',content:['Vollständiger deutscher Text.']}];");
    const inventory = discoverInventory(root);
    assert.equal(inventory.filter((article) => article.locale === 'en').length, 2);
    assert.equal(inventory.find((article) => article.slug === 'journal').body[0].text, 'Complete original text.');
    assert.equal(inventory.find((article) => article.title === 'Guide').content[1], 'Complete original guide.');
    assert.equal(inventory.find((article) => article.locale === 'de').body[0].text, 'Vollständiger deutscher Text.');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('complete bundles pass while draft and review records remain private by default', () => {
  assert.equal(validate(bundle()).valid, true);
  assert.equal(validate([{ status: 'draft' }, { status: 'review' }]).valid, true);
  assert.equal(validate([{ status: 'draft' }], { includeDrafts: true }).valid, false);
});

test('publication rejects incomplete locales, mismatched identities and inconsistent source sets', () => {
  assert.match(validate(bundle().slice(0, 4)).errors.join('\n'), /complete five-locale/);
  const records = bundle(); records[1].id = 'wrong-id'; records[2].sources.pop();
  const result = validate(records);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /identity/);
  assert.match(result.errors.join('\n'), /source URL sets/);
});

test('recorded review must cover every existing English article and matching source URLs', () => {
  assert.match(validate(bundle(), { review: undefined }).errors.join('\n'), /review evidence/);
  const review = evidence(); review.decisions[0].semanticReview.reviewedSlugs = [];
  assert.match(validate(bundle(), { review }).errors.join('\n'), /semantic review/);
  const mismatched = evidence(); mismatched.decisions[0].sourceUrls = ['https://example.com/unread'];
  assert.match(validate(bundle(), { review: mismatched }).errors.join('\n'), /review source URLs/);
});

test('sensitive claims, active scripts, unknown links and fabricated future source dates block publication', () => {
  const records = bundle();
  records[0].title = 'Dental implant treatment options';
  records[1].body.push({ type: 'p', text: '<script>alert(1)</script>' });
  records[2].body.push({ type: 'p', text: '[Invented](/blog/missing-article)' });
  records[3].sources[0].publishedISO = '2027-01-01';
  const errors = validate(records).errors.join('\n');
  assert.match(errors, /sensitive clinical/);
  assert.match(errors, /raw active scripts/);
  assert.match(errors, /dangling internal link/);
  assert.match(errors, /source publication date/);
});

test('duplicate topics and the three-master daily quota are enforced', () => {
  const records = ['a', 'b', 'c', 'd'].flatMap((slug) => bundle(slug));
  assert.match(validate(records).errors.join('\n'), /daily topic limit/);
  const duplicate = bundle('existing');
  assert.match(validate(duplicate).errors.join('\n'), /slug already exists/);
});

test('publication promotes all five files with a ledger and reruns without changes', () => {
  const data = fixture();
  try {
    const options = { ...data, date, slugs: ['museum-walk'], config, inventory: [existing], knownRoutes, today: date };
    assert.equal(publishBundle(options).idempotent, false);
    assert.ok(getJsonRecords(data.root).every((article) => article.status === 'published'));
    const original = readFileSync(data.reviewPath, 'utf8');
    assert.deepEqual(JSON.parse(original).publishedSlugs, ['museum-walk']);
    assert.equal(JSON.parse(original).state, 'prepared');
    assert.equal(publishBundle({ ...options, inventory: [existing, ...discoverInventory(data.root)] }).idempotent, true);
    assert.equal(readFileSync(data.reviewPath, 'utf8'), original);
    assert.equal(existsSync(path.join(data.root, '.blog-publish.lock')), false);
  } finally { data.cleanup(); }
});

test('failure after writing locale files rolls every file and the ledger back', () => {
  const data = fixture();
  try {
    const originals = getJsonRecords(data.root).map((article) => [article._file, readFileSync(article._file, 'utf8')]);
    const ledger = readFileSync(data.reviewPath, 'utf8');
    let writes = 0;
    assert.throws(() => publishBundle({ ...data, date, slugs: ['museum-walk'], config, inventory: [existing], knownRoutes, today: date,
      writeFile(filename, content) { if (++writes === 3) throw new Error('Simulated disk failure'); writeFileSync(filename, content); },
    }), /Simulated disk failure/);
    for (const [filename, content] of originals) assert.equal(readFileSync(filename, 'utf8'), content);
    assert.equal(readFileSync(data.reviewPath, 'utf8'), ledger);
    assert.equal(existsSync(path.join(data.root, '.blog-publish.lock')), false);
  } finally { data.cleanup(); }
});

test('an invalid review cannot mutate content or the ledger', () => {
  const data = fixture();
  try {
    const review = JSON.parse(readFileSync(data.reviewPath, 'utf8')); review.decisions = [];
    writeFileSync(data.reviewPath, JSON.stringify(review));
    const before = readFileSync(data.reviewPath, 'utf8');
    assert.throws(() => publishBundle({ ...data, date, slugs: ['museum-walk'], config, inventory: [existing], knownRoutes, today: date }), /Publication gates failed/);
    assert.ok(getJsonRecords(data.root).every((article) => article.status === 'draft'));
    assert.equal(readFileSync(data.reviewPath, 'utf8'), before);
  } finally { data.cleanup(); }
});

test('a second batch cannot exceed the day quota', () => {
  const data = fixture(['a', 'b', 'c', 'd']);
  try {
    const options = { ...data, date, config, inventory: [existing], knownRoutes, today: date };
    publishBundle({ ...options, slugs: ['a'] });
    assert.throws(() => publishBundle({ ...options, inventory: [existing, ...discoverInventory(data.root)], slugs: ['b', 'c', 'd'] }), /daily topic limit/);
    assert.equal(getJsonRecords(data.root).filter((article) => article.status === 'published').length, 5);
  } finally { data.cleanup(); }
});

test('complete selected bundles may link to each other while nonselected drafts stay unavailable', () => {
  const records = ['a', 'b', 'c'].flatMap((slug) => bundle(slug));
  const folders = { en: '', de: '/de', 'zh-CN': '/zh-cn', ko: '/ko', es: '/es' };
  for (const record of records) {
    const other = ['a', 'b', 'c'].filter((slug) => slug !== record.slug);
    record.body[1].text = `Visitors can plan a careful route using the [first guide](${folders[record.locale]}/blog/${other[0]}) and the [second guide](${folders[record.locale]}/blog/${other[1]}).`;
  }
  assert.equal(validate(records).valid, true);
  assert.match(validate(records.filter((record) => record.slug !== 'c')).errors.join('\n'), /dangling internal link/);
});

test('publish cannot borrow crosslinks from unselected draft files on disk', () => {
  const data = fixture(['a', 'b', 'c']);
  try {
    for (const record of getJsonRecords(data.root).filter((article) => article.slug === 'a')) {
      const prefix = record.locale === 'en' ? '' : `/${record.locale === 'zh-CN' ? 'zh-cn' : record.locale}`;
      const { _file, _localeFolder, ...article } = record;
      void _localeFolder;
      article.body[1].text = `Visitors can plan a careful route using the [first guide](${prefix}/blog/b) and the [second guide](${prefix}/blog/c).`;
      writeFileSync(_file, JSON.stringify(article));
    }
    assert.throws(() => publishBundle({ ...data, date, slugs: ['a'], config, inventory: [existing], knownRoutes, today: date }), /dangling internal link/);
    assert.ok(getJsonRecords(data.root).every((article) => article.status === 'draft'));
    assert.deepEqual(JSON.parse(readFileSync(data.reviewPath, 'utf8')).publishedSlugs, []);
  } finally { data.cleanup(); }
});
