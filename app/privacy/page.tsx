import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy — Itinerary of Türkiye',
  description: 'How Itinerary of Türkiye handles enquiry forms, private enquiry records, email and WhatsApp contact, and your rights under GDPR and KVKK.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "var(--font-inter), system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', color: '#3a4654' },
  wrap: { maxWidth: '760px', margin: '0 auto', padding: '48px 32px 80px' },
  h1: { fontFamily: "var(--font-playfair), serif", fontSize: 'clamp(30px,5vw,44px)', color: '#081f35', marginBottom: '10px' },
  meta: { fontSize: '13px', color: '#647889', marginBottom: '36px' },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: '22px', color: '#081f35', margin: '34px 0 12px' },
  p: { fontSize: '15.5px', lineHeight: 1.85, marginBottom: '16px' },
  back: { display: 'inline-block', color: '#c9a96a', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '13px' },
};

export default function PrivacyPage() {
  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <Link href="/" style={S.back}>← Back to home</Link>
        <h1 style={S.h1}>Privacy Policy</h1>
        <p style={S.meta}>Last updated: 26 October 2026</p>

        <h2 style={S.h2}>Who we are</h2>
        <p style={S.p}>Itinerary of Türkiye (Yenibosna Tax Office, Tax No. 76003842, Istanbul, Türkiye) (&quot;we&quot;, &quot;us&quot;) operates itineraryofturkiye.com. We act as the data controller for the processing described below. You can contact us through the contact section of our website.</p>

        <h2 style={S.h2}>Enquiry forms</h2>
        <p style={S.p}>Visitors do not need to create an account. When you submit an enquiry form, we collect your name, country, email address and/or phone number, service of interest, planned timing and preferred contact method. We also receive the form language and the page from which you submitted it. We use this information to respond to your enquiry and coordinate the next steps you request.</p>
        <p style={S.p}>Enquiry records, their follow-up status and internal team notes are stored in private Vercel Blob storage. Authorised team members can view and update these records through a password-protected administration area. The form also uses Web3Forms to send our team an email notification containing the enquiry details. An email notification is separate from the saved enquiry record.</p>

        <h2 style={S.h2}>Administration and security</h2>
        <p style={S.p}>The administration area uses an essential sign-in cookie lasting up to eight hours. It is HttpOnly, so browser scripts cannot read it, and contains no enquiry details. This cookie is used for team access, not for visitor accounts. To limit abusive submissions and sign-in attempts, the application uses rate-limit identifiers; where an IP address is used, only a keyed hash is stored for this purpose, not the raw address in an enquiry record.</p>

        <h2 style={S.h2}>WhatsApp contact</h2>
        <p style={S.p}>If you choose to contact us, your message is transmitted via WhatsApp (Meta Platforms Ireland Ltd.) under WhatsApp&apos;s own terms and privacy policy. We receive your name, phone number and message content, and manage conversations in our customer relationship tools in order to respond to your inquiry. Legal basis: steps taken prior to entering into a contract (GDPR Art. 6(1)(b)) and our legitimate interest in responding to inquiries (Art. 6(1)(f)).</p>

        <h2 style={S.h2}>Please do not send sensitive data</h2>
        <p style={S.p}>Do not send medical reports, photos, passport documents or payment details via the form or chat. If you share health information voluntarily, we use it only to arrange the consultation you requested and delete it when it is no longer needed.</p>

        <h2 style={S.h2}>Service providers</h2>
        <p style={S.p}>Vercel hosts this website and provides the private storage used for enquiry records. Standard server logs (such as IP address and browser information) may be processed for security and delivery purposes. Web3Forms processes enquiry details to deliver the email notification to our team. See <a href="https://vercel.com/docs/vercel-blob/using-blob-sdk" style={{color:'#8a6d33'}}>Vercel&apos;s storage documentation</a> and <a href="https://docs.web3forms.com/getting-started/faq" style={{color:'#8a6d33'}}>Web3Forms&apos; privacy information</a> for further provider information.</p>

        <h2 style={S.h2}>Retention</h2>
        <p style={S.p}>Enquiry and conversation records are kept only as long as needed to handle your inquiry and any resulting engagement, and are then deleted. This applies to saved enquiry records, internal notes and related email correspondence.</p>

        <h2 style={S.h2}>Your rights</h2>
        <p style={S.p}>Depending on your location, you may have the right to access, correct, delete, restrict or port your data, and to object to processing (GDPR Art. 15–21; Turkish KVKK Art. 11). To exercise these rights, contact us through the website. You may also lodge a complaint with your supervisory authority (in Türkiye: KVKK; in the EU: your local data protection authority; in the UK: the ICO).</p>

        <h2 style={S.h2}>Changes</h2>
        <p style={S.p}>We will post any updates to this policy on this page.</p>

        <p style={{...S.p, marginTop:'34px', fontSize:'13px', color:'#647889'}}>See also: <Link href="/terms" style={{color:'#8a6d33',fontWeight:600}}>Terms of Service</Link> · <Link href="/legal-notice" style={{color:'#8a6d33',fontWeight:600}}>Legal Notice</Link></p>
      </div>
    </main>
  );
}
