import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Kundenstimmen — Itinerary of Türkiye',
  description: 'Was unsere Kunden aus UK, USA, Australien und darüber hinaus über die Zusammenarbeit mit Itinerary of Türkiye sagen (übersetzt).',
  alternates: { canonical: 'https://itineraryofturkiye.com/de/testimonials', languages: { en: 'https://itineraryofturkiye.com/testimonials', de: 'https://itineraryofturkiye.com/de/testimonials' } },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
