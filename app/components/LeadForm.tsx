'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { whatsAppUrl, WEB3FORMS_ACCESS_KEY } from '@/lib/config';
import { track } from '@vercel/analytics';
import Icon from './Icon';

const JOURNEY_INTERESTS = ['Health journey', 'Private Türkiye trip', 'Both / not sure'];
const OTHER_INTERESTS = ['Tourism', 'Medical Tourism', 'Investment / Real Estate', 'Business', 'Other'];
const TIMELINES = ['Within 2 weeks', '1–2 months', '3–6 months', 'Exploratory only'];
const CONTACT_METHODS = ['Email', 'WhatsApp', 'Phone call', 'Video meeting'];

type LeadData = {
  interest: string;
  country: string;
  timeline: string;
  contact: string;
  name: string;
  email: string;
  phone: string;
};

type LeadFormProps = {
  locale?: 'en' | 'de' | 'ru';
  journeyOnly?: boolean;
  initialInterest?: string;
  onInterestChange?: (interest: string) => void;
};

/** Shared enquiry form. The homepage opts into the two focused journey types. */
export default function LeadForm({ locale = 'en', journeyOnly = false, initialInterest = '', onInterestChange }: LeadFormProps) {
  const interests = journeyOnly ? JOURNEY_INTERESTS : OTHER_INTERESTS;
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<LeadData>({
    interest: interests.includes(initialInterest) ? initialInterest : '',
    country: '', timeline: '', contact: '', name: '', email: '', phone: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [sending, setSending] = useState(false);
  const inFlight = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const id = useId();
  const fieldId = (field: keyof LeadData) => `${id}-${field}`;
  const needsPhone = data.contact === 'WhatsApp' || data.contact === 'Phone call';

  useEffect(() => {
    const allowedInterests = journeyOnly ? JOURNEY_INTERESTS : OTHER_INTERESTS;
    if (!initialInterest || !allowedInterests.includes(initialInterest) || inFlight.current) return;
    setData((current) => ({ ...current, interest: initialInterest }));
    setErrors({});
    setSubmitError('');
    setSubmitted(false);
    setStep(1);
  }, [initialInterest, journeyOnly]);

  useEffect(() => {
    if (previousStep.current !== step) headingRef.current?.focus({ preventScroll: true });
    previousStep.current = step;
  }, [step]);

  useEffect(() => {
    if (submitted) successRef.current?.focus({ preventScroll: true });
  }, [submitted]);

  const update = (field: keyof LeadData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
  };

  const validate = () => {
    const e: Partial<Record<keyof LeadData, string>> = {};
    if (!interests.includes(data.interest)) e.interest = 'Please choose your journey.';
    if (step >= 2 && !TIMELINES.includes(data.timeline)) e.timeline = 'Please choose a timeline.';
    if (step === 3) {
      if (!data.name.trim()) e.name = 'Please enter your name.';
      if (!data.country.trim()) e.country = 'Please enter your country.';
      if (!CONTACT_METHODS.includes(data.contact)) e.contact = 'Please choose a contact method.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'Please enter a valid email address.';
      if (needsPhone && (!/^\+?[\d ()-]+$/.test(data.phone.trim()) || data.phone.replace(/\D/g, '').length < 7 || data.phone.replace(/\D/g, '').length > 15)) {
        e.phone = 'Please enter a valid number, including the country code.';
      }
    }
    setErrors(e);
    const firstError = Object.keys(e)[0] as keyof LeadData | undefined;
    if (firstError) {
      if (firstError === 'interest') setStep(1);
      else if (firstError === 'timeline') setStep(2);
      requestAnimationFrame(() => document.getElementById(fieldId(firstError))?.focus());
    }
    return !firstError;
  };

  const waMessage = [
    'Hello Itinerary of Türkiye, I would like to plan a visit.',
    `Name: ${data.name.trim() || '-'}`,
    `Country: ${data.country.trim() || '-'}`,
    `Journey: ${data.interest || '-'}`,
    `Timeline: ${data.timeline || '-'}`,
    `Preferred contact: ${data.contact || '-'}`,
    data.email.trim() ? `Email: ${data.email.trim()}` : '',
    needsPhone && data.phone.trim() ? `Phone: ${data.phone.trim()}` : '',
  ].filter(Boolean).join('\n');
  const whatsapp = whatsAppUrl(waMessage);
  const hasWhatsApp = whatsapp.startsWith('https://wa.me/');
  const fallbackHref = hasWhatsApp ? whatsapp : `mailto:info@itineraryofturkiye.com?subject=${encodeURIComponent('Plan my Türkiye visit')}&body=${encodeURIComponent(waMessage)}`;

  const submit = async () => {
    if (inFlight.current || !validate()) return;
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    inFlight.current = true;
    setSending(true);
    setSubmitError('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let delivered = false;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New enquiry — ${data.interest} — ${data.name.trim()}`,
          from_name: 'Itinerary of Türkiye — Website',
          name: data.name.trim(),
          email: data.email.trim(),
          Country: data.country.trim(),
          'Area of interest': data.interest,
          Timeline: data.timeline,
          'Preferred contact': data.contact,
          ...(needsPhone ? { Phone: data.phone.trim() } : {}),
          Language: locale,
          Page: window.location.pathname,
        }),
      });
      const result = await response.json();
      if (!response.ok || result?.success !== true) throw new Error('Submission was not accepted.');
      delivered = true;
      setSubmitted(true);
    } catch {
      setSubmitError('Your enquiry could not be sent. Your details are still here — please retry or contact us below.');
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
      setSending(false);
    }
    if (delivered) track('lead_submit', { source: 'form_submit', locale, path: window.location.pathname, interest: data.interest });
  };

  return (
    <div className="lf-scope">
      <style>{`
        .lf-scope .lf-box { padding: 32px; border: 1px solid rgba(255,250,241,.18); border-radius: 22px; background: rgba(255,255,255,.045); box-shadow: 0 20px 50px rgba(0,0,0,.08); }
        .lf-scope fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
        .lf-scope .lf-step { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; color: #d8b878; font: 600 11px var(--font-inter), sans-serif; letter-spacing: .09em; text-transform: uppercase; }
        .lf-scope .lf-prog { height: 3px; background: rgba(255,250,241,.12); border-radius: 999px; overflow: hidden; margin-bottom: 26px; }
        .lf-scope .lf-bar { height: 100%; background: #d8b878; transition: width .35s; }
        .lf-scope .lf-ttl { margin: 0 0 22px; color: #fffaf1; font-size: 25px; font-weight: 500; font-family: var(--font-playfair), Georgia, serif; line-height: 1.3; }
        .lf-scope .lf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .lf-scope .lf-field { display: grid; gap: 8px; margin-bottom: 16px; }
        .lf-scope .lf-field label { font: 600 11px var(--font-inter), sans-serif; letter-spacing: .07em; color: rgba(255,250,241,.82); text-transform: uppercase; }
        .lf-scope .lf-field input, .lf-scope .lf-field select { box-sizing: border-box; width: 100%; min-height: 52px; padding: 0 14px; border: 1px solid rgba(255,250,241,.2); border-radius: 10px; color: #fffaf1; background: rgba(7,23,38,.45); font: 14px var(--font-inter), sans-serif; transition: border .2s; }
        .lf-scope .lf-field input::placeholder { color: rgba(255,250,241,.48); }
        .lf-scope .lf-field input:focus-visible, .lf-scope .lf-field select:focus-visible, .lf-scope .lf-btn:focus-visible { outline: 2px solid #d8b878; outline-offset: 3px; }
        .lf-scope .lf-field [aria-invalid="true"] { border-color: #ffb2a7; }
        .lf-scope .lf-field option { color: #081f35; background: #fffaf1; }
        .lf-scope .lf-err { color: #ffb2a7; font: 13px/1.5 var(--font-inter), sans-serif; display: block; }
        .lf-scope .lf-submit-error { margin-top: 18px; padding: 14px; border: 1px solid rgba(255,178,167,.35); background: rgba(255,178,167,.06); border-radius: 10px; }
        .lf-scope .lf-submit-error p { margin: 0 0 10px; }
        .lf-scope .lf-submit-error a { color: #ead3a4; font-size: 13px; }
        .lf-scope .lf-btn { min-height: 52px; padding: 0 22px; border-radius: 999px; border: none; font: 700 13px var(--font-inter), sans-serif; cursor: pointer; }
        .lf-scope .lf-btn-primary { background: #d8b878; color: #071726; flex: 1; }
        .lf-scope .lf-btn-primary:hover { background: #ead3a4; }
        .lf-scope .lf-btn-ghost { background: rgba(255,255,255,.1); color: #fffaf1; }
        .lf-scope .lf-btn:disabled { opacity: .65; cursor: wait; }
        .lf-scope .lf-note { font: 11px/1.7 var(--font-inter), sans-serif; color: rgba(255,250,241,.63); margin: 20px 0 0; }
        .lf-scope .lf-note a { color: #d8b878; }
        .lf-scope .lf-success h3 { color: #d8b878; font-size: 27px; font-weight: 500; margin: 0 0 14px; font-family: var(--font-playfair), Georgia, serif; }
        .lf-scope .lf-success p { color: rgba(255,250,241,.78); font: 14px/1.8 var(--font-inter), sans-serif; margin: 0 0 20px; }
        .lf-scope a.lf-wa { display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; width: auto; }
        @media (max-width: 480px) { .lf-scope .lf-box { padding: 24px 20px; } .lf-scope .lf-row { grid-template-columns: 1fr; gap: 0; } }
        @media (prefers-reduced-motion: reduce) { .lf-scope * { transition: none !important; } }
      `}</style>

      <form className="lf-box" noValidate aria-busy={sending} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        {!submitted ? (
          <>
            <div className="lf-step"><span>Your visit</span><span>Step {step} of 3</span></div>
            <div className="lf-prog" aria-hidden="true"><div className="lf-bar" style={{ width: `${step / 3 * 100}%` }} /></div>
            <fieldset disabled={sending}>
              {step === 1 && (
                <div>
                  <h3 ref={headingRef} tabIndex={-1} className="lf-ttl">What brings you to Türkiye?</h3>
                  <div className="lf-field">
                    <label htmlFor={fieldId('interest')}>Your journey *</label>
                    <select id={fieldId('interest')} required aria-invalid={Boolean(errors.interest)} aria-describedby={errors.interest ? `${fieldId('interest')}-err` : undefined} value={data.interest} onChange={(event) => { update('interest', event.target.value); onInterestChange?.(event.target.value); }}>
                      <option value="">Select your journey</option>
                      {interests.map((interest) => <option key={interest}>{interest}</option>)}
                    </select>
                    {errors.interest && <span id={`${fieldId('interest')}-err`} role="alert" className="lf-err">{errors.interest}</span>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 ref={headingRef} tabIndex={-1} className="lf-ttl">When would you like to visit?</h3>
                  <div className="lf-field">
                    <label htmlFor={fieldId('timeline')}>Preferred timeline *</label>
                    <select id={fieldId('timeline')} required aria-invalid={Boolean(errors.timeline)} aria-describedby={errors.timeline ? `${fieldId('timeline')}-err` : undefined} value={data.timeline} onChange={(event) => update('timeline', event.target.value)}>
                      <option value="">Select your timeline</option>
                      {TIMELINES.map((timeline) => <option key={timeline}>{timeline}</option>)}
                    </select>
                    {errors.timeline && <span id={`${fieldId('timeline')}-err`} role="alert" className="lf-err">{errors.timeline}</span>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 ref={headingRef} tabIndex={-1} className="lf-ttl">Let&apos;s start a conversation.</h3>
                  <div className="lf-field">
                    <label htmlFor={fieldId('name')}>Your name *</label>
                    <input id={fieldId('name')} required maxLength={100} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${fieldId('name')}-err` : undefined} type="text" placeholder="Full name" value={data.name} onChange={(event) => update('name', event.target.value)} />
                    {errors.name && <span id={`${fieldId('name')}-err`} role="alert" className="lf-err">{errors.name}</span>}
                  </div>
                  <div className="lf-row">
                    <div className="lf-field">
                      <label htmlFor={fieldId('country')}>Country *</label>
                      <input id={fieldId('country')} required maxLength={100} autoComplete="country-name" aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? `${fieldId('country')}-err` : undefined} type="text" placeholder="Where you live" value={data.country} onChange={(event) => update('country', event.target.value)} />
                      {errors.country && <span id={`${fieldId('country')}-err`} role="alert" className="lf-err">{errors.country}</span>}
                    </div>
                    <div className="lf-field">
                      <label htmlFor={fieldId('contact')}>Preferred contact *</label>
                      <select id={fieldId('contact')} required aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? `${fieldId('contact')}-err` : undefined} value={data.contact} onChange={(event) => update('contact', event.target.value)}>
                        <option value="">Select method</option>
                        {CONTACT_METHODS.map((method) => <option key={method}>{method}</option>)}
                      </select>
                      {errors.contact && <span id={`${fieldId('contact')}-err`} role="alert" className="lf-err">{errors.contact}</span>}
                    </div>
                  </div>
                  <div className="lf-field">
                    <label htmlFor={fieldId('email')}>Email *</label>
                    <input id={fieldId('email')} required maxLength={254} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${fieldId('email')}-err` : undefined} type="email" placeholder="you@example.com" value={data.email} onChange={(event) => update('email', event.target.value)} />
                    {errors.email && <span id={`${fieldId('email')}-err`} role="alert" className="lf-err">{errors.email}</span>}
                  </div>
                  {needsPhone && (
                    <div className="lf-field">
                      <label htmlFor={fieldId('phone')}>{data.contact === 'WhatsApp' ? 'WhatsApp number' : 'Phone number'} *</label>
                      <input id={fieldId('phone')} required maxLength={25} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${fieldId('phone')}-err` : undefined} type="tel" placeholder="+44 7700 900000" value={data.phone} onChange={(event) => update('phone', event.target.value)} />
                      {errors.phone && <span id={`${fieldId('phone')}-err`} role="alert" className="lf-err">{errors.phone}</span>}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {step > 1 && <button type="button" className="lf-btn lf-btn-ghost" onClick={() => { setErrors({}); setSubmitError(''); setStep((current) => current - 1); }}>Back</button>}
                <button type="submit" className="lf-btn lf-btn-primary" disabled={sending}>{step < 3 ? 'Continue →' : sending ? 'Sending…' : 'Request a conversation →'}</button>
              </div>
            </fieldset>
            {submitError && (
              <div className="lf-submit-error">
                <p className="lf-err" role="alert">{submitError}</p>
                <a href={fallbackHref} target={hasWhatsApp ? '_blank' : undefined} rel={hasWhatsApp ? 'noopener noreferrer' : undefined} data-wa-source={hasWhatsApp ? 'form_fallback' : undefined}>{hasWhatsApp ? 'Send your enquiry on WhatsApp →' : 'Send your enquiry by email →'}</a>
              </div>
            )}
            <p className="lf-note">Please share only the essentials here, without medical reports or identity documents. Your details are used to respond to your enquiry. <a href="/privacy">Privacy policy</a></p>
          </>
        ) : (
          <div className="lf-success" role="status">
            <h3 ref={successRef} tabIndex={-1}>Your enquiry has been sent.</h3>
            <p>Thank you for telling us about your visit. Our team will contact you to discuss the next steps. You can also reach us directly below.</p>
            <a className="lf-btn lf-btn-primary lf-wa" href={fallbackHref} data-wa-source={hasWhatsApp ? 'form_reopen' : undefined} target={hasWhatsApp ? '_blank' : undefined} rel={hasWhatsApp ? 'noopener noreferrer' : undefined}>
              <Icon name={hasWhatsApp ? 'whatsapp' : 'message'} size={17} /> {hasWhatsApp ? 'Message us on WhatsApp' : 'Contact us by email'}
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
