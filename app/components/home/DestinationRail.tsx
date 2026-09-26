'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * "Discover Türkiye" — yatay kayan destinasyon şeridi (GoTürkiye referansı).
 * Dokunmatikte doğal kaydırma + snap; masaüstünde oklar ve fareyle sürükleme.
 * Görseller: public/images/dest/<slug>.jpg (Pexels, kaynaklar image-credits.md).
 */

export interface RailItem {
  slug: string;
  name: string;
  region: string;
  line: string;
}

export const HOME_DESTINATIONS: RailItem[] = [
  { slug: 'istanbul', name: 'Istanbul', region: 'Marmara', line: 'Two continents, three empires, one skyline.' },
  { slug: 'cappadocia', name: 'Cappadocia', region: 'Central Anatolia', line: 'Fairy chimneys and balloons at first light.' },
  { slug: 'ephesus', name: 'Ephesus', region: 'Aegean', line: 'Walk the marble streets of a Roman city.' },
  { slug: 'pamukkale', name: 'Pamukkale', region: 'Aegean interior', line: 'White terraces of warm mineral water.' },
  { slug: 'antalya', name: 'Antalya', region: 'Mediterranean', line: 'An old harbour town on the Turkish Riviera.' },
  { slug: 'fethiye', name: 'Fethiye', region: 'Turquoise Coast', line: 'Lagoons, Lycian tombs and gulet sailing.' },
  { slug: 'bodrum', name: 'Bodrum', region: 'Aegean coast', line: 'Whitewashed lanes beneath a crusader castle.' },
  { slug: 'kas', name: 'Kaş', region: 'Lycian coast', line: 'Clear water, sunken ruins, a Greek island offshore.' },
  { slug: 'mardin', name: 'Mardin', region: 'Upper Mesopotamia', line: 'Honey-coloured stone above the plains.' },
  { slug: 'trabzon', name: 'Trabzon', region: 'Black Sea', line: 'Green mountains and mist-filled lakes.' },
];

