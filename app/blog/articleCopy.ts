import type { ContentLocale } from '@/lib/blog-content.mjs';

/** UI strings for the shared Journal article layout and the closing infographic panel. */
export const articleCopy: Record<ContentLocale, {
  back: string; by: string; published: string; updated: string; guides: string; faq: string;
  sources: string; sourcesNote: string; policy: string;
  asideKicker: string; asideTitle: string; asideText: string; message: string; whatsApp: (title: string) => string;
  topic: string; readTime: string; approach: string; howWeWork: string;
  moreKicker: string; moreTitle: string; readArticle: string;
  ctaKicker: string; ctaTitle: string; ctaText: string; ctaButton: string;
  dateLocale: string;
  info: {
    kicker: string; title: string;
    cards: { icon: string; label: string; value: string; text: string }[];
    statsTitle: string; statPublished: string; statUpdated: string; statRead: string; statSources: string; statLanguages: string;
  };
}> = {
  en: {
    back: '← The Journal', by: 'By', published: 'Published', updated: 'Updated', guides: 'Destination guides', faq: 'Frequently asked questions',
    sources: 'Sources and further reading', sourcesNote: 'Access conditions, schedules and prices can change. Check the linked official source before travelling.', policy: 'Read our editorial and review policy',
    asideKicker: 'Work with us', asideTitle: 'Make this effortless.', asideText: 'We plan it privately, verify every provider, and stay by your side — paid by you, never by commission.', message: 'Message us',
    whatsApp: (title) => `Hello, I read your article "${title}" and would like to talk.`,
    topic: 'Topic', readTime: 'Read time', approach: 'Our approach', howWeWork: 'How we work →',
    moreKicker: 'Keep reading', moreTitle: 'More from The Journal', readArticle: 'Read article →',
    ctaKicker: 'Planning this yourself?', ctaTitle: 'Let us take it from here.', ctaText: 'Whatever brought you to this page — a treatment, a trip, a property — tell us and a real person replies within hours.', ctaButton: 'Start planning →',
    dateLocale: 'en-GB',
    info: {
      kicker: 'Türkiye at a glance', title: 'Where continents, cultures and centuries meet',
      cards: [
        { icon: '🌉', label: 'Geography', value: 'Europe meets Asia', text: 'Istanbul spans two continents on either side of the Bosphorus strait.' },
        { icon: '🎯', label: 'Multilingual planning', value: 'Five languages', text: 'Our travel guides are written for readers in English, German, Chinese, Korean and Spanish.' },
        { icon: '🏛️', label: 'Historical depth', value: 'A city of 2,600+ years', text: 'The Historic Areas of Istanbul have been a UNESCO World Heritage Site since 1985.' },
      ],
      statsTitle: 'This guide in numbers', statPublished: 'Published', statUpdated: 'Last updated', statRead: 'Read time', statSources: 'Sources cited', statLanguages: 'Languages',
    },
  },
  de: {
    back: '← Reiseratgeber', by: 'Von', published: 'Veröffentlicht', updated: 'Aktualisiert', guides: 'Reiseziele', faq: 'Häufig gestellte Fragen',
    sources: 'Quellen und weiterführende Informationen', sourcesNote: 'Zugangsbedingungen, Fahrpläne und Preise können sich ändern. Prüfen Sie vor der Reise die verlinkte offizielle Quelle.', policy: 'Unsere Redaktions- und Prüfrichtlinie (Englisch)',
    asideKicker: 'Mit uns planen', asideTitle: 'Machen Sie es sich leicht.', asideText: 'Wir planen privat, prüfen jeden Anbieter und sind an Ihrer Seite — bezahlt von Ihnen, nie über Provisionen.', message: 'Nachricht senden',
    whatsApp: (title) => `Hallo, ich habe Ihren Artikel „${title}“ gelesen und möchte gern sprechen.`,
    topic: 'Thema', readTime: 'Lesezeit', approach: 'Unser Ansatz', howWeWork: 'So arbeiten wir →',
    moreKicker: 'Weiterlesen', moreTitle: 'Mehr aus unserem Reiseratgeber', readArticle: 'Artikel lesen →',
    ctaKicker: 'Planen Sie das selbst?', ctaTitle: 'Wir übernehmen ab hier.', ctaText: 'Ob Behandlung, Reise oder Immobilie — sagen Sie uns, was Sie brauchen, und ein echter Mensch antwortet innerhalb weniger Stunden.', ctaButton: 'Planung starten →',
    dateLocale: 'de-DE',
    info: {
      kicker: 'Die Türkei auf einen Blick', title: 'Wo sich Kontinente, Kulturen und Jahrhunderte begegnen',
      cards: [
        { icon: '🌉', label: 'Geografie', value: 'Europa trifft Asien', text: 'Istanbul erstreckt sich zu beiden Seiten des Bosporus über zwei Kontinente.' },
        { icon: '🎯', label: 'Mehrsprachige Planung', value: 'Fünf Sprachen', text: 'Unsere Reiseratgeber erscheinen für Leser auf Englisch, Deutsch, Chinesisch, Koreanisch und Spanisch.' },
        { icon: '🏛️', label: 'Historische Tiefe', value: 'Über 2.600 Jahre Stadtgeschichte', text: 'Die historischen Bereiche Istanbuls sind seit 1985 UNESCO-Welterbe.' },
      ],
      statsTitle: 'Dieser Ratgeber in Zahlen', statPublished: 'Veröffentlicht', statUpdated: 'Zuletzt aktualisiert', statRead: 'Lesezeit', statSources: 'Zitierte Quellen', statLanguages: 'Sprachen',
    },
  },
  'zh-CN': {
    back: '← 土耳其旅行指南', by: '作者', published: '发布', updated: '更新', guides: '目的地指南', faq: '常见问题',
    sources: '资料来源与延伸阅读', sourcesNote: '开放条件、时刻表和价格可能变化，出行前请查看所链接的官方来源。', policy: '阅读我们的编辑与审核政策（英文）',
    asideKicker: '与我们合作', asideTitle: '让一切更轻松。', asideText: '我们私人定制行程、核实每一家服务商，并全程陪伴——由您付费，绝不收取佣金。', message: '给我们留言',
    whatsApp: (title) => `您好，我读了你们的文章《${title}》，想咨询一下。`,
    topic: '主题', readTime: '阅读时长', approach: '我们的方式', howWeWork: '了解我们如何工作 →',
    moreKicker: '继续阅读', moreTitle: '更多旅行指南', readArticle: '阅读文章 →',
    ctaKicker: '正在自己规划？', ctaTitle: '接下来交给我们。', ctaText: '无论您因何来到这里——治疗、旅行还是置业——告诉我们，真人顾问会在几小时内回复。', ctaButton: '开始规划 →',
    dateLocale: 'zh-CN',
    info: {
      kicker: '土耳其一览', title: '大陆、文化与世纪在此交汇',
      cards: [
        { icon: '🌉', label: '地理位置', value: '欧亚交汇', text: '伊斯坦布尔横跨博斯普鲁斯海峡两岸，连接两个大洲。' },
        { icon: '🎯', label: '多语言规划', value: '五种语言', text: '我们的旅行指南面向英语、德语、中文、韩语和西班牙语读者。' },
        { icon: '🏛️', label: '历史深度', value: '2600多年的城市', text: '伊斯坦布尔历史区域自1985年起被列为联合国教科文组织世界遗产。' },
      ],
      statsTitle: '本指南数据', statPublished: '发布日期', statUpdated: '最近更新', statRead: '阅读时长', statSources: '引用来源', statLanguages: '语言版本',
    },
  },
  ko: {
    back: '← 튀르키예 여행 가이드', by: '작성', published: '게시', updated: '업데이트', guides: '여행지 가이드', faq: '자주 묻는 질문',
    sources: '출처 및 참고 자료', sourcesNote: '이용 조건, 시간표, 가격은 바뀔 수 있습니다. 여행 전에 연결된 공식 출처를 확인하세요.', policy: '편집 및 검토 정책 읽기(영문)',
    asideKicker: '함께 계획하기', asideTitle: '더 쉽게 준비하세요.', asideText: '개인 맞춤으로 계획하고, 모든 업체를 확인하며, 끝까지 함께합니다. 비용은 고객이 직접 지불하며 수수료는 받지 않습니다.', message: '메시지 보내기',
    whatsApp: (title) => `안녕하세요, "${title}" 글을 읽고 상담하고 싶습니다.`,
    topic: '주제', readTime: '읽는 시간', approach: '우리의 방식', howWeWork: '진행 방식 보기 →',
    moreKicker: '계속 읽기', moreTitle: '다른 여행 가이드', readArticle: '글 읽기 →',
    ctaKicker: '직접 계획하고 계신가요?', ctaTitle: '이제 저희가 맡겠습니다.', ctaText: '치료, 여행, 부동산 등 어떤 이유로 오셨든 알려 주세요. 실제 담당자가 몇 시간 안에 답변드립니다.', ctaButton: '계획 시작하기 →',
    dateLocale: 'ko-KR',
    info: {
      kicker: '한눈에 보는 튀르키예', title: '대륙과 문화, 세기가 만나는 곳',
      cards: [
        { icon: '🌉', label: '지리', value: '유럽과 아시아의 만남', text: '이스탄불은 보스포루스 해협 양쪽에 걸쳐 두 대륙에 펼쳐져 있습니다.' },
        { icon: '🎯', label: '다국어 안내', value: '5개 언어', text: '여행 가이드를 영어, 독일어, 중국어, 한국어, 스페인어 독자를 위해 제공합니다.' },
        { icon: '🏛️', label: '역사의 깊이', value: '2,600년 이상의 도시', text: '이스탄불 역사 지구는 1985년부터 유네스코 세계유산입니다.' },
      ],
      statsTitle: '이 가이드 한눈에 보기', statPublished: '게시일', statUpdated: '최근 업데이트', statRead: '읽는 시간', statSources: '인용 출처', statLanguages: '언어',
    },
  },
  es: {
    back: '← Guías de viaje', by: 'Por', published: 'Publicado', updated: 'Actualizado', guides: 'Guías de destinos', faq: 'Preguntas frecuentes',
    sources: 'Fuentes y lecturas adicionales', sourcesNote: 'Las condiciones de acceso, los horarios y los precios pueden cambiar. Consulta la fuente oficial enlazada antes de viajar.', policy: 'Lee nuestra política editorial y de revisión (en inglés)',
    asideKicker: 'Trabaja con nosotros', asideTitle: 'Hazlo sin esfuerzo.', asideText: 'Lo planificamos en privado, verificamos a cada proveedor y te acompañamos: lo pagas tú, nunca con comisiones.', message: 'Escríbenos',
    whatsApp: (title) => `Hola, he leído vuestro artículo «${title}» y me gustaría hablar.`,
    topic: 'Tema', readTime: 'Lectura', approach: 'Nuestro enfoque', howWeWork: 'Cómo trabajamos →',
    moreKicker: 'Sigue leyendo', moreTitle: 'Más guías de viaje', readArticle: 'Leer artículo →',
    ctaKicker: '¿Lo estás planificando tú?', ctaTitle: 'Déjanos encargarnos.', ctaText: 'Sea un tratamiento, un viaje o una propiedad, cuéntanos qué necesitas y una persona real te responderá en pocas horas.', ctaButton: 'Empezar a planificar →',
    dateLocale: 'es-ES',
    info: {
      kicker: 'Türkiye de un vistazo', title: 'Donde se encuentran continentes, culturas y siglos',
      cards: [
        { icon: '🌉', label: 'Geografía', value: 'Europa se une a Asia', text: 'Estambul se extiende por dos continentes, a ambos lados del estrecho del Bósforo.' },
        { icon: '🎯', label: 'Planificación multilingüe', value: 'Cinco idiomas', text: 'Nuestras guías de viaje se escriben para lectores en inglés, alemán, chino, coreano y español.' },
        { icon: '🏛️', label: 'Profundidad histórica', value: 'Una ciudad de más de 2.600 años', text: 'Las zonas históricas de Estambul son Patrimonio Mundial de la UNESCO desde 1985.' },
      ],
      statsTitle: 'Esta guía en cifras', statPublished: 'Publicado', statUpdated: 'Última actualización', statRead: 'Lectura', statSources: 'Fuentes citadas', statLanguages: 'Idiomas',
    },
  },
};
