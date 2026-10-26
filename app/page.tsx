import HomeClient from './HomeClient';
import { Journal } from './components/home/Sections';
import { getBlogEntries } from './blog/blogCatalog';

export default function Home() {
  const articles = getBlogEntries().slice(0, 4).map(article => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    cover: article.cover,
    category: article.category,
    date: new Date(`${article.dateISO}T12:00:00Z`).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
    }),
  }));
  return <HomeClient journal={
    <Journal
      eyebrow="The Journal · Fresh from Türkiye"
      title="A little local knowledge."
      accent="Before you go."
      allLabel="All stories & guides"
      readLabel="Read"
      items={articles}
    />
  } />;
}
