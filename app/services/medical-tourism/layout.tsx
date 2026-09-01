import type { Metadata } from 'next';

const url = 'https://itineraryofturkiye.com/services/medical-tourism';

export const metadata: Metadata = {
  title: 'Medical Travel Coordination in Türkiye — Itinerary of Türkiye',
  description: 'Independent coordination for medical travel in Türkiye, including provider research, journey planning, translation and practical support.',
  alternates: { canonical: url },
};

export default function MedicalTourismLayout({ children }: { children: React.ReactNode }) {
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: 'Medical travel coordination in Türkiye',
    serviceType: 'Medical travel advisory and journey coordination',
    url,
    provider: { '@id': 'https://itineraryofturkiye.com/#organization' },
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    audience: { '@type': 'Audience', audienceType: 'International visitors considering treatment in Türkiye' },
    offers: {
      '@type': 'Offer',
      description: 'Initial consultation and provider matching',
      price: '0',
      priceCurrency: 'EUR',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
