// =====================================================
// DESTINASYON İÇ SAYFA VERİSİ — ilk parti 10 şehir.
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
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export const destinationSlugs = destinations.map((d) => d.slug);
