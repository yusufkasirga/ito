import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Itinerary of Türkiye',
  description: 'Learn about Itinerary of Türkiye — your trusted local partner for tourism, medical tourism, investment and business across Türkiye.',
  alternates: { canonical: 'https://itineraryofturkiye.com/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
