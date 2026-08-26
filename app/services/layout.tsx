import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services — Itinerary of Türkiye',
  description: 'Tourism, medical tourism, business advisory and real estate investment services in Türkiye — one trusted local partner for everything.',
  alternates: { canonical: 'https://itineraryofturkiye.com/services', languages: { en: 'https://itineraryofturkiye.com/services', de: 'https://itineraryofturkiye.com/de/services' } },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
