import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unsere Leistungen — Itinerary of Türkiye',
  description: 'Kuratierte Reiseerlebnisse und medizinische Koordination in der Türkei — mit geprüften Partnerkliniken und persönlicher Begleitung.',
  alternates: { canonical: 'https://itineraryofturkiye.com/de/services', languages: { en: 'https://itineraryofturkiye.com/services', de: 'https://itineraryofturkiye.com/de/services' } },
};

export default function L({ children }: { children: React.ReactNode }) { return children; }
