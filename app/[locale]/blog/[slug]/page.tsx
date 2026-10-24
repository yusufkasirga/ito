import { notFound } from 'next/navigation';
import { getBlogEntries, getBlogContentArticle, localeFromPath } from '../../../blog/blogCatalog';
import ContentBlogArticle from '../../../blog/ContentBlogArticle';
import { contentMetadata } from '../../../blog/contentPresentation';

type Props = { params: Promise<{ locale: string; slug: string }> };
const paths = ['zh-cn', 'ko', 'es'];

export function generateStaticParams() {
  return paths.flatMap((path) => getBlogEntries(localeFromPath(path)!).map(({ slug }) => ({ locale: path, slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale: path, slug } = await params;
  const locale = localeFromPath(path);
  if (!locale || !paths.includes(path)) notFound();
  const article = getBlogContentArticle(locale, slug);
  if (!article) notFound();
  return contentMetadata(article);
}

export default async function BlogPage({ params }: Props) {
  const { locale: path, slug } = await params;
  const locale = localeFromPath(path);
  if (!locale || !paths.includes(path)) notFound();
  const article = getBlogContentArticle(locale, slug);
  if (!article) notFound();
  return <ContentBlogArticle article={article} />;
}
