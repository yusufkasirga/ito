// =====================================================
// BLOG DATA — yeni yazı eklemek için bu listeye yeni bir
// obje ekle. slug benzersiz olmalı (URL'de kullanılır).
// =====================================================

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readTime: string;
  content: string[]; // Her eleman bir paragraf. ## ile başlayan satırlar alt başlık olur.
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'hair-transplant-turkey-cost-guide-2026',
    title: 'Hair Transplant in Türkiye: The Complete 2026 Cost Guide',
    category: 'Medical Tourism',
    excerpt: 'Everything you need to know about hair transplant costs, techniques, and what to expect when choosing Türkiye for your procedure.',
    coverImage: 'https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    date: 'June 2026',
    readTime: '6 min read',
    content: [
      'Türkiye has become the global capital of hair restoration, attracting hundreds of thousands of international patients every year. The combination of world-class surgeons, modern clinics, and prices that are a fraction of what you would pay in the UK, US, or Western Europe has made Istanbul in particular a destination of choice.',
      '## Why Türkiye?',
      'The country performs more hair transplant procedures annually than anywhere else in the world. This volume has created an ecosystem of highly experienced surgeons, cutting-edge clinics, and refined techniques such as FUE (Follicular Unit Extraction) and DHI (Direct Hair Implantation).',
      '## Typical Costs',
      'A full hair transplant in Türkiye typically ranges from €1,500 to €3,500, depending on the technique, the number of grafts required, and the clinic you choose. Compare this to the UK or US, where the same procedure can cost £8,000–£15,000 or more.',
      '## What Is Usually Included',
      'Most reputable clinics in Türkiye include consultation, the procedure itself, post-operative medication, an aftercare kit, and at least one follow-up appointment in their package price. Many also include airport transfers and accommodation assistance.',
      '## How Itinerary of Türkiye Helps',
      'Choosing the right clinic on your own can be overwhelming — not every clinic maintains the same standards. We connect you only with accredited, verified specialists, handle your travel logistics, and stay with you throughout your recovery, so you can focus entirely on your results.',
    ],
  },
  {
    slug: 'buying-property-turkey-foreigner-guide',
    title: 'Is It Safe to Buy Property in Türkiye as a Foreigner?',
    category: 'Real Estate',
    excerpt: 'A practical guide to navigating the Turkish real estate market as an international buyer — legal steps, risks, and how to protect yourself.',
    coverImage: 'https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    date: 'June 2026',
    readTime: '7 min read',
    content: [
      'Türkiye has become one of the most attractive real estate markets for foreign buyers — but like any international purchase, it requires the right knowledge and the right team around you.',
      '## Can Foreigners Legally Buy Property?',
      'Yes. Citizens of most countries can purchase real estate in Türkiye, subject to certain regional restrictions near military zones. The process is well established and protected by Turkish property law.',
      '## The Buying Process',
      'In broad terms, the process involves: selecting a property, conducting due diligence (title deed check, debt check), signing a preliminary agreement, and finally transferring the title deed (Tapu) at the Land Registry Office.',
      '## Common Risks to Avoid',
      'The most common issues foreign buyers face are: purchasing through unverified agents, skipping legal due diligence, and underestimating additional costs (taxes, translation, notary fees). Working with a licensed lawyer is strongly recommended.',
      '## Citizenship by Investment',
      'Foreign buyers investing $400,000 or more in Turkish real estate may be eligible for Turkish citizenship, provided the property is held for at least three years.',
      '## How Itinerary of Türkiye Helps',
      'We connect you with vetted developers, licensed agents, and experienced property lawyers who specialise in working with international buyers — guiding you safely from your first viewing to receiving your keys.',
    ],
  },
  {
    slug: 'best-things-to-do-istanbul-first-time',
    title: 'Istanbul for First-Timers: What You Cannot Miss',
    category: 'Tourism',
    excerpt: 'From the Hagia Sophia to the Bosphorus at sunset — a curated guide to making the most of your first visit to Istanbul.',
    coverImage: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    date: 'June 2026',
    readTime: '5 min read',
    content: [
      'Istanbul is a city where two continents meet, where Byzantine and Ottoman history sits beside contemporary culture, and where every neighbourhood has its own personality. For first-time visitors, it can feel overwhelming — here is where to start.',
      '## Hagia Sophia & Blue Mosque',
      'Begin in Sultanahmet, home to two of the world\'s most remarkable religious monuments standing just metres apart. Visit early morning to avoid the crowds.',
      '## The Grand Bazaar',
      'One of the oldest and largest covered markets in the world, with over 4,000 shops. Come for the carpets, ceramics, and jewellery — stay for the experience of haggling like a local.',
      '## A Bosphorus Cruise',
      'No visit to Istanbul is complete without seeing the city from the water. A sunset cruise along the Bosphorus offers views of both the European and Asian sides of the city in one trip.',
      '## Turkish Cuisine',
      'From street-side simit and balık ekmek (fish sandwiches) to a proper Turkish breakfast spread, the food alone is worth the trip. Do not leave without trying authentic Turkish coffee and baklava.',
      '## How Itinerary of Türkiye Helps',
      'We design private, curated itineraries tailored entirely to your interests — whether that is history, food, shopping, or all of the above — with a local guide who knows the city inside and out.',
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
