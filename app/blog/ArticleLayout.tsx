import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ContentLocale } from '@/lib/blog-content.mjs';
import { whatsAppUrl } from '@/lib/config';
import SiteHeader from '../components/SiteHeader';
import CityImage from '../components/CityImage';
import Icon from '../components/Icon';
import { blogPath, getBlogLanguages, type BlogEntry } from './blogCatalog';
import BlogLanguageLinks from './BlogLanguageLinks';
import TurkiyeInfographic from './TurkiyeInfographic';
import { articleCopy } from './articleCopy';

export type ArticleBlock =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'figure'; src: string; alt: string };

export type ArticleView = {
  locale: ContentLocale;
  slug: string;
  title: string;
  category: string;
  accent: string;
  heroPrimary: string;
  heroFallback: string;
  dateISO: string;
  updatedISO?: string;
  readTime: string;
  author: { name: string; url: string };
  blocks: ArticleBlock[];
  images?: string[];
  places?: string[];
  faq?: { q: string; a: string }[];
  sources?: { title: string; url: string; publisher?: string }[];
  guides?: { slug: string; name: string }[];
  related: BlogEntry[];
  jsonLd: object[];
};

/** Renders `[text](href)` links inside article text; only same-site paths and http(s) URLs become links. */
export function inline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const href = match[2].replace(/^(https:\/\/itineraryofturkiye\.com)?(\/de)?\/blogs(?=\/|[?#]|$)/, '$1$2/blog');
    const external = /^https?:\/\//i.test(href) && !/^https:\/\/(www\.)?itineraryofturkiye\.com/i.test(href);
    const safe = (href.startsWith('/') && !href.startsWith('//')) || /^https?:\/\//i.test(href);
    if (!safe) return match[1];
    return <a key={index} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{match[1]}</a>;
  });
}

/** Converts the legacy string-block format ("## ", "- ", "| ", "![]()", paragraph) into article blocks. */
export function blocksFromStrings(content: string[]): ArticleBlock[] {
  return content.map((block): ArticleBlock => {
    if (block.startsWith('## ')) return { type: 'h2', text: block.slice(3) };
    const figure = block.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (figure) return { type: 'figure', alt: figure[1], src: figure[2] };
    if (block.startsWith('| ')) {
      const rows = block.split('\n').map((row) => row.split('|').map((cell) => cell.trim()).filter(Boolean)).filter((row) => !row.every((cell) => /^:?-{2,}:?$/.test(cell)));
      const [head = [], ...body] = rows;
      return { type: 'table', head, rows: body };
    }
    if (block.startsWith('- ')) return { type: 'ul', items: block.split('\n').map((item) => item.replace(/^- /, '')) };
    return { type: 'p', text: block };
  });
}

