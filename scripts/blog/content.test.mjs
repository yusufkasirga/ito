import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const loader = pathToFileURL(fileURLToPath(new URL('../../lib/blog-content.mjs', import.meta.url))).href;
const fixture = (locale = 'en') => ({
  schemaVersion: 1, id: 'one-topic', slug: 'one-topic', locale, status: 'published',
  title: 'A practical travel topic', excerpt: 'Useful context for a thoughtful journey.', category: 'Travel',
  cover: '/images/example.jpg', dateISO: '2026-10-24', readTime: '5 min',
  body: [{ type: 'p', text: 'A useful paragraph.' }], sources: [{ title: 'Official source', url: 'https://muze.gov.tr/' }],
  seo: { intent: 'planning', keywords: ['travel'], topicKey: 'planning-a-visit', uniqueValue: 'A comparison framework.' },
  quality: { score: 90, risk: 'low', factChecked: true, semanticReviewed: true, localizationReviewed: true, reviewNotes: 'Fact and localization checks completed.' },
});
function sandbox(records, code) {
  const root = mkdtempSync(path.join(tmpdir(), 'ito-content-test-'));
  try {
    for (const [folder, filename, article] of records) {
      const dir = path.join(root, 'content/blog', folder); mkdirSync(dir, { recursive: true });
      writeFileSync(path.join(dir, filename), JSON.stringify(article));
    }
    return execFileSync(process.execPath, ['--input-type=module', '-e', `import * as c from ${JSON.stringify(loader)}; ${code}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } finally { rmSync(root, { recursive: true, force: true }); }
}
test('an empty repository exposes no synthetic content', () => {
  assert.equal(sandbox([], 'console.log(c.getContentArticles().length)'), '0');
});
test('draft and review records remain private even when incomplete', () => {
  assert.equal(sandbox([['en', 'draft.json', { status: 'draft' }], ['en', 'review.json', { status: 'review' }]], 'console.log(c.getContentArticles().length)'), '0');
});
test('five language alternate paths point only to real published translations', () => {
  const records = ['en','de','zh-CN','ko','es'].map(locale => [locale === 'zh-CN' ? 'zh-cn' : locale, 'one-topic.json', fixture(locale)]);
  const languages = JSON.parse(sandbox(records, "console.log(JSON.stringify(c.getContentLanguages('one-topic')))"));
  assert.deepEqual(languages, { en: '/blog/one-topic', de: '/de/blog/one-topic', 'zh-CN': '/zh-cn/blog/one-topic', ko: '/ko/blog/one-topic', es: '/es/blog/one-topic' });
});
test('an unpublished translation never enters alternate links', () => {
  assert.deepEqual(JSON.parse(sandbox([['en','one-topic.json',fixture()], ['de','one-topic.json',{ ...fixture('de'), status: 'review' }]], "console.log(JSON.stringify(c.getContentLanguages('one-topic')))")), { en: '/blog/one-topic' });
});
test('invalid calendar dates and missing editorial reviews fail closed', () => {
  assert.throws(() => sandbox([['en','one-topic.json',{ ...fixture(), dateISO: '2026-02-30' }]], 'c.getContentArticles()'));
  const article = fixture(); article.quality.factChecked = false;
  assert.throws(() => sandbox([['en','one-topic.json',article]], 'c.getContentArticles()'));
});
test('filename identity and safe slug lookups prevent path traversal', () => {
  assert.throws(() => sandbox([['en','other-topic.json',fixture()]], 'c.getContentArticles()'));
  assert.equal(sandbox([['en','one-topic.json',fixture()]], "console.log(c.getContentArticle('en', '../one-topic') === undefined)"), 'true');
});
