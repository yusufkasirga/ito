import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '../components/SiteHeader';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'The ITO Standard — How We Choose, and What We Refuse',
  description: 'Our published commitments: we are paid by our clients only, we never take provider commissions, and every plan includes what we advise against — and why.',
  alternates: { canonical: `${SITE_URL}/standard` },
};

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "var(--font-inter), system-ui, sans-serif", background: 'var(--ito-ivory)', minHeight: '100vh', color: 'var(--ito-navy)' },
  wrap: { maxWidth: '760px', margin: '0 auto', padding: '48px 32px 80px' },
  h1: { fontFamily: "var(--font-playfair), serif", fontSize: 'clamp(30px,5vw,44px)', color: 'var(--ito-navy)', marginBottom: '10px' },
  lede: { fontSize: '17px', lineHeight: 1.8, color: 'var(--ito-navy)', marginBottom: '8px' },
  meta: { fontSize: '13px', color: 'var(--ito-muted)', marginBottom: '30px' },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: '22px', color: 'var(--ito-navy)', margin: '38px 0 12px' },
  p: { fontSize: '15.5px', lineHeight: 1.85, marginBottom: '16px' },
  num: { display: 'inline-block', fontFamily: "var(--font-playfair), serif", color: 'var(--ito-navy)', fontWeight: 700, marginRight: '10px' },
  card: { background: 'var(--ito-ivory)', border: '1px solid rgba(16,36,58,.1)', borderRadius: '14px', padding: '22px 24px', marginBottom: '14px' },
  cardTitle: { fontWeight: 700, color: 'var(--ito-navy)', fontSize: '15.5px', marginBottom: '6px' },
  back: { display: 'inline-block', color: 'var(--ito-navy)', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '13px' },
  cta: { display: 'inline-block', marginTop: '20px', padding: '14px 28px', borderRadius: '999px', background: 'var(--ito-navy)', color: 'var(--ito-ivory)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' },
};

export default function StandardPage() {
  return (
    <main style={S.main}>
      <SiteHeader />
      <div style={S.wrap}>
        <Link href="/" style={S.back}>← Back to home</Link>
        <h1 style={S.h1}>The ITO Standard</h1>
        <p style={S.lede}>
          Trust is not something we ask for. It is something we put in writing — and let you hold us to.
        </p>
        <p style={S.meta}>Published 21 July 2026 · These commitments apply to every client, every trip.</p>

        <div style={S.card}>
          <div style={S.cardTitle}><span style={S.num}>1</span>We are paid by you — and only you.</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Our revenue is our clients&apos; advisory fee. We do not accept commissions, referral payments or
            hidden margins from hotels, clinics, guides, restaurants or anyone else we recommend.
            No provider can pay us to appear in your plan. This is the entire reason you can trust our advice:
            we have nothing to sell you except our judgment.
          </p>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}><span style={S.num}>2</span>Every plan includes what we advise against.</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            A recommendation only means something if we are also willing to say no. Your written plan includes
            a section most advisories will never show you: the hotels, tours, and experiences we considered
            and rejected for your trip — and the reason for each. If a famous option is overpriced, crowded
            beyond enjoyment, or simply wrong for you, we will say so in writing.
          </p>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}><span style={S.num}>3</span>We recommend providers by published criteria.</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Before anyone enters our network we assess accreditation and licensing, operational reliability,
            communication quality, and how they respond when something goes wrong — because something always,
            eventually, goes wrong. Providers who cannot meet the standard are not listed, whatever they offer us.
          </p>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}><span style={S.num}>4</span>We promise process, not outcomes.</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            No honest advisor can guarantee a medical result, a sunrise balloon flight, or perfect weather.
            What we guarantee is the process: a written plan within 72 hours of your consultation, a named
            person who knows your file, responses within hours — not days — and our physical presence on the
            days that matter most. If a planning consultation brings you no value, we refund the fee.
          </p>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}><span style={S.num}>5</span>Your privacy is handled like it matters.</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Health details, travel documents and family circumstances move only through controlled channels —
            never through web forms, never stored on our servers. We will tell you where to send sensitive
            information, and we will never ask for it in a first message.
          </p>
        </div>

        <h2 style={S.h2}>Why we publish this</h2>
        <p style={S.p}>
          Most travel and medical-travel services in Türkiye are paid by the providers they recommend.
          There is nothing illegal about that model — but it means their advice has two customers, and you
          are only one of them. We chose the other model. Publishing these commitments makes them easy to
          verify and expensive for us to break — which is exactly the point.
        </p>

        <Link href="/#contact" style={S.cta}>Start with a planning consultation</Link>

        <p style={{ ...S.p, marginTop: '34px', fontSize: '13px', color: 'var(--ito-muted)' }}>
          See also: <Link href="/about" style={{ color: 'var(--ito-navy)', fontWeight: 600 }}>About us</Link> ·{' '}
          <Link href="/services" style={{ color: 'var(--ito-navy)', fontWeight: 600 }}>Services</Link> ·{' '}
          <Link href="/legal-notice" style={{ color: 'var(--ito-navy)', fontWeight: 600 }}>Legal Notice</Link>
        </p>
      </div>
    </main>
  );
}
