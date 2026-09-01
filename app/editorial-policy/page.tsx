import type { Metadata } from 'next';
import SiteHeader from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Editorial & Review Policy — Itinerary of Türkiye',
  description: 'How Itinerary of Türkiye researches, reviews, updates and corrects its travel and medical travel guidance.',
  alternates: { canonical: 'https://itineraryofturkiye.com/editorial-policy' },
};

export default function EditorialPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fffaf1', color: '#243442', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SiteHeader />
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '64px 24px 96px', lineHeight: 1.8 }}>
        <p style={{ color: '#8a6d33', fontSize: 12, fontWeight: 900, letterSpacing: '.15em', textTransform: 'uppercase' }}>Trust & transparency</p>
        <h1 style={{ color: '#081f35', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.08, margin: '8px 0 18px' }}>Editorial & Review Policy</h1>
        <p style={{ fontSize: 19, color: '#40505d' }}>
          We publish practical guidance for international visitors planning travel, medical travel and private experiences in Türkiye. Our goal is to make every article useful, clear and honest about what may change.
        </p>

        <h2>How we research</h2>
        <p>We combine first-hand local knowledge with information from official authorities, transport operators, destination organisations and other primary sources. When an article includes schedules, prices, legal requirements or health-related information, we aim to link to the source used.</p>

        <h2>Publication and updates</h2>
        <p>Articles show their publication date and, when the content changes materially, a separate updated date. Time-sensitive details can change without notice, so readers should confirm them with the linked official provider before making a booking or travel decision.</p>

        <h2>Medical travel content</h2>
        <p>Our medical travel pages are general information, not medical advice, diagnosis or a treatment recommendation. Individual suitability, risks, outcomes and prices must be assessed by an appropriately qualified treating professional. We do not guarantee clinical outcomes.</p>

        <h2>Commercial independence</h2>
        <p>Itinerary of Türkiye is an advisory and coordination service, not a clinic, hospital or public authority. Where our own services are relevant, we identify that relationship clearly rather than presenting promotional claims as independent facts.</p>

        <h2>Corrections</h2>
        <p>If you find an error or outdated detail, email <a href="mailto:itineraryofturkiye@gmail.com">itineraryofturkiye@gmail.com</a>. We review correction requests against primary sources and update material errors as quickly as practical.</p>

        <p style={{ marginTop: 42, paddingTop: 20, borderTop: '1px solid rgba(8,31,53,.15)', color: '#687985', fontSize: 14 }}>Last updated: 1 September 2026</p>
      </article>
    </main>
  );
}
