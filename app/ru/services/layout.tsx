import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Услуги — Itinerary of Türkiye',
  description:
    'Медицинский туризм в Турции: пересадка волос, стоматология, эстетическая хирургия. А также частные туры и индивидуальные маршруты по Турции.',
  alternates: {
    canonical: 'https://itineraryofturkiye.com/ru/services',
    languages: {
      en: 'https://itineraryofturkiye.com/services',
      de: 'https://itineraryofturkiye.com/de/services',
      ru: 'https://itineraryofturkiye.com/ru/services',
      'x-default': 'https://itineraryofturkiye.com/services',
    },
  },
  openGraph: {
    title: 'Услуги — Itinerary of Türkiye',
    description: 'Медицинский туризм и частные путешествия по Турции.',
    url: 'https://itineraryofturkiye.com/ru/services',
    siteName: 'Itinerary of Türkiye',
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function RuServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
