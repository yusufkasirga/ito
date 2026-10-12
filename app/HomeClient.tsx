'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import HeroVideo from './components/HeroVideo';
import LeadForm from './components/LeadForm';
import CityImage from './components/CityImage';
import Icon from './components/Icon';
import { WHATSAPP_E164_NUMBER, whatsAppUrl } from '@/lib/config';
import styles from './HomeClient.module.css';

export type JourneyArticle = { slug: string; title: string; category: string; cover: string; excerpt: string };

const steps = [
  ['Tell us what matters', 'Your reason for visiting, your priorities and the kind of support you need.'],
  ['Review your options', 'Understand the providers, practical details, costs and questions to ask before deciding.'],
  ['Bring it together', 'Connect appointments, accommodation, transfers and experiences into a personal plan.'],
  ['Travel with a clear contact', 'Know who to reach as your journey unfolds, from arrival through your return home.'],
];
const destinations = [
  { slug: 'istanbul', title: 'Istanbul', tag: 'Culture & connection', text: 'Neighbourhood walks, the Bosphorus and a table worth lingering at.', accent: '#52757b' },
  { slug: 'cappadocia', title: 'Cappadocia', tag: 'A different perspective', text: 'Quiet valleys, cave stays and remarkable mornings.', accent: '#bc9573' },
  { slug: 'antalya', title: 'Antalya', tag: 'Time by the sea', text: 'Coastal stays, old-town discoveries and room to slow down.', accent: '#6a9994' },
  { slug: 'ephesus', title: 'Ephesus', tag: 'Stories that stay', text: 'Ancient streets and an Aegean journey shaped around you.', accent: '#b69a79' },
];
const faqs = [
  ['What does ITO help arrange?', 'We help you plan and coordinate your Türkiye journey: provider introductions, appointments, accommodation, transfers and private experiences, depending on your agreed scope. Your proposal sets out the services included and who delivers each part.'],
  ['How do you charge?', 'You pay ITO a clearly agreed planning and coordination fee. Our model does not rely on commissions from clinics or other providers. Treatment, accommodation, transport and experience costs are identified separately in your proposal.'],
  ['Are you a clinic?', 'ITO provides planning and coordination. Your healthcare provider assesses suitability, explains treatment options and risks, obtains consent and delivers medical care. Clinical decisions and treatment outcomes remain with your medical team.'],
  ['Can I combine treatment with a private trip?', 'Yes, where your medical team considers it appropriate. We plan around appointments and their guidance on recovery, activity and travel. There is no requirement to add sightseeing to a health journey.'],
  ['Can you plan a trip without medical care?', 'Yes. Private travel is a complete service in its own right, shaped around your interests, preferred pace, travel companions and budget.'],
  ['What if my plans change?', 'We help you review the practical options and coordinate changes within the agreed scope. Cancellation terms, additional costs, support hours and provider responsibilities are explained before you commit.'],
];

function useJourneyMotion(rootRef: RefObject<HTMLDivElement | null>, paused: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      root.classList.remove(styles.motionReady);
      if (paused || reduced.matches) return;
      const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
      reveals.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add(styles.visible);
      });
      root.classList.add(styles.motionReady);
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
      reveals.forEach((element) => observer.observe(element));
      let progressFrame = 0;
      const progress = () => {
        cancelAnimationFrame(progressFrame);
        progressFrame = requestAnimationFrame(() => {
          const distance = document.documentElement.scrollHeight - window.innerHeight;
          root.style.setProperty('--journey-progress', String(distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0));
        });
      };
      window.addEventListener('scroll', progress, { passive: true });
      window.addEventListener('resize', progress);
      progress();
      const tiltCleanup: (() => void)[] = [];
      if (fine.matches) {
        root.querySelectorAll<HTMLElement>('[data-tilt]').forEach((element) => {
          let frame = 0;
          const reset = () => {
            cancelAnimationFrame(frame);
            element.style.removeProperty('--tilt-x');
            element.style.removeProperty('--tilt-y');
          };
          const move = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return;
            const bounds = element.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              element.style.setProperty('--tilt-x', `${-y * 3}deg`);
              element.style.setProperty('--tilt-y', `${x * 4}deg`);
            });
          };
          element.addEventListener('pointermove', move);
          element.addEventListener('pointerleave', reset);
          tiltCleanup.push(() => {
            element.removeEventListener('pointermove', move);
            element.removeEventListener('pointerleave', reset);
            reset();
          });
        });
      }
      cleanup = () => {
        observer.disconnect();
        cancelAnimationFrame(progressFrame);
        window.removeEventListener('scroll', progress);
        window.removeEventListener('resize', progress);
        tiltCleanup.forEach((stop) => stop());
      };
    };
    setup();
    reduced.addEventListener('change', setup);
    fine.addEventListener('change', setup);
    return () => {
      cleanup();
      root.classList.remove(styles.motionReady);
      reduced.removeEventListener('change', setup);
      fine.removeEventListener('change', setup);
    };
  }, [paused, rootRef]);
}

