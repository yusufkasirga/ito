'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { whatsAppUrl } from '@/lib/config';
import HeroVideo from './components/HeroVideo';
import SiteHeader from './components/SiteHeader';
import LeadForm from './components/LeadForm';
import ScrollFx from './components/home/ScrollFx';
import DestinationRail from './components/home/DestinationRail';
import './home.css';

const questions = [
  { question: 'How does the planning fee work?', answer: 'We quote a flat planning fee before work begins. Your written plan sets out our fee separately from provider costs. Read How We Work for what the consultation includes.' },
  { question: 'Can you help with medical travel?', answer: 'We help with provider checks, appointments, translation and the practical details of your stay. Diagnosis, treatment recommendations and clinical decisions belong to your licensed medical team.' },
  { question: 'What should I include in my first enquiry?', answer: 'Tell us your interests, approximate dates, country and how to reach you. Please leave out medical records, identity documents and payment information. We will explain the appropriate next step for anything confidential.' },
  { question: 'Can I speak with someone in my language?', answer: 'Tell us your preferred language when you enquire. Our team works in English, Turkish, German and Russian, with translation support arranged around your needs.' },
];

const steps = [
  { number: '01', title: 'Start with a conversation.', copy: 'Your dates, your interests, your questions. Tell us what a good trip would look like for you.' },
  { number: '02', title: 'Consider your personal plan.', copy: 'We explain the options, check providers and prepare a written plan with clear costs and a quoted planning fee.' },
  { number: '03', title: 'Arrive with a local team.', copy: 'Transfers, appointments and the details in between. Stay in touch with the people who helped plan your visit.' },
];

