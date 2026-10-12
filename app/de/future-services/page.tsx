import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
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
    <main style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", background: 'var(--ito-ivory)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: var(--ito-navy); --navy: var(--ito-navy); --navy-2: var(--ito-navy-lift);
          --gold: var(--ito-gold); --ivory: var(--ito-ivory);
          --muted: var(--ito-muted); --line: rgba(16,36,58,.14);
          --shadow-md: 0 8px 24px rgba(16,36,58,.12);
        }
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(250,247,240,.95); border-bottom: 1px solid var(--line); backdrop-filter: blur(20px); }
        .nav-inner { max-width: 1240px; margin: 0 auto; height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .brand { text-decoration: none; display: flex; align-items: center; }
        .brand img { height: 84px; width: 84px; object-fit: contain; background: var(--ito-ivory); border-radius: 50%; padding: 6px; box-shadow: 0 2px 12px rgba(16,36,58,.22); }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover { color: var(--ito-navy); }

        .page { max-width: 760px; margin: 0 auto; padding: 72px 32px 96px; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--ito-navy); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        h1 { font-family: var(--font-playfair), serif; font-size: clamp(32px, 5vw, 54px); color: var(--navy); line-height: 1.05; margin-bottom: 18px; }
        .lede { color: var(--muted); font-size: 16px; line-height: 1.8; margin-bottom: 56px; }
        .lede a { color: var(--ito-navy); font-weight: 700; text-decoration: none; }
        .lede a:hover { text-decoration: underline; }

        .svc { padding: 32px 0; border-top: 1px solid var(--line); }
        .svc h2 { font-family: var(--font-playfair), serif; font-size: 26px; color: var(--navy); margin-bottom: 14px; }
        .svc p { color: var(--ito-navy); font-size: 15.5px; line-height: 1.85; margin-bottom: 14px; }
        .svc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .svc-tag { padding: 5px 13px; background: rgba(240,202,145,.08); color: var(--ito-navy); border: 1px solid rgba(240,202,145,.22); border-radius: 999px; font-size: 11.5px; font-weight: 700; }

        .cta { margin-top: 56px; padding: 32px; border: 1px solid var(--line); border-radius: 20px; background: var(--ito-ivory); }
        .cta h3 { font-family: var(--font-playfair), serif; font-size: 20px; color: var(--navy); margin-bottom: 10px; }
        .cta p { color: var(--muted); font-size: 14px; line-height: 1.7; margin-bottom: 18px; }
        .btn-primary { min-height: 46px; padding: 0 24px; border-radius: 999px; background: linear-gradient(135deg, var(--ito-navy), var(--navy-2)); color: var(--ito-ivory); font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; box-shadow: var(--shadow-md); }

        .footer { background: var(--ink); color: rgba(250,247,240,.6); padding: 40px 0; text-align: center; font-size: 13px; }
        .footer a { color: rgba(250,247,240,.6); }

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

      <header className="nav">
        <div className="nav-inner">
          <Link className="brand" href="/de"><Image src="/logo.png" alt="Itinerary of Türkiye" width={96} height={96} /></Link>
          <nav className="nav-links" aria-label="Primary">
            <Link href="/de/about">Über uns</Link>
            <Link href="/de/services">Leistungen</Link>
            <Link href="/de/testimonials">Referenzen</Link>
            <Link href="/de#contact">Kontakt</Link>
                      <Link href="/future-services" style={{fontWeight:800, opacity:.85}} aria-label="English version">EN</Link>
          </nav>
        </div>
      </header>

      <div className="page">
        <span className="eyebrow">Weitere Leistungen</span>
        <h1>Mehr als Reise und Behandlung.</h1>
        <p className="lede">
          Unser Kerngeschäft sind <Link href="/de#health">Medizinreisen</Link> und <Link href="/de#tourism">private Türkei-Erlebnisse</Link>.
          Für Klienten, die darüber hinaus Unterstützung brauchen, bieten wir auf Anfrage zudem die folgenden Beratungsleistungen an.
        </p>

        <section className="svc" id="business" aria-labelledby="business-h">
          <h2 id="business-h">Business-Beratung</h2>
          <p>Die Türkei ist ein florierender Knotenpunkt für internationalen Handel und Investitionen. Mit unserem branchenübergreifenden Netzwerk sind wir die verlässliche Brücke zu einer produktiven, erfolgreichen Geschäftsreise — von Kontaktvermittlung und Meetings über Logistik bis zu Übersetzung und lokalen Einblicken.</p>
          <div className="svc-tags">
            <span className="svc-tag">Kontaktvermittlung</span>
            <span className="svc-tag">Meetings</span>
            <span className="svc-tag">Übersetzung</span>
            <span className="svc-tag">Logistik</span>
            <span className="svc-tag">Lokale Einblicke</span>
          </div>
        </section>

        <section className="svc" id="investment" aria-labelledby="investment-h">
          <h2 id="investment-h">Investment &amp; Real Estate</h2>
          <p>Türkiye&apos;s real estate market offers exceptional opportunities for foreign investors — but navigating it without the right guidance can be a challenge. Itinerary of Türkiye gives you access to vetted listings, trusted developers, and expert local advice, helping you find and secure your ideal property with complete confidence.</p>
          <p>Von der kosmopolitischen Energie Istanbuls bis zu den sonnenverwöhnten Küsten von Bodrum und Antalya — die Türkei bietet eine außergewöhnliche Bandbreite an Immobilien für jeden Investorentyp und jeden Traum.</p>
          <p>Für viele ausländische Käufer ist die größte Hürde jedoch nicht die Investitionsentscheidung, sondern der Einstieg. Wir verschaffen Ihnen direkten Zugang zu geprüften Angeboten, verlässlichen Bauträgern sowie erfahrenen Rechts- und Finanzberatern, die die Bedürfnisse internationaler Käufer verstehen.</p>
          <div className="svc-tags">
            <span className="svc-tag">Geprüfte Angebote</span>
            <span className="svc-tag">Verlässliche Bauträger</span>
            <span className="svc-tag">Rechtsberatung</span>
            <span className="svc-tag">Immobiliensuche</span>
          </div>
        </section>

        <div className="cta">
          <h3>Interessiert an einer dieser Leistungen?</h3>
          <p>Schreiben Sie uns kurz, was Sie benötigen — wir sagen Ihnen ehrlich, ob und wie wir helfen können. Bitte fügen Sie Ihrer ersten Nachricht keine sensiblen Dokumente bei.</p>
          <a className="btn-primary" href={whatsAppUrl('Hello! I would like to ask about your business / investment advisory services.')} target="_blank" rel="noopener noreferrer">Fragen Sie uns auf WhatsApp</a>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <Link href="/de/privacy" style={{color:'inherit'}}>Datenschutz</Link> · <Link href="/de/terms" style={{color:'inherit'}}>AGB</Link> · <Link href="/de/impressum" style={{color:'inherit'}}>Impressum</Link> · <Link href="/de/blogs" style={{color:'inherit'}}>Ratgeber</Link> · <Link href="/de">Startseite</Link></p>
      </footer>
    </main>
  );
}
