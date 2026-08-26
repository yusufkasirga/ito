import type { MetadataRoute } from 'next';
import { blogPosts } from './blogs/blogData';
import { blogPostsDe } from './blogs/blogDataDe';
import { destinationSlugs } from './destinations/destinationData';
import { blogSlugs } from './blog/blogPosts';

const BASE = 'https://itineraryofturkiye.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = ['', '/about', '/services', '/services/tourism', '/services/medical-tourism', '/contact', '/all-turkiye-destinations', '/blog', '/blogs', '/testimonials', '/future-services', '/privacy', '/terms', '/legal-notice', '/standard', '/how-we-work', '/de', '/de/impressum', '/de/about', '/de/services', '/de/privacy', '/de/terms', '/de/future-services', '/de/links', '/de/blogs', '/de/testimonials'].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blogs/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));


  const dePosts: MetadataRoute.Sitemap = blogPostsDe.map((p) => ({
    url: `${BASE}/de/blogs/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  const journal: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({ url: `${BASE}/blog/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }));
  const dest: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({ url: `${BASE}/destinations/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }));
  return [...staticPages, ...journal, ...dest, ...posts, ...dePosts];
}
