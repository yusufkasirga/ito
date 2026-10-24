import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import { blogArticles, type BlogAuthor } from './blogPosts';
import { blogPosts } from '../blogs/blogData';
import { getPostBySlugDe } from '../blogs/blogDataDe';

/** Shared listing metadata; each source keeps its full, original article body. */
export type BlogEntry = {
  source: 'journal' | 'guide';
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
};

const entries: BlogEntry[] = [
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

const entriesBySlug = new Map<string, BlogEntry>();
for (const entry of entries) {
  if (entriesBySlug.has(entry.slug)) {
    throw new Error(`Duplicate blog slug: ${entry.slug}. Give each article a unique URL.`);
  }
  entriesBySlug.set(entry.slug, entry);
}

// Preserve the Journal's insertion order for equal dates, then sort newest first.
export const blogEntries = entries
  .map((entry, insertionOrder) => ({ entry, insertionOrder }))
  .sort((a, b) => b.entry.dateISO.localeCompare(a.entry.dateISO) || b.insertionOrder - a.insertionOrder)
  .map(({ entry }) => entry);

export function getBlogEntry(slug: string) {
  return entriesBySlug.get(slug);
}

export function getBlogAlternates(slug: string): Metadata['alternates'] {
  const en = `${SITE_URL}/blog/${slug}`;
  return {
    canonical: en,
    languages: {
      en,
      ...(getPostBySlugDe(slug) ? { de: `${SITE_URL}/de/blog/${slug}` } : {}),
      'x-default': en,
    },
  };
}
