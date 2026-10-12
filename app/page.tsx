import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { blogArticles } from './blog/blogPosts';

export const metadata: Metadata = {
  title: 'Health Journeys & Private Travel | Itinerary of Türkiye',
  description: 'Personal planning and coordination for health journeys and private trips to Türkiye. Provider options, stays, transfers and experiences, with a clearly agreed scope and fee.',
  openGraph: {
    title: 'Türkiye, planned around you. | ITO',
    description: 'Health journeys and private travel, connected by one local team.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Türkiye, planned around you. | ITO',
    description: 'Personal planning for health journeys and private Türkiye trips.',
    images: ['/og-image.png'],
  },
};

export default function Home() {
  const featured = ['rhinoplasty-turkiye', 'istanbul-itinerary-3-5-7-days', 'best-time-to-visit-turkiye-month-by-month'];
  const articles = featured.flatMap((slug) => {
    const article = blogArticles.find((entry) => entry.slug === slug);
    return article ? [{ slug: article.slug, title: article.shortTitle, category: article.category, cover: article.cover, excerpt: article.excerpt }] : [];
  });
  return <HomeClient articles={articles} />;
}
