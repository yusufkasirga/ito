'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Rakam bandı — ekrana girince sayarak yükselen, doğrulanabilir sayılar.
 * Yalnız sitede yazılı olan taahhütler kullanılır (uydurma istatistik yok).
 */

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

function useCountUp(target: number, run: boolean, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || target === 0) {
      const id = requestAnimationFrame(() => setN(target));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return n;
}

function StatItem({ s, run, armed, i }: { s: Stat; run: boolean; armed: boolean; i: number }) {
  const n = useCountUp(s.value, run, 1200 + i * 150);
  return (
    <div className="sb-item">
      <div className="sb-num">
        {/* Sunucuda ve JS'siz görünümde gerçek değer; sayaç yalnız görünümü canlandırır */}
        <span aria-hidden="true">{armed ? n : s.value}</span>
        <span className="sr-only">{s.value}</span>
        {s.suffix && <em>{s.suffix}</em>}
      </div>
      <div className="sb-label">{s.label}</div>
    </div>
  );
}

export default function StatsBand({ stats, note }: { stats: Stat[]; note: string }) {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);
  // Sunucuda gerçek değer görünür; JS yüklenince (bant genelde ekranın altında)
  // sayaç 0'dan başlamak üzere "kurulur" ve görünür olunca sayar.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const armId = requestAnimationFrame(() => setArmed(true));
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRun(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(armId); };
  }, []);

  return (
    <section className="sb" ref={ref} aria-label={note}>
      <style>{`
        .sb { background: #fffaf1; padding: 70px 0 64px; border-bottom: 1px solid rgba(8,31,53,.08); }
        .sb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
        .sb-item { padding: 8px 28px; border-left: 1px solid rgba(8,31,53,.12); }
        .sb-item:first-child { border-left: none; padding-left: 0; }
        .sb-num { font-family: var(--font-playfair), serif; font-weight: 800; font-size: clamp(52px, 6.4vw, 92px); line-height: 1; color: #081f35; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
        .sb-num em { font-style: italic; color: #c9a96a; margin-left: 2px; }
        .sb-label { margin-top: 12px; font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #647889; max-width: 200px; line-height: 1.5; }
        .sb-note { margin: 34px 0 0; font-size: 13.5px; color: #8a6d33; font-weight: 600; }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        @media (max-width: 820px) {
          .sb-grid { grid-template-columns: 1fr 1fr; row-gap: 36px; }
          .sb-item:nth-child(3) { border-left: none; padding-left: 0; }
          .sb-item { padding: 4px 18px; }
        }
      `}</style>
      <div className="container">
        <div className="sb-grid">
          {stats.map((s, i) => <StatItem key={s.label} s={s} run={run} armed={armed} i={i} />)}
        </div>
        <p className="sb-note">{note}</p>
      </div>
    </section>
  );
}
