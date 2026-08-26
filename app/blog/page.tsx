import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import SiteHeader from '../components/SiteHeader';
import CityImage from '../components/CityImage';
import { blogArticles } from './blogPosts';

export const metadata: Metadata = {
  title: 'The Journal — Itinerary of Türkiye',
  description: 'Honest guides to travelling and treatment in Türkiye — hidden destinations, hair and dental care, property and business — written from the ground by Itinerary of Türkiye.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default function BlogIndex() {
  const featured = blogArticles[0];
  const rest = blogArticles.slice(1);
  const clamp = (t: string, n: number) => (t.length > n ? t.slice(0, n).trimEnd() + '…' : t);

  return (
    <main className="bj">
      <style>{`
        .bj { font-family: 'Inter', system-ui, sans-serif; background: #071726; min-height: 100vh; color: #fffaf1; }
        .bj * { box-sizing: border-box; }
        .bj-wrap { max-width: 1160px; margin: 0 auto; padding: 56px 40px 96px; }
        .bj-eyebrow { color: #d8b878; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .bj-h1 { font-family: 'Playfair Display', serif; font-size: clamp(38px,7vw,62px); margin: 12px 0 14px; line-height: 1.03; letter-spacing: -.02em; }
        .bj-lede { font-size: 16.5px; line-height: 1.8; color: rgba(255,250,241,.78); max-width: 640px; margin-bottom: 50px; }

        /* Ortak kart yüzeyi */
        .bj-card { display: flex; flex-direction: column; background: #0d2136; border: 1px solid rgba(255,250,241,.09); border-radius: 16px; overflow: hidden; text-decoration: none; color: #fffaf1; transition: transform .25s ease, border-color .25s ease; }
        .bj-card:hover { transform: translateY(-4px); border-color: rgba(216,184,120,.5); }
        .bj-shot { position: relative; overflow: hidden; }
        .bj-cat { position: absolute; top: 14px; left: 14px; z-index: 3; background: rgba(7,23,38,.78); backdrop-filter: blur(4px); color: #d8b878; font-size: 10px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; padding: 6px 11px; border-radius: 999px; }
        .bj-body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }
        .bj-title { font-family: 'Playfair Display', serif; font-weight: 700; line-height: 1.18; color: #fffaf1; }
        .bj-ex { font-size: 13.5px; line-height: 1.6; color: rgba(255,250,241,.72); margin-top: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .bj-meta { margin-top: auto; padding-top: 16px; display: flex; align-items: center; justify-content: space-between; }
        .bj-rt { font-size: 12px; color: rgba(255,250,241,.55); font-weight: 600; }
        .bj-go { font-size: 12.5px; font-weight: 800; color: #d8b878; }

        /* Öne çıkan (ilk) — yatay, geniş */
        .bj-feat { display: grid; grid-template-columns: 1.05fr 1fr; margin-bottom: 30px; }
        .bj-feat .bj-shot { min-height: 340px; }
        .bj-feat .bj-body { padding: 40px 40px; justify-content: center; }
        .bj-feat .bj-title { font-size: 30px; }
        .bj-feat .bj-ex { font-size: 15px; -webkit-line-clamp: 3; margin-top: 14px; }

        /* Izgara */
        .bj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .bj-grid .bj-shot { aspect-ratio: 16/10; }
        .bj-grid .bj-title { font-size: 20px; }

        @media (max-width: 860px) {
          .bj-wrap { padding: 44px 22px 70px; }
          .bj-feat { grid-template-columns: 1fr; }
          .bj-feat .bj-shot { aspect-ratio: 16/10; min-height: 0; }
          .bj-feat .bj-body { padding: 24px 22px; }
          .bj-feat .bj-title { font-size: 24px; }
        }
      `}</style>

      <SiteHeader />
      <div className="bj-wrap">
        <span className="bj-eyebrow">The Journal</span>
        <h1 className="bj-h1">Türkiye, from the people who live it.</h1>
        <p className="bj-lede">
          Honest, first-hand guides — where to go, what a treatment really involves, how a property deal
          actually works. No brochure gloss; the things we would tell a friend.
        </p>

        <a href={`/blog/${featured.slug}`} className="bj-card bj-feat">
          <span className="bj-shot">
            <span className="bj-cat">{featured.category}</span>
            <CityImage slug={featured.slug} accent={featured.accent} alt={`${featured.title} — ${featured.category} in Türkiye`} primary={`/images/blog/${featured.slug}.jpg`} fallback={featured.cover} />
          </span>
          <div className="bj-body">
            <div className="bj-title">{featured.title}</div>
            <div className="bj-ex">{clamp(featured.excerpt, 180)}</div>
            <div className="bj-meta"><span className="bj-rt">{featured.readTime}</span><span className="bj-go">Read article →</span></div>
          </div>
        </a>

        <div className="bj-grid">
          {rest.map((a) => (
            <a key={a.slug} href={`/blog/${a.slug}`} className="bj-card">
              <span className="bj-shot">
                <span className="bj-cat">{a.category}</span>
                <CityImage slug={a.slug} accent={a.accent} alt={`${a.title} — ${a.category} in Türkiye`} primary={`/images/blog/${a.slug}.jpg`} fallback={a.cover} />
              </span>
              <div className="bj-body">
                <div className="bj-title">{a.title}</div>
                <div className="bj-ex">{clamp(a.excerpt, 120)}</div>
                <div className="bj-meta"><span className="bj-rt">{a.readTime}</span><span className="bj-go">Read →</span></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
