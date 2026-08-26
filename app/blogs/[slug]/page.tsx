import type { Metadata } from 'next';
import { getPostBySlug, blogPosts } from '../blogData';
import { getPostBySlugDe } from '../blogDataDe';

const SITE_URL = 'https://itineraryofturkiye.com';

// Gövde metninde [metin](url) biçimindeki iç linkleri render eder.
function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return <a key={i} href={m[2]} className="post-link">{m[1]}</a>;
    return part;
  });
}

// Tüm blog yazıları build sırasında statik üretilir (SEO + hız)
export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

// Her yazı için başlık, açıklama ve OG/Twitter kartları
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Post not found — Itinerary of Türkiye', robots: { index: false } };
  }
  return {
    title: `${post.title} — Itinerary of Türkiye`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blogs/${post.slug}`, ...(getPostBySlugDe(post.slug) ? { languages: { en: `${SITE_URL}/blogs/${post.slug}`, de: `${SITE_URL}/de/blogs/${post.slug}` } } : {}) },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blogs/${post.slug}`,
      siteName: 'Itinerary of Türkiye',
      type: 'article',
      images: [{ url: `${SITE_URL}${post.coverImage}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${SITE_URL}${post.coverImage}`],
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#081f35' }}>Post not found</h1>
        <p style={{ color: '#647889' }}>This blog post does not exist or may have been moved.</p>
        <a href="/blogs" style={{ color: '#c9a96a', fontWeight: 700, textDecoration: 'none' }}>← Back to all posts</a>
      </main>
    );
  }

  const deVersion = getPostBySlugDe(slug);
  const otherPosts = [...blogPosts].sort((a, b) => b.dateISO.localeCompare(a.dateISO)).filter((p) => p.slug !== slug).slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.dateISO,
    dateModified: post.updatedISO ?? post.dateISO,
    author: { '@type': 'Organization', name: 'Itinerary of Türkiye', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Itinerary of Türkiye', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
  };

  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #071726; --navy: #081f35; --navy-2: #0c3555;
          --gold: #c9a96a; --ivory: #fffaf1;
          --muted: #647889; --line: rgba(8,31,53,.14);
          --shadow-sm: 0 2px 8px rgba(7,23,38,.08);
          --shadow-md: 0 8px 24px rgba(7,23,38,.12);
          --shadow-lg: 0 20px 50px rgba(7,23,38,.15);
        }
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,250,241,.95); border-bottom: 1px solid var(--line); backdrop-filter: blur(20px); }
        .nav-inner { max-width: 1240px; margin: 0 auto; height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .brand { text-decoration: none; display: flex; align-items: center; }
        .brand img { height: 84px; width: 84px; object-fit: contain; background: #fffdf7; border-radius: 50%; padding: 6px; box-shadow: 0 2px 12px rgba(0,0,0,.22); }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--gold); }
        .btn-primary { min-height: 44px; padding: 0 22px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.3s; box-shadow: var(--shadow-md); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

        .post-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60; background: linear-gradient(90deg, var(--gold), #e8d5a8); transform-origin: 0 50%; transform: scaleX(0); animation: postProgress linear both; animation-timeline: scroll(root); }
        @keyframes postProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        .post-hero-full { position: relative; height: min(64vh, 560px); min-height: 400px; overflow: hidden; }
        .post-hero-full > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .post-hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,23,38,.25) 0%, rgba(7,23,38,.45) 55%, rgba(7,23,38,.88) 100%); }
        .post-hero-content { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 100%; max-width: 900px; padding: 0 32px 44px; }
        .post-crumbs { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 16px; }
        .post-crumbs a { color: var(--gold); text-decoration: none; }
        .post-crumbs a:hover { text-decoration: underline; }
        .post-crumbs span { color: rgba(255,250,241,.55); }
        .post-title { font-family: 'Playfair Display', serif; font-size: clamp(30px, 4.6vw, 52px); color: #fff; line-height: 1.08; margin-bottom: 16px; text-shadow: 0 2px 24px rgba(0,0,0,.35); }
        .post-meta { display: flex; flex-wrap: wrap; gap: 14px; color: rgba(255,250,241,.75); font-size: 13px; }

        .post-layout { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 56px; padding: 56px 32px 70px; align-items: start; background-image: radial-gradient(rgba(8,31,53,.04) 1px, transparent 1px); background-size: 26px 26px; }
        .post-main { min-width: 0; }
        .post-side { position: sticky; top: 110px; display: flex; flex-direction: column; gap: 22px; }
        .side-card { border: 1px solid var(--line); border-radius: 20px; background: #fff; padding: 22px; box-shadow: var(--shadow-sm); }
        .side-card h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--navy); margin-bottom: 16px; }
        .side-post { display: flex; gap: 12px; align-items: center; text-decoration: none; padding: 7px 0; }
        .side-post img { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
        .side-post span { font-size: 13px; font-weight: 700; color: var(--navy); line-height: 1.4; transition: color .2s; }
        .side-post:hover span { color: var(--gold); }
        .side-cta { background: linear-gradient(135deg, #071726, #0c3555); border: none; }
        .side-eyebrow { display: block; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 10px; }
        .side-cta p { color: rgba(255,250,241,.75); font-size: 13.5px; line-height: 1.7; margin-bottom: 16px; }
        @media (max-width: 1000px) { .post-layout { grid-template-columns: 1fr; gap: 40px; } .post-side { position: static; } }

        .post-body { max-width: 760px; }
        .post-body p { color: #3a4654; font-size: 17px; line-height: 1.95; margin-bottom: 24px; }
        .post-body > p:first-of-type::first-letter { font-family: 'Playfair Display', serif; font-size: 3.6em; font-weight: 800; float: left; line-height: .82; padding: 6px 12px 0 0; color: var(--gold); }
        .post-body h2 { font-family: 'Playfair Display', serif; font-size: 27px; color: var(--navy); margin: 44px 0 16px; }
        .post-body h2::before { content: ''; display: block; width: 44px; height: 3px; border-radius: 2px; background: linear-gradient(90deg, var(--gold), #e8d5a8); margin-bottom: 12px; }
        .post-link { color: #8a6d33; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(201,169,106,.5); }
        .post-link:hover { color: var(--navy); text-decoration-color: var(--navy); }
        .post-list { margin: 0 0 22px 22px; color: #3a4654; font-size: 16px; line-height: 1.9; }
        .post-list li { margin-bottom: 8px; }
        .post-figure { margin: 34px 0; }
        .post-figure img { width: 100%; height: auto; border-radius: 16px; display: block; box-shadow: 0 14px 40px -20px rgba(0,0,0,.45); }
        .post-figure figcaption { margin-top: 10px; font-size: 13.5px; color: var(--muted, #6b7280); text-align: center; font-style: italic; }
        .post-table-wrap { overflow-x: auto; margin: 0 0 26px; border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow-sm); }
        .post-table { width: 100%; border-collapse: collapse; font-size: 14.5px; }
        .post-table th { text-align: left; padding: 12px 16px; background: rgba(201,169,106,.12); color: var(--navy); font-weight: 800; border-bottom: 1px solid var(--line); white-space: nowrap; }
        .post-table td { padding: 12px 16px; color: #3a4654; border-bottom: 1px solid rgba(8,31,53,.07); }
        .post-table tr:last-child td { border-bottom: none; }
        .post-faq { max-width: 760px; margin: 44px 0 0; }
        .post-faq h2 { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--navy); margin-bottom: 20px; }
        .post-faq-item { border: 1px solid var(--line); border-radius: 14px; margin-bottom: 12px; background: #fff; }
        .post-faq-item summary { cursor: pointer; padding: 16px 20px; font-weight: 700; color: var(--navy); font-size: 15px; list-style: none; }
        .post-faq-item summary::-webkit-details-marker { display: none; }
        .post-faq-item summary::after { content: '▾'; float: right; color: var(--gold); }
        .post-faq-item[open] summary::after { content: '▴'; }
        .post-faq-item p { padding: 0 20px 16px; color: #3a4654; font-size: 15px; line-height: 1.8; }

        .post-cta { max-width: 760px; margin: 48px 0 0; }
        .cta-box { padding: 40px; border-radius: 24px; background: linear-gradient(135deg, #071726, #0c3555); text-align: center; }
        .cta-box h3 { font-family: 'Playfair Display', serif; color: #fff; font-size: 24px; margin-bottom: 12px; }
        .cta-box p { color: rgba(255,250,241,.7); font-size: 14px; margin-bottom: 24px; }

        .related { max-width: 1100px; margin: 0 auto; padding: 0 32px 90px; }
        .related h3 { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--navy); margin-bottom: 28px; }
        .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .related-card { display: block; text-decoration: none; border-radius: 18px; overflow: hidden; background: #fff; border: 1px solid var(--line); transition: all 0.3s; }
        .related-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .related-img { height: 160px; }
        .related-img img { width: 100%; height: 100%; object-fit: cover; }
        .related-body { padding: 18px; }
        .related-title { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--navy); font-weight: 800; }

        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }

        @media (max-width: 840px) { .nav-links { gap: 16px; } }
        @media (max-width: 700px) {
          .nav-inner { height: auto; flex-wrap: wrap; padding: 10px 16px; gap: 6px; justify-content: center; }
          .brand img { height: 62px; width: 62px; padding: 5px; }
          .nav-links { flex-wrap: wrap; justify-content: center; gap: 12px 16px; }
          .nav-links a { font-size: 13px; }
        }
        @media (max-width: 600px) {
          .related-grid { grid-template-columns: 1fr; }
          .post-hero-full { height: 54vh; min-height: 340px; }
          .post-hero-content { padding: 0 20px 30px; }
          .post-title { font-size: clamp(26px, 7.5vw, 34px); }
          .post-meta { font-size: 12px; gap: 10px; }
          .post-body { padding: 40px 20px 56px; }
          .post-body p { font-size: 16px; }
          .post-faq { padding: 0 20px 48px; }
          .post-table { font-size: 13px; }
          .post-table th, .post-table td { padding: 10px 12px; }
        }
        a:focus-visible, button:focus-visible { outline: 3px solid #8ed8dc; outline-offset: 2px; border-radius: 6px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/"><img src="/logo.png" alt="Itinerary of Türkiye" /></a>
          <nav className="nav-links">
            <a href="/about">About Us</a>
            <a href="/services">Services</a>
            <a href="/testimonials">Testimonials</a>
            <a href="/#contact">Contact</a>
                      <a href={deVersion ? `/de/blogs/${slug}` : "/de/blogs"} style={{fontWeight:800, opacity:.85}} aria-label="Deutsche Version">DE</a>
          </nav>
        </div>
      </header>

      <div className="post-progress" aria-hidden="true" />

      <section className="post-hero-full">
        <img src={post.coverImage} alt={post.title} fetchPriority="high" />
        <div className="post-hero-overlay" />
        <div className="post-hero-content">
          <nav className="post-crumbs" aria-label="Breadcrumb">
            <span>/</span>
            <span>{post.category}</span>
          </nav>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
            {post.updatedISO && (
              <>
                <span>·</span>
                <span>Last updated: <time dateTime={post.updatedISO}>{new Date(post.updatedISO + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time></span>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="post-layout">
      <div className="post-main">
      <article className="post-body">
        {post.content.map((block, i) => {
          if (block.startsWith('## ')) {
            return <h2 key={i}>{block.replace('## ', '')}</h2>;
          }
          if (block.startsWith('![')) {
            const m = block.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (m) {
              return (
                <figure key={i} className="post-figure">
                  <img src={m[2]} alt={m[1]} loading="lazy" />
                  {m[1] && <figcaption>{m[1]}</figcaption>}
                </figure>
              );
            }
          }
          if (block.startsWith('| ')) {
            const rows = block.split('\n').map((r) => r.split('|').map((c) => c.trim()).filter(Boolean));
            const [head, ...body] = rows;
            return (
              <div key={i} className="post-table-wrap">
                <table className="post-table">
                  <thead><tr>{head.map((c, j) => <th key={j}>{c}</th>)}</tr></thead>
                  <tbody>{body.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
            );
          }
          if (block.startsWith('- ')) {
            return (
              <ul key={i} className="post-list">
                {block.split('\n').map((li, j) => <li key={j}>{renderInline(li.replace(/^- /, ''))}</li>)}
              </ul>
            );
          }
          return <p key={i}>{renderInline(block)}</p>;
        })}
      </article>

      {post.faq && post.faq.length > 0 && (
        <section className="post-faq" aria-labelledby="post-faq-title">
          <h2 id="post-faq-title">Frequently Asked Questions</h2>
          {post.faq.map((f, i) => (
            <details key={i} className="post-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      )}

      <div className="post-cta">
        <div className="cta-box">
          <h3>Ready to start your journey?</h3>
          <p>Tell us what you need in Türkiye and we will take care of everything else.</p>
          <a className="btn-primary" href="/#contact">Request Advisory</a>
        </div>
      </div>
      </div>

      <aside className="post-side">
        <div className="side-card">
          <h3>More from our guides</h3>
          {otherPosts.map((p) => (
            <a key={p.slug} className="side-post" href={`/blogs/${p.slug}`}>
              <img loading="lazy" src={p.coverImage} alt="" />
              <span>{p.title}</span>
            </a>
          ))}
        </div>
        <div className="side-card side-cta">
          <span className="side-eyebrow">Private Advisory</span>
          <p>Planning a trip, treatment or investment in Türkiye? Tell us what you need — a real person replies within hours.</p>
          <a className="btn-primary" href="/#contact">Start your journey</a>
        </div>
      </aside>
      </div>

      {otherPosts.length > 0 && (
        <div className="related">
          <h3>More from our blog</h3>
          <div className="related-grid">
            {otherPosts.slice(0, 2).map((p) => (
              <a key={p.slug} className="related-card" href={`/blogs/${p.slug}`}>
                <div className="related-img"><img loading="lazy" src={p.coverImage} alt={p.title} /></div>
                <div className="related-body">
                  <p className="related-title">{p.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <footer className="footer"><p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/privacy" style={{color:'inherit'}}>Privacy</a> · <a href="/terms" style={{color:'inherit'}}>Terms</a> · <a href="/legal-notice" style={{color:'inherit'}}>Legal Notice</a> · <a href="/future-services" style={{color:'inherit'}}>Future Services</a> · <a href="/blogs" style={{color:'inherit'}}>Guides</a></p></footer>
    </main>
  );
}
