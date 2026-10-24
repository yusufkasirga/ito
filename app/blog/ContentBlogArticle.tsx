import Link from 'next/link';
import type { ContentArticle } from '@/lib/blog-content.mjs';
import { SITE_URL } from '@/lib/config';
import CityImage from '../components/CityImage';
import { blogPath, getBlogEntries } from './blogCatalog';
import BlogLanguageLinks from './BlogLanguageLinks';
import { blogCopy } from './contentPresentation';

function inline(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const href = match[2].replace(/^(\/de)?\/blogs(?=\/|[?#]|$)/, '$1/blog');
    const safe = (href.startsWith('/') && !href.startsWith('//')) || /^https?:\/\//i.test(href);
    return safe ? <a key={index} href={href} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{match[1]}</a> : match[1];
  });
}

export default function ContentBlogArticle({ article }: { article: ContentArticle }) {
  const locale = article.locale;
  const copy = blogCopy[locale];
  const canonical = `${SITE_URL}${blogPath(locale, article.slug)}`;
  const author = article.author ?? { name: 'Itinerary of Türkiye', url: '/about', type: 'Organization' };
  const related = getBlogEntries(locale).filter((entry) => entry.slug !== article.slug).slice(0, 3);
  const date = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString(copy.dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
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
    <main className="content-article" lang={locale}>
      <style>{`
        .content-article { background: #fffaf1; color: #2b3742; min-height: 100vh; font-family: var(--font-inter), system-ui, sans-serif; }
        .content-article * { box-sizing: border-box; }
        .content-article-header { padding: 22px max(22px, calc((100% - 1040px)/2)); background: #071726; color: #fffaf1; }
        .content-article-header a { color: inherit; text-decoration: none; font-weight: 700; }
        .content-article-hero { position: relative; min-height: 380px; display: flex; align-items: flex-end; overflow: hidden; background: #10243a; }
        .content-article-shade { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(7,23,38,.12), rgba(7,23,38,.92)); }
        .content-article-title { position: relative; z-index: 3; max-width: 1120px; width: 100%; margin: 0 auto; padding: 64px 40px 44px; color: #fffaf1; }
        .content-article h1 { font-family: var(--font-playfair), serif; font-size: clamp(30px,5vw,52px); line-height: 1.16; margin: 14px 0 22px; }
        .content-article-category { color: #e6c78b; font-weight: 800; font-size: 13px; }
        .content-article-body { max-width: 800px; padding: 26px 28px 70px; margin: 0 auto; }
        .content-article-body p, .content-article-body li { font-size: 17px; line-height: 1.95; }
        .content-article-body h2 { font-family: var(--font-playfair), serif; color: #081f35; font-size: 28px; margin: 38px 0 14px; }
        .content-article-body a { color: #71551f; text-underline-offset: 4px; overflow-wrap: anywhere; }
        .content-article-body section { margin-top: 42px; padding-top: 10px; border-top: 1px solid #d6d1c5; }
        .content-article-body .content-article-excerpt { font-size: 20px; color: #485867; }
        .content-article-body .content-source-list li { font-size: 15px; }
        @media (max-width: 650px) { .content-article-title { padding: 48px 22px 32px; } .content-article-body { padding: 22px 22px 54px; } }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, '\\u003c') }} />
      <header className="content-article-header"><Link href={blogPath(locale)}>Itinerary of Türkiye · {copy.journal}</Link></header>
      <div className="content-article-hero">
        <CityImage slug={article.slug} accent="#10243a" alt={article.title} primary={article.cover} fallback={article.cover} priority />
        <div className="content-article-shade" />
        <div className="content-article-title">
          <span className="content-article-category">{article.category}</span>
          <h1>{article.title}</h1>
          <div><time dateTime={article.dateISO}>{date(article.dateISO)}</time> · {article.readTime}</div>
          {article.updatedISO && <p>{copy.updated}: <time dateTime={article.updatedISO}>{date(article.updatedISO)}</time></p>}
        </div>
      </div>
      <article className="content-article-body">
        <BlogLanguageLinks locale={locale} slug={article.slug} />
        <p className="content-article-excerpt">{article.excerpt}</p>
        {article.body.map((block, index) => block.type === 'h2' ? <h2 key={index}>{block.text}</h2> : block.type === 'ul'
          ? <ul key={index}>{block.items.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>
          : <p key={index}>{inline(block.text)}</p>)}
        <section aria-labelledby="content-sources">
          <h2 id="content-sources">{copy.sources}</h2>
          <ul className="content-source-list">{article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>{source.publisher ? ` — ${source.publisher}` : ''}</li>)}</ul>
        </section>
        {related.length > 0 && <section aria-labelledby="content-related"><h2 id="content-related">{copy.related}</h2><ul>{related.map((entry) => <li key={entry.slug}><Link href={blogPath(locale, entry.slug)}>{entry.title}</Link></li>)}</ul></section>}
      </article>
    </main>
  );
}
