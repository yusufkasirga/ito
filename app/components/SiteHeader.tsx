'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { whatsAppUrl } from '@/lib/config';
import Icon from './Icon';

type Locale = 'en' | 'de' | 'ru';

const copy = {
  en: { travel: 'Explore', health: 'Medical travel', about: 'About us', process: 'Our approach', journal: 'Journal', contact: 'Plan your trip', language: 'Language', navigation: 'Main navigation', open: 'Open menu', close: 'Close menu', menu: 'Explore Türkiye' },
  de: { travel: 'Entdecken', health: 'Medizinreisen', about: 'Über uns', process: 'Unser Ablauf', journal: 'Ratgeber', contact: 'Reise planen', language: 'Sprache', navigation: 'Hauptnavigation', open: 'Menü öffnen', close: 'Menü schließen', menu: 'Die Türkei entdecken' },
  ru: { travel: 'Открыть Турцию', health: 'Лечение', about: 'О нас', process: 'Как мы работаем', journal: 'Гид', contact: 'Планировать поездку', language: 'Язык', navigation: 'Основная навигация', open: 'Открыть меню', close: 'Закрыть меню', menu: 'Откройте Турцию' },
};

const languages: { locale: Locale; label: string; short: string }[] = [
  { locale: 'en', label: 'English', short: 'EN' },
  { locale: 'de', label: 'Deutsch', short: 'DE' },
  { locale: 'ru', label: 'Русский', short: 'RU' },
];

// Only preserve a subpage when that translation actually exists.
const translatedPages: Record<string, Locale[]> = {
  '/': ['en', 'de', 'ru'],
  '/about': ['en', 'de', 'ru'],
  '/services': ['en', 'de', 'ru'],
  '/future-services': ['en', 'de', 'ru'],
  '/blog': ['en', 'de'],
  '/testimonials': ['en', 'de'],
  '/privacy': ['en', 'de'],
  '/terms': ['en', 'de'],
  '/links': ['en', 'de'],
};

function languageHref(pathname: string, target: Locale) {
  const currentLocale = /^\/de(?=\/|$)/.test(pathname) ? 'de' : /^\/ru(?=\/|$)/.test(pathname) ? 'ru' : /^\/(zh-cn|ko|es)(?=\/|$)/.test(pathname) ? null : 'en';
  if (target === currentLocale) return pathname;
  const page = pathname.replace(/^\/(de|ru)(?=\/|$)/, '') || '/';
  const translatedPage = translatedPages[page]?.includes(target) ? page : '/';
  const home = target === 'en' ? '' : `/${target}`;
  return translatedPage === '/' ? home || '/' : `${home}${translatedPage}`;
}

