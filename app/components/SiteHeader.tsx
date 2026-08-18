'use client';

import { useState, useEffect } from 'react';
import { whatsAppUrl } from '@/lib/config';
import Icon from './Icon';

/**
 * Tüm sayfalarda kullanılan tek header.
 *
 * `overlay` (ana sayfa): başlangıçta ŞEFFAF — hero degradesinin üstünden geçer,
 * bütünleşik durur; aşağı kaydırınca yarı saydam koyu bara dönüşür (scroll dinleyici).
 * Diğer sayfalar: her zaman yarı saydam koyu bar.
 * Dropdown hover boşluğu köprüyle giderildi (margin yerine padding).
 */
export default function SiteHeader({ locale = 'en', overlay = false }: { locale?: 'en' | 'de' | 'ru'; overlay?: boolean }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  const close = () => setMobileOpen(false);
  const solid = !overlay || scrolled;

  return (
    <div className={`ito-hdr ${overlay ? 'is-overlay' : ''} ${solid ? 'is-solid' : ''}`}>
      <style>{`
        .ito-hdr { z-index: 90; }
        .ito-hdr:not(.is-overlay) { position: sticky; top: 0; }
        .ito-hdr.is-overlay { position: absolute; top: 0; left: 0; right: 0; }
        .ito-hdr.is-overlay.is-solid { position: fixed; }

        .ito-hdr .h-full { transition: background .35s ease, backdrop-filter .35s ease, border-color .35s ease; border-bottom: 1px solid transparent; }
        .ito-hdr.is-solid .h-full { background: rgba(7,23,38,.82); backdrop-filter: blur(14px); border-bottom-color: rgba(255,250,241,.08); }
        /* overlay + tepede: şeffaf, sadece okunabilirlik için ince üst scrim */
        .ito-hdr.is-overlay:not(.is-solid) .h-full { background: linear-gradient(180deg, rgba(7,23,38,.45) 0%, rgba(7,23,38,0) 100%); }

        .ito-hdr .h-bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; max-width: 1200px; margin: 0 auto; padding: 12px 32px; }
        /* Logo kilidi: rozet + serif wordmark (site tipografik diliyle kimliğe bağlanır) */
        .ito-hdr .h-brand { display: inline-flex; align-items: center; gap: 13px; transition: transform .25s ease; }
        .ito-hdr .h-brand:hover { transform: translateY(-1px); }
        .ito-hdr .h-brand img { height: 76px; width: 76px; object-fit: contain; display: block; background: #fffdf7; border-radius: 50%; padding: 5px; box-shadow: 0 2px 12px rgba(0,0,0,.28); }
        .ito-hdr .h-wm { line-height: 1; white-space: nowrap; }
        .ito-hdr .h-wm .l1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 32px; letter-spacing: .01em; color: #fffaf1; text-shadow: 0 1px 8px rgba(0,0,0,.3); }
        .ito-hdr .h-wm .l2 { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600; font-size: 23px; color: #d8b878; margin-top: 4px; }
        @media (max-width: 900px) {
          .ito-hdr .h-brand img { height: 60px; width: 60px; padding: 4px; }
          .ito-hdr .h-wm .l1 { font-size: 25px; }
          .ito-hdr .h-wm .l2 { font-size: 18px; }
        }
        @media (max-width: 400px) { .ito-hdr .h-wm { display: none; } }
        .ito-hdr .h-nav { display: flex; align-items: center; gap: 26px; }
        .ito-hdr .h-nav a { color: rgba(255,250,241,.92); text-decoration: none; font-size: 14px; font-weight: 700; transition: color .2s; white-space: nowrap; text-shadow: 0 1px 8px rgba(0,0,0,.25); }
        .ito-hdr .h-nav a:hover { color: #d8b878; }
        .ito-hdr .h-de { font-weight: 800 !important; opacity: .85; font-size: 13px !important; }
        .ito-hdr .h-drop { position: relative; }
        .ito-hdr .h-drop-trigger { display: inline-flex; align-items: center; gap: 5px; cursor: pointer; }
        .ito-hdr .h-drop-panel { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); padding-top: 14px; z-index: 95; }
        .ito-hdr .h-drop-inner { background: rgba(7,23,38,.98); border: 1px solid rgba(201,169,106,.25); border-radius: 14px; padding: 8px; min-width: 220px; box-shadow: 0 16px 40px rgba(0,0,0,.45); display: flex; flex-direction: column; gap: 2px; }
        .ito-hdr .h-drop-inner a { padding: 11px 14px; border-radius: 9px; font-size: 13.5px; font-weight: 600; text-shadow: none; }
        .ito-hdr .h-drop-inner a:hover { background: rgba(201,169,106,.14); }
        .ito-hdr .h-toggle { display: none; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.28); color: #fff; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; align-items: center; justify-content: center; }
        .ito-hdr .h-mobile { position: fixed; inset: 0; z-index: 120; background: rgba(7,23,38,.98); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px; opacity: 0; pointer-events: none; transition: opacity .3s; }
        .ito-hdr .h-mobile.open { opacity: 1; pointer-events: all; }
        .ito-hdr .h-mobile a, .ito-hdr .h-mobile .h-macc { color: #fffaf1; font-size: 19px; font-weight: 700; text-decoration: none; cursor: pointer; }
        .ito-hdr .h-mobile-close { position: absolute; top: 22px; right: 24px; background: none; border: none; color: #fffaf1; cursor: pointer; }
        .ito-hdr .h-mobile-sub { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 4px; }
        .ito-hdr .h-mobile-sub a { font-size: 16px; color: rgba(255,250,241,.72); }
        @media (max-width: 900px) {
          .ito-hdr .h-nav { display: none; }
          .ito-hdr .h-toggle { display: inline-flex; }
        }
      `}</style>

      <div className="h-full">
        <div className="h-bar">
          <a className="h-brand" href={locale === 'de' ? '/de' : '/'} aria-label="Itinerary of Türkiye">
            <img src="/logo.png" alt="Itinerary of Türkiye" />
            <span className="h-wm"><span className="l1">Itinerary</span><span className="l2">of Türkiye</span></span>
          </a>

          <nav className="h-nav">
            <a href="/about">About Us</a>

            <div className="h-drop" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <a href="/services" className="h-drop-trigger">Services <Icon name="plan" size={13} /></a>
              {servicesOpen && (
                <div className="h-drop-panel">
                  <div className="h-drop-inner">
                    <a href="/services/tourism">Private Travel</a>
                    <a href="/services/medical-tourism">Medical Travel</a>
                  </div>
                </div>
              )}
            </div>

            <a href="/blog">Blog</a>
            <a href="/testimonials">Testimonials</a>
            <a href="/contact">Contact</a>
          </nav>

          <button className="h-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      <div className={`h-mobile ${mobileOpen ? 'open' : ''}`}>
        <button className="h-mobile-close" onClick={close} aria-label="Close menu"><Icon name="close" size={26} /></button>
        <a href="/about" onClick={close}>About Us</a>
        <div style={{ textAlign: 'center' }}>
          <span className="h-macc" onClick={() => setMobileServicesOpen(!mobileServicesOpen)}>Services {mobileServicesOpen ? '▲' : '▼'}</span>
          {mobileServicesOpen && (
            <div className="h-mobile-sub">
              <a href="/services/tourism" onClick={close}>Private Travel</a>
              <a href="/services/medical-tourism" onClick={close}>Medical Travel</a>
            </div>
          )}
        </div>
        <a href="/blog" onClick={close}>Blog</a>
        <a href="/testimonials" onClick={close}>Testimonials</a>
        <a href="/contact" onClick={close}>Contact</a>
        <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }} onClick={close}>WhatsApp</a>
      </div>
    </div>
  );
}
