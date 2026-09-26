'use client';

import Image from 'next/image';
import { useMemo, useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { whatsAppUrl } from '@/lib/config';
import HeroVideo from './components/HeroVideo';
import Icon from './components/Icon';
import LeadForm from './components/LeadForm';
import SiteHeader from './components/SiteHeader';
import ScrollFx from './components/home/ScrollFx';
import DestinationRail from './components/home/DestinationRail';
import { track } from '@vercel/analytics';

export default function Home() {
  // WCAG 2.2.2 — otomatik hareket duraklatılabilir olmalı; reduced-motion'da hiç başlamaz
  const motionPaused = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => true,
  );
  const progressRef = useRef<HTMLDivElement>(null);

  // GoTürkiye referansı: kaydırdıkça katman katman açılan editoryal bölümler
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll('.section .container > *'));
    els.forEach((el) => {
      const idx = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.classList.add('rv');
      (el as HTMLElement).style.transitionDelay = `${Math.min(idx * 70, 280)}ms`;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Kaydırınca nav'a buzlu cam zemin
  useEffect(() => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const onS = () => nav.classList.toggle('nav-scrolled', window.scrollY > 40);
    onS();
    window.addEventListener('scroll', onS, { passive: true });
    return () => window.removeEventListener('scroll', onS);
  }, []);

  // Sayfa ilerleme göstergesi (ince altın çizgi)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [expandedTourism, setExpandedTourism] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [heroTestimonialIdx, setHeroTestimonialIdx] = useState(0);


  const heroTrustQuotes = [
    { name: 'Mark T.', flag: '🇬🇧', text: 'You made my whole journey incredibly smooth — from my trip to my business meetings.' },
    { name: 'Alan G.', flag: '🇺🇸', text: 'It would have saved me from many mistakes I experienced in the past. Outstanding service.' },
    { name: 'Pawan K.', flag: '🇮🇳', text: 'Their local knowledge and reliable support gave me the confidence to make informed decisions.' },
  ];

  useEffect(() => {
    if (motionPaused) return;
    const timer = setInterval(() => setHeroTestimonialIdx(p => (p + 1) % heroTrustQuotes.length), 5000);
    return () => clearInterval(timer);
  }, [motionPaused, heroTrustQuotes.length]);

  const advisoryPillars = useMemo(() => [
    {
      title: 'Tourism',
      subtitle: 'Culture, travel, gastronomy',
      short: 'Türkiye is a country of endless discovery. Whether you need a private guide, curated itineraries, accommodation recommendations, or any other travel assistance — we handle it all.',
      full: 'Simply reach out to us by phone, WhatsApp, or email and we will take care of the rest. From private guided tours to fully curated multi-city itineraries, luxury accommodation and local experience design — Itinerary of Türkiye handles every detail so you can focus entirely on the journey.',
      href: '#tourism'
    },
    {
      title: 'Medical Tourism',
      subtitle: 'Care, access, recovery',
      short: 'Finding the right doctor or clinic in a foreign country can feel daunting. We connect you with experienced, accredited specialists at clinics that match your budget.',
      full: 'We take that burden off your shoulders — connecting you with experienced, accredited specialists at clinics that match your budget, so you can focus entirely on your health and recovery. From hair transplants and dental care to rhinoplasty and aesthetic surgery — we find the right clinic, the right surgeon, and the right price for you.',
      href: '#health'
    },
  ], []);

  const tourismVisuals = [
    {
      title: 'History & Heritage',
      short: 'Türkiye is not just a destination — it is a living museum. From the ruins of Ephesus to the grandeur of the Hagia Sophia, every corner tells a story.',
      full: 'From the ancient ruins of Ephesus to the Byzantine grandeur of the Hagia Sophia, from the Ottoman splendour of Topkapı Palace to the fairy-tale landscapes of Cappadocia carved by civilisations thousands of years ago, every corner of this land tells a story.\n\nWalking through Türkiye means walking through time — where East meets West, and where empires once rose and left their mark on every stone, street, and skyline.\n\nLet us take you there.',
      image: '/images/dest/ephesus.jpg'
    },
    {
      title: 'Nature & Outdoors',
      short: 'Hot air balloons drift over the valleys of Cappadocia. Turquoise coastlines stretch along the Aegean and Mediterranean — all waiting to be explored.',
      full: "Türkiye's natural landscape is as dramatic as it is diverse. Hot air balloons drift over the otherworldly valleys of Cappadocia at sunrise. Turquoise coastlines stretch for thousands of kilometres along the Aegean and Mediterranean.\n\nWhether you are hiking the legendary Lycian Way, sailing a traditional gulet across hidden coves, or simply standing at the edge of Pamukkale's cotton-white terraces — nature in Türkiye has a way of leaving you speechless.",
      image: '/images/dest/fethiye.jpg'
    },
    {
      title: 'Food & Drinks',
      short: 'Turkish cuisine is one of the great culinary traditions of the world. From sizzling kebabs to delicate baklava — every dish carries centuries of tradition.',
      full: "Turkish cuisine is one of the great culinary traditions of the world — and eating here is never just a meal, it is an experience. From the sizzle of freshly grilled kebabs to the delicate layers of a perfectly made baklava, every dish carries centuries of tradition.\n\nStart your morning with a legendary Turkish breakfast — an abundant spread of cheeses, olives, eggs, honey, and fresh bread. Sip on a tulip-shaped glass of çay as the day unfolds, or let the rich aroma of Turkish coffee linger long after the cup is empty.\n\nHere, every meal tells a story. Come hungry.",
      image: '/images/home/turkish-breakfast.jpg'
    },
    {
      title: 'Arts & Culture',
      short: 'Türkiye is a canvas painted by countless civilisations. Where ancient mosaics sit beside contemporary galleries and craftsmanship fills every street.',
      full: "Türkiye is a canvas painted by countless civilisations — Greek, Roman, Byzantine, Seljuk, and Ottoman — each leaving behind a cultural legacy that still breathes today.\n\nLose yourself in the rhythm of a traditional whirling dervish ceremony. Wander through the Grand Bazaar and witness artisans practising crafts passed down through generations — hand-painted ceramics, intricate carpet weaving, and delicate calligraphy.\n\nCome curious. Leave inspired.",
      image: '/images/home/grand-bazaar-lamps.jpg'
    },
  ];

  const healthCategories = [
    {
      title: 'Hair Restoration',
      badge: 'Verified Partner Clinics',
      desc: 'World-leading FUE & DHI techniques. Natural, permanent results.',
      items: ['Hair Transplant', 'Beard & Mustache', 'Eyebrow Restoration'],
      image: '/images/hair-restoration-1400x725.jpg',
    },
    {
      title: 'Dental Care',
      badge: 'Verified Partner Clinics',
      desc: 'Veneers, implants and Hollywood smile makeovers — flawless results.',
      items: ['Hollywood Smile', 'Veneers', 'Dental Implants'],
      image: '/images/pexels-3779709-700x900.jpg',
    },
    {
      title: 'Aesthetic Surgery',
      badge: 'Verified Specialists',
      desc: 'Precision results by internationally recognised plastic surgeons.',
      items: ['Rhinoplasty', 'Facelift', 'Liposuction', 'Breast Augmentation'],
      image: '/images/pexels-3764013-700x900.jpg',
    },
  ];

  const standardCriteria = [
    { title: 'Selection', text: 'We do not list everyone. Providers are shortlisted by quality, reliability, communication and client fit.' },
    { title: 'Verification', text: 'Authorization signals, operational readiness, response quality and transparency are reviewed before recommendation.' },
    { title: 'Clarity', text: 'We explain what is known, what must be verified and where our advisory responsibility begins and ends.' },
    { title: 'Privacy', text: 'Health files, investment context and family travel needs are handled through controlled intake and approved channels.' },
    { title: 'Care', text: 'The client is supported through planning, appointment flow, travel, translation and aftercare coordination.' },
    { title: 'No Guarantees', text: 'No medical result, investment return, citizenship outcome or provider acceptance is promised or implied.' },
  ];

  const testimonials = [
    {
      name: 'Mark T.',
      location: 'Client Story',
      flag: '🇬🇧',
      category: 'Tourism · Hair Transplant · Business',
      text: 'A big thank you to the Itinerary of Turkiye team! You made my whole journey incredibly smooth — from my trip and hair transplant to my business meetings. Everything was well organised, and I honestly did not expect the experience to be this seamless. Thank you for your professionalism, care, and support throughout the entire process.',
      rating: 5,
    },
    {
      name: 'Luke W.',
      location: 'Client Story',
      flag: '🇦🇺',
      category: 'Business Advisory',
      text: 'Dear Itinerary of Turkiye — thank you for helping make my business trip such a success, resulting in several positive deals. You all deserve much greater recognition and success.',
      rating: 5,
    },
    {
      name: 'Alan G.',
      location: 'Client Story',
      flag: '🇺🇸',
      category: 'Real Estate — earlier engagement',
      text: 'I only wish I had known about Itinerary of Turkiye earlier. It would have saved me from many complications, mistakes, and even scams I unfortunately experienced in the past. Thanks to their guidance and local expertise, I was able to secure a great real estate deal that would not have been possible without their assistance. I will gladly recommend their services to others.',
      rating: 5,
    },
    {
      name: 'Pawan K.',
      location: 'Client Story',
      flag: '🇮🇳',
      category: 'Investment Advisory — earlier engagement',
      text: 'Investing in Türkiye can be challenging without the guidance of trustworthy local experts. Itinerary of Türkiye helped me tremendously throughout the process. Their local knowledge, professionalism, and reliable support gave me the confidence to make informed decisions and avoid many potential pitfalls.',
      rating: 5,
    },
  ];

  const howItWorks = [
    { step: '01', icon: 'message', title: 'Tell us what you need', desc: 'Send us a message via WhatsApp, email, or the form below. A real person responds within hours — no bots, no automated replies.' },
    { step: '02', icon: 'plan', title: 'We build your plan', desc: 'We review your needs and prepare a written, personal plan — including what we advise against, and why. Our planning fee is flat, transparent, and credited toward your trip if you travel with us.' },
    { step: '03', icon: 'plane', title: 'Arrive & enjoy', desc: 'We handle transfers, appointments, translation, and support throughout your entire stay. You focus on Türkiye. We handle everything else.' },
  ];

  const faqItems = [
    { q: 'How do you charge — and why is the consultation paid?', a: 'We charge a flat planning fee, paid by you. We do not take commissions from hotels, clinics or guides — which means no provider can pay us to recommend them. The fee includes a written personal plan within 72 hours, is credited toward your trip if you travel with us, and is refunded if the consultation brings you no value.' },
    { q: 'Can foreigners buy property in Türkiye?', a: 'Yes. Citizens of most countries can purchase property in Türkiye. The process is straightforward with the right legal support — we connect you with experienced property lawyers and licensed agents who specialise in foreign buyer transactions.' },
    { q: 'How long does a hair transplant take?', a: 'Most FUE and DHI hair transplant procedures take 6–8 hours and are performed in a single day. Recovery is minimal — most clients return home within 2–3 days. Full results are visible within 12 months.' },
    { q: 'Will I be supported throughout my stay?', a: 'Absolutely. We coordinate airport transfers, accommodation, clinic appointments, translation, and aftercare. You will have a dedicated contact available throughout your entire visit.' },
    { q: 'How quickly will I get a response?', a: 'A real person replies within hours — no bots or automated answers. Send your request via WhatsApp or the form below, and we will come back to you with clarifying questions or a recommended path.' },
    { q: 'Can I combine medical treatment with a holiday in Türkiye?', a: 'Yes — this is one of the most popular ways to plan a trip. We build itineraries that fit sightseeing, rest days and companion activities around your treatment and recovery schedule, so the medical plan always comes first.' },
    { q: 'Do you work in languages other than English?', a: 'Yes. Our team works with multilingual experts and translators, so consultations, clinic visits and paperwork can be handled in the language you are most comfortable with.' },
  ];

  const dm = darkMode;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main style={{ background: dm ? '#0a0f1a' : '#fffaf1', color: dm ? '#f0ede8' : '#071726', fontFamily: "var(--font-inter), system-ui, sans-serif", minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }

        :root {
          --gold: #c9a96a; --gold-ink: #8a6d33; --aqua: #8ed8dc; --navy: #081f35; --navy2: #0c3555;
          --blue: #0f6ea8; --muted: #647889; --line: rgba(8,31,53,.14);
          --shadow-sm: 0 2px 8px rgba(7,23,38,.08);
          --shadow-md: 0 8px 24px rgba(7,23,38,.12);
          --shadow-lg: 0 20px 60px rgba(7,23,38,.18);
          --r: 28px;
        }

        .container { width: min(1240px, calc(100% - 48px)); margin: 0 auto; }
        .serif { font-family: var(--font-playfair), serif; letter-spacing: -.04em; }
        .eyebrow { display: inline-flex; align-items: center; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }

        /* DARK MODE */
        .dm-surface { background: ${dm ? '#111827' : '#fff'}; }
        .dm-muted { color: ${dm ? 'rgba(240,237,232,.6)' : '#647889'}; }
        .dm-border { border-color: ${dm ? 'rgba(255,255,255,.08)' : 'rgba(8,31,53,.14)'}; }

        /* ACCESSIBILITY */
        a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
          outline: 3px solid var(--aqua); outline-offset: 2px; border-radius: 6px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        }

        /* NAV */
        .nav { position: absolute; top: 0; left: 0; right: 0; z-index: 50; }
        .nav-inner { height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .brand img { height: 83px; width: auto; filter: drop-shadow(0 2px 8px rgba(0,0,0,.4)); transition: transform 0.2s; }
        .brand img:hover { transform: scale(1.05); }
        .brand { text-decoration: none; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: rgba(255,255,255,.9); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover { color: var(--gold); }
        .nav-dropdown { position: relative; }
        .nav-dropdown-menu { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 14px; background: rgba(7,23,38,.97); border: 1px solid rgba(201,169,106,.25); border-radius: 14px; padding: 10px; min-width: 220px; backdrop-filter: blur(20px); box-shadow: 0 16px 40px rgba(0,0,0,.4); display: flex; flex-direction: column; gap: 2px; z-index: 60; }
        .nav-dropdown-menu a { padding: 10px 14px; border-radius: 8px; font-size: 13.5px; white-space: nowrap; transition: background 0.2s, color 0.2s; }
        .nav-dropdown-menu a:hover { background: rgba(201,169,106,.12); color: var(--gold); }
        .nav-toggle { display: none; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); color: #fff; width: 40px; height: 40px; border-radius: 50%; font-size: 18px; cursor: pointer; align-items: center; justify-content: center; }
        .dm-toggle { background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); color: #fff; width: 36px; height: 36px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; margin-left: 8px; }
        .dm-toggle:hover { background: rgba(255,255,255,.25); }

        /* MOBILE MENU */
        .mobile-menu { position: fixed; inset: 0; z-index: 100; background: rgba(7,23,38,.97); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; transition: opacity 0.3s, transform 0.3s; }
        .mobile-menu.open { opacity: 1; pointer-events: all; transform: translateY(0); }
        .mobile-menu.closed { opacity: 0; pointer-events: none; transform: translateY(-20px); }
        .mobile-menu a { color: #fff; text-decoration: none; font-size: 26px; font-weight: 800; font-family: var(--font-playfair), serif; transition: color 0.2s; }
        .mobile-menu a:hover { color: var(--gold); }
        .mobile-close { position: absolute; top: 24px; right: 28px; background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; }

        /* HERO — TOTAL REDESIGN: mesh gradient + split frame */
        .hero { position: relative; min-height: 100vh; min-height: 100svh; overflow: hidden; color: #fff; display: flex; align-items: center; background: #0d1424; }
        .hero-grain { position: absolute; inset: 0; z-index: 2; opacity: .05; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E"); pointer-events: none; }

        .hero-split { position: relative; z-index: 3; width: min(1280px, calc(100% - 48px)); margin: 0 auto; padding: 130px 0 110px; display: grid; grid-template-columns: minmax(0, 720px); align-items: center; }

        .hero-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-size: 11.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.82); margin-bottom: 26px; }
        .hero-eyebrow::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #ffb46e; box-shadow: 0 0 0 4px rgba(255,180,110,.25); animation: pulse-dot 2.2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 4px rgba(255,180,110,.25); } 50% { box-shadow: 0 0 0 9px rgba(255,180,110,.08); } }

        .hero h1 { margin: 0 0 22px; font-size: clamp(38px, 6.6vw, 84px); line-height: .96; letter-spacing: -.01em; color: #fff; font-family: var(--font-playfair), serif; font-weight: 900; }
        .hero h1 em { color: #E8956B; font-style: italic; display: block; margin-top: 2px; }
        .hero-copy { max-width: 540px; margin: 0 0 36px; color: rgba(255,255,255,.85); font-size: 16.5px; line-height: 1.78; font-weight: 400; }

        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-pill { padding: 13px 24px; min-height: 46px; border-radius: 999px; border: 1.5px solid rgba(255,255,255,.38); background: rgba(255,255,255,.08); color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer; backdrop-filter: blur(10px); transition: background .35s cubic-bezier(.22,.61,.36,1), border-color .35s cubic-bezier(.22,.61,.36,1), transform .35s cubic-bezier(.22,.61,.36,1); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .hero-pill:hover { background: rgba(255,255,255,.18); border-color: rgba(255,255,255,.7); transform: translateY(-2px); }
        .hero-pill-primary { background: #E8956B; border-color: #E8956B; color: #2a1508; }
        .hero-pill-primary:hover { background: #f0a87e; border-color: #f0a87e; transform: translateY(-2px); }

        /* TRUST STRIP */
        .hero-trust-strip { display: inline-flex; align-items: center; gap: 16px; margin-top: 40px; padding: 13px 20px; border-radius: 999px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(12px); transition: background .3s ease, border-color .3s ease; }
        .hero-trust-strip:hover { background: rgba(255,255,255,.11); border-color: rgba(255,255,255,.24); }
        .trust-strip-item { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: rgba(255,255,255,.92); font-weight: 600; white-space: nowrap; }
        .trust-strip-divider { width: 1px; height: 14px; background: rgba(255,255,255,.2); }
        .trust-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; flex-shrink: 0; animation: pulse-dot-green 2s ease-in-out infinite; }
        @keyframes pulse-dot-green { 0%,100% { box-shadow: 0 0 0 4px rgba(74,222,128,.22); } 50% { box-shadow: 0 0 0 8px rgba(74,222,128,.06); } }



        /* SECTION */
        .section { padding: 80px 0; }
        .section-title { max-width: 860px; margin: 16px 0 18px; font-size: clamp(34px, 6vw, 78px); line-height: .91; color: ${dm ? '#fff' : 'var(--navy)'}; }
        .section-copy { max-width: 680px; margin: 0 0 32px; color: ${dm ? 'rgba(240,237,232,.65)' : '#647889'}; font-size: 16px; line-height: 1.78; }

        /* BTN */
        .btn { min-height: 54px; display: inline-flex; align-items: center; justify-content: center; padding: 0 26px; border-radius: 999px; border: none; text-decoration: none; font-size: 14px; font-weight: 900; cursor: pointer; transition: all 0.25s; white-space: nowrap; }
        .btn-primary { color: #fff; background: linear-gradient(135deg, var(--blue), var(--navy2)); box-shadow: var(--shadow-md); }
        .btn-primary:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .btn-ghost { color: var(--gold); background: transparent; border: 1.5px solid var(--gold); }
        .btn-ghost:hover { background: rgba(201,169,106,.08); }
        .btn-ghost-dark { color: rgba(240,237,232,.8); background: transparent; border: 1.5px solid rgba(240,237,232,.25); }
        .btn-ghost-dark:hover { background: rgba(255,255,255,.06); }

        /* READ MORE */
        .read-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; border: 1.5px solid rgba(255,255,255,.35); background: rgba(255,255,255,.08); color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .read-btn:hover { background: rgba(255,255,255,.18); }
        .read-btn-light { border-color: rgba(201,169,106,.4); color: var(--gold); background: transparent; }
        .read-btn-light:hover { background: rgba(201,169,106,.08); }
        .expanded-box { margin-top: 12px; padding: 16px 20px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,250,241,.12); border-radius: 16px; color: rgba(255,250,241,.8); font-size: 13px; line-height: 1.78; animation: fadeUp 0.3s ease; }
        .expanded-box-light { background: ${dm ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.7)'}; border: 1px solid ${dm ? 'rgba(255,255,255,.08)' : 'rgba(8,31,53,.1)'}; border-radius: 16px; padding: 18px 20px; margin-top: 14px; color: ${dm ? 'rgba(240,237,232,.75)' : '#647889'}; font-size: 15px; line-height: 1.8; animation: fadeUp 0.3s ease; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        /* PILLARS */

        /* TOURISM */
        .t-overlay { position: absolute; inset: 0; z-index: 3; padding: 22px; background: rgba(7,23,38,.94); backdrop-filter: blur(6px); color: rgba(255,250,241,.85); font-size: 13px; line-height: 1.75; overflow-y: auto; animation: fadeUp .3s ease; border-radius: var(--r); }
        .t-overlay h3 { margin: 0 0 12px; font-family: var(--font-playfair), serif; font-size: 19px; color: #fff; }

        /* ABOUT */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .about-img { position: relative; border-radius: var(--r); overflow: hidden; height: 520px; box-shadow: var(--shadow-lg); }
        .about-img img { width: 100%; height: 100%; object-fit: cover; }
        .about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 28px; }
        .about-feat { padding: 18px; border: 1px solid ${dm ? 'rgba(255,255,255,.08)' : 'rgba(8,31,53,.1)'}; border-radius: 16px; background: ${dm ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.6)'}; }
        .about-feat h4 { margin: 0 0 5px; font-size: 13px; font-weight: 900; color: ${dm ? '#fff' : 'var(--navy)'}; }
        .about-feat p { margin: 0; font-size: 12px; color: ${dm ? 'rgba(240,237,232,.6)' : '#647889'}; line-height: 1.6; }

        /* STANDARDS */
        .std-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 64px; align-items: start; }
        .std-card { position: sticky; top: 100px; padding: 36px; border-radius: var(--r); background: var(--navy); color: #fff; box-shadow: var(--shadow-lg); }
        .std-card h2 { margin: 16px 0; font-size: clamp(34px, 5vw, 64px); line-height: .9; }
        .std-card p { color: rgba(255,250,241,.7); line-height: 1.78; }
        .crit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .crit-card { padding: 22px; border: 1px solid ${dm ? 'rgba(255,255,255,.08)' : 'rgba(8,31,53,.12)'}; border-radius: 18px; background: ${dm ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.7)'}; transition: all 0.25s; }
        .crit-card:hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .crit-card h3 { margin: 0 0 8px; color: ${dm ? '#fff' : 'var(--navy)'}; font-size: 17px; }
        .crit-card p { margin: 0; color: ${dm ? 'rgba(240,237,232,.6)' : '#647889'}; font-size: 13px; line-height: 1.7; }

        /* HEALTH — 3 PROMINENT CATEGORIES */
        .health-section-new { background: linear-gradient(160deg, #0d1b4c 0%, #142a6b 45%, #0c1f3f 100%); }

        .health-header-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; margin-bottom: 8px; }
        .health-header-text { flex: 1; max-width: 640px; }
        .health-stat-badge { flex-shrink: 0; text-align: right; padding: 18px 22px; border-radius: 18px; background: rgba(201,169,106,.08); border: 1px solid rgba(201,169,106,.28); min-width: 200px; }
        .health-stat-num { display: block; font-size: 30px; font-weight: 900; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; font-family: var(--font-playfair), serif; line-height: 1; margin-bottom: 6px; }
        .health-stat-label { display: block; font-size: 12px; color: rgba(255,250,241,.65); line-height: 1.5; }

        .health-bento { display: grid; grid-template-columns: 1.15fr 1fr; gap: 16px; margin-top: 32px; align-items: start; }
        .health-bento-side { display: grid; grid-template-rows: auto auto; gap: 16px; }

        .health-photo-card { border-radius: 18px; overflow: hidden; border: 1px solid rgba(201,169,106,.22); transition: all 0.35s ease; }
        .health-photo-card:hover { border-color: rgba(201,169,106,.5); transform: translateY(-5px); box-shadow: 0 16px 34px rgba(0,0,0,.3); }
        .health-photo-wrap { position: relative; overflow: hidden; }
        .health-bento-main .health-photo-wrap { height: 336px; }
        .health-bento-wide .health-photo-wrap { height: 161px; }
        .health-bento-square .health-photo-wrap { height: 161px; }
        .health-photo-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; filter: brightness(.92); display: block; }
        .health-photo-card:hover .health-photo-wrap img { transform: scale(1.07); }
        .health-photo-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13,27,76,0) 35%, rgba(8,15,40,.55) 70%, rgba(6,11,30,.92) 100%); }
        .health-badge-photo { position: absolute; top: 18px; left: 18px; z-index: 2; padding: 6px 13px; background: rgba(201,169,106,.92); color: #2c1f0a; border-radius: 999px; font-size: 11px; font-weight: 800; }
        .health-photo-text { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 22px 22px 24px; }
        .health-title-photo { margin: 0 0 8px; color: #fff; font-size: 19px; font-weight: 900; font-family: var(--font-playfair), serif; }
        .health-title-main { font-size: 27px; }
        .health-desc-photo { margin: 0 0 14px; color: rgba(255,250,241,.78); font-size: 13px; line-height: 1.6; }
        .health-items-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .health-item-tag { padding: 5px 11px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 999px; font-size: 11px; color: rgba(255,250,241,.85); font-weight: 600; backdrop-filter: blur(4px); }

        /* INVESTMENT */
        .inv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .inv-visual { position: relative; height: 560px; border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow-lg); }
        .inv-visual img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.75); }
        .inv-badge { position: absolute; bottom: 22px; left: 22px; right: 22px; padding: 14px 18px; background: rgba(201,169,106,.92); border-radius: 14px; color: var(--navy); font-size: 13px; font-weight: 900; }

        /* BRAND COLOR GRADE — çekimlere kadar stok görselleri markaya yaklaştırır */
        .guide-img img, .about-img img, .health-visual img, .health-bento img { filter: saturate(1.06) contrast(1.03) sepia(0.05); }

        /* GUIDES */
        .guides-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 36px; }
        .guide-card { display: flex; flex-direction: column; text-decoration: none; border-radius: var(--r); overflow: hidden; background: ${dm ? 'rgba(255,255,255,.04)' : '#fff'}; border: 1px solid ${dm ? 'rgba(255,255,255,.09)' : 'rgba(8,31,53,.12)'}; transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
        .guide-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: rgba(201,169,106,.5); }
        .guide-img { height: 190px; overflow: hidden; }
        .guide-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
        .guide-card:hover .guide-img img { transform: scale(1.05); }
        .guide-body { padding: 20px 22px 24px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .guide-cat { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; }
        .guide-body h3 { margin: 0; font-family: var(--font-playfair), serif; font-size: 18px; line-height: 1.3; color: ${dm ? '#fff' : 'var(--navy)'}; }
        .guide-body p { margin: 0; font-size: 13px; line-height: 1.65; color: ${dm ? 'rgba(240,237,232,.6)' : '#647889'}; }
        .guide-more { margin-top: auto; font-size: 13px; font-weight: 800; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; }
        @media (max-width: 900px) { .guides-grid { grid-template-columns: 1fr; } }

        /* FAQ */
        .faq-section { background: ${dm ? '#0a0f1a' : '#fffaf1'}; }
        .faq-grid { display: grid; gap: 12px; margin-top: 40px; max-width: 760px; margin-left: auto; margin-right: auto; }
        .faq-item { border: 1px solid ${dm ? 'rgba(255,255,255,.08)' : 'rgba(8,31,53,.12)'}; border-radius: 16px; overflow: hidden; }
        .faq-q { width: 100%; padding: 20px 24px; background: ${dm ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.8)'}; border: none; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: ${dm ? '#fff' : 'var(--navy)'}; transition: background 0.2s; }
        .faq-q:hover { background: ${dm ? 'rgba(255,255,255,.07)' : '#fff'}; }
        .faq-arrow { font-size: 12px; color: var(--gold); flex-shrink: 0; transition: transform 0.25s; }
        .faq-a { padding: 0 24px 20px; color: ${dm ? 'rgba(240,237,232,.65)' : '#647889'}; font-size: 14px; line-height: 1.78; animation: fadeUp 0.25s ease; background: ${dm ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.8)'}; }

        /* FORM */
        .form-section { background: linear-gradient(135deg, rgba(7,23,38,.96), rgba(12,53,85,.92)); color: #fff; }
        .form-grid { display: grid; grid-template-columns: .85fr 1.15fr; gap: 48px; align-items: start; }
        .form-box { padding: 28px; border: 1px solid rgba(255,250,241,.16); border-radius: var(--r); background: rgba(255,255,255,.09); backdrop-filter: blur(18px); }
        .form-prog { height: 4px; background: rgba(255,250,241,.1); border-radius: 999px; overflow: hidden; margin-bottom: 24px; }
        .form-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--aqua)); transition: width 0.35s; }
        .form-ttl { margin: 0 0 18px; color: #fff; font-size: 18px; font-weight: 900; }
        .f-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { display: grid; gap: 8px; }
        .field label { font-size: 11px; font-weight: 900; color: rgba(255,250,241,.78); }
        .field input, .field select, .field textarea { width: 100%; min-height: 52px; padding: 0 14px; border: 1px solid rgba(255,250,241,.18); border-radius: 12px; color: #fff; background: rgba(7,23,38,.5); font: 15px var(--font-inter), sans-serif; outline: none; transition: border 0.2s; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--aqua); }
        .field textarea { min-height: 96px; padding-top: 12px; resize: vertical; }
        .field select option { color: #071726; }
        .form-success { padding: 20px; text-align: center; background: rgba(142,216,220,.12); border: 1px solid var(--aqua); border-radius: 14px; }
        .form-success h3 { margin: 0 0 8px; color: var(--aqua); }
        .form-success p { margin: 0; font-size: 13px; color: rgba(255,250,241,.8); }

        /* İKİ YOL — genişleyen paneller */
        .split { display: flex; height: min(88vh, 780px); min-height: 560px; background: #071726; }
        .split-panel { position: relative; flex: 1; overflow: hidden; color: #fff; text-decoration: none; transition: flex 1s var(--fx-ease, cubic-bezier(.22,.61,.36,1)); }
        .split:hover .split-panel { flex: .78; }
        .split .split-panel:hover { flex: 1.35; }
        .split-media { position: absolute; inset: 0; }
        .split-img { position: absolute; inset: -8% 0; }
        .split-img img { transition: transform 1.4s var(--fx-ease, ease); }
        .split-panel:hover .split-img img { transform: scale(1.06); }
        .split-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,23,38,.2) 0%, rgba(7,23,38,.25) 40%, rgba(7,23,38,.88) 100%); transition: background .8s; }
        .split-panel:hover .split-shade { background: linear-gradient(180deg, rgba(7,23,38,.1) 0%, rgba(7,23,38,.2) 40%, rgba(7,23,38,.92) 100%); }
        .split-body { position: absolute; left: 0; right: 0; bottom: 0; padding: 0 clamp(24px, 4vw, 64px) clamp(36px, 5vw, 64px); max-width: 640px; }
        .split-k { display: block; font-size: 11.5px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #d8b878; margin-bottom: 14px; }
        .split-body h2 { margin: 0 0 14px; font-size: clamp(40px, 5.2vw, 76px); line-height: .96; letter-spacing: -.02em; color: #fff; }
        .split-body p { margin: 0; font-size: 15.5px; line-height: 1.7; color: rgba(255,255,255,.82); max-width: 460px; max-height: 0; opacity: 0; overflow: hidden; transition: max-height .8s var(--fx-ease, ease), opacity .6s ease, margin .6s; }
        .split-panel:hover .split-body p, .split-panel:focus-visible .split-body p { max-height: 200px; opacity: 1; margin-bottom: 4px; }
        .split-cta { display: inline-flex; gap: 8px; margin-top: 18px; padding: 12px 22px; border-radius: 999px; border: 1.5px solid rgba(255,255,255,.45); font-size: 13.5px; font-weight: 700; transition: background .35s, border-color .35s, gap .35s; }
        .split-panel:hover .split-cta { background: #E8956B; border-color: #E8956B; color: #2a1508; gap: 14px; }

        /* KAYAN YAZI BANDI */
        .mq { overflow: hidden; padding: 30px 0; background: ${dm ? '#0a0f1a' : '#fffaf1'}; border-bottom: 1px solid ${dm ? 'rgba(255,255,255,.06)' : 'rgba(8,31,53,.08)'}; }
        .mq-track { display: flex; width: max-content; animation: mq-run 48s linear infinite; }
        .mq:hover .mq-track { animation-play-state: paused; }
        .mq-group { display: flex; }
        .mq-word { display: inline-flex; align-items: center; font-family: var(--font-playfair), serif; font-weight: 800; font-size: clamp(46px, 7.5vw, 116px); line-height: 1.1; letter-spacing: -.02em; padding-right: .35em; white-space: nowrap; color: ${dm ? '#f0ede8' : 'var(--navy)'}; }
        .mq-word:nth-child(even) { color: transparent; -webkit-text-stroke: 1.5px ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; font-style: italic; }
        .mq-word i { font-style: normal; font-size: .32em; color: var(--gold); margin-left: .5em; -webkit-text-stroke: 0; }
        @keyframes mq-run { to { transform: translateX(-50%); } }

        /* DENEYİM MOZAİĞİ */
        .xp { padding: 110px 0 100px; }
        .xp-head { display: grid; grid-template-columns: 1.1fr .9fr; gap: 40px; align-items: end; margin-bottom: 48px; }
        .xp-head .section-copy { margin: 0 0 8px; }
        .xp-grid { display: grid; grid-template-columns: 1.25fr 1fr 1fr; grid-template-rows: 320px 320px; gap: 18px; }
        .xp-1 { grid-row: 1 / 3; }
        .xp-2 { grid-column: 2 / 4; }
        .xp-tile { position: relative; border-radius: 22px; overflow: hidden; color: #fff; isolation: isolate; box-shadow: var(--shadow-lg); }
        .xp-media { position: absolute; inset: 0; border-radius: 22px; overflow: hidden; }
        .xp-img { position: absolute; inset: -8% 0; }
        .xp-img img { transition: transform 1.4s var(--fx-ease, ease), filter .6s; filter: saturate(1.05); }
        .xp-tile:hover .xp-img img { transform: scale(1.07); }
        .xp-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,23,38,0) 35%, rgba(7,23,38,.35) 60%, rgba(7,23,38,.9) 100%); }
        .xp-3 .xp-shade, .xp-4 .xp-shade { background: linear-gradient(180deg, rgba(7,23,38,.1) 0%, rgba(7,23,38,.55) 45%, rgba(7,23,38,.94) 100%); }
        .xp-body { position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 26px 24px; z-index: 1; }
        .xp-num { display: block; font-size: 12px; font-weight: 800; letter-spacing: .18em; color: #d8b878; margin-bottom: 8px; }
        .xp-body h3 { margin: 0 0 8px; font-family: var(--font-playfair), serif; font-size: clamp(24px, 2.4vw, 34px); line-height: 1.05; }
        .xp-1 .xp-body h3 { font-size: clamp(32px, 3.4vw, 48px); }
        .xp-body p { margin: 0 0 14px; font-size: 14px; line-height: 1.6; color: rgba(255,255,255,.82); max-width: 520px; }
        .xp-3 .xp-body p, .xp-4 .xp-body p { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .about-par { position: absolute; inset: -8% 0; }

        /* FOOTER — yasal satır */
        .footer-legal { margin-top: 40px; padding-top: 22px; border-top: 1px solid rgba(255,250,241,.08); display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px 18px; font-size: 12px; }
        .footer .footer-legal a { display: inline; margin: 0; font-size: 12px; }

        @media (max-width: 900px) {
          .split { flex-direction: column; height: auto; min-height: 0; }
          .split-panel, .split:hover .split-panel, .split .split-panel:hover { flex: none; height: 72vh; min-height: 440px; }
          .split-body p { max-height: none; opacity: 1; margin-bottom: 4px; }
          .xp { padding: 80px 0 70px; }
          .xp-head { grid-template-columns: 1fr; gap: 12px; }
          .xp-grid { grid-template-columns: 1fr; grid-template-rows: none; }
          .xp-1, .xp-2 { grid-row: auto; grid-column: auto; }
          .xp-tile { height: 420px; }
          .xp-3 .xp-body p, .xp-4 .xp-body p { -webkit-line-clamp: unset; display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mq-track { animation: none; }
          .split-panel, .split-img img, .xp-img img { transition: none; }
        }

        /* FOOTER */
        .footer { background: #071726; color: rgba(255,250,241,.6); padding: 56px 0 28px; }
        .footer-grid { display: grid; grid-template-columns: 1.3fr repeat(3,1fr); gap: 32px; }
        .footer h4 { margin: 0 0 14px; color: #fff; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; }
        .footer a { display: block; margin: 0 0 9px; color: rgba(255,250,241,.6); text-decoration: none; font-size: 13px; transition: color 0.2s; }
        .footer a:hover { color: var(--gold); }
        .social-row { display: flex; gap: 12px; margin-top: 16px; }
        .social-btn { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); color: rgba(255,250,241,.7); display: flex; align-items: center; justify-content: center; font-size: 14px; text-decoration: none; transition: all 0.2s; }
        .social-btn:hover { background: rgba(201,169,106,.2); border-color: var(--gold); color: var(--gold); }

        /* HOW IT WORKS */
        .hiw-section { background: ${dm ? '#111827' : '#fff'}; }
        .hiw-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; margin-top: 48px; position: relative; }
        .hiw-grid::before { content: ''; position: absolute; top: 40px; left: 16.66%; right: 16.66%; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .hiw-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px 24px; border-radius: 24px; border: 1px solid rgba(201,169,106,.2); background: rgba(201,169,106,.04); transition: all 0.3s; }
        .hiw-card:hover { border-color: var(--gold); transform: translateY(-6px); box-shadow: 0 20px 40px rgba(7,23,38,.1); }
        .hiw-step { font-size: 11px; font-weight: 900; letter-spacing: .18em; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; margin-bottom: 12px; }
        .hiw-icon { font-size: 36px; margin-bottom: 16px; }
        .hiw-title { font-size: 18px; font-weight: 900; margin: 0 0 10px; }
        .hiw-desc { font-size: 14px; line-height: 1.7; margin: 0; }

        /* TESTIMONIALS */
        .testi-section { background: #fdf6ec; }
        .testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 48px; align-items: stretch; }
        .testi-card { padding: 28px; border-radius: 24px; background: #fff; border: 1px solid rgba(201,169,106,.15); box-shadow: 0 4px 24px rgba(7,23,38,.06); transition: all 0.3s; position: relative; overflow: hidden; }
        .testi-card::before { content: '“'; position: absolute; top: -18px; right: 14px; font-family: var(--font-playfair), serif; font-size: 130px; line-height: 1; color: rgba(201,169,106,.14); pointer-events: none; }
        .testi-card:first-child { padding: 30px; background: linear-gradient(150deg, #071726, #0c3555) !important; border-color: rgba(201,169,106,.3); }
        .testi-card:first-child .testi-text { color: rgba(255,250,241,.88) !important; }
        .testi-card:first-child .testi-name { color: #fff !important; }
        .testi-card:first-child .testi-loc { color: rgba(255,250,241,.55); }
        .testi-card:first-child::before { color: rgba(201,169,106,.22); }
        .testi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(7,23,38,.1); border-color: rgba(201,169,106,.3); }
        .testi-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .testi-avatar { width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0; border: 2px solid var(--gold); background: linear-gradient(135deg, rgba(201,169,106,.18), rgba(201,169,106,.05)); color: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; letter-spacing: .5px; }
        .testi-name { font-size: 15px; font-weight: 900; color: var(--navy); margin: 0 0 3px; }
        .testi-loc { font-size: 12px; color: var(--muted); margin: 0; }
        .testi-cat { display: inline-block; padding: 4px 10px; background: rgba(201,169,106,.1); color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 14px; border: 1px solid rgba(201,169,106,.2); }
        .testi-text { color: #4a5568; font-size: 14px; line-height: 1.78; margin: 0 0 14px; font-style: italic; }
        .testi-stars { color: var(--gold); font-size: 14px; letter-spacing: 2px; }

        /* WHATSAPP */
        .wa-btn { position: fixed; bottom: 28px; right: 28px; z-index: 999; width: 58px; height: 58px; border-radius: 50%; background: #25D366; box-shadow: 0 4px 20px rgba(37,211,102,.45); display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 26px; transition: all 0.25s; animation: bounce 2.5s ease-in-out infinite; }
        .wa-btn:hover { transform: scale(1.12); box-shadow: 0 6px 28px rgba(37,211,102,.6); animation: none; }

        /* CONCIERGE */
        .concierge { position: fixed; top: 90px; right: 20px; padding: 10px 16px; background: var(--gold); border-radius: 999px; font-size: 11px; font-weight: 900; color: var(--navy); z-index: 45; box-shadow: var(--shadow-md); }

        /* PREMIUM PASS — cinematic load, fixed glass nav, editorial grade */
        .hero-split > div > * { animation: heroIn .95s cubic-bezier(.22,.61,.36,1) both; }
        .hero-split > div > *:nth-child(2) { animation-delay: .12s; }
        .hero-split > div > *:nth-child(3) { animation-delay: .24s; }
        .hero-split > div > *:nth-child(4) { animation-delay: .36s; }
        .hero-split > div > *:nth-child(5) { animation-delay: .48s; }
        @keyframes heroIn { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }

        html { scroll-behavior: smooth; }
        *:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 4px; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: ${dm ? '#0a0f1a' : '#f3ede2'}; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(var(--navy-2), var(--navy)); border-radius: 999px; border: 2px solid ${dm ? '#0a0f1a' : '#f3ede2'}; }
        ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

        .nav { position: fixed; transition: background .4s ease, box-shadow .4s ease, backdrop-filter .4s ease; }
        .nav.nav-scrolled { background: rgba(8,20,38,.82); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 1px 0 rgba(201,169,106,.25), 0 14px 40px rgba(0,0,0,.28); }

        .about-img img { filter: saturate(1.05) contrast(1.02); }

        .testi-card { position: relative; }
        .testi-card::before { content: '“'; position: absolute; top: 6px; right: 20px; font-family: var(--font-playfair), serif; font-size: 84px; line-height: 1; color: rgba(201,169,106,.16); pointer-events: none; }
        .testi-card:hover { transform: translateY(-5px); box-shadow: 0 18px 48px rgba(7,23,38,.12); border-color: rgba(201,169,106,.4); }

        .faq-item { transition: border-color .3s ease, box-shadow .3s ease; }
        .faq-item:hover { border-color: rgba(201,169,106,.45); box-shadow: 0 8px 26px rgba(7,23,38,.07); }

        .form-section { background-image: radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(135deg, rgba(7,23,38,.96), rgba(12,53,85,.92)); background-size: 24px 24px, 100% 100%; }

        /* VISUAL LAYER — GoTürkiye-inspired editorial motion */
        ::selection { background: rgba(201,169,106,.35); }
        .scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 1000; background: linear-gradient(90deg, var(--gold), #e6cf9a); transform: scaleX(0); transform-origin: left; pointer-events: none; }
        .rv { opacity: 0; transform: translateY(28px); transition: opacity .85s cubic-bezier(.22,.61,.36,1), transform .85s cubic-bezier(.22,.61,.36,1); }
        .rv-in { opacity: 1; transform: none; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.08) translateY(-8px); } }
        .nav-links a { position: relative; }
        .nav-links a::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 100%; height: 2px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform .35s cubic-bezier(.22,.61,.36,1); }
        .nav-links a:hover::after { transform: scaleX(1); }
        .btn-primary { position: relative; overflow: hidden; }
        .btn-primary::after { content: ''; position: absolute; top: 0; left: -80%; width: 55%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,255,255,.32), transparent); transform: skewX(-20deg); transition: left .6s ease; pointer-events: none; }
        .btn-primary:hover::after { left: 135%; }
        .about-img img { transition: transform .9s cubic-bezier(.22,.61,.36,1); }
        .about-img:hover img { transform: scale(1.05); }
        .footer { position: relative; }
        .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .testi-grid { grid-template-columns: 1fr; }
          .std-grid, .form-grid, .about-grid, .inv-grid { grid-template-columns: 1fr; }
          .std-card { position: static; }
          .health-header-row { flex-direction: column; align-items: flex-start; }
          .health-stat-badge { text-align: left; width: 100%; }
          .hero-split { grid-template-columns: minmax(0, 1fr); padding: 120px 0 100px; text-align: center; }
          .hero-eyebrow { justify-content: center; }
          .hero-copy { margin-left: auto; margin-right: auto; }
          .hero-btns { justify-content: center; }
        }
        @media (max-width: 840px) {
          .testi-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 16px; padding: 4px 2px 18px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .testi-grid::-webkit-scrollbar { display: none; }
          .testi-card { min-width: 86%; scroll-snap-align: center; }
          .testi-card:first-child { min-width: 86%; }
          .hiw-grid { grid-template-columns: 1fr; }
          .hiw-grid::before { display: none; }
          .f-row { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .nav-links { display: none; }
          .nav-toggle { display: flex; }
          .health-bento { grid-template-columns: 1fr; }
          .health-bento-main .health-photo-wrap { height: 240px; }
          .health-bento-wide .health-photo-wrap, .health-bento-square .health-photo-wrap { height: 161px; }
          .hero { min-height: 100svh; }
          .hero-split { padding: 110px 0 90px; }
          .hero-trust-strip { flex-wrap: wrap; gap: 10px 14px; justify-content: center; }
        }
        @media (max-width: 700px) { .concierge { display: none; } }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; }
          .about-features { grid-template-columns: 1fr; }
          .about-img { height: 320px; }
          .inv-visual { height: 340px; }
          .container { width: calc(100% - 28px); }
          .section { padding: 56px 0; }
          .hero-split { width: calc(100% - 36px); padding: 100px 0 80px; }
          .hero h1 { font-size: clamp(32px, 9vw, 46px); }
          .hero-pill { padding: 11px 18px; font-size: 12.5px; }
          .hero-trust-strip { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; border-radius: 16px; }
          .trust-strip-divider { display: none; }
          .trust-strip-item { white-space: normal; text-align: left; }
        }
      `}</style>

      {/* WHATSAPP FLOAT */}
      <a className="wa-btn" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff"><path d="M16.004 3C9.374 3 4 8.373 4 15.002c0 2.444.71 4.72 1.94 6.638L4 29l7.547-1.901a11.93 11.93 0 0 0 4.457.873h.005c6.629 0 12.003-5.373 12.003-12.002C28.012 8.373 22.638 3 16.004 3zm0 21.97a9.93 9.93 0 0 1-5.064-1.39l-.363-.215-4.479 1.128 1.196-4.367-.236-.448a9.93 9.93 0 0 1-1.523-5.276c0-5.503 4.477-9.98 9.973-9.98 5.495 0 9.973 4.477 9.973 9.98-.004 5.503-4.481 9.568-9.477 9.568zm5.47-7.466c-.299-.15-1.767-.872-2.04-.972-.273-.1-.472-.15-.671.15-.198.298-.769.972-.943 1.171-.174.198-.348.224-.646.075-.298-.15-1.258-.464-2.396-1.479-.886-.79-1.484-1.766-1.658-2.064-.174-.298-.018-.46.131-.609.135-.134.298-.348.447-.522.15-.174.199-.298.298-.497.1-.198.05-.373-.025-.522-.075-.15-.671-1.617-.92-2.215-.242-.582-.488-.503-.671-.512l-.572-.01c-.198 0-.522.075-.795.373-.273.298-1.043 1.02-1.043 2.488 0 1.467 1.068 2.886 1.217 3.084.149.198 2.102 3.21 5.09 4.502.711.307 1.266.49 1.699.627.713.227 1.363.195 1.877.118.572-.086 1.767-.722 2.016-1.42.249-.696.249-1.293.174-1.42-.075-.124-.273-.198-.572-.348z"/></svg>
      </a>

      {/* CONCIERGE BADGE */}
      <div className="concierge">✓ Replies within hours</div>

      <ScrollFx />
      <SiteHeader overlay />

      {/* HERO */}
      <section className="hero" id="top">
        <HeroVideo
            poster="/images/hero-poster-1280x720.jpg"
            srcDesktop="/videos/hero-turkiye-720p"
            srcMobile="/videos/hero-turkiye-480p"
            pauseLabel="Pause video"
            playLabel="Play video"
            chapters={[
              { at: 0, label: 'Sultanahmet · Istanbul' },
              { at: 4.1, label: 'Galata · Istanbul' },
              { at: 7.8, label: 'Cappadocia at sunrise' },
              { at: 11.5, label: 'Cappadocia' },
              { at: 15.2, label: 'Golden Horn · Istanbul' },
              { at: 18.9, label: 'The Bosphorus by night' },
            ]}
          />
        <div className="hero-grain" />
        <div className="hero-split">
          <div>
            <p className="hero-eyebrow">Live & responding right now</p>
            <h1 className="serif">Türkiye Awaits.<em>We&rsquo;ll Take You There.</em></h1>
            <p className="hero-copy">Your private Turkey travel advisory. We plan your journey, verify every provider, and stay by your side while you are here — paid by you, and only you, so every recommendation is made for one reason: it is right for you.</p>
            <div className="hero-btns">
              <a className="hero-pill hero-pill-primary" href="#tourism"><Icon name="landmark" size={17} /> Tourism</a>
              <a className="hero-pill" href="#health"><Icon name="medical" size={17} /> Medical Tourism</a>
            </div>
            <div className="hero-trust-strip">
              <div className="trust-strip-item">✓ Verified by ITO</div>
              <div className="trust-strip-divider" />
              <div className="trust-strip-item"><span className="trust-live-dot" />Replies within hours — real people, no bots</div>
              <div className="trust-strip-divider" />
              <div className="trust-strip-item">{heroTrustQuotes[heroTestimonialIdx].flag} &ldquo;{heroTrustQuotes[heroTestimonialIdx].text.slice(0, 38)}…&rdquo;</div>
            </div>
          </div>
        </div>
      </section>

      {/* İKİ YOL — genişleyen görsel paneller */}
      <section className="split" aria-label="Two ways we help">
        {[
          { k: '01', eyebrow: 'Culture · travel · gastronomy', title: 'Private Türkiye', text: advisoryPillars[0].short, cta: 'Explore private travel', href: '/services/tourism', img: '/images/dest/cappadocia.jpg', alt: 'Valleys and rock formations of Cappadocia, Türkiye' },
          { k: '02', eyebrow: 'Care · access · recovery', title: 'Medical Travel', text: advisoryPillars[1].short, cta: 'How we coordinate care', href: '/services/medical-tourism', img: '/images/hero-galata-1000x1250.jpg', alt: 'Galata Tower above the rooftops of Istanbul' },
        ].map((pnl, i) => (
          <Link key={pnl.k} href={pnl.href} className="split-panel">
            <div className="split-media" data-reveal="clip" style={{ '--d': `${i * 140}ms` } as React.CSSProperties}>
              <div className="split-img" data-parallax="0.06">
                <Image src={pnl.img} alt={pnl.alt} fill sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
              </div>
              <span className="split-shade" />
            </div>
            <div className="split-body">
              <span className="split-k">{pnl.k} — {pnl.eyebrow}</span>
              <h2 className="serif">{pnl.title}</h2>
              <p>{pnl.text}</p>
              <span className="split-cta">{pnl.cta} <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        ))}
      </section>

      <DestinationRail
        eyebrow="Discover Türkiye"
        title="Where will you"
        accent="begin?"
        copy="Honest guides to 52 destinations — what to see, when to go, how long to stay, and what to skip."
        allLabel="All 52 destination guides"
        guideLabel="Read the guide"
        prevLabel="Previous destinations"
        nextLabel="Next destinations"
      />

      {/* KAYAN YAZI BANDI */}
      <div className="mq" aria-hidden="true">
        <div className="mq-track">
          {[0, 1].map((rep) => (
            <div className="mq-group" key={rep}>
              {['Istanbul', 'Cappadocia', 'Aegean', 'Mediterranean', 'Black Sea', 'Mesopotamia', 'Anatolia'].map((w) => (
                <span key={w} className="mq-word">{w}<i>✦</i></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* TOURISM — deneyim mozaiği */}
      <section className="xp" id="tourism" style={{background: dm ? '#0a0f1a' : '#fffaf1'}}>
        <div className="container">
          <div className="xp-head">
            <div>
              <span className="eyebrow">Tourism Advisory</span>
              <h2 className="section-title serif" data-reveal="lines">
                <span><span>Go Beyond the Tour.</span></span>
                <span><span style={{color:'var(--gold)'}}>Explore Türkiye.</span></span>
              </h2>
            </div>
            <p className="section-copy" data-reveal style={{ '--d': '150ms' } as React.CSSProperties}>Four dimensions of discovery — heritage, nature, food, and arts. Handpicked for travellers who value authentic, deeply personal experiences.</p>
          </div>
          <div className="xp-grid">
            {tourismVisuals.map((t, i) => {
              const isOpen = expandedTourism === t.title;
              return (
                <article key={t.title} className={`xp-tile xp-${i + 1}`}>
                  <div className="xp-media" data-reveal="clip" style={{ '--d': `${i * 120}ms` } as React.CSSProperties}>
                    <div className="xp-img" data-parallax="0.05">
                      <Image src={t.image} alt={`${t.title} in Türkiye`} fill sizes={i === 0 ? '(max-width: 900px) 100vw, 45vw' : '(max-width: 900px) 100vw, 30vw'} style={{ objectFit: 'cover' }} />
                    </div>
                    <span className="xp-shade" />
                  </div>
                  <div className="xp-body">
                    <span className="xp-num">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{t.title}</h3>
                    <p>{t.short}</p>
                    <button className="read-btn" onClick={() => setExpandedTourism(isOpen ? null : t.title)} aria-expanded={isOpen}>
                      {isOpen ? '▲ Read less' : '▼ Read more'}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="t-overlay">
                      <h3>{t.title}</h3>
                      {t.full.split('\n\n').map((par, j) => <p key={j} style={{margin:'0 0 10px'}}>{par}</p>)}
                      <button className="read-btn" style={{marginTop:'8px'}} onClick={() => setExpandedTourism(null)}>▲ Close</button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about" style={{background: dm ? '#111827' : '#edf5f6'}}>
        <div className="container about-grid">
          <div>
            <span className="eyebrow">Who We Are</span>
            <h2 className="section-title serif">Your trusted guide to Türkiye.</h2>
            <p className="section-copy">Itinerary of Türkiye was founded with a single purpose — to ensure that every visitor to this remarkable country finds exactly what they are looking for.</p>
            <p style={{color: dm ? 'rgba(240,237,232,.65)' : '#647889', fontSize:'15px', lineHeight:'1.8', marginBottom:'28px'}}>
              We understand how overwhelming it can be to navigate an unfamiliar country. That is why we positioned ourselves as a bridge — connecting you seamlessly to the destinations, services, and experiences that match your needs, without the uncertainty of going it alone.
            </p>
            <Link className="btn btn-primary" href="/about">Learn More About Us</Link>
            <div className="about-features">
              <div className="about-feat"><h4><Icon name="landmark" size={15} style={{marginRight:6,verticalAlign:-2}} />Leisure & Tourism</h4><p>Curated holidays and travel experiences</p></div>
              <div className="about-feat"><h4><Icon name="medical" size={15} style={{marginRight:6,verticalAlign:-2}} />Medical & Aesthetic</h4><p>Procedure guidance and coordination</p></div>
              <div className="about-feat"><h4><Icon name="briefcase" size={15} style={{marginRight:6,verticalAlign:-2}} />Business Travel</h4><p>End-to-end corporate support</p></div>
              <div className="about-feat"><h4><Icon name="globe" size={15} style={{marginRight:6,verticalAlign:-2}} />Multilingual Team</h4><p>Experts fluent in many languages</p></div>
            </div>
          </div>
          <div className="about-img">
            <div className="about-par" data-parallax="0.07"><Image src="/images/about-bluemosque-1200x1040.jpg" alt="The Blue Mosque in Sultanahmet, Istanbul, Türkiye" fill sizes="(max-width: 1100px) 100vw, 50vw" /></div>
          </div>
        </div>
      </section>

      {/* STANDARDS */}
      <section className="section" style={{background: dm ? '#0a0f1a' : '#fffaf1'}}>
        <div className="container std-grid">
          <aside className="std-card">
            <span className="eyebrow">Verified by ITO</span>
            <h2 className="serif">How we select.</h2>
            <p>All our partner clinics and providers carry the Verified by ITO standard — assessed for accreditation, patient outcomes, communication quality, and transparency before we recommend them.</p>
          </aside>
          <div className="crit-grid">
            {standardCriteria.map((c) => (
              <article key={c.title} className="crit-card">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HEALTH */}
      <section className="section health-section-new" id="health">
        <div className="container">
          <div className="health-header-row">
            <div className="health-header-text">
              <span className="eyebrow">Medical Tourism</span>
              <h2 className="section-title serif" style={{color:'#fff'}}>The Right Doctor. <span style={{color:'var(--aqua)'}}>The Right Clinic.</span></h2>
              <p className="section-copy" style={{color:'rgba(255,250,241,.65)', marginBottom: 0}}>We connect you with accredited specialists at clinics that match your budget — so you can focus entirely on your health.</p>
            </div>
            <div className="health-stat-badge">
              <span className="health-stat-num">Verified</span>
              <span className="health-stat-label">Partner clinics screened for<br/>accreditation, outcomes & transparency</span>
            </div>
          </div>

          <div className="health-bento">
            <div className="health-photo-card health-bento-main">
              <div className="health-photo-wrap">
                <Image src={healthCategories[0].image} alt={healthCategories[0].title} fill sizes="(max-width: 840px) 100vw, 50vw" />
                <div className="health-photo-overlay" />
                <span className="health-badge-photo">✓ {healthCategories[0].badge}</span>
                <div className="health-photo-text">
                  <h3 className="health-title-photo health-title-main">{healthCategories[0].title}</h3>
                  <p className="health-desc-photo">{healthCategories[0].desc}</p>
                  <div className="health-items-row">
                    {healthCategories[0].items.map((item) => (
                      <span key={item} className="health-item-tag">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="health-bento-side">
              <div className="health-photo-card health-bento-wide">
                <div className="health-photo-wrap">
                  <Image src={healthCategories[1].image} alt={healthCategories[1].title} fill sizes="(max-width: 840px) 100vw, 25vw" />
                  <div className="health-photo-overlay" />
                  <span className="health-badge-photo">✓ {healthCategories[1].badge}</span>
                  <div className="health-photo-text">
                    <h3 className="health-title-photo">{healthCategories[1].title}</h3>
                    <div className="health-items-row">
                      {healthCategories[1].items.map((item) => (
                        <span key={item} className="health-item-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="health-photo-card health-bento-square">
                <div className="health-photo-wrap">
                  <Image src={healthCategories[2].image} alt={healthCategories[2].title} fill sizes="(max-width: 840px) 100vw, 25vw" />
                  <div className="health-photo-overlay" />
                  <span className="health-badge-photo">✓ {healthCategories[2].badge}</span>
                  <div className="health-photo-text">
                    <h3 className="health-title-photo">{healthCategories[2].title}</h3>
                    <div className="health-items-row">
                      {healthCategories[2].items.slice(0,2).map((item) => (
                        <span key={item} className="health-item-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginTop:'36px', textAlign:'center'}}>
            <a className="btn btn-primary" href="#contact">Book a Planning Consultation</a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{background: dm ? '#111827' : '#fff'}}>
        <div className="container">
          <span className="eyebrow">Simple Process</span>
          <h2 className="section-title serif">How it <span style={{color:'var(--gold)'}}>Works.</span></h2>
          <p className="section-copy">Three simple steps. One dedicated team. Zero stress. You focus on Türkiye — we handle everything else.</p>
          <div className="hiw-grid">
            {howItWorks.map((item) => (
              <div key={item.step} className="hiw-card">
                <div className="hiw-step">{item.step}</div>
                <div className="hiw-icon"><Icon name={item.icon as never} size={26} /></div>
                <h3 className="hiw-title" style={{color: dm ? '#fff' : 'var(--navy)'}}>{item.title}</h3>
                <p className="hiw-desc" style={{color: dm ? 'rgba(240,237,232,.65)' : '#647889'}}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:'26px'}}>
            <Link href="/how-we-work" style={{color: dm ? 'var(--gold)' : 'var(--gold-ink)', fontWeight:800, fontSize:'14px', textDecoration:'none'}}>
              See exactly what a planning consultation includes →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{background: dm ? '#0a0f1a' : '#fdf6ec'}}>
        <div className="container">
          <span className="eyebrow">Client Stories</span>
          <h2 className="section-title serif">What Our <span style={{color:'var(--gold)'}}>Clients Say.</span></h2>
          <p className="section-copy">Real people, real experiences. From Dubai to London, from Riyadh to New York — here is what they say about working with us.</p>
          <div className="testi-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testi-card" style={{background: dm ? 'rgba(255,255,255,.04)' : '#fff', borderColor: dm ? 'rgba(201,169,106,.15)' : 'rgba(201,169,106,.15)'}}>
                <div className="testi-header">
                  <div className="testi-avatar" aria-hidden="true">{t.name.split(' ').map(w => w[0]).join('')}</div>
                  <div>
                    <p className="testi-name" style={{color: dm ? '#fff' : 'var(--navy)'}}>{t.flag} {t.name}</p>
                    <p className="testi-loc">{t.location}</p>
                  </div>
                </div>
                <div className="testi-cat">{t.category}</div>
                <p className="testi-text" style={{color: dm ? 'rgba(240,237,232,.75)' : '#4a5568'}}>&ldquo;{t.text}&rdquo;</p>
                <div className="testi-stars">{'★'.repeat(t.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container" style={{textAlign:'center'}}>
          <span className="eyebrow">Common Questions</span>
          <h2 className="section-title serif" style={{margin:'16px auto 18px'}}>Frequently Asked <span style={{color:'var(--gold)'}}>Questions</span></h2>
          <div className="faq-grid">
            {faqItems.map((item) => {
              const isOpen = expandedFaq === item.q;
              return (
                <div key={item.q} className="faq-item">
                  <button className="faq-q" aria-expanded={isOpen} onClick={() => setExpandedFaq(isOpen ? null : item.q)}>
                    <span>{item.q}</span>
                    <span className="faq-arrow" style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>▼</span>
                  </button>
                  {isOpen && <div className="faq-a">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* FORM */}
      <section className="section form-section" id="contact">
        <div className="container form-grid">
          <div>
            <span className="eyebrow">Private Application</span>
            <h2 className="section-title serif" style={{color:'#fff'}}>Start your journey.</h2>
            <p className="section-copy" style={{color:'rgba(255,250,241,.68)'}}>Tell us what you need in Türkiye. We review, clarify fit, recommend the right path, and stay with you through the entire process.</p>
            <p style={{color:'rgba(255,250,241,.55)', fontSize:'12.5px', lineHeight:'1.7', maxWidth:'420px', margin:'0 0 16px', padding:'12px 16px', border:'1px solid rgba(255,250,241,.15)', borderRadius:'12px'}}>
              <Icon name="lock" size={15} style={{marginRight:6,verticalAlign:-2}} />Please do <strong>not</strong> send medical reports, photos, passport documents, payment details or other sensitive files through this initial inquiry. Once we connect, we will guide you to a secure channel for anything confidential.
            </p>
            <a className="hero-pill" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{marginTop:'8px',display:'inline-flex'}}><Icon name="whatsapp" size={17} /> Message us on WhatsApp</a>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="#top"><Image src="/logo.png" alt="Itinerary of Türkiye" style={{height:'84px',width:'84px',objectFit:'contain',background:'#fffdf7',borderRadius:'50%',padding:'6px',boxShadow:'0 2px 14px rgba(0,0,0,.3)'}} width={96} height={96} /></a>
              <p style={{marginTop:'14px',fontSize:'13px',lineHeight:'1.7',maxWidth:'260px'}}>Medical travel coordination and private Türkiye experiences — investment and business advisory on request.</p>
              <div className="social-row">
                <a className="social-btn" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" size={17} /></a>
                <a className="social-btn" href="https://www.instagram.com/itineraryofturkiye" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={17} /></a>
              </div>
            </div>
            <div>
              <h4>Tourism</h4>
              <a href="#tourism">History & Heritage</a>
              <a href="#tourism">Nature & Outdoors</a>
              <a href="#tourism">Food & Drinks</a>
              <a href="#tourism">Arts & Culture</a>
            </div>
            <div>
              <h4>Medical</h4>
              <a href="#health">Hair Transplant</a>
              <a href="#health">Dental Care</a>
              <a href="#health">Rhinoplasty</a>
              <a href="#health">Aesthetic Surgery</a>
            </div>
            <div>
              <h4>Future Services</h4>
              <Link href="/future-services#business">Business Advisory</Link>
              <Link href="/future-services#investment">Investment &amp; Real Estate</Link>
              <Link href="/how-we-work">How We Work</Link>
              <Link href="/standard">The ITO Standard</Link>
              <Link href="/blogs">Guides &amp; Articles</Link>
              <a href="#contact">Contact Us</a>
              <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
          <div className="footer-legal">
            <span>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved.</span>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/legal-notice">Legal Notice</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}