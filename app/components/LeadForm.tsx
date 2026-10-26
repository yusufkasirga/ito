'use client';

import { useId, useRef, useState } from 'react';
import { whatsAppUrl } from '@/lib/config';
import { contactRequirements, normalizeLead, sendLead, validateLeadStep } from '@/lib/lead-form.mjs';
import type { LeadData, LeadErrorCode } from '@/lib/lead-form.mjs';
import { track } from '@vercel/analytics';
import Icon from './Icon';

const COPY = {
  en: {
    titles: ['What brings you to Türkiye?', 'When do you envision this?', 'How can we reach you?'],
    interest: 'Area of interest', interestPlaceholder: 'Select your interest',
    interests: ['Tourism', 'Medical tourism', 'Investment / Real estate', 'Business', 'Other'],
    timeline: 'Preferred timeline', timelinePlaceholder: 'Select timeline',
    timelines: ['Within 2 weeks', '1–2 months', '3–6 months', 'Exploratory only'],
    name: 'Your name', namePlaceholder: 'Full name', country: 'Country', countryPlaceholder: 'UK, UAE, Germany…',
    contact: 'Preferred contact', contactPlaceholder: 'Select method',
    contacts: ['Email', 'WhatsApp', 'Phone call', 'Video meeting'],
    email: 'Email', phone: 'Phone number', phoneHelp: 'Include your country code, for example +44 7700 900123.',
    back: 'Back', next: 'Continue →', send: 'Submit request', sending: 'Sending…', retry: 'Try again',
    errors: { select: 'Please select an option.', required: 'This field is required.', email: 'Enter a valid email address.', phone: 'Enter a valid phone number with + and your country code.' },
    failure: 'We could not confirm that your request was sent. Your details are still here. Please try again, or send your enquiry on WhatsApp.',
    successTitle: '✓ Thank you — your enquiry has been sent',
    successBody: 'Your request has been accepted. Our team will be in touch using your preferred contact method. You can also message us on WhatsApp.',
    whatsapp: 'Message us on WhatsApp', safety: 'Please do not send medical reports, photos or ID documents in a first message.',
    privacy: 'We use these details to respond to your enquiry.', privacyLink: 'Privacy policy',
    step: (step: number) => `Step ${step} of 3`,
  },
  de: {
    titles: ['Was führt Sie in die Türkei?', 'Wann möchten Sie reisen?', 'Wie können wir Sie erreichen?'],
    interest: 'Interesse', interestPlaceholder: 'Bitte Interesse auswählen',
    interests: ['Tourismus', 'Medizintourismus', 'Investitionen / Immobilien', 'Geschäftlich', 'Sonstiges'],
    timeline: 'Gewünschter Zeitraum', timelinePlaceholder: 'Bitte Zeitraum auswählen',
    timelines: ['Innerhalb von 2 Wochen', 'In 1–2 Monaten', 'In 3–6 Monaten', 'Zunächst informieren'],
    name: 'Ihr Name', namePlaceholder: 'Vollständiger Name', country: 'Land', countryPlaceholder: 'Deutschland, Österreich, Schweiz…',
    contact: 'Gewünschter Kontaktweg', contactPlaceholder: 'Bitte Kontaktweg auswählen',
    contacts: ['E-Mail', 'WhatsApp', 'Telefonanruf', 'Videogespräch'],
    email: 'E-Mail', phone: 'Telefonnummer', phoneHelp: 'Mit Landesvorwahl eingeben, zum Beispiel +49 151 12345678.',
    back: 'Zurück', next: 'Weiter →', send: 'Anfrage senden', sending: 'Wird gesendet…', retry: 'Erneut versuchen',
    errors: { select: 'Bitte wählen Sie eine Option.', required: 'Dieses Feld ist erforderlich.', email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', phone: 'Bitte geben Sie eine gültige Telefonnummer mit + und Landesvorwahl ein.' },
    failure: 'Wir konnten den Versand Ihrer Anfrage nicht bestätigen. Ihre Angaben bleiben erhalten. Versuchen Sie es erneut oder senden Sie Ihre Anfrage über WhatsApp.',
    successTitle: '✓ Vielen Dank — Ihre Anfrage wurde gesendet',
    successBody: 'Ihre Anfrage wurde angenommen. Unser Team meldet sich über Ihren gewünschten Kontaktweg. Sie können uns auch über WhatsApp schreiben.',
    whatsapp: 'Über WhatsApp schreiben', safety: 'Bitte senden Sie in Ihrer ersten Nachricht keine medizinischen Berichte, Fotos oder Ausweisdokumente.',
    privacy: 'Wir verwenden diese Angaben, um Ihre Anfrage zu beantworten.', privacyLink: 'Datenschutzerklärung',
    step: (step: number) => `Schritt ${step} von 3`,
  },
  ru: {
    titles: ['Что привело вас в Турцию?', 'Когда вы планируете поездку?', 'Как с вами связаться?'],
    interest: 'Что вас интересует', interestPlaceholder: 'Выберите направление',
    interests: ['Туризм', 'Медицинский туризм', 'Инвестиции / Недвижимость', 'Бизнес', 'Другое'],
    timeline: 'Желаемые сроки', timelinePlaceholder: 'Выберите сроки',
    timelines: ['В течение 2 недель', 'Через 1–2 месяца', 'Через 3–6 месяцев', 'Пока только изучаю варианты'],
    name: 'Ваше имя', namePlaceholder: 'Полное имя', country: 'Страна', countryPlaceholder: 'Россия, Казахстан, ОАЭ…',
    contact: 'Предпочтительный способ связи', contactPlaceholder: 'Выберите способ связи',
    contacts: ['Электронная почта', 'WhatsApp', 'Телефонный звонок', 'Видеовстреча'],
    email: 'Электронная почта', phone: 'Номер телефона', phoneHelp: 'Укажите код страны, например +7 999 1234567.',
    back: 'Назад', next: 'Продолжить →', send: 'Отправить заявку', sending: 'Отправляем…', retry: 'Попробовать снова',
    errors: { select: 'Выберите один из вариантов.', required: 'Обязательное поле.', email: 'Введите действительный адрес электронной почты.', phone: 'Введите действительный номер телефона с + и кодом страны.' },
    failure: 'Не удалось подтвердить отправку заявки. Ваши данные сохранены в форме. Попробуйте ещё раз или отправьте заявку через WhatsApp.',
    successTitle: '✓ Спасибо — ваша заявка отправлена',
    successBody: 'Ваша заявка принята. Наша команда свяжется с вами выбранным способом. Вы также можете написать нам в WhatsApp.',
    whatsapp: 'Написать в WhatsApp', safety: 'Не отправляйте медицинские заключения, фотографии или документы, удостоверяющие личность, в первом сообщении.',
    privacy: 'Мы используем эти данные, чтобы ответить на вашу заявку.', privacyLink: 'Политика конфиденциальности',
    step: (step: number) => `Шаг ${step} из 3`,
  },
};
const INTERESTS = ['Tourism', 'Medical Tourism', 'Investment / Real Estate', 'Business', 'Other'];
const TIMELINES = ['Within 2 weeks', '1–2 months', '3–6 months', 'Exploratory only'];
const CONTACTS = ['Email', 'WhatsApp', 'Phone call', 'Video meeting'];

/** Shared enquiry form. A sent state requires explicit acceptance by the site. */
export default function LeadForm({ locale = 'en' }: { locale?: 'en' | 'de' | 'ru' }) {
  const copy = COPY[locale];
  const formId = useId();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<LeadData>({ interest: '', country: '', timeline: '', contact: '', name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, LeadErrorCode>>>({});
  const [submitError, setSubmitError] = useState(false);
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const requestIdRef = useRef<string | null>(null);
  const required = contactRequirements(data.contact);
  const id = (field: string) => `${formId}-${field}`;
  const update = (field: keyof LeadData, value: string) => {
    // An edited enquiry is a new request; unchanged retries retain their identity.
    if (requestIdRef.current && data[field] !== value) requestIdRef.current = null;
    setData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };
  const fieldError = (field: keyof LeadData) => errors[field] && (
    <span id={id(`${field}-err`)} role="alert" className="lf-err">{copy.errors[errors[field]]}</span>
  );
  const accessibility = (field: keyof LeadData) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? id(`${field}-err`) : undefined,
  });
  const clean = normalizeLead(data);
  const waMessage = [
    'Hello Itinerary of Türkiye, I would like to plan a trip.',
    `Name: ${clean.name || '-'}`, `Country: ${clean.country || '-'}`,
    `Area of interest: ${clean.interest || '-'}`, `Timeline: ${clean.timeline || '-'}`,
    `Preferred contact: ${clean.contact || '-'}`,
    clean.email ? `Email: ${clean.email}` : '', clean.phone ? `Phone: ${clean.phone}` : '',
  ].filter(Boolean).join('\n');

  const submit = async () => {
    if (sendingRef.current || submitted) return;
    const nextErrors = validateLeadStep(data, step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    // The ref closes the interval before React renders the disabled button.
    sendingRef.current = true;
    setSending(true);
    setSubmitError(false);
    try {
      requestIdRef.current ??= globalThis.crypto.randomUUID();
      await sendLead(data, { requestId: requestIdRef.current, locale, page: window.location.pathname });
    } catch {
      setSubmitError(true);
      return;
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
    setSubmitted(true);
    try {
      track('lead_submit', { source: 'form_submit', locale, path: window.location.pathname });
    } catch {
      // Analytics availability must not change a confirmed delivery result.
    }
  };
  const whatsappLink = (source: string) => (
    <a className="lf-btn lf-wa" href={whatsAppUrl(waMessage)} data-wa-source={source} target="_blank" rel="noopener noreferrer">
      <Icon name="whatsapp" size={17} /> {copy.whatsapp}
    </a>
  );

  return (
    <div className="lf-scope">
      <style>{`
        .lf-scope .lf-box { padding: 28px; border: 1px solid rgba(255,250,241,.16); border-radius: 20px; background: rgba(255,255,255,.06); }
        .lf-scope .lf-prog { height: 4px; background: rgba(255,250,241,.1); border-radius: 999px; overflow: hidden; margin-bottom: 24px; }
        .lf-scope .lf-bar { height: 100%; background: linear-gradient(90deg, #c9a96a, #8ed8dc); transition: width .35s; }
        .lf-scope .lf-ttl { margin: 0 0 18px; color: #fff; font-size: 18px; font-weight: 900; font-family: var(--font-inter), system-ui, sans-serif; }
        .lf-scope .lf-fields { border: 0; padding: 0; margin: 0; min-width: 0; }
        .lf-scope .lf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .lf-scope .lf-field { display: grid; gap: 8px; margin-bottom: 12px; }
        .lf-scope .lf-field label { font-size: 11px; font-weight: 900; letter-spacing: .04em; color: rgba(255,250,241,.78); text-transform: uppercase; }
        .lf-scope .lf-field input, .lf-scope .lf-field select { width: 100%; min-height: 52px; padding: 0 14px; border: 1px solid rgba(255,250,241,.18); border-radius: 12px; color: #fff; background: rgba(7,23,38,.5); font: 16px var(--font-inter), sans-serif; outline: none; transition: border .2s; }
        .lf-scope .lf-field input:focus-visible, .lf-scope .lf-field select:focus-visible { border-color: #8ed8dc; outline: 2px solid #8ed8dc; outline-offset: 2px; }
        .lf-scope .lf-field [aria-invalid="true"] { border-color: #ff9a9a; }
        .lf-scope .lf-field option { color: #081f35; }
        .lf-scope .lf-err { color: #ffb0b0; font-size: 13px; display: block; margin-top: 2px; line-height: 1.5; }
        .lf-scope .lf-help { color: rgba(255,250,241,.72); font-size: 12px; line-height: 1.6; margin: 0; }
        .lf-scope .lf-help a { color: inherit; text-underline-offset: 3px; }
        .lf-scope .lf-btn { min-height: 52px; padding: 14px 26px; border-radius: 999px; border: none; font: 800 14px var(--font-inter), sans-serif; cursor: pointer; }
        .lf-scope .lf-btn-primary { background: #c9a96a; color: #081f35; flex: 1; }
        .lf-scope .lf-btn-ghost { background: rgba(255,255,255,.12); color: #fff; }
        .lf-scope .lf-btn:disabled { opacity: .65; cursor: wait; }
        .lf-scope .lf-btn:focus-visible { outline: 2px solid #8ed8dc; outline-offset: 4px; }
        .lf-scope .lf-success h3 { color: #8ed8dc; font-size: 20px; margin: 0 0 10px; font-family: var(--font-playfair), serif; }
        .lf-scope .lf-success p { color: rgba(255,250,241,.75); font-size: 14px; line-height: 1.7; margin: 0 0 14px; }
        .lf-scope a.lf-wa { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; background: #25D366; color: #082b17; }
        .lf-scope .lf-failure { padding: 16px; border: 1px solid rgba(255,154,154,.4); border-radius: 12px; margin-top: 16px; }
        .lf-scope .lf-failure p { margin: 0 0 12px; }
        @media (max-width: 480px) { .lf-scope .lf-box { padding: 22px 18px; } .lf-scope .lf-row { grid-template-columns: 1fr; gap: 0; } }
        @media (prefers-reduced-motion: reduce) { .lf-scope .lf-bar { transition: none; } }
      `}</style>
      <form className="lf-box" noValidate aria-busy={sending} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        {!submitted ? (
          <>
            <div className="lf-prog" role="progressbar" aria-label={copy.step(step)} aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
              <div className="lf-bar" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
            <fieldset className="lf-fields" disabled={sending}>
              <legend className="lf-ttl">{copy.titles[step - 1]}</legend>
              {step === 1 && (
                <div className="lf-field">
                  <label htmlFor={id('interest')}>{copy.interest} *</label>
                  <select id={id('interest')} name="interest" required {...accessibility('interest')} value={data.interest} onChange={(event) => update('interest', event.target.value)}>
                    <option value="">{copy.interestPlaceholder}</option>
                    {INTERESTS.map((value, index) => <option key={value} value={value}>{copy.interests[index]}</option>)}
                  </select>
                  {fieldError('interest')}
                </div>
              )}
              {step === 2 && (
                <div className="lf-field">
                  <label htmlFor={id('timeline')}>{copy.timeline} *</label>
                  <select id={id('timeline')} name="timeline" required {...accessibility('timeline')} value={data.timeline} onChange={(event) => update('timeline', event.target.value)}>
                    <option value="">{copy.timelinePlaceholder}</option>
                    {TIMELINES.map((value, index) => <option key={value} value={value}>{copy.timelines[index]}</option>)}
                  </select>
                  {fieldError('timeline')}
                </div>
              )}
              {step === 3 && (
                <>
                  <div className="lf-field">
                    <label htmlFor={id('name')}>{copy.name} *</label>
                    <input id={id('name')} name="name" autoComplete="name" required maxLength={150} {...accessibility('name')} type="text" placeholder={copy.namePlaceholder} value={data.name} onChange={(event) => update('name', event.target.value)} />
                    {fieldError('name')}
                  </div>
                  <div className="lf-row">
                    <div className="lf-field">
                      <label htmlFor={id('country')}>{copy.country} *</label>
                      <input id={id('country')} name="country" autoComplete="country-name" required maxLength={100} {...accessibility('country')} type="text" placeholder={copy.countryPlaceholder} value={data.country} onChange={(event) => update('country', event.target.value)} />
                      {fieldError('country')}
                    </div>
                    <div className="lf-field">
                      <label htmlFor={id('contact')}>{copy.contact} *</label>
                      <select id={id('contact')} name="contact" required {...accessibility('contact')} value={data.contact} onChange={(event) => { update('contact', event.target.value); setErrors({}); }}>
                        <option value="">{copy.contactPlaceholder}</option>
                        {CONTACTS.map((value, index) => <option key={value} value={value}>{copy.contacts[index]}</option>)}
                      </select>
                      {fieldError('contact')}
                    </div>
                  </div>
                  <div className="lf-field">
                    <label htmlFor={id('email')}>{copy.email}{required.email ? ' *' : ''}</label>
                    <input id={id('email')} name="email" type="email" autoComplete="email" required={required.email} maxLength={254} {...accessibility('email')} placeholder="your@email.com" value={data.email} onChange={(event) => update('email', event.target.value)} />
                    {fieldError('email')}
                  </div>
                  {required.phone && (
                    <div className="lf-field">
                      <label htmlFor={id('phone')}>{copy.phone} *</label>
                      <input id={id('phone')} name="phone" type="tel" autoComplete="tel" required maxLength={40} aria-invalid={Boolean(errors.phone)} aria-describedby={`${id('phone-help')}${errors.phone ? ` ${id('phone-err')}` : ''}`} placeholder="+44 7700 900123" value={data.phone} onChange={(event) => update('phone', event.target.value)} />
                      <p id={id('phone-help')} className="lf-help">{copy.phoneHelp}</p>
                      {fieldError('phone')}
                    </div>
                  )}
                </>
              )}
              {step === 3 && (
                <p className="lf-help" style={{ marginTop: '16px' }}>
                  {copy.privacy}{' '}<a href={locale === 'de' ? '/de/privacy' : '/privacy'}>{copy.privacyLink}</a>.
                </p>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                {step > 1 && <button type="button" className="lf-btn lf-btn-ghost" onClick={() => { setStep(step - 1); setErrors({}); setSubmitError(false); }}>{copy.back}</button>}
                <button type="submit" className="lf-btn lf-btn-primary" disabled={sending}>
                  {step < 3 ? copy.next : sending ? copy.sending : submitError ? copy.retry : copy.send}
                </button>
              </div>
            </fieldset>
            {submitError && (
              <div className="lf-failure">
                <p role="alert" className="lf-err">{copy.failure}</p>
                {whatsappLink('form_fallback')}
              </div>
            )}
          </>
        ) : (
          <div className="lf-success" role="status">
            <h3>{copy.successTitle}</h3>
            <p>{copy.successBody}</p>
            {whatsappLink('form_reopen')}
          </div>
        )}
        <p className="lf-help" style={{ marginTop: '16px' }}>{copy.safety}</p>
      </form>
    </div>
  );
}
