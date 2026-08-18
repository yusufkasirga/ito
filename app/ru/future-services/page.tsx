import type { Metadata } from 'next';
import { SITE_URL, whatsAppUrl } from '@/lib/config';

// =====================================================
// FUTURE SERVICES (RU) — footer-only entry point.
// Deliberately quieter than the primary journeys.
// =====================================================

export const metadata: Metadata = {
  title: 'Будущие услуги — бизнес- и инвестиционный консалтинг | Itinerary of Türkiye',
  description:
    'Бизнес-консалтинг и поддержка инвестиций и покупки недвижимости в Турции — знакомства, встречи, проверенные объекты и экспертные местные консультации. Доступно по запросу наряду с нашими основными услугами.',
  alternates: { canonical: `${SITE_URL}/ru/future-services` },
  openGraph: {
    title: 'Будущие услуги — Itinerary of Türkiye',
    description:
      'Бизнес-консалтинг и поддержка инвестиций и недвижимости в Турции, доступно по запросу.',
    url: `${SITE_URL}/ru/future-services`,
    siteName: 'Itinerary of Türkiye',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE_URL}/ru` },
    { '@type': 'ListItem', position: 2, name: 'Будущие услуги', item: `${SITE_URL}/ru/future-services` },
  ],
};

export default function FutureServicesPage() {
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #071726; --navy: #081f35; --navy-2: #0c3555;
          --gold: #c9a96a; --ivory: #fffaf1;
          --muted: #647889; --line: rgba(8,31,53,.14);
          --shadow-md: 0 8px 24px rgba(7,23,38,.12);
        }
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,250,241,.95); border-bottom: 1px solid var(--line); backdrop-filter: blur(20px); }
        .nav-inner { max-width: 1240px; margin: 0 auto; height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .brand { text-decoration: none; display: flex; align-items: center; }
        .brand img { height: 77px; width: auto; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover { color: var(--gold); }

        .page { max-width: 760px; margin: 0 auto; padding: 72px 32px 96px; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 54px); color: var(--navy); line-height: 1.05; margin-bottom: 18px; }
        .lede { color: var(--muted); font-size: 16px; line-height: 1.8; margin-bottom: 56px; }
        .lede a { color: var(--gold); font-weight: 700; text-decoration: none; }
        .lede a:hover { text-decoration: underline; }

        .svc { padding: 32px 0; border-top: 1px solid var(--line); }
        .svc h2 { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--navy); margin-bottom: 14px; }
        .svc p { color: #3a4654; font-size: 15.5px; line-height: 1.85; margin-bottom: 14px; }
        .svc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .svc-tag { padding: 5px 13px; background: rgba(201,169,106,.08); color: var(--gold); border: 1px solid rgba(201,169,106,.22); border-radius: 999px; font-size: 11.5px; font-weight: 700; }

        .cta { margin-top: 56px; padding: 32px; border: 1px solid var(--line); border-radius: 20px; background: #fff; }
        .cta h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--navy); margin-bottom: 10px; }
        .cta p { color: var(--muted); font-size: 14px; line-height: 1.7; margin-bottom: 18px; }
        .btn-primary { min-height: 46px; padding: 0 24px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; box-shadow: var(--shadow-md); }

        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }
        .footer a { color: rgba(255,250,241,.6); }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        }
        @media (max-width: 700px) {
          .nav-inner { height: auto; flex-wrap: wrap; padding: 10px 16px; gap: 6px; justify-content: center; }
          .brand img { height: 56px; }
          .nav-links { flex-wrap: wrap; justify-content: center; gap: 12px 16px; }
          .nav-links a { font-size: 13px; }
          .page { padding: 48px 20px 72px; }
        }
      `}</style>

      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/ru"><img src="/logo.png" alt="Itinerary of Türkiye" /></a>
          <nav className="nav-links" aria-label="Primary">
            <a href="/ru/about">О нас</a>
            <a href="/ru/services">Услуги</a>
            <a href="/testimonials">Отзывы</a>
            <a href="/ru#contact">Контакты</a>
                      <a href="/future-services" style={{fontWeight:800, opacity:.85}} aria-label="English version">EN</a>
                      <a href="/de/future-services" style={{fontWeight:800, opacity:.85}} aria-label="Deutsche Version">DE</a>
          </nav>
        </div>
      </header>

      <div className="page">
        <span className="eyebrow">Другие услуги</span>
        <h1>Больше, чем путешествие и лечение.</h1>
        <p className="lede">
          Наши основные направления — <a href="/ru#health">медицинские поездки</a> и <a href="/ru#tourism">частные путешествия по Турции</a>.
          Клиентам, которым нужна поддержка за их пределами, мы также предлагаем по запросу следующие консультационные услуги.
        </p>

        <section className="svc" id="business" aria-labelledby="business-h">
          <h2 id="business-h">Бизнес-консалтинг</h2>
          <p>Турция — процветающий узел международной торговли и инвестиций. Благодаря нашей сети контактов в разных отраслях мы становимся надёжным мостом к продуктивной, успешной деловой поездке — от знакомств и организации встреч до логистики, перевода и знания местных реалий.</p>
          <div className="svc-tags">
            <span className="svc-tag">Деловые знакомства</span>
            <span className="svc-tag">Встречи</span>
            <span className="svc-tag">Перевод</span>
            <span className="svc-tag">Логистика</span>
            <span className="svc-tag">Местная экспертиза</span>
          </div>
        </section>

        <section className="svc" id="investment" aria-labelledby="investment-h">
          <h2 id="investment-h">Инвестиции и недвижимость</h2>
          <p>Рынок недвижимости Турции открывает исключительные возможности для иностранных инвесторов — но ориентироваться в нём без правильного сопровождения непросто. Itinerary of Türkiye даёт вам доступ к проверенным объектам, надёжным застройщикам и экспертным местным консультациям, помогая найти и приобрести идеальную недвижимость с полной уверенностью.</p>
          <p>От космополитичной энергии Стамбула до залитых солнцем побережий Бодрума и Антальи — Турция предлагает исключительный выбор недвижимости для любого типа инвестора и любой мечты.</p>
          <p>Для многих иностранных покупателей главное препятствие — не решение об инвестиции, а первый шаг. Мы даём вам прямой доступ к проверенным предложениям, надёжным застройщикам, а также к опытным юридическим и финансовым консультантам, понимающим потребности международных покупателей.</p>
          <div className="svc-tags">
            <span className="svc-tag">Проверенные объекты</span>
            <span className="svc-tag">Надёжные застройщики</span>
            <span className="svc-tag">Юридические консультации</span>
            <span className="svc-tag">Подбор недвижимости</span>
          </div>
        </section>

        <div className="cta">
          <h3>Заинтересовала одна из этих услуг?</h3>
          <p>Коротко напишите нам, что вам нужно, — и мы честно скажем, сможем ли помочь и как. Пожалуйста, не прикрепляйте к первому сообщению конфиденциальные документы.</p>
          <a className="btn-primary" href={whatsAppUrl('Hello! I would like to ask about your business / investment advisory services.')} target="_blank" rel="noopener noreferrer">Напишите нам в WhatsApp</a>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/ru/privacy" style={{color:'inherit'}}>Конфиденциальность</a> · <a href="/ru/terms" style={{color:'inherit'}}>Условия</a> · <a href="/blogs" style={{color:'inherit'}}>Статьи</a> · <a href="/ru">Главная</a></p>
      </footer>
    </main>
  );
}
