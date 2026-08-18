'use client';

import { useState } from 'react';
import { blogPostsDe as blogPosts } from '../../blogs/blogDataDe';

export default function BlogsPage() {
  const [filter, setFilter] = useState('Alle');
  const categories = ['Alle', ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  const sorted = [...blogPosts].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const featuredFour = sorted.slice(0, 4);
  const rest = sorted.slice(4);
  const visible = filter === 'Alle' ? rest : sorted.filter((p) => p.category === filter);
  const showFeatured = filter === 'Alle';
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #071726; --navy: #081f35; --navy-2: #0c3555;
          --gold: #c9a96a; --ivory: #fffaf1;
          --muted: #647889; --line: rgba(8,31,53,.14);
          --shadow-sm: 0 2px 8px rgba(7,23,38,.08);
          --shadow-md: 0 8px 24px rgba(7,23,38,.12);
          --shadow-lg: 0 20px 50px rgba(7,23,38,.15);
        }
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,250,241,.95); border-bottom: 1px solid var(--line); backdrop-filter: blur(20px); }
        .nav-inner { max-width: 1240px; margin: 0 auto; height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .brand { text-decoration: none; display: flex; align-items: center; }
        .brand img { height: 77px; width: auto; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--gold); }
        .btn-primary { min-height: 44px; padding: 0 22px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.3s; box-shadow: var(--shadow-md); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .hero { position: relative; background: linear-gradient(135deg, #071726 0%, #0c3555 100%); color: #fff; padding: 90px 0 70px; text-align: center; overflow: hidden; }
        .hero::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; }
        .hero::after { content: ''; position: absolute; top: -140px; right: -80px; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(201,169,106,.22), transparent 65%); pointer-events: none; }
        .hero > * { position: relative; z-index: 1; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(38px, 6vw, 72px); color: #fff; margin-bottom: 16px; }
        .hero p { color: rgba(255,250,241,.7); font-size: 16px; max-width: 560px; margin: 0 auto; line-height: 1.7; }

        .content { max-width: 1100px; margin: 0 auto; padding: 56px 32px 80px; }
        .filter-row { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 44px; }
        .filter-chip { padding: 9px 20px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--navy); font-size: 13px; font-weight: 700; cursor: pointer; transition: all .25s; }
        .filter-chip:hover { border-color: var(--gold); color: var(--gold); }
        .filter-chip.on { background: linear-gradient(135deg, var(--navy), var(--navy-2)); color: #fff; border-color: transparent; }
        .feat-bento { display: grid; grid-template-columns: 1.35fr 1fr 1fr; grid-template-rows: 252px 252px; gap: 20px; margin-bottom: 48px; }
        .feat-card { position: relative; border-radius: 22px; overflow: hidden; text-decoration: none; box-shadow: var(--shadow-md); transition: box-shadow .35s ease; }
        .feat-card:hover { box-shadow: 0 26px 60px rgba(7,23,38,.28); }
        .feat-card > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .65s ease; }
        .feat-card:hover > img { transform: scale(1.05); }
        .feat-0 { grid-row: 1 / 3; }
        .feat-3 { grid-column: 2 / 4; }
        .feat-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,23,38,.06) 30%, rgba(7,23,38,.86) 100%); transition: background .35s ease; }
        .feat-card:hover .feat-shade { background: linear-gradient(180deg, rgba(7,23,38,.16) 20%, rgba(7,23,38,.92) 100%); }
        .feat-text { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 24px; }
        .feat-tag { display: block; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 8px; }
        .feat-text h2 { font-family: 'Playfair Display', serif; color: #fff; font-size: 19px; line-height: 1.25; margin-bottom: 8px; text-shadow: 0 2px 18px rgba(0,0,0,.35); }
        .feat-0 .feat-text h2 { font-size: clamp(24px, 2.2vw, 32px); }
        .feat-0 .feat-text p { color: rgba(255,250,241,.78); font-size: 14px; line-height: 1.7; margin-bottom: 10px; }
        .feat-more { display: inline-block; color: var(--gold); font-weight: 800; font-size: 13px; opacity: 0; transform: translateY(4px); transition: opacity .3s ease, transform .3s ease; }
        .feat-card:hover .feat-more { opacity: 1; transform: none; }
        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .blog-card { display: block; text-decoration: none; border-radius: 22px; overflow: hidden; background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow-sm); transition: all 0.3s; }
        .blog-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: rgba(201,169,106,.3); }
        .blog-img { height: 200px; overflow: hidden; }
        .blog-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .blog-card:hover .blog-img img { transform: scale(1.06); }
        .blog-body { padding: 22px; }
        .blog-cat { display: inline-block; padding: 4px 11px; background: rgba(201,169,106,.1); color: var(--gold); border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 12px; border: 1px solid rgba(201,169,106,.2); }
        .blog-title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 800; color: var(--navy); margin-bottom: 10px; line-height: 1.3; }
        .blog-excerpt { color: var(--muted); font-size: 13.5px; line-height: 1.65; margin-bottom: 14px; }
        .blog-meta { display: flex; justify-content: space-between; font-size: 12px; color: rgba(100,120,137,.8); border-top: 1px solid var(--line); padding-top: 14px; }

        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }

        @media (max-width: 900px) {
          .nav-links { gap: 16px; }
          .blog-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 900px) {
          .feat-bento { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
          .feat-0 { grid-column: 1 / 3; grid-row: auto; height: 320px; }
          .feat-1, .feat-2 { height: 230px; }
          .feat-3 { grid-column: 1 / 3; height: 230px; }
        }
        @media (max-width: 560px) {
          .feat-bento { grid-template-columns: 1fr; }
          .feat-0, .feat-1, .feat-2, .feat-3 { grid-column: auto; height: 240px; }
          .feat-0 { height: 300px; }
        }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr; }
          .content { padding: 40px 20px 56px; }
        }
        @media (max-width: 700px) {
          .nav-inner { height: auto; flex-wrap: wrap; padding: 10px 16px; gap: 6px; justify-content: center; }
          .brand img { height: 56px; }
          .nav-links { flex-wrap: wrap; justify-content: center; gap: 12px 16px; }
          .nav-links a { font-size: 13px; }
        }
        a:focus-visible, button:focus-visible { outline: 3px solid #8ed8dc; outline-offset: 2px; border-radius: 6px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/de"><img src="/logo.png" alt="Itinerary of Türkiye" /></a>
          <nav className="nav-links">
            <a href="/de/about">Über uns</a>
            <a href="/de/services">Leistungen</a>
            <a href="/de/testimonials">Referenzen</a>
            <a href="/de#contact">Kontakt</a>
                      <a href="/blogs" style={{fontWeight:800, opacity:.85}} aria-label="English version">EN</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">Ratgeber & Einblicke</div>
        <h1>Unser Blog</h1>
        <p>Ratgeber, Geschichten und Einblicke zu Tourismus, Medizinreisen, Investment und Business in der Türkei.</p>
      </section>

      <section className="content">
        <div className="filter-row">
          {categories.map((c) => (
            <button key={c} className={`filter-chip ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>

        {showFeatured && (
          <div className="feat-bento">
            {featuredFour.map((f, i) => (
              <a key={f.slug} className={`feat-card feat-${i}`} href={`/de/blogs/${f.slug}`}>
                <img src={f.coverImage} alt={f.title} />
                <div className="feat-shade" />
                <div className="feat-text">
                  <span className="feat-tag">{i === 0 ? 'Neu · ' : ''}{f.category}</span>
                  <h2>{f.title}</h2>
                  {i === 0 && <p>{f.excerpt}</p>}
                  <span className="feat-more">Zum Ratgeber →</span>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="blog-grid">
          {visible.map((post) => (
            <a key={post.slug} className="blog-card" href={`/de/blogs/${post.slug}`}>
              <div className="blog-img"><img loading="lazy" src={post.coverImage} alt={post.title} /></div>
              <div className="blog-body">
                <span className="blog-cat">{post.category}</span>
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer"><p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/de/privacy" style={{color:'inherit'}}>Datenschutz</a> · <a href="/de/terms" style={{color:'inherit'}}>AGB</a> · <a href="/de/impressum" style={{color:'inherit'}}>Impressum</a> · <a href="/de/future-services" style={{color:'inherit'}}>Weitere Leistungen</a></p></footer>
    </main>
  );
}
