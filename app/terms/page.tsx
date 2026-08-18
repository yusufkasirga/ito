import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms of Service — Itinerary of Türkiye',
  description: 'Terms of service for Itinerary of Türkiye: the scope of our advisory role, informational content, liability and governing law.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', color: '#3a4654' },
  wrap: { maxWidth: '760px', margin: '0 auto', padding: '48px 32px 80px' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px,5vw,44px)', color: '#081f35', marginBottom: '10px' },
  meta: { fontSize: '13px', color: '#647889', marginBottom: '36px' },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#081f35', margin: '34px 0 12px' },
  p: { fontSize: '15.5px', lineHeight: 1.85, marginBottom: '16px' },
  back: { display: 'inline-block', color: '#c9a96a', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '13px' },
};

export default function TermsPage() {
  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <a href="/" style={S.back}>← Back to home</a>
        <h1 style={S.h1}>Terms of Service</h1>
        <p style={S.meta}>Last updated: 17 July 2026</p>

        <h2 style={S.h2}>1. Who we are</h2>
        <p style={S.p}>Itinerary of Türkiye (Yenibosna Tax Office, Tax No. 76003842, Istanbul, Türkiye) provides consultancy and coordination services for visitors to Türkiye, including private travel experiences, medical travel facilitation, and related services on request.</p>

        <h2 style={S.h2}>2. We are not a healthcare provider</h2>
        <p style={S.p}>We do not provide medical advice, diagnosis or treatment. All medical services are delivered by independent licensed clinics and physicians in Türkiye, under their own responsibility and their own terms. Any decision about treatment is made between you and the treating clinic or physician.</p>

        <h2 style={S.h2}>3. Informational content</h2>
        <p style={S.p}>Content on this website — including blog articles and indicative price ranges — is general information, not an offer, quotation or guarantee. Prices, availability and outcomes vary by individual case and provider.</p>

        <h2 style={S.h2}>4. No online booking or payment</h2>
        <p style={S.p}>This website does not process bookings or payments. Any engagement of our services is agreed separately and in writing.</p>

        <h2 style={S.h2}>5. Liability</h2>
        <p style={S.p}>To the extent permitted by applicable law, we are not liable for services rendered by third-party providers (including clinics, physicians, hotels, transport and tour providers), nor for indirect or consequential losses. Nothing in these terms limits liability that cannot be limited by law.</p>

        <h2 style={S.h2}>6. Intellectual property</h2>
        <p style={S.p}>The content and branding on this website belong to Itinerary of Türkiye or its licensors and may not be reused without permission.</p>

        <h2 style={S.h2}>7. Governing law and disputes</h2>
        <p style={S.p}>These terms are governed by the laws of the Republic of Türkiye, and the courts of Istanbul have jurisdiction, without prejudice to any mandatory consumer protections that apply in your country of residence.</p>

        <h2 style={S.h2}>8. Contact</h2>
        <p style={S.p}>For any questions about these terms, contact us through the contact section of itineraryofturkiye.com.</p>
        <p style={{...S.p, marginTop:'34px', fontSize:'13px', color:'#647889'}}>See also: <a href="/privacy" style={{color:'#8a6d33',fontWeight:600}}>Privacy Policy</a> · <a href="/legal-notice" style={{color:'#8a6d33',fontWeight:600}}>Legal Notice</a></p>
      </div>
    </main>
  );
}
