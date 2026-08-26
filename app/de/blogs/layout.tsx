import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reiseratgeber & Artikel — Itinerary of Türkiye',
  description:
    'Ratgeber zu medizinischen Reisen, Haartransplantation, Zahnbehandlung und privaten Türkei-Erlebnissen — geschrieben von unserem Team vor Ort in der Türkei.',
  alternates: {
    canonical: 'https://itineraryofturkiye.com/de/blogs',
    languages: {
      en: 'https://itineraryofturkiye.com/blogs',
      de: 'https://itineraryofturkiye.com/de/blogs',
      'x-default': 'https://itineraryofturkiye.com/blogs',
    },
  },
  openGraph: {
    title: 'Reiseratgeber & Artikel — Itinerary of Türkiye',
    description: 'Ratgeber zu medizinischen Reisen und privaten Türkei-Erlebnissen.',
    url: 'https://itineraryofturkiye.com/de/blogs',
    siteName: 'Itinerary of Türkiye',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function DeBlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
