import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import SiteHeader from '../components/SiteHeader';
import { destinationSlugs } from '../destinations/destinationData';
import CityImage from '../components/CityImage';

function slugify(x: string) {
  const map: Record<string,string> = { 'ç':'c','ğ':'g','ı':'i','İ':'i','ö':'o','ş':'s','ü':'u','â':'a' };
  return x.toLowerCase().replace(/[çğıİöşüâ]/g, (c) => map[c] || c);
}

export const metadata: Metadata = {
  title: 'All Türkiye Destinations — Where We Can Take You',
  description: 'From Istanbul and Cappadocia to the Aegean coast and the wild east — 60 of Türkiye’s most rewarding destinations, and a private advisory that plans any of them around you.',
  alternates: { canonical: `${SITE_URL}/all-turkiye-destinations` },
};

// Accent paleti — kartlar tipografik/degrade (foto uyumsuzluğunu önlemek için).
// Gerçek fotoğraflar 1,5 ay sonra iç sayfalara düşecek; ızgara editoryal kalır.
const ACCENTS = ['#1f4e6b', '#8a4b2b', '#0e5a6b', '#2b6b3a', '#6b5a2b', '#4a3a6b', '#0e6b5a', '#5a3a4a'];

const DESTINATIONS: { name: string; note?: string }[] = [
  { name: 'Istanbul', note: 'Two continents' }, { name: 'Cappadocia', note: 'Balloons & valleys' },
  { name: 'Antalya', note: 'Riviera capital' }, { name: 'Bodrum', note: 'Aegean chic' },
  { name: 'Fethiye', note: 'Lagoons & gulets' }, { name: 'Izmir', note: 'Easy Aegean' },
  { name: 'Pamukkale', note: 'White terraces' }, { name: 'Ephesus', note: 'Ancient city' },
  { name: 'Bursa', note: 'Green & thermal' }, { name: 'Ankara', note: 'The capital' },
  { name: 'Trabzon' }, { name: 'Konya' }, { name: 'Mardin' }, { name: 'Gaziantep' },
  { name: 'Şanlıurfa' }, { name: 'Çanakkale' }, { name: 'Marmaris' }, { name: 'Alanya' },
  { name: 'Kaş' }, { name: 'Kalkan' }, { name: 'Göcek' }, { name: 'Ölüdeniz' },
  { name: 'Datça' }, { name: 'Ayvalık' }, { name: 'Assos' }, { name: 'Safranbolu' },
  { name: 'Amasya' }, { name: 'Sinop' }, { name: 'Rize' }, { name: 'Artvin' },
  { name: 'Kars' }, { name: 'Van' }, { name: 'Erzurum' }, { name: 'Nemrut' },
  { name: 'Sümela' }, { name: 'Uludağ' }, { name: 'Side' }, { name: 'Kekova' },
  { name: 'Göreme' }, { name: 'Uçhisar' }, { name: 'Şirince' }, { name: 'Foça' },
  { name: 'Cunda' }, { name: 'Akyaka' }, { name: 'Dalyan' }, { name: 'Patara' },
  { name: 'Olympos' }, { name: 'Cirali' }, { name: 'Bozcaada' }, { name: 'Gökçeada' },
  { name: 'Kuşadası' }, { name: 'Didim' }, { name: 'Bergama' }, { name: 'Afyon' },
  { name: 'Eskişehir' }, { name: 'Hatay' }, { name: 'Adana' }, { name: 'Diyarbakır' },
  { name: 'Edirne' }, { name: 'Bitlis' },
];

