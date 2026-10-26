export type BlogSlugAlias = Readonly<{ locale: 'en' | 'de'; slug: string; canonicalSlug: string }>;
export const BLOG_SLUG_ALIASES: readonly BlogSlugAlias[];
export function getCanonicalBlogSlug(slug: string, locale?: string): string;
export function getBlogAliasRedirects(): { source: string; destination: string; permanent: true }[];
