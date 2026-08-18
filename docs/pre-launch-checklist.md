# Pre-Launch Checklist — Itinerary of Türkiye
**Document:** /docs/pre-launch-checklist.md
**Date:** 2026-07-03
**Rule:** Every ☐ item must be checked (or explicitly waived by the owner) before
production deployment. No deployment, DNS change or analytics activation has occurred.

## P — Platform & configuration
- [x] **P-01** RESOLVED 2026-07-17 — env var set in Vercel (Production+Preview), redeployed;
      verified live: 5 wa.me links on homepage, 0 fallbacks.
- [ ] **P-02** Decide the production domain. Then replace `https://ito-rust.vercel.app`
      in `lib/config.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`,
      `app/blogs/[slug]/page.tsx` and the four route `layout.tsx` files (one
      search-and-replace). Configure the domain + DNS in Vercel (owner action only).
- [ ] **P-03** Verify the WhatsApp Business number is connected and staffed — the site
      now has **no server-side lead capture by design**; WhatsApp is the only intake.
- [x] **P-04** RESOLVED 2026-07-16 (Aşama 1) — 16 asset self-hosted under `/public/images`,
      zero `images.pexels.com` references remain; dead photo 2678218 (was already 404 in
      production) removed → hero has 3 slides (D-18). Credits: docs/launch/image-credits.md.
      Follow-up (Aşama 2, post-launch): replace stock with owned/licensed brand photography;
      optional `next/image` migration tracked under Q-02.
- [x] **P-05** RESOLVED 2026-07-03 — branded 1200×630 `/og-image.png` generated and wired into metadata (D-16). Owner may replace with a professional photographic asset later.

## C — Content (see 04-content-conflicts-requiring-approval.md)
- [x] **C-01** Positioning decision — RESOLVED 2026-07-03: two primary journeys implemented (decision D-06).
- [x] **C-02** Future Services — RESOLVED 2026-07-03: `/future-services` built footer-only from relocated copy (D-05).
- [x] **C-03** RESOLVED 2026-07-16 — unsupported claims softened/removed (D-17, docs/launch/claims-audit.md).
- [x] **C-04** RESOLVED 2026-07-16 — initials badges (D-15) + "Verified Client" → "Client Story" (D-17).
- [ ] **C-05** Medical-claims compliance pass (HWG / ASA sensitivities) if DE/UK
      traffic is planned.
- [ ] **C-06** Legal pages: Privacy Policy, Terms, and an Impressum-equivalent are
      **absent from the repo** and are required before accepting EU/UK inquiries.

- [x] **C-07** RESOLVED 2026-07-03 — replacement sentence applied (D-14).
- [x] **C-08** RESOLVED 2026-07-03 — descriptions reordered (D-14).

## Q — Final QA on the deployed preview
- [ ] **Q-01** Real-device pass: iPhone Safari, Android Chrome, iPad — hero carousel,
      mobile menu, form steps, WhatsApp deep-link handoff.
- [ ] **Q-02** Lighthouse (mobile) ≥ 85 performance after P-04 image work.
- [ ] **Q-03** Screen-reader smoke test (VoiceOver): landmark order, form labels.
- [ ] **Q-04** Confirm `sitemap.xml` and `robots.txt` resolve on the production domain
      and submit the sitemap in Google Search Console.
- [ ] **Q-05** Browser console clean on all routes (no errors/warnings).

## A — Analytics (currently: none installed, by policy)
- [ ] **A-01** Owner approves an analytics stack (recommendation: privacy-friendly,
      e.g. Vercel Analytics or Plausible, given no cookie banner exists yet).
- [ ] **A-02** If Meta Pixel is added for ad retargeting, a consent banner becomes
      mandatory for EU/UK visitors — pair these two decisions.

## Sign-off
| Role | Name | Date | Approved |
|---|---|---|---|
| Owner | | | ☐ |
| Engineering | | | ☐ |
| Content | | | ☐ |
