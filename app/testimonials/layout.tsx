import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Testimonials — Itinerary of Türkiye',
  description: 'What our clients from the UK, US, Australia and beyond say about working with Itinerary of Türkiye.',
  alternates: { canonical: 'https://ito-rust.vercel.app/testimonials' },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
