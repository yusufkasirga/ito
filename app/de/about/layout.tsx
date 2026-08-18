import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Über uns — Itinerary of Türkiye',
  description: 'Lernen Sie Itinerary of Türkiye kennen — Ihre unabhängige Beratung für Medizinreisen und private Türkei-Erlebnisse.',
  alternates: { canonical: 'https://itineraryofturkiye.com/de/about', languages: { en: 'https://itineraryofturkiye.com/about', de: 'https://itineraryofturkiye.com/de/about' } },
};

export default function L({ children }: { children: React.ReactNode }) { return children; }
