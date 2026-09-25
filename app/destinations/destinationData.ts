// =====================================================
// DESTINASYON İÇ SAYFA VERİSİ — 30 şehir (ilk parti 10 + Eylül 2026 partisi 20).
// Görseller şimdilik mevcut lisanslı (self-host) fotoğraflar; 1,5 ay içinde
// gerçek çekimlerle şehir-bazlı değiştirilecek (P-04 hattı). Kod tek noktadan
// `cover` / `gallery` alanlarıyla besleniyor.
// Kalan 50 şehir sonraki partilerde eklenecek (ince-sayfa riskini önlemek için
// her şehir gerçek içerikle gelir).
// =====================================================

export interface Attraction {
  name: string;
  desc: string;
}

export interface DestinationFaq {
  q: string;
  a: string;
}

export interface Destination {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  intro: string[];
  // Yalnızca GERÇEKTEN o yere ait güvenli foto; yoksa '' → tipografik hero.
  // Stok havuzundaki yabancı (Hong Kong, tropik ada, "CREATE" tabelalar) ve
  // medikal (berber/diş/estetik) görseller destinasyonlarda ASLA kullanılmaz.
  cover: string;
  accent: string; // tipografik hero için degrade vurgu rengi
  attractions: Attraction[];
  // Pratik planlama bilgisi — ince-sayfa riskine karşı her şehirde zorunlu
  practical: { bestTime: string; howLong: string; gettingThere: string };
  // Birlikte gezilebilecek şehirler (iç link ağı) — yalnız mevcut slug'lar
  pairWith: string[];
  // Sayfada SSS + FAQPage yapılandırılmış verisi
  faq: DestinationFaq[];
}

// Denetlenmiş, destinasyona uygun görseller (bkz. D-63):
const IMG = {
  istanbulBosphorus: '/images/pexels-1549326-800x1200.jpg', // İstanbul Boğaz köprüsü ✓
  cappadociaBalloons: '/images/pexels-2325446-1920x1080.jpg', // Kapadokya balon ✓
  cappadociaSunrise: '/images/pexels-3889742-1920x1080.jpg', // Kapadokya balon (çift) ✓
  greenHighland: '/images/pexels-2419278-800x1200.jpg', // yeşil dağ-göl (jenerik doğa) ✓
};

