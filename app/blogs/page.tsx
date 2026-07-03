'use client';

import { blogPosts } from './blogData';

export default function BlogsPage() {
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fffaf1', minHeight: '100vh' }}>
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
        .hero { background: linear-gradient(135deg, #071726 0%, #0c3555 100%); color: #fff; padding: 90px 0 70px; text-align: center; }
        .eyebrow { display: inline-flex; align-items: center; color: var(--gold); font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        .eyebrow::before { content: ''; width: 34px; height: 1px; margin-right: 12px; background: currentColor; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(38px, 6vw, 72px); color: #fff; margin-bottom: 16px; }
        .hero p { color: rgba(255,250,241,.7); font-size: 16px; max-width: 560px; margin: 0 auto; line-height: 1.7; }

        .content { max-width: 1100px; margin: 0 auto; padding: 80px 32px; }
        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .blog-card { display: block; text-decoration: none; border-radius: 22px; overflow: hidden; background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow-sm); transition: all 0.3s; }
        .blog-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: rgba(201,169,106,.3); }
        .blog-img { height: 200px; overflow: hidden; }
        .blog-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .blog-card:hover .blog-img img { transform: scale(1.06); }
        .blog-body { padding: 22px; }
        .blog-cat { display: inline-block; padding: 4px 11px; background: rgba(201,169,106,.1); color: var(--gold); border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 12px; border: 1px solid rgba(201,169,106,.2); }
        .blog-title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 800; color: var(--navy); margin-bottom: 10px; line-height: 1.3; }
        .blog-excerpt { color: var(--muted); font-size: 13.5px; line-height: 1.65; margin-bottom: 14px; }
        .blog-meta { display: flex; justify-content: space-between; font-size: 12px; color: rgba(100,120,137,.8); border-top: 1px solid var(--line); padding-top: 14px; }

        .footer { background: var(--ink); color: rgba(255,250,241,.6); padding: 40px 0; text-align: center; font-size: 13px; }

        @media (max-width: 900px) {
          .nav-links { gap: 16px; }
          .blog-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr; }
          .content { padding: 56px 20px; }
        }
        @media (max-width: 700px) {
          .nav-inner { height: auto; flex-wrap: wrap; padding: 10px 16px; gap: 6px; justify-content: center; }
          .brand img { height: 56px; }
          .nav-links { flex-wrap: wrap; justify-content: center; gap: 12px 16px; }
          .nav-links a { font-size: 13px; }
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

      <section className="hero">
        <div className="eyebrow">Stories & Insights</div>
        <h1>Our Blog</h1>
        <p>Guides, stories and insights about tourism, medical travel, investment and business in Türkiye.</p>
      </section>

      <section className="content">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <a key={post.slug} className="blog-card" href={`/blogs/${post.slug}`}>
              <div className="blog-img"><img src={post.coverImage} alt={post.title} /></div>
              <div className="blog-body">
                <span className="blog-cat">{post.category}</span>
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer"><p>© {new Date().getFullYear()} Itinerary of Türkiye. All rights reserved. · <a href="/future-services" style={{color:'inherit'}}>Future Services</a></p></footer>
    </main>
  );
}
