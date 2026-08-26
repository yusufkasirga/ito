import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О нас — Itinerary of Türkiye',
  description:
    'Независимый консультант по медицинскому туризму и частным путешествиям по Турции. Мы проверяем каждого партнёра и сопровождаем вас на протяжении всей поездки.',
  alternates: {
    canonical: 'https://itineraryofturkiye.com/ru/about',
    languages: {
      en: 'https://itineraryofturkiye.com/about',
      de: 'https://itineraryofturkiye.com/de/about',
      ru: 'https://itineraryofturkiye.com/ru/about',
      'x-default': 'https://itineraryofturkiye.com/about',
    },
  },
  openGraph: {
    title: 'О нас — Itinerary of Türkiye',
    description: 'Независимый консультант по медицинскому туризму и частным путешествиям по Турции.',
    url: 'https://itineraryofturkiye.com/ru/about',
    siteName: 'Itinerary of Türkiye',
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function RuAboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