export default function ArticleLayout({ view }: { view: ArticleView }) {
  const { locale, accent } = view;
  const copy = articleCopy[locale];
  const date = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString(copy.dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const updatedISO = view.updatedISO ?? view.dateISO;
  const images = view.images ?? [];
  const places = view.places && view.places.length ? view.places : ['Türkiye'];
  const faq = view.faq ?? [];
  const sources = view.sources ?? [];
  const guides = view.guides ?? [];
  const languageCount = Object.keys(getBlogLanguages(view.slug)).filter((key) => key !== 'x-default').length;
  const contactHref = locale === 'de' ? '/de#contact' : '/contact';

  // Spread optional inline images evenly between paragraphs (after the lede).
  const paragraphIndexes = view.blocks.map((block, index) => (block.type === 'p' ? index : -1)).filter((index) => index >= 0).slice(1);
  const placeAfter = new Map<number, number>();
  images.forEach((_, k) => {
    let position = paragraphIndexes[Math.floor(((k + 1) / (images.length + 1)) * paragraphIndexes.length)] ?? paragraphIndexes[paragraphIndexes.length - 1];
    while (placeAfter.has(position)) position += 1;
    placeAfter.set(position, k);
  });

  let ledeUsed = false;
  const body: ReactNode[] = [];
  view.blocks.forEach((block, i) => {
    if (block.type === 'h2') { body.push(<h2 key={i}>{block.text}</h2>); return; }
    if (block.type === 'ul') { body.push(<ul key={i}>{block.items.map((item, j) => <li key={j}>{inline(item)}</li>)}</ul>); return; }
    if (block.type === 'table') {
      body.push(
        <div key={i} className="ar-table-wrap">
          <table className="ar-table">
            <thead><tr>{block.head.map((cell, j) => <th key={j}>{inline(cell)}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}>{inline(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      return;
    }
    if (block.type === 'figure') {
      body.push(
        <figure key={i} className="ar-inline-fig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} loading="lazy" />
          {block.alt && <figcaption>{block.alt}</figcaption>}
        </figure>,
      );
      return;
    }
    const isLede = !ledeUsed;
    ledeUsed = true;
    body.push(<p key={i} className={isLede ? 'lede' : undefined}>{inline(block.text)}</p>);
    if (placeAfter.has(i)) {
      const k = placeAfter.get(i)!;
      const caption = places[Math.min(k + 1, places.length - 1)] || 'Türkiye';
      body.push(
        <figure key={`fig-${i}`} className="ar-figure">
          <CityImage slug={`${view.slug}-${k + 1}`} accent={accent} alt={`${view.title} — ${caption}, Türkiye`} primary={`/images/blog/${view.slug}-${k + 1}.jpg`} fallback={images[k]} />
        </figure>,
      );
    }
  });

  return (
    <main className="ar" lang={locale}>
      <style>{`
        .ar { font-family: var(--font-inter), system-ui, sans-serif; background: #fffaf1; color: #2b3742; }
        .ar * { box-sizing: border-box; }
        .ar-hero { position: relative; min-height: clamp(380px, 56vh, 560px); display: flex; align-items: flex-end; overflow: hidden; }
        .ar-hero-tint { position: absolute; inset: 0; z-index: 2; background:
          linear-gradient(180deg, rgba(7,23,38,.30) 0%, rgba(7,23,38,.30) 40%, rgba(7,23,38,.9) 100%),
          linear-gradient(115deg, ${accent}66 0%, transparent 55%); }
        .ar-hero-in { position: relative; z-index: 3; max-width: 1160px; margin: 0 auto; width: 100%; padding: 0 40px 52px; color: #fffaf1; }
        .ar-crumb { display: inline-block; color: rgba(255,250,241,.85); font-size: 12px; font-weight: 800; letter-spacing: .04em; text-decoration: none; }
        .ar-crumb:hover { color: #d8b878; }
        .ar-cat { display: block; margin-top: 18px; font-size: 11.5px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; color: #d8b878; }
        .ar-h1 { font-family: var(--font-playfair), serif; font-size: clamp(30px, 5.2vw, 54px); line-height: 1.08; margin: 10px 0 14px; max-width: 18ch; letter-spacing: -.01em; overflow-wrap: anywhere; }
        .ar-meta { font-size: 13px; color: rgba(255,250,241,.78); font-weight: 600; letter-spacing: .02em; }
        .ar-shell { max-width: 1160px; margin: 0 auto; padding: 64px 40px 24px; display: grid; grid-template-columns: minmax(0,1fr) 340px; gap: 64px; align-items: start; }
        .ar-body { min-width: 0; max-width: 680px; }
        .ar-langs { margin: -30px 0 26px; color: #6f5525; }
        .ar-body h2 { font-family: var(--font-playfair), serif; font-size: clamp(22px, 2.6vw, 29px); color: #081f35; margin: 44px 0 14px; line-height: 1.22; letter-spacing: -.01em; }
        .ar-body p { font-size: 17.5px; line-height: 1.85; color: #33414d; margin: 0 0 20px; }
        .ar-body p.lede { font-size: 20px; line-height: 1.72; color: #1e2a35; }
        .ar-body p.lede::first-letter { font-family: var(--font-playfair), serif; font-weight: 800; font-size: 3.6em; line-height: .78; float: left; padding: 8px 14px 2px 0; color: #8a6d33; }
        .ar-body a { color: #6f5525; text-underline-offset: 3px; overflow-wrap: anywhere; }
        .ar-body ul { margin: 6px 0 22px; padding: 0; list-style: none; }
        .ar-body ul li { position: relative; font-size: 17px; line-height: 1.6; color: #33414d; padding: 7px 0 7px 26px; border-bottom: 1px solid rgba(8,31,53,.07); }
        .ar-body ul li:last-child { border-bottom: none; }
        .ar-body ul li::before { content: ''; position: absolute; left: 4px; top: 15px; width: 7px; height: 7px; border-radius: 50%; background: #8a6d33; }
        .ar-table-wrap { overflow-x: auto; margin: 10px 0 26px; border: 1px solid rgba(8,31,53,.12); border-radius: 14px; background: #fff; }
        .ar-table { width: 100%; border-collapse: collapse; font-size: 15px; }
        .ar-table th { text-align: left; padding: 12px 16px; background: rgba(201,169,106,.12); color: #081f35; font-weight: 800; border-bottom: 1px solid rgba(8,31,53,.14); }
        .ar-table td { padding: 12px 16px; color: #3a4654; border-bottom: 1px solid rgba(8,31,53,.07); vertical-align: top; }
        .ar-table tr:last-child td { border-bottom: none; }
        .ar-inline-fig { margin: 34px 0; }
        .ar-inline-fig img { width: 100%; height: auto; border-radius: 16px; display: block; }
        .ar-inline-fig figcaption { margin-top: 10px; font-size: 13.5px; color: #647889; text-align: center; font-style: italic; }
        .ar-figure { margin: 38px 0; border-radius: 16px; overflow: hidden; position: relative; aspect-ratio: 3/2; border: 1px solid rgba(8,31,53,.1); }
        .ar-guides { margin-top: 40px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .ar-guides .k { width: 100%; font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; color: #8a6d33; }
        .ar-guides a { display: inline-flex; padding: 9px 16px; border-radius: 999px; border: 1px solid rgba(138,109,51,.35); color: #081f35; font-weight: 700; font-size: 14px; text-decoration: none; }
        .ar-guides a:hover { background: rgba(201,169,106,.14); border-color: #c9a96a; }
        .ar-faq { margin-top: 46px; }
        .ar-faq details { border-bottom: 1px solid rgba(8,31,53,.1); padding: 16px 0; }
        .ar-faq summary { cursor: pointer; font-weight: 800; color: #081f35; font-size: 17px; }
        .ar-faq details p { margin: 10px 0 0; }
        .ar-sources { margin-top: 46px; padding-top: 28px; border-top: 1px solid rgba(8,31,53,.14); }
        .ar-sources h2 { margin-top: 0; }
        .ar-sources a { font-weight: 700; }
        .ar-sources li { font-size: 15.5px; }
        .ar-sources .note { font-size: 13.5px; line-height: 1.65; color: #647889; margin-top: 14px; }
        .ar-aside { position: sticky; top: 110px; display: flex; flex-direction: column; gap: 18px; }
        .ar-card { border: 1px solid rgba(8,31,53,.12); border-radius: 16px; overflow: hidden; background: #fff; }
        .ar-card-top { background: linear-gradient(165deg, #071726, #0c3555); color: #fffaf1; padding: 22px; }
        .ar-card-top .k { font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; color: #d8b878; }
        .ar-card-top h3 { font-family: var(--font-playfair), serif; font-size: 20px; margin: 8px 0 8px; line-height: 1.2; }
        .ar-card-top p { font-size: 13.5px; line-height: 1.6; color: rgba(255,250,241,.82); margin: 0 0 14px; }
        .ar-wa { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 999px; background: #c9a96a; color: #081f35; font-weight: 800; font-size: 13.5px; text-decoration: none; }
        .ar-facts { padding: 16px 20px; }
        .ar-fact { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(8,31,53,.07); font-size: 13px; }
        .ar-fact:last-child { border-bottom: none; }
        .ar-fact .l { color: #647889; } .ar-fact .v { color: #081f35; font-weight: 700; text-align: right; }
        .ar-cta { background: linear-gradient(165deg, #071726 0%, #0c3555 100%); color: #fffaf1; padding: 56px 0; }
        .ar-cta-in { max-width: 1040px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 42px; align-items: center; }
        .ar-cta .k { color: #d8b878; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .ar-cta h2 { font-family: var(--font-playfair), serif; font-size: 30px; margin: 10px 0 12px; line-height: 1.1; }
        .ar-cta p { font-size: 15.5px; line-height: 1.8; color: rgba(255,250,241,.82); }
        .ar-more { background: #071726; padding: 58px 0 66px; border-top: 1px solid rgba(255,250,241,.08); }
        .ar-more-in { max-width: 1160px; margin: 0 auto; padding: 0 40px; }
        .ar-more-h { font-size: 11px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; color: #d8b878; }
        .ar-more-t { font-family: var(--font-playfair), serif; font-size: 28px; color: #fffaf1; margin: 6px 0 26px; letter-spacing: -.01em; }
        .ar-more-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
        .ar-more-card { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 286px; border-radius: 16px; overflow: hidden; text-decoration: none; color: #fffaf1; border: 1px solid rgba(255,250,241,.09); transition: transform .25s ease, border-color .25s ease; }
        .ar-more-card:hover { transform: translateY(-4px); border-color: rgba(216,184,120,.45); }
        .ar-more-card .ov { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(7,23,38,.12) 0%, rgba(7,23,38,.55) 52%, rgba(7,23,38,.95) 100%); }
        .ar-more-card .bd { position: relative; z-index: 2; padding: 22px; }
        .ar-more-card .cat { font-size: 10.5px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #d8b878; }
        .ar-more-card .ti { font-family: var(--font-playfair), serif; font-size: 20px; line-height: 1.16; margin: 9px 0 9px; }
        .ar-more-card .ex { font-size: 13px; line-height: 1.55; color: rgba(255,250,241,.8); margin-bottom: 13px; }
        .ar-more-card .go { font-size: 12.5px; font-weight: 800; color: #d8b878; }
        @keyframes ar-rise { from { opacity: 0; transform: translateY(14px);} to { opacity: 1; transform: none; } }
        .ar-hero-in { animation: ar-rise .6s cubic-bezier(.2,.7,.3,1) both; }
        @media (prefers-reduced-motion: reduce){ .ar-hero-in { animation: none; } .ar-more-card { transition: none; } }
        @media (max-width: 940px) {
          .ar-shell { grid-template-columns: 1fr; gap: 34px; padding: 40px 16px 10px; }
          .ar-aside { position: static; }
          .ar-langs { margin-top: 0; }
          .ar-hero-in, .ar-cta-in, .ar-more-in { padding-left: 16px; padding-right: 16px; }
          .ar-cta-in { grid-template-columns: 1fr; gap: 26px; }
        }
      `}</style>

      {view.jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
      ))}

      <SiteHeader locale={locale === 'de' ? 'de' : 'en'} />

      <section className="ar-hero">
        <CityImage slug={view.slug} accent={accent} alt={`${view.title} — ${view.category}`} primary={view.heroPrimary} fallback={view.heroFallback} priority />
        <span className="ar-hero-tint" />
        <div className="ar-hero-in">
          <Link href={blogPath(locale)} className="ar-crumb">{copy.back}</Link>
          <span className="ar-cat">{view.category}</span>
          <h1 className="ar-h1">{view.title}</h1>
          <p className="ar-meta">
            {copy.by} <a href={view.author.url} style={{ color: 'inherit' }}>{view.author.name}</a> · {copy.published} <time dateTime={view.dateISO}>{date(view.dateISO)}</time>
            {updatedISO !== view.dateISO ? <> · {copy.updated} <time dateTime={updatedISO}>{date(updatedISO)}</time></> : null} · {view.readTime}
          </p>
        </div>
      </section>

      <div className="ar-shell">
        <article className="ar-body">
          {languageCount > 1 && <div className="ar-langs"><BlogLanguageLinks locale={locale} slug={view.slug} /></div>}
          {body}

          {guides.length > 0 && (
            <nav className="ar-guides" aria-label={copy.guides}>
              <span className="k">{copy.guides}</span>
              {guides.map((guide) => <Link key={guide.slug} href={`/destinations/${guide.slug}`}>{guide.name}</Link>)}
            </nav>
          )}

          {faq.length > 0 && (
            <section className="ar-faq" aria-labelledby="article-faq">
              <h2 id="article-faq">{copy.faq}</h2>
              {faq.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{inline(item.a)}</p>
                </details>
              ))}
            </section>
          )}

          {sources.length > 0 && (
            <section className="ar-sources" aria-labelledby="article-sources">
              <h2 id="article-sources">{copy.sources}</h2>
              <ul>
                {sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                    {source.publisher ? ` — ${source.publisher}` : ''}
                  </li>
                ))}
              </ul>
              <p className="note">{copy.sourcesNote} <Link href="/editorial-policy">{copy.policy}</Link>.</p>
            </section>
          )}
        </article>

        <aside className="ar-aside">
          <div className="ar-card">
            <div className="ar-card-top">
              <span className="k">{copy.asideKicker}</span>
              <h3>{copy.asideTitle}</h3>
              <p>{copy.asideText}</p>
              <a className="ar-wa" href={whatsAppUrl(copy.whatsApp(view.title))} target="_blank" rel="noopener noreferrer" data-wa-source="blog_aside">
                <Icon name="whatsapp" size={16} /> {copy.message}
              </a>
            </div>
            <div className="ar-facts">
              <div className="ar-fact"><span className="l">{copy.topic}</span><span className="v">{view.category}</span></div>
              <div className="ar-fact"><span className="l">{copy.readTime}</span><span className="v">{view.readTime}</span></div>
              <div className="ar-fact"><span className="l">{copy.approach}</span><span className="v"><Link href="/how-we-work" style={{ color: '#8a6d33' }}>{copy.howWeWork}</Link></span></div>
            </div>
          </div>
        </aside>
      </div>

      <TurkiyeInfographic locale={locale} stats={{ dateISO: view.dateISO, updatedISO: view.updatedISO, readTime: view.readTime, sourceCount: sources.length, languageCount }} />

      {view.related.length > 0 && (
        <section className="ar-more">
          <div className="ar-more-in">
            <div className="ar-more-h">{copy.moreKicker}</div>
            <div className="ar-more-t">{copy.moreTitle}</div>
            <div className="ar-more-grid">
              {view.related.map((entry) => (
                <Link key={entry.slug} href={blogPath(locale, entry.slug)} className="ar-more-card">
                  <CityImage slug={entry.slug} accent={entry.accent} alt={`${entry.title} — ${entry.category}`} primary={entry.primaryImage} fallback={entry.cover} sizes="(max-width: 700px) 100vw, 380px" />
                  <span className="ov" />
                  <div className="bd">
                    <span className="cat">{entry.category}</span>
                    <div className="ti">{entry.title}</div>
                    <div className="ex">{entry.excerpt.length > 108 ? entry.excerpt.slice(0, 108).trimEnd() + '…' : entry.excerpt}</div>
                    <span className="go">{copy.readArticle}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ar-cta">
        <div className="ar-cta-in">
          <div>
            <span className="k">{copy.ctaKicker}</span>
            <h2>{copy.ctaTitle}</h2>
            <p>{copy.ctaText}</p>
          </div>
          <div>
            <Link className="ar-wa" href={contactHref}>{copy.ctaButton}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/** Up to three related entries in the same locale: curated slugs first, then same-category, then newest. */
export function relatedEntries(entries: BlogEntry[], slug: string, category: string, curated: string[] = []): BlogEntry[] {
  const others = entries.filter((entry) => entry.slug !== slug);
  const picked = curated.flatMap((wanted) => others.filter((entry) => entry.slug === wanted));
  const rest = others
    .filter((entry) => !picked.includes(entry))
    .map((entry, order) => ({ entry, order }))
    .sort((a, b) => Number(b.entry.category === category) - Number(a.entry.category === category) || a.order - b.order)
    .map(({ entry }) => entry);
  return [...picked, ...rest].slice(0, 3);
}
