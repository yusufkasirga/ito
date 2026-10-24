import type { MetadataRoute } from 'next';
import { blogLocales, blogPath, getBlogEntries, getBlogLanguages } from './blog/blogCatalog';
import { destinationSlugs } from './destinations/destinationData';

const BASE = 'https://itineraryofturkiye.com';
const SITE_UPDATED = '2026-08-26';
const DESTINATIONS_UPDATED = '2026-09-25';

const staticPaths = [
  '', '/about', '/services', '/services/tourism', '/services/medical-tourism',
  '/contact', '/all-turkiye-destinations', '/testimonials',
  '/future-services', '/privacy', '/terms', '/legal-notice', '/standard',
  '/how-we-work', '/editorial-policy', '/de', '/de/impressum', '/de/about',
  '/de/services', '/de/privacy', '/de/terms', '/de/future-services', '/de/links',
  '/de/testimonials', '/ru', '/ru/about', '/ru/services',
  '/ru/future-services', '/links',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: path === '/editorial-policy' ? '2026-09-01' : SITE_UPDATED,
  }));

  const blogPages: MetadataRoute.Sitemap = blogLocales.flatMap((locale) => {
    const entries = getBlogEntries(locale);
    if (!entries.length) return [];
    return [
      { url: `${BASE}${blogPath(locale)}`, lastModified: entries.reduce((latest, entry) => (entry.updatedISO ?? entry.dateISO) > latest ? (entry.updatedISO ?? entry.dateISO) : latest, SITE_UPDATED), alternates: { languages: getBlogLanguages() } },
      ...entries.map((entry) => ({
        url: `${BASE}${blogPath(locale, entry.slug)}`,
        lastModified: entry.updatedISO ?? entry.dateISO,
        alternates: { languages: getBlogLanguages(entry.slug) },
      })),
    ];
  });

  const destinations: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: `${BASE}/destinations/${slug}`,
    lastModified: DESTINATIONS_UPDATED,
  }));

  return [...staticPages, ...blogPages, ...destinations];
}
