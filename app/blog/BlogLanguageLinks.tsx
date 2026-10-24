import Link from 'next/link';
import type { ContentLocale } from '@/lib/blog-content.mjs';
import { blogLocales, blogPath, getBlogLanguages } from './blogCatalog';
import { blogCopy, languageNames } from './contentPresentation';

export default function BlogLanguageLinks({ locale, slug = '' }: { locale: ContentLocale; slug?: string }) {
  const languages = getBlogLanguages(slug);
  return (
    <nav aria-label={blogCopy[locale].language} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', margin: '22px 0', fontSize: 14 }}>
      {blogLocales.filter((language) => languages[language]).map((language) => (
        <Link key={language} href={blogPath(language, slug)} hrefLang={language} lang={language} aria-current={language === locale ? 'page' : undefined} style={{ color: 'inherit', fontWeight: language === locale ? 800 : 500, textUnderlineOffset: 4 }}>
          {languageNames[language]}
        </Link>
      ))}
    </nav>
  );
}
