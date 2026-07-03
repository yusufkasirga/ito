'use client';

export default function TestimonialsPage() {
  const testimonials = [
    { name: 'Mark T.', category: 'Tourism · Hair Transplant · Business', flag: '🇬🇧', text: 'A big thank you to the Itinerary of Turkiye team! You made my whole journey incredibly smooth — from my trip and hair transplant to my business meetings. Everything was well organised, and I honestly did not expect the experience to be this seamless.' },
    { name: 'Luke W.', category: 'Business Advisory', flag: '🇦🇺', text: 'Dear Itinerary of Turkiye — thank you for helping make my business trip such a success, resulting in several positive deals. You all deserve much greater recognition and success.' },
    { name: 'Alan G.', category: 'Real Estate', flag: '🇺🇸', text: 'I only wish I had known about Itinerary of Turkiye earlier. Thanks to their guidance and local expertise, I was able to secure a great real estate deal that would not have been possible without their assistance.' },
    { name: 'Pawan K.', category: 'Investment Advisory', flag: '🇮🇳', text: 'Investing in Türkiye can be challenging without the guidance of trustworthy local experts. Itinerary of Türkiye helped me tremendously throughout the process.' },
  ];

  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
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
        .nav-links a:hover, .nav-links a.active { color: var(--gold); }
        .btn-primary { min-height: 44px; padding: 0 22px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.3s; box-shadow: var(--shadow-md); }
        .hero { background: linear-gradient(135deg, #071726 0%, #0c3555 100%); color: #fff; padding: 90px 0 70px; text-align: center; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(38px, 6vw, 72px); color: #fff; margin-bottom: 16px; }
        .hero p { color: rgba(255,250,241,.7); font-size: 16px; max-width: 560px; margin: 0 auto; line-height: 1.7; }
        .content { max-width: 1000px; margin: 0 auto; padding: 80px 32px; }
        .testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .testi-card { padding: 28px; border-radius: 22px; background: #fff; border: 1px solid rgba(201,169,106,.18); box-shadow: var(--shadow-md); }
        .testi-name { font-size: 16px; font-weight: 900; color: var(--navy); margin-bottom: 4px; }
        .testi-cat { display: inline-block; padding: 4px 11px; background: rgba(201,169,106,.1); color: var(--gold); border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 14px; border: 1px solid rgba(201,169,106,.2); }
        .testi-text { color: #4a5568; font-size: 14px; line-height: 1.78; font-style: italic; }
        .cta-row { text-align: center; margin-top: 56px; }
        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }
        @media (max-width: 840px) { .nav-links { gap: 16px; } .testi-grid { grid-template-columns: 1fr; } }
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
          <a className="brand" href="/"><img src="/logo.png" alt="Itinerary of Türkiye" /></a>
          <nav className="nav-links">
            <a href="/about">About Us</a>
            <a href="/services">Services</a>
            <a href="/blogs">Blogs</a>
            <a href="/testimonials" className="active">Testimonials</a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
      </header>
      <section className="hero">
        <div className="eyebrow">Client Stories</div>
        <h1>What Our Clients Say</h1>
        <p>Real people, real experiences — from tourism to medical care, real estate to business advisory.</p>
      </section>
      <section className="content">
        <div className="testi-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testi-card">
              <p className="testi-name">{t.flag} {t.name}</p>
              <span className="testi-cat">{t.category}</span>
              <p className="testi-text">"{t.text}"</p>
            </div>
          ))}
        </div>
        <div className="cta-row">
          <a className="btn-primary" href="/#contact">Start Your Own Journey</a>
        </div>
      </section>
      <footer className="footer"><p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved.</p></footer>
    </main>
  );
}