export default function DestinationRail({
  eyebrow,
  title,
  accent,
  copy,
  allLabel,
  guideLabel,
  prevLabel,
  nextLabel,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  allLabel: string;
  guideLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.dr-card');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 18) * 2, behavior: 'smooth' });
  };

  // Masaüstünde fareyle sürükle-kaydır; sürüklemeden sonra tıklamayı yut
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { down: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6) d.moved = true;
    if (d.moved) {
      track.current.classList.add('is-dragging');
      track.current.scrollLeft = d.left - dx;
    }
  };
  const endDrag = () => {
    drag.current.down = false;
    track.current?.classList.remove('is-dragging');
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section className="dr" id="destinations" aria-labelledby="dr-title">
      <style>{`
        .dr { padding: 110px 0 90px; background: #071726; color: #fffaf1; overflow: hidden; }
        .dr-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 44px; }
        .dr .eyebrow { color: var(--gold); }
        .dr h2 { font-family: var(--font-playfair), serif; font-size: clamp(40px, 6vw, 84px); line-height: .98; letter-spacing: -.02em; margin: 14px 0 18px; color: #fffaf1; font-weight: 800; }
        .dr h2 em { color: var(--gold); font-style: italic; }
        .dr-copy { color: rgba(255,250,241,.72); font-size: 16.5px; line-height: 1.75; max-width: 520px; margin: 0; }
        .dr-nav { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .dr-btn { width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255,250,241,.3); background: transparent; color: #fffaf1; font-size: 20px; cursor: pointer; transition: background .3s, border-color .3s, transform .3s; }
        .dr-btn:hover { background: rgba(255,250,241,.1); border-color: var(--gold); transform: translateY(-2px); }
        .dr-all { margin-left: 10px; color: var(--gold); font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; }
        .dr-all:hover { text-decoration: underline; text-underline-offset: 4px; }
        .dr-track { display: flex; gap: 18px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: max(24px, calc((100vw - 1240px) / 2));
          padding: 6px max(24px, calc((100vw - 1240px) / 2)) 26px; scrollbar-width: none; cursor: grab; }
        .dr-track::-webkit-scrollbar { display: none; }
        .dr-track.is-dragging { cursor: grabbing; scroll-snap-type: none; }
        .dr-track.is-dragging a { pointer-events: none; }
        .dr-card { position: relative; flex: 0 0 clamp(250px, 25vw, 340px); aspect-ratio: 3 / 4; border-radius: 22px; overflow: hidden; scroll-snap-align: start; color: #fffaf1; text-decoration: none; isolation: isolate; box-shadow: 0 24px 60px rgba(0,0,0,.35); }
        .dr-card img { transition: transform 1.2s var(--fx-ease, ease); }
        .dr-card:hover img { transform: scale(1.08); }
        .dr-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(7,23,38,.05) 30%, rgba(7,23,38,.35) 55%, rgba(7,23,38,.92) 100%); transition: background .6s; }
        .dr-card:hover .dr-shade { background: linear-gradient(180deg, rgba(7,23,38,.15) 10%, rgba(7,23,38,.5) 45%, rgba(7,23,38,.95) 100%); }
        .dr-num { position: absolute; top: 18px; left: 20px; z-index: 2; font-size: 12px; font-weight: 800; letter-spacing: .18em; color: rgba(255,250,241,.85); }
        .dr-body { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; padding: 24px 22px 24px; }
        .dr-region { display: block; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
        .dr-body h3 { font-family: var(--font-playfair), serif; font-size: clamp(28px, 2.6vw, 36px); line-height: 1; margin: 0 0 10px; color: #fffaf1; }
        .dr-body p { margin: 0; font-size: 14.5px; line-height: 1.55; color: rgba(255,250,241,.82); }
        .dr-go { display: inline-block; margin-top: 14px; font-size: 13px; font-weight: 700; color: #fffaf1; opacity: 0; transform: translateY(8px); transition: opacity .45s, transform .45s; }
        .dr-card:hover .dr-go, .dr-card:focus-visible .dr-go { opacity: 1; transform: none; }
        .dr-more { position: relative; flex: 0 0 clamp(250px, 25vw, 340px); aspect-ratio: 3 / 4; border-radius: 22px; scroll-snap-align: start; display: flex; flex-direction: column; justify-content: flex-end; padding: 28px; text-decoration: none; color: #fffaf1;
          background: radial-gradient(120% 120% at 20% 10%, #1f4e6b 0%, #0c3555 45%, #071726 100%); border: 1px solid rgba(216,184,120,.35); }
        .dr-more b { font-family: var(--font-playfair), serif; font-size: 64px; line-height: 1; color: var(--gold); }
        .dr-more span { font-family: var(--font-playfair), serif; font-size: 28px; line-height: 1.1; margin: 8px 0 14px; }
        .dr-more i { font-style: normal; font-weight: 700; font-size: 14px; color: var(--gold); }
        @media (max-width: 760px) {
          .dr { padding: 80px 0 64px; }
          .dr-head { flex-direction: column; align-items: flex-start; }
          .dr-btn { display: none; }
          .dr-all { margin-left: 0; }
          .dr-card, .dr-more { flex-basis: 78vw; }
          .dr-go { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="container dr-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="dr-title" data-reveal="lines">
            <span><span>{title}</span></span>
            <span><span><em>{accent}</em></span></span>
          </h2>
          <p className="dr-copy" data-reveal style={{ '--d': '150ms' } as React.CSSProperties}>{copy}</p>
        </div>
        <div className="dr-nav">
          <button type="button" className="dr-btn" aria-label={prevLabel} onClick={() => step(-1)}>←</button>
          <button type="button" className="dr-btn" aria-label={nextLabel} onClick={() => step(1)}>→</button>
          <Link href="/all-turkiye-destinations" className="dr-all">{allLabel} →</Link>
        </div>
      </div>

      <div
        className="dr-track"
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        {HOME_DESTINATIONS.map((d, i) => (
          <Link
            key={d.slug}
            href={`/destinations/${d.slug}`}
            className="dr-card"
            draggable={false}
            data-reveal
            style={{ '--d': `${Math.min(i, 4) * 90}ms` } as React.CSSProperties}
          >
            <Image src={`/images/dest/${d.slug}.jpg`} alt={`${d.name}, Türkiye`} fill sizes="(max-width: 760px) 78vw, 340px" style={{ objectFit: 'cover' }} draggable={false} />
            <span className="dr-shade" />
            <span className="dr-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="dr-body">
              <span className="dr-region">{d.region}</span>
              <h3>{d.name}</h3>
              <p>{d.line}</p>
              <span className="dr-go">{guideLabel} →</span>
            </div>
          </Link>
        ))}
        <Link href="/all-turkiye-destinations" className="dr-more" draggable={false}>
          <b>52</b>
          <span>{allLabel}</span>
          <i>→</i>
        </Link>
      </div>
    </section>
  );
}
