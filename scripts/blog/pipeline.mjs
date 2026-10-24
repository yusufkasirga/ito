#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync, openSync, closeSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const LOCALES = ['en', 'de', 'zh-CN', 'ko', 'es'];
const FOLDERS = { en: 'en', de: 'de', 'zh-CN': 'zh-cn', ko: 'ko', es: 'es' };
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
const normalize = (value) => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').normalize('NFKC').toLocaleLowerCase('en').replace(/ı/g, 'i').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const plainBody = (record) => (Array.isArray(record.body) ? record.body : []).map((block) => block?.type === 'ul' ? (Array.isArray(block.items) ? block.items.join(' ') : '') : block?.text ?? '').join('\n');

export function istanbulDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function httpsUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url : undefined; } catch { return undefined; }
}

function sourceUrls(record) {
  return [...new Set((Array.isArray(record.sources) ? record.sources : []).map((source) => source?.url))].sort();
}

function canonicalSourceUrl(value) {
  const url = httpsUrl(value);
  if (!url) return value;
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) if (/^utm_|^(?:fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/$/, '');
  return url.href;
}

function domainApproved(host, config) {
  return (config.primaryDomains ?? []).some((domain) => {
    const approved = String(domain).replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '').toLowerCase();
    return host === approved || host.endsWith(`.${approved}`);
  });
}

function legacyArray(root, relativeFile, exportName) {
  const filename = path.join(root, relativeFile);
  if (!existsSync(filename)) return [];
  const source = readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: filename }).outputText;
  const context = vm.createContext({ exports: {} }, { codeGeneration: { strings: false, wasm: false } });
  new vm.Script(transpiled, { filename }).runInContext(context, { timeout: 1500 });
  const result = context.exports[exportName];
  if (!Array.isArray(result)) throw new Error(`Expected exported array ${exportName} in ${relativeFile}`);
  return JSON.parse(JSON.stringify(result));
}

export function getJsonRecords(root = process.cwd()) {
  return LOCALES.flatMap((locale) => {
    const directory = path.join(root, 'content', 'blog', FOLDERS[locale]);
    if (!existsSync(directory)) return [];
    return readdirSync(directory).filter((file) => file.endsWith('.json')).sort().map((file) => {
      const filename = path.join(directory, file);
      const article = JSON.parse(readFileSync(filename, 'utf8'));
      return { ...article, _file: filename, _localeFolder: locale };
    });
  });
}

function normalizeLegacyBody(article) {
  if (article.body) return article.body;
  return (article.content ?? []).map((text) => text.startsWith('## ')
    ? { type: 'h2', text: text.slice(3) }
    : text.startsWith('- ') ? { type: 'ul', items: text.split('\n').map((item) => item.replace(/^- /, '')) }
      : { type: 'p', text });
}

export function discoverInventory(root = process.cwd()) {
  const legacy = [
    ...legacyArray(root, 'app/blog/blogPosts.ts', 'blogArticles').map((article) => ({ ...article, source: 'journal', locale: 'en' })),
    ...legacyArray(root, 'app/blogs/blogData.ts', 'blogPosts').map((article) => ({ ...article, source: 'guide', locale: 'en' })),
    ...legacyArray(root, 'app/blogs/blogDataDe.ts', 'blogPostsDe').map((article) => ({ ...article, source: 'guide', locale: 'de' })),
  ].map((article) => ({ ...article, body: normalizeLegacyBody(article) }));
  return [...legacy, ...getJsonRecords(root).filter((article) => article.status === 'published').map((article) => ({ ...article, source: 'content' }))];
}

