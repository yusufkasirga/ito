import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Nutzungsbedingungen — Itinerary of Türkiye',
  description: 'Nutzungsbedingungen von Itinerary of Türkiye: Umfang unserer Beratungsrolle, Informationsinhalte, Haftung und anwendbares Recht.',
  alternates: { canonical: `${SITE_URL}/de/terms`, languages: { en: `${SITE_URL}/terms`, de: `${SITE_URL}/de/terms` } },
};

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', color: '#3a4654' },
  wrap: { maxWidth: '760px', margin: '0 auto', padding: '48px 32px 80px' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px,5vw,44px)', color: '#081f35', marginBottom: '10px' },
  meta: { fontSize: '13px', color: '#647889', marginBottom: '14px' },
  note: { fontSize: '12.5px', color: '#647889', background: 'rgba(201,169,106,.1)', border: '1px solid rgba(201,169,106,.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '30px', lineHeight: 1.6 },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#081f35', margin: '34px 0 12px' },
  p: { fontSize: '15.5px', lineHeight: 1.85, marginBottom: '16px' },
  back: { display: 'inline-block', color: '#c9a96a', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '13px' },
};

export default function TermsPageDe() {
  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <a href="/de" style={S.back}>← Zur Startseite</a>
        <h1 style={S.h1}>Nutzungsbedingungen</h1>
        <p style={S.meta}>Zuletzt aktualisiert: 17. Juli 2026</p>
        <p style={S.note}>Diese Übersetzung dient Ihrer Information. Rechtlich maßgeblich ist die <a href="/terms" style={{color:'#8a6d33'}}>englische Fassung</a>.</p>

        <h2 style={S.h2}>1. Wer wir sind</h2>
        <p style={S.p}>Itinerary of Türkiye (Finanzamt Yenibosna, Steuernr. 76003842, Istanbul, Türkei) erbringt Beratungs- und Koordinationsleistungen für Besucher der Türkei, darunter private Reiseerlebnisse, die Organisation von Medizinreisen und verwandte Leistungen auf Anfrage.</p>

        <h2 style={S.h2}>2. Wir sind kein Gesundheitsdienstleister</h2>
        <p style={S.p}>Wir erbringen keine medizinische Beratung, Diagnose oder Behandlung. Alle medizinischen Leistungen werden von unabhängigen, lizenzierten Kliniken und Ärzten in der Türkei in eigener Verantwortung und zu deren eigenen Bedingungen erbracht. Jede Behandlungsentscheidung treffen Sie mit der behandelnden Klinik bzw. dem behandelnden Arzt.</p>

        <h2 style={S.h2}>3. Informationsinhalte</h2>
        <p style={S.p}>Inhalte dieser Website — einschließlich Blogartikeln und unverbindlicher Preisspannen — sind allgemeine Informationen und kein Angebot, kein Kostenvoranschlag und keine Garantie. Preise, Verfügbarkeit und Ergebnisse variieren je nach Einzelfall und Anbieter.</p>

        <h2 style={S.h2}>4. Keine Online-Buchung oder -Zahlung</h2>
        <p style={S.p}>Diese Website wickelt keine Buchungen oder Zahlungen ab. Eine Beauftragung unserer Leistungen wird gesondert und schriftlich vereinbart.</p>

        <h2 style={S.h2}>5. Haftung</h2>
        <p style={S.p}>Soweit gesetzlich zulässig, haften wir nicht für Leistungen von Drittanbietern (einschließlich Kliniken, Ärzten, Hotels, Transport- und Touranbietern) sowie nicht für mittelbare Schäden oder Folgeschäden. Gesetzlich nicht beschränkbare Haftung bleibt unberührt.</p>

        <h2 style={S.h2}>6. Geistiges Eigentum</h2>
        <p style={S.p}>Inhalte und Markenzeichen dieser Website gehören Itinerary of Türkiye oder seinen Lizenzgebern und dürfen ohne Genehmigung nicht weiterverwendet werden.</p>

        <h2 style={S.h2}>7. Anwendbares Recht und Gerichtsstand</h2>
        <p style={S.p}>Es gilt das Recht der Republik Türkei; Gerichtsstand ist Istanbul — zwingende Verbraucherschutzrechte Ihres Wohnsitzlandes bleiben unberührt.</p>

        <h2 style={S.h2}>8. Kontakt</h2>
        <p style={S.p}>Bei Fragen zu diesen Bedingungen kontaktieren Sie uns über den Kontaktbereich von itineraryofturkiye.com.</p>
        <p style={{...S.p, marginTop:'34px', fontSize:'13px', color:'#647889'}}>Weitere Angaben: <a href="/de/privacy" style={{color:'#8a6d33',fontWeight:600}}>Datenschutz</a> · <a href="/de/impressum" style={{color:'#8a6d33',fontWeight:600}}>Impressum</a></p>
      </div>
    </main>
  );
}