export const destinations: Destination[] = [
  {
    slug: 'istanbul',
    name: 'Istanbul',
    region: 'Marmara · Where two continents meet',
    tagline: 'Byzantium, Constantinople, Istanbul — three empires on one skyline.',
    intro: [
      'No other city sits on two continents, and none wears its history so openly. A single afternoon in Istanbul can move from a sixth-century basilica to a third-wave coffee bar, from the call to prayer over the Golden Horn to a ferry deck full of tea glasses.',
      'It rewards the traveller who slows down. We plan Istanbul so the icons are seen at the right hour — and so you also find the quiet courtyards, backstreet meyhanes and neighbourhood ferries that most first visits miss entirely.',
    ],
    practical: {
      bestTime: 'April–May and September–October: mild, clear days and fewer queues. Summer is hot and busy; winter is quiet, cheaper and often grey.',
      howLong: '3–4 full days for the icons plus the Asian side; 5 if you want the Princes\' Islands or a slower pace.',
      gettingThere: 'Istanbul Airport (IST) on the European side or Sabiha Gökçen (SAW) on the Asian side. Allow 60–90 minutes to the old city in traffic.',
    },
    pairWith: ['cappadocia', 'bursa', 'edirne'],
    faq: [
      { q: 'How many days do you need in Istanbul?', a: 'Three to four full days covers Sultanahmet, the Bosphorus and one neighbourhood on the Asian side without rushing. First-time visitors who try to do it in two usually regret it.' },
      { q: 'Where is the best area to stay in Istanbul for a first visit?', a: 'Sultanahmet puts you next to the historic sights; Karaköy and Galata are better for restaurants and evenings. We usually match the area to your pace rather than to a checklist.' },
      { q: 'Is Istanbul easy to get around without a car?', a: 'Yes. The T1 tram, the M2 metro, Marmaray and the ferries cover almost everything a visitor needs, and are often faster than a taxi in traffic.' },
    ],
    cover: IMG.istanbulBosphorus,
    accent: '#1f4e6b',
    attractions: [
      { name: 'Hagia Sophia', desc: 'Fifteen centuries of history under one dome — cathedral, mosque, and monument all at once. Best seen at opening, before the crowds.' },
      { name: 'The Blue Mosque', desc: 'Six minarets and a cascade of domes across from Hagia Sophia, its interior lined with the İznik tiles that give it its name.' },
      { name: 'Topkapı Palace', desc: 'The seat of Ottoman power for four centuries — courtyards, the harem, the treasury, and Bosphorus views the sultans kept for themselves.' },
      { name: 'The Grand Bazaar', desc: 'Four thousand shops under vaulted ceilings. Come for carpets, ceramics and gold; stay for the ritual of tea and negotiation.' },
      { name: 'A private Bosphorus cruise', desc: 'The only way to understand the city\'s shape — palaces, fortresses and waterside mansions sliding past between Europe and Asia.' },
      { name: 'The Asian side (Kadıköy)', desc: 'Where locals actually eat and drink. Food streets, record shops and a rhythm the tourist quarters lost long ago.' },
    ],
  },
  {
    slug: 'cappadocia',
    name: 'Cappadocia',
    region: 'Central Anatolia · Nevşehir',
    tagline: 'A landscape carved by volcanoes and monks — best seen at dawn, from the air.',
    intro: [
      'Soft volcanic rock, ten thousand years of erosion, and a people who carved their homes, churches and whole cities into it. Cappadocia looks like nowhere else on earth, and the balloons drifting over it at sunrise have become the image of Türkiye itself.',
      'We build the region around its light: balloons on your first clear morning, valleys walked before the heat, and cave-hotel evenings that make the early starts worth it.',
    ],
    practical: {
      bestTime: 'April–June and September–October for stable balloon weather and walkable temperatures. Winter brings snow-covered valleys and more flight cancellations.',
      howLong: '2–3 nights. Balloons are weather-dependent, so a spare morning matters more than an extra sight.',
      gettingThere: 'Fly to Kayseri (ASR) or Nevşehir Kapadokya (NAV) from Istanbul, then about an hour by road to Göreme or Uçhisar.',
    },
    pairWith: ['konya', 'ankara', 'istanbul'],
    faq: [
      { q: 'What happens if my balloon flight is cancelled?', a: 'Flights are cancelled when wind or visibility is unsafe, which is why we plan at least two possible mornings. Reputable operators rebook or refund; we confirm the policy in writing before you pay.' },
      { q: 'Is Cappadocia worth it without a balloon ride?', a: 'Yes. Sunrise from the viewpoints, the valley walks, the underground cities and the rock-cut churches of Göreme are the substance of the region; the balloons are the headline.' },
      { q: 'Where should I stay in Cappadocia?', a: 'Göreme is central and lively; Uçhisar and Ortahisar are quieter with wider views. A cave hotel is part of the experience in any of them.' },
    ],
    cover: IMG.cappadociaBalloons,
    accent: '#8a4b2b',
    attractions: [
      { name: 'Sunrise hot-air balloon flight', desc: 'The reason many people come. Booked for your first possible morning so weather cancellations can be rebooked without losing the experience.' },
      { name: 'Göreme Open-Air Museum', desc: 'A monastic valley of rock-cut churches, some with Byzantine frescoes almost a thousand years old.' },
      { name: 'Underground cities', desc: 'Derinkuyu and Kaymaklı — entire towns dug metres into the earth, where early Christians sheltered from raids.' },
      { name: 'Uçhisar Castle', desc: 'The highest point in Cappadocia, a honeycombed rock citadel with the region\'s widest sunset view.' },
      { name: 'Rose & Pigeon Valleys', desc: 'Walked with a guide in the soft early light — fairy chimneys, hidden chapels, and colour that shifts by the hour.' },
      { name: 'Avanos pottery', desc: 'Red-clay ceramics turned on kick-wheels beside the Kızılırmak river, a craft older than the Hittites.' },
    ],
  },
  {
    slug: 'antalya',
    name: 'Antalya',
    region: 'Mediterranean coast',
    tagline: 'The Turkish Riviera\'s capital — Roman ruins, turquoise water and an old town that predates them both.',
    intro: [
      'Antalya is the gateway to the Mediterranean coast and far deeper than its resort reputation. Behind the beaches sit Roman theatres, a walled old town of Ottoman houses, and waterfalls that drop straight into the sea.',
      'We use Antalya as a base for the whole Pamphylian coast — the ancient cities inland, the quiet bays east and west, and the mountains that rise behind them.',
    ],
    practical: {
      bestTime: 'April–June and September–November. July and August are very hot and crowded; winter is mild and good for ruins.',
      howLong: '3–4 days to combine the old town, one or two ancient cities and a day on the water.',
      gettingThere: 'Antalya Airport (AYT) has direct flights from most of Europe; the old town (Kaleiçi) is about 25 minutes away.',
    },
    pairWith: ['side', 'alanya', 'kas'],
    faq: [
      { q: 'Is Antalya only a beach resort?', a: 'No. Kaleiçi old town, Perge, Aspendos and Termessos make it one of the best bases for Roman sites in the Mediterranean.' },
      { q: 'When is the sea warm enough to swim in Antalya?', a: 'Roughly from late May to late October, with the warmest water in August and September.' },
    ],
    cover: '',
    accent: '#0e5a6b',
    attractions: [
      { name: 'Kaleiçi old town', desc: 'The walled heart of Antalya — cobbled lanes, restored Ottoman mansions, and a Roman harbour still in use.' },
      { name: 'Hadrian\'s Gate', desc: 'A triple marble arch built for the emperor\'s visit in 130 AD, and still the grandest way to enter the old city.' },
      { name: 'Aspendos Theatre', desc: 'One of the best-preserved Roman theatres anywhere, still acoustically perfect enough to host concerts.' },
      { name: 'Perge', desc: 'A vast ancient city of colonnaded streets, baths and a stadium — usually walked in near solitude.' },
      { name: 'Düden Waterfalls', desc: 'Where the Düden river drops off a cliff directly into the Mediterranean, best seen from the water.' },
      { name: 'Konyaaltı & Lara beaches', desc: 'The city\'s two coastlines — pebble and sand — with the Taurus mountains as a backdrop.' },
    ],
  },
  {
    slug: 'bodrum',
    name: 'Bodrum',
    region: 'Aegean coast · Muğla',
    tagline: 'Whitewashed lanes, a crusader castle and the Aegean\'s most stylish bays.',
    intro: [
      'Bodrum is Türkiye\'s answer to the Riviera lifestyle — a whitewashed town beneath a crusader castle, ringed by a peninsula of quiet villages and barefoot-luxury bays.',
      'We match you to the right side of it: the town for energy and dining, or the peninsula villages for calm. Either way, the sea is the point.',
    ],
    practical: {
      bestTime: 'May–June and September–October: warm sea, open restaurants, fewer crowds than peak summer.',
      howLong: '3–5 days, depending on how much time you want on the water.',
      gettingThere: 'Milas–Bodrum Airport (BJV) is about 40 minutes from town; seasonal ferries link Bodrum with Datça and the Greek island of Kos.',
    },
    pairWith: ['datca', 'marmaris', 'ephesus'],
    faq: [
      { q: 'Which part of the Bodrum peninsula is best?', a: 'Bodrum town for energy, Yalıkavak and Türkbükü for marinas and beach clubs, Gümüşlük for quiet seafood evenings. We match the side to your pace.' },
      { q: 'Is Bodrum busy in winter?', a: 'It becomes very quiet; many seasonal hotels and beach clubs close between November and April.' },
    ],
    cover: '',
    accent: '#0e5a6b',
    attractions: [
      { name: 'Bodrum Castle', desc: 'A crusader fortress guarding the harbour, now the Museum of Underwater Archaeology — one of the finest of its kind.' },
      { name: 'Mausoleum at Halicarnassus', desc: 'The tomb that gave the world the word "mausoleum," and one of the Seven Wonders of the ancient world.' },
      { name: 'The peninsula villages', desc: 'Türkbükü, Yalıkavak and Gümüşlük — each with its own character, from chic marinas to seafood tables in the shallows.' },
      { name: 'Gümüşlük at sunset', desc: 'Dinner with your feet almost in the water, looking across to the submerged ruins of ancient Myndos.' },
      { name: 'The ancient theatre', desc: 'A Hellenistic amphitheatre above the town, still used for summer performances under the stars.' },
      { name: 'A day on a gulet', desc: 'The classic Aegean experience — a wooden yacht, hidden coves, and lunch cooked aboard.' },
    ],
  },
  {
    slug: 'fethiye',
    name: 'Fethiye',
    region: 'Turquoise coast · Muğla',
    tagline: 'Lagoons, Lycian tombs and the start of the coast\'s most beautiful sailing.',
    intro: [
      'Fethiye holds the turquoise coast\'s most photographed treasures — the Ölüdeniz lagoon, the ghost village of Kayaköy, and Lycian rock tombs cut high into the cliffs above the town.',
      'It is also the launch point for gulet cruises along hidden coves, the single most memorable way to experience this coastline. We plan Fethiye for the water and the quiet.',
    ],
    practical: {
      bestTime: 'May–June and September–October for warm water and comfortable walking on the Lycian Way.',
      howLong: '3–4 days, or a week if you add a gulet cruise.',
      gettingThere: 'Dalaman Airport (DLM) is about an hour away by road.',
    },
    pairWith: ['dalyan', 'kas', 'marmaris'],
    faq: [
      { q: 'Is Ölüdeniz worth visiting?', a: 'Yes, but go early or late in the day. The lagoon is a protected area and gets crowded at midday in summer.' },
      { q: 'Can you walk the Lycian Way from Fethiye?', a: 'The first stages start near Ölüdeniz. Short day sections are the most rewarding way to try it without committing to the full route.' },
    ],
    cover: '',
    accent: '#0e6b5a',
    attractions: [
      { name: 'Ölüdeniz lagoon', desc: 'The still, impossibly blue lagoon that appears on every Türkiye poster — best seen paragliding down from Babadağ.' },
      { name: 'Butterfly Valley', desc: 'A steep-sided cove reachable mainly by boat, home to tigmoth butterflies and a waterfall at its head.' },
      { name: 'Kayaköy ghost village', desc: 'Hundreds of abandoned stone houses on a hillside — a moving, silent record of the 1923 population exchange.' },
      { name: 'Lycian rock tombs', desc: 'Temple facades carved into the cliff above Fethiye in the 4th century BC, lit gold at sunset.' },
      { name: 'Saklıkent Gorge', desc: 'An 18-kilometre canyon you wade into through icy mountain water, walls rising hundreds of metres above.' },
      { name: 'A blue-cruise gulet', desc: 'Days spent between the coves of the Göcek and Fethiye bays, swimming off the deck, sleeping under stars.' },
    ],
  },
  {
    slug: 'izmir',
    name: 'Izmir',
    region: 'Aegean coast',
    tagline: 'Türkiye\'s easygoing third city — a waterfront promenade and antiquity on its doorstep.',
    intro: [
      'Izmir is the Aegean\'s relaxed, liberal capital — a seafront city built for evening walks, with some of the ancient world\'s greatest sites within an hour\'s drive.',
      'We use it as a civilised base for Ephesus, Şirince and the Çeşme peninsula, with the Kordon waterfront to come home to.',
    ],
    practical: {
      bestTime: 'April–June and September–October. Summers are hot but the sea breeze makes evenings pleasant.',
      howLong: '2 days in the city, plus day trips to Ephesus, Şirince or Çeşme.',
      gettingThere: 'Izmir Adnan Menderes Airport (ADB) is about 30 minutes from the centre; the İZBAN rail line runs south towards Selçuk.',
    },
    pairWith: ['ephesus', 'sirince', 'ayvalik'],
    faq: [
      { q: 'Is Izmir a good base for Ephesus?', a: 'Yes. Ephesus is roughly an hour south, and Izmir gives you city restaurants and evenings to return to.' },
      { q: 'What is Izmir known for?', a: 'A relaxed seafront culture along the Kordon, the historic Kemeraltı bazaar, and easy access to the Aegean\'s ancient sites.' },
    ],
    cover: '',
    accent: '#2a4a6b',
    attractions: [
      { name: 'The Kordon waterfront', desc: 'Izmir\'s soul — a wide seafront promenade of grass, cafes and horse carriages, best at sunset with the bay glowing.' },
      { name: 'Konak Square & Clock Tower', desc: 'The ornate 1901 clock tower that is the city\'s emblem, on a square opening to the sea.' },
      { name: 'Kemeraltı Bazaar', desc: 'A labyrinthine market of hans, coffee houses and workshops, layered over an ancient agora.' },
      { name: 'Alaçatı', desc: 'A stone-and-bougainvillea village on the Çeşme peninsula, famous for its restaurants and windsurfing bays.' },
      { name: 'Çeşme', desc: 'Thermal beaches, a Genoese castle and some of the Aegean\'s clearest water, an hour west of the city.' },
      { name: 'Şirince', desc: 'A hillside village of Greek houses and fruit wines above Ephesus — a short, worthwhile detour.' },
    ],
  },
  {
    slug: 'pamukkale',
    name: 'Pamukkale',
    region: 'Aegean interior · Denizli',
    tagline: 'A white terraced hillside of warm mineral water, crowned by a Roman spa city.',
    intro: [
      'Pamukkale — "cotton castle" — is a cascade of brilliant white travertine terraces filled with warm, mineral-rich water, formed over millennia. Above it stands Hierapolis, the Roman spa city that grew up around the springs.',
      'It is a half-day of pure spectacle. We time it for soft light and thinner crowds, and pair it with the wider Aegean interior.',
    ],
    practical: {
      bestTime: 'Spring and autumn. Arrive early or stay for late afternoon light; midday in summer is hot and bright on the white travertines.',
      howLong: 'One night nearby is ideal so you can see the terraces at both ends of the day.',
      gettingThere: 'Denizli Çardak Airport (DNZ) is about an hour away; by road it is roughly three hours from Izmir or Selçuk.',
    },
    pairWith: ['ephesus', 'izmir', 'antalya'],
    faq: [
      { q: 'Can you swim at Pamukkale?', a: 'You walk barefoot through the shallow terraces, and you can swim in the Antique Pool among Roman columns for an additional fee.' },
      { q: 'Do I need shoes at Pamukkale?', a: 'Shoes are removed on the travertines to protect them; bring a bag for them and sun protection.' },
    ],
    cover: '',
    accent: '#5a5a6b',
    attractions: [
      { name: 'The travertine terraces', desc: 'Walked barefoot along the permitted paths, warm water pooling around your ankles, the whole hillside dazzling white.' },
      { name: 'Hierapolis ancient city', desc: 'A Greco-Roman spa town of colonnaded streets, temples and a vast necropolis, spread across the plateau above.' },
      { name: 'Cleopatra\'s Pool', desc: 'Swim among fallen marble columns in warm, effervescent spring water — the ancient thermal bath itself.' },
      { name: 'The Roman theatre', desc: 'One of Anatolia\'s best-preserved, its stage buildings still standing, with the plain of Denizli below.' },
      { name: 'The Necropolis', desc: 'One of the largest ancient cemeteries in Türkiye — people came here to be cured, and to be buried.' },
      { name: 'The archaeology museum', desc: 'Housed in the Roman baths, holding the finest sculpture recovered from Hierapolis and the region.' },
    ],
  },
  {
    slug: 'ephesus',
    name: 'Ephesus',
    region: 'Aegean coast · Selçuk',
    tagline: 'The best-preserved classical city in the Mediterranean — walked, not imagined.',
    intro: [
      'Ephesus is where the ancient world stops being an idea and becomes a street you can walk down. Marble avenues, a library facade, a theatre for 25,000 — a Roman metropolis preserved on a scale almost nowhere else can match.',
      'We plan it for early light and a knowledgeable guide, and combine it with Şirince and the coast so a great ruin becomes a great day.',
    ],
    practical: {
      bestTime: 'Spring and autumn. In summer arrive at opening time; the marble reflects heat by late morning.',
      howLong: 'A half to a full day for the site, the Terrace Houses and the Ephesus Museum in Selçuk.',
      gettingThere: 'About an hour south of Izmir Airport (ADB); 20 minutes from Kuşadası.',
    },
    pairWith: ['sirince', 'kusadasi', 'pamukkale'],
    faq: [
      { q: 'Are the Terrace Houses worth the extra ticket?', a: 'Yes. They are covered excavations of wealthy Roman homes with mosaics and frescoes, and among the most memorable parts of the visit.' },
      { q: 'Should I book a guide for Ephesus?', a: 'A good guide turns streets of ruins into a living city. We arrange licensed guides and time the visit around the crowds.' },
    ],
    cover: '',
    accent: '#6b5a2b',
    attractions: [
      { name: 'The Library of Celsus', desc: 'The iconic two-storey marble facade, built to hold 12,000 scrolls and to honour a Roman senator buried beneath it.' },
      { name: 'The Great Theatre', desc: 'Carved into the hillside for 25,000 spectators — where St Paul is said to have preached against the silversmiths.' },
      { name: 'The Terrace Houses', desc: 'The homes of Ephesus\'s wealthy, with mosaics and frescoes still in place under a protective canopy.' },
      { name: 'The Temple of Artemis', desc: 'Once one of the Seven Wonders of the ancient world; a single re-erected column now marks its scale.' },
      { name: 'House of the Virgin Mary', desc: 'A small stone chapel on Bülbül mountain, a place of pilgrimage believed to be Mary\'s final home.' },
      { name: 'Şirince village', desc: 'A short drive uphill — Greek houses, fruit wines and a lunch that earns the ancient morning.' },
    ],
  },
  {
    slug: 'bursa',
    name: 'Bursa',
    region: 'Marmara · foot of Uludağ',
    tagline: 'The first Ottoman capital — green, thermal, and crowned by a mountain.',
    intro: [
      'Bursa was the Ottomans\' first capital, and it still wears the title. Early imperial mosques and tombs, a silk trade centuries old, and thermal springs sit beneath Uludağ, the mountain that gives the city its nickname, "Green Bursa."',
      'It is an easy, rewarding contrast to the coast — history, hammams and a UNESCO village, all within reach of Istanbul.',
    ],
    practical: {
      bestTime: 'Year-round. Winter adds skiing on Uludağ; spring and autumn are best for Cumalıkızık and the old town.',
      howLong: '1–2 days, often as a trip from Istanbul.',
      gettingThere: 'About 2–3 hours from Istanbul by road or by fast ferry across the Sea of Marmara plus a short drive.',
    },
    pairWith: ['istanbul', 'ankara'],
    faq: [
      { q: 'Is Bursa a good day trip from Istanbul?', a: 'It is possible, but an overnight stay lets you enjoy a thermal hammam and the old silk bazaars without rushing.' },
      { q: 'What should I eat in Bursa?', a: 'İskender kebab was created here, and candied chestnuts (kestane şekeri) are the classic souvenir.' },
    ],
    cover: IMG.greenHighland,
    accent: '#2b6b3a',
    attractions: [
      { name: 'The Grand Mosque (Ulu Camii)', desc: 'Twenty domes and a fountain under the roof — the masterpiece of early Ottoman architecture, filled with monumental calligraphy.' },
      { name: 'The Green Mosque & Tomb', desc: 'Named for the turquoise İznik tiles lining its interior and the sultan\'s tomb across the street.' },
      { name: 'Koza Han', desc: 'The 15th-century silk bazaar, still trading — a courtyard of mulberry trees, tea and Bursa\'s famous silk.' },
      { name: 'Cumalıkızık', desc: 'A UNESCO-listed Ottoman village of painted timber houses on the mountain\'s skirts, barely changed in 700 years.' },
      { name: 'The thermal baths', desc: 'Bursa has bathed in its hot springs since Roman times; the historic hammams of Çekirge still do.' },
      { name: 'Uludağ', desc: 'By cable car to the mountain — alpine meadows in summer, Türkiye\'s best-known ski slopes in winter.' },
    ],
  },
  {
    slug: 'ankara',
    name: 'Ankara',
    region: 'Central Anatolia · the capital',
    tagline: 'The republic\'s capital — and the museum that holds Anatolia\'s deepest history.',
    intro: [
      'Ankara is modern Türkiye\'s capital and a city of the republic, but it guards something older than any coast: the Museum of Anatolian Civilizations, whose Hittite and Neolithic halls are among the finest in the world.',
      'We plan Ankara for travellers who want the story behind everything else — the mausoleum of Atatürk, the citadel, and 10,000 years of Anatolia under one roof.',
    ],
    practical: {
      bestTime: 'Spring and autumn. Winters are cold and dry; summers are hot but less humid than the coast.',
      howLong: '1–2 days.',
      gettingThere: 'Ankara Esenboğa Airport (ESB), or the high-speed train from Istanbul (about 4.5 hours) and from Konya.',
    },
    pairWith: ['cappadocia', 'konya', 'safranbolu'],
    faq: [
      { q: 'Is Ankara worth visiting as a tourist?', a: 'For history lovers, yes: the Museum of Anatolian Civilizations and Anıtkabir alone justify a day, and Ankara sits between Istanbul and Cappadocia.' },
      { q: 'How do you get from Ankara to Cappadocia?', a: 'About three hours by road; we often combine the two with a private driver.' },
    ],
    cover: '',
    accent: '#4a3a6b',
    attractions: [
      { name: 'Anıtkabir', desc: 'The vast, austere mausoleum of Mustafa Kemal Atatürk — the founder of the republic, and the country\'s most visited monument.' },
      { name: 'Museum of Anatolian Civilizations', desc: 'Hittite, Phrygian and Neolithic treasures in a restored Ottoman bazaar — repeatedly named among Europe\'s best museums.' },
      { name: 'Ankara Castle', desc: 'The old citadel on the hill, its walls built from fragments of every civilisation that held the city, with rooftop views.' },
      { name: 'Hamamönü', desc: 'A restored quarter of Ottoman houses, craft workshops and courtyard cafes below the castle.' },
      { name: 'Kocatepe Mosque', desc: 'The vast modern mosque that dominates the skyline, in classical Ottoman style at republican scale.' },
      { name: 'Roman Ankara', desc: 'The Temple of Augustus and the Roman baths — reminders that the capital was a city long before the republic.' },
    ],
  },
  {
    slug: 'trabzon',
    name: 'Trabzon',
    region: 'Black Sea · Eastern coast',
    tagline: 'Green mountains falling into the Black Sea, and a monastery built into a cliff above the clouds.',
    intro: [
      'Trabzon is the capital of Türkiye\'s Black Sea coast — a port city with a Byzantine past, backed by some of the greenest mountains in the country. Tea terraces, highland villages and mist-filled valleys begin less than an hour from the centre.',
      'We plan Trabzon for travellers who want a completely different Türkiye: cool summers, forest roads, and food built on anchovies, cornbread and butter from the high pastures.',
    ],
    practical: {
      bestTime: 'June–September. The coast is green because it rains, so expect showers at any time; winter is cold in the mountains.',
      howLong: '3–4 days to combine the city, Sümela and at least one highland plateau.',
      gettingThere: 'Trabzon Airport (TZX) has direct flights from Istanbul and Ankara and is a few minutes from the centre.',
    },
    pairWith: ['kars', 'istanbul'],
    faq: [
      { q: 'Is Trabzon worth visiting?', a: 'Yes, if you want nature and cool summers rather than beaches. It is the best base for the eastern Black Sea\'s lakes, monasteries and highland villages.' },
      { q: 'Can you visit Sümela Monastery?', a: 'The monastery reopened to visitors after restoration, but access to some sections can change. We confirm the current status before building a day around it.' },
    ],
    cover: '',
    accent: '#2b6b4a',
    attractions: [
      { name: 'Sümela Monastery', desc: 'A Greek Orthodox monastery set into a sheer cliff face in Altındere Valley, reached by a forest path. Check opening status before you go — sections have been under restoration.' },
      { name: 'Uzungöl', desc: 'A mountain lake ringed by wooden houses and pine forest, roughly two hours from the city. Beautiful early in the morning, before the tour buses.' },
      { name: 'Hagia Sophia of Trabzon', desc: 'A 13th-century Byzantine church, now a mosque, known for its frescoes and its setting on a hill above the sea.' },
      { name: 'Boztepe', desc: 'The hillside viewpoint above the city — tea gardens, the harbour below and the sunset over the Black Sea.' },
      { name: 'The highland plateaus (yaylas)', desc: 'Summer pastures with wooden chalets, meadows and cloud seas. Our favourite way to understand the region\'s mountain culture.' },
      { name: 'Atatürk Pavilion', desc: 'A white mansion in wooded gardens on the city\'s edge, where Atatürk stayed on his visits to Trabzon.' },
    ],
  },
  {
    slug: 'konya',
    name: 'Konya',
    region: 'Central Anatolia',
    tagline: 'The city of Rumi — whirling dervishes, Seljuk stone, and one of the oldest towns on earth nearby.',
    intro: [
      'Konya was the capital of the Seljuk Sultanate of Rum and the home of the 13th-century poet and mystic Mevlânâ Celaleddin Rumi. His tomb, under its turquoise dome, is one of the most visited places in Türkiye.',
      'It is a conservative, calm city with some of the finest Seljuk architecture anywhere. We plan it as a quiet, meaningful stop between Cappadocia and the Mediterranean coast.',
    ],
    practical: {
      bestTime: 'April–June and September–October. Every December the Şeb-i Arus commemoration of Rumi\'s death draws large crowds — book early.',
      howLong: '1–2 days.',
      gettingThere: 'Konya Airport (KYA), or the high-speed train from Ankara and Istanbul. By road it is about three hours from Cappadocia.',
    },
    pairWith: ['cappadocia', 'ankara', 'antalya'],
    faq: [
      { q: 'When can you see the whirling dervishes in Konya?', a: 'Ceremonies are held regularly at the Mevlana Cultural Centre, with the largest programme during the Şeb-i Arus commemoration each December. Schedules change, so we confirm dates before you travel.' },
      { q: 'What should I wear in Konya?', a: 'Konya is more conservative than the coast. Covered shoulders and knees are appropriate, and women need a headscarf inside mosques and the tomb.' },
    ],
    cover: '',
    accent: '#6b4a2b',
    attractions: [
      { name: 'Mevlana Museum', desc: 'Rumi\'s tomb and the former dervish lodge, with manuscripts, musical instruments and the famous turquoise tiled dome.' },
      { name: 'A Sema ceremony', desc: 'The whirling ceremony of the Mevlevi order, performed at the Mevlana Cultural Centre. It is a religious ritual, not a show — we brief you on how to watch it respectfully.' },
      { name: 'Karatay Madrasa', desc: 'A 13th-century theological school that now houses a museum of Seljuk tiles beneath a star-patterned dome.' },
      { name: 'İnce Minareli Madrasa', desc: 'Famous for its intricately carved stone portal; inside is a museum of stone and wood carving.' },
      { name: 'Alaeddin Hill and Mosque', desc: 'The Seljuk heart of the city, a green hill crowned by one of Anatolia\'s oldest mosques.' },
      { name: 'Çatalhöyük', desc: 'A UNESCO-listed Neolithic settlement about an hour away — around 9,000 years old and one of the earliest towns ever excavated.' },
    ],
  },
  {
    slug: 'mardin',
    name: 'Mardin',
    region: 'Southeast Anatolia · Upper Mesopotamia',
    tagline: 'A honey-coloured stone town on a hillside, looking out over the plains of Mesopotamia.',
    intro: [
      'Mardin climbs a steep hill above the Mesopotamian plain, its limestone houses, madrasas and church towers stacked in terraces. Arab, Kurdish, Turkish and Syriac cultures have shared these streets for centuries.',
      'It is one of the most atmospheric towns in Türkiye, and among the least visited by Western travellers. We pair it with Midyat and the Syriac monasteries of the Tur Abdin plateau.',
    ],
    practical: {
      bestTime: 'April–May and September–October. Summers are very hot; winters are mild but can be rainy.',
      howLong: '2–3 days including Midyat.',
      gettingThere: 'Mardin Airport (MQM) has flights from Istanbul and Ankara and is about 20 minutes from the old town.',
    },
    pairWith: ['sanliurfa', 'gaziantep', 'van'],
    faq: [
      { q: 'Is Mardin safe for tourists?', a: 'Mardin is a well-established destination that receives many domestic tourists. As with any border region, we check current travel advisories and plan routes with local knowledge.' },
      { q: 'What is Mardin famous for?', a: 'Its honey-coloured stone architecture, Syriac Christian heritage, handmade soap and silver filigree, and the view over the Mesopotamian plain.' },
    ],
    cover: '',
    accent: '#8a5a2b',
    attractions: [
      { name: 'The old town and main street', desc: 'Stepped alleys, carved stone doorways and rooftop terraces with views across the plain towards Syria.' },
      { name: 'Zinciriye Madrasa', desc: 'A 14th-century madrasa with fluted domes and one of the best views over the old town.' },
      { name: 'Deyrulzafaran Monastery', desc: 'A Syriac Orthodox monastery a few kilometres outside the city, in use for many centuries and still an active religious site.' },
      { name: 'Kasımiye Madrasa', desc: 'A 15th-century madrasa with a courtyard pool, just below the old town.' },
      { name: 'Dara ancient city', desc: 'Roman and Byzantine ruins with underground cisterns and rock tombs, about half an hour away.' },
      { name: 'Midyat and Mor Gabriel', desc: 'Midyat\'s stone mansions and silversmiths, and Mor Gabriel, one of the oldest functioning monasteries in the world.' },
    ],
  },
  {
    slug: 'gaziantep',
    name: 'Gaziantep',
    region: 'Southeast Anatolia',
    tagline: 'Türkiye\'s capital of flavour — baklava, pistachios and some of the finest Roman mosaics in the world.',
    intro: [
      'Gaziantep is where many Turks travel just to eat. The city is a UNESCO Creative City of Gastronomy, famous for pistachio baklava, kebabs and a spice-rich cuisine that borrows from Anatolia and the Levant.',
      'It also holds the Zeugma Mosaic Museum, one of the largest mosaic collections anywhere. The region was affected by the February 2023 earthquakes; we check what is open and plan with local partners.',
    ],
    practical: {
      bestTime: 'March–May and October–November. Summers regularly pass 35°C.',
      howLong: '2 days — one for the museums, one mostly for eating.',
      gettingThere: 'Gaziantep Airport (GZT) has flights from Istanbul and Ankara. Şanlıurfa is about two hours by road.',
    },
    pairWith: ['sanliurfa', 'mardin'],
    faq: [
      { q: 'What is Gaziantep famous for?', a: 'Its food — especially pistachio baklava and kebabs — and the Zeugma Mosaic Museum.' },
      { q: 'Was Gaziantep affected by the 2023 earthquake?', a: 'Yes, parts of the region were affected. Most visitor sites in the city have reopened, but we confirm the status of each place before you travel.' },
    ],
    cover: '',
    accent: '#8a3a2b',
    attractions: [
      { name: 'Zeugma Mosaic Museum', desc: 'Roman mosaics rescued from the ancient city of Zeugma, including the famous "Gypsy Girl". Allow at least two hours.' },
      { name: 'A baklava tasting', desc: 'Gaziantep pistachio baklava is protected by a geographical indication. We take you to the historic bakeries, at the hour it comes out of the oven.' },
      { name: 'Coppersmiths\' Bazaar', desc: 'Workshops where copper is still hammered by hand, in the lanes around the old covered markets.' },
      { name: 'Zincirli Bedesten', desc: 'A restored Ottoman covered market for spices, dried peppers and local produce.' },
      { name: 'Tahmis Coffee House', desc: 'A historic coffee house where you can try menengiç, a coffee-like drink made from wild pistachio.' },
      { name: 'The castle quarter', desc: 'The historic castle at the heart of the city was damaged in 2023 and is being restored; the surrounding old town remains the best place to walk.' },
    ],
  },
  {
    slug: 'sanliurfa',
    name: 'Şanlıurfa',
    region: 'Southeast Anatolia · Upper Mesopotamia',
    tagline: 'Home of Göbekli Tepe — where the story of human civilisation is being rewritten.',
    intro: [
      'Şanlıurfa, often just called Urfa, is one of the oldest continuously inhabited cities in the region and a place of pilgrimage associated with the Prophet Abraham. Its sacred fish pools, bazaars and stone lanes feel far older than the modern city around them.',
      'Just outside it lies Göbekli Tepe, a UNESCO World Heritage Site with monumental carved pillars around 11,000 years old — older than Stonehenge and the pyramids. For many travellers it is the reason to come to Türkiye at all.',
    ],
    practical: {
      bestTime: 'October–April. From June to September temperatures often pass 40°C.',
      howLong: '2 days; 3 if you add Harran and Karahan Tepe at a relaxed pace.',
      gettingThere: 'Şanlıurfa GAP Airport (GNY) has flights from Istanbul and Ankara. Göbekli Tepe is about 20 minutes from the city.',
    },
    pairWith: ['gaziantep', 'mardin'],
    faq: [
      { q: 'How old is Göbekli Tepe?', a: 'Its oldest structures are dated to around 9600 BC, roughly 11,500 years ago, which makes it one of the oldest known monumental sites in the world.' },
      { q: 'Can you visit Göbekli Tepe and Harran in one day?', a: 'Yes. Göbekli Tepe in the morning and Harran in the afternoon is a classic day, though in summer we start very early to avoid the heat.' },
    ],
    cover: '',
    accent: '#8a6b2b',
    attractions: [
      { name: 'Göbekli Tepe', desc: 'Massive T-shaped stone pillars carved with animals, built by hunter-gatherers before farming. A covered walkway lets you see the enclosures up close.' },
      { name: 'Karahan Tepe', desc: 'A related Neolithic site in the Taş Tepeler region, with carved human heads and chambers cut into the bedrock.' },
      { name: 'Balıklıgöl', desc: 'The Pool of Sacred Fish, linked by tradition to Abraham, surrounded by mosques and rose gardens.' },
      { name: 'Şanlıurfa Archaeology Museum', desc: 'One of Türkiye\'s largest museums, with finds from Göbekli Tepe and the "Urfa Man", one of the oldest known life-size human statues.' },
      { name: 'Haleplibahçe Mosaic Museum', desc: 'Roman-era mosaics, including a rare Amazon queens mosaic, displayed where they were found.' },
      { name: 'Harran', desc: 'Beehive-shaped mud-brick houses and the ruins of an early Islamic university, about an hour south.' },
    ],
  },
  {
    slug: 'canakkale',
    name: 'Çanakkale',
    region: 'Marmara · Dardanelles',
    tagline: 'Troy, Gallipoli and the strait between them — where myth and modern history meet.',
    intro: [
      'Çanakkale sits on the Dardanelles, the narrow strait between Europe and Asia. Within an hour are the ruins of Troy and the battlefields of the 1915 Gallipoli campaign, which shaped the modern histories of Türkiye, Australia and New Zealand.',
      'It is a relaxed university town with a lively waterfront. We plan the battlefields with a specialist guide and the ancient sites around the light, and often continue south to Assos and Bozcaada.',
    ],
    practical: {
      bestTime: 'April–June and September–October. Anzac Day (25 April) is very busy on the peninsula — book months ahead.',
      howLong: '2 days for Troy and Gallipoli; 3–4 with Assos or Bozcaada.',
      gettingThere: 'About 4–5 hours by road from Istanbul over the 1915 Çanakkale Bridge. Çanakkale Airport (CKZ) has limited flights.',
    },
    pairWith: ['bozcaada', 'ayvalik', 'istanbul'],
    faq: [
      { q: 'Is Troy worth visiting?', a: 'Yes, especially combined with the Troy Museum. The ruins are modest to look at, so a good guide makes a big difference.' },
      { q: 'How much time do you need for Gallipoli?', a: 'A full day covers the main Anzac and Turkish memorials. Visitors with family connections often want a second day for specific cemeteries.' },
    ],
    cover: '',
    accent: '#2b4a6b',
    attractions: [
      { name: 'Troy', desc: 'The layered ruins of the city of the Iliad, a UNESCO site spanning thousands of years of settlement.' },
      { name: 'Troy Museum', desc: 'An excellent modern museum near the site that explains the excavations and displays treasures returned to Türkiye.' },
      { name: 'Gallipoli Peninsula Historical Site', desc: 'Memorials, cemeteries and trenches on both sides of the 1915 campaign, including Anzac Cove and the Çanakkale Martyrs\' Memorial.' },
      { name: 'The 1915 Çanakkale Bridge', desc: 'One of the longest suspension bridges in the world, linking the two shores of the Dardanelles since 2022.' },
      { name: 'The waterfront', desc: 'A long promenade with fish restaurants, the wooden horse from the 2004 film "Troy", and ferries crossing to Eceabat.' },
      { name: 'Assos', desc: 'The hilltop Temple of Athena looking over the Aegean towards Lesbos, about 90 minutes south.' },
    ],
  },
  {
    slug: 'marmaris',
    name: 'Marmaris',
    region: 'Aegean–Mediterranean coast · Muğla',
    tagline: 'A pine-ringed bay and the gateway to the quiet peninsulas beyond it.',
    intro: [
      'Marmaris sits in a deep, sheltered bay surrounded by pine-covered hills, with one of the busiest marinas on the coast. The town itself is lively; the real prize is the coastline around it.',
      'We use Marmaris as a starting point for boat days and for the Bozburun and Selimiye peninsula villages, where the water is clear and the pace is slow.',
    ],
    practical: {
      bestTime: 'May–June and September–October.',
      howLong: '3–4 days, more if you plan to sail.',
      gettingThere: 'Dalaman Airport (DLM) is about 90 minutes away; Bodrum Airport is around two hours.',
    },
    pairWith: ['datca', 'dalyan', 'bodrum'],
    faq: [
      { q: 'Is Marmaris good for a quiet holiday?', a: 'The town centre is lively, but the nearby peninsula villages such as Selimiye and Bozburun are very peaceful.' },
      { q: 'Can you start a gulet cruise from Marmaris?', a: 'Yes, Marmaris is one of the main departure points for gulet cruises along the Turquoise Coast.' },
    ],
    cover: '',
    accent: '#0e5a7b',
    attractions: [
      { name: 'Marmaris Castle and old town', desc: 'A small Ottoman-era castle above the marina, with narrow lanes and harbour views.' },
      { name: 'Bozburun Peninsula', desc: 'Fishing villages, wooden-boat yards and some of the cleanest water on the coast.' },
      { name: 'Selimiye', desc: 'A peaceful bay village known for waterfront seafood restaurants.' },
      { name: 'A private boat day', desc: 'The bays and islands around Marmaris are best explored from the water, with swimming stops away from the crowds.' },
      { name: 'Turunç and Kumlubük', desc: 'Quieter beaches a short boat or car ride from town.' },
      { name: 'Dalyan day trip', desc: 'The river, rock tombs and turtle beach of Dalyan are an easy excursion.' },
    ],
  },
  {
    slug: 'alanya',
    name: 'Alanya',
    region: 'Mediterranean coast · Antalya province',
    tagline: 'A Seljuk fortress on a rocky headland, with beaches on either side.',
    intro: [
      'Alanya is dominated by its great castle, which crowns a rocky peninsula above the Mediterranean. The Seljuk sultan Alaeddin Keykubad made it his winter capital in the 13th century, and his walls and shipyard still stand.',
      'Today it is a large resort, but the historic peninsula, the Taurus Mountains behind it and long sunny seasons make it more than a beach town.',
    ],
    practical: {
      bestTime: 'April–June and September–November. The season is long and winters are mild.',
      howLong: '3–4 days.',
      gettingThere: 'Gazipaşa–Alanya Airport (GZP) is about 40 minutes away; Antalya Airport is around two hours.',
    },
    pairWith: ['side', 'antalya'],
    faq: [
      { q: 'Is Alanya or Antalya better?', a: 'Antalya offers more history and city life; Alanya is more of a beach resort with a spectacular castle. We often combine them.' },
      { q: 'Can you walk up to Alanya Castle?', a: 'Yes, though it is a steep climb. A cable car also links the beach to the castle area.' },
    ],
    cover: '',
    accent: '#0e6b7b',
    attractions: [
      { name: 'Alanya Castle', desc: 'Walls, cisterns and a village within the fortress, with sweeping views of both bays.' },
      { name: 'The Red Tower', desc: 'An octagonal 13th-century tower guarding the harbour, now a small museum.' },
      { name: 'The Seljuk shipyard', desc: 'Stone arches where the sultans\' fleet was built, reached along the waterfront below the castle.' },
      { name: 'Cleopatra Beach', desc: 'A long sandy beach on the west side of the peninsula.' },
      { name: 'Damlataş Cave', desc: 'A small stalactite cave right by the beach.' },
      { name: 'Sapadere Canyon', desc: 'A cool mountain gorge with walkways and waterfalls in the Taurus foothills.' },
    ],
  },
  {
    slug: 'kas',
    name: 'Kaş',
    region: 'Lycian coast · Antalya province',
    tagline: 'A small harbour town with clear water, sunken ruins and a Greek island just offshore.',
    intro: [
      'Kaş is one of the most charming towns on the Turkish coast — white houses with bougainvillea around a small harbour, with a Greek island visible across the water. It has kept its small scale and its character.',
      'It is our favourite base on the Lycian coast for diving, sea kayaking over sunken ruins, and easy access to Patara and the Lycian Way.',
    ],
    practical: {
      bestTime: 'May–June and September–October. Summer is hot but the sea breeze helps.',
      howLong: '3–4 days.',
      gettingThere: 'Dalaman Airport (DLM) is about 2.5 hours away; Antalya Airport around 3.5 hours by the scenic coastal road.',
    },
    pairWith: ['fethiye', 'antalya'],
    faq: [
      { q: 'Is Kaş good for families?', a: 'Yes, though beaches are mostly rocky platforms and small coves rather than long sandy strips. Patara and Kaputaş are the best sandy options.' },
      { q: 'Can you visit the Greek island of Meis from Kaş?', a: 'Yes, a short ferry runs regularly. You need a passport and, depending on nationality, a Schengen visa or visa-on-arrival arrangement — we check your case.' },
    ],
    cover: '',
    accent: '#0e4a7b',
    attractions: [
      { name: 'Kekova and Simena', desc: 'A boat or kayak trip over the partly submerged ancient city, ending at the castle village of Kaleköy.' },
      { name: 'Kaputaş Beach', desc: 'A small turquoise cove at the bottom of a gorge between Kaş and Kalkan.' },
      { name: 'Antiphellos Theatre', desc: 'A Hellenistic theatre on the edge of town, facing the sea — best at sunset.' },
      { name: 'Diving in Kaş', desc: 'Clear water, underwater walls and wrecks make Kaş one of Türkiye\'s best diving centres.' },
      { name: 'Meis (Kastellorizo)', desc: 'A short ferry crossing to a small Greek island — take your passport.' },
      { name: 'Patara Beach', desc: 'A long, wild beach backed by dunes and an ancient Lycian city, about 45 minutes away.' },
    ],
  },
  {
    slug: 'safranbolu',
    name: 'Safranbolu',
    region: 'Western Black Sea · Karabük',
    tagline: 'A UNESCO Ottoman town of timber mansions, cobbled lanes and saffron sweets.',
    intro: [
      'Safranbolu is one of the best-preserved Ottoman towns in Türkiye, a UNESCO World Heritage Site since 1994. Its whitewashed, timber-framed mansions were built by merchants who grew rich on the caravan route between the Black Sea and Anatolia.',
      'Staying in a restored mansion is the point: evenings in the old bazaar, a hammam, and mornings before the day-trippers arrive.',
    ],
    practical: {
      bestTime: 'April–June and September–October.',
      howLong: '1–2 nights.',
      gettingThere: 'About 3 hours by road from Ankara and 5–6 hours from Istanbul.',
    },
    pairWith: ['ankara', 'istanbul'],
    faq: [
      { q: 'Is Safranbolu worth an overnight stay?', a: 'Yes. Day-trippers leave by late afternoon, and the town is at its most beautiful in the evening and early morning.' },
      { q: 'Why is it called Safranbolu?', a: 'The name comes from saffron, which was historically grown in the area; you will find it in local sweets and tea.' },
    ],
    cover: '',
    accent: '#6b3a2b',
    attractions: [
      { name: 'The old town (Çarşı)', desc: 'Cobbled lanes of craft shops, tea houses and lokum sellers beneath the mansions.' },
      { name: 'Cinci Han', desc: 'A grand 17th-century caravanserai with a rooftop view over the town.' },
      { name: 'Kaymakamlar House Museum', desc: 'A mansion furnished as it was in Ottoman times, showing how these homes worked.' },
      { name: 'Hıdırlık Hill', desc: 'The classic viewpoint over the rooftops, best at sunset.' },
      { name: 'İncekaya Aqueduct and Tokatlı Canyon', desc: 'An Ottoman-era aqueduct and a glass-floored viewing terrace over the canyon.' },
      { name: 'Yörük Village', desc: 'A small, quiet village of traditional houses a short drive away.' },
    ],
  },
  {
    slug: 'ayvalik',
    name: 'Ayvalık',
    region: 'North Aegean · Balıkesir',
    tagline: 'Olive oil, old stone houses and island sunsets on the North Aegean.',
    intro: [
      'Ayvalık is a North Aegean town built on olive oil, with a maze of old Greek stone houses, converted soap and oil factories, and a necklace of small islands offshore.',
      'It is a favourite of Istanbul locals and still feels authentic. We plan it around food, slow mornings in the old town and evenings on Cunda island.',
    ],
    practical: {
      bestTime: 'May–June and September–October.',
      howLong: '2–3 days.',
      gettingThere: 'About 2 hours by road from Izmir Airport; Balıkesir Koca Seyit Airport (EDO) at Edremit is closer.',
    },
    pairWith: ['izmir', 'canakkale'],
    faq: [
      { q: 'Is Ayvalık good for a relaxed holiday?', a: 'Yes. It is known for slow food, olive oil and sunsets rather than nightlife.' },
      { q: 'What is Ayvalık known for?', a: 'Olive oil, its well-preserved old Greek houses, Cunda island and the Ayvalık toast sandwich.' },
    ],
    cover: '',
    accent: '#4a6b2b',
    attractions: [
      { name: 'The old town', desc: 'Stone houses, former churches turned mosques, and small coffee houses in narrow lanes.' },
      { name: 'Cunda (Alibey) Island', desc: 'Linked by a causeway — waterfront seafood tavernas and a quiet old quarter.' },
      { name: 'Şeytan Sofrası', desc: 'A hilltop viewpoint famous for sunsets over the islands.' },
      { name: 'Olive oil tasting', desc: 'Visits to family producers and restored factories to learn how North Aegean oil is made.' },
      { name: 'Sarımsaklı Beach', desc: 'A long sandy beach a short drive from the centre.' },
      { name: 'Island boat tours', desc: 'Day trips between the small islands of Ayvalık bay.' },
    ],
  },
  {
    slug: 'datca',
    name: 'Datça',
    region: 'Aegean–Mediterranean · Muğla',
    tagline: 'A long, narrow peninsula where two seas meet — almond trees, stone villages and clear water.',
    intro: [
      'The Datça peninsula stretches between the Aegean and the Mediterranean, with the ancient city of Knidos at its tip. It is known for clean air, almond and olive groves, local honey and deliberately slow development.',
      'We plan Datça for travellers who want calm, nature and swimming in quiet bays, with simple, excellent food.',
    ],
    practical: {
      bestTime: 'May–October; the water is warmest from July to September.',
      howLong: '3–5 days.',
      gettingThere: 'About 2.5 hours from Dalaman Airport. In summer, a ferry links Bodrum with the peninsula.',
    },
    pairWith: ['marmaris', 'bodrum'],
    faq: [
      { q: 'Is Datça hard to reach?', a: 'It takes some time — the road winds along the peninsula — but the journey is part of why it stays quiet.' },
      { q: 'Is Datça good for swimming?', a: 'Yes. Its bays have some of the cleanest water on the coast.' },
    ],
    cover: '',
    accent: '#0e5a5a',
    attractions: [
      { name: 'Knidos', desc: 'The ruins of an ancient Greek city with two harbours, at the very tip of the peninsula.' },
      { name: 'Eski Datça', desc: 'The old stone village with bougainvillea-covered houses and small cafés.' },
      { name: 'Palamutbükü', desc: 'A quiet bay with fish restaurants on the way to Knidos.' },
      { name: 'Datça town and harbour', desc: 'A relaxed harbour with evening strolls and seafood.' },
      { name: 'Local producers', desc: 'Almonds, thyme honey and olive oil from the peninsula\'s villages.' },
      { name: 'Bays by boat', desc: 'Secluded coves that are hard to reach by road.' },
    ],
  },
  {
    slug: 'side',
    name: 'Side',
    region: 'Mediterranean coast · Antalya province',
    tagline: 'A Roman temple at the water\'s edge, and a whole ancient city under a village.',
    intro: [
      'Side is a small peninsula where a modern village has grown among the ruins of an ancient harbour city. The columns of the Temple of Apollo stand at the edge of the sea, and a Roman theatre rises above the main street.',
      'It is compact and easy, and one of the best bases for Aspendos, the most complete Roman theatre in Türkiye.',
    ],
    practical: {
      bestTime: 'April–June and September–November.',
      howLong: '2–3 days.',
      gettingThere: 'About an hour by road from Antalya Airport (AYT).',
    },
    pairWith: ['antalya', 'alanya'],
    faq: [
      { q: 'Is Side good for history lovers?', a: 'Yes. The ruins are part of the village itself, and Aspendos and Perge are within an hour.' },
      { q: 'Is Side walkable?', a: 'Yes. The old peninsula is compact and largely pedestrian.' },
    ],
    cover: '',
    accent: '#6b5a3a',
    attractions: [
      { name: 'Temple of Apollo', desc: 'Reconstructed columns on the shoreline — magical at sunset.' },
      { name: 'The ancient theatre', desc: 'A large Roman theatre at the entrance to the peninsula.' },
      { name: 'Side Museum', desc: 'A small museum housed in a Roman bath, with fine statues from the site.' },
      { name: 'Aspendos', desc: 'One of the best-preserved Roman theatres in the world, still used for performances, about 40 minutes away.' },
      { name: 'Manavgat Waterfall', desc: 'A wide, low waterfall and a river boat trip nearby.' },
      { name: 'The beaches', desc: 'Long sandy beaches on both sides of the peninsula.' },
    ],
  },
  {
    slug: 'dalyan',
    name: 'Dalyan',
    region: 'Lycian coast · Muğla',
    tagline: 'Rock tombs above a reed-lined river, and a beach where sea turtles nest.',
    intro: [
      'Dalyan is a small river town whose views are dominated by Lycian rock tombs carved into the cliffs across the water. Wooden boats take visitors through the reed beds to the sea.',
      'It is also a conservation success story: İztuzu Beach is a protected nesting ground for loggerhead sea turtles. We plan it slowly, by boat.',
    ],
    practical: {
      bestTime: 'May–October. During turtle nesting season the beach is closed at night.',
      howLong: '2–3 days.',
      gettingThere: 'About 30 minutes from Dalaman Airport (DLM).',
    },
    pairWith: ['fethiye', 'marmaris'],
    faq: [
      { q: 'Can you see turtles in Dalyan?', a: 'Loggerhead turtles nest on İztuzu Beach from roughly May to September. Sightings in the river are common, and the rescue centre explains the conservation work.' },
      { q: 'Is Dalyan close to the airport?', a: 'Yes, it is one of the closest resort towns to Dalaman Airport, about half an hour away.' },
    ],
    cover: '',
    accent: '#2b6b5a',
    attractions: [
      { name: 'Kaunos rock tombs', desc: 'Temple-fronted tombs cut high into the cliff, seen best from the river at dusk.' },
      { name: 'Kaunos ancient city', desc: 'The ruins of a Carian–Lycian port city, reached by a short boat ride.' },
      { name: 'İztuzu (Turtle) Beach', desc: 'A long sandy beach between the river and the sea, protected for nesting turtles.' },
      { name: 'River boat trip', desc: 'Through the reeds to the beach, the ruins and the lake.' },
      { name: 'Köyceğiz Lake', desc: 'A large lake with thermal springs and mud baths on its shore.' },
      { name: 'Sea turtle rescue centre', desc: 'A research and rehabilitation centre near the beach.' },
    ],
  },
  {
    slug: 'kusadasi',
    name: 'Kuşadası',
    region: 'Aegean coast · Aydın',
    tagline: 'A lively port town and the closest base for Ephesus.',
    intro: [
      'Kuşadası is a busy Aegean port and resort, known to many as the cruise stop for Ephesus. The ancient city is only about 20 minutes away.',
      'We use it when travellers want sea and beaches alongside the great sites of the southern Aegean — Ephesus, Priene, Miletus and Didyma.',
    ],
    practical: {
      bestTime: 'April–June and September–October.',
      howLong: '2–3 days.',
      gettingThere: 'About an hour from Izmir Airport (ADB).',
    },
    pairWith: ['ephesus', 'sirince', 'izmir'],
    faq: [
      { q: 'Is Kuşadası or Selçuk better for visiting Ephesus?', a: 'Selçuk is quieter and closer; Kuşadası offers more hotels, restaurants and beaches.' },
      { q: 'Is Kuşadası busy with cruise ships?', a: 'On cruise days the town centre is busy in the morning; we time visits to Ephesus to avoid the peak.' },
    ],
    cover: '',
    accent: '#2b5a6b',
    attractions: [
      { name: 'Pigeon Island', desc: 'A small castle island linked to the town by a causeway.' },
      { name: 'Ephesus', desc: 'The great Roman city, about 20 minutes inland.' },
      { name: 'House of the Virgin Mary', desc: 'A place of pilgrimage on a wooded hill near Ephesus.' },
      { name: 'Dilek Peninsula National Park', desc: 'Protected coves and walking trails south of town.' },
      { name: 'Priene, Miletus and Didyma', desc: 'Three major ancient sites that make a rewarding day together.' },
      { name: 'Şirince', desc: 'A hill village of stone houses and fruit wines, about 30 minutes away.' },
    ],
  },
  {
    slug: 'edirne',
    name: 'Edirne',
    region: 'Thrace · on the Greek and Bulgarian borders',
    tagline: 'Sinan\'s masterpiece, a former Ottoman capital, and the oldest wrestling festival in the world.',
    intro: [
      'Edirne was the Ottoman capital before the conquest of Constantinople, and it holds the Selimiye Mosque, the masterpiece of the great architect Sinan and a UNESCO World Heritage Site.',
      'It is an easy, rewarding trip from Istanbul, with Ottoman bridges, a remarkable historic hospital and a local food tradition of its own.',
    ],
    practical: {
      bestTime: 'April–June and September–October; late June or early July for Kırkpınar.',
      howLong: '1–2 days.',
      gettingThere: 'About 2.5–3 hours by road from Istanbul.',
    },
    pairWith: ['istanbul', 'canakkale'],
    faq: [
      { q: 'Is Edirne a good day trip from Istanbul?', a: 'Yes, but it is a long day. An overnight stay lets you see the mosques in the evening light.' },
      { q: 'When is the Kırkpınar oil-wrestling festival?', a: 'It is held every summer, usually in late June or early July. Exact dates are announced each year.' },
    ],
    cover: '',
    accent: '#6b2b3a',
    attractions: [
      { name: 'Selimiye Mosque', desc: 'Sinan\'s masterpiece, with one of the widest domes in Ottoman architecture.' },
      { name: 'Old Mosque (Eski Cami)', desc: 'An early Ottoman mosque with giant calligraphy on its walls.' },
      { name: 'Sultan Bayezid II Complex', desc: 'A 15th-century hospital complex, now a health museum, where music and water were used in treatment.' },
      { name: 'Kırkpınar', desc: 'The oil-wrestling festival held each summer, one of the oldest continuously held sporting events in the world.' },
      { name: 'Meriç Bridge', desc: 'An Ottoman bridge over the river, best at sunset.' },
      { name: 'Tava ciğer', desc: 'Crispy fried liver, the city\'s signature dish.' },
    ],
  },
  {
    slug: 'bozcaada',
    name: 'Bozcaada',
    region: 'North Aegean island · Çanakkale',
    tagline: 'A small wine island with a castle, windmills and Aegean light.',
    intro: [
      'Bozcaada is a small island off the North Aegean coast, known for its vineyards, wineries, a castle by the harbour and an old Greek quarter of cobbled streets.',
      'It is a favourite weekend escape for Istanbul locals. We plan it for a slow few days of wine, swimming and sunsets by the windmills.',
    ],
    practical: {
      bestTime: 'June–September; spring and early autumn for quieter days.',
      howLong: '2–3 days.',
      gettingThere: 'Ferry from Geyikli (Yükyeri) port, about an hour south of Çanakkale.',
    },
    pairWith: ['canakkale', 'ayvalik'],
    faq: [
      { q: 'Do you need a car on Bozcaada?', a: 'Not usually. The island is small and walkable, and bikes or local taxis cover the beaches.' },
      { q: 'Is Bozcaada busy in summer?', a: 'Yes, especially in July and August. Ferry and hotel bookings well in advance are essential.' },
    ],
    cover: '',
    accent: '#3a5a7b',
    attractions: [
      { name: 'Bozcaada Castle', desc: 'A fortress guarding the harbour, rebuilt many times over the centuries.' },
      { name: 'The old Greek quarter', desc: 'Cobbled streets, cafés and small shops.' },
      { name: 'Vineyards and wineries', desc: 'Island wines tasted where they are made.' },
      { name: 'Ayazma Beach', desc: 'The island\'s best-known sandy beach.' },
      { name: 'Polente Lighthouse', desc: 'The western tip of the island, known for sunsets.' },
      { name: 'The windmills', desc: 'A row of wind turbines and old windmills on the west coast.' },
    ],
  },
  {
    slug: 'van',
    name: 'Van',
    region: 'Eastern Anatolia · Lake Van',
    tagline: 'A vast turquoise lake, a church on an island, and the most famous breakfast in Türkiye.',
    intro: [
      'Lake Van is the largest lake in Türkiye, a vast soda lake ringed by snow-capped mountains at over 1,600 metres. Its deep blue water and high-altitude light make it one of the most striking landscapes in the country.',
      'We come for Akdamar Island, the ancient fortress, and the famous Van breakfast — a spread that is almost a destination in itself.',
    ],
    practical: {
      bestTime: 'June–September. Winters are long and cold.',
      howLong: '2–3 days.',
      gettingThere: 'Van Ferit Melen Airport (VAN) has flights from Istanbul and Ankara.',
    },
    pairWith: ['kars', 'mardin'],
    faq: [
      { q: 'Can you swim in Lake Van?', a: 'Yes. The water is highly alkaline and feels soapy, and very little can live in it.' },
      { q: 'How do you get to Akdamar Island?', a: 'Boats leave from the shore near Gevaş and take about 20 minutes.' },
    ],
    cover: '',
    accent: '#2b3a7b',
    attractions: [
      { name: 'Akdamar Island', desc: 'The 10th-century Armenian Church of the Holy Cross, with remarkable carved reliefs, reached by boat.' },
      { name: 'Van Fortress', desc: 'The Urartian rock fortress above the lake, around 3,000 years old.' },
      { name: 'Van breakfast', desc: 'Dozens of small plates — herbed cheeses, honey, clotted cream and more.' },
      { name: 'Muradiye Waterfall', desc: 'A waterfall north-east of the city.' },
      { name: 'Hoşap Castle', desc: 'A dramatic castle on a rocky outcrop south-east of Van.' },
      { name: 'The Van cat', desc: 'The local cat breed known for its white fur and odd-coloured eyes.' },
    ],
  },
  {
    slug: 'kars',
    name: 'Kars',
    region: 'Eastern Anatolia · near the Armenian border',
    tagline: 'A frontier city of Baltic-style architecture, snow, and the ruins of medieval Ani.',
    intro: [
      'Kars feels unlike anywhere else in Türkiye, with stone buildings from its time under Russian rule in the late 19th and early 20th centuries, and a harsh, beautiful winter landscape.',
      'Nearby, the ruins of Ani — a UNESCO site on the Armenian border — are one of the most evocative ancient cities in the region.',
    ],
    practical: {
      bestTime: 'December–February for snow and the Eastern Express; June–September for Ani in green landscapes.',
      howLong: '2–3 days.',
      gettingThere: 'Kars Harakani Airport (KSY), or the Eastern Express from Ankara, which takes more than a day.',
    },
    pairWith: ['van', 'trabzon'],
    faq: [
      { q: 'Is the Eastern Express worth it?', a: 'For many travellers, yes — it is slow and simple, but the snowy scenery is the experience. Tickets sell out quickly in winter.' },
      { q: 'How cold is Kars in winter?', a: 'Very cold; temperatures below −20°C are not unusual. Proper winter clothing is essential.' },
    ],
    cover: '',
    accent: '#3a4a6b',
    attractions: [
      { name: 'Ani', desc: 'The ruins of a medieval capital, with churches and walls set above a gorge on the border.' },
      { name: 'Kars Castle', desc: 'A fortress above the city with sweeping views.' },
      { name: 'The Russian-era architecture', desc: 'Grand stone buildings along the city\'s grid of streets.' },
      { name: 'Kars cheese and honey', desc: 'Gruyère-style cheese and local honey from the high plateau.' },
      { name: 'The Eastern Express', desc: 'The long train journey from Ankara to Kars, popular in winter for its snowy scenery.' },
      { name: 'Lake Çıldır', desc: 'Frozen in winter, with horse-drawn sleighs and ice fishing.' },
    ],
  },
  {
    slug: 'sirince',
    name: 'Şirince',
    region: 'Aegean hills · near Selçuk',
    tagline: 'A hillside village of stone houses, fruit wines and olive groves above Ephesus.',
    intro: [
      'Şirince is a village of stone and whitewashed houses set among olive groves and vineyards in the hills above Selçuk. It is known for its fruit wines, village breakfasts and craft shops.',
      'It is the perfect pairing with Ephesus: history in the morning, lunch and a quiet afternoon in the village.',
    ],
    practical: {
      bestTime: 'April–June and September–October.',
      howLong: 'Half a day as an excursion, or one night for peace.',
      gettingThere: 'About 15 minutes by road from Selçuk; around an hour from Izmir Airport.',
    },
    pairWith: ['ephesus', 'kusadasi', 'izmir'],
    faq: [
      { q: 'Is Şirince worth visiting?', a: 'Yes, especially combined with Ephesus. It gets busy around midday, so late afternoon or an overnight stay is more peaceful.' },
      { q: 'Can you stay overnight in Şirince?', a: 'Yes. There are small boutique hotels in restored village houses.' },
    ],
    cover: '',
    accent: '#6b4a3a',
    attractions: [
      { name: 'The village centre', desc: 'Cobbled lanes, craft stalls and wine-tasting cafés.' },
      { name: 'Fruit wines', desc: 'Local wines made from blackberry, peach, melon and more.' },
      { name: 'Village breakfast', desc: 'A long breakfast of local produce on a terrace.' },
      { name: 'Church of St John the Baptist', desc: 'A restored church at the top of the village.' },
      { name: 'Hill walks', desc: 'Paths through olive groves above the village.' },
      { name: 'Ephesus', desc: 'Only about 15 minutes away.' },
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export const destinationSlugs = destinations.map((d) => d.slug);