export function discoverKnownRoutes(root = process.cwd(), inventory = discoverInventory(root)) {
  const routes = new Set(['/']);
  function walk(directory) {
    if (!existsSync(directory)) return;
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, item.name);
      if (item.isDirectory()) walk(filename);
      else if (/^page\.(tsx?|jsx?)$/.test(item.name)) {
        const relative = path.relative(path.join(root, 'app'), path.dirname(filename)).split(path.sep).filter((part) => !/^\(|^@/.test(part));
        if (!relative.some((part) => part.includes('['))) routes.add(`/${relative.join('/')}`.replace(/\/$/, '') || '/');
      }
    }
  }
  walk(path.join(root, 'app'));
  // Dynamic destination slugs are known existing routes, not guessed URLs.
  const destinations = path.join(root, 'app/destinations/destinationData.ts');
  if (existsSync(destinations)) {
    for (const match of readFileSync(destinations, 'utf8').matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)) routes.add(`/destinations/${match[1]}`);
  }
  for (const article of inventory) {
    const prefix = article.locale === 'en' ? '' : `/${FOLDERS[article.locale] ?? article.locale}`;
    routes.add(`${prefix}/blog`); routes.add(`${prefix}/blog/${article.slug}`);
  }
  return routes;
}

function tokens(value) {
  const stop = new Set(['the', 'and', 'for', 'with', 'from', 'your', 'this', 'that', 'into', 'what', 'how', 'you', 'are', 'turkey', 'türkiye', 'turkiye', 'travel', 'guide']);
  return new Set(normalize(value).split(' ').filter((word) => word.length > 2 && !stop.has(word)));
}

export function lexicalSimilarity(left, right) {
  const a = tokens(left), b = tokens(right);
  const union = new Set([...a, ...b]);
  return union.size ? [...a].filter((word) => b.has(word)).length / union.size : 0;
}

/** A shortlist only: lexical flags and ranking do not certify semantic novelty. */
export function dailyTopicLimit(config, day) {
  const base = config.maxTopicsPerDay ?? 3;
  const overrides = Array.isArray(config.dailyLimitOverrides) ? config.dailyLimitOverrides : [];
  const active = overrides.find((entry) => entry && validDate(entry.from) && validDate(entry.to) && entry.from <= entry.to
    && typeof day === 'string' && day >= entry.from && day <= entry.to
    && Number.isInteger(entry.maxTopicsPerDay) && entry.maxTopicsPerDay > 0 && entry.maxTopicsPerDay <= 10);
  return active ? active.maxTopicsPerDay : base;
}

