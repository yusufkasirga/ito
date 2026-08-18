import type { Metadata } from 'next';
import { SITE_URL, WHATSAPP_E164_NUMBER } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Impressum — Itinerary of Türkiye',
  description: 'Anbieterkennzeichnung und Kontaktangaben von Itinerary of Türkiye: Unternehmen, Sitz, Steuernummer, E-Mail und Telefon.',
  alternates: { canonical: `${SITE_URL}/de/impressum`, languages: { en: `${SITE_URL}/legal-notice`, de: `${SITE_URL}/de/impressum` } },
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

export default function ImpressumPage() {
  const raw = WHATSAPP_E164_NUMBER || '+905539981836';
  const tel = raw.replace(/\s/g, '');
  // Görüntüde okunur biçim: +90 5XX XXX XX XX
  const d = tel.replace(/\D/g, '');
  const phone = d.length === 12
    ? `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`
    : tel;

  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <a href="/de" style={S.back}>← Zur Startseite</a>
        <h1 style={S.h1}>Impressum</h1>
        <p style={S.meta}>Anbieterkennzeichnung · Zuletzt aktualisiert: 21. Juli 2026</p>
        <p style={S.note}>
          Itinerary of Türkiye ist ein in der Türkei ansässiges Beratungsunternehmen. Diese Anbieterkennzeichnung
          wird zur Information deutschsprachiger Besucherinnen und Besucher bereitgestellt.
        </p>

        <h2 style={S.h2}>Anbieter</h2>
        <div style={S.dl}>
          <strong>Itinerary of Türkiye</strong><br />
          Finanzamt (Vergi Dairesi): Yenibosna<br />
          Steuernummer (Vergi No): 76003842<br />
          Sitz: Istanbul, Türkei
        </div>

        <h2 style={S.h2}>Kontakt</h2>
        <div style={S.dl}>
          E-Mail: <a href="mailto:info@itineraryofturkiye.com" style={S.a}>info@itineraryofturkiye.com</a><br />
          Telefon / WhatsApp: <a href={`tel:${tel}`} style={S.a}>{phone}</a>
        </div>
        <p style={S.p}>
          Anfragen beantworten wir in der Regel innerhalb weniger Stunden. Bitte senden Sie uns in der ersten
          Kontaktaufnahme keine Arztberichte, Fotos, Ausweis- oder Zahlungsdaten — Einzelheiten dazu finden Sie
          in unserer <a href="/de/privacy" style={S.a}>Datenschutzerklärung</a>.
        </p>

        <h2 style={S.h2}>Art der Tätigkeit</h2>
        <p style={S.p}>
          Itinerary of Türkiye ist ein unabhängiger Beratungs- und Koordinationsdienst für Medizinreisen und
          private Türkei-Erlebnisse. Wir sind <strong>kein</strong> medizinischer Leistungserbringer, keine Klinik
          und keine Praxis. Medizinische Behandlungen werden ausschließlich von eigenständigen, zugelassenen
          Kliniken und Ärztinnen und Ärzten in der Türkei erbracht, die allein für ihre Leistungen verantwortlich sind.
          Informationen auf dieser Website ersetzen keine ärztliche Beratung, Diagnose oder Behandlung.
        </p>

        <h2 style={S.h2}>Verantwortlich für den Inhalt</h2>
        <p style={S.p}>
          Für die Inhalte dieser Website ist Itinerary of Türkiye unter den oben genannten Kontaktangaben verantwortlich.
        </p>

        <h2 style={S.h2}>Haftung für Inhalte</h2>
        <p style={S.p}>
          Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität
          können wir jedoch keine Gewähr übernehmen. Angaben zu Preisen, Verfahren, Reise- und Einreisebestimmungen
          sind unverbindliche Richtwerte zum Zeitpunkt der Veröffentlichung und können sich ändern.
        </p>

        <h2 style={S.h2}>Haftung für Links</h2>
        <p style={S.p}>
          Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
          Für die Inhalte verlinkter Seiten ist stets der jeweilige Anbieter verantwortlich.
        </p>

        <h2 style={S.h2}>Urheberrecht</h2>
        <p style={S.p}>
          Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem Urheberrecht. Vervielfältigung,
          Bearbeitung und Verbreitung außerhalb der gesetzlich zulässigen Grenzen bedürfen unserer schriftlichen Zustimmung.
        </p>

        <h2 style={S.h2}>Streitbeilegung</h2>
        <p style={S.p}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={S.a}>ec.europa.eu/consumers/odr</a>.
          Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <p style={{ ...S.p, marginTop: '34px', fontSize: '13px', color: '#647889' }}>
          Weitere Angaben: <a href="/de/privacy" style={S.a}>Datenschutzerklärung</a> ·{' '}
          <a href="/de/terms" style={S.a}>AGB / Nutzungsbedingungen</a> ·{' '}
          <a href="/legal-notice" style={S.a}>English version</a>
        </p>
      </div>
    </main>
  );
}
