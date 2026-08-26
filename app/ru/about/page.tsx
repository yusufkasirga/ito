'use client';

export default function AboutPage() {
  const features = [
    {
      icon: '🏛️',
      title: 'Путешествия и туризм',
      desc: 'Продуманные маршруты и отдых по всей Турции',
    },
    {
      icon: '🏥',
      title: 'Медицина и эстетика',
      desc: 'Консультации и координация хирургических и нехирургических процедур',
    },
    {
      icon: '💼',
      title: 'Деловые поездки',
      desc: 'Комплексная поддержка деловых визитов и делегаций',
    },
    {
      icon: '🌐',
      title: 'Многоязычная команда',
      desc: 'Эксперты, говорящие на многих языках — в том числе на русском',
    },
  ];

  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #071726; --navy: #081f35; --navy-2: #0c3555;
          --gold: #c9a96a; --aqua: #8ed8dc; --ivory: #fffaf1;
          --muted: #647889; --line: rgba(8,31,53,.14);
          --shadow-sm: 0 2px 8px rgba(7,23,38,.08);
          --shadow-md: 0 8px 24px rgba(7,23,38,.12);
          --shadow-lg: 0 20px 60px rgba(7,23,38,.16);
        }
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,250,241,.95); border-bottom: 1px solid var(--line); backdrop-filter: blur(20px); }
        .nav-inner { max-width: 1240px; margin: 0 auto; height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .brand { text-decoration: none; display: flex; align-items: center; }
        .brand img { height: 84px; width: 84px; object-fit: contain; background: #fffdf7; border-radius: 50%; padding: 6px; box-shadow: 0 2px 12px rgba(0,0,0,.22); }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--gold); }
        .btn-primary { min-height: 44px; padding: 0 22px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.3s; box-shadow: var(--shadow-md); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

        /* HERO */
        .hero { background: linear-gradient(135deg, #071726 0%, #0c3555 100%); color: #fff; padding: 80px 0 70px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(142,216,220,.12), transparent 40%); }
        .hero-inner { max-width: 1240px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 1; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(42px, 7vw, 90px); line-height: .88; color: #fff; margin-bottom: 24px; }
        .hero h1 span { color: var(--aqua); }
        .hero p { max-width: 620px; color: rgba(255,250,241,.75); font-size: 17px; line-height: 1.8; }

        /* CONTENT */
        .content { max-width: 1240px; margin: 0 auto; padding: 80px 32px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .section-text p { color: var(--muted); font-size: 16px; line-height: 1.85; margin-bottom: 20px; }
        .section-text p:last-child { margin-bottom: 0; }

        /* IMAGE */
        .about-image { border-radius: 28px; overflow: hidden; box-shadow: var(--shadow-lg); height: 520px; }
        .about-image img { width: 100%; height: 100%; object-fit: cover; }

        /* FEATURES GRID */
        .features-section { background: linear-gradient(135deg, var(--navy), var(--navy-2)); padding: 80px 0; }
        .features-inner { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
        .features-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 56px); color: #fff; margin: 16px 0 48px; line-height: 1; }
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .feature-card { padding: 28px; border: 1px solid rgba(255,250,241,.12); border-radius: 20px; background: rgba(255,255,255,.06); transition: all 0.3s; }
        .feature-card:hover { background: rgba(255,255,255,.1); border-color: rgba(201,169,106,.3); transform: translateY(-4px); }
        .feature-icon { font-size: 32px; margin-bottom: 16px; }
        .feature-title { color: #fff; font-size: 16px; font-weight: 900; margin-bottom: 8px; }
        .feature-desc { color: rgba(255,250,241,.65); font-size: 13px; line-height: 1.6; }

        /* CTA */
        .cta-section { padding: 80px 0; text-align: center; background: #fff; }
        .cta-inner { max-width: 640px; margin: 0 auto; padding: 0 32px; }
        .cta-inner h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 48px); color: var(--navy); margin-bottom: 16px; }
        .cta-inner p { color: var(--muted); font-size: 16px; line-height: 1.75; margin-bottom: 32px; }

        /* FOOTER */
        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }

        @media (max-width: 900px) {
          .two-col { grid-template-columns: 1fr; gap: 40px; }
          .about-image { height: 340px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .nav-links { gap: 16px; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr; }
          .hero h1 { font-size: 42px; }
        }
        @media (max-width: 700px) {
          .nav-inner { height: auto; flex-wrap: wrap; padding: 10px 16px; gap: 6px; justify-content: center; }
          .brand img { height: 62px; width: 62px; padding: 5px; }
          .nav-links { flex-wrap: wrap; justify-content: center; gap: 12px 16px; }
          .nav-links a { font-size: 13px; }
        }
        a:focus-visible, button:focus-visible { outline: 3px solid #8ed8dc; outline-offset: 2px; border-radius: 6px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/ru">
            <img src="/logo.png" alt="Itinerary of Türkiye" />
          </a>
          <nav className="nav-links">
            <a href="/ru/about" className="active">О нас</a>
            <a href="/ru/services">Услуги</a>
            <a href="/testimonials">Отзывы</a>
            <a href="/ru#contact">Контакты</a>
            <a className="btn-primary" href="/ru#contact">Связаться с нами</a>
                      <a href="/about" style={{fontWeight:800, opacity:.85}} aria-label="English version">EN</a>
                      <a href="/de/about" style={{fontWeight:800, opacity:.85}} aria-label="Deutsche Version">DE</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Кто мы</div>
          <h1>Ваш надёжный проводник<br /><span>в Турции.</span></h1>
          <p>
            Itinerary of Türkiye создан с одной целью: чтобы каждый гость этой удивительной страны нашёл именно то, что ищет.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="content">
        <div className="two-col">
          <div className="section-text">
            <p>
              Отпуск, медицинская или эстетическая процедура, деловая поездка — с момента вашего прибытия мы ваш преданный партнёр на месте.
            </p>
            <p>
              Мы знаем, каким непростым бывает пребывание в чужой стране. Поэтому мы видим себя мостом: связываем вас с местами, услугами и впечатлениями, которые соответствуют вашим потребностям, — без неопределённости самостоятельного пути.
            </p>
            <p>
              Наша команда объединяет специалистов по туризму, медицинской координации и бизнес-поддержке — многоязычных и с глубоким знанием местных реалий. С искренней заботой о вашем комфорте мы сопровождаем вас на каждом шаге.
            </p>
          </div>
          <div className="about-image">
            <img
              src="/images/pexels-3889742-800x1000.jpg"
              alt="Воздушные шары над Каппадокией, Турция"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="features-inner">
          <div className="eyebrow" style={{color: 'var(--gold)'}}>Что мы предлагаем</div>
          <h2 className="features-title">Всё, что вам нужно, —<br />в одном месте.</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Готовы начать своё путешествие?</h2>
          <p>Расскажите, что вам нужно в Турции. Мы всё проверим, порекомендуем правильный путь и сопроводим вас на всех этапах.</p>
          <a className="btn-primary" href="/ru#contact">Запросить консультацию</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/ru/privacy" style={{color:'inherit'}}>Конфиденциальность</a> · <a href="/ru/terms" style={{color:'inherit'}}>Условия</a> · <a href="/ru/future-services" style={{color:'inherit'}}>Другие услуги</a> · <a href="/blogs" style={{color:'inherit'}}>Статьи</a></p>
      </footer>
    </main>
  );
}
