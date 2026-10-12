'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useId } from 'react';
import { whatsAppUrl } from '@/lib/config';
import Icon from './Icon';

/**
 * Tüm sayfalarda kullanılan tek header.
 *
 * `overlay` (ana sayfa): başlangıçta ŞEFFAF — hero degradesinin üstünden geçer,
 * bütünleşik durur; aşağı kaydırınca yarı saydam koyu bara dönüşür (scroll dinleyici).
 * Diğer sayfalar: her zaman yarı saydam koyu bar.
 * Ana hizmetler doğrudan görünür; mobil menü klavye odağını içinde tutar.
 */
export default function SiteHeader({ locale = 'en', overlay = false }: { locale?: 'en' | 'de' | 'ru'; overlay?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = menuRef.current?.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>('a, button');
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 1060) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      toggle?.focus();
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);
  const solid = !overlay || scrolled;

  return (
    <div className={`ito-hdr ${overlay ? 'is-overlay' : ''} ${solid ? 'is-solid' : ''}`}>
      <style>{`
        .ito-hdr { z-index: 90; }
        .ito-hdr:not(.is-overlay) { position: sticky; top: 0; }
        .ito-hdr.is-overlay { position: absolute; top: 0; left: 0; right: 0; }
        .ito-hdr.is-overlay.is-solid { position: fixed; }

        .ito-hdr .h-full { transition: background .35s ease, backdrop-filter .35s ease; border-bottom: 0; }
        .ito-hdr.is-solid .h-full { position: relative; background: rgba(7,23,38,.82); backdrop-filter: blur(14px); border-bottom: 0; box-shadow: none; }
        /* Alt kenarda keskin çizgi oluşmasın: header aşağı doğru yumuşakça erisin. */
        .ito-hdr.is-solid .h-full::after { content: ''; position: absolute; left: 0; right: 0; top: 100%; height: 26px; pointer-events: none; background: linear-gradient(180deg, rgba(7,23,38,.55) 0%, rgba(7,23,38,0) 100%); }
        /* overlay + tepede: şeffaf, sadece okunabilirlik için ince üst scrim */
        .ito-hdr.is-overlay:not(.is-solid) .h-full { background: linear-gradient(180deg, rgba(7,23,38,.45) 0%, rgba(7,23,38,0) 100%); }

        .ito-hdr .h-bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; max-width: 1200px; margin: 0 auto; padding: 12px 32px; }
        /* Logo kilidi: rozet + serif wordmark (site tipografik diliyle kimliğe bağlanır) */
        .ito-hdr .h-brand { text-decoration: none; display: inline-flex; align-items: center; gap: 13px; transition: transform .25s ease; }
        .ito-hdr .h-brand:hover { transform: translateY(-1px); }
        .ito-hdr .h-brand img { height: 76px; width: 76px; object-fit: contain; display: block; background: #fffdf7; border-radius: 50%; padding: 5px; box-shadow: 0 2px 12px rgba(0,0,0,.28); }
        .ito-hdr .h-wm { line-height: 1; white-space: nowrap; display: flex; flex-direction: column; }
        .ito-hdr .h-wm .l1 { font-family: var(--font-playfair), Georgia, serif; font-weight: 700; font-size: 32px; letter-spacing: .01em; color: #fffaf1; text-shadow: 0 1px 8px rgba(0,0,0,.3); }
        .ito-hdr .h-wm .l2 { font-family: var(--font-playfair), Georgia, serif; font-style: italic; font-weight: 600; font-size: 23px; color: #d8b878; margin-top: 4px; }
        @media (max-width: 1060px) {
          .ito-hdr .h-brand img { height: 60px; width: 60px; padding: 4px; }
          .ito-hdr .h-wm .l1 { font-size: 25px; }
          .ito-hdr .h-wm .l2 { font-size: 18px; }
        }
        @media (max-width: 400px) { .ito-hdr .h-wm { display: none; } }
        .ito-hdr .h-nav { display: flex; align-items: center; gap: 23px; }
        .ito-hdr .h-nav a { color: rgba(255,250,241,.92); text-decoration: none; font-size: 14px; font-weight: 700; transition: color .2s; white-space: nowrap; text-shadow: 0 1px 8px rgba(0,0,0,.25); }
        .ito-hdr .h-nav a:hover { color: #d8b878; }
        .ito-hdr a:focus-visible, .ito-hdr button:focus-visible { outline: 2px solid #d8b878; outline-offset: 6px; }
        .ito-hdr .h-nav .h-contact { padding: 12px 20px; border: 1px solid rgba(216,184,120,.65); border-radius: 999px; color: #ead3a4; text-shadow: none; }
        .ito-hdr .h-nav .h-contact:hover { background: #d8b878; color: #071726; }
        .ito-hdr .h-toggle { display: none; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.28); color: #fff; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; align-items: center; justify-content: center; }
        .ito-hdr .h-mobile { position: fixed; inset: 0; z-index: 120; background: rgba(7,23,38,.98); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px; overflow-y: auto; padding: 80px 24px 40px; }
        .ito-hdr .h-mobile a { color: #fffaf1; font-size: 19px; font-weight: 700; text-decoration: none; cursor: pointer; }
        .ito-hdr .h-mobile .h-service { font-family: var(--font-playfair), Georgia, serif; font-size: 30px; font-weight: 500; }
        .ito-hdr .h-mobile-close { position: absolute; top: 22px; right: 24px; background: none; border: none; color: #fffaf1; cursor: pointer; }
        @media (max-width: 1060px) {
          .ito-hdr .h-nav { display: none; }
          .ito-hdr .h-toggle { display: inline-flex; }
          .ito-hdr .h-bar { padding: 12px 24px; }
        }
        @media (prefers-reduced-motion: reduce) { .ito-hdr *, .ito-hdr *::after { transition: none !important; } }
      `}</style>

      <div className="h-full">
        <div className="h-bar">
          <Link className="h-brand" href={locale === 'en' ? '/' : `/${locale}`} aria-label="Itinerary of Türkiye">
            <Image src="/logo.png" alt="Itinerary of Türkiye" width={96} height={96} />
            <span className="h-wm"><span className="l1">Itinerary</span><span className="l2">of Türkiye</span></span>
          </Link>

          <nav className="h-nav" aria-label="Main navigation">
            <Link href="/services/medical-tourism">Medical Travel</Link>
            <Link href="/services/tourism">Private Travel</Link>
            <Link href="/how-we-work">How We Work</Link>
            <Link href="/standard">Our Standard</Link>
            <Link href="/contact" className="h-contact">Plan your visit</Link>
          </nav>

          <button ref={toggleRef} className="h-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen} aria-controls={menuId}>
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id={menuId} ref={menuRef} className="h-mobile" aria-label="Mobile navigation" role="dialog" aria-modal="true">
          <button className="h-mobile-close" onClick={close} aria-label="Close menu"><Icon name="close" size={26} /></button>
          <Link href="/services/medical-tourism" className="h-service" onClick={close}>Medical Travel</Link>
          <Link href="/services/tourism" className="h-service" onClick={close}>Private Travel</Link>
          <Link href="/how-we-work" onClick={close}>How We Work</Link>
          <Link href="/standard" onClick={close}>Our Standard</Link>
          <Link href="/contact" onClick={close}>Plan your visit</Link>
          {whatsAppUrl().startsWith('https://wa.me/') && <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{ color: '#d8b878', fontSize: 15 }} onClick={close}>WhatsApp</a>}
        </nav>
      )}
    </div>
  );
}
