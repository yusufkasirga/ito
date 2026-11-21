export type LibrarySection = 'blog' | 'services' | 'destinations';
export type LibraryBlock =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'figure'; src: string; alt: string };
export type LibraryImage = { src: string; alt: string; credit?: string; creditUrl?: string; sourceUrl?: string };
export type LibraryArticle = {
  schemaVersion: 1;
  id: string;
  no: number;
  slug: string;
  plannedPath: string;
  status: 'draft' | 'review' | 'published';
  title: string;
  seoTitle: string;
  metaDescription: string;
  quickAnswer: string;
  category: string;
  focusKeyword: string;
  cover: string;
  coverAlt?: string;
  coverCredit?: { name: string; url: string; sourceUrl: string };
  images: LibraryImage[];
  imageIdeas?: string[];
  dateISO: string;
  updatedISO?: string;
  readTime: string;
  medical: boolean;
  body: LibraryBlock[];
  faq: { q: string; a: string }[];
  sources: { title: string; url: string; publisher?: string }[];
  provenance?: string;
};
export const LIBRARY_SECTIONS: LibrarySection[];
export function libraryProblems(article: unknown, filename: string): string[];
export function librarySection(article: LibraryArticle): LibrarySection | undefined;
export function getLibraryArticles(section?: LibrarySection): LibraryArticle[];
export function getLibraryArticle(section: LibrarySection, slug: string): LibraryArticle | undefined;
