import type { Metadata } from 'next';

const url = 'https://itineraryofturkiye.com/services/tourism';

export const metadata: Metadata = {
  title: 'Private Türkiye Travel Planning — Itinerary of Türkiye',
  description: 'Tailor-made Türkiye itineraries, private guides, transfers and practical local travel coordination for international visitors.',
  alternates: { canonical: url },
};

export default function TourismLayout({ children }: { children: React.ReactNode }) {
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: 'Private Türkiye travel planning',
    serviceType: 'Tailor-made itinerary and travel coordination',
    url,
    provider: { '@id': 'https://itineraryofturkiye.com/#organization' },
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    audience: { '@type': 'Audience', audienceType: 'International visitors planning private travel in Türkiye' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
