import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Itinerary of Türkiye — консультации по медицинским поездкам и частным путешествиям в Турцию',
  description: 'Независимые консультации по медицинскому туризму и частным путешествиям по Турции. Мы проверяем клиники, планируем поездку и сопровождаем вас — первая консультация бесплатна.',
  alternates: { canonical: 'https://itineraryofturkiye.com/ru', languages: { en: 'https://itineraryofturkiye.com/', de: 'https://itineraryofturkiye.com/de', ru: 'https://itineraryofturkiye.com/ru' } },
};

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
