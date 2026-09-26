'use client';

import { useEffect } from 'react';

/**
 * Ana sayfa kaydırma efektleri (GoTürkiye referansı).
 *
 *   data-reveal            → aşağıdan yukarı yumuşak belirme
 *   data-reveal="clip"     → görsel alttan yukarı perde gibi açılır
 *   data-reveal="lines"    → başlık satır satır yukarı kayar (her satır <span><span>)
 *   style="--d: 120ms"     → gecikme (sıralı belirme için)
 *   data-parallax="0.08"   → kaydırmaya göre hafif dikey kayma (katsayı)
 *
 * JS çalışmazsa içerik görünür kalır: gizli başlangıç durumu yalnız
 * <html class="fx-ready"> varken uygulanır. Açılışta ekranda olan öğeler
 * sınıf eklenmeden önce "açık" işaretlenir → ilk görünümde titreme olmaz.
 * prefers-reduced-motion: hiçbir efekt çalışmaz.
 */
export default function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('is-in');
    });
    root.classList.add('fx-ready');

    // clip-path: inset(100%) öğenin görünür alanını sıfırlar ve gözlemci onu hiç
    // "görünür" saymaz; perde öğeleri kırpılmayan üst öğe üzerinden izlenir.
    const targets = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (targets.get(e.target) ?? []).forEach((el) => el.classList.add('is-in'));
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => {
      if (el.classList.contains('is-in')) return;
      const watch = el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el;
      targets.set(watch, [...(targets.get(watch) ?? []), el]);
      io.observe(watch);
    });

    const px = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      px.forEach((el) => {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > window.innerHeight + 200) return;
        const k = Number(el.dataset.parallax) || 0.08;
        el.style.transform = `translate3d(0, ${((box.top + box.height / 2 - mid) * -k).toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    if (px.length) {
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove('fx-ready');
    };
  }, []);

  return (
    <style>{`
      :root { --fx-ease: cubic-bezier(.22,.61,.36,1); }
      .fx-ready [data-reveal] { opacity: 0; transform: translateY(42px); transition: opacity 1s var(--fx-ease), transform 1.1s var(--fx-ease); transition-delay: var(--d, 0ms); }
      .fx-ready [data-reveal].is-in { opacity: 1; transform: none; }
      .fx-ready [data-reveal="clip"] { opacity: 1; transform: none; clip-path: inset(100% 0 0 0 round 22px); transition: clip-path 1.25s var(--fx-ease); transition-delay: var(--d, 0ms); }
      .fx-ready [data-reveal="clip"].is-in { clip-path: inset(0 0 0 0 round 22px); }
      .fx-ready [data-reveal="lines"] { opacity: 1; transform: none; }
      [data-reveal="lines"] > span { display: block; overflow: hidden; padding-bottom: .06em; }
      [data-reveal="lines"] > span > span { display: block; }
      .fx-ready [data-reveal="lines"] > span > span { transform: translateY(110%); transition: transform 1.05s var(--fx-ease); }
      .fx-ready [data-reveal="lines"] > span:nth-child(2) > span { transition-delay: .12s; }
      .fx-ready [data-reveal="lines"] > span:nth-child(3) > span { transition-delay: .24s; }
      .fx-ready [data-reveal="lines"].is-in > span > span { transform: none; }
      [data-parallax] { will-change: transform; }
    `}</style>
  );
}
