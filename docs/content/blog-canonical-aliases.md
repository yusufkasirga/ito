# Reviewed duplicate article URLs

Reviewed on 25 October 2026. Only the following eight English pairs are consolidated. Each pair has the same title and the canonical guide contains every original journal body block, allowing only punctuation/spacing differences. Every chosen guide also adds at least two FAQs; six add a closing contact sentence. The two original TypeScript collections remain intact for inventory and editorial history.

| Former journal slug | Canonical guide slug | Additional material retained |
| --- | --- | --- |
| `hidden-gems-turkiye` | `hidden-gems-turkiye-most-tourists-never-find` | Access and season FAQs; closing contact line |
| `why-turkiye-hair-transplants` | `why-turkiye-hair-transplant-capital-of-the-world` | Procedure, results and clinic selection FAQs; closing contact line |
| `hollywood-smile-turkiye` | `hollywood-smile-turkiye-complete-guide` | Veneer longevity and comfort FAQs; closing contact line |
| `rhinoplasty-turkiye` | `rhinoplasty-turkiye-choosing-the-right-surgeon` | Surgeon risk and recovery FAQs; closing contact line |
| `turkiye-business-destination` | `why-turkiye-attractive-business-destination` | Investment incentive and business language FAQs; closing contact line |
| `foreign-investors-property-turkiye` | `5-reasons-foreign-investors-buying-property-turkiye` | Citizenship eligibility and buyer risk FAQs; closing contact line |
| `business-travellers-guide-istanbul` | `first-time-business-traveller-guide-istanbul` | Time zone, SIM and business travel FAQs |
| `best-real-estate-deal-turkiye` | `how-to-get-the-best-real-estate-deal-turkiye` | Purchase costs and post-purchase help FAQs |

Both `/blog/<former-slug>` and `/blogs/<former-slug>` permanently redirect (308) directly to `/blog/<canonical-slug>`. Specific aliases come before the existing `/blogs/:path*` catch-all, preserving queries without a redirect chain. None of these sixteen records has a German version, so no German content or alias is invented. Existing English/German translation pairs keep their shared slugs and reciprocal language links.

The shared catalog used by listing pages, homepage cards, related articles and sitemap excludes the eight aliases. Canonical and language metadata resolve to the surviving guide. Build-time checks reject a missing source, a missing target or an alias chain.

The cost/process/recovery comparisons, clinic-selection guides and property guides answer distinct questions and stay published separately. The two dated regional safety articles and the two tourism-policy variants also remain separate; any future consolidation requires a separate editorial review of their dated claims and unique wording. This cleanup does not reassess or update medical, financial or regional safety claims.

`npm run blog:test` checks the explicit destination map, retained original bodies, all inventory records, both URL families, sitemap/alternate links and intentionally separate subjects.
