import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/config';
import { getArticle } from './blogPosts';
import { getBlogEntries } from './blogCatalog';
import { getDestination } from '../destinations/destinationData';
import ArticleLayout, { relatedEntries } from './ArticleLayout';

export default async function JournalBlogArticle({ slug }: { slug: string }) {
  const a = getArticle(slug);
  if (!a) notFound();

  const updatedISO = a.updatedISO ?? a.dateISO;
  const url = `${SITE_URL}/blog/${a.slug}`;
  const author = a.author ?? { name: 'Itinerary of Türkiye', url: '/about', type: 'Organization' as const };
  const sources = a.sources ?? [];
  const places = a.places && a.places.length ? a.places : ['Türkiye'];
  const images = a.images ?? [];
  const faq = a.faq ?? [];
  const guides = (a.destinations ?? []).map(getDestination).filter((d) => d !== undefined).map((d) => ({ slug: d.slug, name: d.name }));

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    image: [`${SITE_URL}${a.cover}`, ...images.map((i) => `${SITE_URL}${i}`)],
    datePublished: a.dateISO,
    dateModified: updatedISO,
    inLanguage: 'en',
    articleSection: a.category,
    keywords: [a.category, ...places].join(', '),
    author: { '@type': author.type ?? 'Organization', name: author.name, url: new URL(author.url, SITE_URL).toString() },
    citation: sources.map((source) => source.url),
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Itinerary of Türkiye', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    about: places.map((pl) => ({ '@type': 'Place', name: pl })),
    spatialCoverage: places.map((pl) => ({ '@type': 'Place', name: pl })),
  };
  const faqLd = faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'The Journal', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: a.shortTitle, item: url },
    ],
  };

  return (
    <ArticleLayout view={{
      locale: 'en', slug: a.slug, title: a.title, category: a.category, accent: a.accent,
      heroPrimary: `/images/blog/${a.slug}.jpg`, heroFallback: a.cover,
      dateISO: a.dateISO, updatedISO: a.updatedISO, readTime: a.readTime,
      author: { name: author.name, url: author.url },
      blocks: a.body, images, places, faq, sources, guides,
      related: relatedEntries(getBlogEntries('en'), a.slug, a.category, a.relatedSlugs),
      jsonLd: faqLd ? [articleLd, breadcrumbLd, faqLd] : [articleLd, breadcrumbLd],
    }} />
  );
}
