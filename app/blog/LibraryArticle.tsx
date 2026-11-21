import type { Metadata } from 'next';
import type { LibraryArticle as Article } from '@/lib/library-content.mjs';
import { librarySection } from '@/lib/library-content.mjs';
import { SITE_URL } from '@/lib/config';
import { getBlogEntries } from './blogCatalog';
import ArticleLayout, { relatedEntries, type ArticleBlock } from './ArticleLayout';

const SECTION_CRUMB = {
  blog: { name: 'The Journal', path: '/blog' },
  services: { name: 'Services', path: '/services' },
  destinations: { name: 'All Türkiye Destinations', path: '/all-turkiye-destinations' },
} as const;

const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

export function libraryUrl(article: Article) {
  return `${SITE_URL}${article.plannedPath}`;
}

export function libraryMetadata(article: Article): Metadata {
  const url = libraryUrl(article);
  const image = article.cover ? new URL(article.cover, SITE_URL).toString() : `${SITE_URL}/og-image.png`;
  return {
    title: { absolute: article.seoTitle },
    description: article.metaDescription,
    keywords: [article.focusKeyword],
    authors: [{ name: 'Itinerary of Türkiye', url: `${SITE_URL}/about` }],
    alternates: { canonical: url },
    openGraph: {
      title: article.title, description: article.metaDescription, url, siteName: 'Itinerary of Türkiye', type: 'article', locale: 'en_US',
      publishedTime: article.dateISO, modifiedTime: article.updatedISO ?? article.dateISO, images: [image],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.metaDescription, images: [image] },
  };
}

export default function LibraryArticle({ article }: { article: Article }) {
  const url = libraryUrl(article);
  const section = librarySection(article) ?? 'blog';
  const crumb = SECTION_CRUMB[section];
  const image = article.cover ? new URL(article.cover, SITE_URL).toString() : undefined;
  const organization = { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Itinerary of Türkiye', url: SITE_URL };
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.metaDescription,
      ...(image ? { image } : {}), datePublished: article.dateISO, dateModified: article.updatedISO ?? article.dateISO,
      inLanguage: 'en', articleSection: article.category, keywords: article.focusKeyword,
      abstract: plain(article.quickAnswer), author: organization, publisher: organization,
      citation: article.sources.map((s) => s.url), mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: article.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: crumb.name, item: `${SITE_URL}${crumb.path}` },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ],
    },
  ];
  // Inline photos are placed after the 2nd and 4th section openers so they break up long text.
  const blocks: ArticleBlock[] = [];
  let h2 = 0;
  const figures = [...article.images];
  const filled = new Set<number>();
  for (const block of article.body) {
    blocks.push(block as ArticleBlock);
    if (block.type === 'h2') h2 += 1;
    if (block.type === 'p' && figures.length && (h2 === 2 || h2 === 4) && !filled.has(h2)) {
      const next = figures.shift()!;
      blocks.push({ type: 'figure', src: next.src, alt: next.alt });
      filled.add(h2);
    }
  }
  return (
    <ArticleLayout view={{
      locale: 'en', slug: article.slug, title: article.title, category: article.category, accent: '#10243a',
      heroPrimary: article.cover || `/images/dest/${article.slug}.jpg`, heroFallback: '',
      dateISO: article.dateISO, updatedISO: article.updatedISO, readTime: article.readTime,
      author: { name: 'Itinerary of Türkiye', url: '/about' },
      quickAnswer: article.quickAnswer, coverCredit: article.coverCredit,
      blocks, faq: article.faq, sources: article.sources,
      related: relatedEntries(getBlogEntries('en'), article.slug, article.category),
      jsonLd,
    }} />
  );
}