export default function DestinationsPage() {
  return (
    <main className="dl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        .dl { font-family: 'Inter', system-ui, sans-serif; background: #071726; min-height: 100vh; color: #fffaf1; }
        .dl * { box-sizing: border-box; }
        .dl-wrap { max-width: 1200px; margin: 0 auto; padding: 56px 40px 90px; }
        .dl-eyebrow { color: #d8b878; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .dl-h1 { font-family: 'Playfair Display', serif; font-size: clamp(38px, 7vw, 68px); margin: 12px 0 14px; line-height: 1; letter-spacing: -.02em; }
        .dl-lede { font-size: 16.5px; line-height: 1.8; color: rgba(255,250,241,.8); max-width: 700px; margin-bottom: 44px; }
        .dl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .dl-card { position: relative; display: flex; flex-direction: column; justify-content: flex-end; aspect-ratio: 4 / 5; border-radius: 16px; overflow: hidden; text-decoration: none; color: #fffaf1;
          border: 1px solid rgba(255,250,241,.09); transition: transform .3s cubic-bezier(.2,.7,.3,1), border-color .3s; }
        .dl-card::before { content: ''; position: absolute; inset: 0; z-index: 0; }
        .dl-card::after { content: ''; position: absolute; inset: 0; z-index: 1;
          background-image: radial-gradient(rgba(255,250,241,.05) 1px, transparent 1px); background-size: 18px 18px; opacity: .55; }
        .dl-card:hover { transform: translateY(-5px); border-color: rgba(216,184,120,.5); }
        .dl-card-body { position: relative; z-index: 2; padding: 20px; }
        .dl-city { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; line-height: 1.05; letter-spacing: -.01em; }
        .dl-note { font-size: 12px; color: rgba(255,250,241,.72); margin-top: 5px; }
        .dl-tag { position: absolute; top: 14px; left: 16px; z-index: 2; font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #d8b878; }
        .dl-arrow { position: absolute; top: 14px; right: 16px; z-index: 2; color: rgba(255,250,241,.6); transition: transform .3s, color .3s; }
        .dl-card:hover .dl-arrow { transform: translate(3px,-3px); color: #d8b878; }
        .dl-ghost { position: absolute; right: -8%; bottom: -18%; z-index: 0; font-family: 'Playfair Display', serif; font-weight: 900; font-size: 150px; color: rgba(255,250,241,.045); line-height: .8; pointer-events: none; }
        .dl-cta { margin-top: 50px; padding: 44px 36px; border-radius: 22px; background: linear-gradient(150deg, rgba(216,184,120,.14), rgba(142,216,220,.05)); border: 1px solid rgba(216,184,120,.22); text-align: center; }
        .dl-cta h2 { font-family: 'Playfair Display', serif; font-size: 30px; margin: 10px 0 12px; }
        .dl-cta p { font-size: 15.5px; line-height: 1.8; color: rgba(255,250,241,.8); max-width: 580px; margin: 0 auto 22px; }
        .dl-btn { display: inline-block; padding: 14px 32px; border-radius: 999px; background: #c9a96a; color: #081f35; font-weight: 800; font-size: 14px; text-decoration: none; }
        .dl-cta small { display: block; margin-top: 16px; font-size: 13px; color: rgba(255,250,241,.6); }
        .dl-cta a.link { color: #d8b878; font-weight: 700; }
        @media (max-width: 620px) { .dl-wrap { padding: 40px 20px 70px; } .dl-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <SiteHeader />

      <div className="dl-wrap">
        <span className="dl-eyebrow">All Türkiye Destinations</span>
        <h1 className="dl-h1">Sixty reasons to come — <span style={{ color: '#d8b878' }}>one</span> way to see them.</h1>
        <p className="dl-lede">
          Türkiye is far larger than the postcard. These are the places travellers ask us about most —
          from the obvious icons to the quiet coves. Wherever you want to go, we plan it privately,
          honestly, and around you.
        </p>

        <div className="dl-grid">
          {DESTINATIONS.map((c, i) => {
            const slug = c.name.toLowerCase();
            const hasPage = destinationSlugs.includes(slug);
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <a
                key={c.name}
                href={hasPage ? `/destinations/${slug}` : `/contact?d=${encodeURIComponent(c.name)}`}
                className="dl-card"
                aria-label={`${c.name} — Türkiye`}
                style={{ ['--acc' as string]: accent }}
              >
                <CityImage slug={slugify(c.name)} accent={accent} alt={c.name} />
                <span className="dl-ghost">{c.name.slice(0, 2)}</span>
                <span style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(7,23,38,.15) 0%, rgba(7,23,38,.35) 50%, rgba(7,23,38,.9) 100%)' }} />
                {hasPage && <span className="dl-tag">Guide</span>}
                <span className="dl-arrow" aria-hidden="true">↗</span>
                <div className="dl-card-body">
                  <div className="dl-city">{c.name}</div>
                  {c.note && <div className="dl-note">{c.note}</div>}
                </div>
              </a>
            );
          })}
        </div>

        <div className="dl-cta">
          <span className="dl-eyebrow">Not sure where to start?</span>
          <h2>That is exactly what we are for.</h2>
          <p>
            Most first-time visitors try to see too much. We help you choose the few places that fit your
            time, your pace and your reasons for coming — and tell you honestly what to skip.
          </p>
          <a href="/contact" className="dl-btn">Start planning</a>
          <small>
            See how we work in <a href="/how-we-work" className="link">How we work</a> · our commitments in <a href="/standard" className="link">The ITO Standard</a>
          </small>
        </div>
      </div>
    </main>
  );
}
