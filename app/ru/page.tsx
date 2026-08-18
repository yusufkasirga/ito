'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { whatsAppUrl } from '@/lib/config';
import Icon from '../components/Icon';
import { track } from '@vercel/analytics';

export default function Home() {
  // Rusça sürüm — <html lang> istemci tarafında ayarlanır

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { document.documentElement.lang = 'ru'; return () => { document.documentElement.lang = 'en'; }; }, []);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  // WCAG 2.2.2 — otomatik hareket duraklatılabilir olmalı; reduced-motion'da hiç başlamaz
  const [motionPaused, setMotionPaused] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMotionPaused(true);
  }, []);
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
    { image: '/images/pexels-2325446-1920x1080.jpg', position: '50% 38%' },
    { image: '/images/pexels-3889742-1920x1080.jpg', position: '65% 45%' },
    { image: '/images/pexels-1549326-800x1200.jpg', position: '50% 45%' },
  ];


  useEffect(() => {
    if (motionPaused) return;
    const timer = setInterval(() => setActiveSlide(p => (p + 1) % heroSlides.length), 4000);
    return () => clearInterval(timer);
  }, [motionPaused, heroSlides.length]);

  const heroTrustQuotes = [
    { name: 'Mark T.', flag: '🇬🇧', text: 'Они сделали всю мою поездку невероятно гладкой — от путешествия до деловых встреч.' },
    { name: 'Alan G.', flag: '🇺🇸', text: 'Это избавило бы меня от многих прошлых ошибок. Превосходный сервис.' },
    { name: 'Pawan K.', flag: '🇮🇳', text: 'Их знание местных реалий и надёжная поддержка позволили мне принимать взвешенные решения.' },
  ];

  useEffect(() => {
    if (motionPaused) return;
    const timer = setInterval(() => setHeroTestimonialIdx(p => (p + 1) % heroTrustQuotes.length), 5000);
    return () => clearInterval(timer);
  }, [motionPaused, heroTrustQuotes.length]);

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
      title: 'Туризм',
      subtitle: 'Культура, путешествия, гастрономия',
      short: 'Турция — страна бесконечных открытий. Частный гид, продуманные маршруты, подбор отелей или любая другая помощь в путешествии — мы берём всё на себя.',
      full: 'Просто напишите нам по телефону, в WhatsApp или по электронной почте — остальное мы сделаем сами. От частных экскурсий и полностью продуманных маршрутов по нескольким городам до люксовых отелей и уникальных локальных впечатлений: мы сделаем вашу поездку в Турцию максимально персональной.',
      href: '#tourism'
    },
    {
      title: 'Медицинский туризм',
      subtitle: 'Лечение, доступ, восстановление',
      short: 'Найти подходящего врача или клинику за рубежом бывает непросто. Мы связываем вас с опытными аккредитованными специалистами в клиниках, соответствующих вашему бюджету.',
      full: 'Мы снимаем с вас эту нагрузку — и связываем вас с опытными аккредитованными специалистами в клиниках под ваш бюджет, чтобы вы могли полностью сосредоточиться на здоровье и восстановлении. От пересадки волос и стоматологии до эстетической хирургии — мы сопровождаем вас на каждом шаге.',
      href: '#health'
    },
  ], []);

  const tourismVisuals = [
    {
      title: 'История и наследие',
      short: 'Турция — не просто направление, а живой музей. От руин Эфеса до величия Айя-Софии — каждый уголок рассказывает свою историю.',
      full: 'От античных руин Эфеса и византийского великолепия Айя-Софии до османской роскоши дворца Топкапы и сказочных пейзажей Каппадокии: каждый уголок этой страны рассказывает свою историю.\n\nПутешествовать по Турции — значит путешествовать во времени, там, где Восток встречается с Западом и великие империи оставили свой след.\n\nМы отвезём вас туда.',
      image: '/images/pexels-3889742-800x1000.jpg'
    },
    {
      title: 'Природа и активный отдых',
      short: 'Воздушные шары парят над долинами Каппадокии. Бирюзовые берега тянутся вдоль Эгейского и Средиземного морей — всё это ждёт вас.',
      full: 'Природа Турции столь же драматична, сколь и разнообразна. На рассвете воздушные шары парят над фантастическими долинами Каппадокии, а бирюзовое побережье тянется на тысячи километров вдоль Эгейского и Средиземного морей.\n\nПройдите легендарную Ликийскую тропу, откройте укромные бухты на традиционной гулете или встаньте у белоснежных террас Памуккале — природа Турции не оставит вас равнодушным.',
      image: '/images/pexels-2419278-800x1200.jpg'
    },
    {
      title: 'Еда и напитки',
      short: 'Турецкая кухня — одна из великих кулинарных традиций мира. От шипящих кебабов до нежной пахлавы — каждое блюдо несёт в себе столетия традиций.',
      full: 'Турецкая кухня — одна из великих кулинарных традиций мира, и еда здесь никогда не бывает просто приёмом пищи — это событие. От шипения свежеприготовленных кебабов до тонких слоёв пахлавы — каждое блюдо несёт в себе столетия традиций.\n\nПриезжайте голодными. Уезжайте вдохновлёнными.',
      image: '/images/pexels-3338497-800x1200.jpg'
    },
    {
      title: 'Искусство и культура',
      short: 'Турция — полотно бесчисленных цивилизаций. Античные мозаики соседствуют с современными галереями, а улицы полны ремесленного искусства.',
      full: 'Турция — полотно бесчисленных цивилизаций: греки, римляне, византийцы, сельджуки и османы оставили культурное наследие, которое живо по сей день.\n\nПогрузитесь в ритм церемонии дервишей. Пройдитесь по Гранд-базару и увидьте ремесло, передаваемое из поколения в поколение, — расписную керамику, искусные ковры, изящную каллиграфию.\n\nПриезжайте любопытными. Уезжайте вдохновлёнными.',
      image: '/images/pexels-1549326-800x1200.jpg'
    },
  ];

  const healthCategories = [
    {
      title: 'Пересадка волос',
      badge: 'Проверенные клиники-партнёры',
      desc: 'Ведущие мировые техники FUE и DHI. Естественный, стойкий результат.',
      items: ['Hair Transplant', 'Beard & Mustache', 'Eyebrow Restoration'],
      image: '/images/pexels-2076930-700x900.jpg',
    },
    {
      title: 'Стоматология',
      badge: 'Проверенные клиники-партнёры',
      desc: 'Виниры, импланты и Hollywood Smile — точный, предсказуемый результат.',
      items: ['Hollywood Smile', 'Veneers', 'Dental Implants'],
      image: '/images/pexels-3779709-700x900.jpg',
    },
    {
      title: 'Эстетическая хирургия',
      badge: 'Проверенные специалисты',
      desc: 'Точные результаты у пластических хирургов с международным признанием.',
      items: ['Rhinoplasty', 'Facelift', 'Liposuction', 'Breast Augmentation'],
      image: '/images/pexels-3764013-700x900.jpg',
    },
  ];

  const standardCriteria = [
    { title: 'Отбор', text: 'Мы сотрудничаем не со всеми. Партнёры отбираются по качеству, надёжности, коммуникации и соответствию задаче.' },
    { title: 'Проверка', text: 'Лицензии, операционная готовность, качество ответов и прозрачность проверяются до любой рекомендации.' },
    { title: 'Ясность', text: 'Мы объясняем, что известно, что требует проверки и где начинается и заканчивается наша консультационная ответственность.' },
    { title: 'Конфиденциальность', text: 'Медицинские документы, инвестиционный контекст и семейные детали поездки обрабатываются только по контролируемым, согласованным каналам.' },
    { title: 'Сопровождение', text: 'Мы сопровождаем вас на этапах планирования, приёмов, поездки, перевода и координации восстановления.' },
    { title: 'Без гарантий', text: 'Мы не обещаем и не подразумеваем медицинских результатов, доходности инвестиций, итогов получения гражданства или обязательств поставщиков.' },
  ];

  const testimonials = [
    {
      name: 'Mark T.',
      location: 'Отзыв клиента (перевод)',
      flag: '🇬🇧',
      category: 'Туризм · Пересадка волос · Бизнес',
      text: 'Огромное спасибо команде Itinerary of Türkiye! Благодаря им вся моя поездка прошла невероятно гладко — от путешествия и пересадки волос до деловых встреч. Всё было отлично организовано; я, честно говоря, не ожидал такого безупречного опыта. Спасибо за профессионализм, заботу и поддержку на протяжении всего процесса.',
      rating: 5,
    },
    {
      name: 'Luke W.',
      location: 'История клиента',
      flag: '🇦🇺',
      category: 'Бизнес-консалтинг',
      text: 'Дорогая команда Itinerary of Türkiye — спасибо, что сделали мою деловую поездку настолько успешной, с несколькими удачными сделками. Вы заслуживаете гораздо большего признания и успеха.',
      rating: 5,
    },
    {
      name: 'Alan G.',
      location: 'История клиента',
      flag: '🇺🇸',
      category: 'Недвижимость',
      text: 'Жаль лишь, что я не знал об Itinerary of Türkiye раньше. Это избавило бы меня от многих сложностей, ошибок и даже случаев мошенничества, с которыми мне, к сожалению, приходилось сталкиваться. Благодаря их консультациям и знанию местного рынка я заключил отличную сделку с недвижимостью, которая была бы невозможна без их поддержки. С удовольствием рекомендую их.',
      rating: 5,
    },
    {
      name: 'Pawan K.',
      location: 'История клиента',
      flag: '🇮🇳',
      category: 'Инвестиционный консалтинг',
      text: 'Инвестировать в Турции без надёжных местных экспертов может быть непросто. Itinerary of Türkiye колоссально помогли мне на всех этапах. Их знание местных реалий, профессионализм и надёжная поддержка позволили мне уверенно принимать взвешенные решения и избежать многих подводных камней.',
      rating: 5,
    },
  ];

  const howItWorks = [
    { step: '01', icon: 'message', title: 'Расскажите, что вам нужно', desc: 'Напишите нам в WhatsApp, по почте или через форму ниже. Живой человек ответит в течение нескольких часов — никаких ботов и автоответов.' },
    { step: '02', icon: 'plan', title: 'Мы составим ваш план', desc: 'Мы изучим ваши задачи, подберём подходящих партнёров и подготовим персональную рекомендацию — включая то, от чего мы вас отговариваем, и почему. Наш гонорар за планирование фиксированный и прозрачный; он вычитается из стоимости поездки, если вы едете с нами.' },
    { step: '03', icon: 'plane', title: 'Приезжайте и наслаждайтесь', desc: 'Мы организуем трансферы, приёмы, перевод и сопровождение на протяжении всего пребывания. Вы наслаждаетесь Турцией — остальное мы берём на себя.' },
  ];

  const faqItems = [
    { q: 'Как вы берёте оплату — и почему консультация платная?', a: 'Первичная консультация и подбор партнёров бесплатны. Мы зарабатываем через нашу проверенную партнёрскую сеть — для вас поиск подходящей клиники, агентства или эксперта не влечёт прямых расходов.' },
    { q: 'Могут ли иностранцы покупать недвижимость в Турции?', a: 'Да. Граждане большинства стран могут приобретать недвижимость в Турции. При правильном юридическом сопровождении процесс несложен — мы связываем вас с опытными юристами по недвижимости и лицензированными агентами, специализирующимися на иностранных покупателях.' },
    { q: 'Сколько длится пересадка волос?', a: 'Большинство операций FUE и DHI занимают 6–8 часов и проводятся за один день. Восстановление быстрое — большинство клиентов улетают домой через 2–3 дня. Окончательный результат виден в течение 12 месяцев.' },
    { q: 'Будет ли сопровождение во время пребывания?', a: 'Разумеется. Мы координируем трансферы из аэропорта, проживание, приёмы в клинике, перевод и последующее наблюдение. На протяжении всего пребывания у вас будет персональный контакт.' },
    { q: 'Как быстро я получу ответ?', a: 'Живой человек ответит в течение нескольких часов — никаких ботов и автоответов. Отправьте запрос в WhatsApp или через форму; мы вернёмся с уточняющими вопросами или конкретной рекомендацией.' },
    { q: 'Можно ли совместить лечение и отдых в Турции?', a: 'Да — это один из самых популярных форматов поездки. Мы выстраиваем экскурсии, дни отдыха и программу для сопровождающих вокруг вашего плана лечения и восстановления — медицинский график всегда в приоритете.' },
    { q: 'Говорите ли вы по-русски?', a: 'Да. Наша команда работает с многоязычными экспертами и переводчиками, поэтому консультации, визиты в клинику и документы могут вестись на удобном вам языке — в том числе на русском.' },
  ];

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 1 && !formData.interest) errors.interest = 'Пожалуйста, выберите';
    if (step === 2 && !formData.timeline) errors.timeline = 'Пожалуйста, выберите';
    if (step === 3) {
      if (!formData.name) errors.name = 'Обязательное поле';
      if (!formData.country) errors.country = 'Обязательное поле';
      if (!formData.contact) errors.contact = 'Обязательное поле';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Structured prefilled message built entirely in the browser.
  // No form data is stored on any server — WhatsApp is the only channel.
  const waLeadMessage = [
    'Личный запрос — Itinerary of Türkiye (RU)',
    `Name: ${formData.name || '-'}`,
    `Country: ${formData.country || '-'}`,
    `Area of interest: ${formData.interest || '-'}`,
    `Timeline: ${formData.timeline || '-'}`,
    `Preferred contact: ${formData.contact || '-'}`,
    formData.email ? `Email: ${formData.email}` : '',
    '',
    'Примечание: я понимаю, что в этом первом сообщении не следует отправлять медицинские заключения, фотографии, паспортные данные и другие конфиденциальные файлы.',
  ].filter(Boolean).join('\n');

  const handleFormSubmit = () => {
    if (validateStep(formStep)) {
      if (formStep < 3) {
        setFormStep(formStep + 1);
      } else {
        setFormSubmitted(true);
        // Open WhatsApp with the structured message (client-side only)
        track('whatsapp_click', { source: 'form_submit', locale: 'ru', path: window.location.pathname });
        window.open(whatsAppUrl(waLeadMessage), '_blank', 'noopener,noreferrer');
      }
    }
  };

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
    <main style={{ background: dm ? '#0a0f1a' : '#fffaf1', color: dm ? '#f0ede8' : '#071726', fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <link rel="preload" as="image" href="/images/pexels-2325446-1920x1080.jpg" fetchPriority="high" />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Inter:wght@400;500;600;700;800;900&display=swap');
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
        .serif { font-family: 'Playfair Display', serif; letter-spacing: -.04em; }
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
        .mobile-menu a { color: #fff; text-decoration: none; font-size: 26px; font-weight: 800; font-family: 'Playfair Display', serif; transition: color 0.2s; }
        .mobile-menu a:hover { color: var(--gold); }
        .mobile-close { position: absolute; top: 24px; right: 28px; background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; }

        /* HERO — TOTAL REDESIGN: mesh gradient + split frame */
        .hero { position: relative; min-height: 92vh; overflow: hidden; color: #fff; display: flex; align-items: center; background: #0d1424; }
        .hero-mesh { position: absolute; inset: -18%; z-index: 0; background:
          radial-gradient(circle at 8% 18%, rgba(232,149,107,.32) 0%, transparent 38%),
          radial-gradient(circle at 88% 12%, rgba(142,216,220,.22) 0%, transparent 42%),
          radial-gradient(circle at 78% 88%, rgba(201,169,106,.26) 0%, transparent 40%),
          radial-gradient(circle at 15% 85%, rgba(15,110,168,.3) 0%, transparent 40%),
          linear-gradient(160deg, #0a1020 0%, #0d1b3a 45%, #0a1020 100%);
          animation: aurora 22s ease-in-out infinite alternate; will-change: transform, filter; }
        @keyframes aurora {
          from { transform: translate3d(-1.5%, -1%, 0) scale(1); filter: hue-rotate(0deg) brightness(1); }
          to { transform: translate3d(1.5%, 1.5%, 0) scale(1.05); filter: hue-rotate(8deg) brightness(1.06); }
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
        .hero-photo-stack { position: relative; height: 640px; perspective: 1500px; transform-style: preserve-3d; }
        .hero-photo-frame { position: absolute; border-radius: 26px; overflow: hidden; box-shadow: 0 40px 90px rgba(0,0,0,.5); }
        .hero-photo-frame img { width: 100%; height: 100%; object-fit: cover; }
        .s3d { left: 50%; top: 50%; width: 78%; height: 92%; transition: transform 1.05s cubic-bezier(.22,.61,.36,1), opacity 1.05s ease, filter 1.05s ease, box-shadow 1.05s ease; will-change: transform; }
        .s3d.pos-center { transform: translate(calc(-50% + var(--px, 0px)), calc(-50% + var(--py, 0px))) translateZ(0) rotateY(0deg); z-index: 3; opacity: 1; }
        .s3d.pos-right { transform: translate(-50%, -50%) translateX(56%) translateZ(-260px) rotateY(-32deg); z-index: 2; opacity: .92; filter: brightness(.5) saturate(.85); cursor: pointer; box-shadow: 0 30px 60px rgba(0,0,0,.45); }
        .s3d.pos-left { transform: translate(-50%, -50%) translateX(-56%) translateZ(-260px) rotateY(32deg); z-index: 2; opacity: .92; filter: brightness(.5) saturate(.85); cursor: pointer; box-shadow: 0 30px 60px rgba(0,0,0,.45); }
        .s3d.pos-back { transform: translate(-50%, -50%) translateZ(-520px) rotateY(0deg); z-index: 1; opacity: 0; pointer-events: none; }
        .s3d.pos-right:hover, .s3d.pos-left:hover { filter: brightness(.7) saturate(1); }
        .hero-photo-badge { position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); z-index: 4; padding: 12px 22px; border-radius: 999px; background: rgba(13,20,36,.85); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(14px); display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 700; color: #fff; white-space: nowrap; box-shadow: 0 12px 30px rgba(0,0,0,.4); }

        .hero-dots { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 3; }
        .hero-dot-hit { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: none; border: none; padding: 0; cursor: pointer; }
        .hero-pause { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-left: 6px; background: rgba(0,0,0,.28); border: 1px solid rgba(255,255,255,.35); border-radius: 50%; color: #fff; font-size: 8px; line-height: 1; cursor: pointer; }
        .hero-pause:hover { background: rgba(0,0,0,.45); }
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
        .pillar-eyebrow { color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; font-size: 11px; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
        .pillar-card h2 { margin: 14px 0 8px; color: ${dm ? '#fff' : 'var(--navy)'}; font-size: 26px; }
        .pillar-short { color: ${dm ? 'rgba(240,237,232,.65)' : '#647889'}; line-height: 1.68; font-size: 14px; flex: 1; margin: 0; }
        .pillar-full { margin-top: 12px; color: ${dm ? 'rgba(240,237,232,.65)' : '#647889'}; line-height: 1.72; font-size: 14px; border-top: 1px solid ${dm ? 'rgba(255,255,255,.08)' : 'rgba(8,31,53,.1)'}; padding-top: 12px; animation: fadeUp 0.3s ease; }

        /* TOURISM */
        .tourism-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin-top: 48px; padding-bottom: 40px; }
        .tourism-grid .t-card:nth-child(even) { margin-top: 38px; }
        .t-card { border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow-lg); cursor: pointer; position: relative; transition: transform .5s cubic-bezier(.22,.61,.36,1), box-shadow .5s ease; }
        .t-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 34px 70px rgba(7,23,38,.35); z-index: 2; }
        .t-glow { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0; transform: scale(1.5); transition: opacity .5s ease, transform .5s ease; background: radial-gradient(circle at 28% 18%, rgba(201,169,106,.4), transparent 62%); }
        .t-card:hover .t-glow { opacity: 1; transform: scale(1); }
        .t-img { height: 480px; position: relative; }
        .t-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.72) saturate(1.06) sepia(.05); transition: filter 0.3s; }
        .t-card:hover .t-img img { filter: brightness(.88) saturate(1.06) sepia(.05); }
        .t-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px 22px 20px; background: linear-gradient(180deg, transparent, rgba(0,0,0,.88)); color: #fff; }
        .t-label h3 { margin: 0 0 7px; font-size: 20px; font-weight: 900; font-family: 'Playfair Display', serif; }
        .t-label p { margin: 0 0 12px; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,.8); }
        .t-overlay { position: absolute; inset: 0; z-index: 3; padding: 22px; background: rgba(7,23,38,.94); backdrop-filter: blur(6px); color: rgba(255,250,241,.85); font-size: 13px; line-height: 1.75; overflow-y: auto; animation: fadeUp .3s ease; border-radius: var(--r); }
        .t-overlay h3 { margin: 0 0 12px; font-family: 'Playfair Display', serif; font-size: 19px; color: #fff; }

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
        .health-stat-num { display: block; font-size: 30px; font-weight: 900; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; font-family: 'Playfair Display', serif; line-height: 1; margin-bottom: 6px; }
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

        /* BRAND COLOR GRADE — çekimlere kadar stok görselleri markaya yaklaştırır */
        .guide-img img, .about-img img, .hero-photo-frame img, .health-visual img, .health-bento img { filter: saturate(1.06) contrast(1.03) sepia(0.05); }

        /* GUIDES */
        .guides-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 36px; }
        .guide-card { display: flex; flex-direction: column; text-decoration: none; border-radius: var(--r); overflow: hidden; background: ${dm ? 'rgba(255,255,255,.04)' : '#fff'}; border: 1px solid ${dm ? 'rgba(255,255,255,.09)' : 'rgba(8,31,53,.12)'}; transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
        .guide-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: rgba(201,169,106,.5); }
        .guide-img { height: 190px; overflow: hidden; }
        .guide-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
        .guide-card:hover .guide-img img { transform: scale(1.05); }
        .guide-body { padding: 20px 22px 24px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .guide-cat { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; }
        .guide-body h3 { margin: 0; font-family: 'Playfair Display', serif; font-size: 18px; line-height: 1.3; color: ${dm ? '#fff' : 'var(--navy)'}; }
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
        .hiw-step { font-size: 11px; font-weight: 900; letter-spacing: .18em; color: ${dm ? 'var(--gold)' : 'var(--gold-ink)'}; margin-bottom: 12px; }
        .hiw-icon { font-size: 36px; margin-bottom: 16px; }
        .hiw-title { font-size: 18px; font-weight: 900; margin: 0 0 10px; }
        .hiw-desc { font-size: 14px; line-height: 1.7; margin: 0; }

        /* TESTIMONIALS */
        .testi-section { background: #fdf6ec; }
        .testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 48px; align-items: stretch; }
        .testi-card { padding: 28px; border-radius: 24px; background: #fff; border: 1px solid rgba(201,169,106,.15); box-shadow: 0 4px 24px rgba(7,23,38,.06); transition: all 0.3s; position: relative; overflow: hidden; }
        .testi-card::before { content: '“'; position: absolute; top: -18px; right: 14px; font-family: 'Playfair Display', serif; font-size: 130px; line-height: 1; color: rgba(201,169,106,.14); pointer-events: none; }
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
        .hero-split > div:first-child > * { opacity: 0; animation: heroIn .95s cubic-bezier(.22,.61,.36,1) both; }
        .hero-split > div:first-child > *:nth-child(1) { animation-delay: .1s; }
        .hero-split > div:first-child > *:nth-child(2) { animation-delay: .22s; }
        .hero-split > div:first-child > *:nth-child(3) { animation-delay: .34s; }
        .hero-split > div:first-child > *:nth-child(4) { animation-delay: .46s; }
        .hero-split > div:first-child > *:nth-child(5) { animation-delay: .58s; }
        @keyframes heroIn { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
        .hero-photo-stack { opacity: 0; animation: heroIn 1.1s cubic-bezier(.22,.61,.36,1) .35s both; }

        html { scroll-behavior: smooth; }
        *:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 4px; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: ${dm ? '#0a0f1a' : '#f3ede2'}; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(var(--navy-2), var(--navy)); border-radius: 999px; border: 2px solid ${dm ? '#0a0f1a' : '#f3ede2'}; }
        ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

        .nav { position: fixed; transition: background .4s ease, box-shadow .4s ease, backdrop-filter .4s ease; }
        .nav.nav-scrolled { background: rgba(8,20,38,.82); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 1px 0 rgba(201,169,106,.25), 0 14px 40px rgba(0,0,0,.28); }

        .t-img img { filter: brightness(.72) saturate(1.07) contrast(1.03); }
        .s3d.pos-center img { filter: saturate(1.06) contrast(1.03); }
        .about-img img { filter: saturate(1.05) contrast(1.02); }

        .testi-card { position: relative; }
        .testi-card::before { content: '“'; position: absolute; top: 6px; right: 20px; font-family: 'Playfair Display', serif; font-size: 84px; line-height: 1; color: rgba(201,169,106,.16); pointer-events: none; }
        .testi-card:hover { transform: translateY(-5px); box-shadow: 0 18px 48px rgba(7,23,38,.12); border-color: rgba(201,169,106,.4); }

        .pillar-card:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(7,23,38,.14); border-color: rgba(201,169,106,.5); }
        .faq-item { transition: border-color .3s ease, box-shadow .3s ease; }
        .faq-item:hover { border-color: rgba(201,169,106,.45); box-shadow: 0 8px 26px rgba(7,23,38,.07); }

        .form-section { background-image: radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(135deg, rgba(7,23,38,.96), rgba(12,53,85,.92)); background-size: 24px 24px, 100% 100%; }

        /* VISUAL LAYER — GoTürkiye-inspired editorial motion */
        ::selection { background: rgba(201,169,106,.35); }
        .scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 1000; background: linear-gradient(90deg, var(--gold), #e6cf9a); transform: scaleX(0); transform-origin: left; pointer-events: none; }
        .rv { opacity: 0; transform: translateY(28px); transition: opacity .85s cubic-bezier(.22,.61,.36,1), transform .85s cubic-bezier(.22,.61,.36,1); }
        .rv-in { opacity: 1; transform: none; }
        .s3d.pos-center img { animation: kenburns 9s ease-in-out infinite alternate; }
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
          .t-img { height: 430px; }
          .health-header-row { flex-direction: column; align-items: flex-start; }
          .health-stat-badge { text-align: left; width: 100%; }
          .hero-split { grid-template-columns: 1fr; gap: 48px; padding: 120px 0 50px; text-align: center; }
          .hero-eyebrow { justify-content: center; }
          .hero-copy { margin-left: auto; margin-right: auto; }
          .hero-btns { justify-content: center; }
          .hero-photo-stack { height: 420px; max-width: 520px; margin: 0 auto; perspective: none; }
          .s3d { width: 100%; height: 100%; border-radius: 22px; }
          .s3d.pos-left, .s3d.pos-right { opacity: 0; pointer-events: none; transform: translate(-50%, -50%) scale(.96); }
          .s3d.pos-center { transform: translate(-50%, -50%); }
          .hero-photo-badge { position: relative; bottom: auto; left: auto; transform: none; margin-top: 16px; display: inline-flex; font-size: 11.5px; }
        }
        @media (max-width: 840px) {
          .testi-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 16px; padding: 4px 2px 18px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .testi-grid::-webkit-scrollbar { display: none; }
          .testi-card { min-width: 86%; scroll-snap-align: center; }
          .testi-card:first-child { min-width: 86%; }
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
          .hero-photo-stack { height: 340px; max-width: 460px; }
        }
        @media (max-width: 1024px) { .tourism-grid { grid-template-columns: 1fr 1fr; } .tourism-grid .t-card:nth-child(even) { margin-top: 26px; } }
        @media (max-width: 700px) { .concierge { display: none; } }
        @media (max-width: 640px) {
          .t-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
          .t-glow { display: none; }
          .tourism-grid { grid-template-columns: 1fr; gap: 18px; padding-bottom: 8px; }
          .tourism-grid .t-card:nth-child(even) { margin-top: 0; }
          .t-img { height: 360px; }
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
      <div className="concierge">✓ Ответ в течение нескольких часов</div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : 'closed'}`}>
        <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}><Icon name="close" size={22} /></button>
        <a href="/ru/about" onClick={() => setMobileMenuOpen(false)}>О нас</a>
        <div style={{textAlign:'center'}}>
          <a href="/ru/services" onClick={(e) => { e.preventDefault(); setMobileServicesOpen(!mobileServicesOpen); }}>
            Услуги {mobileServicesOpen ? '▲' : '▼'}
          </a>
          {mobileServicesOpen && (
            <div style={{display:'flex',flexDirection:'column',gap:'14px',marginTop:'14px'}}>
              <a href="#tourism" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'17px',color:'rgba(255,255,255,.75)'}}>Туризм</a>
              <a href="#health" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'17px',color:'rgba(255,255,255,.75)'}}>Медицинский туризм</a>
            </div>
          )}
        </div>
        <a href="/" onClick={() => setMobileMenuOpen(false)} style={{fontWeight:800}}>EN</a>
        <a href="/de" onClick={() => setMobileMenuOpen(false)} style={{fontWeight:800}}>DE</a>
        <a href="/testimonials" onClick={() => setMobileMenuOpen(false)}>Отзывы</a>
        <a href="/#contact" onClick={() => setMobileMenuOpen(false)}>Контакты</a>
        <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{color:'#25D366'}}>WhatsApp</a>
      </div>

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/"><img loading="lazy" src="/logo.png" alt="Itinerary of Türkiye" /></a>
          <nav className="nav-links">
            <a href="/ru/about">О нас</a>
            <div className="nav-dropdown" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)} onFocus={() => setServicesOpen(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false); }}>
              <a href="/ru/services">Услуги</a>
              {servicesOpen && (
                <div className="nav-dropdown-menu">
                  <a href="#tourism">Туризм</a>
                  <a href="#health">Медицинский туризм</a>
                </div>
              )}
            </div>
            <a href="/testimonials">Отзывы</a>
            <a href="/#contact">Контакты</a>
            <button className="dm-toggle" onClick={() => setDarkMode(!dm)} title="Toggle dark mode"><Icon name={dm ? 'sun' : 'moon'} size={16} /></button>
                      <a href="/" style={{fontWeight:800, opacity:.85}} aria-label="English version">EN</a>
                      <a href="/de" style={{fontWeight:800, opacity:.85}} aria-label="Deutsche Version">DE</a>
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <button className="dm-toggle" onClick={() => setDarkMode(!dm)} style={{display:'none'}}><Icon name={dm ? 'sun' : 'moon'} size={16} /></button>
            <button className="nav-toggle" onClick={() => setMobileMenuOpen(true)}><Icon name="menu" size={22} /></button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-mesh" />
        <div className="hero-grain" />
        <div className="hero-split">
          <div>
            <p className="hero-eyebrow">Мы на связи прямо сейчас</p>
            <h1 className="serif">Турция ждёт вас.<em>Мы всё организуем.</em></h1>
            <p className="hero-copy">Ваш независимый консультант по медицинским поездкам и частным путешествиям по Турции. Мы проверяем клиники, планируем поездку и остаёмся рядом — оплату мы получаем только от вас — поэтому у каждой рекомендации одна причина: она подходит именно вам.</p>
            <div className="hero-btns">
              <a className="hero-pill hero-pill-primary" href="#tourism"><Icon name="landmark" size={17} /> Туризм</a>
              <a className="hero-pill" href="#health"><Icon name="medical" size={17} /> Медицинский туризм</a>
            </div>
            <div className="hero-trust-strip">
              <div className="trust-strip-item">✓ Verified by ITO</div>
              <div className="trust-strip-divider" />
              <div className="trust-strip-item"><span className="trust-live-dot" />Ответ в течение нескольких часов — живые люди, а не боты</div>
              <div className="trust-strip-divider" />
              <div className="trust-strip-item">{heroTrustQuotes[heroTestimonialIdx].flag} «{heroTrustQuotes[heroTestimonialIdx].text.slice(0, 38)}…»</div>
            </div>
          </div>

          <div className="hero-photo-stack">
            {heroSlides.map((sl, i) => {
              const n = heroSlides.length;
              const off = (i - activeSlide + n) % n;
              const pos = off === 0 ? 'pos-center' : off === 1 ? 'pos-right' : off === n - 1 ? 'pos-left' : 'pos-back';
              const isCenter = pos === 'pos-center';
              return (
                <div
                  key={i}
                  className={`hero-photo-frame s3d ${pos}`}
                  style={isCenter ? ({ '--px': `${mouseParallax.x * 6}px`, '--py': `${mouseParallax.y * 4}px` } as React.CSSProperties) : undefined}
                  onClick={!isCenter ? () => setActiveSlide(i) : undefined}
                  aria-hidden={!isCenter}
                >
                  <img src={sl.image} alt={isCenter ? 'Türkiye — travel destinations' : ''} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} style={{objectPosition: sl.position || '50% 50%'}} />
                </div>
              );
            })}
            <div className="hero-photo-badge">Каппадокия · Стамбул · Эгейское побережье</div>
          </div>
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} aria-label={`Слайд ${i + 1}`} aria-current={i === activeSlide} className="hero-dot-hit" onClick={() => setActiveSlide(i)}>
              <span className={`hero-dot ${i === activeSlide ? 'on' : ''}`} />
            </button>
          ))}
          <button type="button" className="hero-pause" aria-label={motionPaused ? 'Воспроизвести слайд-шоу' : 'Приостановить слайд-шоу'} aria-pressed={motionPaused} onClick={() => setMotionPaused(v => !v)}>
            {motionPaused ? '▶' : '❚❚'}
          </button>
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
                  {isOpen ? '▲ Свернуть' : '▼ Подробнее'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOURISM */}
      <section className="section" id="tourism" style={{background: dm ? '#0a0f1a' : '#fffaf1'}}>
        <div className="container">
          <span className="eyebrow">Туристический консалтинг</span>
          <h2 className="section-title serif">Больше, чем тур. <span style={{color:'var(--gold)'}}>Откройте Турцию.</span></h2>
          <p className="section-copy">Четыре измерения открытий — культура, природа, гастрономия и искусство. Для путешественников, которые ценят аутентичные, по-настоящему личные впечатления.</p>
          <div className="tourism-grid">
              {tourismVisuals.map((t) => {
                const isOpen = expandedTourism === t.title;
                return (
                  <div key={t.title} className="t-card">
                    <div className="t-glow" />
                    <div className="t-img">
                      <img loading="lazy" src={t.image} alt={t.title} />
                      <div className="t-label">
                        <h3>{t.title}</h3>
                        <p>{t.short}</p>
                        <button className="read-btn" onClick={() => setExpandedTourism(isOpen ? null : t.title)}>
                          {isOpen ? '▲ Свернуть' : '▼ Подробнее'}
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="t-overlay">
                        <h3>{t.title}</h3>
                        {t.full.split('\n\n').map((par, i) => <p key={i} style={{margin:'0 0 10px'}}>{par}</p>)}
                        <button className="read-btn" style={{marginTop:'8px'}} onClick={() => setExpandedTourism(null)}>▲ Закрыть</button>
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
            <span className="eyebrow">Кто мы</span>
            <h2 className="section-title serif">Ваш надёжный проводник в Турции.</h2>
            <p className="section-copy">Itinerary of Türkiye создан с одной целью: чтобы каждый гость этой удивительной страны нашёл именно то, что ищет.</p>
            <p style={{color: dm ? 'rgba(240,237,232,.65)' : '#647889', fontSize:'15px', lineHeight:'1.8', marginBottom:'28px'}}>
              Мы знаем, каким непростым бывает пребывание в чужой стране. Поэтому мы видим себя мостом: связываем вас с местами, услугами и впечатлениями, которые соответствуют вашим потребностям, — без неопределённости самостоятельного пути.
            </p>
            <a className="btn btn-primary" href="/ru/about">Подробнее о нас</a>
            <div className="about-features">
              <div className="about-feat"><h4><Icon name="landmark" size={15} style={{marginRight:6,verticalAlign:-2}} />Путешествия и туризм</h4><p>Продуманные маршруты и отдых</p></div>
              <div className="about-feat"><h4><Icon name="medical" size={15} style={{marginRight:6,verticalAlign:-2}} />Медицина и эстетика</h4><p>Консультации и координация лечения</p></div>
              <div className="about-feat"><h4><Icon name="briefcase" size={15} style={{marginRight:6,verticalAlign:-2}} />Деловые поездки</h4><p>Комплексная поддержка для бизнеса</p></div>
              <div className="about-feat"><h4><Icon name="globe" size={15} style={{marginRight:6,verticalAlign:-2}} />Многоязычная команда</h4><p>Эксперты, говорящие на многих языках</p></div>
            </div>
          </div>
          <div className="about-img">
            <img loading="lazy" src="/images/pexels-3889742-800x1000.jpg" alt="Hot air balloons over Cappadocia at sunset, Türkiye" />
          </div>
        </div>
      </section>

      {/* STANDARDS */}
      <section className="section" style={{background: dm ? '#0a0f1a' : '#fffaf1'}}>
        <div className="container std-grid">
          <aside className="std-card">
            <span className="eyebrow">Verified by ITO</span>
            <h2 className="serif">Как мы отбираем.</h2>
            <p>Все наши партнёрские клиники и поставщики соответствуют стандарту Verified by ITO — мы проверяем лицензии, качество лечения, коммуникацию и прозрачность, прежде чем рекомендовать их.</p>
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
              <span className="eyebrow">Медицинский туризм</span>
              <h2 className="section-title serif" style={{color:'#fff'}}>Правильный врач. <span style={{color:'var(--aqua)'}}>Правильная клиника.</span></h2>
              <p className="section-copy" style={{color:'rgba(255,250,241,.65)', marginBottom: 0}}>Мы связываем вас с аккредитованными специалистами в клиниках под ваш бюджет — чтобы вы могли полностью сосредоточиться на здоровье.</p>
            </div>
            <div className="health-stat-badge">
              <span className="health-stat-num">Проверено</span>
              <span className="health-stat-label">Клиники-партнёры проверяются на<br/>лицензии, качество и прозрачность</span>
            </div>
          </div>

          <div className="health-bento">
            <div className="health-photo-card health-bento-main">
              <div className="health-photo-wrap">
                <img loading="lazy" src={healthCategories[0].image} alt={healthCategories[0].title} />
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
                  <img loading="lazy" src={healthCategories[1].image} alt={healthCategories[1].title} />
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
                  <img loading="lazy" src={healthCategories[2].image} alt={healthCategories[2].title} />
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
            <a className="btn btn-primary" href="#contact">Бесплатная первая консультация</a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{background: dm ? '#111827' : '#fff'}}>
        <div className="container">
          <span className="eyebrow">Простой процесс</span>
          <h2 className="section-title serif">Как <span style={{color:'var(--gold)'}}>это работает.</span></h2>
          <p className="section-copy">Три простых шага. Одна преданная команда. Ноль стресса. Вы сосредоточены на Турции — мы позаботимся обо всём остальном.</p>
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
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{background: dm ? '#0a0f1a' : '#fdf6ec'}}>
        <div className="container">
          <span className="eyebrow">Отзывы клиентов</span>
          <h2 className="section-title serif">Что говорят <span style={{color:'var(--gold)'}}>наши клиенты.</span></h2>
          <p className="section-copy">Реальные люди, реальный опыт. От Дубая до Лондона, от Эр-Рияда до Нью-Йорка — вот что они говорят о работе с нами.</p>
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
                <p className="testi-text" style={{color: dm ? 'rgba(240,237,232,.75)' : '#4a5568'}}>«{t.text}»</p>
                <div className="testi-stars">{'★'.repeat(t.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container" style={{textAlign:'center'}}>
          <span className="eyebrow">Частые вопросы</span>
          <h2 className="section-title serif" style={{margin:'16px auto 18px'}}>Часто задаваемые <span style={{color:'var(--gold)'}}>вопросы</span></h2>
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
            <span className="eyebrow">Личный запрос</span>
            <h2 className="section-title serif" style={{color:'#fff'}}>Начните своё путешествие.</h2>
            <p className="section-copy" style={{color:'rgba(255,250,241,.68)'}}>Расскажите, что вам нужно в Турции. Мы всё проверим, уточним детали, порекомендуем правильный путь и сопроводим вас на всех этапах.</p>
            <p style={{color:'rgba(255,250,241,.55)', fontSize:'12.5px', lineHeight:'1.7', maxWidth:'420px', margin:'0 0 16px', padding:'12px 16px', border:'1px solid rgba(255,250,241,.15)', borderRadius:'12px'}}>
              <Icon name="lock" size={15} style={{marginRight:6,verticalAlign:-2}} />Пожалуйста, <strong>не</strong> отправляйте в этом первом запросе медицинские заключения, фотографии, паспортные данные или платёжные реквизиты. Как только мы свяжемся, всё конфиденциальное переведём в защищённый канал.
            </p>
            <a className="hero-pill" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{marginTop:'8px',display:'inline-flex'}}><Icon name="whatsapp" size={17} /> Напишите нам в WhatsApp</a>
          </div>
          <form className="form-box" onSubmit={e => e.preventDefault()}>
            {!formSubmitted ? (
              <>
                <div className="form-prog"><div className="form-bar" style={{width:`${formStep*33.33}%`}} /></div>
                {formStep === 1 && (
                  <div>
                    <div className="form-ttl">Что приводит вас в Турцию?</div>
                    <div className="field">
                      <label>Сфера интереса *</label>
                      <select value={selectedPath} onChange={e => { setSelectedPath(e.target.value); setFormData({...formData, interest: e.target.value}); }}>
                        <option value="">Выберите</option>
                        <option>Туризм</option><option>Медицинский туризм</option>
                        <option>Инвестиции / Недвижимость</option><option>Бизнес</option><option>Другое</option>
                      </select>
                      {formErrors.interest && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.interest}</span>}
                    </div>
                  </div>
                )}
                {formStep === 2 && (
                  <div>
                    <div className="form-ttl">Когда планируете поездку?</div>
                    <div className="field">
                      <label>Сроки *</label>
                      <select value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}>
                        <option value="">Выберите</option>
                        <option>В течение 2 недель</option><option>1–2 месяца</option>
                        <option>3–6 месяцев</option><option>Пока просто интересуюсь</option>
                      </select>
                      {formErrors.timeline && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.timeline}</span>}
                    </div>
                  </div>
                )}
                {formStep === 3 && (
                  <div>
                    <div className="form-ttl">Как с вами связаться?</div>
                    <div className="field" style={{marginBottom:'12px'}}>
                      <label>Ваше имя *</label>
                      <input type="text" placeholder="Имя и фамилия" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      {formErrors.name && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.name}</span>}
                    </div>
                    <div className="f-row">
                      <div className="field">
                        <label>Страна *</label>
                        <input type="text" placeholder="Россия, Казахстан, ОАЭ..." value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                        {formErrors.country && <span style={{color:'#ff6b6b',fontSize:'11px'}}>{formErrors.country}</span>}
                      </div>
                      <div className="field">
                        <label>Способ связи *</label>
                        <select value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})}>
                          <option value="">Выберите</option>
                          <option>Эл. почта</option><option>WhatsApp</option>
                          <option>Телефонный звонок</option><option>Видеозвонок</option>
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
                  {formStep > 1 && <button type="button" className="btn" style={{background:'rgba(255,255,255,.12)',color:'#fff',minHeight:'48px',padding:'0 20px',fontSize:'13px'}} onClick={() => setFormStep(formStep-1)}>Назад</button>}
                  <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>{formStep < 3 ? 'Далее →' : 'Отправить запрос'}</button>
                </div>
              </>
            ) : (
              <div className="form-success">
                <h3>✓ Запрос подготовлен</h3>
                <p>WhatsApp должен был открыться с вашим готовым сообщением. На наших серверах ничего не сохраняется — ваши данные передаются только в этом сообщении.</p>
                <a
                  className="btn btn-primary"
                  style={{marginTop:'18px', background:'#25D366', minHeight:'48px'}}
                  href={whatsAppUrl(waLeadMessage)}
                  data-wa-source="form_reopen"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Icon name="whatsapp" size={17} /> Открыть WhatsApp ещё раз
                </a>
                <p style={{marginTop:'14px', fontSize:'11.5px', color:'rgba(255,250,241,.55)'}}>Примечание: пожалуйста, не прикрепляйте к этому первому сообщению медицинские заключения, фотографии или документы, удостоверяющие личность.</p>
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
              <a href="#top"><img loading="lazy" src="/logo.png" alt="Itinerary of Türkiye" style={{height:'72px',width:'auto',filter:'brightness(0) invert(1)',opacity:.9}} /></a>
              <p style={{marginTop:'14px',fontSize:'13px',lineHeight:'1.7',maxWidth:'260px'}}>Координация медицинских поездок и частные путешествия по Турции — консультации по инвестициям и бизнесу по запросу.</p>
              <div className="social-row">
                <a className="social-btn" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" size={17} /></a>
                {/* Instagram / YouTube / TikTok hesapları açıldığında buraya gerçek URL'lerle eklenebilir */}
              </div>
            </div>
            <div>
              <h4>Туризм</h4>
              <a href="#tourism">История и наследие</a>
              <a href="#tourism">Природа и активный отдых</a>
              <a href="#tourism">Еда и напитки</a>
              <a href="#tourism">Искусство и культура</a>
            </div>
            <div>
              <h4>Медицина</h4>
              <a href="#health">Пересадка волос</a>
              <a href="#health">Стоматология</a>
              <a href="#health">Ринопластика</a>
              <a href="#health">Эстетическая хирургия</a>
            </div>
            <div>
              <h4>Другие услуги</h4>
              <a href="/ru/future-services#business">Бизнес-консалтинг</a>
              <a href="/ru/future-services#investment">Инвестиции и недвижимость</a>
              <a href="/blogs">Статьи и гиды</a>
              <a href="#contact">Контакты</a>
              <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
          <div style={{marginTop:'40px',paddingTop:'22px',borderTop:'1px solid rgba(255,250,241,.08)',textAlign:'center',fontSize:'12px'}}>
            © {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/ru/privacy" style={{color:'inherit'}}>Политика конфиденциальности</a> · <a href="/ru/terms" style={{color:'inherit'}}>Условия использования</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
