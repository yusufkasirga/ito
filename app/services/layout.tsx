import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services — Itinerary of Türkiye',
  description: 'Tourism, medical tourism, business advisory and real estate investment services in Türkiye — one trusted local partner for everything.',
  alternates: { canonical: 'https://ito-rust.vercel.app/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
