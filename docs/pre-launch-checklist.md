# Pre-Launch Checklist — Itinerary of Türkiye
**Document:** /docs/pre-launch-checklist.md
**Date:** 2026-07-03
**Rule:** Every ☐ item must be checked (or explicitly waived by the owner) before
production deployment. No deployment, DNS change or analytics activation has occurred.

## P — Platform & configuration
- [ ] **P-01** Set `NEXT_PUBLIC_WHATSAPP_E164_NUMBER=+905539981836` in Vercel →
      Project → Settings → Environment Variables (Production + Preview). The repo
      never ships the number; without this var, WhatsApp CTAs fall back to `/#contact`.
- [ ] **P-02** Decide the production domain. Then replace `https://ito-rust.vercel.app`
      in `lib/config.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`,
      `app/blogs/[slug]/page.tsx` and the four route `layout.tsx` files (one
      search-and-replace). Configure the domain + DNS in Vercel (owner action only).
- [ ] **P-03** Verify the WhatsApp Business number is connected and staffed — the site
      now has **no server-side lead capture by design**; WhatsApp is the only intake.
- [ ] **P-04** Replace hot-linked Pexels images with self-hosted, licensed assets under
      `/public` (or a CDN you control). Current images load from Pexels' servers:
      availability and licensing are outside your control, and they are unoptimised
      for `next/image`.
- [x] **P-05** RESOLVED 2026-07-03 — branded 1200×630 `/og-image.png` generated and wired into metadata (D-16). Owner may replace with a professional photographic asset later.

## C — Content (see 04-content-conflicts-requiring-approval.md)
- [x] **C-01** Positioning decision — RESOLVED 2026-07-03: two primary journeys implemented (decision D-06).
- [x] **C-02** Future Services — RESOLVED 2026-07-03: `/future-services` built footer-only from relocated copy (D-05).
- [ ] **C-03** Quantitative claims sourced, softened, or removed.
- [ ] **C-04** Testimonial avatars/labels resolved (consented photos or initials).
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