export function rankCandidates(candidates, config, inventory = [], now = new Date()) {
  const today = istanbulDate(now);
  const context = /\b(turkiye|turkey|istanbul|cappadocia|kapadokya|antalya|izmir|ephesus|efes|pamukkale|bosphorus|bogazici|ankara|bodrum|fethiye|mardin|trabzon|rize|gobekli|gobeklitepe|sanliurfa|canakkale|troya|troy|safranbolu|diyarbakir|denizli|aydin|eskisehir|konya)\b/i;
  const traveler = /travel|touris|visitor|itinerar|museum|heritage|ferr(?:y|ies)|rail|train|airport|transport|hiking|trail|archaeolog|archæolog|culture|festival|cuisine|gastronom|destination|coast|beach|hotel|accommodation|sustainab|accessib|tour\b|route|craft|market|walking|turizm|turistik|ziyaret|muze|kultur|ulasim|yolcu|sefer|tren|feribot|vapur|otobus|metro|havalimani|havaalani|yuruyus|rota|arkeoloj|konaklama|engelsiz|erisilebilir/i;
  const irrelevant = /\b(election|parliament|president|geopolitic|diplomatic|military|missile|warfare|football|soccer|basketball|champions league|transfer window|sports betting|secim|meclis|cumhurbaskani|futbol|basketbol|super lig|sampiyonlar ligi)\b/i;
  const seen = new Set();
  const ranked = [];
  const rejected = [];
  for (const item of candidates) {
    const url = httpsUrl(item.url ?? item.link);
    const title = item.title ?? '';
    const text = `${title} ${item.description ?? item.summary ?? item.excerpt ?? ''}`;
    const foldedText = normalize(text), foldedTitle = normalize(title);
    const reasons = [];
    if (!url || !nonempty(title)) reasons.push('missing-title-or-https-url');
    if (url && seen.has(url.href)) reasons.push('duplicate-url');
    if (!context.test(foldedText)) reasons.push('no-turkiye-context');
    if (!traveler.test(foldedText)) reasons.push('no-traveler-relevance');
    if (irrelevant.test(foldedText)) reasons.push('politics-or-sports');
    const published = item.publishedISO ?? item.publishedAt ?? item.pubDate ?? item.date;
    const timestamp = published ? Date.parse(published) : NaN;
    if (published && (!Number.isFinite(timestamp) || (/^\d{4}-\d{2}-\d{2}/.test(published) && !validDate(published.slice(0, 10))) || istanbulDate(new Date(timestamp)) > today)) reasons.push('invalid-or-future-source-date');
    if (url) seen.add(url.href);
    if (reasons.length) { rejected.push({ ...item, rejectionReasons: reasons }); continue; }
    const ageDays = Number.isFinite(timestamp) ? Math.max(0, (now.getTime() - timestamp) / 86400000) : undefined;
    const freshness = ageDays === undefined ? 0 : ageDays <= 7 ? 25 : ageDays <= 30 ? 18 : ageDays <= 90 ? 8 : 0;
    const authority = domainApproved(url.hostname, config) ? 25 : 0;
    const titleRelevance = context.test(foldedTitle) ? 15 : 5;
    const score = 35 + titleRelevance + freshness + authority;
    const lexicalMatches = inventory.filter((article) => article.locale === 'en').map((article) => ({ slug: article.slug, similarity: Number(lexicalSimilarity(text, `${article.title} ${article.excerpt ?? ''}`).toFixed(3)) })).filter((match) => match.similarity >= 0.12).sort((a, b) => b.similarity - a.similarity).slice(0, 5);
    ranked.push({ ...item, url: url.href, preliminaryScore: score, rankingFactors: { travelerRelevance: 35, titleContext: titleRelevance, freshness, primaryAuthority: authority }, lexicalMatches, requiresSemanticReview: true });
  }
  ranked.sort((a, b) => b.preliminaryScore - a.preliminaryScore || a.url.localeCompare(b.url));
  return { ranked, rejected, shortlist: ranked.slice(0, dailyTopicLimit(config, today)), semanticReviewRequired: true };
}

function sameRecord(article, existing) {
  return article.locale === existing.locale && article.slug === existing.slug && (
    (article._file && existing._file && article._file === existing._file) ||
    (existing.source === 'content' && article.id === existing.id)
  );
}

function sensitive(record) {
  const text = normalize(`${record.category} ${record.title} ${record.excerpt} ${plainBody(record)}`);
  const category = normalize(record.category);
  return /medic|clinical|financial|legal|medizin|finanz|inmigr|医疗|财务|法律|의료|법률|금융/.test(category)
    || /\b(medical (?:tourism|procedure|treatment|advice|assessment|care)|clinical|dental|surgery|surgical|surgeon|clinic|diagnos\w*|dosage|hair transplant|implant|treatment|citizenship|immigration|residency|residence permit|visa|visum\w*|visado\w*|tax|mortgage|investment|real estate|property purchase|legal advice|interest rate|guaranteed return|medizin\w*|zahn\w*|klinik\w*|behandlung\w*|staatsburgerschaft|investition\w*|tratamiento|cirugia|clinica|inmigracion|ciudadania|inversion|hipoteca)\b/i.test(text)
    || /医疗(?:旅游|建议|诊断|治疗|服务|手术|评估|判断|方案|效果|风险)|医療|手术|牙科|移植|移民|签证|投資|投资|의료\s*(?:관광|조언|진단|치료|서비스|평가)|치료|수술|치과|이민|시민권|투자|비자/.test(text);
}

function visitStrings(value, callback) {
  if (typeof value === 'string') callback(value);
  else if (Array.isArray(value)) value.forEach((item) => visitStrings(item, callback));
  else if (value && typeof value === 'object') Object.entries(value).filter(([key]) => !key.startsWith('_')).forEach(([, item]) => visitStrings(item, callback));
}

