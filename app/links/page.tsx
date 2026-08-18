'use client';

import { whatsAppUrl } from '@/lib/config';
import Icon from '../components/Icon';

// Instagram bio hedef sayfası — kendi "link-in-bio"muz.
// UTM'ler Instagram trafiğini analytics'te ayrıştırır.
const UTM = '?utm_source=instagram&utm_medium=links';

export default function LinksPage() {
  const links = [
    { emoji: 'whatsapp', title: 'Talk to Us on WhatsApp', sub: 'A real person replies within hours', href: whatsAppUrl('Hello! I found you on Instagram and I would like to plan a trip.'), external: true, primary: true },
    { emoji: 'plan', title: 'Guides & Cost Articles', sub: 'Hair, dental, aesthetics, itineraries — honest 2026 guides', href: `/blogs${UTM}` },
    { emoji: 'medical', title: 'Medical Travel Advisory', sub: 'How we verify clinics before recommending', href: `/${UTM}#health` },
    { emoji: 'landmark', title: 'Private Türkiye Experiences', sub: 'Cappadocia, Istanbul, the Aegean — tailor-made', href: `/${UTM}#tourism` },
    { emoji: 'sparkle', title: 'How It Works', sub: 'Three steps, zero stress', href: `/${UTM}#contact` },
  ];
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #071726, #0c3555)', fontFamily: "'Inter', system-ui, sans-serif", padding: '48px 20px 60px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;600;700;800&display=swap');
        .lk-wrap { max-width: 480px; margin: 0 auto; text-align: center; }
        .lk-logo { height: 88px; width: auto; }
        .lk-name { font-family: 'Playfair Display', serif; color: #fff; font-size: 26px; margin: 14px 0 6px; }
        .lk-tag { color: rgba(255,250,241,.65); font-size: 13.5px; line-height: 1.6; margin-bottom: 30px; }
        .lk-tag b { color: #c9a96a; font-weight: 700; }
        .lk-btn { display: flex; align-items: center; gap: 14px; text-align: left; width: 100%; padding: 16px 20px; margin-bottom: 14px; border-radius: 18px; text-decoration: none; border: 1px solid rgba(255,250,241,.16); background: rgba(255,255,255,.05); transition: transform .25s ease, border-color .25s ease, background .25s ease; }
        .lk-btn:hover { transform: translateY(-2px); border-color: rgba(201,169,106,.6); background: rgba(255,255,255,.09); }
        .lk-btn.primary { background: linear-gradient(135deg, #c9a96a, #b8955a); border: none; }
        .lk-btn.primary .lk-t { color: #071726; }
        .lk-btn.primary .lk-s { color: rgba(7,23,38,.75); }
        .lk-e { font-size: 24px; }
        .lk-t { color: #fff; font-weight: 800; font-size: 15px; }
        .lk-s { color: rgba(255,250,241,.6); font-size: 12.5px; margin-top: 2px; }
        .lk-foot { color: rgba(255,250,241,.4); font-size: 12px; margin-top: 26px; }
        .lk-foot a { color: rgba(255,250,241,.6); text-decoration: none; }
        a:focus-visible { outline: 3px solid #8ed8dc; outline-offset: 2px; border-radius: 8px; }
      `}</style>
      <div className="lk-wrap">
        <img className="lk-logo" src="/logo.png" alt="Itinerary of Türkiye" />
        <h1 className="lk-name">Itinerary of Türkiye</h1>
        <p className="lk-tag"><b>Independent advisory</b> for medical travel & private Türkiye experiences.<br />We verify. We plan. We stay with you.</p>
        {links.map((l) => (
          <a key={l.title} className={`lk-btn ${l.primary ? 'primary' : ''}`} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <span className="lk-e"><Icon name={l.emoji as never} size={20} /></span>
            <span>
              <span className="lk-t" style={{ display: 'block' }}>{l.title}</span>
              <span className="lk-s" style={{ display: 'block' }}>{l.sub}</span>
            </span>
          </a>
        ))}
        <p className="lk-foot"><a href="/">itineraryofturkiye.com</a> · @itineraryofturkiye</p>
      </div>
    </main>
  );
}
