'use client';

export default function ServicesPage() {
  const services = [
    {
      number: '01',
      title: 'Tourism',
      icon: '🏛️',
      image: 'https://images.pexels.com/photos/2456718/pexels-photo-2456718.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      desc: 'Türkiye is a country of endless discovery — and we are here to help you experience it fully. Whether you need a private guide, curated itineraries, accommodation recommendations, or any other travel assistance, Itinerary of Türkiye handles it all. Simply reach out to us by phone, WhatsApp, or email and we will take care of the rest.',
      link: '/#tourism',
      tags: ['Private Guides', 'Curated Itineraries', 'Accommodation', 'Travel Assistance'],
    },
    {
      number: '02',
      title: 'Medical Tourism',
      icon: '🏥',
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      desc: 'Finding the right doctor or clinic for a surgical or non-surgical procedure in a foreign country can feel daunting. We take that burden off your shoulders — connecting you with experienced, accredited specialists at clinics that match your budget, so you can focus entirely on your health and recovery.',
      link: '/#health',
      tags: ['Hair Transplant', 'Dental Care', 'Rhinoplasty', 'Aesthetic Surgery', 'Facelift', 'Liposuction'],
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
        .brand img { height: 77px; width: auto; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--gold); }
        .btn-primary { min-height: 44px; padding: 0 22px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.3s; box-shadow: var(--shadow-md); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

        /* HERO */
        .hero { background: linear-gradient(135deg, #071726 0%, #0c3555 100%); color: #fff; padding: 80px 0 70px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(201,169,106,.1), transparent 40%); }
        .hero-inner { max-width: 1240px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 1; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(42px, 7vw, 90px); line-height: .88; color: #fff; margin-bottom: 24px; }
        .hero h1 span { color: var(--gold); }
        .hero p { max-width: 620px; color: rgba(255,250,241,.75); font-size: 17px; line-height: 1.8; }

        /* SERVICES */
        .services-list { max-width: 1240px; margin: 0 auto; padding: 80px 32px; display: grid; gap: 40px; }
        .service-card { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding: 48px; border-radius: 28px; background: #fff; box-shadow: var(--shadow-md); border: 1px solid var(--line); transition: all 0.3s; }
        .service-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
        .service-card.reverse { direction: rtl; }
        .service-card.reverse > * { direction: ltr; }
        .service-number { font-size: 13px; font-weight: 900; color: var(--gold); letter-spacing: .15em; margin-bottom: 12px; }
        .service-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 44px); color: var(--navy); margin-bottom: 16px; line-height: 1; }
        .service-desc { color: var(--muted); font-size: 15px; line-height: 1.8; margin-bottom: 24px; }
        .service-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
        .service-tag { padding: 6px 14px; border-radius: 999px; background: rgba(201,169,106,.1); color: var(--gold); font-size: 12px; font-weight: 700; border: 1px solid rgba(201,169,106,.2); }
        .service-image { border-radius: 20px; overflow: hidden; height: 320px; box-shadow: var(--shadow-md); }
        .service-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .service-card:hover .service-image img { transform: scale(1.04); }

        /* CTA */
        .cta-section { background: linear-gradient(135deg, var(--navy), var(--navy-2)); padding: 80px 0; text-align: center; }
        .cta-inner { max-width: 640px; margin: 0 auto; padding: 0 32px; }
        .cta-inner h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 48px); color: #fff; margin-bottom: 16px; }
        .cta-inner p { color: rgba(255,250,241,.72); font-size: 16px; line-height: 1.75; margin-bottom: 32px; }

        /* FOOTER */
        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }

        @media (max-width: 900px) {
          .service-card { grid-template-columns: 1fr; gap: 32px; }
          .service-card.reverse { direction: ltr; }
          .service-image { height: 240px; }
          .nav-links { gap: 16px; }
        }
        @media (max-width: 600px) {
          .hero h1 { font-size: 42px; }
          .services-list { padding: 48px 20px; }
          .service-card { padding: 28px; }
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

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/">
            <img src="/logo.png" alt="Itinerary of Türkiye" />
          </a>
          <nav className="nav-links">
            <a href="/about">About Us</a>
            <a href="/services" className="active">Services</a>
            <a href="/blogs">Blogs</a>
            <a href="/testimonials">Testimonials</a>
            <a href="/#contact">Contact</a>
            <a className="btn-primary" href="/#contact">Get in Touch</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">What We Do</div>
          <h1>Our <span>Services.</span></h1>
          <p>
            From curated tourism experiences to full medical coordination — with business and investment advisory available on request.
          </p>
        </div>
      </section>

      {/* SERVICES LIST */}
      <div className="services-list">
        {services.map((s, i) => (
          <div key={s.number} className={`service-card ${i % 2 !== 0 ? 'reverse' : ''}`}>
            <div>
              <div className="service-number">{s.number} —</div>
              <h2 className="service-title">{s.icon} {s.title}</h2>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map((tag) => (
                  <span key={tag} className="service-tag">{tag}</span>
                ))}
              </div>
              <a className="btn-primary" href={s.link}>Learn More</a>
            </div>
            <div className="service-image">
              <img src={s.image} alt={s.title} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to begin?</h2>
          <p>Tell us what you need in Türkiye and we will take care of everything else.</p>
          <a className="btn-primary" href="/#contact">Request Advisory</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/future-services" style={{color:'inherit'}}>Future Services</a></p>
      </footer>
    </main>
  );
}
