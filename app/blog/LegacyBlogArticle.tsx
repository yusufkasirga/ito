import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/config';
import type { ContentLocale } from '@/lib/blog-content.mjs';
import { getPostBySlug, type BlogPost } from '../blogs/blogData';
import { blogPath, getBlogEntries } from './blogCatalog';
import ArticleLayout, { blocksFromStrings, relatedEntries } from './ArticleLayout';

/** Guide-format articles (English `blogData` and German `blogDataDe`) rendered in the shared Journal layout. */
export function GuideArticle({ post, locale }: { post: BlogPost; locale: ContentLocale }) {
  const url = `${SITE_URL}${blogPath(locale, post.slug)}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.dateISO,
    dateModified: post.updatedISO ?? post.dateISO,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'Itinerary of Türkiye', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Itinerary of Türkiye', url: SITE_URL },
    mainEntityOfPage: url,
  };
  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  return (
    <ArticleLayout view={{
      locale, slug: post.slug, title: post.title, category: post.category, accent: '#10243a',
      heroPrimary: post.coverImage, heroFallback: post.coverImage,
      dateISO: post.dateISO, updatedISO: post.updatedISO, readTime: post.readTime,
      author: { name: 'Itinerary of Türkiye', url: '/about' },
      blocks: blocksFromStrings(post.content), faq: post.faq,
      related: relatedEntries(getBlogEntries(locale), post.slug, post.category),
      jsonLd: faqJsonLd ? [articleJsonLd, faqJsonLd] : [articleJsonLd],
    }} />
  );
}

export default async function LegacyBlogArticle({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <GuideArticle post={post} locale="en" />;
}
