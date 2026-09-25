import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/config';
import SiteHeader from '../../components/SiteHeader';
import LeadForm from '../../components/LeadForm';
import CityImage from '../../components/CityImage';
import Link from 'next/link';
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

  const url = `${SITE_URL}/destinations/${d.slug}`;
  const pairs = d.pairWith.map(getDestination).filter((x) => x !== undefined);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: `${d.name}, Türkiye`,
      description: d.tagline,
      url,
      ...(d.cover ? { image: `${SITE_URL}${d.cover}` } : {}),
      containedInPlace: { '@type': 'Country', name: 'Türkiye' },
      includesAttraction: d.attractions.map((a) => ({ '@type': 'TouristAttraction', name: a.name, description: a.desc })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: d.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'All Türkiye Destinations', item: `${SITE_URL}/all-turkiye-destinations` },
        { '@type': 'ListItem', position: 3, name: d.name, item: url },
      ],
    },
  ];


  return (
    <main className="dt">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

        /* PLAN — pratik bilgi */
        .dt-plan { max-width: 1120px; margin: 0 auto; padding: 56px 40px 8px; }
        .dt-plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 22px; }
        .dt-plan-card { background: #fff; border: 1px solid rgba(8,31,53,.1); border-radius: 18px; padding: 22px 22px 20px; }
        .dt-plan-k { font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; color: #8a6d33; margin-bottom: 10px; }
        .dt-plan-v { font-size: 15px; line-height: 1.7; color: #2b3742; margin: 0; }
        .dt-pairs { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 22px; font-size: 14px; color: #647889; }
        .dt-pair { display: inline-flex; padding: 9px 16px; border-radius: 999px; border: 1px solid rgba(138,109,51,.35); color: #081f35; font-weight: 700; text-decoration: none; transition: background .2s, border-color .2s; }
        .dt-pair:hover { background: rgba(201,169,106,.14); border-color: #c9a96a; }

        /* FAQ */
        .dt-faq { max-width: 1120px; margin: 0 auto; padding: 56px 40px 0; }
        .dt-faq details { border-bottom: 1px solid rgba(8,31,53,.1); padding: 18px 0; }
        .dt-faq summary { cursor: pointer; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #081f35; list-style: none; display: flex; justify-content: space-between; gap: 16px; }
        .dt-faq summary::-webkit-details-marker { display: none; }
        .dt-faq summary::after { content: '+'; color: #c9a96a; font-size: 24px; line-height: 1; transition: transform .2s; }
        .dt-faq details[open] summary::after { transform: rotate(45deg); }
        .dt-faq p { font-size: 15.5px; line-height: 1.75; color: #4a5765; margin: 12px 0 0; max-width: 780px; }

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
          .dt-hero-inner, .dt-see, .dt-cta-in, .dt-more, .dt-plan, .dt-faq { padding-left: 24px; padding-right: 24px; }
          .dt-plan-grid { grid-template-columns: 1fr; }
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
          <Link href="/all-turkiye-destinations" className="dt-crumb">← All Türkiye Destinations</Link>
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

      <section className="dt-plan" aria-labelledby="plan-h">
        <div className="dt-see-head">
          <h2 className="dt-see-h2" id="plan-h">Planning {d.name}</h2>
          <p className="dt-see-sub">The practical answers, before you book anything.</p>
        </div>
        <div className="dt-plan-grid">
          <div className="dt-plan-card"><div className="dt-plan-k">Best time to go</div><p className="dt-plan-v">{d.practical.bestTime}</p></div>
          <div className="dt-plan-card"><div className="dt-plan-k">How long to stay</div><p className="dt-plan-v">{d.practical.howLong}</p></div>
          <div className="dt-plan-card"><div className="dt-plan-k">Getting there</div><p className="dt-plan-v">{d.practical.gettingThere}</p></div>
        </div>
        {pairs.length > 0 && (
          <div className="dt-pairs">
            <span>Pairs well with</span>
            {pairs.map((p) => <Link key={p.slug} href={`/destinations/${p.slug}`} className="dt-pair">{p.name}</Link>)}
          </div>
        )}
      </section>

      <section className="dt-faq" aria-labelledby="faq-h">
        <div className="dt-see-head">
          <h2 className="dt-see-h2" id="faq-h">{d.name}: common questions</h2>
        </div>
        {d.faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
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
              <Link href="/how-we-work" style={{ color: '#d8b878', fontWeight: 600 }}>How we work</Link>.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>

      <div className="dt-more">
        More: <Link href="/all-turkiye-destinations">All Türkiye Destinations</Link> ·{' '}
        <Link href="/services/tourism">Private travel</Link> ·{' '}
        <Link href="/standard">The ITO Standard</Link>
      </div>
    </main>
  );
}
