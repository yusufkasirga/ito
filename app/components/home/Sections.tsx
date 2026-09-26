import Image from 'next/image';
import Link from 'next/link';
import Icon from '../Icon';
import { destFocus } from '@/lib/imageFocus';

/**
 * Ana sayfanın sunucuda hazırlanan bölümleri (istemciye JS gönderilmez).
 * Metinler çağıran sayfadan gelir; bileşenler yalnız düzen ve görsel dil taşır.
 */

type IconName = 'message' | 'plan' | 'plane' | 'landmark' | 'medical' | 'briefcase' | 'globe' | 'lock' | 'sun' | 'sparkle';

/* ---------------- ÖRNEK ROTALAR ---------------- */

export interface RouteItem {
  days: number;
  title: string;
  text: string;
  photo: string; // dest slug
  stops: { slug: string; name: string }[];
}

export function Routes({ eyebrow, title, accent, copy, note, cta, routes }: {
  eyebrow: string; title: string; accent: string; copy: string; note: string; cta: string; routes: RouteItem[];
}) {
  return (
    <section className="rt" aria-labelledby="rt-title">
      <style>{`
        .rt { padding: 110px 0 100px; background: #071726; color: #fffaf1; }
        .rt-head { display: grid; grid-template-columns: 1.1fr .9fr; gap: 40px; align-items: end; margin-bottom: 46px; }
        .rt .eyebrow { color: #d8b878; }
        .rt h2 { font-family: var(--font-playfair), serif; font-size: clamp(38px, 5.4vw, 74px); line-height: 1; letter-spacing: -.02em; margin: 14px 0 0; font-weight: 800; }
        .rt h2 em { color: #d8b878; font-style: italic; }
        .rt-copy { color: rgba(255,250,241,.72); font-size: 16px; line-height: 1.75; margin: 0; }
        .rt-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .rt-card { position: relative; display: grid; grid-template-columns: 1fr 1.05fr; min-height: 300px; border-radius: 22px; overflow: hidden; background: #0c2238; border: 1px solid rgba(255,250,241,.08); text-decoration: none; color: inherit; transition: border-color .4s, transform .5s var(--fx-ease, ease); }
        .rt-card:hover { border-color: rgba(216,184,120,.5); transform: translateY(-4px); }
        .rt-media { position: relative; overflow: hidden; }
        .rt-media img { transition: transform 1.2s var(--fx-ease, ease); }
        .rt-card:hover .rt-media img { transform: scale(1.07); }
        .rt-days { position: absolute; left: 16px; top: 16px; z-index: 1; background: rgba(7,23,38,.72); backdrop-filter: blur(8px); border: 1px solid rgba(255,250,241,.2); border-radius: 14px; padding: 8px 12px; text-align: center; line-height: 1; }
        .rt-days b { display: block; font-family: var(--font-playfair), serif; font-size: 30px; color: #fffaf1; }
        .rt-days span { font-size: 10px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #d8b878; }
        .rt-body { padding: 26px 26px 24px; display: flex; flex-direction: column; }
        .rt-body h3 { font-family: var(--font-playfair), serif; font-size: 26px; line-height: 1.1; margin: 0 0 10px; }
        .rt-body p { margin: 0 0 18px; font-size: 14.5px; line-height: 1.65; color: rgba(255,250,241,.72); }
        .rt-stops { list-style: none; margin: auto 0 0; padding: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: #fffaf1; }
        .rt-stops li { display: inline-flex; align-items: center; gap: 6px; }
        .rt-stops li + li::before { content: '→'; color: #d8b878; }
        .rt-foot { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: 34px; flex-wrap: wrap; }
        .rt-note { color: rgba(255,250,241,.6); font-size: 13.5px; margin: 0; max-width: 620px; }
        .rt-cta { display: inline-flex; gap: 8px; padding: 14px 26px; border-radius: 999px; background: #E8956B; color: #2a1508; font-weight: 800; font-size: 14px; text-decoration: none; transition: transform .3s, background .3s; }
        .rt-cta:hover { background: #f0a87e; transform: translateY(-2px); }
        @media (max-width: 1000px) { .rt-grid { grid-template-columns: 1fr; } .rt-head { grid-template-columns: 1fr; gap: 14px; } }
        @media (max-width: 560px) { .rt { padding: 80px 0 70px; } .rt-card { grid-template-columns: 1fr; } .rt-media { height: 220px; } }
      `}</style>
      <div className="container">
        <div className="rt-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="rt-title" data-reveal="lines"><span><span>{title}</span></span><span><span><em>{accent}</em></span></span></h2>
          </div>
          <p className="rt-copy" data-reveal>{copy}</p>
        </div>
        <div className="rt-grid">
          {routes.map((r, i) => (
            <Link key={r.title} href="/#contact" className="rt-card" data-reveal style={{ '--d': `${(i % 2) * 120}ms` } as React.CSSProperties}>
              <div className="rt-media">
                <Image src={`/images/dest/${r.photo}.jpg`} alt={`${r.title} — ${r.stops.map((s) => s.name).join(', ')}`} fill sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw" style={{ objectFit: 'cover', objectPosition: destFocus(r.photo) }} />
                <span className="rt-days"><b>{r.days}</b><span>days</span></span>
              </div>
              <div className="rt-body">
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <ol className="rt-stops">{r.stops.map((s) => <li key={s.slug + s.name}>{s.name}</li>)}</ol>
              </div>
            </Link>
          ))}
        </div>
        <div className="rt-foot">
          <p className="rt-note">{note}</p>
          <Link href="/#contact" className="rt-cta">{cta} →</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SEYAHATİNİ PLANLA ---------------- */

export interface PlanItem { icon: IconName; title: string; text: string; href: string }

export function PlanTrip({ eyebrow, title, accent, items, readLabel }: {
  eyebrow: string; title: string; accent: string; items: PlanItem[]; readLabel: string;
}) {
  return (
    <section className="pt" aria-labelledby="pt-title">
      <style>{`
        .pt { padding: 110px 0 100px; background: #fffaf1; }
        .pt h2 { font-family: var(--font-playfair), serif; font-size: clamp(38px, 5.4vw, 72px); line-height: 1; letter-spacing: -.02em; margin: 14px 0 44px; color: #081f35; font-weight: 800; }
        .pt h2 em { color: #8a6d33; font-style: italic; }
        .pt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .pt-card { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 28px 26px 24px; border-radius: 20px; background: #fff; border: 1px solid rgba(8,31,53,.1); text-decoration: none; color: #081f35; overflow: hidden; transition: transform .45s var(--fx-ease, ease), box-shadow .45s, border-color .45s; }
        .pt-card::before { content: ''; position: absolute; inset: auto -40% -60% auto; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(201,169,106,.22), transparent 70%); transition: transform .6s var(--fx-ease, ease); }
        .pt-card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(7,23,38,.12); border-color: rgba(201,169,106,.55); }
        .pt-card:hover::before { transform: scale(1.6); }
        .pt-ic { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; background: #081f35; color: #d8b878; }
        .pt-card h3 { margin: 8px 0 0; font-family: var(--font-playfair), serif; font-size: 23px; line-height: 1.15; }
        .pt-card p { margin: 0; font-size: 14.5px; line-height: 1.65; color: #4a5765; }
        .pt-go { margin-top: auto; padding-top: 8px; font-size: 13px; font-weight: 800; color: #8a6d33; }
        @media (max-width: 960px) { .pt-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 580px) { .pt { padding: 80px 0 70px; } .pt-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="pt-title" data-reveal="lines"><span><span>{title}</span></span><span><span><em>{accent}</em></span></span></h2>
        <div className="pt-grid">
          {items.map((it, i) => (
            <Link key={it.href} href={it.href} className="pt-card" data-reveal style={{ '--d': `${(i % 3) * 90}ms` } as React.CSSProperties}>
              <span className="pt-ic"><Icon name={it.icon} size={22} /></span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
              <span className="pt-go">{readLabel} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- JOURNAL ---------------- */

export interface JournalItem { slug: string; title: string; excerpt: string; cover: string; category: string; date: string }

export function Journal({ eyebrow, title, accent, allLabel, readLabel, items }: {
  eyebrow: string; title: string; accent: string; allLabel: string; readLabel: string; items: JournalItem[];
}) {
  const [first, ...rest] = items;
  if (!first) return null;
  return (
    <section className="jr" aria-labelledby="jr-title">
      <style>{`
        .jr { padding: 110px 0 100px; background: #fff; }
        .jr-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
        .jr h2 { font-family: var(--font-playfair), serif; font-size: clamp(38px, 5.4vw, 72px); line-height: 1; letter-spacing: -.02em; margin: 14px 0 0; color: #081f35; font-weight: 800; }
        .jr h2 em { color: #8a6d33; font-style: italic; }
        .jr-all { color: #8a6d33; font-weight: 800; font-size: 14px; text-decoration: none; }
        .jr-all:hover { text-decoration: underline; text-underline-offset: 4px; }
        .jr-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 22px; }
        .jr-lead { position: relative; display: block; min-height: 520px; border-radius: 22px; overflow: hidden; color: #fffaf1; text-decoration: none; isolation: isolate; }
        .jr-lead img, .jr-mini img { transition: transform 1.2s var(--fx-ease, ease); }
        .jr-lead:hover img, .jr-mini:hover img { transform: scale(1.06); }
        .jr-lead-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(7,23,38,.05) 30%, rgba(7,23,38,.9) 100%); }
        .jr-lead-body { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; padding: 30px; }
        .jr-cat { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #d8b878; margin-bottom: 10px; }
        .jr-lead h3 { font-family: var(--font-playfair), serif; font-size: clamp(26px, 2.6vw, 38px); line-height: 1.1; margin: 0 0 12px; }
        .jr-lead p { margin: 0; color: rgba(255,250,241,.82); font-size: 15px; line-height: 1.65; max-width: 560px; }
        .jr-list { display: grid; gap: 14px; }
        .jr-mini { display: grid; grid-template-columns: 150px 1fr; gap: 18px; align-items: center; padding: 12px; border-radius: 18px; border: 1px solid rgba(8,31,53,.1); text-decoration: none; color: #081f35; transition: border-color .35s, box-shadow .35s, transform .35s; }
        .jr-mini:hover { border-color: rgba(201,169,106,.6); box-shadow: 0 18px 40px rgba(7,23,38,.08); transform: translateY(-3px); }
        .jr-thumb { position: relative; height: 128px; border-radius: 12px; overflow: hidden; }
        .jr-mini .jr-cat { color: #8a6d33; margin-bottom: 6px; }
        .jr-mini h4 { font-family: var(--font-playfair), serif; font-size: 19px; line-height: 1.2; margin: 0 0 8px; }
        .jr-date { font-size: 12.5px; color: #647889; }
        @media (max-width: 960px) { .jr-grid { grid-template-columns: 1fr; } .jr-lead { min-height: 420px; } }
        @media (max-width: 520px) { .jr { padding: 80px 0 70px; } .jr-mini { grid-template-columns: 110px 1fr; } .jr-thumb { height: 100px; } }
      `}</style>
      <div className="container">
        <div className="jr-top">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="jr-title" data-reveal="lines"><span><span>{title}</span></span><span><span><em>{accent}</em></span></span></h2>
          </div>
          <Link href="/blog" className="jr-all">{allLabel} →</Link>
        </div>
        <div className="jr-grid">
          <Link href={`/blog/${first.slug}`} className="jr-lead" data-reveal>
            <Image src={first.cover} alt={first.title} fill sizes="(max-width: 960px) 180vw, 70vw" style={{ objectFit: 'cover' }} />
            <span className="jr-lead-shade" />
            <div className="jr-lead-body">
              <span className="jr-cat">{first.category}</span>
              <h3>{first.title}</h3>
              <p>{first.excerpt}</p>
            </div>
          </Link>
          <div className="jr-list">
            {rest.map((a, i) => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="jr-mini" data-reveal style={{ '--d': `${80 + i * 90}ms` } as React.CSSProperties}>
                <span className="jr-thumb"><Image src={a.cover} alt={a.title} fill sizes="(max-width: 520px) 220px, 300px" style={{ objectFit: 'cover' }} /></span>
                <span>
                  <span className="jr-cat">{a.category}</span>
                  <h4>{a.title}</h4>
                  <span className="jr-date">{a.date} · {readLabel}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- YORUM BANDI (parallax) ---------------- */

export function QuoteBand({ quote, name, meta, photo, alt }: { quote: string; name: string; meta: string; photo: string; alt: string }) {
  return (
    <section className="qb" aria-label={name}>
      <style>{`
        .qb { position: relative; min-height: 78vh; display: flex; align-items: center; overflow: hidden; color: #fffaf1; background: #071726; }
        .qb-bg { position: absolute; inset: -12% 0; }
        .qb-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,23,38,.72), rgba(7,23,38,.55) 50%, rgba(7,23,38,.8)); }
        .qb-in { position: relative; z-index: 1; width: min(980px, calc(100% - 48px)); margin: 0 auto; text-align: center; padding: 110px 0; }
        .qb-mark { font-family: var(--font-playfair), serif; font-size: 120px; line-height: .6; color: #d8b878; display: block; margin-bottom: 18px; }
        .qb blockquote { margin: 0; font-family: var(--font-playfair), serif; font-size: clamp(24px, 3.2vw, 42px); line-height: 1.3; font-weight: 600; }
        .qb-who { margin-top: 28px; font-size: 13px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #d8b878; }
        .qb-who span { display: block; margin-top: 6px; letter-spacing: .08em; text-transform: none; font-weight: 600; color: rgba(255,250,241,.7); }
      `}</style>
      <div className="qb-bg" data-parallax="0.12">
        <Image src={`/images/dest/${photo}.jpg`} alt={alt} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: destFocus(photo) }} />
      </div>
      <span className="qb-shade" />
      <div className="qb-in">
        <span className="qb-mark" aria-hidden="true">“</span>
        <blockquote data-reveal>{quote}</blockquote>
        <div className="qb-who" data-reveal style={{ '--d': '160ms' } as React.CSSProperties}>{name}<span>{meta}</span></div>
      </div>
    </section>
  );
}

/* ---------------- TÜRKİYE KARELERİ (galeri) ---------------- */

export function Gallery({ eyebrow, title, accent, follow, items }: {
  eyebrow: string; title: string; accent: string; follow: string; items: { slug: string; name: string }[];
}) {
  return (
    <section className="gl" aria-labelledby="gl-title">
      <style>{`
        .gl { padding: 110px 0 100px; background: #081f35; color: #fffaf1; }
        .gl-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 38px; flex-wrap: wrap; }
        .gl .eyebrow { color: #d8b878; }
        .gl h2 { font-family: var(--font-playfair), serif; font-size: clamp(38px, 5.4vw, 72px); line-height: 1; letter-spacing: -.02em; margin: 14px 0 0; font-weight: 800; }
        .gl h2 em { color: #d8b878; font-style: italic; }
        .gl-follow { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; border-radius: 999px; border: 1px solid rgba(255,250,241,.3); color: #fffaf1; text-decoration: none; font-weight: 700; font-size: 14px; transition: background .3s, border-color .3s; }
        .gl-follow:hover { background: rgba(255,250,241,.08); border-color: #d8b878; }
        .gl-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; gap: 12px; }
        .gl-item { position: relative; border-radius: 16px; overflow: hidden; color: #fffaf1; text-decoration: none; isolation: isolate; }
        .gl-item:nth-child(1) { grid-column: span 2; grid-row: span 2; }
        .gl-item:nth-child(6) { grid-column: span 2; }
        .gl-item img { transition: transform 1.1s var(--fx-ease, ease), filter .6s; filter: saturate(.92); }
        .gl-item:hover img { transform: scale(1.08); filter: saturate(1.08); }
        .gl-name { position: absolute; left: 14px; bottom: 12px; z-index: 2; font-family: var(--font-playfair), serif; font-size: 20px; font-weight: 700; opacity: 0; transform: translateY(8px); transition: opacity .4s, transform .4s; text-shadow: 0 2px 12px rgba(0,0,0,.6); }
        .gl-item::after { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, transparent 55%, rgba(7,23,38,.75)); opacity: 0; transition: opacity .4s; }
        .gl-item:hover .gl-name, .gl-item:focus-visible .gl-name, .gl-item:hover::after { opacity: 1; transform: none; }
        @media (max-width: 900px) { .gl-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 170px; } .gl-item:nth-child(6) { grid-column: span 1; } .gl-name { opacity: 1; transform: none; font-size: 17px; } .gl-item::after { opacity: 1; } }
        @media (max-width: 520px) { .gl { padding: 80px 0 70px; } }
      `}</style>
      <div className="container">
        <div className="gl-top">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="gl-title" data-reveal="lines"><span><span>{title}</span></span><span><span><em>{accent}</em></span></span></h2>
          </div>
          <a href="https://www.instagram.com/itineraryofturkiye" target="_blank" rel="noopener noreferrer" className="gl-follow"><Icon name="instagram" size={17} /> {follow}</a>
        </div>
        <div className="gl-grid">
          {items.map((g, i) => (
            <Link key={g.slug} href={`/destinations/${g.slug}`} className="gl-item" data-reveal="clip" style={{ '--d': `${(i % 4) * 80}ms` } as React.CSSProperties}>
              <Image src={`/images/dest/${g.slug}.jpg`} alt={`${g.name}, Türkiye`} fill sizes={i === 0 ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 900px) 75vw, 38vw'} style={{ objectFit: 'cover', objectPosition: destFocus(g.slug) }} />
              <span className="gl-name">{g.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
