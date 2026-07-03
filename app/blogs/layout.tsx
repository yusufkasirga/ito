import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Itinerary of Türkiye',
  description: 'Guides and insights on visiting, investing and getting medical treatment in Türkiye — written by local experts.',
  alternates: { canonical: 'https://ito-rust.vercel.app/blogs' },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
