import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlugDe as getPostBySlug } from '../../../blogs/blogDataDe';
import { getBlogAlternates, getBlogEntries, getBlogContentArticle } from '../../../blog/blogCatalog';
import ContentBlogArticle from '../../../blog/ContentBlogArticle';
import { contentMetadata } from '../../../blog/contentPresentation';
import { GuideArticle } from '../../../blog/LegacyBlogArticle';

const SITE_URL = 'https://itineraryofturkiye.com';

// Tüm blog yazıları build sırasında statik üretilir (SEO + hız)
export function generateStaticParams() {
  return getBlogEntries('de').map((p) => ({ slug: p.slug }));
}

// Her yazı için başlık, açıklama ve OG/Twitter kartları
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const content = getBlogContentArticle('de', slug);
  if (content) return contentMetadata(content);
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return {
    title: `${post.title} — Itinerary of Türkiye`,
    description: post.excerpt,
    alternates: getBlogAlternates(post.slug, 'de'),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/de/blog/${post.slug}`,
      siteName: 'Itinerary of Türkiye',
      locale: 'de_DE',
      type: 'article',
      images: [{ url: `${SITE_URL}${post.coverImage}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${SITE_URL}${post.coverImage}`],
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const content = getBlogContentArticle('de', slug);
  if (content) return <ContentBlogArticle article={content} />;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <GuideArticle post={post} locale="de" />;
}
