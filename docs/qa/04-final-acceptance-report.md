# Final Acceptance Report — Itinerary of Türkiye Website
**Document:** /docs/qa/04-final-acceptance-report.md
**Date:** 2026-07-03
**Build verified:** Next.js 16.2.4 (Turbopack) — production build, all routes prerendered static/SSG.

---

## 1. Scope of this review

Cross-department review of the current repository state (`ito`). Every item below was
verified against the **actual production build** (`next build` + `next start` + HTTP
smoke tests), not source inspection alone.

## 2. Route & link verification (PASS)

| Route | HTTP | Render mode |
|---|---|---|
| `/` | 200 | Static |
| `/about` | 200 | Static |
| `/services` | 200 | Static |
| `/blogs` | 200 | Static |
| `/testimonials` | 200 | Static |
| `/blogs/hair-transplant-turkey-cost-guide-2026` | 200 | SSG |
| `/blogs/buying-property-turkey-foreigner-guide` | 200 | SSG |
| `/blogs/best-things-to-do-istanbul-first-time` | 200 | SSG |
| `/sitemap.xml` | 200 | Static |
| `/robots.txt` | 200 | Static |
| Unknown route | 404 | Correct not-found behaviour |

Automated internal-link crawl across all pages: **0 broken links**.

## 3. WhatsApp Private Application flow (PASS)

- Number is read from `NEXT_PUBLIC_WHATSAPP_E164_NUMBER` (env). **No hardcoded number
  remains in any source file** (verified by repository-wide grep; the value exists only
  in `.env.local` — gitignored — and `.env.example` as the documented configuration).
- `lib/config.ts` centralises URL construction (`whatsAppUrl()`), strips non-digits,
  and degrades gracefully to `/#contact` if the env var is missing.
- The 3-step application form builds a **structured prefilled message entirely in the
  browser** (name, country, interest, timeline, preferred contact, optional email) and
  opens WhatsApp via `window.open`. Verified present in built HTML.
- **No form data is stored.** The former `/api/lead` server route was removed; the site
  now ships with zero server-side handlers (fully static output).
- The form collects **no sensitive medical information** and has no file upload.
- Sensitive-data guidance ("do not send medical reports, photos, passport documents,
  payment details…") is displayed beside the form and repeated on the success screen
  and inside the prefilled message itself. Verified in rendered HTML.

## 4. SEO / metadata / structured data (PASS)

- Per-page `<title>`, meta description, canonical URL on all routes (verified in
  rendered HTML, e.g. blog post canonical → `https://ito-rust.vercel.app/blogs/...`).
- Blog posts render `og:type="article"`, OG image, Twitter card, and **Article JSON-LD**
  (2 JSON-LD blocks per post: Organization + Article).
- `sitemap.xml` contains all 8 URLs; `robots.txt` allows crawling and references the
  sitemap. No `noindex` anywhere.
- `metadataBase` and `viewport` export follow Next.js 16 conventions.

## 5. Accessibility & QA fixes applied in this pass

- `prefers-reduced-motion: reduce` now disables all animations/transitions site-wide.
- Visible `:focus-visible` outlines added on all interactive elements, all pages.
- Services dropdown now opens on keyboard focus (previously mouse-hover only).
- FAQ accordions expose `aria-expanded`; hero carousel dots converted from `div` to
  labelled `<button>` elements.
- Sub-page navigation no longer overflows at phone widths (≤700 px wrapping layout).
- Copyright year is dynamic on every footer (was frozen at 2024).
- Dead `href="#"` social buttons removed from the footer.

## 6. Trust & compliance fixes

- The fabricated "N clients helped right now" random counter was **removed** and
  replaced with a truthful claim ("Replies within hours — real people, no bots").
  See decision log entry D-03.
- No analytics, pixels, or tracking scripts exist anywhere in the codebase (verified
  by grep for gtag/GTM/fbq/pixel/hotjar/clarity). No analytics were activated.
- No deployment, DNS change, or domain action was performed in this review.

## 7. Items verified as NOT PRESENT in the repository (see conflicts doc)

- **Future Services pages do not exist.** There is nothing to link from the footer,
  index, or exclude from prominence. Requires approved copy before creation.
- The site's positioning is **four equal pillars** (Tourism / Medical / Business /
  Investment), not "Medical Travel + Private Türkiye Experiences primary". This is a
  content/strategy decision that requires owner approval — see
  `/docs/content/04-content-conflicts-requiring-approval.md`.

## 8. Manual QA still required before launch (cannot be automated in this environment)

- Real-device testing (iPhone Safari, Android Chrome, iPad) for touch behaviour,
  scroll performance of the hero parallax, and WhatsApp deep-link handoff.
- Screen-reader pass (VoiceOver / TalkBack) for reading order on the homepage.
- Lighthouse run on the deployed preview (remote Pexels images are not size-optimised;
  see pre-launch checklist item P-04).

**Verdict:** Build is technically sound and ready for a preview deployment.
Production launch is blocked only by the owner-approval items listed in the
pre-launch checklist.