/** Server-rendered editorial content stays outside the client module graph. */
export default function HomeClient({ journal }: { journal: ReactNode }) {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const page = document.documentElement;
      const length = page.scrollHeight - page.clientHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${length > 0 ? page.scrollTop / length : 0})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="ito-home" id="main-content">
      <a className="ih-skip" href="#tourism">Skip introduction</a>
      <div className="ih-progress" ref={progress} aria-hidden="true" />
      <ScrollFx />
      <SiteHeader overlay />

      <section className="ih-hero" id="top" aria-labelledby="home-title">
        <HeroVideo
          poster="/images/hero-poster-1920x1080.jpg"
          posterMobile="/images/hero-poster-portrait.jpg"
          srcLarge="/videos/hero-turkiye-1080p"
          srcDesktop="/videos/hero-turkiye-720p"
          srcMobile="/videos/hero-turkiye-portrait"
          pauseLabel="Pause background video"
          playLabel="Play background video"
          chapters={[
            { at: 0, label: 'Sultanahmet · Istanbul' },
            { at: 4.1, label: 'Galata · Istanbul' },
            { at: 7.8, label: 'Cappadocia at sunrise' },
            { at: 11.5, label: 'Cappadocia' },
            { at: 15.2, label: 'Golden Horn · Istanbul' },
            { at: 18.9, label: 'The Bosphorus by night' },
          ]}
        />
        <div className="ih-container ih-hero-content">
          <p className="ih-eyebrow">Independent travel advisory</p>
          <h1 id="home-title">Türkiye.<br /><em>At your pace.</em></h1>
          <p className="ih-lede">Private journeys and thoughtful medical travel coordination. A personal plan, and a local team beside you.</p>
          <div className="ih-actions">
            <a className="ih-button" href="#contact">Plan my visit <span aria-hidden="true">↗</span></a>
            <a className="ih-text-link" href="#tourism">Explore Türkiye <span aria-hidden="true">↓</span></a>
          </div>
          <p className="ih-hero-note">Paid by our clients. Independent of provider commissions.</p>
        </div>
        <a className="ih-next" href="#tourism"><span>Discover what comes next</span><span aria-hidden="true">↓</span></a>
      </section>

      <section className="ih-travel ih-scene" id="tourism" aria-labelledby="travel-title">
        <div className="ih-scene-image" aria-hidden="true"><Image src="/images/dest/ephesus.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} /></div>
        <div className="ih-scene-shade" />
        <div className="ih-container ih-scene-content">
          <div className="ih-chapter"><span>01 / Private Türkiye</span><span>Ephesus · The Aegean</span></div>
          <div className="ih-travel-copy" data-reveal>
            <p className="ih-eyebrow">A journey of your own</p>
            <h2 id="travel-title">Your route.<br /><em>Your kind of discovery.</em></h2>
            <p className="ih-copy">Ancient streets, long lunches and room to wander. We connect the places you love into an itinerary shaped around your dates, interests and pace.</p>
            <div className="ih-actions"><a className="ih-button" href="#contact">Plan a private journey <span aria-hidden="true">↗</span></a><Link className="ih-text-link" href="/services/tourism">Our travel services <span aria-hidden="true">→</span></Link></div>
            <ul className="ih-travel-notes" aria-label="Private travel services"><li>Personal itineraries</li><li>Local guides</li><li>Stay & transfer planning</li></ul>
          </div>
        </div>
      </section>

      <DestinationRail
        eyebrow="Find your starting point"
        title="A place for"
        accent="your curiosity."
        copy="Explore our destination guides, then let us connect your favourites into a personal journey."
        allLabel="All destination guides"
        guideLabel="Read the guide"
        prevLabel="Previous destinations"
        nextLabel="Next destinations"
      />

      <section className="ih-care" id="health" aria-labelledby="care-title">
        <div className="ih-care-content" data-reveal>
          <p className="ih-eyebrow">02 / Medical travel</p>
          <h2 id="care-title">A little clarity.<br /><em>A team beside you.</em></h2>
          <p className="ih-copy">Getting organised in another country takes care. We help you ask the right questions and coordinate the practical details around your medical team.</p>
          <ul className="ih-care-list"><li><span>01</span>Provider credentials and communication</li><li><span>02</span>Appointments, translation and travel planning</li><li><span>03</span>A dedicated point of contact during your visit</li></ul>
          <div className="ih-actions"><a className="ih-button ih-button-dark" href="#contact">Discuss your visit <span aria-hidden="true">↗</span></a><Link className="ih-text-link" href="/services/medical-tourism">How we coordinate care <span aria-hidden="true">→</span></Link></div>
          <p className="ih-small">We coordinate your visit. Your licensed medical team makes clinical decisions.</p>
        </div>
        <div className="ih-care-visual"><Image src="/images/home/galata-tower.jpg" alt="Galata Tower among the streets of Istanbul" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} /><span>Istanbul, Türkiye</span></div>
      </section>

      <section className="ih-process" id="how-it-works" aria-labelledby="process-title">
        <div className="ih-container">
          <div className="ih-process-heading" data-reveal><p className="ih-eyebrow">03 / From an idea to an itinerary</p><h2 id="process-title">A conversation.<br /><em>Then a considered plan.</em></h2><Link className="ih-text-link" href="/how-we-work">What a planning consultation includes <span aria-hidden="true">↗</span></Link></div>
          <ol className="ih-steps">{steps.map(step => <li key={step.number} data-reveal><span className="ih-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol>
        </div>
      </section>

      <section className="ih-about" id="about" aria-labelledby="about-title">
        <div className="ih-container ih-about-grid">
          <div data-reveal><p className="ih-eyebrow">04 / The people behind your plan</p><h2 id="about-title">Local knowledge.<br /><em>A personal connection.</em></h2><p className="ih-copy">We are Itinerary of Türkiye: a local advisory team for private travel and medical travel coordination. We listen, explain the options and stay involved in the details.</p><div className="ih-actions"><Link className="ih-text-link" href="/about">Meet Itinerary of Türkiye <span aria-hidden="true">→</span></Link><Link className="ih-text-link" href="/standard">Our provider selection standard <span aria-hidden="true">→</span></Link></div></div>
          <figure className="ih-story" data-reveal><span className="ih-quote-mark" aria-hidden="true">“</span><blockquote>You made my whole journey incredibly smooth — from my trip and hair transplant to my business meetings.</blockquote><figcaption><span>Mark T.</span><span>Client story · United Kingdom</span></figcaption><Link className="ih-text-link" href="/testimonials">More client stories <span aria-hidden="true">↗</span></Link></figure>
        </div>
      </section>

      {journal}

      <section className="ih-faq" aria-labelledby="questions-title">
        <div className="ih-container ih-faq-grid"><div><p className="ih-eyebrow">Before we begin</p><h2 id="questions-title">A few things<br /><em>you might ask.</em></h2></div><div className="ih-questions">{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div>
      </section>

      <section className="ih-contact" id="contact" aria-labelledby="contact-title">
        <div className="ih-container ih-contact-grid"><div data-reveal><p className="ih-eyebrow">05 / Your next chapter</p><h2 id="contact-title">Where shall<br /><em>we begin?</em></h2><p className="ih-copy">Tell us what brings you to Türkiye. We will come back to you with questions, possibilities and a clear next step.</p><a className="ih-text-link" href={whatsAppUrl()} target={whatsAppUrl().startsWith('https:') ? '_blank' : undefined} rel="noopener noreferrer" data-wa-source="home_contact">Prefer WhatsApp? Message our team <span aria-hidden="true">↗</span></a><p className="ih-small">Please keep medical reports, identity documents and payment details out of your first enquiry. We will explain the appropriate channel for confidential information.</p></div><div className="ih-form-wrap"><LeadForm /></div></div>
      </section>

      <footer className="ih-footer"><div className="ih-container"><div className="ih-footer-grid"><div><Link className="ih-footer-brand" href="/">Itinerary <em>of Türkiye</em></Link><p>Private journeys.<br />Thoughtful local coordination.</p><a href="https://www.instagram.com/itineraryofturkiye" target="_blank" rel="noopener noreferrer">Follow our Türkiye ↗</a></div><nav aria-label="Explore the site"><p>Explore</p><Link href="/all-turkiye-destinations">Destination guides</Link><Link href="/blog">The Journal</Link><Link href="/about">About our team</Link><Link href="/testimonials">Client stories</Link></nav><nav aria-label="Plan with us"><p>Plan with us</p><Link href="/services/tourism">Private travel</Link><Link href="/services/medical-tourism">Medical travel</Link><Link href="/how-we-work">How we work</Link><Link href="/standard">The ITO standard</Link><Link href="/future-services">Other enquiries</Link></nav></div><div className="ih-footer-bottom"><span>© {new Date().getUTCFullYear()} Itinerary of Türkiye</span><nav aria-label="Legal policies"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/legal-notice">Legal notice</Link></nav></div></div></footer>
    </main>
  );
}
