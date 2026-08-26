import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/config';
import SiteHeader from '../../components/SiteHeader';
import LeadForm from '../../components/LeadForm';
import CityImage from '../../components/CityImage';
import { getDestination, destinationSlugs } from '../destinationData';

export function generateStaticParams() {
  return destinationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  return {
    title: `${d.name}, Türkiye — What to See & How We Plan It`,
    description: `${d.tagline} A private, honest guide to ${d.name} and the places worth your time — planned around you by Itinerary of Türkiye.`,
    alternates: { canonical: `${SITE_URL}/destinations/${d.slug}` },
    openGraph: { title: `${d.name}, Türkiye`, description: d.tagline, url: `${SITE_URL}/destinations/${d.slug}`, type: 'article', ...(d.cover ? { images: [d.cover] } : {}) },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();


  return (
    <main className="dt">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        .dt { font-family: 'Inter', system-ui, sans-serif; background: #fffaf1; color: #3a4654; }
        .dt * { box-sizing: border-box; }

        /* HERO */
        .dt-hero { position: relative; min-height: clamp(420px, 62vh, 620px); display: flex; align-items: flex-end; overflow: hidden; }
        .dt-hero-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(.92) contrast(1.02); }
        .dt-hero-tint { position: absolute; inset: 0; background:
          linear-gradient(180deg, rgba(7,23,38,.30) 0%, rgba(7,23,38,.20) 40%, rgba(7,23,38,.92) 100%),
          linear-gradient(120deg, ${d.accent}55 0%, transparent 60%); }
        .dt-hero-typo { position: absolute; inset: 0; background:
          radial-gradient(120% 120% at 15% 15%, ${d.accent} 0%, #0a1a2b 55%, #071726 100%); }
        .dt-hero-typo::after { content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,250,241,.05) 1px, transparent 1px);
          background-size: 22px 22px; opacity: .5; }
        .dt-hero-ghost { position: absolute; right: -2%; bottom: -14%; font-family: 'Playfair Display', serif;
          font-size: clamp(180px, 34vw, 460px); font-weight: 900; color: rgba(255,250,241,.05); line-height: .8;
          pointer-events: none; user-select: none; letter-spacing: -.03em; }
        .dt-hero-inner { position: relative; max-width: 1120px; margin: 0 auto; width: 100%; padding: 0 40px 52px; }
        .dt-crumb { color: rgba(255,250,241,.82); font-size: 12.5px; font-weight: 700; text-decoration: none; }
        .dt-crumb:hover { color: #c9a96a; }
        .dt-region { color: #d8b878; font-size: 12px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; margin-top: 16px; display: block; }
        .dt-h1 { font-family: 'Playfair Display', serif; font-size: clamp(48px, 10vw, 104px); color: #fffaf1; line-height: .95; margin: 4px 0 14px; letter-spacing: -.02em; }
        .dt-tagline { color: rgba(255,250,241,.92); font-size: clamp(16px, 2.4vw, 20px); line-height: 1.55; max-width: 660px; font-weight: 500; }

        /* INTRO — editorial, asymmetric */
        .dt-intro { max-width: 1120px; margin: 0 auto; padding: 64px 40px 8px; display: grid; grid-template-columns: 1fr 2fr; gap: 40px; }
        .dt-intro-label { font-size: 12px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; color: #8a6d33; padding-top: 8px; }
        .dt-intro-body p { font-size: clamp(18px, 2.2vw, 21px); line-height: 1.75; color: #2b3742; margin: 0 0 20px; }
        .dt-intro-body p:first-child::first-letter { font-family: 'Playfair Display', serif; font-size: 3.4em; line-height: .82; float: left; padding: 6px 12px 0 0; color: #8a6d33; }

        /* SEE — magazine list */
        .dt-see { max-width: 1120px; margin: 0 auto; padding: 40px 40px 10px; }
        .dt-see-head { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; border-bottom: 1px solid rgba(8,31,53,.14); padding-bottom: 16px; margin-bottom: 6px; }
        .dt-see-h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 40px); color: #081f35; letter-spacing: -.01em; }
        .dt-see-sub { font-size: 14px; color: #647889; text-align: right; max-width: 280px; }
        .dt-attr { display: grid; grid-template-columns: 88px 1fr; gap: 8px 26px; padding: 26px 0; border-bottom: 1px solid rgba(8,31,53,.09); align-items: start; }
        .dt-attr:hover .dt-attr-name { color: #8a6d33; }
        .dt-attr-num { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: #c9a96a; line-height: 1; }
        .dt-attr-name { font-family: 'Playfair Display', serif; font-size: 23px; font-weight: 700; color: #081f35; margin-bottom: 7px; transition: color .2s; }
        .dt-attr-desc { font-size: 15.5px; line-height: 1.7; color: #4a5765; max-width: 720px; }

        /* CTA */
        .dt-cta { background: linear-gradient(165deg, #071726 0%, #0c3555 100%); color: #fffaf1; margin-top: 56px; padding: 60px 0; }
        .dt-cta-in { max-width: 1120px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: center; }
        .dt-eyebrow { color: #d8b878; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .dt-cta h2 { font-family: 'Playfair Display', serif; font-size: 32px; color: #fffaf1; margin: 10px 0 12px; line-height: 1.08; }
        .dt-cta p { font-size: 15.5px; line-height: 1.8; color: rgba(255,250,241,.82); }
        .dt-more { max-width: 1120px; margin: 0 auto; padding: 30px 40px 72px; text-align: center; font-size: 13px; color: #647889; }
        .dt-more a { color: #8a6d33; font-weight: 600; }

        /* micro-animation */
        @keyframes dt-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .dt-anim { animation: dt-rise .7s cubic-bezier(.2,.7,.3,1) both; }
        .dt-attr { animation: dt-rise .6s cubic-bezier(.2,.7,.3,1) both; }
        @media (prefers-reduced-motion: reduce) { .dt-anim, .dt-attr { animation: none !important; } }

        @media (max-width: 820px) {
          .dt-intro { grid-template-columns: 1fr; gap: 10px; padding: 44px 24px 0; }
          .dt-hero-inner, .dt-see, .dt-cta-in, .dt-more { padding-left: 24px; padding-right: 24px; }
          .dt-cta-in { grid-template-columns: 1fr; gap: 28px; }
          .dt-attr { grid-template-columns: 60px 1fr; gap: 6px 16px; }
          .dt-attr-num { font-size: 30px; }
          .dt-see-sub { display: none; }
        }
      `}</style>

      <SiteHeader />

      <section className="dt-hero">
        <CityImage slug={d.slug} accent={d.accent} alt={d.name} fallback={d.cover || undefined} />
        <span className="dt-hero-ghost">{d.name.slice(0, 3)}</span>
        <span className="dt-hero-tint" />
        <div className="dt-hero-inner dt-anim">
          <a href="/all-turkiye-destinations" className="dt-crumb">← All Türkiye Destinations</a>
          <span className="dt-region">{d.region}</span>
          <h1 className="dt-h1">{d.name}</h1>
          <p className="dt-tagline">{d.tagline}</p>
        </div>
      </section>

      <section className="dt-intro">
        <div className="dt-intro-label">Why {d.name}</div>
        <div className="dt-intro-body">
          {d.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="dt-see">
        <div className="dt-see-head">
          <h2 className="dt-see-h2">What to see in {d.name}</h2>
          <p className="dt-see-sub">The places worth your time — and the ones we build a day around.</p>
        </div>
        {d.attractions.map((a, i) => (
          <div className="dt-attr" key={a.name} style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}>
            <span className="dt-attr-num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="dt-attr-name">{a.name}</div>
              <div className="dt-attr-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="dt-cta">
        <div className="dt-cta-in">
          <div>
            <span className="dt-eyebrow">Plan {d.name} with us</span>
            <h2>Which of these is your kind of day?</h2>
            <p>
              Tell us what pulls at you and we will build {d.name} around it — the right hours, the right
              guide, and an honest word on what to skip. How we charge is set out in{' '}
              <a href="/how-we-work" style={{ color: '#d8b878', fontWeight: 600 }}>How we work</a>.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>

      <div className="dt-more">
        More: <a href="/all-turkiye-destinations">All Türkiye Destinations</a> ·{' '}
        <a href="/services/tourism">Private travel</a> ·{' '}
        <a href="/standard">The ITO Standard</a>
      </div>
    </main>
  );
}
