import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy — Itinerary of Türkiye',
  description: 'How Itinerary of Türkiye handles your personal data: what this website does and does not collect, WhatsApp contact, your rights under GDPR and KVKK.',
  alternates: { canonical: `${SITE_URL}/privacy` },
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

export default function PrivacyPage() {
  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <a href="/" style={S.back}>← Back to home</a>
        <h1 style={S.h1}>Privacy Policy</h1>
        <p style={S.meta}>Last updated: 17 July 2026</p>

        <h2 style={S.h2}>Who we are</h2>
        <p style={S.p}>Itinerary of Türkiye (Yenibosna Tax Office, Tax No. 76003842, Istanbul, Türkiye) (&quot;we&quot;, &quot;us&quot;) operates itineraryofturkiye.com. We act as the data controller for the processing described below. You can contact us through the contact section of our website.</p>

        <h2 style={S.h2}>What this website does not collect</h2>
        <p style={S.p}>Our website has no user accounts, no server-side forms and no tracking cookies. The application form on this site prepares a message in your browser only — nothing you type into it is stored on our servers.</p>

        <h2 style={S.h2}>WhatsApp contact</h2>
        <p style={S.p}>If you choose to contact us, your message is transmitted via WhatsApp (Meta Platforms Ireland Ltd.) under WhatsApp&apos;s own terms and privacy policy. We receive your name, phone number and message content, and manage conversations in our customer relationship tools in order to respond to your inquiry. Legal basis: steps taken prior to entering into a contract (GDPR Art. 6(1)(b)) and our legitimate interest in responding to inquiries (Art. 6(1)(f)).</p>

        <h2 style={S.h2}>Please do not send sensitive data</h2>
        <p style={S.p}>Do not send medical reports, photos, passport documents or payment details via the form or chat. If you share health information voluntarily, we use it only to arrange the consultation you requested and delete it when it is no longer needed.</p>

        <h2 style={S.h2}>Hosting</h2>
        <p style={S.p}>This site is hosted on Vercel. Standard server logs (such as IP address and browser information) may be processed briefly for security and delivery purposes.</p>

        <h2 style={S.h2}>Retention</h2>
        <p style={S.p}>Conversation records are kept only as long as needed to handle your inquiry and any resulting engagement, and are then deleted.</p>

        <h2 style={S.h2}>Your rights</h2>
        <p style={S.p}>Depending on your location, you may have the right to access, correct, delete, restrict or port your data, and to object to processing (GDPR Art. 15–21; Turkish KVKK Art. 11). To exercise these rights, contact us through the website. You may also lodge a complaint with your supervisory authority (in Türkiye: KVKK; in the EU: your local data protection authority; in the UK: the ICO).</p>

        <h2 style={S.h2}>Changes</h2>
        <p style={S.p}>We will post any updates to this policy on this page.</p>

        <p style={{...S.p, marginTop:'34px', fontSize:'13px', color:'#647889'}}>See also: <a href="/terms" style={{color:'#8a6d33',fontWeight:600}}>Terms of Service</a> · <a href="/legal-notice" style={{color:'#8a6d33',fontWeight:600}}>Legal Notice</a></p>
      </div>
    </main>
  );
}
