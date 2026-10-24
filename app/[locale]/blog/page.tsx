import { notFound } from 'next/navigation';
import { getBlogEntries, localeFromPath } from '../../blog/blogCatalog';
import LocalizedBlogIndex from '../../blog/LocalizedBlogIndex';
import { contentIndexMetadata } from '../../blog/contentPresentation';

type Props = { params: Promise<{ locale: string }> };
const paths = ['zh-cn', 'ko', 'es'];

export function generateStaticParams() {
  return paths.filter((path) => getBlogEntries(localeFromPath(path)!).length).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale: path } = await params;
  const locale = localeFromPath(path);
  if (!locale || !paths.includes(path) || !getBlogEntries(locale).length) notFound();
  return contentIndexMetadata(locale);
}

export default async function BlogPage({ params }: Props) {
  const { locale: path } = await params;
  const locale = localeFromPath(path);
  if (!locale || !paths.includes(path) || !getBlogEntries(locale).length) notFound();
  return <LocalizedBlogIndex locale={locale} />;
}
