import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reiseratgeber & Artikel — Itinerary of Türkiye',
  description:
    'Ratgeber zu medizinischen Reisen, Haartransplantation, Zahnbehandlung und privaten Türkei-Erlebnissen — geschrieben von unserem Team vor Ort in der Türkei.',
  alternates: {
    canonical: 'https://itineraryofturkiye.com/de/blog',
    languages: {
      en: 'https://itineraryofturkiye.com/blog',
      de: 'https://itineraryofturkiye.com/de/blog',
      'x-default': 'https://itineraryofturkiye.com/blog',
    },
  },
  openGraph: {
    title: 'Reiseratgeber & Artikel — Itinerary of Türkiye',
    description: 'Ratgeber zu medizinischen Reisen und privaten Türkei-Erlebnissen.',
    url: 'https://itineraryofturkiye.com/de/blog',
    siteName: 'Itinerary of Türkiye',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function DeBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
