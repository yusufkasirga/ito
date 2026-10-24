import type { MetadataRoute } from 'next';
import { blogEntries } from './blog/blogCatalog';
import { blogPostsDe } from './blogs/blogDataDe';
import { destinationSlugs } from './destinations/destinationData';

const BASE = 'https://itineraryofturkiye.com';
const SITE_UPDATED = '2026-08-26';
const DESTINATIONS_UPDATED = '2026-09-25';

const staticPaths = [
  '', '/about', '/services', '/services/tourism', '/services/medical-tourism',
  '/contact', '/all-turkiye-destinations', '/blog', '/testimonials',
  '/future-services', '/privacy', '/terms', '/legal-notice', '/standard',
  '/how-we-work', '/editorial-policy', '/de', '/de/impressum', '/de/about',
  '/de/services', '/de/privacy', '/de/terms', '/de/future-services', '/de/links',
  '/de/blog', '/de/testimonials', '/ru', '/ru/about', '/ru/services',
  '/ru/future-services', '/links',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const englishSlugs = new Set(blogEntries.map((article) => article.slug));
  const germanSlugs = new Set(blogPostsDe.map((post) => post.slug));
  const blogLanguages = (slug = '') => ({
    en: `${BASE}/blog${slug ? `/${slug}` : ''}`,
    de: `${BASE}/de/blog${slug ? `/${slug}` : ''}`,
    'x-default': `${BASE}/blog${slug ? `/${slug}` : ''}`,
  });

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: path === '/editorial-policy' ? '2026-09-01' : SITE_UPDATED,
    ...(['/blog', '/de/blog'].includes(path) ? { alternates: { languages: blogLanguages() } } : {}),
  }));

  const posts: MetadataRoute.Sitemap = blogEntries.map((article) => ({
    url: `${BASE}/blog/${article.slug}`,
    lastModified: article.updatedISO ?? article.dateISO,
    ...(germanSlugs.has(article.slug) ? { alternates: { languages: blogLanguages(article.slug) } } : {}),
  }));

  const dePosts: MetadataRoute.Sitemap = blogPostsDe.map((post) => ({
    url: `${BASE}/de/blog/${post.slug}`,
    lastModified: post.updatedISO ?? post.dateISO,
    ...(englishSlugs.has(post.slug) ? { alternates: { languages: blogLanguages(post.slug) } } : {}),
  }));

  const destinations: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: `${BASE}/destinations/${slug}`,
    lastModified: DESTINATIONS_UPDATED,
  }));

  return [...staticPages, ...posts, ...destinations, ...dePosts];
}
