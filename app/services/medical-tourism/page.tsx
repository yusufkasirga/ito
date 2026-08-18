import type { Metadata } from 'next';
import SiteHeader from '../../components/SiteHeader';
import { SITE_URL } from '@/lib/config';
import LeadForm from '../../components/LeadForm';

export const metadata: Metadata = {
  title: 'Medical Travel to Türkiye — Hair, Dental, Aesthetic & More',
  description: 'Independent medical-travel advisory for Türkiye across hair restoration, dental, aesthetic surgery and other treatments. We verify clinics, coordinate your trip and stay beside you — paid by you, never by commission.',
  alternates: { canonical: `${SITE_URL}/services/medical-tourism` },
};

const categories = [
  {
    key: 'hair',
    title: 'Hair Restoration',
    image: '/images/pexels-2076930-700x900.jpg',
    desc: 'FUE and DHI at the clinics that do the most of them anywhere. We help you compare honestly — technique, graft counts, what a package should really include.',
    tags: ['FUE & DHI', 'Beard & brow', 'Aftercare'],
    href: '/blogs/hair-transplant-turkey-cost-guide-2026',
  },
  {
    key: 'dental',
    title: 'Dental Care',
    image: '/images/pexels-3779709-700x900.jpg',
    desc: 'Veneers, implants and the full smile makeover — and a frank conversation about what lasts, what to avoid, and where a cheap quote gets expensive later.',
    tags: ['Veneers', 'Implants', 'Hollywood smile'],
    href: '/blogs/dental-veneers-implants-turkey-cost-guide-2026',
  },
  {
    key: 'aesthetic',
    title: 'Aesthetic Surgery',
    image: '/images/pexels-3764013-700x900.jpg',
    desc: 'Rhinoplasty, facelift, body contouring — with realistic timelines, proper recovery planning, and the questions to ask before you pay any deposit.',
    tags: ['Rhinoplasty', 'Facelift', 'Body contouring'],
    href: '/blogs/rhinoplasty-turkey-cost-process-recovery-2026',
  },
  {
    key: 'other',
    title: 'Eye & Other Treatments',
    image: '',
    desc: 'Laser eye surgery, weight and metabolic procedures, and comprehensive health check-ups — coordinated with the same care, and the same independence.',
    tags: ['Laser eye (LASIK)', 'Bariatric', 'Check-ups'],
    href: '/blogs/is-medical-tourism-turkey-safe',
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
  lede: { fontSize: '16.5px', lineHeight: 1.8, color: 'rgba(255,250,241,.82)', maxWidth: '680px' },
  disc: { marginTop: '20px', fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,250,241,.7)', background: 'rgba(201,169,106,.1)', border: '1px solid rgba(201,169,106,.22)', borderRadius: '12px', padding: '14px 16px', maxWidth: '680px' },
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

export default function MedicalServicePage() {
  return (
    <main style={S.main}>
      <SiteHeader />
      <section style={S.hero}>
        <div style={S.wrap}>
          <a href="/services" style={S.back}>← All services</a>
          <span style={S.eyebrow}>Medical Travel</span>
          <h1 style={S.h1}>The right clinic — and someone there on the day.</h1>
          <p style={S.lede}>
            We help you find accredited specialists, coordinate the whole trip, and are physically with you
            on treatment day. Because we are paid by you and take no commission from any clinic, our only job
            is to be right.
          </p>
          <p style={S.disc}>
            Itinerary of Türkiye is <strong>not</strong> a clinic or a medical provider, and nothing here is medical
            advice. All treatment is delivered by independent, licensed clinics responsible for their own care.
            Prices are indicative and depend on your individual case.
          </p>
        </div>
      </section>

      <section style={S.wrapN}>
        <h2 style={S.h2}>Where we help</h2>
        <p style={S.sub}>Each card links to an honest guide — costs, comparisons and the questions to ask.</p>
        <div style={S.grid}>
          {categories.map((c) => (
            <a key={c.key} href={c.href} style={S.card}>
              {c.image
                ? <img src={c.image} alt={c.title} loading="lazy" style={S.cardImg} />
                : <span style={{ position: 'absolute', inset: 0, background: 'radial-gradient(130% 130% at 20% 15%, #2a4a6b 0%, #0a1a2b 60%, #071726 100%)' }} />}
              <span style={S.cardOverlay} />
              <div style={S.cardBody}>
                <div style={S.cardTitle}>{c.title}</div>
                <div style={S.cardDesc}>{c.desc}</div>
                <div style={S.tagRow}>
                  {c.tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}
                </div>
                <span style={S.more}>Read the guide →</span>
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
              <h2 style={{ ...S.h2, color: '#fffaf1', margin: '10px 0 12px' }}>Tell us what you are considering.</h2>
              <p style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'rgba(255,250,241,.82)' }}>
                A short message is enough — no documents, no photos yet. A real person replies within hours.
                How we charge is set out in <a href="/how-we-work" style={{ color: '#c9a96a', fontWeight: 600 }}>How we work</a>.
              </p>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      <div style={{ ...S.wrap, padding: '30px 32px 70px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#647889' }}>
          See also: <a href="/services/tourism" style={S.a}>Private Türkiye travel</a> ·{' '}
          <a href="/standard" style={S.a}>The ITO Standard</a> ·{' '}
          <a href="/contact" style={S.a}>Contact</a>
        </p>
      </div>

      <style>{`@media (max-width: 820px){ .ct-cta-grid{ grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
    </main>
  );
}
