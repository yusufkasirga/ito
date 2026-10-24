import Link from 'next/link';
import type { ContentLocale } from '@/lib/blog-content.mjs';
import CityImage from '../components/CityImage';
import { blogPath, getBlogEntries } from './blogCatalog';
import BlogLanguageLinks from './BlogLanguageLinks';
import { blogCopy } from './contentPresentation';

export default function LocalizedBlogIndex({ locale }: { locale: ContentLocale }) {
  const copy = blogCopy[locale];
  return (
    <main className="localized-blog" lang={locale}>
      <style>{`
        .localized-blog { background: #071726; min-height: 100vh; color: #fffaf1; font-family: var(--font-inter), system-ui, sans-serif; padding: 46px 24px 80px; }
        .localized-blog-wrap { max-width: 1120px; margin: 0 auto; }
        .localized-blog h1 { font-family: var(--font-playfair), serif; font-size: clamp(34px,5vw,56px); margin: 30px 0 14px; }
        .localized-blog-lede { color: #cad1d5; line-height: 1.8; }
        .localized-blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%,300px),1fr)); gap: 24px; margin-top: 40px; }
        .localized-blog-card { display: block; border: 1px solid #34414d; border-radius: 16px; overflow: hidden; text-decoration: none; color: inherit; background: #0d2136; }
        .localized-blog-card:hover { border-color: #c9a96a; }
        .localized-blog-shot { position: relative; aspect-ratio: 16/10; overflow: hidden; }
        .localized-blog-card-body { padding: 24px; }
        .localized-blog-card-body span { color: #e6c78b; font-size: 13px; }
        .localized-blog h2 { font-family: var(--font-playfair), serif; font-size: 23px; line-height: 1.35; }
        .localized-blog-card-body p { color: #cad1d5; line-height: 1.8; }
      `}</style>
      <div className="localized-blog-wrap">
        <Link href={blogPath(locale)} style={{ color: '#e6c78b', textDecoration: 'none', fontWeight: 800 }}>Itinerary of Türkiye</Link>
        <h1>{copy.journal}</h1><p className="localized-blog-lede">{copy.intro}</p>
        <BlogLanguageLinks locale={locale} />
        <div className="localized-blog-grid">{getBlogEntries(locale).map((entry) => <Link className="localized-blog-card" key={entry.slug} href={blogPath(locale, entry.slug)}>
          <div className="localized-blog-shot"><CityImage slug={entry.slug} accent={entry.accent} alt={entry.title} primary={entry.primaryImage} fallback={entry.cover} /></div>
          <div className="localized-blog-card-body"><span>{entry.category}</span><h2>{entry.title}</h2><p>{entry.excerpt}</p><span>{entry.readTime} · {copy.read} →</span></div>
        </Link>)}</div>
      </div>
    </main>
  );
}