export default function HomeClient({ articles }: { articles: JourneyArticle[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [interest, setInterest] = useState('');
  useJourneyMotion(rootRef, paused);
  const plan = (journey: string) => {
    setInterest(journey);
    const reduce = paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    contactRef.current?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
    contactRef.current?.focus({ preventScroll: true });
  };
  const hasWhatsApp = /\d/.test(WHATSAPP_E164_NUMBER);

  return (
    <div ref={rootRef} className={styles.page} data-motion={paused ? 'paused' : 'on'}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.progress} aria-hidden="true" />
      <SiteHeader overlay />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <HeroVideo poster="/images/hero-poster-1920x1080.jpg" posterMobile="/images/hero-poster-portrait.jpg" srcLarge="/videos/hero-turkiye-1080p" srcDesktop="/videos/hero-turkiye-720p" srcMobile="/videos/hero-turkiye-portrait" chapters={[{ at: 0, label: 'Sultanahmet · Istanbul' }, { at: 4.1, label: 'Galata · Istanbul' }, { at: 7.8, label: 'Cappadocia · Sunrise' }, { at: 11.5, label: 'Cappadocia' }, { at: 15.2, label: 'Golden Horn · Istanbul' }, { at: 18.9, label: 'Bosphorus · Istanbul' }]} pauseLabel="Pause video" playLabel="Play video" />
          <div className={styles.heroShade} />
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Health journeys · Private travel</p>
              <h1 id="hero-title" className={styles.heroTitle}>Türkiye,<br />planned <em>around you.</em></h1>
              <p className={styles.heroDescription}>For care, for discovery, or a little of both. One local team to connect the details, from your first conversation to your return home.</p>
              <div className={styles.heroActions}>
                <button className={styles.primaryButton} onClick={() => plan('Health journey')}>Plan a health journey <span aria-hidden="true">↗</span></button>
                <button className={styles.glassButton} onClick={() => plan('Private Türkiye trip')}>Plan a private trip <span aria-hidden="true">↗</span></button>
              </div>
              <p className={styles.heroNote}>Personal planning. Clear fees. A point of contact.</p>
            </div>
            <div className={styles.scene} data-tilt aria-hidden="true">
              <div className={styles.orbit} />
              <div className={`${styles.scenePhoto} ${styles.photoOne}`}><Image src="/images/home/galata-tower.jpg" alt="" fill sizes="250px" /><span>Istanbul, at your pace</span></div>
              <div className={`${styles.scenePhoto} ${styles.photoTwo}`}><Image src="/images/dest/cappadocia.jpg" alt="" fill sizes="240px" /><span>A little room for wonder</span></div>
              <div className={styles.scenePlan}>
                <p className={styles.planEyebrow}>Your Türkiye journey</p>
                <p className={styles.planTitle}>Every detail,<br /><em>connected.</em></p>
                <div className={styles.planLine}><Icon name="medical" size={18} /><span>Care & appointments</span></div>
                <div className={styles.planLine}><Icon name="plane" size={18} /><span>Arrival & your stay</span></div>
                <div className={styles.planLine}><Icon name="landmark" size={18} /><span>Personal experiences</span></div>
              </div>
              <div className={styles.sceneTag}><Icon name="globe" size={20} /><span>One local team.<br /><strong>Your point of contact.</strong></span></div>
            </div>
          </div>
          <div className={`${styles.container} ${styles.heroBottom}`}>
            <a className={styles.discoverLink} href="#journeys">Find your journey <span aria-hidden="true">↓</span></a>
            <button className={styles.motionButton} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? 'Resume depth effects' : 'Pause depth effects'}</button>
          </div>
        </section>

        <div className={styles.introBand}>
          <div className={`${styles.container} ${styles.introInner}`}>
            <p className={styles.introStatement}>You make the journey.<br /><em>We bring the details together.</em></p>
            <div className={styles.introPoints}><span><Icon name="message" /> Personal attention</span><span><Icon name="plan" /> Clear coordination</span><span><Icon name="landmark" /> Local perspective</span></div>
          </div>
        </div>

        <section id="journeys" className={styles.section} aria-labelledby="journeys-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal><p className={styles.sectionLabel}>Two ways to experience Türkiye</p><h2 id="journeys-title" className={styles.sectionTitle}>A purpose for your visit.<br /><em>A plan that fits your life.</em></h2><p className={styles.sectionIntro}>Start with what brings you here. We shape the practical details around your needs, your time and your comfort.</p></div>
            <div className={styles.journeyGrid}>
              <article id="health" className={styles.journeyCard} data-tilt data-reveal>
                <div className={styles.journeyImage}><Image src="/images/home/galata-tower.jpg" alt="Galata Tower above Istanbul's historic streets" fill sizes="(max-width: 700px) 90vw, 45vw" /></div>
                <div className={styles.journeyBody}><p className={styles.journeyNumber}>01 / Health journeys</p><h3 className={styles.journeyTitle}>Space to focus on you.</h3><p className={styles.journeyDescription}>Make an informed choice about care in Türkiye, with practical support before, during and after your visit.</p><ul className={styles.journeyList}><li>Provider options and appointment coordination</li><li>Accommodation, transfers and companion planning</li><li>A journey organised around clinical guidance</li></ul><p className={styles.journeyFootnote}>Your healthcare team assesses suitability and provides all medical care.</p><div className={styles.cardActions}><button className={styles.primaryButton} onClick={() => plan('Health journey')}>Plan my health journey <span aria-hidden="true">↗</span></button><Link className={styles.textLink} href="/services/medical-tourism">Explore the service →</Link></div></div>
              </article>
              <article id="tourism" className={styles.journeyCard} data-tilt data-reveal>
                <div className={styles.journeyImage}><Image src="/images/dest/cappadocia.jpg" alt="Cappadocia's valleys and rock formations" fill sizes="(max-width: 700px) 90vw, 45vw" /></div>
                <div className={styles.journeyBody}><p className={styles.journeyNumber}>02 / Private Türkiye trips</p><h3 className={styles.journeyTitle}>See Türkiye your way.</h3><p className={styles.journeyDescription}>A personal journey with thoughtful stays, local experiences and a pace that feels right for you.</p><ul className={styles.journeyList}><li>An itinerary built around your interests</li><li>Stays, private transfers and guiding coordination</li><li>Culture, food, coast and time to explore</li></ul><p className={styles.journeyFootnote}>Travel on its own, or add experiences when your medical team agrees.</p><div className={styles.cardActions}><button className={styles.primaryButton} onClick={() => plan('Private Türkiye trip')}>Plan my private trip <span aria-hidden="true">↗</span></button><Link className={styles.textLink} href="/services/tourism">Explore the service →</Link></div></div>
              </article>
            </div>
          </div>
        </section>

        <section id="process" className={`${styles.section} ${styles.processSection}`} aria-labelledby="process-title">
          <div className={styles.container}>
            <div className={`${styles.sectionHeading} ${styles.lightHeading}`} data-reveal><p className={styles.sectionLabel}>From the first hello</p><h2 id="process-title" className={styles.sectionTitle}>A clear path.<br /><em>A personal touch.</em></h2><p className={styles.sectionIntro}>Decisions feel easier when you know what comes next.</p></div>
            <div className={styles.processGrid}>{steps.map(([title, text], index) => <div key={title} className={styles.processStep} data-reveal style={{ transitionDelay: `${index * 90}ms` }}><span className={styles.stepNumber}>0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
            <div className={styles.processNote}><p>We coordinate your journey. Your medical team guides clinical decisions.</p><Link className={styles.textLink} href="/how-we-work">See how we work →</Link></div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="standard-title">
          <div className={`${styles.container} ${styles.standardGrid}`}>
            <div className={styles.standardImage} data-reveal><Image src="/images/about-bluemosque-1200x1040.jpg" alt="The Blue Mosque and its surrounding gardens in Istanbul" fill sizes="(max-width: 900px) 90vw, 45vw" /><span className={styles.standardCaption}>Local understanding. Thoughtful choices.</span></div>
            <div className={styles.standardCopy} data-reveal><p className={styles.sectionLabel}>The way we choose</p><h2 id="standard-title" className={styles.sectionTitle}>Trust starts<br /><em>with clear answers.</em></h2><p className={styles.sectionIntro}>A recommendation deserves context. Our selection approach looks at the details that help you make an informed decision.</p><div className={styles.criteria}><div className={styles.criterion}><span>01</span><div><h3>Relevant credentials</h3><p>Authorisations, qualifications and the provider&apos;s role in your journey.</p></div></div><div className={styles.criterion}><span>02</span><div><h3>Clear communication</h3><p>Understandable information, a named contact and an agreed follow-up plan.</p></div></div><div className={styles.criterion}><span>03</span><div><h3>Transparent costs</h3><p>Written scope, inclusions, exclusions and conditions before you decide.</p></div></div></div><div className={styles.feeNote}><Icon name="lock" size={20} /><p><strong>Our fee comes from you.</strong> You pay for planning and coordination. Our model does not rely on provider commissions.</p></div><Link className={styles.textLink} href="/standard">Read our selection approach →</Link></div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="destination-title">
          <div className={styles.container}>
            <div className={styles.destinationHeading} data-reveal><div><p className={styles.sectionLabel}>Room for discovery</p><h2 id="destination-title" className={styles.sectionTitle}>A place for<br /><em>your kind of journey.</em></h2></div><Link className={styles.textLink} href="/all-turkiye-destinations">Explore Türkiye →</Link></div>
            <div className={styles.destinationGrid}>{destinations.map((destination) => <Link href={`/destinations/${destination.slug}`} key={destination.slug} className={styles.destinationCard} data-reveal><div className={styles.destinationImage}><CityImage slug={destination.slug} accent={destination.accent} alt={destination.title} sizes="(max-width: 700px) 45vw, (max-width: 1100px) 45vw, 25vw" /></div><div className={styles.destinationBody}><p className={styles.destinationTag}>{destination.tag}</p><h3 className={styles.destinationTitle}>{destination.title}<span aria-hidden="true">↗</span></h3><p className={styles.destinationDescription}>{destination.text}</p></div></Link>)}</div>
            <p className={styles.companionNote}>For health journeys, any experiences are planned around your medical team&apos;s recovery and travel guidance.</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="journal-title">
          <div className={styles.container}>
            <div className={styles.destinationHeading} data-reveal><div><p className={styles.sectionLabel}>Before you go</p><h2 id="journal-title" className={styles.sectionTitle}>A little knowledge.<br /><em>A better beginning.</em></h2></div><Link className={styles.textLink} href="/blog">Visit the journal →</Link></div>
            <div className={styles.journalGrid}>{articles.map((article) => <Link key={article.slug} href={`/blog/${article.slug}`} className={styles.articleCard} data-reveal><div className={styles.articleImage}><Image src={article.cover} alt="" fill sizes="(max-width: 700px) 90vw, 30vw" /></div><div className={styles.articleBody}><p className={styles.articleCategory}>{article.category}</p><h3 className={styles.articleTitle}>{article.title}</h3><p className={styles.articleExcerpt}>{article.excerpt}</p><span className={styles.textLink}>Read the guide →</span></div></Link>)}</div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="faq-title">
          <div className={`${styles.container} ${styles.faqGrid}`}>
            <div data-reveal><p className={styles.sectionLabel}>Good questions, clear answers</p><h2 id="faq-title" className={styles.sectionTitle}>Before<br /><em>we begin.</em></h2><p className={styles.sectionIntro}>A few things to know about planning your journey with ITO.</p></div>
            <div className={styles.faqList} data-reveal>{faqs.map(([question, answer]) => <details key={question} className={styles.faqItem}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section id="contact" ref={contactRef} tabIndex={-1} className={`${styles.section} ${styles.contactSection}`} aria-labelledby="contact-title">
          <div className={`${styles.container} ${styles.contactGrid}`}>
            <div className={styles.contactCopy} data-reveal><p className={styles.sectionLabel}>Start with a conversation</p><h2 id="contact-title" className={styles.sectionTitle}>Your journey<br /><em>starts here.</em></h2><p className={styles.sectionIntro}>Tell us what brings you to Türkiye. We&apos;ll discuss what you need and explain the scope and fee before you commit.</p><div className={styles.contactChoices}>{['Health journey', 'Private Türkiye trip', 'Both / not sure'].map((choice) => <button key={choice} aria-pressed={interest === choice} className={`${styles.choiceButton} ${interest === choice ? styles.selectedChoice : ''}`} onClick={() => setInterest(choice)}>{choice}<span aria-hidden="true">↗</span></button>)}</div><p className={styles.contactNote}>Please share practical travel details here. Medical records should be shared only through a channel agreed with your healthcare provider.</p><Link className={styles.textLink} href={hasWhatsApp ? whatsAppUrl('Hello ITO, I would like to plan a Türkiye journey.') : '/contact'}>{hasWhatsApp ? 'Prefer a conversation? Contact us on WhatsApp →' : 'Find our contact details →'}</Link></div>
            <div className={styles.contactForm}><LeadForm journeyOnly initialInterest={interest} onInterestChange={setInterest} /></div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}><div className={styles.footerGrid}><div className={styles.footerBrand}><Link href="/" aria-label="ITO home"><Image src="/logo.png" alt="Itinerary of Türkiye" width={156} height={94} /></Link><p>Health journeys and private travel.<br />Türkiye, planned around you.</p></div><div className={styles.footerLinks}><p>Your journey</p><Link href="/services/medical-tourism">Health journeys</Link><Link href="/services/tourism">Private Türkiye trips</Link><Link href="/all-turkiye-destinations">Explore Türkiye</Link><Link href="/blog">Travel journal</Link></div><div className={styles.footerLinks}><p>Meet ITO</p><Link href="/how-we-work">How we work</Link><Link href="/standard">Our selection approach</Link><Link href="/about">About us</Link><Link href="/contact">Contact</Link></div></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} Itinerary of Türkiye</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/legal-notice">Legal notice</Link></div></div></div>
      </footer>
    </div>
  );
}
