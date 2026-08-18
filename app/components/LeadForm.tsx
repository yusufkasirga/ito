'use client';

import { useState } from 'react';
import { whatsAppUrl, WEB3FORMS_ACCESS_KEY } from '@/lib/config';
import { track } from '@vercel/analytics';
import Icon from './Icon';

/**
 * Paylaşılan lead formu — ana sayfa ve /contact aynı bileşeni kullanır.
 * Kendi stilini taşır (koyu zeminde çalışır). Sunucuya veri gitmez;
 * gönderimde yapılandırılmış WhatsApp mesajı açılır (D-02 kararına uygun).
 */
export default function LeadForm({ locale = 'en' }: { locale?: 'en' | 'de' | 'ru' }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({ interest: '', country: '', timeline: '', contact: '', name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1 && !data.interest) e.interest = 'Please select';
    if (s === 2 && !data.timeline) e.timeline = 'Please select';
    if (s === 3) {
      if (!data.name) e.name = 'Required';
      if (!data.country) e.country = 'Required';
      if (!data.contact) e.contact = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const waMessage = [
    'Hello Itinerary of Türkiye, I would like to plan a trip.',
    `Name: ${data.name || '-'}`,
    `Country: ${data.country || '-'}`,
    `Area of interest: ${data.interest || '-'}`,
    `Timeline: ${data.timeline || '-'}`,
    `Preferred contact: ${data.contact || '-'}`,
    data.email ? `Email: ${data.email}` : '',
  ].filter(Boolean).join('\n');

  /** Başvuruyu e-posta olarak gönderir. Hata olsa bile akış durmaz. */
  const sendLead = async () => {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New enquiry — ${data.interest || 'General'} — ${data.name || 'No name'}`,
          from_name: 'Itinerary of Türkiye — Website',
          Name: data.name || '-',
          Email: data.email || '-',
          Country: data.country || '-',
          'Area of interest': data.interest || '-',
          Timeline: data.timeline || '-',
          'Preferred contact': data.contact || '-',
          Language: locale,
          Page: typeof window !== 'undefined' ? window.location.pathname : '-',
        }),
      });
    } catch {
      // Ağ hatası: kullanıcıyı engelleme, WhatsApp akışı yine de açılsın.
    }
  };

  const submit = async () => {
    if (!validate(step)) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setSending(true);
    await sendLead();
    setSending(false);
    setSubmitted(true);
    track('lead_submit', { source: 'form_submit', locale, path: typeof window !== 'undefined' ? window.location.pathname : '' });
  };

  return (
    <div className="lf-scope">
      <style>{`
        .lf-scope .lf-box { padding: 28px; border: 1px solid rgba(255,250,241,.16); border-radius: 20px; background: rgba(255,255,255,.06); }
        .lf-scope .lf-prog { height: 4px; background: rgba(255,250,241,.1); border-radius: 999px; overflow: hidden; margin-bottom: 24px; }
        .lf-scope .lf-bar { height: 100%; background: linear-gradient(90deg, #c9a96a, #8ed8dc); transition: width .35s; }
        .lf-scope .lf-ttl { margin: 0 0 18px; color: #fff; font-size: 18px; font-weight: 900; font-family: 'Inter', system-ui, sans-serif; }
        .lf-scope .lf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .lf-scope .lf-field { display: grid; gap: 8px; margin-bottom: 12px; }
        .lf-scope .lf-field label { font-size: 11px; font-weight: 900; letter-spacing: .04em; color: rgba(255,250,241,.78); text-transform: uppercase; }
        .lf-scope .lf-field input, .lf-scope .lf-field select { width: 100%; min-height: 52px; padding: 0 14px; border: 1px solid rgba(255,250,241,.18); border-radius: 12px; color: #fff; background: rgba(7,23,38,.5); font: 15px 'Inter', sans-serif; outline: none; transition: border .2s; }
        .lf-scope .lf-field input:focus, .lf-scope .lf-field select:focus { border-color: #8ed8dc; }
        .lf-scope .lf-field option { color: #081f35; }
        .lf-scope .lf-err { color: #ff9a9a; font-size: 13px; display: block; margin-top: 2px; }
        .lf-scope .lf-btn { min-height: 52px; padding: 0 26px; border-radius: 999px; border: none; font: 800 14px 'Inter', sans-serif; cursor: pointer; }
        .lf-scope .lf-btn-primary { background: #c9a96a; color: #081f35; flex: 1; }
        .lf-scope .lf-btn-ghost { background: rgba(255,255,255,.12); color: #fff; }
        .lf-scope .lf-success h3 { color: #8ed8dc; font-size: 20px; margin: 0 0 10px; font-family: 'Playfair Display', serif; }
        .lf-scope .lf-success p { color: rgba(255,250,241,.75); font-size: 14px; line-height: 1.7; margin: 0 0 14px; }
        .lf-scope a.lf-wa { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
      `}</style>

      <form className="lf-box" onSubmit={(e) => e.preventDefault()}>
        {!submitted ? (
          <>
            <div className="lf-prog"><div className="lf-bar" style={{ width: `${step * 33.33}%` }} /></div>

            {step === 1 && (
              <div>
                <div className="lf-ttl">What brings you to Türkiye?</div>
                <div className="lf-field">
                  <label htmlFor="lf-interest">Area of Interest *</label>
                  <select id="lf-interest" aria-describedby="lf-interest-err" value={data.interest} onChange={(e) => setData({ ...data, interest: e.target.value })}>
                    <option value="">Select your interest</option>
                    <option>Tourism</option>
                    <option>Medical Tourism</option>
                    <option>Investment / Real Estate</option>
                    <option>Business</option>
                    <option>Other</option>
                  </select>
                  {errors.interest && <span id="lf-interest-err" role="alert" className="lf-err">{errors.interest}</span>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="lf-ttl">When do you envision this?</div>
                <div className="lf-field">
                  <label htmlFor="lf-timeline">Preferred Timeline *</label>
                  <select id="lf-timeline" aria-describedby="lf-timeline-err" value={data.timeline} onChange={(e) => setData({ ...data, timeline: e.target.value })}>
                    <option value="">Select timeline</option>
                    <option>Within 2 weeks</option>
                    <option>1–2 months</option>
                    <option>3–6 months</option>
                    <option>Exploratory only</option>
                  </select>
                  {errors.timeline && <span id="lf-timeline-err" role="alert" className="lf-err">{errors.timeline}</span>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="lf-ttl">How can we reach you?</div>
                <div className="lf-field">
                  <label htmlFor="lf-name">Your Name *</label>
                  <input id="lf-name" aria-describedby="lf-name-err" type="text" placeholder="Full name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                  {errors.name && <span id="lf-name-err" role="alert" className="lf-err">{errors.name}</span>}
                </div>
                <div className="lf-row">
                  <div className="lf-field">
                    <label htmlFor="lf-country">Country *</label>
                    <input id="lf-country" aria-describedby="lf-country-err" type="text" placeholder="UK, UAE, Germany..." value={data.country} onChange={(e) => setData({ ...data, country: e.target.value })} />
                    {errors.country && <span id="lf-country-err" role="alert" className="lf-err">{errors.country}</span>}
                  </div>
                  <div className="lf-field">
                    <label htmlFor="lf-contact">Preferred Contact *</label>
                    <select id="lf-contact" aria-describedby="lf-contact-err" value={data.contact} onChange={(e) => setData({ ...data, contact: e.target.value })}>
                      <option value="">Select method</option>
                      <option>Email</option>
                      <option>WhatsApp</option>
                      <option>Phone call</option>
                      <option>Video meeting</option>
                    </select>
                    {errors.contact && <span id="lf-contact-err" role="alert" className="lf-err">{errors.contact}</span>}
                  </div>
                </div>
                <div className="lf-field">
                  <label htmlFor="lf-email">Email</label>
                  <input id="lf-email" type="email" placeholder="your@email.com" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {step > 1 && <button type="button" className="lf-btn lf-btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
              <button type="button" className="lf-btn lf-btn-primary" onClick={submit} disabled={sending} style={sending ? { opacity: .65, cursor: 'wait' } : undefined}>{step < 3 ? 'Continue →' : sending ? 'Sending…' : 'Submit Request'}</button>
            </div>
          </>
        ) : (
          <div className="lf-success">
            <h3>✓ Thank you — your enquiry has been sent</h3>
            <p>We have received your details and a member of our team will be in touch shortly. If you would like an immediate reply, you can also reach us on WhatsApp.</p>
            <a className="lf-btn lf-btn-primary lf-wa" style={{ background: '#25D366', color: '#fff', display: 'inline-flex', width: 'auto' }} href={whatsAppUrl(waMessage)} data-wa-source="form_reopen" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={17} /> Message us on WhatsApp
            </a>
            <p style={{ marginTop: '14px', fontSize: '11.5px', color: 'rgba(255,250,241,.55)' }}>Reminder: please don&apos;t send medical reports, photos or ID documents in a first message.</p>
          </div>
        )}
      </form>
    </div>
  );
}
