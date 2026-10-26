import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import * as aliases from '../../lib/blog-aliases.mjs';
import * as content from '../../lib/blog-content.mjs';
import { discoverInventory } from './pipeline.mjs';

// Load the production TypeScript catalog/config without relying on Next's build output.
const root = process.cwd();
const cache = new Map();
function loadTs(relative) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const require = (specifier) => {
    if (specifier.endsWith('/blog-aliases.mjs') || specifier === './lib/blog-aliases.mjs') return aliases;
    if (specifier === '@/lib/blog-content.mjs') return content;
    const target = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
    const resolved = [target, `${target}.ts`, `${target}.tsx`].find(existsSync);
    if (!resolved) throw new Error(`Unexpected catalog dependency: ${specifier}`);
    return loadTs(resolved);
  };
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), { fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new vm.Script(code, { filename }).runInNewContext({ exports, require, URL, process: { env: {} } }, { timeout: 1500 });
  return exports;
}
const catalog = loadTs('app/blog/blogCatalog.ts');
const inventory = discoverInventory(root);
const canonical = (slug, locale = 'en') => catalog.getBlogEntry(slug, locale);
const normalize = (value) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const blockText = (block) => block.text ?? block.items?.join('\n') ?? '';

test('reviewed aliases preserve the whole original body and choose the richer same-title guide', () => {
  assert.equal(aliases.BLOG_SLUG_ALIASES.length, 8);
  for (const alias of aliases.BLOG_SLUG_ALIASES) {
    const source = inventory.find((entry) => entry.locale === alias.locale && entry.slug === alias.slug);
    const target = inventory.find((entry) => entry.locale === alias.locale && entry.slug === alias.canonicalSlug);
    assert.ok(source, `Original data remains available: ${alias.slug}`);
    assert.ok(target, `Canonical data exists: ${alias.canonicalSlug}`);
    assert.equal(source.source, 'journal');
    assert.equal(target.source, 'guide');
    assert.equal(normalize(source.title), normalize(target.title));
    const targetBlocks = new Set(target.body.map((block) => normalize(blockText(block))));
    for (const block of source.body) assert.ok(targetBlocks.has(normalize(blockText(block))), `Canonical must retain the body of ${alias.slug}`);
    assert.ok(target.faq.length >= 2, `Canonical keeps the added FAQs: ${alias.canonicalSlug}`);
    assert.ok(canonical(alias.canonicalSlug, alias.locale));
    assert.equal(aliases.getCanonicalBlogSlug(alias.canonicalSlug, alias.locale), alias.canonicalSlug, 'No redirect chains');
  }
});

test('every original and JSON record has exactly one public entry or an explicit retained alias', () => {
  for (const locale of catalog.blogLocales) {
    const original = inventory.filter((entry) => entry.locale === locale);
    const publicEntries = catalog.getBlogEntries(locale);
    const hiddenAliases = aliases.BLOG_SLUG_ALIASES.filter((alias) => alias.locale === locale);
    assert.equal(publicEntries.length + hiddenAliases.length, original.length);
    assert.equal(new Set(publicEntries.map((entry) => entry.slug)).size, publicEntries.length);
    for (const entry of original) {
      assert.ok(canonical(entry.slug, locale) || hiddenAliases.some((alias) => alias.slug === entry.slug));
    }
    for (const alias of hiddenAliases) assert.equal(canonical(alias.slug, locale), undefined);
  }
  assert.equal(catalog.blogEntries, catalog.getBlogEntries('en'), 'Home and journal use the same canonical list');
});

test('the actual redirect config sends both /blog and /blogs aliases directly to canonical guides', async () => {
  const redirects = await loadTs('next.config.ts').default.redirects();
  const seen = new Set();
  for (const alias of aliases.BLOG_SLUG_ALIASES) {
    for (const segment of ['blog', 'blogs']) {
      const source = `/${segment}/${alias.slug}`;
      const rule = redirects.find((entry) => entry.source === source);
      assert.ok(rule, source);
      assert.equal(rule.destination, `/blog/${alias.canonicalSlug}`);
      assert.equal(rule.permanent, true);
      assert.ok(redirects.indexOf(rule) < redirects.findIndex((entry) => entry.source === '/blogs/:path*'));
      assert.ok(!seen.has(source));
      seen.add(source);
      assert.ok(!redirects.some((entry) => entry.source === `/de/${segment}/${alias.slug}`), 'No German alias without actual German content');
    }
  }
  assert.equal(redirects.find((entry) => entry.source === '/de/blogs/:path*').destination, '/de/blog/:path*');
});

test('sitemap and alternate metadata contain canonical URLs and only real translation pairs', () => {
  const pages = loadTs('app/sitemap.ts').default();
  const urls = new Set(pages.map((page) => page.url));
  assert.equal(urls.size, pages.length);
  for (const alias of aliases.BLOG_SLUG_ALIASES) {
    const expected = `https://itineraryofturkiye.com/blog/${alias.canonicalSlug}`;
    assert.ok(urls.has(expected));
    assert.ok(!urls.has(`https://itineraryofturkiye.com/blog/${alias.slug}`));
    assert.equal(catalog.getBlogAlternates(alias.slug).canonical, expected);
    assert.equal(catalog.getBlogAlternates(alias.canonicalSlug).canonical, expected);
    assert.deepEqual(Object.keys(catalog.getBlogLanguages(alias.slug)).sort(), ['en', 'x-default']);
  }
  for (const page of pages) {
    assert.ok(!page.url.includes('/blogs/'));
    if (!page.url.includes('/blog/')) continue;
    for (const alternate of Object.values(page.alternates.languages)) assert.ok(urls.has(alternate), alternate);
  }
  const translated = 'hair-transplant-turkey-cost-guide-2026';
  assert.equal(catalog.getBlogLanguages(translated).de, `https://itineraryofturkiye.com/de/blog/${translated}`);
  assert.equal(catalog.getBlogAlternates(translated, 'de').canonical, `https://itineraryofturkiye.com/de/blog/${translated}`);
});

test('distinct procedure, cost, recovery, property and dated news intents remain separate', () => {
  for (const slug of [
    'hollywood-smile-turkey-process-cost-2026', 'dental-veneers-implants-turkey-cost-guide-2026',
    'hair-transplant-turkey-cost-guide-2026', 'how-to-choose-hair-transplant-clinic-istanbul',
    'hair-transplant-aftercare-first-30-days', 'hair-transplant-recovery-timeline',
    'buying-property-turkey-foreigner-guide', 'istanbul-vs-antalya-property-foreign-buyers',
    'is-turkey-safe-2026', 'is-turkiye-safe-to-visit-2026',
    'turkiye-tourism-2026', 'turkiye-tourism-2026-2027-government-initiatives',
  ]) {
    assert.ok(canonical(slug), slug);
    assert.equal(aliases.getCanonicalBlogSlug(slug), slug);
  }
});
