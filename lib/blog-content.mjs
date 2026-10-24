import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const CONTENT_LOCALES = ['en', 'de', 'zh-CN', 'ko', 'es'];
export const CONTENT_LOCALE_PATHS = { en: '', de: 'de', 'zh-CN': 'zh-cn', ko: 'ko', es: 'es' };
const root = path.join(process.cwd(), 'content', 'blog');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
const isDate = (value) => {
  if (!datePattern.test(value ?? '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const isWebUrl = (value) => {
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
};

/** Validate public records at the content boundary; drafts remain private. */
function validatePublished(article, locale, filename) {
  const fail = (message) => { throw new Error(`Invalid published blog content (${locale}/${filename}): ${message}`); };
  if (article.schemaVersion !== 1 || article.locale !== locale) fail('schemaVersion or locale does not match');
  if (!slugPattern.test(article.slug ?? '') || filename !== `${article.slug}.json`) fail('filename must match a safe slug');
  for (const key of ['id', 'title', 'excerpt', 'category', 'cover', 'readTime']) if (!nonempty(article[key])) fail(`${key} is required`);
  if (!(article.cover.startsWith('/') && !article.cover.startsWith('//')) && !isWebUrl(article.cover)) fail('cover must be a local path or web URL');
  if (!isDate(article.dateISO) || (article.updatedISO && !isDate(article.updatedISO))) fail('dates must be real YYYY-MM-DD values');
  if (!Array.isArray(article.body) || article.body.length === 0) fail('body is required');
  for (const block of article.body) {
    if (!block || !['h2', 'p', 'ul'].includes(block.type)) fail('unsupported body block');
    if (block.type === 'ul') {
      if (!Array.isArray(block.items) || !block.items.length || !block.items.every(nonempty)) fail('list items are required');
    } else if (!nonempty(block.text)) fail('body text is required');
  }
  if (!Array.isArray(article.sources) || article.sources.length === 0) fail('sources are required');
  for (const source of article.sources) {
    if (!nonempty(source.title) || !isWebUrl(source.url)) fail('each source needs a title and web URL');
    if (source.accessedISO && !isDate(source.accessedISO)) fail('source accessedISO must be a real date');
  }
  const seo = article.seo;
  if (!seo || !['intent', 'topicKey', 'uniqueValue'].every((key) => nonempty(seo[key])) || !Array.isArray(seo.keywords) || !seo.keywords.length || !seo.keywords.every(nonempty)) fail('SEO fields are required');
  const quality = article.quality;
  if (!quality || !Number.isFinite(quality.score) || quality.score < 0 || quality.score > 100 || !['low', 'sensitive'].includes(quality.risk) || !nonempty(quality.reviewNotes)) fail('quality review is required');
  if (![quality.factChecked, quality.semanticReviewed, quality.localizationReviewed].every((value) => value === true)) fail('all editorial reviews must pass before publication');
  if (article.author && (!nonempty(article.author.name) || !nonempty(article.author.url) || (article.author.type && !['Person', 'Organization'].includes(article.author.type)))) fail('invalid author');
}

export function getContentArticles(locale = 'en') {
  if (!CONTENT_LOCALES.includes(locale)) return [];
  const directory = path.join(root, CONTENT_LOCALE_PATHS[locale] || 'en');
  if (!existsSync(directory)) return [];
  const articles = [];
  const ids = new Set();
  for (const filename of readdirSync(directory).filter((name) => name.endsWith('.json')).sort()) {
    const article = JSON.parse(readFileSync(path.join(directory, filename), 'utf8'));
    if (article.status !== 'published') continue;
    validatePublished(article, locale, filename);
    if (ids.has(article.id)) throw new Error(`Duplicate published blog ID in ${locale}: ${article.id}`);
    ids.add(article.id);
    articles.push(article);
  }
  return articles.sort((a, b) => b.dateISO.localeCompare(a.dateISO) || a.slug.localeCompare(b.slug));
}

export function getContentArticle(locale, slug) {
  if (!slugPattern.test(slug ?? '')) return undefined;
  return getContentArticles(locale).find((article) => article.slug === slug);
}

/** JSON-only alternates. The application catalog also adds existing EN/DE articles. */
export function getContentLanguages(slug) {
  return Object.fromEntries(CONTENT_LOCALES.flatMap((locale) => getContentArticle(locale, slug)
    ? [[locale, `${CONTENT_LOCALE_PATHS[locale] ? `/${CONTENT_LOCALE_PATHS[locale]}` : ''}/blog/${slug}`]] : []));
}
