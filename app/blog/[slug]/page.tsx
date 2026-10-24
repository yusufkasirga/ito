import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/config';
import { blogEntries, getBlogAlternates, getBlogEntry } from '../blogCatalog';
import JournalBlogArticle from '../JournalBlogArticle';
import LegacyBlogArticle from '../LegacyBlogArticle';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogEntries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getBlogEntry(slug);
  if (!entry) notFound();
  const authorName = entry.author?.name ?? 'Itinerary of Türkiye';
  const image = new URL(entry.cover, SITE_URL).toString();
  return {
    title: `${entry.title} — Itinerary of Türkiye`,
    description: entry.excerpt,
    authors: [{ name: authorName, url: new URL(entry.author?.url ?? '/about', SITE_URL).toString() }],
    alternates: getBlogAlternates(slug),
    openGraph: {
      title: entry.title,
      description: entry.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: 'Itinerary of Türkiye',
      type: 'article',
      locale: 'en_US',
      publishedTime: entry.dateISO,
      modifiedTime: entry.updatedISO ?? entry.dateISO,
      authors: [authorName],
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: entry.title, description: entry.excerpt, images: [image] },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = getBlogEntry(slug);
  if (!entry) notFound();
  return entry.source === 'journal'
    ? <JournalBlogArticle slug={slug} />
    : <LegacyBlogArticle slug={slug} />;
}
