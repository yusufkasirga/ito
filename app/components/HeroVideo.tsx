'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getImageProps } from 'next/image';

/**
 * Tam ekran sinematik hero videosu (GoTürkiye referansı).
 *
 * - Poster görseli anında görünür (LCP), video hidrasyondan sonra yüklenir.
 * - Mobil / yavaş bağlantıda 480p, masaüstünde 720p kaynak seçilir.
 * - "Veri tasarrufu" açıksa ya da prefers-reduced-motion varsa otomatik
 *   OYNATILMAZ; poster kalır, ziyaretçi isterse oynat düğmesine basar (WCAG 2.2.2).
 * - Ekrandan çıkınca durur (pil/CPU), geri gelince devam eder.
 * - Alt köşede o an görünen yerin adı (bölüm etiketi) + ilerleme çizgisi.
 */

export interface HeroChapter {
  /** Bölümün başladığı saniye */
  at: number;
  label: string;
}

interface Props {
  poster: string;
  /** Telefonda (≤768px) gösterilen dikey poster; dikey videonun ilk karesi */
  posterMobile?: string;
  /** Uzantısız yol; aynı adla .mp4 (H.264) ve .webm (VP9) dosyaları bulunmalı */
  srcLarge?: string;
  srcDesktop: string;
  srcMobile: string;
  chapters: HeroChapter[];
  pauseLabel: string;
  playLabel: string;
}

type NetInfo = { saveData?: boolean; effectiveType?: string };

const noSubscribe = () => () => {};
const isSmallScreen = () => window.matchMedia('(max-width: 768px)').matches;

function pickSource(desktop: string, mobile: string, large?: string): string {
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
  const slowNet = !!conn && (!!conn.saveData || /(^|-)2g$/.test(conn.effectiveType ?? ''));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slowNet || reduced) return 'none';
  if (isSmallScreen()) return mobile;
  // Geniş/retina ekranda 720p yumuşak görünür; hızlı bağlantıda 1080p
  const fast = !conn || !conn.effectiveType || conn.effectiveType === '4g';
  if (large && fast && window.innerWidth * window.devicePixelRatio >= 1900) return large;
  return desktop;
}

export default function HeroVideo({ poster, posterMobile, srcLarge, srcDesktop, srcMobile, chapters, pauseLabel, playLabel }: Props) {
  // Sanat yönetimi: telefona dikey, geniş ekrana yatay poster (next/image optimizasyonuyla)
  const posterBase = { alt: '', fill: true, sizes: '100vw', fetchPriority: 'high' as const };
  const { props: deskPoster } = getImageProps({ ...posterBase, src: poster });
  const mobilePosterSet = posterMobile ? getImageProps({ ...posterBase, src: posterMobile }).props.srcSet : undefined;

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  // Kaynak seçimi + otomatik oynatma kararı yalnız istemcide yapılır; sunucuda
  // (ve hidrasyonda) null → yalnız poster. 'none' = otomatik oynatma yok.
  const autoSrc = useSyncExternalStore(noSubscribe, () => pickSource(srcDesktop, srcMobile, srcLarge), () => null);
  const [manualSrc, setManualSrc] = useState<string | null>(null);
  const src = manualSrc ?? (autoSrc && autoSrc !== 'none' ? autoSrc : null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [chapter, setChapter] = useState(0);

  // Görünürlüğe göre oynat / durdur
  useEffect(() => {
    const v = videoRef.current;
    const wrap = wrapRef.current;
    if (!v || !wrap || !src || userPaused) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => setPlaying(false));
      else v.pause();
    }, { threshold: 0.15 });
    io.observe(wrap);
    return () => io.disconnect();
  }, [src, userPaused]);

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (barRef.current) barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    let idx = 0;
    chapters.forEach((c, i) => { if (v.currentTime >= c.at) idx = i; });
    if (idx !== chapter) setChapter(idx);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!src) {
      // Reduced-motion / veri tasarrufu: kullanıcı açıkça oynatmak istedi
      setManualSrc(isSmallScreen() ? srcMobile : srcDesktop);
      setUserPaused(false);
      return;
    }
    if (!v) return;
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}); }
    else { setUserPaused(true); v.pause(); }
  };

  return (
    <div className="hv" ref={wrapRef}>
      <style>{`
        .hv { position: absolute; inset: 0; z-index: 0; overflow: hidden; background: #0d1424; }
        .hv-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hv-video { opacity: 0; transition: opacity 1.2s ease; }
        .hv-video.on { opacity: 1; }
        .hv-scrim { position: absolute; inset: 0; z-index: 1; pointer-events: none; background:
          linear-gradient(90deg, rgba(8,14,28,.82) 0%, rgba(8,14,28,.55) 38%, rgba(8,14,28,.12) 72%, rgba(8,14,28,.25) 100%),
          linear-gradient(180deg, rgba(8,14,28,.55) 0%, transparent 22%, transparent 70%, rgba(8,14,28,.75) 100%); }
        .hv-bar { position: absolute; left: max(24px, calc((100% - 1280px) / 2)); bottom: 30px; z-index: 3; display: flex; align-items: center; gap: 14px; color: #fff; }
        .hv-chapter { display: flex; flex-direction: column; align-items: flex-start; gap: 7px; min-width: 150px; order: 2; }
        .hv-label { font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.9); text-shadow: 0 1px 8px rgba(0,0,0,.5); }
        .hv-track { width: 150px; height: 2px; background: rgba(255,255,255,.22); border-radius: 2px; overflow: hidden; }
        .hv-track span { display: block; height: 100%; background: #E8956B; transform-origin: left; transform: scaleX(0); }
        .hv-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.4); background: rgba(8,14,28,.35); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); transition: background .25s ease, border-color .25s ease; }
        .hv-btn:hover { background: rgba(8,14,28,.6); border-color: rgba(255,255,255,.75); }
        @media (max-width: 1100px) {
          .hv-scrim { background: linear-gradient(180deg, rgba(8,14,28,.6) 0%, rgba(8,14,28,.45) 40%, rgba(8,14,28,.55) 70%, rgba(8,14,28,.85) 100%); }
        }
        @media (max-width: 640px) {
          .hv-bar { left: 16px; bottom: 16px; }
          .hv-chapter { display: none; }
        }
      `}</style>
      <picture>
        {mobilePosterSet && <source media="(max-width: 768px)" srcSet={mobilePosterSet} sizes="100vw" />}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img {...deskPoster} className="hv-media" />
      </picture>
      {src && (
        <video
          key={src}
          ref={videoRef}
          className={`hv-media hv-video ${playing ? 'on' : ''}`}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={onTime}
        >
          <source src={`${src}.mp4`} type="video/mp4" />
          <source src={`${src}.webm`} type="video/webm" />
        </video>
      )}
      <div className="hv-scrim" />
      <div className="hv-bar">
        <div className="hv-chapter" aria-live="off">
          <span className="hv-label">{chapters[chapter]?.label}</span>
          <span className="hv-track"><span ref={barRef} /></span>
        </div>
        <button type="button" className="hv-btn" onClick={toggle} aria-label={playing ? pauseLabel : playLabel} aria-pressed={!playing}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" rx="1" /><rect x="8.5" y="1" width="3.5" height="12" rx="1" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3 1.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 3 1.5z" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
