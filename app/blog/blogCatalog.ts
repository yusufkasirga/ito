import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import { BLOG_SLUG_ALIASES, getCanonicalBlogSlug } from '@/lib/blog-aliases.mjs';
import { CONTENT_LOCALES, CONTENT_LOCALE_PATHS, getContentArticles, type ContentArticle, type ContentLocale } from '@/lib/blog-content.mjs';
import { blogArticles, type BlogAuthor } from './blogPosts';
import { blogPosts } from '../blogs/blogData';
import { blogPostsDe } from '../blogs/blogDataDe';

/** Shared listing metadata; each source keeps its full, original article body. */
export type BlogEntry = {
  source: 'journal' | 'guide' | 'content';
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  cover: string;
  primaryImage: string;
  accent: string;
  dateISO: string;
  updatedISO?: string;
  readTime: string;
  author?: BlogAuthor;
  locale?: ContentLocale;
};

const legacyEnglishEntries: BlogEntry[] = [
  ...blogArticles.map((article): BlogEntry => ({
    source: 'journal',
    slug: article.slug,
    title: article.title,
    category: article.category,
    excerpt: article.excerpt,
    cover: article.cover,
    primaryImage: `/images/blog/${article.slug}.jpg`,
    accent: article.accent,
    dateISO: article.dateISO,
    updatedISO: article.updatedISO,
    readTime: article.readTime,
    author: article.author,
  })),
  ...blogPosts.map((post): BlogEntry => ({
    source: 'guide',
    slug: post.slug,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    cover: post.coverImage,
    primaryImage: post.coverImage,
    accent: '#10243a',
    dateISO: post.dateISO,
    updatedISO: post.updatedISO,
    readTime: post.readTime,
  })),
];

function contentEntry(article: ContentArticle): BlogEntry {
  return {
    source: 'content', locale: article.locale, slug: article.slug, title: article.title,
    category: article.category, excerpt: article.excerpt, cover: article.cover,
    primaryImage: article.cover, accent: '#10243a', dateISO: article.dateISO,
    updatedISO: article.updatedISO, readTime: article.readTime, author: article.author,
  };
}

const entriesByLocale = new Map<ContentLocale, BlogEntry[]>();
const contentByLocale = new Map(CONTENT_LOCALES.map((locale) => [locale, getContentArticles(locale)]));
for (const locale of CONTENT_LOCALES) {
  const legacyEntries: BlogEntry[] = locale === 'en' ? legacyEnglishEntries : locale === 'de'
    ? blogPostsDe.map((post) => ({
      source: 'guide', slug: post.slug, title: post.title, category: post.category, excerpt: post.excerpt,
      cover: post.coverImage, primaryImage: post.coverImage, accent: '#10243a', locale,
      dateISO: post.dateISO, updatedISO: post.updatedISO, readTime: post.readTime,
    })) : [];
  const entries = [...legacyEntries, ...(contentByLocale.get(locale) ?? []).map(contentEntry)];
  const slugs = new Set<string>();
  for (const entry of entries) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate blog slug in ${locale}: ${entry.slug}. Give each article a unique URL.`);
    slugs.add(entry.slug);
  }
  const aliases = BLOG_SLUG_ALIASES.filter((alias) => alias.locale === locale);
  for (const alias of aliases) {
    if (!slugs.has(alias.slug) || !slugs.has(alias.canonicalSlug)) {
      throw new Error(`Blog alias in ${locale} must preserve its source and canonical target: ${alias.slug}`);
    }
    if (getCanonicalBlogSlug(alias.canonicalSlug, locale) !== alias.canonicalSlug) {
      throw new Error(`Blog alias chains are not allowed: ${locale}/${alias.slug}`);
    }
  }
  const canonicalEntries = entries.filter((entry) => getCanonicalBlogSlug(entry.slug, locale) === entry.slug);
  entriesByLocale.set(locale, canonicalEntries
    .map((entry, insertionOrder) => ({ entry, insertionOrder }))
    .sort((a, b) => b.entry.dateISO.localeCompare(a.entry.dateISO) || b.insertionOrder - a.insertionOrder)
    .map(({ entry }) => entry));
}

// Translations share the English slug and identity; no placeholder or orphan routes.
for (const locale of CONTENT_LOCALES.filter((value) => value !== 'en')) {
  for (const article of contentByLocale.get(locale) ?? []) {
    if (!entriesByLocale.get('en')?.some((entry) => entry.slug === article.slug)) {
      throw new Error(`Published ${locale} article has no English counterpart: ${article.slug}`);
    }
    const master = contentByLocale.get('en')?.find((entry) => entry.slug === article.slug);
    if (master && master.id !== article.id) throw new Error(`Translation ID must match English: ${locale}/${article.slug}`);
  }
}

export const blogEntries = entriesByLocale.get('en')!;
export const blogLocales = CONTENT_LOCALES;

export function getBlogEntries(locale: ContentLocale = 'en') {
  return entriesByLocale.get(locale) ?? [];
}

export function getBlogEntry(slug: string, locale: ContentLocale = 'en') {
  return getBlogEntries(locale).find((entry) => entry.slug === slug);
}

export function getBlogContentArticle(locale: ContentLocale, slug: string) {
  return contentByLocale.get(locale)?.find((entry) => entry.slug === slug);
}

export function blogPath(locale: ContentLocale = 'en', slug = '') {
  return `${CONTENT_LOCALE_PATHS[locale] ? `/${CONTENT_LOCALE_PATHS[locale]}` : ''}/blog${slug ? `/${slug}` : ''}`;
}

export function localeFromPath(value: string): ContentLocale | undefined {
  return CONTENT_LOCALES.find((locale) => CONTENT_LOCALE_PATHS[locale] === value);
}

export function getBlogLanguages(slug = ''): Record<string, string> {
  const canonicalSlug = getCanonicalBlogSlug(slug);
  const languages: Record<string, string> = {};
  for (const locale of CONTENT_LOCALES) {
    if (canonicalSlug ? getBlogEntry(canonicalSlug, locale) : getBlogEntries(locale).length) languages[locale] = `${SITE_URL}${blogPath(locale, canonicalSlug)}`;
  }
  if (languages.en) languages['x-default'] = languages.en;
  return languages;
}

export function getBlogAlternates(slug: string, locale: ContentLocale = 'en'): Metadata['alternates'] {
  const canonicalSlug = getCanonicalBlogSlug(slug, locale);
  return {
    canonical: `${SITE_URL}${blogPath(locale, canonicalSlug)}`,
    languages: getBlogLanguages(canonicalSlug),
  };
}

export function getBlogIndexAlternates(locale: ContentLocale = 'en'): Metadata['alternates'] {
  return { canonical: `${SITE_URL}${blogPath(locale)}`, languages: getBlogLanguages() };
}
