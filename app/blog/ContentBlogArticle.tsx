import type { ContentArticle } from '@/lib/blog-content.mjs';
import { SITE_URL } from '@/lib/config';
import { blogPath, getBlogEntries } from './blogCatalog';
import { blogCopy } from './contentPresentation';
import ArticleLayout, { relatedEntries } from './ArticleLayout';

export default function ContentBlogArticle({ article }: { article: ContentArticle }) {
  const locale = article.locale;
  const copy = blogCopy[locale];
  const canonical = `${SITE_URL}${blogPath(locale, article.slug)}`;
  const author = article.author ?? { name: 'Itinerary of Türkiye', url: '/about', type: 'Organization' };
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title, description: article.excerpt,
    image: new URL(article.cover, SITE_URL).toString(), datePublished: article.dateISO, dateModified: article.updatedISO ?? article.dateISO,
    inLanguage: locale, articleSection: article.category, keywords: article.seo.keywords.join(', '),
    author: { '@type': author.type ?? 'Organization', name: author.name, url: new URL(author.url, SITE_URL).toString() },
    citation: article.sources.map((source) => source.url),
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Itinerary of Türkiye' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };
  const breadcrumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: copy.journal, item: `${SITE_URL}${blogPath(locale)}` },
      { '@type': 'ListItem', position: 2, name: article.title, item: canonical },
    ],
  };
  return (
    <ArticleLayout view={{
      locale, slug: article.slug, title: article.title, category: article.category, accent: '#10243a',
      heroPrimary: article.cover, heroFallback: article.cover,
      dateISO: article.dateISO, updatedISO: article.updatedISO, readTime: article.readTime,
      author: { name: author.name, url: author.url },
      blocks: article.body, sources: article.sources,
      related: relatedEntries(getBlogEntries(locale), article.slug, article.category),
      jsonLd: [jsonLd, breadcrumbs],
    }} />
  );
}
