import type { MetadataRoute } from 'next';
import { blogPosts } from './blogs/blogData';
import { blogPostsDe } from './blogs/blogDataDe';
import { destinationSlugs } from './destinations/destinationData';
import { blogArticles } from './blog/blogPosts';

const BASE = 'https://itineraryofturkiye.com';
const SITE_UPDATED = '2026-08-26';

const staticPaths = [
  '', '/about', '/services', '/services/tourism', '/services/medical-tourism',
  '/contact', '/all-turkiye-destinations', '/blog', '/blogs', '/testimonials',
  '/future-services', '/privacy', '/terms', '/legal-notice', '/standard',
  '/how-we-work', '/editorial-policy', '/de', '/de/impressum', '/de/about',
  '/de/services', '/de/privacy', '/de/terms', '/de/future-services', '/de/links',
  '/de/blogs', '/de/testimonials', '/ru', '/ru/about', '/ru/services',
  '/ru/future-services', '/links',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: path === '/editorial-policy' ? '2026-09-01' : SITE_UPDATED,
  }));

  const journal: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${BASE}/blog/${article.slug}`,
    lastModified: article.updatedISO ?? article.dateISO,
  }));

  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blogs/${post.slug}`,
    lastModified: post.updatedISO ?? post.dateISO,
  }));

  const dePosts: MetadataRoute.Sitemap = blogPostsDe.map((post) => ({
    url: `${BASE}/de/blogs/${post.slug}`,
    lastModified: post.updatedISO ?? post.dateISO,
  }));

  const destinations: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: `${BASE}/destinations/${slug}`,
    lastModified: SITE_UPDATED,
  }));

  return [...staticPages, ...journal, ...destinations, ...posts, ...dePosts];
}
