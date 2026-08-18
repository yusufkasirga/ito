import type { Metadata } from 'next';
import SiteHeader from '../components/SiteHeader';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'How We Work — Private Turkey Travel Advisory',
  description: 'What a paid planning consultation with Itinerary of Türkiye includes: a written personal plan within 72 hours, what we advise against, full trip coordination and our presence on the days that matter.',
  alternates: { canonical: `${SITE_URL}/how-we-work` },
};

const S: Record<string, React.CSSProperties> = {
  main: { fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', color: '#3a4654' },
  wrap: { maxWidth: '820px', margin: '0 auto', padding: '48px 32px 80px' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px,5vw,44px)', color: '#081f35', marginBottom: '12px' },
  lede: { fontSize: '17px', lineHeight: 1.8, marginBottom: '8px' },
  meta: { fontSize: '13px', color: '#647889', marginBottom: '34px' },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#081f35', margin: '44px 0 14px' },
  h3: { fontSize: '16px', fontWeight: 700, color: '#081f35', margin: '0 0 8px' },
  p: { fontSize: '15.5px', lineHeight: 1.85, marginBottom: '16px' },
  step: { display: 'flex', gap: '18px', marginBottom: '20px', alignItems: 'flex-start' },
  stepNum: { fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#8a6d33', minWidth: '32px', lineHeight: 1.4 },
  card: { background: '#fff', border: '1px solid rgba(8,31,53,.1)', borderRadius: '14px', padding: '24px 26px', marginBottom: '16px' },
  tag: { display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a6d33', marginBottom: '10px' },
  li: { fontSize: '15px', lineHeight: 1.9, marginBottom: '2px' },
  note: { fontSize: '13.5px', lineHeight: 1.75, color: '#647889', background: 'rgba(201,169,106,.1)', border: '1px solid rgba(201,169,106,.25)', borderRadius: '12px', padding: '16px 18px', marginTop: '28px' },
  back: { display: 'inline-block', color: '#8a6d33', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '13px' },
  cta: { display: 'inline-block', marginTop: '10px', padding: '15px 30px', borderRadius: '999px', background: '#081f35', color: '#fffaf1', fontWeight: 700, fontSize: '14px', textDecoration: 'none' },
  a: { color: '#8a6d33', fontWeight: 600 },
};

export default function HowWeWorkPage() {
  return (
    <main style={S.main}>
      <SiteHeader />
      <div style={S.wrap}>
        <a href="/" style={S.back}>← Back to home</a>
        <h1 style={S.h1}>How we work</h1>
        <p style={S.lede}>
          We are a paid advisory. That single fact shapes everything below — including what we are
          willing to tell you not to do.
        </p>
        <p style={S.meta}>Private Turkey Travel Advisory · Istanbul · Cappadocia · Antalya · Muğla</p>

        {/* ADIM ADIM SÜREÇ */}
        <h2 style={S.h2}>The process</h2>

        <div style={S.step}>
          <div style={S.stepNum}>01</div>
          <div>
            <h3 style={S.h3}>You tell us what you are hoping for</h3>
            <p style={{ ...S.p, marginBottom: 0 }}>
              A short form before we speak — dates, who is travelling, what matters to you, what worries you.
              The preparation is our job, not yours.
            </p>
          </div>
        </div>

        <div style={S.step}>
          <div style={S.stepNum}>02</div>
          <div>
            <h3 style={S.h3}>A paid planning consultation</h3>
            <p style={{ ...S.p, marginBottom: 0 }}>
              One hour, by video, with the person who will actually handle your trip — not a sales desk.
              We ask more than we answer. If your plan is better without us, we will say so in that hour.
            </p>
          </div>
        </div>

        <div style={S.step}>
          <div style={S.stepNum}>03</div>
          <div>
            <h3 style={S.h3}>A written plan within 72 hours</h3>
            <p style={{ ...S.p, marginBottom: 0 }}>
              Yours to keep, whether or not you travel with us. What it contains is listed below.
            </p>
          </div>
        </div>

        <div style={S.step}>
          <div style={S.stepNum}>04</div>
          <div>
            <h3 style={S.h3}>If you want it handled, we handle it</h3>
            <p style={{ ...S.p, marginBottom: 0 }}>
              Hotels, transfers, guides, restaurant tables, clinic appointments and timing. You approve;
              we arrange. Every cost is shown separately from our fee — nothing is bundled to hide a margin.
            </p>
          </div>
        </div>

        <div style={S.step}>
          <div style={S.stepNum}>05</div>
          <div>
            <h3 style={S.h3}>We are there on the days that matter</h3>
            <p style={{ ...S.p, marginBottom: 0 }}>
              Arrival day. Surgery day. The morning of the balloon flight. Not a hotline in another
              country — a person you have already met, in the same city as you.
            </p>
          </div>
        </div>

        {/* PLAN İÇERİĞİ */}
        <h2 style={S.h2}>What the written plan contains</h2>
        <div style={S.card}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={S.li}>A day-by-day outline built around your pace — not a template</li>
            <li style={S.li}>Realistic budget ranges for each part of the trip, in writing</li>
            <li style={S.li}>Where to stay and why that area suits you specifically</li>
            <li style={S.li}>Practical timing: what to book first, what can wait, what sells out</li>
            <li style={S.li}>Named contacts: who you will be dealing with on the ground</li>
            <li style={S.li}><strong>What we advise against — and the reason for each</strong></li>
          </ul>
        </div>

        <p style={S.p}>
          That last line is the one most advisories will never write down. If a famous hotel is
          overpriced for what it gives, if a tour is crowded past enjoyment, if a clinic&apos;s package
          looks cheap because something is missing from it — you will read that in your plan, in plain
          language, before you spend anything.
        </p>

        {/* HİZMET KADEMELERİ */}
        <h2 style={S.h2}>Three ways to work with us</h2>

        <div style={S.card}>
          <span style={S.tag}>Plan review</span>
          <h3 style={S.h3}>You have already planned it — we tell you what is wrong with it</h3>
          <p style={{ ...S.p, marginBottom: 0 }}>
            You send us the itinerary you built yourself. Within 48 hours you get written notes: what
            works, what will disappoint you, what is priced badly, and what we would change. The smallest
            way to use us, and often enough on its own.
          </p>
        </div>

        <div style={S.card}>
          <span style={S.tag}>Planning consultation</span>
          <h3 style={S.h3}>The full conversation and your written plan</h3>
          <p style={{ ...S.p, marginBottom: 0 }}>
            The process described above, steps 1 to 3. A flat fee, agreed before we start. If you then
            travel with us, the fee is credited toward your trip. If the consultation brings you no
            value, we refund it.
          </p>
        </div>

        <div style={S.card}>
          <span style={S.tag}>Full coordination &amp; companionship</span>
          <h3 style={S.h3}>Everything arranged, and someone beside you</h3>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Steps 4 and 5. Booked, confirmed, translated, accompanied. Priced per trip and per day of
            companionship, quoted in advance, always shown separately from what providers charge.
          </p>
        </div>

        {/* FİYAT */}
        <h2 style={S.h2}>About the fee</h2>
        <p style={S.p}>
          We publish how we charge rather than a price list, because an honest number depends on where
          you are going, for how long and how much of it you want handled. What we can promise is the
          shape of it: a flat fee agreed <em>before</em> any work begins, no percentage taken quietly
          out of what you pay providers, and no commission from anyone we recommend.
        </p>
        <p style={S.p}>
          If you would rather know the number before talking to us, ask on WhatsApp and we will tell
          you within hours — no meeting required to get a price.
        </p>

        <div style={S.note}>
          Why we charge at all: because the alternative is being paid by hotels and clinics, and then
          you would never be sure whose interest a recommendation served. Our commitments on this are
          published in <a href="/standard" style={S.a}>The ITO Standard</a>.
        </div>

        <div style={{ marginTop: '34px' }}>
          <a href="/#contact" style={S.cta}>Start with a planning consultation</a>
        </div>

        <p style={{ ...S.p, marginTop: '34px', fontSize: '13px', color: '#647889' }}>
          See also: <a href="/standard" style={S.a}>The ITO Standard</a> ·{' '}
          <a href="/about" style={S.a}>About us</a> ·{' '}
          <a href="/blogs" style={S.a}>Guides &amp; articles</a>
        </p>
      </div>
    </main>
  );
}
