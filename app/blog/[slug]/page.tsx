import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_URL, whatsAppUrl } from '@/lib/config';
import SiteHeader from '../../components/SiteHeader';
import CityImage from '../../components/CityImage';
import Icon from '../../components/Icon';
import { getArticle, blogSlugs, blogArticles } from '../blogPosts';

export function generateStaticParams() {
  return blogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const authorName = a.author?.name ?? 'Itinerary of Türkiye';
  const authorUrl = new URL(a.author?.url ?? '/about', SITE_URL).toString();
  return {
    title: `${a.title} — Itinerary of Türkiye`,
    description: a.excerpt,
    authors: [{ name: authorName, url: authorUrl }],
    alternates: { canonical: `${SITE_URL}/blog/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.excerpt,
      url: `${SITE_URL}/blog/${a.slug}`,
      type: 'article',
      publishedTime: a.dateISO,
      modifiedTime: a.updatedISO ?? a.dateISO,
      authors: [authorName],
      images: [a.cover],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const curatedRelated = (a.relatedSlugs ?? []).flatMap((relatedSlug) => {
    const article = getArticle(relatedSlug);
    return article ? [article] : [];
  });
  const automaticRelated = blogArticles
    .filter((article) => article.slug !== a.slug && !curatedRelated.some((item) => item.slug === article.slug))
    .sort((x) => (x.category === a.category ? -1 : 1));
  const related = [...curatedRelated, ...automaticRelated].slice(0, 3);
  const dateLabel = new Date(a.dateISO).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const updatedISO = a.updatedISO ?? a.dateISO;
  const updatedLabel = new Date(updatedISO).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const url = `${SITE_URL}/blog/${a.slug}`;
  const author = a.author ?? { name: 'Itinerary of Türkiye', url: '/about', type: 'Organization' as const };
  const authorUrl = new URL(author.url, SITE_URL).toString();
  const sources = a.sources ?? [];
  const places = a.places && a.places.length ? a.places : ['Türkiye'];
  const images = a.images ?? [];

  // Görselleri gövdedeki paragraflara (lede hariç) eşit aralıkla dağıt
  const pIdx = a.body.map((s, i) => (s.type === 'p' ? i : -1)).filter((i) => i >= 0).slice(1);
  const placeAfter = new Map<number, number>();
  images.forEach((_, k) => {
    let pos = pIdx[Math.floor(((k + 1) / (images.length + 1)) * pIdx.length)] ?? pIdx[pIdx.length - 1];
    while (placeAfter.has(pos)) pos += 1;
    placeAfter.set(pos, k);
  });

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    image: [`${SITE_URL}${a.cover}`, ...images.map((i) => `${SITE_URL}${i}`)],
    datePublished: a.dateISO,
    dateModified: updatedISO,
    inLanguage: 'en',
    articleSection: a.category,
    keywords: [a.category, ...places].join(', '),
    author: { '@type': author.type ?? 'Organization', name: author.name, url: authorUrl },
    citation: sources.map((source) => source.url),
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Itinerary of Türkiye', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    about: places.map((pl) => ({ '@type': 'Place', name: pl })),
    spatialCoverage: places.map((pl) => ({ '@type': 'Place', name: pl })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'The Journal', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: a.shortTitle, item: url },
    ],
  };

  return (
    <main className="ar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        .ar { font-family: 'Inter', system-ui, sans-serif; background: #fffaf1; color: #2b3742; }
        .ar * { box-sizing: border-box; }

        /* HERO — full-bleed foto */
        .ar-hero { position: relative; min-height: clamp(380px, 56vh, 560px); display: flex; align-items: flex-end; overflow: hidden; }
        .ar-hero-tint { position: absolute; inset: 0; z-index: 2; background:
          linear-gradient(180deg, rgba(7,23,38,.30) 0%, rgba(7,23,38,.30) 40%, rgba(7,23,38,.9) 100%),
          linear-gradient(115deg, ${a.accent}66 0%, transparent 55%); }
        .ar-hero-in { position: relative; z-index: 3; max-width: 1160px; margin: 0 auto; width: 100%; padding: 0 40px 52px; color: #fffaf1; }
        .ar-crumb { display: inline-block; color: rgba(255,250,241,.85); font-size: 12px; font-weight: 800; letter-spacing: .04em; text-decoration: none; }
        .ar-crumb:hover { color: #d8b878; }
        .ar-cat { display: block; margin-top: 18px; font-size: 11.5px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; color: #d8b878; }
        .ar-h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5.2vw, 54px); line-height: 1.06; margin: 10px 0 14px; max-width: 15ch; letter-spacing: -.01em; }
        .ar-meta { font-size: 13px; color: rgba(255,250,241,.78); font-weight: 600; letter-spacing: .02em; }

        /* İKİ SÜTUN */
        .ar-shell { max-width: 1160px; margin: 0 auto; padding: 64px 40px 24px; display: grid; grid-template-columns: minmax(0,1fr) 340px; gap: 64px; align-items: start; }
        .ar-body { min-width: 0; max-width: 680px; }
        .ar-body h2 { font-family: 'Playfair Display', serif; font-size: clamp(22px, 2.6vw, 29px); color: #081f35; margin: 44px 0 14px; line-height: 1.22; letter-spacing: -.01em; }
        .ar-body h2:first-child { margin-top: 0; }
        .ar-body p { font-size: 17.5px; line-height: 1.85; color: #33414d; margin: 0 0 20px; }
        .ar-body p.lede { font-size: 20px; line-height: 1.72; color: #1e2a35; }
        .ar-body p.lede::first-letter { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 3.6em; line-height: .78; float: left; padding: 8px 14px 2px 0; color: #8a6d33; }
        .ar-body ul { margin: 6px 0 22px; padding: 0; list-style: none; }
        .ar-body ul li { position: relative; font-size: 17px; line-height: 1.6; color: #33414d; padding: 7px 0 7px 26px; border-bottom: 1px solid rgba(8,31,53,.07); }
        .ar-body ul li:last-child { border-bottom: none; }
        .ar-body ul li::before { content: ''; position: absolute; left: 4px; top: 15px; width: 7px; height: 7px; border-radius: 50%; background: #8a6d33; }
        .ar-figure { margin: 38px 0; border-radius: 16px; overflow: hidden; position: relative; aspect-ratio: 3/2; border: 1px solid rgba(8,31,53,.1); }
        .ar-figure .cap { position: absolute; left: 0; right: 0; bottom: 0; z-index: 3; padding: 14px 18px; font-size: 12.5px; color: rgba(255,250,241,.9); background: linear-gradient(180deg, transparent, rgba(7,23,38,.7)); }
        .ar-pull { margin: 34px 0; padding: 8px 0 8px 24px; border-left: 3px solid ${a.accent}; font-family: 'Playfair Display', serif; font-size: 23px; line-height: 1.4; color: #081f35; }
        .ar-sources { margin-top: 46px; padding-top: 28px; border-top: 1px solid rgba(8,31,53,.14); }
        .ar-sources h2 { margin-top: 0; }
        .ar-sources a { color: #6f5525; font-weight: 700; text-underline-offset: 3px; }
        .ar-sources .note { font-size: 13.5px; line-height: 1.65; color: #647889; margin-top: 14px; }

        /* SAĞ ASIDE — yapışkan */
        .ar-aside { position: sticky; top: 110px; display: flex; flex-direction: column; gap: 18px; }
        .ar-card { border: 1px solid rgba(8,31,53,.12); border-radius: 16px; overflow: hidden; background: #fff; }
        .ar-card-top { background: linear-gradient(165deg, #071726, #0c3555); color: #fffaf1; padding: 22px; }
        .ar-card-top .k { font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; color: #d8b878; }
        .ar-card-top h3 { font-family: 'Playfair Display', serif; font-size: 20px; margin: 8px 0 8px; line-height: 1.2; }
        .ar-card-top p { font-size: 13.5px; line-height: 1.6; color: rgba(255,250,241,.82); margin: 0 0 14px; }
        .ar-wa { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 999px; background: #c9a96a; color: #081f35; font-weight: 800; font-size: 13.5px; text-decoration: none; }
        .ar-facts { padding: 16px 20px; }
        .ar-fact { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(8,31,53,.07); font-size: 13px; }
        .ar-fact:last-child { border-bottom: none; }
        .ar-fact .l { color: #647889; } .ar-fact .v { color: #081f35; font-weight: 700; text-align: right; }
        .ar-rel { border: 1px solid rgba(8,31,53,.12); border-radius: 16px; background: #fff; padding: 18px 20px; }
        .ar-rel-h { font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; color: #8a6d33; margin-bottom: 12px; }
        .ar-rel a { display: block; text-decoration: none; padding: 9px 0; border-bottom: 1px solid rgba(8,31,53,.07); }
        .ar-rel a:last-child { border-bottom: none; }
        .ar-rel .rc { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #8a6d33; }
        .ar-rel .rt { font-family: 'Playfair Display', serif; font-size: 15.5px; color: #081f35; line-height: 1.25; margin-top: 2px; }

        /* Alt CTA bandı */
        .ar-cta { background: linear-gradient(165deg, #071726 0%, #0c3555 100%); color: #fffaf1; margin-top: 48px; padding: 56px 0; }
        .ar-cta-in { max-width: 1040px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 42px; align-items: center; }
        .ar-cta .k { color: #d8b878; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .ar-cta h2 { font-family: 'Playfair Display', serif; font-size: 30px; margin: 10px 0 12px; line-height: 1.1; }
        .ar-cta p { font-size: 15.5px; line-height: 1.8; color: rgba(255,250,241,.82); }

        /* EN ALT — Diğer bloglar (kapak görselli kart ızgarası) */
        .ar-more { background: #071726; padding: 58px 0 66px; border-top: 1px solid rgba(255,250,241,.08); }
        .ar-more-in { max-width: 1160px; margin: 0 auto; padding: 0 40px; }
        .ar-more-h { font-size: 11px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; color: #d8b878; }
        .ar-more-t { font-family: 'Playfair Display', serif; font-size: 28px; color: #fffaf1; margin: 6px 0 26px; letter-spacing: -.01em; }
        .ar-more-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .ar-more-card { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 286px; border-radius: 16px; overflow: hidden; text-decoration: none; color: #fffaf1; border: 1px solid rgba(255,250,241,.09); transition: transform .25s ease, border-color .25s ease; }
        .ar-more-card:hover { transform: translateY(-4px); border-color: rgba(216,184,120,.45); }
        .ar-more-card .ov { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(7,23,38,.12) 0%, rgba(7,23,38,.55) 52%, rgba(7,23,38,.95) 100%); }
        .ar-more-card .bd { position: relative; z-index: 2; padding: 22px; }
        .ar-more-card .cat { font-size: 10.5px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #d8b878; }
        .ar-more-card .ti { font-family: 'Playfair Display', serif; font-size: 20px; line-height: 1.16; margin: 9px 0 9px; }
        .ar-more-card .ex { font-size: 13px; line-height: 1.55; color: rgba(255,250,241,.8); margin-bottom: 13px; }
        .ar-more-card .go { font-size: 12.5px; font-weight: 800; color: #d8b878; }
        @media (max-width: 940px) { .ar-more-in { padding: 0 24px; } }

        @keyframes ar-rise { from { opacity: 0; transform: translateY(14px);} to { opacity: 1; transform: none; } }
        .ar-hero-in { animation: ar-rise .6s cubic-bezier(.2,.7,.3,1) both; }
        @media (prefers-reduced-motion: reduce){ .ar-hero-in { animation: none; } }

        @media (max-width: 940px) {
          .ar-shell { grid-template-columns: 1fr; gap: 34px; padding: 40px 24px 10px; }
          .ar-aside { position: static; }
          .ar-hero-in, .ar-cta-in { padding-left: 24px; padding-right: 24px; }
          .ar-cta-in { grid-template-columns: 1fr; gap: 26px; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <SiteHeader />

      <section className="ar-hero">
        <CityImage slug={a.slug} accent={a.accent} alt={`${a.title} — ${a.category} in Türkiye`} primary={`/images/blog/${a.slug}.jpg`} fallback={a.cover} priority />
        <span className="ar-hero-tint" />
        <div className="ar-hero-in">
          <Link href="/blog" className="ar-crumb">← The Journal</Link>
          <span className="ar-cat">{a.category}</span>
          <h1 className="ar-h1">{a.title}</h1>
          <p className="ar-meta">
            By <a href={author.url} style={{ color: 'inherit' }}>{author.name}</a> · Published {dateLabel}
            {updatedISO !== a.dateISO ? ` · Updated ${updatedLabel}` : ''} · {a.readTime}
          </p>
        </div>
      </section>

      <div className="ar-shell">
        <article className="ar-body">
          {(() => {
            let ledeUsed = false;
            const nodes: React.ReactNode[] = [];
            a.body.forEach((s, i) => {
              if (s.type === 'h2') { nodes.push(<h2 key={i}>{s.text}</h2>); return; }
              if (s.type === 'ul') { nodes.push(<ul key={i}>{s.items.map((it, j) => <li key={j}>{it}</li>)}</ul>); return; }
              const isLede = !ledeUsed;
              if (isLede) ledeUsed = true;
              nodes.push(<p key={i} className={isLede ? 'lede' : undefined}>{s.text}</p>);
              if (placeAfter.has(i)) {
                const k = placeAfter.get(i)!;
                const cap = places[Math.min(k + 1, places.length - 1)] || 'Türkiye';
                nodes.push(
                  <figure key={`fig-${i}`} className="ar-figure">
                    <CityImage slug={`${a.slug}-${k + 1}`} accent={a.accent} alt={`${a.title} — ${cap}, Türkiye`} primary={`/images/blog/${a.slug}-${k + 1}.jpg`} fallback={images[k]} />
                  </figure>
                );
              }
            });
            return nodes;
          })()}

          {sources.length > 0 && (
            <section className="ar-sources" aria-labelledby="article-sources">
              <h2 id="article-sources">Sources and further reading</h2>
              <ul>
                {sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                    {source.publisher ? ` — ${source.publisher}` : ''}
                  </li>
                ))}
              </ul>
              <p className="note">
                Access conditions, schedules and prices can change. Check the linked official source before travelling.
                Read our <Link href="/editorial-policy">editorial and review policy</Link>.
              </p>
            </section>
          )}
        </article>

        <aside className="ar-aside">
          <div className="ar-card">
            <div className="ar-card-top">
              <span className="k">Work with us</span>
              <h3>Make this effortless.</h3>
              <p>We plan it privately, verify every provider, and stay by your side — paid by you, never by commission.</p>
              <a className="ar-wa" href={whatsAppUrl(`Hello, I read your article "${a.title}" and would like to talk.`)} target="_blank" rel="noopener noreferrer" data-wa-source="blog_aside">
                <Icon name="whatsapp" size={16} /> Message us
              </a>
            </div>
            <div className="ar-facts">
              <div className="ar-fact"><span className="l">Topic</span><span className="v">{a.category}</span></div>
              <div className="ar-fact"><span className="l">Read time</span><span className="v">{a.readTime}</span></div>
              <div className="ar-fact"><span className="l">Our approach</span><span className="v"><a href="/how-we-work" style={{ color: '#8a6d33' }}>How we work →</a></span></div>
            </div>
          </div>
        </aside>
      </div>

      <section className="ar-more">
        <div className="ar-more-in">
          <div className="ar-more-h">Keep reading</div>
          <div className="ar-more-t">More from The Journal</div>
          <div className="ar-more-grid">
            {related.map((r) => (
              <a key={r.slug} href={`/blog/${r.slug}`} className="ar-more-card">
                <CityImage slug={r.slug} accent={r.accent} alt={`${r.title} — ${r.category} in Türkiye`} primary={`/images/blog/${r.slug}.jpg`} fallback={r.cover} />
                <span className="ov" />
                <div className="bd">
                  <span className="cat">{r.category}</span>
                  <div className="ti">{r.title}</div>
                  <div className="ex">{r.excerpt.length > 108 ? r.excerpt.slice(0, 108).trimEnd() + '…' : r.excerpt}</div>
                  <span className="go">Read article →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="ar-cta">
        <div className="ar-cta-in">
          <div>
            <span className="k">Planning this yourself?</span>
            <h2>Let us take it from here.</h2>
            <p>Whatever brought you to this page — a treatment, a trip, a property — tell us and a real person replies within hours.</p>
          </div>
          <div>
            <a className="ar-wa" href="/contact" style={{ background: '#c9a96a' }}>Start planning →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
