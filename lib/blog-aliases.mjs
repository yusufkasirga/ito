/** Editorially reviewed aliases only. Original records remain in the source collections.
 * Each destination contains the complete equivalent body plus additional FAQs.
 * Do not infer aliases from similar keywords, procedures, or article titles.
 */
export const BLOG_SLUG_ALIASES = Object.freeze([
  Object.freeze({ locale: 'en', slug: 'hidden-gems-turkiye', canonicalSlug: 'hidden-gems-turkiye-most-tourists-never-find' }),
  Object.freeze({ locale: 'en', slug: 'why-turkiye-hair-transplants', canonicalSlug: 'why-turkiye-hair-transplant-capital-of-the-world' }),
  Object.freeze({ locale: 'en', slug: 'hollywood-smile-turkiye', canonicalSlug: 'hollywood-smile-turkiye-complete-guide' }),
  Object.freeze({ locale: 'en', slug: 'rhinoplasty-turkiye', canonicalSlug: 'rhinoplasty-turkiye-choosing-the-right-surgeon' }),
  Object.freeze({ locale: 'en', slug: 'turkiye-business-destination', canonicalSlug: 'why-turkiye-attractive-business-destination' }),
  Object.freeze({ locale: 'en', slug: 'foreign-investors-property-turkiye', canonicalSlug: '5-reasons-foreign-investors-buying-property-turkiye' }),
  Object.freeze({ locale: 'en', slug: 'business-travellers-guide-istanbul', canonicalSlug: 'first-time-business-traveller-guide-istanbul' }),
  Object.freeze({ locale: 'en', slug: 'best-real-estate-deal-turkiye', canonicalSlug: 'how-to-get-the-best-real-estate-deal-turkiye' }),
]);

export function getCanonicalBlogSlug(slug, locale = 'en') {
  return BLOG_SLUG_ALIASES.find((alias) => alias.locale === locale && alias.slug === slug)?.canonicalSlug ?? slug;
}

/** Specific aliases precede the legacy catch-all so old /blogs links redirect in one hop. */
export function getBlogAliasRedirects() {
  return BLOG_SLUG_ALIASES.flatMap(({ locale, slug, canonicalSlug }) => {
    const prefix = locale === 'en' ? '' : `/${locale.toLowerCase()}`;
    return ['blog', 'blogs'].map((segment) => ({
      source: `${prefix}/${segment}/${slug}`,
      destination: `${prefix}/blog/${canonicalSlug}`,
      permanent: true,
    }));
  });
}
