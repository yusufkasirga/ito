import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — Itinerary of Türkiye',
  description: 'Wie Itinerary of Türkiye Anfrageformulare, private Anfragedaten sowie E-Mail- und WhatsApp-Kontakte verarbeitet und welche Rechte Sie nach DSGVO und KVKK haben.',
  alternates: { canonical: `${SITE_URL}/de/privacy`, languages: { en: `${SITE_URL}/privacy`, de: `${SITE_URL}/de/privacy` } },
};

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "var(--font-inter), system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', color: '#3a4654' },
  wrap: { maxWidth: '760px', margin: '0 auto', padding: '48px 32px 80px' },
  h1: { fontFamily: "var(--font-playfair), serif", fontSize: 'clamp(30px,5vw,44px)', color: '#081f35', marginBottom: '10px' },
  meta: { fontSize: '13px', color: '#647889', marginBottom: '14px' },
  note: { fontSize: '12.5px', color: '#647889', background: 'rgba(201,169,106,.1)', border: '1px solid rgba(201,169,106,.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '30px', lineHeight: 1.6 },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: '22px', color: '#081f35', margin: '34px 0 12px' },
  p: { fontSize: '15.5px', lineHeight: 1.85, marginBottom: '16px' },
  back: { display: 'inline-block', color: '#c9a96a', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '13px' },
};

export default function PrivacyPageDe() {
  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <Link href="/de" style={S.back}>← Zur Startseite</Link>
        <h1 style={S.h1}>Datenschutzerklärung</h1>
        <p style={S.meta}>Zuletzt aktualisiert: 26. Oktober 2026</p>
        <p style={S.note}>Diese Übersetzung dient Ihrer Information. Rechtlich maßgeblich ist die <Link href="/privacy" style={{color:'#8a6d33'}}>englische Fassung</Link>.</p>

        <h2 style={S.h2}>Wer wir sind</h2>
        <p style={S.p}>Itinerary of Türkiye (Finanzamt Yenibosna, Steuernr. 76003842, Istanbul, Türkei) („wir“) betreibt itineraryofturkiye.com. Wir sind Verantwortliche für die unten beschriebene Verarbeitung. Sie erreichen uns über den Kontaktbereich unserer Website.</p>

        <h2 style={S.h2}>Anfrageformulare</h2>
        <p style={S.p}>Besucher müssen kein Benutzerkonto anlegen. Wenn Sie ein Anfrageformular absenden, erfassen wir Ihren Namen, Ihr Land, Ihre E-Mail-Adresse und/oder Telefonnummer, die gewünschte Dienstleistung, Ihren geplanten Zeitraum und Ihren bevorzugten Kontaktweg. Wir erhalten außerdem die Sprache des Formulars und die Seite, von der aus Sie es absenden. Wir verwenden diese Angaben, um Ihre Anfrage zu beantworten und die von Ihnen gewünschten nächsten Schritte abzustimmen.</p>
        <p style={S.p}>Anfragedaten, ihr Bearbeitungsstatus und interne Teamnotizen werden in einem privaten Vercel-Blob-Speicher abgelegt. Berechtigte Teammitglieder können diese Daten in einem passwortgeschützten Verwaltungsbereich einsehen und bearbeiten. Über Web3Forms sendet das Formular unserem Team außerdem eine E-Mail-Benachrichtigung mit den Angaben zur Anfrage. Diese E-Mail-Benachrichtigung ist vom gespeicherten Anfragedatensatz getrennt.</p>

        <h2 style={S.h2}>Verwaltung und Sicherheit</h2>
        <p style={S.p}>Der Verwaltungsbereich verwendet ein notwendiges Anmelde-Cookie mit einer Gültigkeit von bis zu acht Stunden. Es ist als HttpOnly gekennzeichnet, sodass Browser-Skripte es nicht auslesen können, und enthält keine Anfragedaten. Dieses Cookie dient dem Zugang des Teams, nicht einem Besucherkonto. Zur Begrenzung missbräuchlicher Anfragen und Anmeldeversuche verwendet die Anwendung Kennungen für die Anfrageratenbegrenzung. Wird dafür eine IP-Adresse verwendet, speichern wir zu diesem Zweck nur einen mit einem geheimen Schlüssel gebildeten Hashwert; die ursprüngliche IP-Adresse wird nicht im Anfragedatensatz gespeichert.</p>

        <h2 style={S.h2}>Kontakt über WhatsApp</h2>
        <p style={S.p}>Wenn Sie uns kontaktieren, wird Ihre Nachricht über WhatsApp (Meta Platforms Ireland Ltd.) gemäß deren eigenen Bedingungen und Datenschutzrichtlinien übermittelt. Wir erhalten Ihren Namen, Ihre Telefonnummer und den Nachrichteninhalt und verwalten Konversationen in unseren CRM-Werkzeugen, um Ihre Anfrage zu beantworten. Rechtsgrundlagen: vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO) und unser berechtigtes Interesse an der Beantwortung von Anfragen (lit. f).</p>

        <h2 style={S.h2}>Bitte keine sensiblen Daten senden</h2>
        <p style={S.p}>Senden Sie über Formular oder Chat keine Arztberichte, Fotos, Passdokumente oder Zahlungsdaten. Teilen Sie freiwillig Gesundheitsinformationen mit, verwenden wir diese nur zur Organisation der von Ihnen gewünschten Beratung und löschen sie, sobald sie nicht mehr benötigt werden.</p>

        <h2 style={S.h2}>Dienstleister</h2>
        <p style={S.p}>Vercel hostet diese Website und stellt den privaten Speicher für Anfragedaten bereit. Übliche Server-Logs (z. B. IP-Adresse und Browserinformationen) können zu Sicherheits- und Auslieferungszwecken verarbeitet werden. Web3Forms verarbeitet die Angaben zur Anfrage, um unserem Team die E-Mail-Benachrichtigung zuzustellen. Weitere Angaben der Anbieter finden Sie in der <a href="https://vercel.com/docs/vercel-blob/using-blob-sdk" style={{color:'#8a6d33'}}>Speicherdokumentation von Vercel</a> und den <a href="https://docs.web3forms.com/getting-started/faq" style={{color:'#8a6d33'}}>Datenschutzinformationen von Web3Forms</a>.</p>

        <h2 style={S.h2}>Speicherdauer</h2>
        <p style={S.p}>Anfrage- und Konversationsdaten werden nur so lange aufbewahrt, wie es zur Bearbeitung Ihrer Anfrage und einer etwaigen Beauftragung erforderlich ist, und anschließend gelöscht. Dies gilt für gespeicherte Anfragedaten, interne Notizen und die zugehörige E-Mail-Korrespondenz.</p>

        <h2 style={S.h2}>Ihre Rechte</h2>
        <p style={S.p}>Je nach Wohnsitz haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO; Art. 11 des türkischen KVKK). Kontaktieren Sie uns dazu über die Website. Sie können sich zudem bei Ihrer Aufsichtsbehörde beschweren (Türkei: KVKK; EU: Ihre lokale Datenschutzbehörde; UK: ICO).</p>

        <h2 style={S.h2}>Änderungen</h2>
        <p style={S.p}>Aktualisierungen dieser Erklärung veröffentlichen wir auf dieser Seite.</p>
        <p style={{...S.p, marginTop:'34px', fontSize:'13px', color:'#647889'}}>Weitere Angaben: <Link href="/de/terms" style={{color:'#8a6d33',fontWeight:600}}>AGB</Link> · <Link href="/de/impressum" style={{color:'#8a6d33',fontWeight:600}}>Impressum</Link></p>
      </div>
    </main>
  );
}
