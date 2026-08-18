import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links — Itinerary of Türkiye',
  robots: { index: false, follow: true }, // bio hedef sayfası; arama sonuçlarında gereksiz
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
