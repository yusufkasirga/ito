import Link from 'next/link';
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
  main: { fontFamily: "var(--font-inter), system-ui, sans-serif", background: 'var(--ito-ivory)', minHeight: '100vh', color: 'var(--ito-navy)' },
  hero: { background: 'linear-gradient(165deg, var(--ito-navy) 0%, var(--ito-navy-lift) 100%)', color: 'var(--ito-ivory)', padding: '48px 0 60px' },
  wrap: { maxWidth: '1100px', margin: '0 auto', padding: '0 32px' },
  wrapN: { maxWidth: '1100px', margin: '0 auto', padding: '56px 32px 20px' },
  back: { display: 'inline-block', color: 'var(--ito-gold)', fontWeight: 700, textDecoration: 'none', marginBottom: '22px', fontSize: '13px' },
  eyebrow: { color: 'var(--ito-gold)', fontSize: '11px', fontWeight: 900, letterSpacing: '.18em', textTransform: 'uppercase' },
  h1: { fontFamily: "var(--font-playfair), serif", fontSize: 'clamp(34px,6vw,56px)', margin: '10px 0 14px', lineHeight: 1.04 },
  lede: { fontSize: '16.5px', lineHeight: 1.8, color: 'rgba(250,247,240,.82)', maxWidth: '680px' },
  disc: { marginTop: '20px', fontSize: '13px', lineHeight: 1.7, color: 'rgba(250,247,240,.7)', background: 'rgba(240,202,145,.1)', border: '1px solid rgba(240,202,145,.22)', borderRadius: '12px', padding: '14px 16px', maxWidth: '680px' },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: '30px', color: 'var(--ito-navy)', marginBottom: '6px' },
  sub: { fontSize: '15px', color: 'var(--ito-muted)', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' },
  card: { position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '380px', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', color: 'var(--ito-ivory)', border: '1px solid rgba(16,36,58,.1)' },
  cardImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  cardOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16,36,58,.1) 0%, rgba(16,36,58,.5) 55%, rgba(16,36,58,.94) 100%)' },
  cardBody: { position: 'relative', padding: '26px 26px 28px' },
  cardTitle: { fontFamily: "var(--font-playfair), serif", fontSize: '26px', fontWeight: 800, marginBottom: '8px' },
  cardDesc: { fontSize: '14px', lineHeight: 1.6, color: 'rgba(250,247,240,.86)', marginBottom: '14px' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '14px' },
  tag: { fontSize: '11px', fontWeight: 700, padding: '5px 10px', borderRadius: '999px', background: 'rgba(250,247,240,.12)', border: '1px solid rgba(250,247,240,.18)' },
  more: { fontSize: '13px', fontWeight: 800, color: 'var(--ito-gold)' },
  ctaBand: { background: 'linear-gradient(165deg, var(--ito-navy) 0%, var(--ito-navy-lift) 100%)', color: 'var(--ito-ivory)', marginTop: '54px', padding: '54px 0' },
  ctaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' },
  a: { color: 'var(--ito-navy)', fontWeight: 600 },
};

export default function MedicalServicePage() {
  return (
    <main style={S.main}>
      <SiteHeader />
      <section style={S.hero}>
        <div style={S.wrap}>
          <Link href="/services" style={S.back}>← All services</Link>
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
                : <span style={{ position: 'absolute', inset: 0, background: 'radial-gradient(130% 130% at 20% 15%, var(--ito-navy-lift) 0%, var(--ito-navy) 60%, var(--ito-navy) 100%)' }} />}
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
              <h2 style={{ ...S.h2, color: 'var(--ito-ivory)', margin: '10px 0 12px' }}>Tell us what you are considering.</h2>
              <p style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'rgba(250,247,240,.82)' }}>
                A short message is enough — no documents, no photos yet. A real person replies within hours.
                How we charge is set out in <Link href="/how-we-work" style={{ color: 'var(--ito-gold)', fontWeight: 600 }}>How we work</Link>.
              </p>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      <div style={{ ...S.wrap, padding: '30px 32px 70px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--ito-muted)' }}>
          See also: <Link href="/services/tourism" style={S.a}>Private Türkiye travel</Link> ·{' '}
          <Link href="/standard" style={S.a}>The ITO Standard</Link> ·{' '}
          <Link href="/contact" style={S.a}>Contact</Link>
        </p>
      </div>

      <style>{`@media (max-width: 820px){ .ct-cta-grid{ grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
    </main>
  );
}
