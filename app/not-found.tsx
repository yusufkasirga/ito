import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — Itinerary of Türkiye',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(150deg, var(--ito-navy), var(--ito-navy-lift))', padding: '32px', textAlign: 'center' }}>
      <div>
        <p style={{ color: 'var(--ito-gold)', fontSize: '12px', fontWeight: 900, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '18px' }}>— 404 —</p>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 'clamp(34px, 6vw, 64px)', color: 'var(--ito-ivory)', lineHeight: 1.05, marginBottom: '18px' }}>
          This road does not<br />lead anywhere.
        </h1>
        <p style={{ color: 'rgba(250,247,240,.65)', fontSize: '16px', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 30px' }}>
          The page you are looking for has moved or never existed. Türkiye, however, is very much still here — let us take you there.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '14px 26px', borderRadius: '999px', background: 'linear-gradient(135deg, var(--ito-gold), var(--ito-gold))', color: 'var(--ito-navy)', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>Back to Home</Link>
          <Link href="/blogs" style={{ padding: '14px 26px', borderRadius: '999px', border: '1px solid rgba(250,247,240,.3)', color: 'var(--ito-ivory)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Browse Our Guides</Link>
        </div>
      </div>
    </main>
  );
}
