import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Owner-supplied evergreen library (English only): content/library/<slug>.json.
 * Separate from the automated multilingual news pipeline in content/blog, which keeps its own gates.
 * `plannedPath` decides the public URL: /blog/<slug>, /services/<slug> or /destinations/<slug>.
 */
const root = path.join(process.cwd(), 'content', 'library');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v ?? '') && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
const nonempty = (v) => typeof v === 'string' && v.trim().length > 0;
export const LIBRARY_SECTIONS = ['blog', 'services', 'destinations'];
const BLOCKS = ['h2', 'h3', 'p', 'ul', 'table', 'figure'];

export function libraryProblems(article, filename) {
  const problems = [];
  const fail = (m) => problems.push(`${filename}: ${m}`);
  if (article.schemaVersion !== 1) fail('schemaVersion must be 1');
  if (!slugPattern.test(article.slug ?? '') || filename !== `${article.slug}.json`) fail('filename must match a safe slug');
  const section = librarySection(article);
  if (!section || article.plannedPath !== `/${section}/${article.slug}`) fail('plannedPath must be /blog|/services|/destinations/<slug>');
  for (const key of ['id', 'title', 'seoTitle', 'metaDescription', 'quickAnswer', 'category', 'readTime']) if (!nonempty(article[key])) fail(`${key} is required`);
  if ((article.seoTitle ?? '').length > 60) fail('seoTitle must be at most 60 characters');
  if ((article.metaDescription ?? '').length > 150) fail('metaDescription must be at most 150 characters');
  if (!isDate(article.dateISO) || (article.updatedISO && !isDate(article.updatedISO))) fail('dates must be real YYYY-MM-DD values');
  if (article.cover && (!article.cover.startsWith('/') || article.cover.startsWith('//') || article.cover.includes('..'))) fail('cover must be a local public path');
  if (!Array.isArray(article.body) || !article.body.length) fail('body is required');
  for (const block of article.body ?? []) {
    if (!block || !BLOCKS.includes(block.type)) { fail(`unsupported block ${block?.type}`); continue; }
    if (block.type === 'ul' && !(Array.isArray(block.items) && block.items.length && block.items.every(nonempty))) fail('list items are required');
    if (block.type === 'table' && !(Array.isArray(block.head) && Array.isArray(block.rows))) fail('table needs head and rows');
    if (block.type === 'figure' && !(nonempty(block.src) && nonempty(block.alt))) fail('figure needs src and alt');
    if (['h2', 'h3', 'p'].includes(block.type) && !nonempty(block.text)) fail('text is required');
  }
  if (!Array.isArray(article.faq) || article.faq.length !== 6 || !article.faq.every((f) => nonempty(f.q) && nonempty(f.a))) fail('exactly 6 FAQ items are required');
  for (const image of article.images ?? []) if (!nonempty(image.src) || !nonempty(image.alt)) fail('each image needs src and alt');
  let active = false;
  JSON.stringify(article, (k, v) => { if (typeof v === 'string' && /<\s*\/?\s*(?:script|iframe|object|embed|style)\b|javascript\s*:/i.test(v)) active = true; return v; });
  if (active) fail('raw scripts/HTML are forbidden');
  return problems;
}

export function librarySection(article) {
  const section = String(article.plannedPath ?? '').split('/')[1];
  return LIBRARY_SECTIONS.includes(section) ? section : undefined;
}

let cache;
export function getLibraryArticles(section) {
  if (!cache) {
    cache = [];
    if (existsSync(root)) {
      for (const filename of readdirSync(root).filter((n) => n.endsWith('.json')).sort()) {
        const article = JSON.parse(readFileSync(path.join(root, filename), 'utf8'));
        if (article.status !== 'published') continue;
        const problems = libraryProblems(article, filename);
        if (problems.length) throw new Error(`Invalid library article: ${problems.join('; ')}`);
        cache.push(article);
      }
      cache.sort((a, b) => b.dateISO.localeCompare(a.dateISO) || a.slug.localeCompare(b.slug));
    }
  }
  return section ? cache.filter((a) => librarySection(a) === section) : cache;
}

export function getLibraryArticle(section, slug) {
  return getLibraryArticles(section).find((a) => a.slug === slug);
}
