# Content Conflicts Requiring Owner Approval
**Document:** /docs/content/04-content-conflicts-requiring-approval.md
**Date:** 2026-07-03

Per the content rules, no approved repository copy was rewritten and no unsupported
claims were added during this review. The following conflicts between the stated
business direction and the current repository content require an explicit owner
decision. Nothing below has been changed without approval.

---

## C-01 — Positioning: four equal pillars vs. two primary journeys
**Stated direction:** Medical travel and private Türkiye experiences are the primary
business focus.
**Repository reality:** The homepage hero, pillar cards, services page and footer
present **four equal verticals** — Tourism, Medical Tourism, Business, and
Investment/Real Estate. No hierarchy exists.
**Needed decision:** Approve a restructure (hero CTAs, pillar order/weight, nav order,
services page order) that elevates Medical Travel and Private Experiences and demotes
Business + Investment — or confirm the current equal-pillar positioning stands.

## C-02 — Future Services: content does not exist
**Stated direction:** Future Services accessible from the footer only, publicly
indexable, with canonical URLs, sitemap entries and structured data where factually
supportable.
**Repository reality:** There are **no Future Services pages, copy, or footer links**
anywhere in the repo. Nothing exists to index or de-emphasise.
**Needed decision:** Provide (a) the approved list of Future Services, and (b) approved
copy for each. Implementation plan once received: `/future-services/[slug]` static
pages, footer-only links, canonical + sitemap entries, semantic headings, `Service`
structured data only for factually supportable statements, and no visual promotion in
the primary journeys.

## C-03 — Unsupported quantitative claims in approved copy
The following statements exist in the live copy with **no supporting source in the
repository**:
- "1,200+ successful procedures completed with our partners" (homepage, medical section)
- "98% / 96% / 97% Satisfaction" badges (medical category cards)
- "✓ Available 24/7" floating badge
**Needed decision:** Supply verifiable figures, soften the wording, or approve removal.
Left untouched pending your call.

## C-04 — Testimonial presentation
Testimonials are labelled **"Verified Client"** and displayed with **stock photographs
(Pexels)** as avatars. The quotes themselves may be genuine, but pairing them with
stock faces under a "Verified" label is a representation risk (and an issue under
UK/EU consumer-protection norms if EU/UK patients are targeted).
**Needed decision:** Replace with real client photos (with written consent), switch to
initials/flag-only avatars, or remove the "Verified" wording. Recommended default:
initials + flag, keep the quotes.

## C-05 — Medical content claims in blog posts
The hair-transplant cost guide states concrete price ranges (€1,500–€3,500 vs.
£8,000–£15,000) and "98%"-style outcomes appear on the homepage. If the site targets
German or UK patients, HWG (DE) and ASA/GDC (UK) sensitivities that were mapped for
the LHC dental campaigns apply here as well — particularly satisfaction percentages
and any implied outcome guarantees.
**Needed decision:** Confirm the price ranges are ones you can stand behind, and
approve a compliance pass on medical claims before paid traffic is sent to these pages.

## C-06 — Answer-engine structure (informational)
Blog content is semantic and factual in tone: proper H2 hierarchy, question-style
headings matching real queries ("Can Foreigners Legally Buy Property?"), no keyword
stuffing detected, Article JSON-LD present. FAQ copy on the homepage is also
answer-engine-friendly. **No conflict** — noted for the record. Adding `FAQPage`
structured data to the homepage FAQ is a supportable enhancement awaiting approval.
