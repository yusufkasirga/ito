import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — Itinerary of Türkiye',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(150deg, #071726, #0c3555)', padding: '32px', textAlign: 'center' }}>
      <div>
        <p style={{ color: '#c9a96a', fontSize: '12px', fontWeight: 900, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '18px' }}>— 404 —</p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(34px, 6vw, 64px)', color: '#fff', lineHeight: 1.05, marginBottom: '18px' }}>
          This road does not<br />lead anywhere.
        </h1>
        <p style={{ color: 'rgba(255,250,241,.65)', fontSize: '16px', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 30px' }}>
          The page you are looking for has moved or never existed. Türkiye, however, is very much still here — let us take you there.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ padding: '14px 26px', borderRadius: '999px', background: 'linear-gradient(135deg, #c9a96a, #b8955a)', color: '#071726', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>Back to Home</a>
          <a href="/blogs" style={{ padding: '14px 26px', borderRadius: '999px', border: '1px solid rgba(255,250,241,.3)', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Browse Our Guides</a>
        </div>
      </div>
    </main>
  );
}
