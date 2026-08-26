import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Links — Itinerary of Türkiye', robots: { index: false, follow: true } };
export default function L({ children }: { children: React.ReactNode }) { return children; }
