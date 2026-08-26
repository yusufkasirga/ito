import type { Metadata } from 'next';
import SiteHeader from '../components/SiteHeader';
import { SITE_URL, WHATSAPP_E164_NUMBER } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Legal Notice & Company Details — Itinerary of Türkiye',
  description: 'Company identity and contact details for Itinerary of Türkiye: registered details, tax number, email and phone.',
  alternates: { canonical: `${SITE_URL}/legal-notice`, languages: { en: `${SITE_URL}/legal-notice`, de: `${SITE_URL}/de/impressum` } },
};

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', color: '#3a4654' },
  wrap: { maxWidth: '760px', margin: '0 auto', padding: '48px 32px 80px' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px,5vw,44px)', color: '#081f35', marginBottom: '10px' },
  meta: { fontSize: '13px', color: '#647889', marginBottom: '14px' },
  note: { fontSize: '12.5px', color: '#647889', background: 'rgba(201,169,106,.1)', border: '1px solid rgba(201,169,106,.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '30px', lineHeight: 1.6 },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#081f35', margin: '34px 0 12px' },
  p: { fontSize: '15.5px', lineHeight: 1.85, marginBottom: '16px' },
  dl: { fontSize: '15.5px', lineHeight: 1.9, marginBottom: '16px' },
  back: { display: 'inline-block', color: '#8a6d33', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '13px' },
  a: { color: '#8a6d33', fontWeight: 600 },
};

export default function LegalNoticePage() {
  const raw = WHATSAPP_E164_NUMBER || '+905539981836';
  const tel = raw.replace(/\s/g, '');
  // Görüntüde okunur biçim: +90 5XX XXX XX XX
  const d = tel.replace(/\D/g, '');
  const phone = d.length === 12
    ? `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`
    : tel;

  return (
    <main style={S.main}>
      <SiteHeader />
      <div style={S.wrap}>
        <a href="/" style={S.back}>← Back to home</a>
        <h1 style={S.h1}>Legal Notice</h1>
        <p style={S.meta}>Company details · Last updated: 21 July 2026</p>
        <p style={S.note}>
          Itinerary of Türkiye is an advisory business based in Türkiye. These company details are published for
          transparency and to meet provider-identification requirements in the markets we serve.
        </p>

        <h2 style={S.h2}>Provider</h2>
        <div style={S.dl}>
          <strong>Itinerary of Türkiye</strong><br />
          Tax office (Vergi Dairesi): Yenibosna<br />
          Tax number (Vergi No): 76003842<br />
          Registered location: Istanbul, Türkiye
        </div>

        <h2 style={S.h2}>Contact</h2>
        <div style={S.dl}>
          Email: <a href="mailto:info@itineraryofturkiye.com" style={S.a}>info@itineraryofturkiye.com</a><br />
          Phone / WhatsApp: <a href={`tel:${tel}`} style={S.a}>{phone}</a>
        </div>
        <p style={S.p}>
          We normally reply within hours. Please do not send medical reports, photos, identity or payment documents
          in your first message — see our <a href="/privacy" style={S.a}>Privacy Policy</a> for details.
        </p>

        <h2 style={S.h2}>Nature of our service</h2>
        <p style={S.p}>
          Itinerary of Türkiye is an independent advisory and coordination service for medical travel and private
          Türkiye experiences. We are <strong>not</strong> a healthcare provider, clinic or medical practice.
          All treatment is delivered by independent, licensed clinics and practitioners in Türkiye, who are solely
          responsible for their own services. Information on this website is not medical advice, diagnosis or treatment.
        </p>

        <h2 style={S.h2}>Responsibility for content</h2>
        <p style={S.p}>
          Itinerary of Türkiye is responsible for the content of this website at the contact details above.
        </p>

        <h2 style={S.h2}>Accuracy</h2>
        <p style={S.p}>
          Content is prepared with care, but we cannot guarantee that it is accurate, complete or current.
          Prices, procedures, travel and entry requirements are indicative at the time of publication and may change.
        </p>

        <h2 style={S.h2}>External links</h2>
        <p style={S.p}>
          This website links to third-party websites whose content we do not control. Responsibility for those
          pages rests with their respective providers.
        </p>

        <h2 style={S.h2}>Copyright</h2>
        <p style={S.p}>
          Content and works published on this website are protected by copyright. Reproduction, adaptation and
          distribution beyond what is permitted by law require our written consent.
        </p>

        <p style={{ ...S.p, marginTop: '34px', fontSize: '13px', color: '#647889' }}>
          See also: <a href="/privacy" style={S.a}>Privacy Policy</a> ·{' '}
          <a href="/terms" style={S.a}>Terms of Service</a> ·{' '}
          <a href="/de/impressum" style={S.a}>Deutsche Fassung (Impressum)</a>
        </p>
      </div>
    </main>
  );
}
