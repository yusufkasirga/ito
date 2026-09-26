'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { destFocus } from '@/lib/imageFocus';

/**
 * Bölge kaşifi — Türkiye'nin 6 bölgesi, her birinde o bölgenin rehberleri.
 * Veri sunucuda hazırlanır (page.tsx); fotoğrafı olan rehberler önde gelir.
 * Sekme değişince içerik key ile yeniden kurulur ve CSS animasyonuyla girer
 * (ScrollFx'e bağlı değil; dinamik içerik gizli kalmaz).
 */

export interface RegionCard {
  slug: string;
  name: string;
  line: string;
  photo: boolean;
  accent: string;
}

export interface Region {
  id: string;
  label: string;
  blurb: string;
  cards: RegionCard[];
}

export default function RegionExplorer({
  eyebrow,
  title,
  accent,
  guidesLabel,
  allLabel,
  regions,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  guidesLabel: string;
  allLabel: string;
  regions: Region[];
}) {
  const [active, setActive] = useState(regions[0]?.id);
  const region = regions.find((r) => r.id === active) ?? regions[0];
  // 1 büyük + 4 küçük kart: 3 sütunlu ızgarayı iki satırda tam doldurur
  const shown = region.cards.slice(0, 5);

  return (
    <section className="rx" id="regions" aria-labelledby="rx-title">
      <style>{`
        .rx { padding: 110px 0 100px; background: #edf5f6; }
        .rx-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 38px; flex-wrap: wrap; }
        .rx h2 { font-family: var(--font-playfair), serif; font-size: clamp(38px, 5.4vw, 72px); line-height: 1; letter-spacing: -.02em; margin: 14px 0 0; color: #081f35; font-weight: 800; }
        .rx h2 em { color: #8a6d33; font-style: italic; }
        .rx-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
        .rx-tab { padding: 11px 18px; border-radius: 999px; border: 1px solid rgba(8,31,53,.18); background: #fff; color: #081f35; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: background .3s, color .3s, border-color .3s, transform .3s; font-family: inherit; }
        .rx-tab:hover { border-color: #c9a96a; transform: translateY(-2px); }
        .rx-tab[aria-selected="true"] { background: #081f35; color: #fffaf1; border-color: #081f35; }
        .rx-tab small { margin-left: 6px; font-weight: 800; color: #c9a96a; }
        .rx-body { display: grid; grid-template-columns: .9fr 2.1fr; gap: 28px; align-items: stretch; }
        .rx-intro { background: #081f35; color: #fffaf1; border-radius: 22px; padding: 34px 30px; display: flex; flex-direction: column; justify-content: space-between; animation: rx-in .7s var(--fx-ease, ease) both; }
        .rx-intro h3 { font-family: var(--font-playfair), serif; font-size: clamp(30px, 3vw, 42px); line-height: 1.05; margin: 0 0 14px; }
        .rx-intro p { margin: 0; color: rgba(255,250,241,.78); font-size: 15px; line-height: 1.75; }
        .rx-count { font-size: 12px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #d8b878; margin-bottom: 14px; display: block; }
        .rx-all { margin-top: 26px; color: #d8b878; font-weight: 700; font-size: 14px; text-decoration: none; }
        .rx-all:hover { text-decoration: underline; text-underline-offset: 4px; }
        .rx-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 210px; gap: 14px; }
        .rx-card { position: relative; border-radius: 18px; overflow: hidden; color: #fffaf1; text-decoration: none; isolation: isolate; animation: rx-in .75s var(--fx-ease, ease) both; animation-delay: var(--d, 0ms); }
        .rx-card img { transition: transform 1.1s var(--fx-ease, ease); }
        .rx-card:hover img { transform: scale(1.08); }
        .rx-card .rx-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(7,23,38,.05) 25%, rgba(7,23,38,.85) 100%); }
        .rx-card .rx-typo { position: absolute; inset: 0; }
        .rx-card .rx-typo::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,250,241,.06) 1px, transparent 1px); background-size: 16px 16px; }
        .rx-card-body { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; padding: 16px 18px; }
        .rx-card h4 { margin: 0 0 4px; font-family: var(--font-playfair), serif; font-size: 23px; line-height: 1.05; }
        .rx-card p { margin: 0; font-size: 12.5px; line-height: 1.45; color: rgba(255,250,241,.8); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .rx-card:first-child { grid-row: span 2; }
        .rx-card:first-child h4 { font-size: 32px; }
        @keyframes rx-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .rx-intro, .rx-card { animation: none; } }
        @media (max-width: 960px) {
          .rx { padding: 80px 0 70px; }
          .rx-body { grid-template-columns: 1fr; }
          .rx-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 190px; }
        }
        @media (max-width: 520px) {
          .rx-tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 -14px; padding: 0 14px 4px; }
          .rx-tabs::-webkit-scrollbar { display: none; }
          .rx-tab { white-space: nowrap; }
        }
      `}</style>

      <div className="container">
        <div className="rx-top">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="rx-title" data-reveal="lines">
              <span><span>{title}</span></span>
              <span><span><em>{accent}</em></span></span>
            </h2>
          </div>
          <div className="rx-tabs" role="tablist" aria-label={eyebrow}>
            {regions.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                id={`rx-tab-${r.id}`}
                aria-selected={r.id === region.id}
                aria-controls="rx-panel"
                className="rx-tab"
                onClick={() => setActive(r.id)}
              >
                {r.label}<small>{r.cards.length}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="rx-body" id="rx-panel" role="tabpanel" aria-labelledby={`rx-tab-${region.id}`} key={region.id}>
          <div className="rx-intro">
            <div>
              <span className="rx-count">{region.cards.length} {guidesLabel}</span>
              <h3>{region.label}</h3>
              <p>{region.blurb}</p>
            </div>
            <Link href="/all-turkiye-destinations" className="rx-all">{allLabel} →</Link>
          </div>
          <div className="rx-grid">
            {shown.map((c, i) => (
              <Link key={c.slug} href={`/destinations/${c.slug}`} className="rx-card" style={{ '--d': `${80 + i * 70}ms` } as React.CSSProperties}>
                {c.photo ? (
                  <Image
                    src={`/images/dest/${c.slug}.jpg`}
                    alt={`${c.name}, Türkiye`}
                    fill
                    sizes={i === 0 ? '(max-width: 960px) 160vw, 40vw' : '(max-width: 960px) 100vw, 30vw'}
                    style={{ objectFit: 'cover', objectPosition: destFocus(c.slug) }}
                  />
                ) : (
                  <span className="rx-typo" style={{ background: `radial-gradient(130% 130% at 20% 15%, ${c.accent} 0%, #0a1a2b 60%, #071726 100%)` }} />
                )}
                <span className="rx-shade" />
                <div className="rx-card-body">
                  <h4>{c.name}</h4>
                  <p>{c.line}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