export default function SiteHeader({ locale = 'en', overlay = false }: { locale?: Locale; overlay?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLDetailsElement>(null);
  const menuId = useId();
  const menuTitleId = useId();
  const t = copy[locale];
  const home = locale === 'en' ? '/' : `/${locale}`;
  const sectionHref = (anchor: string) => pathname === home ? `#${anchor}` : `${home}#${anchor}`;
  const links = [
    { label: t.travel, href: sectionHref(locale === 'en' ? 'destinations' : 'tourism') },
    { label: t.health, href: sectionHref('health') },
    { label: t.about, href: sectionHref('about') },
    { label: t.process, href: sectionHref('how-it-works') },
    { label: t.journal, href: locale === 'en' ? sectionHref('journal') : locale === 'de' ? '/de/blog' : '/blog' },
  ];

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  useEffect(() => {
    const closeLanguage = (event: PointerEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) languageRef.current.open = false;
    };
    document.addEventListener('pointerdown', closeLanguage);
    return () => document.removeEventListener('pointerdown', closeLanguage);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus();
    const closeOnDesktop = () => {
      if (window.matchMedia('(min-width: 1100px)').matches) setMobileOpen(false);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      window.removeEventListener('resize', closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      toggle?.focus({ preventScroll: true });
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <header className={`ito-hdr ${overlay ? 'is-overlay' : ''} ${!overlay || scrolled ? 'is-solid' : ''}`}>
      <style>{`
        .ito-hdr { z-index: 90; color: #fffaf1; font-family: var(--font-inter), system-ui, sans-serif; }
        .ito-hdr:not(.is-overlay) { position: sticky; top: 0; }
        .ito-hdr.is-overlay { position: absolute; inset: 0 0 auto; }
        .ito-hdr.is-overlay.is-solid { position: fixed; }
        .ito-hdr .h-full { background: linear-gradient(180deg, rgba(7,23,38,.6), rgba(7,23,38,0)); transition: background .3s ease; }
        .ito-hdr.is-solid .h-full { background: rgba(7,23,38,.94); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(255,250,241,.1); }
        .ito-hdr .h-bar { display: flex; align-items: center; justify-content: space-between; gap: 22px; max-width: 1440px; margin: auto; padding: 15px 32px; }
        .ito-hdr .h-brand { display: inline-flex; align-items: center; gap: 11px; text-decoration: none; flex-shrink: 0; }
        .ito-hdr .h-brand img { display: block; width: 52px; height: 52px; object-fit: contain; border-radius: 50%; padding: 3px; background: #fffdf7; }
        .ito-hdr .h-wm { display: grid; gap: 3px; white-space: nowrap; font-family: var(--font-playfair), Georgia, serif; }
        .ito-hdr .h-wm .l1 { display: block; color: #fffaf1; font-size: 22px; font-weight: 600; line-height: 1.05; letter-spacing: .015em; }
        .ito-hdr .h-wm .l2 { display: block; color: #d8b878; font-size: 16px; line-height: 1.05; font-style: italic; }
        .ito-hdr .h-nav { display: flex; align-items: center; gap: clamp(14px, 1.8vw, 27px); margin-left: auto; }
        .ito-hdr .h-nav a, .ito-hdr .h-contact { color: #fffaf1; text-decoration: none; white-space: nowrap; font-size: 12px; font-weight: 600; transition: color .2s; }
        .ito-hdr .h-nav a:hover { color: #d8b878; }
        .ito-hdr .h-actions { display: flex; align-items: center; gap: 17px; flex-shrink: 0; }
        .ito-hdr .h-contact { border: 1px solid rgba(216,184,120,.7); padding: 12px 18px; border-radius: 999px; }
        .ito-hdr .h-contact:hover { background: #d8b878; color: #071726; }
        .ito-hdr .h-language { position: relative; }
        .ito-hdr .h-language summary { display: flex; align-items: center; gap: 6px; cursor: pointer; min-height: 44px; padding: 0 3px; list-style: none; font-size: 12px; font-weight: 700; }
        .ito-hdr .h-language summary::-webkit-details-marker { display: none; }
        .ito-hdr .h-language summary::after { content: '⌄'; font-size: 13px; margin-top: -4px; }
        .ito-hdr .h-language-options { position: absolute; right: 0; top: calc(100% + 8px); display: grid; min-width: 150px; padding: 7px; background: #071726; border: 1px solid rgba(216,184,120,.3); border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,.3); }
        .ito-hdr .h-language-options a { display: block; color: #fffaf1; padding: 11px; font-size: 14px; text-decoration: none; border-radius: 6px; }
        .ito-hdr .h-language-options a:hover, .ito-hdr .h-language-options a[aria-current] { color: #d8b878; background: rgba(216,184,120,.1); }
        .ito-hdr .h-toggle, .ito-hdr .h-mobile-close { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,250,241,.3); color: #fffaf1; background: transparent; cursor: pointer; }
        .ito-hdr .h-toggle { display: none; }
        .ito-hdr :is(a, button, summary):focus-visible { outline: 2px solid #e8ca91; outline-offset: 5px; }
        .ito-hdr .h-mobile { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 25px max(24px, calc((100vw - 650px) / 2)); overflow-y: auto; border: 0; color: #fffaf1; background: #071726; }
        .ito-hdr .h-mobile::backdrop { background: #071726; }
        .ito-hdr .h-mobile-top { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 32px; }
        .ito-hdr .h-mobile-title { font-family: var(--font-playfair), Georgia, serif; font-size: 23px; font-weight: 400; margin: 0; }
        .ito-hdr .h-mobile nav { display: grid; gap: 3px; }
        .ito-hdr .h-mobile nav a { padding: 11px 0; color: #fffaf1; font-size: clamp(20px, 5vw, 28px); line-height: 1.35; text-decoration: none; }
        .ito-hdr .h-mobile nav a:last-child { color: #d8b878; margin-top: 10px; }
        .ito-hdr .h-mobile-languages { display: flex; flex-wrap: wrap; gap: 6px 20px; margin: 26px 0 15px; padding-top: 22px; border-top: 1px solid rgba(255,250,241,.16); }
        .ito-hdr .h-mobile-languages a { display: inline-flex; align-items: center; min-height: 44px; color: #fffaf1; font-size: 14px; text-decoration: none; }
        .ito-hdr .h-mobile-languages a[aria-current] { color: #d8b878; text-decoration: underline; text-underline-offset: 6px; }
        .ito-hdr .h-mobile-wa { display: inline-flex; align-items: center; gap: 8px; color: #8ed8dc; min-height: 44px; text-decoration: none; font-size: 14px; }
        @media (max-width: 1099px) { .ito-hdr .h-nav, .ito-hdr .h-contact { display: none; } .ito-hdr .h-toggle { display: inline-flex; } .ito-hdr .h-bar { padding: 12px 24px; } }
        @media (max-width: 420px) { .ito-hdr .h-bar { padding: 12px 16px; gap: 12px; } .ito-hdr .h-brand { gap: 8px; } .ito-hdr .h-brand img { width: 42px; height: 42px; } .ito-hdr .h-wm .l1 { font-size: 18px; } .ito-hdr .h-wm .l2 { font-size: 13px; } .ito-hdr .h-actions { gap: 10px; } .ito-hdr .h-language summary { gap: 4px; } }
        @media (prefers-reduced-motion: reduce) { .ito-hdr *, .ito-hdr *::after { transition: none !important; } }
      `}</style>
      <div className="h-full">
        <div className="h-bar">
          <Link className="h-brand" href={sectionHref('top')} aria-label="Itinerary of Türkiye">
            <Image src="/logo.png" alt="" width={52} height={52} />
            <span className="h-wm"><span className="l1">Itinerary</span><span className="l2">of Türkiye</span></span>
          </Link>
          <nav className="h-nav" aria-label={t.navigation}>
            {links.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
          </nav>
          <div className="h-actions">
            <Link className="h-contact" href={sectionHref('contact')}>{t.contact}</Link>
            <details className="h-language" ref={languageRef} onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.currentTarget.open = false;
                event.currentTarget.querySelector('summary')?.focus();
              }
            }}>
              <summary aria-label={`${t.language}: ${languages.find((language) => language.locale === locale)?.label}`}><Icon name="globe" size={16} />{locale.toUpperCase()}</summary>
              <div className="h-language-options">
                {languages.map((language) => <Link key={language.locale} href={languageHref(pathname, language.locale)} lang={language.locale} hrefLang={language.locale} aria-current={locale === language.locale ? 'true' : undefined} onClick={() => { if (languageRef.current) languageRef.current.open = false; }}>{language.label}</Link>)}
              </div>
            </details>
            <button type="button" ref={toggleRef} className="h-toggle" onClick={() => setMobileOpen(true)} aria-label={t.open} aria-expanded={mobileOpen} aria-controls={menuId} aria-haspopup="dialog"><Icon name="menu" size={22} /></button>
          </div>
        </div>
      </div>
      <dialog className="h-mobile" id={menuId} ref={dialogRef} aria-labelledby={menuTitleId} onCancel={close}>
          <div className="h-mobile-top"><h2 className="h-mobile-title" id={menuTitleId}>{t.menu}</h2><button type="button" className="h-mobile-close" ref={closeRef} onClick={close} aria-label={t.close}><Icon name="close" size={22} /></button></div>
          <nav aria-label={t.navigation}>
            {links.map((link) => <Link key={link.label} href={link.href} onClick={close}>{link.label}</Link>)}
            <Link href={sectionHref('contact')} onClick={close}>{t.contact}</Link>
          </nav>
          <div className="h-mobile-languages" aria-label={t.language}>
            {languages.map((language) => <Link key={language.locale} href={languageHref(pathname, language.locale)} lang={language.locale} hrefLang={language.locale} aria-current={locale === language.locale ? 'true' : undefined} onClick={close}>{language.label}</Link>)}
          </div>
          <a className="h-mobile-wa" href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" onClick={close}><Icon name="whatsapp" size={19} />WhatsApp</a>
      </dialog>
    </header>
  );
}
