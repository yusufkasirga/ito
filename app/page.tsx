import fs from 'node:fs';
import path from 'node:path';
import HomeClient from './HomeClient';
import StatsBand from './components/home/StatsBand';
import RegionExplorer, { type Region } from './components/home/RegionExplorer';
import Seasons from './components/home/Seasons';
import { Routes, PlanTrip, Journal, QuoteBand, Gallery } from './components/home/Sections';
import { destinations, getDestination } from './destinations/destinationData';
import { blogArticles } from './blog/blogPosts';

// =====================================================
// ANA SAYFA (sunucu) — etkileşimli gövde HomeClient'ta; bu dosya
// statik bölümleri sunucuda hazırlar ve akıştaki yerlerine yerleştirir.
// Veriler burada okunur, istemciye yalnız gereken küçük parçalar gider.
// =====================================================

const hasPhoto = (slug: string) =>
  fs.existsSync(path.join(process.cwd(), 'public', 'images', 'dest', `${slug}.jpg`));

const REGIONS: { id: string; label: string; blurb: string; slugs: string[] }[] = [
  {
    id: 'marmara', label: 'Marmara & Thrace',
    blurb: 'Istanbul and its hinterland: Ottoman capitals, the Dardanelles, Troy and Gallipoli, and two quiet North Aegean islands.',
    slugs: ['istanbul', 'bursa', 'edirne', 'canakkale', 'bozcaada', 'gokceada'],
  },
  {
    id: 'aegean', label: 'Aegean',
    blurb: 'The densest map of the ancient world — Ephesus, Pergamon, Didyma — with olive-oil towns and easy seaside evenings in between.',
    slugs: ['ephesus', 'izmir', 'pamukkale', 'bodrum', 'kusadasi', 'sirince', 'ayvalik', 'bergama', 'assos', 'foca', 'didim'],
  },
  {
    id: 'mediterranean', label: 'Mediterranean',
    blurb: 'The Turquoise Coast: Lycian tombs above the water, gulet coves, Roman cities in the dunes and the Taurus Mountains behind it all.',
    slugs: ['antalya', 'fethiye', 'kas', 'dalyan', 'marmaris', 'alanya', 'side', 'olympos', 'datca', 'kalkan', 'patara', 'gocek', 'akyaka'],
  },
  {
    id: 'central', label: 'Central Anatolia',
    blurb: 'The high plateau — Cappadocia’s valleys, Rumi’s Konya, the capital’s museums and the best-preserved Ottoman towns.',
    slugs: ['cappadocia', 'konya', 'ankara', 'safranbolu', 'amasya', 'eskisehir', 'afyon'],
  },
  {
    id: 'blacksea', label: 'Black Sea',
    blurb: 'Green mountains falling into the sea, tea terraces, highland villages above the clouds and a monastery cut into a cliff.',
    slugs: ['trabzon', 'rize', 'artvin', 'sinop'],
  },
  {
    id: 'east', label: 'Southeast & East',
    blurb: 'Where history begins: Göbekli Tepe, Mardin’s stone lanes, Gaziantep’s kitchens, Lake Van and the ruins of Ani.',
    slugs: ['sanliurfa', 'mardin', 'gaziantep', 'van', 'nemrut', 'diyarbakir', 'hatay', 'adana', 'kars', 'erzurum', 'bitlis'],
  },
];

function buildRegions(): Region[] {
  const known = new Set(destinations.map((d) => d.slug));
  return REGIONS.map((r) => {
    const cards = r.slugs
      .filter((s) => known.has(s))
      .map((s) => {
        const d = getDestination(s)!;
        return { slug: s, name: d.name, line: d.tagline, photo: hasPhoto(s), accent: d.accent };
      })
      .sort((a, b) => Number(b.photo) - Number(a.photo));
    return { id: r.id, label: r.label, blurb: r.blurb, cards };
  });
}

