import type { Metadata } from 'next';
import { getPostBySlug, blogPosts } from '../blogData';

const SITE_URL = 'https://itineraryofturkiye.com';

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
    alternates: { canonical: `${SITE_URL}/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blogs/${post.slug}`,
      siteName: 'Itinerary of Türkiye',
      type: 'article',
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
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

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { '@type': 'Organization', name: 'Itinerary of Türkiye' },
    publisher: { '@type': 'Organization', name: 'Itinerary of Türkiye', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
  };

  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
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
        .brand img { height: 77px; width: auto; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { color: var(--ink); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--gold); }
        .btn-primary { min-height: 44px; padding: 0 22px; border-radius: 999px; background: linear-gradient(135deg, #0f6ea8, var(--navy-2)); color: #fff; font-size: 13px; font-weight: 800; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.3s; box-shadow: var(--shadow-md); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

        .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--gold); text-decoration: none; font-size: 13px; font-weight: 700; margin: 32px auto 0; max-width: 760px; padding: 0 32px; }

        .post-hero { max-width: 760px; margin: 24px auto 0; padding: 0 32px; }
        .post-cat { display: inline-block; padding: 5px 13px; background: rgba(201,169,106,.1); color: var(--gold); border-radius: 999px; font-size: 11px; font-weight: 800; margin-bottom: 18px; border: 1px solid rgba(201,169,106,.2); }
        .post-title { font-family: 'Playfair Display', serif; font-size: clamp(30px, 5vw, 48px); color: var(--navy); line-height: 1.1; margin-bottom: 18px; }
        .post-meta { display: flex; gap: 16px; color: var(--muted); font-size: 13px; margin-bottom: 32px; }

        .post-cover { max-width: 900px; margin: 0 auto 48px; padding: 0 32px; }
        .post-cover img { width: 100%; height: 420px; object-fit: cover; border-radius: 24px; box-shadow: var(--shadow-lg); }

        .post-body { max-width: 760px; margin: 0 auto; padding: 0 32px 80px; }
        .post-body p { color: #3a4654; font-size: 16.5px; line-height: 1.9; margin-bottom: 22px; }
        .post-body h2 { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--navy); margin: 40px 0 16px; }

        .post-cta { max-width: 760px; margin: 0 auto; padding: 0 32px 80px; }
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
          .brand img { height: 56px; }
          .nav-links { flex-wrap: wrap; justify-content: center; gap: 12px 16px; }
          .nav-links a { font-size: 13px; }
        }
        @media (max-width: 600px) {
          .post-cover img { height: 240px; }
          .related-grid { grid-template-columns: 1fr; }
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
            <a href="/blogs" className="active">Blogs</a>
            <a href="/testimonials">Testimonials</a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
      </header>

      <a className="back-link" href="/blogs">← Back to all posts</a>

      <div className="post-hero">
        <span className="post-cat">{post.category}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      <div className="post-cover">
        <img src={post.coverImage} alt={post.title} />
      </div>

      <article className="post-body">
        {post.content.map((block, i) =>
          block.startsWith('## ') ? (
            <h2 key={i}>{block.replace('## ', '')}</h2>
          ) : (
            <p key={i}>{block}</p>
          )
        )}
      </article>

      <div className="post-cta">
        <div className="cta-box">
          <h3>Ready to start your journey?</h3>
          <p>Tell us what you need in Türkiye and we will take care of everything else.</p>
          <a className="btn-primary" href="/#contact">Request Advisory</a>
        </div>
      </div>

      {otherPosts.length > 0 && (
        <div className="related">
          <h3>More from our blog</h3>
          <div className="related-grid">
            {otherPosts.map((p) => (
              <a key={p.slug} className="related-card" href={`/blogs/${p.slug}`}>
                <div className="related-img"><img src={p.coverImage} alt={p.title} /></div>
                <div className="related-body">
                  <p className="related-title">{p.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <footer className="footer"><p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/future-services" style={{color:'inherit'}}>Future Services</a></p></footer>
    </main>
  );
}
