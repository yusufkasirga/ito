import type { Metadata } from 'next';
import SiteHeader from '../../components/SiteHeader';
import { SITE_URL } from '@/lib/config';
import LeadForm from '../../components/LeadForm';

export const metadata: Metadata = {
  title: 'Private Türkiye Travel — Culture, History, Gastronomy & Coast',
  description: 'A private, paid travel advisory for Türkiye across four kinds of journey: history & heritage, culture & arts, gastronomy, and nature & coast. Planned around you, with someone beside you.',
  alternates: { canonical: `${SITE_URL}/services/tourism` },
};

const categories = [
  {
    key: 'history',
    title: 'History & Heritage',
    image: '/images/pexels-1549326-800x1200.jpg',
    desc: 'Ephesus, Hagia Sophia, the Lycian coast, Nemrut — ten thousand years of Anatolia, walked at the right hour with a guide who makes the stones speak.',
    tags: ['Ancient cities', 'Byzantine & Ottoman', 'Museums'],
    href: '/blogs/best-things-to-do-istanbul-first-time',
  },
  {
    key: 'culture',
    title: 'Culture & Arts',
    image: '/images/pexels-3889742-1920x1080.jpg',
    desc: 'Living crafts and covered bazaars, whirling dervishes and contemporary galleries, hammams and neighbourhood rituals — the Türkiye that happens between the monuments.',
    tags: ['Bazaars & crafts', 'Music & dance', 'Modern art'],
    href: '/blogs/7-day-turkey-itinerary-istanbul-cappadocia',
  },
  {
    key: 'gastronomy',
    title: 'Gastronomy',
    image: '/images/pexels-3338497-800x1200.jpg',
    desc: 'One of the world\'s great cuisines, region by region: a Gaziantep kitchen, an Aegean meze table, a Black Sea village breakfast, a chef\'s table you would never find alone.',
    tags: ['Regional kitchens', 'Meze & wine', 'Street food'],
    href: '/blogs/best-things-to-do-istanbul-first-time',
  },
  {
    key: 'nature',
    title: 'Nature & Coast',
    image: '/images/pexels-2419278-800x1200.jpg',
    desc: 'Turquoise coves and gulet decks, Cappadocia\'s valleys at dawn, highland yaylas and fishing towns — the coastline and landscapes that most first visits never reach.',
    tags: ['Aegean & Med coast', 'Cappadocia valleys', 'Gulet cruises'],
    href: '/blogs/turkish-riviera-antalya-bodrum-fethiye-guide',
  },
];

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', color: '#3a4654' },
  hero: { background: 'linear-gradient(165deg, #071726 0%, #0c3555 100%)', color: '#fffaf1', padding: '48px 0 60px' },
  wrap: { maxWidth: '1100px', margin: '0 auto', padding: '0 32px' },
  wrapN: { maxWidth: '1100px', margin: '0 auto', padding: '56px 32px 20px' },
  back: { display: 'inline-block', color: '#c9a96a', fontWeight: 700, textDecoration: 'none', marginBottom: '22px', fontSize: '13px' },
  eyebrow: { color: '#c9a96a', fontSize: '11px', fontWeight: 900, letterSpacing: '.18em', textTransform: 'uppercase' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(34px,6vw,56px)', margin: '10px 0 14px', lineHeight: 1.04 },
  lede: { fontSize: '16.5px', lineHeight: 1.8, color: 'rgba(255,250,241,.82)', maxWidth: '660px' },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '30px', color: '#081f35', marginBottom: '6px' },
  sub: { fontSize: '15px', color: '#647889', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' },
  card: { position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '380px', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', color: '#fffaf1', border: '1px solid rgba(8,31,53,.1)' },
  cardImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  cardOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,23,38,.1) 0%, rgba(7,23,38,.5) 55%, rgba(7,23,38,.94) 100%)' },
  cardBody: { position: 'relative', padding: '26px 26px 28px' },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, marginBottom: '8px' },
  cardDesc: { fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,250,241,.86)', marginBottom: '14px' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '14px' },
  tag: { fontSize: '11px', fontWeight: 700, padding: '5px 10px', borderRadius: '999px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)' },
  more: { fontSize: '13px', fontWeight: 800, color: '#c9a96a' },
  ctaBand: { background: 'linear-gradient(165deg, #071726 0%, #0c3555 100%)', color: '#fffaf1', marginTop: '54px', padding: '54px 0' },
  ctaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' },
  a: { color: '#8a6d33', fontWeight: 600 },
};

export default function TourismServicePage() {
  return (
    <main style={S.main}>
      <SiteHeader />
      <section style={S.hero}>
        <div style={S.wrap}>
          <a href="/services" style={S.back}>← All services</a>
          <span style={S.eyebrow}>Private Türkiye Experiences</span>
          <h1 style={S.h1}>Four ways to travel Türkiye — one way to plan it.</h1>
          <p style={S.lede}>
            However you want to experience the country, we build it privately, arrange every moving part,
            and stay with you while you are here. Choose the kind of journey that pulls at you.
          </p>
        </div>
      </section>

      <section style={S.wrapN}>
        <h2 style={S.h2}>Choose your kind of journey</h2>
        <p style={S.sub}>Most trips blend two or three of these — tell us the mix and we design around it.</p>
        <div style={S.grid}>
          {categories.map((c) => (
            <a key={c.key} href={c.href} style={S.card}>
              <img src={c.image} alt={c.title} loading="lazy" style={S.cardImg} />
              <span style={S.cardOverlay} />
              <div style={S.cardBody}>
                <div style={S.cardTitle}>{c.title}</div>
                <div style={S.cardDesc}>{c.desc}</div>
                <div style={S.tagRow}>
                  {c.tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}
                </div>
                <span style={S.more}>Explore guides →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={S.ctaBand}>
        <div style={{ ...S.wrap }}>
          <div style={S.ctaGrid} className="ct-cta-grid">
            <div>
              <span style={S.eyebrow}>Start here</span>
              <h2 style={{ ...S.h2, color: '#fffaf1', margin: '10px 0 12px' }}>Tell us how you like to travel.</h2>
              <p style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'rgba(255,250,241,.82)' }}>
                A short message is enough to begin. A real person replies within hours. What you get and how we
                charge is set out in <a href="/how-we-work" style={{ color: '#c9a96a', fontWeight: 600 }}>How we work</a>.
              </p>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      <div style={{ ...S.wrap, padding: '30px 32px 70px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#647889' }}>
          See also: <a href="/all-turkiye-destinations" style={S.a}>All Türkiye Destinations</a> ·{' '}
          <a href="/services/medical-tourism" style={S.a}>Medical travel</a> ·{' '}
          <a href="/standard" style={S.a}>The ITO Standard</a>
        </p>
      </div>

      <style>{`@media (max-width: 820px){ .ct-cta-grid{ grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
    </main>
  );
}
