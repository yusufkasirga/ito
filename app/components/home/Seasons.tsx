'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { destFocus } from '@/lib/imageFocus';

/**
 * Mevsimler — tam genişlik sahne; mevsim seçilince arka plan çapraz geçişle değişir.
 * Tüm arka planlar baştan DOM'da (yalnız ilki önceden yüklenir), opaklıkla geçiş yapılır.
 */

export interface Season {
  id: string;
  label: string;
  months: string;
  title: string;
  text: string;
  photo: string; // public/images/dest/<slug>.jpg slug'ı
  places: { slug: string; name: string }[];
}

export default function Seasons({
  eyebrow,
  cta,
  seasons,
}: {
  eyebrow: string;
  cta: string;
  seasons: Season[];
}) {
  const [active, setActive] = useState(0);
  const s = seasons[active];

  return (
    <section className="ss" aria-label={eyebrow}>
      <style>{`
        .ss { position: relative; min-height: 88vh; display: flex; align-items: flex-end; color: #fffaf1; overflow: hidden; background: #071726; }
        .ss-bg { position: absolute; inset: 0; opacity: 0; transition: opacity 1.1s var(--fx-ease, ease), transform 6s linear; transform: scale(1.06); }
        .ss-bg.on { opacity: 1; transform: scale(1); }
        .ss-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,23,38,.88) 0%, rgba(7,23,38,.55) 45%, rgba(7,23,38,.15) 100%), linear-gradient(180deg, rgba(7,23,38,.35) 0%, transparent 30%, rgba(7,23,38,.6) 100%); }
        .ss-in { position: relative; z-index: 1; width: min(1240px, calc(100% - 48px)); margin: 0 auto; padding: 120px 0 70px; }
        .ss .eyebrow { color: #d8b878; }
        .ss-tabs { display: flex; gap: 6px; margin: 22px 0 40px; flex-wrap: wrap; }
        .ss-tab { background: none; border: none; color: rgba(255,250,241,.55); font-family: var(--font-playfair), serif; font-size: clamp(26px, 3.4vw, 46px); font-weight: 800; cursor: pointer; padding: 0 18px 0 0; transition: color .4s; line-height: 1.1; }
        .ss-tab:hover { color: rgba(255,250,241,.85); }
        .ss-tab[aria-pressed="true"] { color: #fffaf1; }
        .ss-tab[aria-pressed="true"]::after { content: ''; display: block; height: 3px; width: 44px; background: #E8956B; margin-top: 8px; border-radius: 2px; }
        .ss-card { max-width: 560px; animation: ss-in .8s var(--fx-ease, ease) both; }
        .ss-months { font-size: 12px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #d8b878; }
        .ss-card h3 { font-family: var(--font-playfair), serif; font-size: clamp(30px, 3.6vw, 50px); line-height: 1.05; margin: 10px 0 14px; }
        .ss-card p { margin: 0 0 22px; font-size: 16px; line-height: 1.75; color: rgba(255,250,241,.85); }
        .ss-places { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 26px; }
        .ss-place { padding: 9px 16px; border-radius: 999px; background: rgba(255,250,241,.1); border: 1px solid rgba(255,250,241,.28); color: #fffaf1; font-size: 13.5px; font-weight: 700; text-decoration: none; backdrop-filter: blur(8px); transition: background .3s, border-color .3s; }
        .ss-place:hover { background: rgba(255,250,241,.2); border-color: #d8b878; }
        .ss-cta { color: #E8956B; font-weight: 800; font-size: 14px; text-decoration: none; }
        .ss-cta:hover { text-decoration: underline; text-underline-offset: 4px; }
        @keyframes ss-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .ss-bg, .ss-card { transition: none; animation: none; transform: none; } }
        @media (max-width: 760px) {
          .ss { min-height: 0; }
          .ss-in { width: calc(100% - 28px); padding: 90px 0 56px; }
          .ss-shade { background: linear-gradient(180deg, rgba(7,23,38,.55) 0%, rgba(7,23,38,.75) 55%, rgba(7,23,38,.92) 100%); }
          .ss-tab { font-size: 24px; padding-right: 12px; }
        }
      `}</style>

      {seasons.map((x, i) => (
        <div key={x.id} className={`ss-bg ${i === active ? 'on' : ''}`} aria-hidden="true">
          <Image
            src={`/images/dest/${x.photo}.jpg`}
            alt=""
            fill
            sizes="(max-width: 760px) 300vw, 100vw"
            loading={i === 0 ? undefined : 'lazy'}
            style={{ objectFit: 'cover', objectPosition: destFocus(x.photo) }}
          />
        </div>
      ))}
      <span className="ss-shade" />

      <div className="ss-in">
        <span className="eyebrow">{eyebrow}</span>
        <div className="ss-tabs">
          {seasons.map((x, i) => (
            <button key={x.id} type="button" className="ss-tab" aria-pressed={i === active} onClick={() => setActive(i)}>
              {x.label}
            </button>
          ))}
        </div>
        <div className="ss-card" key={s.id} aria-live="polite">
          <span className="ss-months">{s.months}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
          <div className="ss-places">
            {s.places.map((p) => <Link key={p.slug} href={`/destinations/${p.slug}`} className="ss-place">{p.name}</Link>)}
          </div>
          <Link href="/blog/best-time-to-visit-turkiye-month-by-month" className="ss-cta">{cta} →</Link>
        </div>
      </div>
    </section>
  );
}