function latestArticles(n: number) {
  return [...blogArticles]
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    .slice(0, n)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      cover: a.cover,
      category: a.category,
      date: new Date(a.dateISO).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    }));
}

export default function Home() {
  const regions = buildRegions();

  return (
    <HomeClient
      slots={{
        afterMarquee: (
          <StatsBand
            note="Paid only by our clients — no hotel, clinic or guide can pay us to recommend them."
            stats={[
              { value: 52, label: 'Destination guides' },
              { value: 4, label: 'Languages we work in' },
              { value: 72, suffix: 'h', label: 'To your written plan' },
              { value: 0, suffix: '%', label: 'Commission from providers' },
            ]}
          />
        ),
        afterExperiences: (
          <>
            <RegionExplorer
              eyebrow="Explore by region"
              title="Six regions,"
              accent="one country."
              guidesLabel="guides"
              allLabel="Browse all destinations"
              regions={regions}
            />
            <Routes
              eyebrow="Signature journeys"
              title="Routes we love"
              accent="to plan."
              copy="Four ways into Türkiye that work beautifully for a first or second visit. Treat them as starting points — we reshape every day around your dates, pace and interests."
              note="Example routes, not packages. Every plan is written for you, and every provider cost is shown separately from our fee."
              cta="Plan a route with us"
              routes={[
                { days: 7, title: 'Istanbul & Cappadocia', photo: 'cappadocia', text: 'The classic first visit at the right pace: four days in Istanbul, a one-hour flight, then three nights among the valleys and balloons.', stops: [{ slug: 'istanbul', name: 'Istanbul' }, { slug: 'cappadocia', name: 'Cappadocia' }] },
                { days: 8, title: 'The Aegean’s ancient cities', photo: 'ephesus', text: 'Marble streets, a healing sanctuary and white travertines — paired with olive groves, village wine and a few days by the sea.', stops: [{ slug: 'izmir', name: 'Izmir' }, { slug: 'ephesus', name: 'Ephesus' }, { slug: 'sirince', name: 'Şirince' }, { slug: 'pamukkale', name: 'Pamukkale' }, { slug: 'bodrum', name: 'Bodrum' }] },
                { days: 9, title: 'The Turquoise Coast', photo: 'fethiye', text: 'Rock tombs above a river, a blue lagoon, sunken ruins by kayak and a gulet day between hidden coves on the Lycian coast.', stops: [{ slug: 'dalyan', name: 'Dalyan' }, { slug: 'fethiye', name: 'Fethiye' }, { slug: 'kas', name: 'Kaş' }, { slug: 'olympos', name: 'Olympos' }, { slug: 'antalya', name: 'Antalya' }] },
                { days: 6, title: 'Mesopotamia & the first temples', photo: 'mardin', text: 'Göbekli Tepe at first light, Gaziantep’s kitchens and Mardin’s honey-coloured lanes — the region most visitors never reach.', stops: [{ slug: 'gaziantep', name: 'Gaziantep' }, { slug: 'sanliurfa', name: 'Şanlıurfa' }, { slug: 'mardin', name: 'Mardin' }] },
              ]}
            />
            <Seasons
              eyebrow="When to go"
              cta="The month-by-month guide"
              seasons={[
                { id: 'spring', label: 'Spring', months: 'March – May', photo: 'cappadocia', title: 'Green valleys, tulips and empty ruins', text: 'Mild days made for walking. Istanbul’s parks bloom, Cappadocia’s valleys turn green and the great ancient sites are calm before summer.', places: [{ slug: 'istanbul', name: 'Istanbul' }, { slug: 'cappadocia', name: 'Cappadocia' }, { slug: 'ephesus', name: 'Ephesus' }, { slug: 'pamukkale', name: 'Pamukkale' }] },
                { id: 'summer', label: 'Summer', months: 'June – August', photo: 'kas', title: 'The coast, the highlands and long evenings', text: 'Warm sea from Bodrum to Kaş, and cool mountain air on the Black Sea plateaus when the south gets hot.', places: [{ slug: 'fethiye', name: 'Fethiye' }, { slug: 'kas', name: 'Kaş' }, { slug: 'bodrum', name: 'Bodrum' }, { slug: 'trabzon', name: 'Trabzon' }, { slug: 'rize', name: 'Rize' }] },
                { id: 'autumn', label: 'Autumn', months: 'September – November', photo: 'mardin', title: 'The warmest sea and the southeast', text: 'The Mediterranean is at its warmest, the light turns golden, and Göbekli Tepe and Mardin become comfortable again.', places: [{ slug: 'antalya', name: 'Antalya' }, { slug: 'mardin', name: 'Mardin' }, { slug: 'sanliurfa', name: 'Şanlıurfa' }, { slug: 'cappadocia', name: 'Cappadocia' }] },
                { id: 'winter', label: 'Winter', months: 'December – February', photo: 'istanbul', title: 'Quiet cities, hammams and snow', text: 'Istanbul without queues, the Şeb-i Arus ceremonies in Konya, thermal Bursa and the snowbound east around Kars and Erzurum.', places: [{ slug: 'istanbul', name: 'Istanbul' }, { slug: 'konya', name: 'Konya' }, { slug: 'bursa', name: 'Bursa' }, { slug: 'kars', name: 'Kars' }, { slug: 'erzurum', name: 'Erzurum' }] },
              ]}
            />
          </>
        ),
        beforeTestimonials: (
          <QuoteBand
            quote="We don’t sell trips. We plan yours — and the only people who pay us are the people we plan for."
            name="Itinerary of Türkiye"
            meta="Our promise, in writing, on every plan"
            photo="safranbolu"
            alt="Ottoman houses of Safranbolu, Türkiye"
          />
        ),
        beforeFaq: (
          <>
            <PlanTrip
              eyebrow="Plan your trip"
              title="Everything you need"
              accent="before you land."
              readLabel="Read the guide"
              items={[
                { icon: 'plane', title: 'Visa & entry', text: 'Who needs an e-Visa, what to prepare and the documents to carry for a smooth arrival.', href: '/blogs/turkey-visa-travel-requirements-2026' },
                { icon: 'sun', title: 'When to go', text: 'Month by month: weather, crowds and where Türkiye is at its best in the week you can travel.', href: '/blog/best-time-to-visit-turkiye-month-by-month' },
                { icon: 'globe', title: 'Getting around Istanbul', text: 'Istanbulkart, the T1 tram, Marmaray and ferries — and when a taxi is still the better choice.', href: '/blog/istanbul-public-transport-tourist-guide' },
                { icon: 'lock', title: 'Avoiding tourist traps', text: 'The nine tricks first-time visitors actually meet, and the simple habits that prevent them.', href: '/blog/turkey-tourist-scams-how-to-avoid' },
                { icon: 'landmark', title: 'Is Türkiye safe?', text: 'An honest look at safety for visitors, and what we check before every trip we plan.', href: '/blog/is-turkey-safe-2026' },
                { icon: 'briefcase', title: 'Costs & budget', text: 'What everyday things cost for visitors and residents, with indicative 2026 ranges.', href: '/blogs/cost-of-living-turkey-foreigners-2026' },
              ]}
            />
            <Journal
              eyebrow="The Journal"
              title="Stories & guides"
              accent="from Türkiye."
              allLabel="All articles"
              readLabel="Read"
              items={latestArticles(4)}
            />
            <Gallery
              eyebrow="Türkiye in frames"
              title="Fifty-two places,"
              accent="endless light."
              follow="Follow @itineraryofturkiye"
              items={['van', 'bozcaada', 'konya', 'dalyan', 'alanya', 'sanliurfa', 'amasya', 'side']
                .filter(hasPhoto)
                .map((slug) => ({ slug, name: getDestination(slug)?.name ?? slug }))}
            />
          </>
        ),
      }}
    />
  );
}
