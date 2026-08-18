import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Itinerary of Türkiye — Beratung für Medizinreisen & private Türkei-Erlebnisse',
  description: 'Unabhängige Beratung für Medizinreisen und private Türkei-Erlebnisse. Wir planen die Reise, prüfen jeden Anbieter und begleiten Sie — bezahlt von unseren Klienten, niemals durch Provisionen.',
  openGraph: {
    title: 'Itinerary of Türkiye — Private Reiseberatung für die Türkei',
    description: 'Unabhängige Beratung für Medizinreisen und private Türkei-Erlebnisse. Bezahlt von unseren Klienten, niemals durch Provisionen.',
    url: 'https://itineraryofturkiye.com/de',
    locale: 'de_DE',
    type: 'website',
  },
  alternates: { canonical: 'https://itineraryofturkiye.com/de', languages: { en: 'https://itineraryofturkiye.com/', de: 'https://itineraryofturkiye.com/de' } },
};

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