/** Deterministic gates verify recorded evidence; the agent still performs semantic/factual review. */
export function validateRecords(records, options = {}) {
  const { config = {}, inventory = [], root, review, reviews = {}, date, today = istanbulDate(), includeDrafts = false } = options;
  const errors = [], warnings = [];
  const candidates = records.filter((article) => includeDrafts || article.status === 'published');
  const groups = new Map();
  const knownRoutes = new Set(options.knownRoutes ?? (root ? discoverKnownRoutes(root, inventory) : ['/']));
  // Only complete selected bundles can acquire routes together in this transaction.
  // Files for unrelated drafts never enter the selected candidates or route registry.
  for (const article of candidates) {
    if (!groups.has(article.slug)) groups.set(article.slug, []);
    groups.get(article.slug).push(article);
  }
  for (const [slug, bundle] of groups) {
    const master = bundle.find((article) => article.locale === 'en');
    const complete = master && SLUG.test(slug ?? '') && bundle.length === LOCALES.length
      && LOCALES.every((locale) => bundle.filter((article) => article.locale === locale).length === 1)
      && bundle.every((article) => article.id === master.id && article.seo?.topicKey === master.seo?.topicKey
        && article.dateISO === master.dateISO && JSON.stringify(sourceUrls(article)) === JSON.stringify(sourceUrls(master)));
    if (complete) for (const locale of LOCALES) knownRoutes.add(`${locale === 'en' ? '' : `/${FOLDERS[locale]}`}/blog/${slug}`);
  }
  const error = (article, message) => errors.push(`${article.locale ?? '?'}/${article.slug ?? '?'}: ${message}`);
  const idKeys = new Set(), titleKeys = new Set();
  for (const article of candidates) {
    if (article.schemaVersion !== 1) error(article, 'schemaVersion must be 1');
    if (!LOCALES.includes(article.locale) || (article._localeFolder && article._localeFolder !== article.locale)) error(article, 'unsupported or mismatched locale');
    if (!SLUG.test(article.slug ?? '') || (article._file && path.basename(article._file) !== `${article.slug}.json`)) error(article, 'safe ASCII slug must match filename');
    for (const field of ['id', 'title', 'excerpt', 'category', 'cover', 'readTime']) if (!nonempty(article[field])) error(article, `${field} is required`);
    if (article.author && (!nonempty(article.author.name) || !nonempty(article.author.url) || (article.author.type && !['Person', 'Organization'].includes(article.author.type)))) error(article, 'invalid author');
    if (!validDate(article.dateISO) || article.dateISO > today) error(article, 'publication date must be a real date no later than Istanbul today');
    if (date && article.dateISO !== date) error(article, `publication date must match ${date}`);
    if (article.updatedISO && (!validDate(article.updatedISO) || article.updatedISO > today || article.updatedISO < article.dateISO)) error(article, 'invalid update date');
    if (!['draft', 'review', 'published'].includes(article.status)) error(article, 'invalid status');
    const cover = article.cover ?? '';
    const decodedCover = (() => { try { return decodeURIComponent(cover); } catch { return ''; } })();
    if (!/^\/(?!\/)[^?#\\]+$/.test(cover) || decodedCover.split('/').includes('..')) error(article, 'cover must be a local public file without traversal');
    else if (root && !existsSync(path.join(root, 'public', cover.slice(1)))) error(article, 'cover file does not exist');
    if (!Array.isArray(article.body) || !article.body.length) error(article, 'body is required');
    else for (const block of article.body) {
      if (!block || !['p', 'h2', 'ul'].includes(block.type)) error(article, 'unsupported body block');
      else if (block.type === 'ul' ? (!Array.isArray(block.items) || !block.items.length || !block.items.every(nonempty)) : !nonempty(block.text)) error(article, 'body blocks need nonempty text');
    }
    const text = plainBody(article);
    const wordCount = text.split(/\s+/u).filter(Boolean).length;
    const characterCount = [...text.replace(/\s/g, '')].length;
    if (wordCount < (config.minimumWords?.[article.locale] ?? 0)) error(article, `body is too short (${wordCount} words)`);
    if (characterCount < (config.minimumCharacters?.[article.locale] ?? 0)) error(article, `body is too short (${characterCount} characters)`);
    if (!article.seo || !['intent', 'topicKey', 'uniqueValue'].every((key) => nonempty(article.seo[key])) || !Array.isArray(article.seo.keywords) || !article.seo.keywords.length || !article.seo.keywords.every(nonempty)) error(article, 'complete SEO intent, keywords, topicKey and uniqueValue are required');
    const quality = article.quality;
    if (!quality || !Number.isFinite(quality.score) || quality.score < (config.minimumQualityScore ?? 85) || quality.score > 100 || ![quality.factChecked, quality.semanticReviewed, quality.localizationReviewed].every((value) => value === true)) error(article, 'editorial reviews and minimum quality score must pass');
    if (quality?.risk !== 'low' || sensitive(article)) error(article, 'sensitive clinical/legal/financial content requires review and cannot auto-publish');
    if (!nonempty(quality?.reviewNotes) || quality.reviewNotes.trim().length < 60 || /^(?:approved|reviewed|ok|passed)[.!\s]*$/i.test(quality.reviewNotes)) error(article, 'meaningful editorial reviewNotes are required');
    if (!Array.isArray(article.sources) || new Set(sourceUrls(article).map(canonicalSourceUrl)).size < 2) error(article, 'at least two distinct HTTPS sources are required');
    let approvedPrimary = false;
    for (const source of Array.isArray(article.sources) ? article.sources : []) {
      if (!source || typeof source !== 'object') { error(article, 'invalid source record'); continue; }
      const url = httpsUrl(source.url);
      if (!nonempty(source.title) || !url) error(article, 'source needs a title and credential-free HTTPS URL');
      if (url && domainApproved(url.hostname, config)) approvedPrimary = true;
      if (!validDate(source.accessedISO) || source.accessedISO > today) error(article, 'each source needs a real accessedISO no later than Istanbul today');
      if (source.publishedISO && (!validDate(source.publishedISO) || source.publishedISO > today)) error(article, 'source publication date cannot be invalid or in the future');
      if (source.publishedAt) {
        const timestamp = Date.parse(source.publishedAt);
        if (!Number.isFinite(timestamp) || (/^\d{4}-\d{2}-\d{2}/.test(source.publishedAt) && !validDate(source.publishedAt.slice(0, 10))) || istanbulDate(new Date(timestamp)) > today) error(article, 'source publication date cannot be invalid or in the future');
      }
    }
    if (!approvedPrimary) error(article, 'at least one source must use an approved primary domain');
    let active = false;
    visitStrings(article, (value) => { if (/<\s*\/?\s*(?:script|iframe|object|embed|style|link|meta)\b|javascript\s*:|data\s*:\s*text\/html|\bon\w+\s*=/i.test(value)) active = true; });
    if (active) error(article, 'raw active scripts/HTML are forbidden');
    const links = [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
    const internalLinks = new Set();
    for (const href of links) {
      if (/^(?:javascript|data):/i.test(href)) error(article, 'unsafe inline link');
      if (!href.startsWith('/') && !/^https?:\/\/(?:www\.)?itineraryofturkiye\.com(?:\/|$)/i.test(href)) continue;
      let url;
      try { url = new URL(href, 'https://itineraryofturkiye.com'); } catch { error(article, 'invalid internal link'); continue; }
      if (url.hostname !== 'itineraryofturkiye.com' && url.hostname !== 'www.itineraryofturkiye.com') { error(article, 'protocol-relative or malformed internal link'); continue; }
      const route = url.pathname.replace(/\/$/, '') || '/';
      if (!knownRoutes.has(route)) error(article, `dangling internal link: ${route}`);
      else if (!route.endsWith(`/blog/${article.slug}`)) internalLinks.add(route);
    }
    if (internalLinks.size < 2) error(article, 'at least two distinct known existing internal article/site links are required');
    const key = `${article.locale}:${article.id}`;
    if (idKeys.has(key)) error(article, 'duplicate ID in locale');
    idKeys.add(key);
    const titleKey = `${article.locale}:${normalize(article.title)}`;
    if (titleKeys.has(titleKey)) error(article, 'duplicate title in locale');
    titleKeys.add(titleKey);
    for (const existing of inventory.filter((entry) => entry.locale === article.locale && !sameRecord(article, entry))) {
      if (existing.slug === article.slug) error(article, `slug already exists in ${existing.source ?? 'inventory'}`);
      if (normalize(existing.title) === normalize(article.title)) error(article, `title already exists (${existing.slug})`);
      if (article.locale === 'en' && article.seo?.topicKey && normalize(article.seo.topicKey) === normalize(existing.seo?.topicKey ?? existing.slug)) error(article, `topicKey already exists (${existing.slug})`);
    }
  }
  const masters = candidates.filter((article) => article.locale === 'en');
  const topicKeys = new Set();
  for (const [slug, bundle] of groups) {
    const master = bundle.find((article) => article.locale === 'en');
    if (!master || bundle.length !== LOCALES.length || LOCALES.some((locale) => bundle.filter((article) => article.locale === locale).length !== 1)) {
      errors.push(`${slug}: a complete five-locale bundle with an English master is required`); continue;
    }
    if (topicKeys.has(normalize(master.seo?.topicKey))) error(master, 'duplicate topicKey across selected masters');
    topicKeys.add(normalize(master.seo?.topicKey));
    for (const translation of bundle) {
      if (translation.id !== master.id || translation.seo?.topicKey !== master.seo?.topicKey || translation.dateISO !== master.dateISO) error(translation, 'translation identity, topicKey and publication date must match English');
      if (JSON.stringify(sourceUrls(translation)) !== JSON.stringify(sourceUrls(master))) error(translation, 'source URL sets must match English exactly');
      if (translation.locale !== 'en' && normalize(translation.title) === normalize(master.title)) error(translation, 'translation title must be localized');
    }
    const evidence = review ?? reviews[master.dateISO];
    if (!evidence || evidence.schemaVersion !== 1 || evidence.date !== master.dateISO || !['prepared', 'published'].includes(evidence.state) || !Array.isArray(evidence.publishedSlugs)) { error(master, 'matching dated review evidence is missing'); continue; }
    const scan = evidence.sourceScan;
    const collectedAt = Date.parse(scan?.collectedAt);
    if (!scan || !Number.isFinite(collectedAt) || istanbulDate(new Date(collectedAt)) > today || !Number.isInteger(scan.itemsInspected) || scan.itemsInspected <= 0 || !Number.isInteger(scan.freshItems) || scan.freshItems < 0 || scan.freshItems > scan.itemsInspected || scan.shortfall !== Math.max(0, (config.targetSourceItems ?? 100) - scan.freshItems)) error(master, 'truthful sourceScan counts, collection time and shortfall are required');
    if (new Set(evidence.publishedSlugs).size !== evidence.publishedSlugs.length || evidence.publishedSlugs.length > dailyTopicLimit(config, evidence.date)) error(master, 'ledger publishedSlugs must be unique and within the daily limit');
    const decisions = Array.isArray(evidence.decisions) ? evidence.decisions.filter((entry) => entry.slug === slug) : [];
    const decision = decisions.length === 1 && decisions[0].topicKey === master.seo?.topicKey && decisions[0].decision === 'publish' ? decisions[0] : undefined;
    if (!decision || !nonempty(decision.intent) || !nonempty(decision.reason) || decision.reason.length < 40) { error(master, 'explicit publish decision, intent and reason are required'); continue; }
    if (JSON.stringify([...(decision.sourceUrls ?? [])].sort()) !== JSON.stringify(sourceUrls(master))) error(master, 'review source URLs must match the article sources');
    const semantic = decision.semanticReview;
    const requiredSlugs = [...new Set(inventory.filter((entry) => entry.locale === 'en' && !sameRecord(master, entry)
      && (date ? !masters.some((candidate) => sameRecord(candidate, entry)) : entry.source !== 'content' || entry.dateISO < master.dateISO)).map((entry) => entry.slug))];
    if (!semantic || !Array.isArray(semantic.reviewedSlugs) || requiredSlugs.some((existingSlug) => !semantic.reviewedSlugs.includes(existingSlug)) || !nonempty(semantic.whyDifferent) || semantic.whyDifferent.length < 80 || !Array.isArray(semantic.closestSlugs) || (requiredSlugs.length && !semantic.closestSlugs.length) || semantic.closestSlugs.some((existingSlug) => !semantic.reviewedSlugs.includes(existingSlug))) error(master, 'semantic review must cover every existing English article and explain the distinction from closest topics');
  }
  const counts = new Map();
  for (const article of [...inventory.filter((entry) => entry.locale === 'en' && entry.source === 'content' && entry.status === 'published'), ...masters]) {
    if (!counts.has(article.dateISO)) counts.set(article.dateISO, new Set());
    counts.get(article.dateISO).add(article.slug);
  }
  for (const [day, slugs] of counts) if (slugs.size > dailyTopicLimit(config, day)) errors.push(`${day}: daily topic limit exceeded (${slugs.size})`);
  return { valid: errors.length === 0, errors: [...new Set(errors)], warnings };
}

function atomicWrite(filename, data) {
  mkdirSync(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try { writeFileSync(temporary, data, 'utf8'); renameSync(temporary, filename); }
  finally { if (existsSync(temporary)) unlinkSync(temporary); }
}

export function publishBundle(options) {
  const { root = process.cwd(), date, slugs, reviewPath, config, today = istanbulDate() } = options;
  if (!validDate(date) || date > today) throw new Error('Publish date must be a real date no later than Istanbul today');
  const selected = [...new Set(slugs ?? [])];
  if (!selected.length || selected.length > dailyTopicLimit(config, date) || selected.some((slug) => !SLUG.test(slug))) throw new Error(`Select between one and ${dailyTopicLimit(config, date)} distinct safe article slugs`);
  const lockPath = path.join(root, '.blog-publish.lock');
  let lock;
  try { lock = openSync(lockPath, 'wx'); writeFileSync(lock, JSON.stringify({ pid: process.pid, date, createdAt: new Date().toISOString() })); }
  catch {
    if (lock !== undefined) { closeSync(lock); unlinkSync(lockPath); }
    throw new Error('Another publication holds .blog-publish.lock or its creation failed; inspect it before retrying');
  }
  try {
    const ledgerPath = path.resolve(root, reviewPath ?? `docs/blog-runs/${date}.json`);
    if (!existsSync(ledgerPath)) throw new Error('Review evidence file does not exist');
    const originalLedger = readFileSync(ledgerPath, 'utf8');
    const review = JSON.parse(originalLedger);
    const records = getJsonRecords(root).filter((article) => selected.includes(article.slug));
    if (records.length !== selected.length * LOCALES.length) throw new Error('Every selected slug needs exactly five locale files');
    const wasPublished = records.every((article) => article.status === 'published');
    const recorded = selected.every((slug) => (review.publishedSlugs ?? []).includes(slug));
    if (wasPublished !== recorded) throw new Error('Publication files and ledger disagree; reconcile their state before publishing');
    if (records.some((article) => article.status === 'published') && !wasPublished) throw new Error('Partial publication state cannot be promoted');
    const promoted = records.map((article) => ({ ...article, status: 'published' }));
    const inventory = options.inventory ?? discoverInventory(root);
    const knownRoutes = options.knownRoutes ?? discoverKnownRoutes(root, inventory);
    const result = validateRecords(promoted, { root, config, inventory, knownRoutes, review, date, today });
    if (!result.valid) throw new Error(`Publication gates failed:\n${result.errors.join('\n')}`);
    if (wasPublished && recorded) return { publishedSlugs: selected, idempotent: true };
    const backups = new Map(records.map((article) => [article._file, readFileSync(article._file, 'utf8')]));
    backups.set(ledgerPath, originalLedger);
    try {
      for (const article of promoted) {
        const { _file, _localeFolder, ...content } = article;
        void _localeFolder;
        (options.writeFile ?? atomicWrite)(_file, `${JSON.stringify(content, null, 2)}\n`);
      }
      const ledger = { ...review, publishedSlugs: [...new Set([...(review.publishedSlugs ?? []), ...selected])], state: 'prepared' };
      (options.writeFile ?? atomicWrite)(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
    } catch (error) {
      for (const [filename, content] of backups) atomicWrite(filename, content);
      throw error;
    }
    return { publishedSlugs: selected, idempotent: false };
  } finally { closeSync(lock); unlinkSync(lockPath); }
}

function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  const options = {};
  for (let i = 0; i < rest.length; i++) {
    if (!rest[i].startsWith('--')) throw new Error(`Unexpected argument: ${rest[i]}`);
    const key = rest[i].slice(2);
    if (['all'].includes(key)) options[key] = true;
    else { if (!rest[i + 1] || rest[i + 1].startsWith('--')) throw new Error(`Missing value for --${key}`); options[key] = rest[++i]; }
  }
  return { command, options };
}

function output(value, filename) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (filename) atomicWrite(path.resolve(filename), text);
  else process.stdout.write(text);
}

export function runCli(argv = process.argv.slice(2)) {
  const { command, options } = parseArgs(argv);
  const root = path.resolve(options.root ?? process.cwd());
  if (command === 'help') { process.stdout.write('Blog pipeline: inventory [--output file], plan --sources file [--output file], validate [--all], publish --date YYYY-MM-DD --slugs a,b --review file\n'); return; }
  const configPath = path.join(root, 'config/blog-automation.json');
  if (!existsSync(configPath)) throw new Error('Missing config/blog-automation.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const inventory = discoverInventory(root);
  if (command === 'inventory') {
    output({ schemaVersion: 1, generatedAt: new Date().toISOString(), counts: Object.fromEntries(LOCALES.map((locale) => [locale, inventory.filter((article) => article.locale === locale).length])), articles: inventory }, options.output);
  } else if (command === 'plan') {
    if (!options.sources) throw new Error('--sources is required');
    const sourceFile = JSON.parse(readFileSync(path.resolve(root, options.sources), 'utf8'));
    const candidates = Array.isArray(sourceFile) ? sourceFile : sourceFile.items ?? sourceFile.candidates ?? [];
    const ranking = rankCandidates(candidates, config, inventory);
    const freshItems = Array.isArray(sourceFile) ? candidates.filter((item) => item.publishedAt ?? item.publishedISO ?? item.date).length : sourceFile.freshItemCount ?? candidates.filter((item) => item.publishedAt ?? item.publishedISO ?? item.date).length;
    output({ schemaVersion: 1, generatedAt: new Date().toISOString(), itemsInspected: candidates.length, freshItems, targetSourceItems: config.targetSourceItems, shortfall: Math.max(0, config.targetSourceItems - freshItems), ...ranking }, options.output);
  } else if (command === 'validate') {
    const reviews = {};
    const records = getJsonRecords(root);
    for (const day of new Set(records.filter((article) => options.all || article.status === 'published').map((article) => article.dateISO))) {
      const filename = path.join(root, 'docs/blog-runs', `${day}.json`);
      if (existsSync(filename)) reviews[day] = JSON.parse(readFileSync(filename, 'utf8'));
    }
    const result = validateRecords(records, { root, config, inventory, knownRoutes: discoverKnownRoutes(root, inventory), reviews, includeDrafts: Boolean(options.all) });
    output({ ...result, checked: records.filter((article) => options.all || article.status === 'published').length });
    if (!result.valid) process.exitCode = 1;
  } else if (command === 'publish') {
    output(publishBundle({ root, date: options.date, slugs: (options.slugs ?? '').split(',').filter(Boolean), reviewPath: options.review, config }));
  } else throw new Error(`Unknown blog command: ${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { runCli(); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
