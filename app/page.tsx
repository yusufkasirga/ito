'use client';

import { useMemo, useState, useEffect } from 'react';
import { whatsAppUrl } from '@/lib/config';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ interest: '', country: '', timeline: '', contact: '', name: '', email: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [expandedTourism, setExpandedTourism] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [heroTestimonialIdx, setHeroTestimonialIdx] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  const heroSlides = [
    { image: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', position: '50% 38%' },
    { image: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', position: '65% 45%' },
    { image: 'https://images.pexels.com/photos/1539581/pexels-photo-1539581.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', position: '55% 40%' },
    { image: 'https://images.pexels.com/photos/2678218/pexels-photo-2678218.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', position: '60% 35%' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide(p => (p + 1) % heroSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const heroTrustQuotes = [
    { name: 'Mark T.', flag: '🇬🇧', text: 'You made my whole journey incredibly smooth — from my trip to my business meetings.' },
    { name: 'Alan G.', flag: '🇺🇸', text: 'It would have saved me from many mistakes I experienced in the past. Outstanding service.' },
    { name: 'Pawan K.', flag: '🇮🇳', text: 'Their local knowledge and reliable support gave me the confidence to make informed decisions.' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroTestimonialIdx(p => (p + 1) % heroTrustQuotes.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseParallax({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

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
      image: 'https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop'
    },
    {
      title: 'Nature & Outdoors',
      short: 'Hot air balloons drift over the valleys of Cappadocia. Turquoise coastlines stretch along the Aegean and Mediterranean — all waiting to be explored.',
      full: "Türkiye's natural landscape is as dramatic as it is diverse. Hot air balloons drift over the otherworldly valleys of Cappadocia at sunrise. Turquoise coastlines stretch for thousands of kilometres along the Aegean and Mediterranean.\n\nWhether you are hiking the legendary Lycian Way, sailing a traditional gulet across hidden coves, or simply standing at the edge of Pamukkale's cotton-white terraces — nature in Türkiye has a way of leaving you speechless.",
      image: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop'
    },
    {
      title: 'Food & Drinks',
      short: 'Turkish cuisine is one of the great culinary traditions of the world. From sizzling kebabs to delicate baklava — every dish carries centuries of tradition.',
      full: "Turkish cuisine is one of the great culinary traditions of the world — and eating here is never just a meal, it is an experience. From the sizzle of freshly grilled kebabs to the delicate layers of a perfectly made baklava, every dish carries centuries of tradition.\n\nStart your morning with a legendary Turkish breakfast — an abundant spread of cheeses, olives, eggs, honey, and fresh bread. Sip on a tulip-shaped glass of çay as the day unfolds, or let the rich aroma of Turkish coffee linger long after the cup is empty.\n\nHere, every meal tells a story. Come hungry.",
      image: 'https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop'
    },
    {
      title: 'Arts & Culture',
      short: 'Türkiye is a canvas painted by countless civilisations. Where ancient mosaics sit beside contemporary galleries and craftsmanship fills every street.',
      full: "Türkiye is a canvas painted by countless civilisations — Greek, Roman, Byzantine, Seljuk, and Ottoman — each leaving behind a cultural legacy that still breathes today.\n\nLose yourself in the rhythm of a traditional whirling dervish ceremony. Wander through the Grand Bazaar and witness artisans practising crafts passed down through generations — hand-painted ceramics, intricate carpet weaving, and delicate calligraphy.\n\nCome curious. Leave inspired.",
      image: 'https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop'
    },
  ];

  const healthCategories = [
    {
      title: 'Hair Restoration',
      badge: '98% Satisfaction',
      desc: 'World-leading FUE & DHI techniques. Natural, permanent results.',
      items: ['Hair Transplant', 'Beard & Mustache', 'Eyebrow Restoration'],
      image: 'https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop',
    },
    {
      title: 'Dental Care',
      badge: '96% Satisfaction',
      desc: 'Veneers, implants and Hollywood smile makeovers — flawless results.',
      items: ['Hollywood Smile', 'Veneers', 'Dental Implants'],
      image: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop',
    },
    {
      title: 'Aesthetic Surgery',
      badge: '97% Satisfaction',
      desc: 'Precision results by internationally recognised plastic surgeons.',
      items: ['Rhinoplasty', 'Facelift', 'Liposuction', 'Breast Augmentation'],
      image: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop',
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
      location: 'Verified Client',
      flag: '🇬🇧',
      category: 'Tourism · Hair Transplant · Business',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      text: 'A big thank you to the Itinerary of Turkiye team! You made my whole journey incredibly smooth — from my trip and hair transplant to my business meetings. Everything was well organised, and I honestly did not expect the experience to be this seamless. Thank you for your professionalism, care, and support throughout the entire process.',
      rating: 5,
    },
    {
      name: 'Luke W.',
      location: 'Verified Client',
      flag: '🇦🇺',
      category: 'Business Advisory',
      image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      text: 'Dear Itinerary of Turkiye — thank you for helping make my business trip such a success, resulting in several positive deals. You all deserve much greater recognition and success.',
      rating: 5,
    },
    {
      name: 'Alan G.',
      location: 'Verified Client',
      flag: '🇺🇸',
      category: 'Real Estate',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      text: 'I only wish I had known about Itinerary of Turkiye earlier. It would have saved me from many complications, mistakes, and even scams I unfortunately experienced in the past. Thanks to their guidance and local expertise, I was able to secure a great real estate deal that would not have been possible without their assistance. I will gladly recommend their services to others.',
      rating: 5,
    },
    {
      name: 'Pawan K.',
      location: 'Verified Client',
      flag: '🇮🇳',
      category: 'Investment Advisory',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      text: 'Investing in Türkiye can be challenging without the guidance of trustworthy local experts. Itinerary of Türkiye helped me tremendously throughout the process. Their local knowledge, professionalism, and reliable support gave me the confidence to make informed decisions and avoid many potential pitfalls.',
      rating: 5,
    },
  ];

  const howItWorks = [
    { step: '01', icon: '💬', title: 'Tell us what you need', desc: 'Send us a message via WhatsApp, email, or the form below. A real person responds within hours — no bots, no automated replies.' },
    { step: '02', icon: '🎯', title: 'We build your plan', desc: 'We review your needs, match you with the right providers, and prepare a tailored recommendation — completely free of charge.' },
    { step: '03', icon: '✈️', title: 'Arrive & enjoy', desc: 'We handle transfers, appointments, translation, and support throughout your entire stay. You focus on Türkiye. We handle everything else.' },
  ];

  const faqItems = [
    { q: 'Is your service free of charge?', a: 'Our initial consultation and advisory matching service is complimentary. We earn from our verified partner network — so there is no direct cost to you for connecting with the right clinic, agent, or expert.' },
    { q: 'Can foreigners buy property in Türkiye?', a: 'Yes. Citizens of most countries can purchase property in Türkiye. The process is straightforward with the right legal support — we connect you with experienced property lawyers and licensed agents who specialise in foreign buyer transactions.' },
    { q: 'How long does a hair transplant take?', a: 'Most FUE and DHI hair transplant procedures take 6–8 hours and are performed in a single day. Recovery is minimal — most clients return home within 2–3 days. Full results are visible within 12 months.' },
    { q: 'Will I be supported throughout my stay?', a: 'Absolutely. We coordinate airport transfers, accommodation, clinic appointments, translation, and aftercare. You will have a dedicated contact available throughout your entire visit.' },
  ];

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 1 && !formData.interest) errors.interest = 'Please select';
    if (step === 2 && !formData.timeline) errors.timeline = 'Please select';
    if (step === 3) {
      if (!formData.name) errors.name = 'Required';
      if (!formData.country) errors.country = 'Required';
      if (!formData.contact) errors.contact = 'Required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Structured prefilled message built entirely in the browser.
  // No form data is stored on any server — WhatsApp is the only channel.
  const waLeadMessage = [
    'Private Application — Itinerary of Türkiye',
    `Name: ${formData.name || '-'}`,
    `Country: ${formData.country || '-'}`,
    `Area of interest: ${formData.interest || '-'}`,
    `Timeline: ${formData.timeline || '-'}`,
    `Preferred contact: ${formData.contact || '-'}`,
    formData.email ? `Email: ${formData.email}` : '',
    '',
    'Note: I understand I should not share medical reports, photos, passport documents or other sensitive files in this initial message.',
  ].filter(Boolean).join('\n');

  const handleFormSubmit = () => {
    if (validateStep(formStep)) {
      if (formStep < 3) {
        setFormStep(formStep + 1);
      } else {
        setFormSubmitted(true);
        // Open WhatsApp with the structured message (client-side only)
        window.open(whatsAppUrl(waLeadMessage), '_blank', 'noopener,noreferrer');
      }
    }
  };

  const dm = darkMode;

  return (
    <main style={{ background: dm ? '#0a0f1a' : '#fffaf1', color: dm ? '#f0ede8' : '#071726', fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }

        :root {
          --gold: #c9a96a; --aqua: #8ed8dc; --navy: #081f35; --navy2: #0c3555;
          --blue: #0f6ea8; --muted: #647889; --line: rgba(8,31,53,.14);
          --shadow-sm: 0 2px 8px rgba(7,23,38,.08);
          --shadow-md: 0 8px 24px rgba(7,23,38,.12);
          --shadow-lg: 0 20px 60px rgba(7,23,38,.18);
          --r: 28px;
        }

        .container { width: min(1240px, calc(100% - 48px)); margin: 0 auto; }
        .serif { font-family: 'Playfair Display', serif; letter-spacing: -.04em; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
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
        .mobile-menu a { color: #fff; text-decoration: none; font-size: 26px; font-weight: 800; font-family: 'Playfair Display', serif; transition: color 0.2s; }
        .mobile-menu a:hover { color: var(--gold); }
        .mobile-close { position: absolute; top: 24px; right: 28px; background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; }

        /* HERO — TOTAL REDESIGN: mesh gradient + split frame */
        .hero { position: relative; min-height: 92vh; overflow: hidden; color: #fff; display: flex; align-items: center; background: #0d1424; }
        .hero-mesh { position: absolute; inset: 0; z-index: 0; background:
          radial-gradient(circle at 8% 18%, rgba(232,149,107,.32) 0%, transparent 38%),
          radial-gradient(circle at 88% 12%, rgba(142,216,220,.22) 0%, transparent 42%),
          radial-gradient(circle at 78% 88%, rgba(201,169,106,.26) 0%, transparent 40%),
          radial-gradient(circle at 15% 85%, rgba(15,110,168,.3) 0%, transparent 40%),
          linear-gradient(160deg, #0a1020 0%, #0d1b3a 45%, #0a1020 100%);
          animation: mesh-drift 18s ease-in-out infinite alternate;
        }
        @keyframes mesh-drift { 0% { filter: hue-rotate(0deg) brightness(1); } 100% { filter: hue-rotate(8deg) brightness(1.06); } }
        .hero-grain { position: absolute; inset: 0; z-index: 1; opacity: .05; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E"); pointer-events: none; }

        .hero-split { position: relative; z-index: 2; width: min(1280px, calc(100% - 48px)); margin: 0 auto; padding: 130px 0 60px; display: grid; grid-template-columns: 1.05fr .95fr; gap: 56px; align-items: center; }

        .hero-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-size: 11.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.82); margin-bottom: 26px; }
        .hero-eyebrow::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #ffb46e; box-shadow: 0 0 0 4px rgba(255,180,110,.25); animation: pulse-dot 2.2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 4px rgba(255,180,110,.25); } 50% { box-shadow: 0 0 0 9px rgba(255,180,110,.08); } }

        .hero h1 { margin: 0 0 22px; font-size: clamp(38px, 6.6vw, 84px); line-height: .96; letter-spacing: -.01em; color: #fff; font-family: 'Playfair Display', serif; font-weight: 900; }
        .hero h1 em { color: #E8956B; font-style: italic; display: block; margin-top: 2px; }
        .hero-copy { max-width: 460px; margin: 0 0 36px; color: rgba(255,255,255,.85); font-size: 16.5px; line-height: 1.78; font-weight: 400; }

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

        /* FRAMED PHOTO STACK */
        .hero-photo-stack { position: relative; height: 640px; display: flex; align-items: center; justify-content: center; }
        .hero-photo-frame { position: absolute; border-radius: 26px; overflow: hidden; box-shadow: 0 40px 90px rgba(0,0,0,.5); transition: opacity 1.1s cubic-bezier(.22,.61,.36,1), transform 1.1s cubic-bezier(.22,.61,.36,1); }
        .hero-photo-frame img { width: 100%; height: 100%; object-fit: cover; }
        .hero-photo-frame.main { width: 82%; height: 96%; z-index: 3; }
        .hero-photo-frame.deco-1 { width: 42%; height: 46%; right: -4%; top: -6%; z-index: 2; border: 4px solid rgba(255,255,255,.14); }
        .hero-photo-frame.deco-2 { width: 34%; height: 38%; left: -6%; bottom: 4%; z-index: 1; opacity: .65; border: 4px solid rgba(255,255,255,.1); }
        .hero-photo-badge { position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); z-index: 4; padding: 12px 22px; border-radius: 999px; background: rgba(13,20,36,.85); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(14px); display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 700; color: #fff; white-space: nowrap; box-shadow: 0 12px 30px rgba(0,0,0,.4); }

        .hero-dots { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 3; }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.38); cursor: pointer; transition: width .4s cubic-bezier(.22,.61,.36,1), background .4s ease; }
        .hero-dot.on { width: 26px; border-radius: 3px; background: #fff; }

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
        .pillar-section { padding: 32px 0 48px; background: ${dm ? '#111827' : 'var(--ivory, #fffaf1)'}; }
        .pillar-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; max-width: 920px; margin: 0 auto; }
        .pillar-card { padding: 30px; border: 1px solid ${dm ? 'rgba(201,169,106,.2)' : 'rgba(201,169,106,.24)'}; border-radius: var(--r); background: ${dm ? 'rgba(255,255,255,.04)' : 'rgba(255,250,241,.96)'}; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; transition: all 0.3s; }
        .pillar-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-6px); }
        .pillar-eyebrow { color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
        .pillar-card h2 { margin: 14px 0 8px; color: ${dm ? '#fff' : 'var(--navy)'}; font-size: 26px; }
        .pillar-short { color: ${dm ? 'rgba(240,237,232,.65)' : '#647889'}; line-height: 1.68; font-size: 14px; flex: 1; margin: 0; }
        .pillar-full { margin-top: 12px; color: ${dm ? 'rgba(240,237,232,.65)' : '#647889'}; line-height: 1.72; font-size: 14px; border-top: 1px solid ${dm ? 'rgba(255,255,255,.08)' : 'rgba(8,31,53,.1)'}; padding-top: 12px; animation: fadeUp 0.3s ease; }

        /* TOURISM */
        .tourism-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 40px; }
        .t-card { border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow-lg); transition: transform 0.3s; cursor: pointer; }
        .t-card:not(.expanded):hover { transform: translateY(-10px); }
        .t-img { height: 480px; position: relative; }
        .t-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.72); transition: filter 0.3s; }
        .t-card:hover .t-img img { filter: brightness(.88); }
        .t-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px 22px 20px; background: linear-gradient(180deg, transparent, rgba(0,0,0,.88)); color: #fff; }
        .t-label h3 { margin: 0 0 7px; font-size: 20px; font-weight: 900; font-family: 'Playfair Display', serif; }
        .t-label p { margin: 0 0 12px; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,.8); }
        .t-expanded { padding: 18px 22px 22px; background: var(--navy); color: rgba(255,250,241,.82); font-size: 13px; line-height: 1.78; animation: fadeUp 0.3s ease; }

        /* ABOUT */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .about-img { border-radius: var(--r); overflow: hidden; height: 520px; box-shadow: var(--shadow-lg); }
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
        .health-stat-num { display: block; font-size: 30px; font-weight: 900; color: var(--gold); font-family: 'Playfair Display', serif; line-height: 1; margin-bottom: 6px; }
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
        .health-title-photo { margin: 0 0 8px; color: #fff; font-size: 19px; font-weight: 900; font-family: 'Playfair Display', serif; }
        .health-title-main { font-size: 27px; }
        .health-desc-photo { margin: 0 0 14px; color: rgba(255,250,241,.78); font-size: 13px; line-height: 1.6; }
        .health-items-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .health-item-tag { padding: 5px 11px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 999px; font-size: 11px; color: rgba(255,250,241,.85); font-weight: 600; backdrop-filter: blur(4px); }

        /* INVESTMENT */
        .inv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .inv-visual { position: relative; height: 560px; border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow-lg); }
        .inv-visual img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.75); }
        .inv-badge { position: absolute; bottom: 22px; left: 22px; right: 22px; padding: 14px 18px; background: rgba(201,169,106,.92); border-radius: 14px; color: var(--navy); font-size: 13px; font-weight: 900; }

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
        .field input, .field select, .field textarea { width: 100%; min-height: 52px; padding: 0 14px; border: 1px solid rgba(255,250,241,.18); border-radius: 12px; color: #fff; background: rgba(7,23,38,.5); font: 15px 'Inter', sans-serif; outline: none; transition: border 0.2s; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--aqua); }
        .field textarea { min-height: 96px; padding-top: 12px; resize: vertical; }
        .field select option { color: #071726; }
        .form-success { padding: 20px; text-align: center; background: rgba(142,216,220,.12); border: 1px solid var(--aqua); border-radius: 14px; }
        .form-success h3 { margin: 0 0 8px; color: var(--aqua); }
        .form-success p { margin: 0; font-size: 13px; color: rgba(255,250,241,.8); }

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
        .hiw-step { font-size: 11px; font-weight: 900; letter-spacing: .18em; color: var(--gold); margin-bottom: 12px; }
        .hiw-icon { font-size: 36px; margin-bottom: 16px; }
        .hiw-title { font-size: 18px; font-weight: 900; margin: 0 0 10px; }
        .hiw-desc { font-size: 14px; line-height: 1.7; margin: 0; }

        /* TESTIMONIALS */
        .testi-section { background: #fdf6ec; }
        .testi-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; margin-top: 48px; }
        .testi-card { padding: 28px; border-radius: 24px; background: #fff; border: 1px solid rgba(201,169,106,.15); box-shadow: 0 4px 24px rgba(7,23,38,.06); transition: all 0.3s; }
        .testi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(7,23,38,.1); border-color: rgba(201,169,106,.3); }
        .testi-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .testi-avatar { width: 52px; height: 52px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid var(--gold); }
        .testi-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .testi-name { font-size: 15px; font-weight: 900; color: var(--navy); margin: 0 0 3px; }
        .testi-loc { font-size: 12px; color: var(--muted); margin: 0; }
        .testi-cat { display: inline-block; padding: 4px 10px; background: rgba(201,169,106,.1); color: var(--gold); border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 14px; border: 1px solid rgba(201,169,106,.2); }
        .testi-text { color: #4a5568; font-size: 14px; line-height: 1.78; margin: 0 0 14px; font-style: italic; }
        .testi-stars { color: var(--gold); font-size: 14px; letter-spacing: 2px; }

        /* WHATSAPP */
        .wa-btn { position: fixed; bottom: 28px; right: 28px; z-index: 999; width: 58px; height: 58px; border-radius: 50%; background: #25D366; box-shadow: 0 4px 20px rgba(37,211,102,.45); display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 26px; transition: all 0.25s; animation: bounce 2.5s ease-in-out infinite; }
        .wa-btn:hover { transform: scale(1.12); box-shadow: 0 6px 28px rgba(37,211,102,.6); animation: none; }

        /* CONCIERGE */
        .concierge { position: fixed; top: 90px; right: 20px; padding: 10px 16px; background: var(--gold); border-radius: 999px; font-size: 11px; font-weight: 900; color: var(--navy); z-index: 45; box-shadow: var(--shadow-md); }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .testi-grid { grid-template-columns: 1fr; }
          .std-grid, .form-grid, .about-grid, .inv-grid { grid-template-columns: 1fr; }
          .tourism-grid { grid-template-columns: repeat(2,1fr); }
          .health-header-row { flex-direction: column; align-items: flex-start; }
          .health-stat-badge { text-align: left; width: 100%; }
          .hero-split { grid-template-columns: 1fr; gap: 48px; padding: 120px 0 50px; text-align: center; }
          .hero-eyebrow { justify-content: center; }
          .hero-copy { margin-left: auto; margin-right: auto; }
          .hero-btns { justify-content: center; }
          .hero-photo-stack { height: 420px; max-width: 520px; margin: 0 auto; }
          .hero-photo-frame.deco-1, .hero-photo-frame.deco-2 { display: none; }
          .hero-photo-frame.main { width: 100%; height: 100%; position: relative; border-radius: 22px; }
          .hero-photo-badge { position: relative; bottom: auto; left: auto; transform: none; margin-top: 16px; display: inline-flex; font-size: 11.5px; }
        }
        @media (max-width: 840px) {
          .hiw-grid { grid-template-columns: 1fr; }
          .hiw-grid::before { display: none; }
          .pillar-grid, .crit-grid { grid-template-columns: 1fr; }
          .f-row { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .nav-links { display: none; }
          .nav-toggle { display: flex; }
          .health-bento { grid-template-columns: 1fr; }
          .health-bento-main .health-photo-wrap { height: 240px; }
          .health-bento-wide .health-photo-wrap, .health-bento-square .health-photo-wrap { height: 161px; }
          .hero { min-height: 100svh; }
          .hero-split { padding: 110px 0 40px; }
          .hero-trust-strip { flex-wrap: wrap; gap: 10px 14px; justify-content: center; }
          .hero-photo-stack { height: 360px; max-width: 480px; }
        }
        @media (max-width: 640px) {
          .tourism-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
          .about-features { grid-template-columns: 1fr; }
          .about-img { height: 320px; }
          .inv-visual { height: 340px; }
          .container { width: calc(100% - 28px); }
          .section { padding: 56px 0; }
          .hero-split { width: calc(100% - 36px); padding: 100px 0 32px; }
          .hero h1 { font-size: clamp(32px, 9vw, 46px); }
          .hero-pill { padding: 11px 18px; font-size: 12.5px; }
          .hero-trust-strip { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; border-radius: 16px; }
          .trust-strip-divider { display: none; }
          .hero-dots { left: 50%; transform: translateX(-50%); }
          .hero-photo-stack { height: 260px; max-width: 100%; }
          .hero-photo-badge { font-size: 11px; padding: 9px 16px; }
        }
      `}</style>

      {/* WHATSAPP FLOAT */}
      <a className="wa-btn" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff"><path d="M16.004 3C9.374 3 4 8.373 4 15.002c0 2.444.71 4.72 1.94 6.638L4 29l7.547-1.901a11.93 11.93 0 0 0 4.457.873h.005c6.629 0 12.003-5.373 12.003-12.002C28.012 8.373 22.638 3 16.004 3zm0 21.97a9.93 9.93 0 0 1-5.064-1.39l-.363-.215-4.479 1.128 1.196-4.367-.236-.448a9.93 9.93 0 0 1-1.523-5.276c0-5.503 4.477-9.98 9.973-9.98 5.495 0 9.973 4.477 9.973 9.98-.004 5.503-4.481 9.568-9.477 9.568zm5.47-7.466c-.299-.15-1.767-.872-2.04-.972-.273-.1-.472-.15-.671.15-.198.298-.769.972-.943 1.171-.174.198-.348.224-.646.075-.298-.15-1.258-.464-2.396-1.479-.886-.79-1.484-1.766-1.658-2.064-.174-.298-.018-.46.131-.609.135-.134.298-.348.447-.522.15-.174.199-.298.298-.497.1-.198.05-.373-.025-.522-.075-.15-.671-1.617-.92-2.215-.242-.582-.488-.503-.671-.512l-.572-.01c-.198 0-.522.075-.795.373-.273.298-1.043 1.02-1.043 2.488 0 1.467 1.068 2.886 1.217 3.084.149.198 2.102 3.21 5.09 4.502.711.307 1.266.49 1.699.627.713.227 1.363.195 1.877.118.572-.086 1.767-.722 2.016-1.42.249-.696.249-1.293.174-1.42-.075-.124-.273-.198-.572-.348z"/></svg>
      </a>

      {/* CONCIERGE BADGE */}
      <div className="concierge">✓ Available 24/7</div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : 'closed'}`}>
        <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
        <a href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
        <div style={{textAlign:'center'}}>
          <a href="/services" onClick={(e) => { e.preventDefault(); setMobileServicesOpen(!mobileServicesOpen); }}>
            Services {mobileServicesOpen ? '▲' : '▼'}
          </a>
          {mobileServicesOpen && (
            <div style={{display:'flex',flexDirection:'column',gap:'14px',marginTop:'14px'}}>
              <a href="/#tourism" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'17px',color:'rgba(255,255,255,.75)'}}>Tourism</a>
              <a href="/#health" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'17px',color:'rgba(255,255,255,.75)'}}>Medical Tourism</a>
            </div>
          )}
        </div>
        <a href="/blogs" onClick={() => setMobileMenuOpen(false)}>Blogs</a>
        <a href="/testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
        <a href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{color:'#25D366'}}>WhatsApp 💬</a>
      </div>

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/"><img src="/logo.png" alt="Itinerary of Türkiye" /></a>
          <nav className="nav-links">
            <a href="/about">About Us</a>
            <div className="nav-dropdown" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)} onFocus={() => setServicesOpen(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false); }}>
              <a href="/services">Services</a>
              {servicesOpen && (
                <div className="nav-dropdown-menu">
                  <a href="/#tourism">Tourism</a>
                  <a href="/#health">Medical Tourism</a>
                </div>
              )}
            </div>
            <a href="/blogs">Blogs</a>
            <a href="/testimonials">Testimonials</a>
            <a href="/#contact">Contact</a>
            <button className="dm-toggle" onClick={() => setDarkMode(!dm)} title="Toggle dark mode">{dm ? '☀️' : '🌙'}</button>
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <button className="dm-toggle" onClick={() => setDarkMode(!dm)} style={{display:'none'}}>{dm ? '☀️' : '🌙'}</button>
            <button className="nav-toggle" onClick={() => setMobileMenuOpen(true)}>☰</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-mesh" />
        <div className="hero-grain" />
        <div className="hero-split">
          <div>
            <p className="hero-eyebrow">Live & responding right now</p>
            <h1 className="serif">Türkiye Awaits.<em>We'll Take You There.</em></h1>
            <p className="hero-copy">Your trusted local partner for tourism, medical procedures, business, and real estate — all in one place.</p>
            <div className="hero-btns">
              <a className="hero-pill hero-pill-primary" href="#tourism">🏛️ Tourism</a>
              <a className="hero-pill" href="#health">🏥 Medical Tourism</a>
            </div>
            <div className="hero-trust-strip">
              <div className="trust-strip-item">✓ Verified by ITO</div>
              <div className="trust-strip-divider" />
              <div className="trust-strip-item"><span className="trust-live-dot" />Replies within hours — real people, no bots</div>
              <div className="trust-strip-divider" />
              <div className="trust-strip-item">{heroTrustQuotes[heroTestimonialIdx].flag} "{heroTrustQuotes[heroTestimonialIdx].text.slice(0, 38)}…"</div>
            </div>
          </div>

          <div className="hero-photo-stack">
            {heroSlides.map((s, i) => {
              const isActive = i === activeSlide;
              return (
                <div
                  key={i}
                  className="hero-photo-frame main"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? `scale(1) translate(${mouseParallax.x * 6}px, ${mouseParallax.y * 4}px)`
                      : 'scale(1.04)',
                    zIndex: isActive ? 3 : 2,
                  }}
                >
                  <img src={s.image} alt="Türkiye" style={{objectPosition: s.position || '50% 50%'}} />
                </div>
              );
            })}
            <div className="hero-photo-frame deco-1" style={{transform: `translate(${mouseParallax.x * -8}px, ${mouseParallax.y * -5}px)`}}>
              <img src={heroSlides[(activeSlide + 1) % heroSlides.length].image} alt="Türkiye" style={{objectPosition: heroSlides[(activeSlide + 1) % heroSlides.length].position}} />
            </div>
            <div className="hero-photo-frame deco-2" style={{transform: `translate(${mouseParallax.x * -4}px, ${mouseParallax.y * -3}px)`}}>
              <img src={heroSlides[(activeSlide + 2) % heroSlides.length].image} alt="Türkiye" style={{objectPosition: heroSlides[(activeSlide + 2) % heroSlides.length].position}} />
            </div>
            <div className="hero-photo-badge">✨ Cappadocia · Istanbul · Aegean Coast</div>
          </div>
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} className={`hero-dot ${i === activeSlide ? 'on' : ''}`} style={{border:'none',padding:0}} onClick={() => setActiveSlide(i)} />
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="pillar-section">
        <div className="container pillar-grid">
          {advisoryPillars.map((item) => {
            const isOpen = expandedPillar === item.title;
            return (
              <div key={item.title} className="pillar-card">
                <span className="pillar-eyebrow">{item.subtitle}</span>
                <h2 className="serif">{item.title}</h2>
                <p className="pillar-short">{item.short}</p>
                {isOpen && <p className="pillar-full">{item.full}</p>}
                <button className="btn btn-ghost read-btn-light" style={{marginTop:'16px',minHeight:'36px',padding:'0 16px',fontSize:'12px',alignSelf:'flex-start'}} onClick={() => setExpandedPillar(isOpen ? null : item.title)}>
                  {isOpen ? '▲ Read less' : '▼ Read more'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOURISM */}
      <section className="section" id="tourism" style={{background: dm ? '#0a0f1a' : '#fffaf1'}}>
        <div className="container">
          <span className="eyebrow">Tourism Advisory</span>
          <h2 className="section-title serif">Go Beyond the Tour. <span style={{color:'var(--gold)'}}>Explore Türkiye.</span></h2>
          <p className="section-copy">Four dimensions of discovery — heritage, nature, food, and arts. Handpicked for travellers who value authentic, deeply personal experiences.</p>
          <div className="tourism-grid">
            {tourismVisuals.map((t) => {
              const isOpen = expandedTourism === t.title;
              return (
                <div key={t.title} className={`t-card${isOpen ? ' expanded' : ''}`}>
                  <div className="t-img">
                    <img src={t.image} alt={t.title} />
                    <div className="t-label">
                      <h3>{t.title}</h3>
                      <p>{t.short}</p>
                      <button className="read-btn" onClick={() => setExpandedTourism(isOpen ? null : t.title)}>
                        {isOpen ? '▲ Read less' : '▼ Read more'}
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="t-expanded">
                      {t.full.split('\n\n').map((p, i) => <p key={i} style={{margin:'0 0 10px'}}>{p}</p>)}
                      <button className="read-btn" style={{marginTop:'8px'}} onClick={() => setExpandedTourism(null)}>▲ Collapse</button>
                    </div>
                  )}
                </div>
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
            <a className="btn btn-primary" href="/about">Learn More About Us</a>
            <div className="about-features">
              <div className="about-feat"><h4>🏛️ Leisure & Tourism</h4><p>Curated holidays and travel experiences</p></div>
              <div className="about-feat"><h4>🏥 Medical & Aesthetic</h4><p>Procedure guidance and coordination</p></div>
              <div className="about-feat"><h4>💼 Business Travel</h4><p>End-to-end corporate support</p></div>
              <div className="about-feat"><h4>🌐 Multilingual Team</h4><p>Experts fluent in many languages</p></div>
            </div>
          </div>
          <div className="about-img">
            <img src="https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop" alt="Istanbul" />
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
              <span className="health-stat-num">1,200+</span>
              <span className="health-stat-label">Successful procedures<br/>completed with our partners</span>
            </div>
          </div>

          <div className="health-bento">
            <div className="health-photo-card health-bento-main">
              <div className="health-photo-wrap">
                <img src={healthCategories[0].image} alt={healthCategories[0].title} />
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
                  <img src={healthCategories[1].image} alt={healthCategories[1].title} />
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
                  <img src={healthCategories[2].image} alt={healthCategories[2].title} />
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
            <a className="btn btn-primary" href="#contact">Get a Free Consultation</a>
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
                <div className="hiw-icon">{item.icon}</div>
                <h3 className="hiw-title" style={{color: dm ? '#fff' : 'var(--navy)'}}>{item.title}</h3>
                <p className="hiw-desc" style={{color: dm ? 'rgba(240,237,232,.65)' : '#647889'}}>{item.desc}</p>
              </div>
            ))}
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
                  <div className="testi-avatar"><img src={t.image} alt={t.name} /></div>
                  <div>
                    <p className="testi-name" style={{color: dm ? '#fff' : 'var(--navy)'}}>{t.flag} {t.name}</p>
                    <p className="testi-loc">{t.location}</p>
                  </div>
                </div>
                <div className="testi-cat">{t.category}</div>
                <p className="testi-text" style={{color: dm ? 'rgba(240,237,232,.75)' : '#4a5568'}}>"{t.text}"</p>
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
              🔒 Please do <strong>not</strong> send medical reports, photos, passport documents, payment details or other sensitive files through this initial inquiry. Once we connect, we will guide you to a secure channel for anything confidential.
            </p>
            <a className="hero-pill" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{marginTop:'8px',display:'inline-flex'}}>💬 Message us on WhatsApp</a>
          </div>
          <form className="form-box" onSubmit={e => e.preventDefault()}>
            {!formSubmitted ? (
              <>
                <div className="form-prog"><div className="form-bar" style={{width:`${formStep*33.33}%`}} /></div>
                {formStep === 1 && (
                  <div>
                    <div className="form-ttl">What brings you to Türkiye?</div>
                    <div className="field">
                      <label>Area of Interest *</label>
                      <select value={selectedPath} onChange={e => { setSelectedPath(e.target.value); setFormData({...formData, interest: e.target.value}); }}>
                        <option value="">Select your interest</option>
                        <option>Tourism</option><option>Medical Tourism</option>
                        <option>Investment / Real Estate</option><option>Business</option><option>Other</option>
                      </select>
                      {formErrors.interest && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.interest}</span>}
                    </div>
                  </div>
                )}
                {formStep === 2 && (
                  <div>
                    <div className="form-ttl">When do you envision this?</div>
                    <div className="field">
                      <label>Preferred Timeline *</label>
                      <select value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}>
                        <option value="">Select timeline</option>
                        <option>Within 2 weeks</option><option>1–2 months</option>
                        <option>3–6 months</option><option>Exploratory only</option>
                      </select>
                      {formErrors.timeline && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.timeline}</span>}
                    </div>
                  </div>
                )}
                {formStep === 3 && (
                  <div>
                    <div className="form-ttl">How can we reach you?</div>
                    <div className="field" style={{marginBottom:'12px'}}>
                      <label>Your Name *</label>
                      <input type="text" placeholder="Full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      {formErrors.name && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.name}</span>}
                    </div>
                    <div className="f-row">
                      <div className="field">
                        <label>Country *</label>
                        <input type="text" placeholder="UK, UAE, Germany..." value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                        {formErrors.country && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.country}</span>}
                      </div>
                      <div className="field">
                        <label>Preferred Contact *</label>
                        <select value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})}>
                          <option value="">Select method</option>
                          <option>Email</option><option>WhatsApp</option>
                          <option>Phone call</option><option>Video meeting</option>
                        </select>
                        {formErrors.contact && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.contact}</span>}
                      </div>
                    </div>
                    <div className="field" style={{marginTop:'12px'}}>
                      <label>Email</label>
                      <input type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                )}
                <div style={{display:'flex',gap:'12px',marginTop:'20px'}}>
                  {formStep > 1 && <button type="button" className="btn" style={{background:'rgba(255,255,255,.12)',color:'#fff',minHeight:'48px',padding:'0 20px',fontSize:'13px'}} onClick={() => setFormStep(formStep-1)}>Back</button>}
                  <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>{formStep < 3 ? 'Continue →' : 'Submit Request'}</button>
                </div>
              </>
            ) : (
              <div className="form-success">
                <h3>✓ Application Prepared</h3>
                <p>WhatsApp should have opened with your structured message. Nothing was stored on our servers — your details travel only in that message.</p>
                <a
                  className="btn btn-primary"
                  style={{marginTop:'18px', background:'#25D366', minHeight:'48px'}}
                  href={whatsAppUrl(waLeadMessage)}
                  target="_blank" rel="noopener noreferrer"
                >
                  💬 Open WhatsApp again
                </a>
                <p style={{marginTop:'14px', fontSize:'11.5px', color:'rgba(255,250,241,.55)'}}>Reminder: please don&apos;t attach medical reports, photos or ID documents in this first message.</p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="#top"><img src="/logo.png" alt="Itinerary of Türkiye" style={{height:'72px',width:'auto',filter:'brightness(0) invert(1)',opacity:.9}} /></a>
              <p style={{marginTop:'14px',fontSize:'13px',lineHeight:'1.7',maxWidth:'260px'}}>Premium advisory for tourism, medical tourism, investment and business in Türkiye.</p>
              <div className="social-row">
                <a className="social-btn" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
                {/* Instagram / YouTube / TikTok hesapları açıldığında buraya gerçek URL'lerle eklenebilir */}
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
              <a href="/future-services#business">Business Advisory</a>
              <a href="/future-services#investment">Investment &amp; Real Estate</a>
              <a href="#contact">Contact Us</a>
              <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
          <div style={{marginTop:'40px',paddingTop:'22px',borderTop:'1px solid rgba(255,250,241,.08)',textAlign:'center',fontSize:'12px'}}>
            © {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}