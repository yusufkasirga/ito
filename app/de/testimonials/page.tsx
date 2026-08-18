'use client';

export default function TestimonialsPage() {
  const testimonials = [
    { name: 'Mark T.', category: 'Tourismus · Haartransplantation · Business', flag: '🇬🇧', text: 'Ein großes Dankeschön an das Team von Itinerary of Türkiye! Sie haben meine gesamte Reise unglaublich reibungslos gemacht — von der Reise über die Haartransplantation bis zu meinen Geschäftsterminen. Alles war bestens organisiert; eine so nahtlose Erfahrung hatte ich ehrlich nicht erwartet. Danke für Professionalität, Fürsorge und Unterstützung während des gesamten Prozesses.' },
    { name: 'Luke W.', category: 'Business-Beratung', flag: '🇦🇺', text: 'Liebes Team von Itinerary of Türkiye — danke, dass ihr meine Geschäftsreise zu einem solchen Erfolg gemacht habt, mit mehreren positiven Abschlüssen. Ihr verdient weit mehr Anerkennung und Erfolg.' },
    { name: 'Alan G.', category: 'Immobilien', flag: '🇺🇸', text: 'Ich wünschte, ich hätte Itinerary of Türkiye früher gekannt. Dank ihrer Beratung und lokalen Expertise konnte ich einen hervorragenden Immobilienabschluss erzielen und viele Fehler vermeiden. Ich empfehle sie gerne weiter.' },
    { name: 'Pawan K.', category: 'Investment-Beratung', flag: '🇮🇳', text: 'In der Türkei zu investieren kann ohne vertrauenswürdige lokale Experten herausfordernd sein. Itinerary of Türkiye hat mir enorm geholfen — ihr lokales Wissen, ihre Professionalität und verlässliche Unterstützung gaben mir Sicherheit für fundierte Entscheidungen.' },
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
        .brand img { height: 84px; width: 84px; object-fit: contain; background: #fffdf7; border-radius: 50%; padding: 6px; box-shadow: 0 2px 12px rgba(0,0,0,.22); }
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
          .brand img { height: 62px; width: 62px; padding: 5px; }
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
            <a href="/de/testimonials" className="active">Referenzen</a>
            <a href="/de#contact">Kontakt</a>
                      <a href="/de" style={{fontWeight:800, opacity:.85}} aria-label="Deutsche Version">DE</a>
          </nav>
        </div>
      </header>
      <section className="hero">
        <div className="eyebrow">Kundenstimmen</div>
        <h1>Was unsere Kunden sagen</h1>
        <p>Echte Menschen, echte Erfahrungen — von Tourismus über medizinische Versorgung bis zu Immobilien- und Business-Beratung. (Übersetzte Kundenstimmen; Originale auf Englisch.)</p>
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
          <a className="btn-primary" href="/de#contact">Beginnen Sie Ihre eigene Reise</a>
        </div>
      </section>
      <footer className="footer"><p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/de/privacy" style={{color:'inherit'}}>Datenschutz</a> · <a href="/de/terms" style={{color:'inherit'}}>AGB</a> · <a href="/de/impressum" style={{color:'inherit'}}>Impressum</a> · <a href="/de/future-services" style={{color:'inherit'}}>Weitere Leistungen</a> · <a href="/de/blogs" style={{color:'inherit'}}>Ratgeber</a></p></footer>
    </main>
  );
}
