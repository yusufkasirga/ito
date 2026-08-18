import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — Itinerary of Türkiye',
  description: 'Wie Itinerary of Türkiye mit Ihren personenbezogenen Daten umgeht: Was diese Website erhebt und was nicht, WhatsApp-Kontakt, Ihre Rechte nach DSGVO und KVKK.',
  alternates: { canonical: `${SITE_URL}/de/privacy`, languages: { en: `${SITE_URL}/privacy`, de: `${SITE_URL}/de/privacy` } },
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

export default function PrivacyPageDe() {
  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <a href="/de" style={S.back}>← Zur Startseite</a>
        <h1 style={S.h1}>Datenschutzerklärung</h1>
        <p style={S.meta}>Zuletzt aktualisiert: 17. Juli 2026</p>
        <p style={S.note}>Diese Übersetzung dient Ihrer Information. Rechtlich maßgeblich ist die <a href="/privacy" style={{color:'#8a6d33'}}>englische Fassung</a>.</p>

        <h2 style={S.h2}>Wer wir sind</h2>
        <p style={S.p}>Itinerary of Türkiye (Finanzamt Yenibosna, Steuernr. 76003842, Istanbul, Türkei) („wir") betreibt itineraryofturkiye.com. Wir sind Verantwortliche für die unten beschriebene Verarbeitung. Sie erreichen uns über den Kontaktbereich unserer Website.</p>

        <h2 style={S.h2}>Was diese Website nicht erhebt</h2>
        <p style={S.p}>Unsere Website hat keine Benutzerkonten, keine serverseitigen Formulare und keine Tracking-Cookies. Das Anfrageformular bereitet eine Nachricht ausschließlich in Ihrem Browser vor — nichts davon wird auf unseren Servern gespeichert.</p>

        <h2 style={S.h2}>Kontakt über WhatsApp</h2>
        <p style={S.p}>Wenn Sie uns kontaktieren, wird Ihre Nachricht über WhatsApp (Meta Platforms Ireland Ltd.) gemäß deren eigenen Bedingungen und Datenschutzrichtlinien übermittelt. Wir erhalten Ihren Namen, Ihre Telefonnummer und den Nachrichteninhalt und verwalten Konversationen in unseren CRM-Werkzeugen, um Ihre Anfrage zu beantworten. Rechtsgrundlagen: vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO) und unser berechtigtes Interesse an der Beantwortung von Anfragen (lit. f).</p>

        <h2 style={S.h2}>Bitte keine sensiblen Daten senden</h2>
        <p style={S.p}>Senden Sie über Formular oder Chat keine Arztberichte, Fotos, Passdokumente oder Zahlungsdaten. Teilen Sie freiwillig Gesundheitsinformationen mit, verwenden wir diese nur zur Organisation der von Ihnen gewünschten Beratung und löschen sie, sobald sie nicht mehr benötigt werden.</p>

        <h2 style={S.h2}>Hosting</h2>
        <p style={S.p}>Diese Website wird bei Vercel gehostet. Übliche Server-Logs (z. B. IP-Adresse, Browserinformationen) können kurzzeitig zu Sicherheits- und Auslieferungszwecken verarbeitet werden.</p>

        <h2 style={S.h2}>Speicherdauer</h2>
        <p style={S.p}>Konversationsdaten werden nur so lange aufbewahrt, wie es zur Bearbeitung Ihrer Anfrage und einer etwaigen Beauftragung erforderlich ist, und anschließend gelöscht.</p>

        <h2 style={S.h2}>Ihre Rechte</h2>
        <p style={S.p}>Je nach Wohnsitz haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO; Art. 11 des türkischen KVKK). Kontaktieren Sie uns dazu über die Website. Sie können sich zudem bei Ihrer Aufsichtsbehörde beschweren (Türkei: KVKK; EU: Ihre lokale Datenschutzbehörde; UK: ICO).</p>

        <h2 style={S.h2}>Änderungen</h2>
        <p style={S.p}>Aktualisierungen dieser Erklärung veröffentlichen wir auf dieser Seite.</p>
        <p style={{...S.p, marginTop:'34px', fontSize:'13px', color:'#647889'}}>Weitere Angaben: <a href="/de/terms" style={{color:'#8a6d33',fontWeight:600}}>AGB</a> · <a href="/de/impressum" style={{color:'#8a6d33',fontWeight:600}}>Impressum</a></p>
      </div>
    </main>
  );
}
