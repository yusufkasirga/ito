'use client';

import SiteHeader from '../components/SiteHeader';

import { whatsAppUrl, WHATSAPP_E164_NUMBER } from '@/lib/config';
import Icon from '../components/Icon';
import LeadForm from '../components/LeadForm';

export default function ContactPage() {
  const raw = WHATSAPP_E164_NUMBER || '+905539981836';
  const digits = raw.replace(/\D/g, '');
  const phone = digits.length === 12
    ? `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`
    : raw;

  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'linear-gradient(165deg, #071726 0%, #0c3555 100%)', minHeight: '100vh', color: '#fffaf1' }}>
      <SiteHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ct-wrap { max-width: 1040px; margin: 0 auto; padding: 40px 32px 80px; }
        .ct-back { display: inline-block; color: #c9a96a; font-weight: 700; text-decoration: none; margin-bottom: 30px; font-size: 13px; }
        .ct-eyebrow { color: #c9a96a; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .ct-h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px, 6vw, 52px); margin: 10px 0 14px; line-height: 1.05; }
        .ct-lede { font-size: 16.5px; line-height: 1.8; color: rgba(255,250,241,.82); max-width: 620px; margin-bottom: 44px; }
        .ct-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .ct-channels { display: flex; flex-direction: column; gap: 16px; }
        .ct-chan { display: flex; gap: 14px; align-items: flex-start; padding: 18px 20px; border: 1px solid rgba(255,250,241,.14); border-radius: 16px; background: rgba(255,255,255,.04); text-decoration: none; color: inherit; transition: border-color .2s, background .2s; }
        .ct-chan:hover { border-color: #c9a96a; background: rgba(255,255,255,.07); }
        .ct-chan-ico { color: #c9a96a; margin-top: 2px; }
        .ct-chan-t { font-weight: 800; font-size: 15px; margin-bottom: 3px; }
        .ct-chan-s { font-size: 13.5px; color: rgba(255,250,241,.7); line-height: 1.5; word-break: break-word; }
        .ct-note { margin-top: 22px; font-size: 12.5px; line-height: 1.7; color: rgba(255,250,241,.62); background: rgba(201,169,106,.1); border: 1px solid rgba(201,169,106,.22); border-radius: 12px; padding: 14px 16px; }
        .ct-form-head { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 14px; }
        .ct-footer { margin-top: 56px; padding-top: 22px; border-top: 1px solid rgba(255,250,241,.1); font-size: 12px; color: rgba(255,250,241,.55); text-align: center; }
        .ct-footer a { color: inherit; }
        @media (max-width: 820px) { .ct-grid { grid-template-columns: 1fr; gap: 32px; } }
      `}</style>

      <div className="ct-wrap">
        <a href="/" className="ct-back">← Back to home</a>

        <span className="ct-eyebrow">Get in touch</span>
        <h1 className="ct-h1">Let&apos;s plan your Türkiye.</h1>
        <p className="ct-lede">
          Tell us what you need and a real person replies within hours — not a bot, not a queue.
          Start below, or reach us directly on any channel. There is no cost to ask a question.
        </p>

        <div className="ct-grid">
          {/* Sol: doğrudan kanallar */}
          <div>
            <div className="ct-channels">
              <a className="ct-chan" href={whatsAppUrl('Hello Itinerary of Türkiye, I have a question about planning a trip.')} target="_blank" rel="noopener noreferrer" data-wa-source="contact_page">
                <span className="ct-chan-ico"><Icon name="whatsapp" size={22} /></span>
                <span>
                  <span className="ct-chan-t">WhatsApp</span>
                  <span className="ct-chan-s">The fastest way to reach us — replies within hours</span>
                </span>
              </a>

              <a className="ct-chan" href="mailto:info@itineraryofturkiye.com">
                <span className="ct-chan-ico"><Icon name="message" size={22} /></span>
                <span>
                  <span className="ct-chan-t">Email</span>
                  <span className="ct-chan-s">info@itineraryofturkiye.com</span>
                </span>
              </a>

              <a className="ct-chan" href={`tel:${digits}`}>
                <span className="ct-chan-ico"><Icon name="plane" size={22} /></span>
                <span>
                  <span className="ct-chan-t">Phone</span>
                  <span className="ct-chan-s">{phone}</span>
                </span>
              </a>
            </div>

            <p className="ct-note">
              <Icon name="lock" size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
              Please don&apos;t send medical reports, photos, passport or payment documents in a first message.
              Once we connect, we will guide you to a secure channel for anything confidential.
            </p>
          </div>

          {/* Sağ: form */}
          <div>
            <div className="ct-form-head">Or send us the essentials</div>
            <LeadForm />
          </div>
        </div>

        <div className="ct-footer">
          © {new Date().getFullYear()} Itinerary of Türkiye ·{' '}
          <a href="/standard">The ITO Standard</a> ·{' '}
          <a href="/how-we-work">How we work</a> ·{' '}
          <a href="/legal-notice">Legal Notice</a>
        </div>
      </div>
    </main>
  );
}
