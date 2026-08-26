import type { Metadata } from 'next';
import SiteHeader from '../components/SiteHeader';
import { SITE_URL, whatsAppUrl } from '@/lib/config';

// =====================================================
// FUTURE SERVICES — footer-only entry point.
// Deliberately quieter than the primary Medical Travel /
// Private Türkiye Experience journeys: no hero imagery,
// no bento grids, no animated trust elements. Editorial
// text page. Indexable (no noindex) per owner decision.
// All service copy relocated verbatim from the previous
// /services entries 03–04 and the former homepage
// #investment section — nothing rewritten.
// =====================================================

export const metadata: Metadata = {
  title: 'Future Services — Business & Investment Advisory | Itinerary of Türkiye',
  description:
    'Business advisory and investment & real estate support in Türkiye — introductions, meetings, vetted listings and expert local advice. Available on request alongside our core medical travel and private experience services.',
  alternates: { canonical: `${SITE_URL}/future-services` },
  openGraph: {
    title: 'Future Services — Itinerary of Türkiye',
    description:
      'Business advisory and investment & real estate support in Türkiye, available on request.',
    url: `${SITE_URL}/future-services`,
    siteName: 'Itinerary of Türkiye',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Future Services', item: `${SITE_URL}/future-services` },
  ],
};

export default function FutureServicesPage() {
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #071726; --navy: #081f35; --navy-2: #0c3555;
          --gold: #c9a96a; --ivory: #fffaf1;
          --muted: #647889; --line: rgba(8,31,53,.14);
          --shadow-md: 0 8px 24px rgba(7,23,38,.12);
        }
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,250,241,.95); border-bottom: 1px solid var(--line); backdrop-filter: blur(20px); }
        .nav-inner { max-width: 1240px; margin: 0 auto; height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .brand { text-decoration: none; display: flex; align-items: center; }
        .brand img { height: 84px; width: 84px; object-fit: contain; background: #fffdf7; border-radius: 50%; padding: 6px; box-shadow: 0 2px 12px rgba(0,0,0,.22); }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover { color: var(--gold); }

        .page { max-width: 760px; margin: 0 auto; padding: 72px 32px 96px; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 54px); color: var(--navy); line-height: 1.05; margin-bottom: 18px; }
        .lede { color: var(--muted); font-size: 16px; line-height: 1.8; margin-bottom: 56px; }
        .lede a { color: var(--gold); font-weight: 700; text-decoration: none; }
        .lede a:hover { text-decoration: underline; }

        .svc { padding: 32px 0; border-top: 1px solid var(--line); }
        .svc h2 { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--navy); margin-bottom: 14px; }
        .svc p { color: #3a4654; font-size: 15.5px; line-height: 1.85; margin-bottom: 14px; }
        .svc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .svc-tag { padding: 5px 13px; background: rgba(201,169,106,.08); color: var(--gold); border: 1px solid rgba(201,169,106,.22); border-radius: 999px; font-size: 11.5px; font-weight: 700; }

        .cta { margin-top: 56px; padding: 32px; border: 1px solid var(--line); border-radius: 20px; background: #fff; }
        .cta h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--navy); margin-bottom: 10px; }
        .cta p { color: var(--muted); font-size: 14px; line-height: 1.7; margin-bottom: 18px; }
        .btn-primary { min-height: 46px; padding: 0 24px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; box-shadow: var(--shadow-md); }

        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }
        .footer a { color: rgba(255,250,241,.6); }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        }
        @media (max-width: 700px) {
          .nav-inner { height: auto; flex-wrap: wrap; padding: 10px 16px; gap: 6px; justify-content: center; }
          .brand img { height: 62px; width: 62px; padding: 5px; }
          .nav-links { flex-wrap: wrap; justify-content: center; gap: 12px 16px; }
          .nav-links a { font-size: 13px; }
          .page { padding: 48px 20px 72px; }
        }
      `}</style>

      <SiteHeader />

      <div className="page">
        <span className="eyebrow">Future Services</span>
        <h1>Beyond travel and care.</h1>
        <p className="lede">
          Our core focus is <a href="/#health">medical travel</a> and <a href="/#tourism">private Türkiye experiences</a>.
          For clients who need support beyond that, we also provide the following advisory services on request.
        </p>

        <section className="svc" id="business" aria-labelledby="business-h">
          <h2 id="business-h">Business Advisory</h2>
          <p>Türkiye is a thriving hub for international trade and investment. With our extensive network spanning multiple industries, we act as a firm bridge between you and a productive, successful business trip. From introductions and meetings to logistics and local insights — we keep your business moving.</p>
          <div className="svc-tags">
            <span className="svc-tag">Introductions</span>
            <span className="svc-tag">Meetings</span>
            <span className="svc-tag">Translation</span>
            <span className="svc-tag">Logistics</span>
            <span className="svc-tag">Local Insights</span>
          </div>
        </section>

        <section className="svc" id="investment" aria-labelledby="investment-h">
          <h2 id="investment-h">Investment &amp; Real Estate</h2>
          <p>Türkiye&apos;s real estate market offers exceptional opportunities for foreign investors — but navigating it without the right guidance can be a challenge. Itinerary of Türkiye gives you access to vetted listings, trusted developers, and expert local advice, helping you find and secure your ideal property with complete confidence.</p>
          <p>From the cosmopolitan energy of Istanbul to the sun-drenched coastlines of Bodrum and Antalya — Türkiye offers an extraordinary range of properties for every type of investor and every kind of dream.</p>
          <p>Yet for many foreign buyers, the biggest challenge is not the decision to invest — it is knowing where to start. We give you direct access to vetted listings, trusted developers, and experienced legal and financial advisors who understand the needs of foreign investors.</p>
          <div className="svc-tags">
            <span className="svc-tag">Vetted Listings</span>
            <span className="svc-tag">Trusted Developers</span>
            <span className="svc-tag">Legal Advice</span>
            <span className="svc-tag">Property Search</span>
          </div>
        </section>

        <div className="cta">
          <h3>Interested in one of these services?</h3>
          <p>Send us a short note describing what you need — we will tell you honestly whether and how we can help. Please do not include sensitive documents in your first message.</p>
          <a className="btn-primary" href={whatsAppUrl('Hello! I would like to ask about your business / investment advisory services.')} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/privacy" style={{color:'inherit'}}>Privacy</a> · <a href="/terms" style={{color:'inherit'}}>Terms</a> · <a href="/legal-notice" style={{color:'inherit'}}>Legal Notice</a> · <a href="/blogs" style={{color:'inherit'}}>Guides</a> · <a href="/">Home</a></p>
      </footer>
    </main>
  );
}
