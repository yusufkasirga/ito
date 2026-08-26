import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Itinerary of Türkiye',
  description: 'Get in touch with Itinerary of Türkiye. A real person replies within hours via WhatsApp, email or phone. Start planning your Türkiye trip — no cost to ask.',
  alternates: { canonical: 'https://itineraryofturkiye.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
