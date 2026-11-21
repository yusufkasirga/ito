import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLibraryArticle, getLibraryArticles } from '@/lib/library-content.mjs';
import LibraryArticle, { libraryMetadata } from '../../blog/LibraryArticle';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getLibraryArticles('services').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getLibraryArticle('services', (await params).slug);
  return article ? libraryMetadata(article) : {};
}

export default async function ServiceLibraryPage({ params }: Props) {
  const article = getLibraryArticle('services', (await params).slug);
  if (!article) notFound();
  return <LibraryArticle article={article} />;
}
