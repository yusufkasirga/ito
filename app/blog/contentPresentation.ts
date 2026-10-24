import type { Metadata } from 'next';
import type { ContentArticle, ContentLocale } from '@/lib/blog-content.mjs';
import { SITE_URL } from '@/lib/config';
import { blogPath, getBlogAlternates, getBlogIndexAlternates } from './blogCatalog';

export const blogCopy = {
  en: { journal: 'The Journal', intro: 'Practical guides for a thoughtful journey through Türkiye.', read: 'Read article', sources: 'Sources and further reading', related: 'More from the Journal', updated: 'Updated', home: 'Home', language: 'Available languages', dateLocale: 'en-GB', ogLocale: 'en_US' },
  de: { journal: 'Reiseratgeber', intro: 'Praktische Ratgeber für eine durchdachte Reise durch die Türkei.', read: 'Artikel lesen', sources: 'Quellen und weiterführende Informationen', related: 'Mehr aus unserem Reiseratgeber', updated: 'Aktualisiert', home: 'Startseite', language: 'Verfügbare Sprachen', dateLocale: 'de-DE', ogLocale: 'de_DE' },
  'zh-CN': { journal: '土耳其旅行指南', intro: '实用旅行指南，助您从容规划土耳其之旅。', read: '阅读文章', sources: '资料来源与延伸阅读', related: '更多旅行指南', updated: '更新日期', home: '首页', language: '可用语言', dateLocale: 'zh-CN', ogLocale: 'zh_CN' },
  ko: { journal: '튀르키예 여행 가이드', intro: '차분하게 튀르키예 여행을 준비하는 데 도움이 되는 실용적인 안내입니다.', read: '글 읽기', sources: '출처 및 참고 자료', related: '다른 여행 가이드', updated: '업데이트', home: '홈', language: '이용 가능한 언어', dateLocale: 'ko-KR', ogLocale: 'ko_KR' },
  es: { journal: 'Guías de viaje', intro: 'Guías prácticas para preparar tu viaje por Turquía con tranquilidad.', read: 'Leer artículo', sources: 'Fuentes y lecturas adicionales', related: 'Más guías de viaje', updated: 'Actualizado', home: 'Inicio', language: 'Idiomas disponibles', dateLocale: 'es-ES', ogLocale: 'es_ES' },
} as const;

export const languageNames: Record<ContentLocale, string> = { en: 'English', de: 'Deutsch', 'zh-CN': '简体中文', ko: '한국어', es: 'Español' };

export function contentMetadata(article: ContentArticle): Metadata {
  const copy = blogCopy[article.locale];
  const image = new URL(article.cover, SITE_URL).toString();
  return {
    title: `${article.title} — Itinerary of Türkiye`,
    description: article.excerpt,
    keywords: article.seo.keywords,
    authors: [{ name: article.author?.name ?? 'Itinerary of Türkiye', url: new URL(article.author?.url ?? '/about', SITE_URL).toString() }],
    alternates: getBlogAlternates(article.slug, article.locale),
    openGraph: {
      title: article.title, description: article.excerpt, url: `${SITE_URL}${blogPath(article.locale, article.slug)}`,
      siteName: 'Itinerary of Türkiye', type: 'article', locale: copy.ogLocale,
      publishedTime: article.dateISO, modifiedTime: article.updatedISO ?? article.dateISO, images: [image],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt, images: [image] },
  };
}

export function contentIndexMetadata(locale: ContentLocale): Metadata {
  const copy = blogCopy[locale];
  return {
    title: `${copy.journal} — Itinerary of Türkiye`, description: copy.intro,
    alternates: getBlogIndexAlternates(locale),
    openGraph: { title: copy.journal, description: copy.intro, url: `${SITE_URL}${blogPath(locale)}`, siteName: 'Itinerary of Türkiye', locale: copy.ogLocale, type: 'website' },
    twitter: { card: 'summary_large_image', title: copy.journal, description: copy.intro, images: ['/og-image.png'] },
  };
}
