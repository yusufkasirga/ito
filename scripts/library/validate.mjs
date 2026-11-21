#!/usr/bin/env node
// Validates content/library/*.json (owner-supplied English library) before every build.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { libraryProblems, librarySection } from '../../lib/library-content.mjs';

const root = process.cwd();
const dir = path.join(root, 'content', 'library');
const files = existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.json')).sort() : [];
const destinationSource = readFileSync(path.join(root, 'app', 'destinations', 'destinationData.ts'), 'utf8');
const destinationSlugs = new Set([...destinationSource.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]));
const blogSlugs = new Set(readdirSync(path.join(root, 'content', 'blog', 'en')).map((n) => n.replace(/\.json$/, '')));
const errors = [], warnings = [];
const ids = new Set(), titles = new Set();
for (const filename of files) {
  const article = JSON.parse(readFileSync(path.join(dir, filename), 'utf8'));
  if (article.status !== 'published') continue;
  errors.push(...libraryProblems(article, filename));
  if (ids.has(article.id)) errors.push(`${filename}: duplicate id`);
  ids.add(article.id);
  const t = article.title?.toLowerCase();
  if (titles.has(t)) errors.push(`${filename}: duplicate title`);
  titles.add(t);
  const section = librarySection(article);
  if (section === 'destinations' && destinationSlugs.has(article.slug)) errors.push(`${filename}: slug collides with an existing destination page`);
  if (section === 'blog' && blogSlugs.has(article.slug)) errors.push(`${filename}: slug collides with content/blog`);
  if (article.cover && !existsSync(path.join(root, 'public', article.cover.slice(1)))) errors.push(`${filename}: cover file missing (${article.cover})`);
  for (const image of article.images ?? []) if (!existsSync(path.join(root, 'public', image.src.slice(1)))) errors.push(`${filename}: image missing (${image.src})`);
  if (/og-image|logo|banner/i.test(article.cover ?? '')) errors.push(`${filename}: cover must be a photo, not a branded/text image`);
  if (!article.cover) warnings.push(`${filename}: no cover yet`);
  if ((article.sources ?? []).length < 2) warnings.push(`${filename}: fewer than 2 external sources`);
}
for (const w of warnings.slice(0, 10)) console.warn(`warn  ${w}`);
if (warnings.length > 10) console.warn(`warn  …and ${warnings.length - 10} more warnings`);
if (errors.length) { for (const e of errors) console.error(`error ${e}`); process.exit(1); }
console.log(`library: ${files.length} articles valid`);
