import { Buffer } from 'node:buffer';
import { BlobNotFoundError, BlobPreconditionFailedError, get, list, put } from '@vercel/blob';
import { normalizeLead, validateLeadStep } from './lead-form.mjs';

const ACTIONS = new Set(['rate', 'create', 'notify', 'list', 'update']);
const INTERESTS = new Set(['Tourism', 'Medical Tourism', 'Investment / Real Estate', 'Business', 'Other']);
const TIMELINES = new Set(['Within 2 weeks', '1–2 months', '3–6 months', 'Exploratory only']);
const STATUSES = new Set(['new', 'contacted', 'closed']);
const NOTIFICATIONS = new Set(['pending', 'sent', 'failed']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HASH = /^[0-9a-f]{64}$/;
const LEAD_PATH = /^ito\/leads\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.json$/;
const FIELDS = ['interest', 'country', 'timeline', 'contact', 'name', 'email', 'phone'];
const CREATE_FIELDS = [...FIELDS, 'locale', 'page', 'requestId', 'request_hash'];
const SAFE_FIELDS = ['id', 'created_at', 'updated_at', ...FIELDS, 'locale', 'page', 'status', 'notes', 'notification_status'];
const TIMEOUT_MS = 10000;
const MAX_DOCUMENT_BYTES = 65536;
const MAX_LISTED_LEADS = 10000;
const SDK = { get, list, put };

function fail() { throw new Error('admin-store-unavailable'); }

function credentialsFor(env) {
  const storeId = env?.BLOB_STORE_ID;
  if (typeof storeId === 'string' && /^store_[A-Za-z\d]{10,80}$/.test(storeId)
    && (env?.VERCEL === '1' || (typeof env?.VERCEL_OIDC_TOKEN === 'string' && env.VERCEL_OIDC_TOKEN.trim()))) {
    // The SDK obtains the current request's rotating OIDC token; do not capture it.
    return { storeId };
  }
  const token = env?.BLOB_READ_WRITE_TOKEN;
  return typeof token === 'string' && /^vercel_blob_rw_[A-Za-z\d_-]{18,}$/.test(token) && token.length <= 1024 ? { token } : null;
}

export function storeConfigured(env = process.env) { return credentialsFor(env) !== null; }

function exactKeys(value, keys) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}

function validFields(data) {
  if (!FIELDS.every(field => typeof data[field] === 'string')) return false;
  const normalized = normalizeLead(data);
  if (!FIELDS.every(field => normalized[field] === data[field])) return false;
  if ([1, 2, 3].some(step => Object.keys(validateLeadStep(data, step)).length)) return false;
  return INTERESTS.has(data.interest) && TIMELINES.has(data.timeline)
    && ['en', 'de', 'ru'].includes(data.locale)
    && typeof data.page === 'string' && data.page.length >= 1 && data.page.length <= 512
    && data.page.startsWith('/') && !data.page.startsWith('//')
    && ![...data.page].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
}

function validStoredLead(lead, id) {
  return lead && typeof lead === 'object' && !Array.isArray(lead)
    && lead.id === id && typeof lead.request_hash === 'string' && HASH.test(lead.request_hash) && validFields(lead)
    && STATUSES.has(lead.status) && NOTIFICATIONS.has(lead.notification_status)
    && typeof lead.notes === 'string' && lead.notes.length <= 5000
    && typeof lead.created_at === 'string' && Number.isFinite(Date.parse(lead.created_at))
    && typeof lead.updated_at === 'string' && Number.isFinite(Date.parse(lead.updated_at));
}

function safeLead(lead) { return Object.fromEntries(SAFE_FIELDS.map(field => [field, lead[field]])); }
function leadPath(id) { return `ito/leads/${id}.json`; }

async function readDocument(pathname, context) {
  let result;
  try { result = await context.sdk.get(pathname, { ...context.options, access: 'private', useCache: false }); }
  catch (error) { if (error instanceof BlobNotFoundError) return null; throw error; }
  if (result === null) return null;
  if (result.statusCode !== 200 || !result.stream || !result.blob || result.blob.pathname !== pathname
    || typeof result.blob.etag !== 'string' || !result.blob.etag || result.blob.size > MAX_DOCUMENT_BYTES) fail();
  const reader = result.stream.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_DOCUMENT_BYTES) { await reader.cancel(); fail(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const text = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
  return { data: JSON.parse(text), etag: result.blob.etag };
}

async function readLead(id, context) {
  const result = await readDocument(leadPath(id), context);
  if (result && !validStoredLead(result.data, id)) fail();
  return result;
}

async function writeDocument(pathname, data, context, etag) {
  if (context.options.abortSignal.aborted) fail();
  const body = JSON.stringify(data);
  if (Buffer.byteLength(body) > MAX_DOCUMENT_BYTES) fail();
  await context.sdk.put(pathname, body, {
    ...context.options, access: 'private', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: Boolean(etag), cacheControlMaxAge: 60,
    ...(etag ? { ifMatch: etag } : {}),
  });
}

async function createLead(payload, context) {
  if (!exactKeys(payload, CREATE_FIELDS) || typeof payload.requestId !== 'string' || !UUID.test(payload.requestId)
    || typeof payload.request_hash !== 'string' || !HASH.test(payload.request_hash) || !validFields(payload)) fail();
  const id = payload.requestId.toLowerCase();
  const timestamp = new Date(context.now()).toISOString();
  const lead = { ...normalizeLead(payload), locale: payload.locale, page: payload.page,
    id, request_hash: payload.request_hash, created_at: timestamp, updated_at: timestamp,
    status: 'new', notes: '', notification_status: 'pending' };
  try { await writeDocument(leadPath(id), lead, context); }
  catch (error) {
    if (context.options.abortSignal.aborted) throw error;
    // An immutable insert can lose a race, or its successful response can be lost.
    // Only an identical existing request is an accepted replay.
    const existing = await readLead(id, context);
    if (!existing || existing.data.request_hash !== payload.request_hash) throw error;
    return { id, inserted: false, notification_status: existing.data.notification_status };
  }
  return { id, inserted: true, notification_status: 'pending' };
}

async function mutateLead(action, payload, context) {
  const keys = action === 'notify' ? ['id', 'status'] : ['id', 'status', 'notes'];
  if (!exactKeys(payload, keys) || typeof payload.id !== 'string' || !UUID.test(payload.id)) fail();
  if (action === 'notify' ? !['sent', 'failed'].includes(payload.status)
    : !STATUSES.has(payload.status) || typeof payload.notes !== 'string' || payload.notes.length > 5000) fail();
  const id = payload.id.toLowerCase();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const existing = await readLead(id, context);
    if (!existing) fail();
    const updated = { ...existing.data, updated_at: new Date(context.now()).toISOString(),
      ...(action === 'notify' ? { notification_status: payload.status } : { status: payload.status, notes: payload.notes }) };
    try {
      await writeDocument(leadPath(id), updated, context, existing.etag);
      return action === 'notify' ? { id, notification_status: updated.notification_status } : { lead: safeLead(updated) };
    } catch (error) {
      if (!(error instanceof BlobPreconditionFailedError)) throw error;
    }
  }
  fail();
}

async function rate(payload, context) {
  if (!exactKeys(payload, ['bucket', 'kind']) || typeof payload.bucket !== 'string' || !HASH.test(payload.bucket)
    || !['login', 'form'].includes(payload.kind)) fail();
  const limit = payload.kind === 'login' ? 5 : 10;
  const duration = payload.kind === 'login' ? 900000 : 3600000;
  const window = Math.floor(context.now() / duration);
  const pathname = `ito/rate/${payload.kind}/${payload.bucket}/${window}.json`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const existing = await readDocument(pathname, context);
    if (existing && (!exactKeys(existing.data, ['kind', 'bucket', 'window', 'attempts'])
      || existing.data.kind !== payload.kind || existing.data.bucket !== payload.bucket || existing.data.window !== window
      || !Number.isInteger(existing.data.attempts) || existing.data.attempts < 1 || existing.data.attempts > limit)) fail();
    if (existing && existing.data.attempts >= limit) return { allowed: false };
    try {
      await writeDocument(pathname, { ...payload, window, attempts: (existing?.data.attempts ?? 0) + 1 }, context, existing?.etag);
      return { allowed: true };
    } catch (error) {
      if (context.options.abortSignal.aborted) throw error;
      if (error instanceof BlobPreconditionFailedError) continue;
      // An absent counter may have been atomically created by a competing request.
      if (!existing && await readDocument(pathname, context)) continue;
      throw error;
    }
  }
  // Contention never grants an uncounted attempt.
  return { allowed: false };
}

async function listLeads(payload, context) {
  if (!exactKeys(payload, [])) fail();
  const metadata = new Map();
  const cursors = new Set();
  let cursor;
  let scanned = 0;
  for (;;) {
    const page = await context.sdk.list({ ...context.options, prefix: 'ito/leads/', limit: 1000, ...(cursor ? { cursor } : {}) });
    if (!page || !Array.isArray(page.blobs) || typeof page.hasMore !== 'boolean') fail();
    scanned += page.blobs.length;
    if (scanned > MAX_LISTED_LEADS) fail();
    for (const item of page.blobs) {
      if (!LEAD_PATH.test(item.pathname)) continue;
      if (!Number.isFinite(new Date(item.uploadedAt).getTime())) fail();
      metadata.set(item.pathname, item);
    }
    if (!page.hasMore) break;
    if (scanned >= MAX_LISTED_LEADS || typeof page.cursor !== 'string' || !page.cursor || cursors.has(page.cursor)) fail();
    cursor = page.cursor;
    cursors.add(cursor);
  }
  const recent = [...metadata.values()].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt) || b.pathname.localeCompare(a.pathname)).slice(0, 200);
  const leads = [];
  // Bound parallel origin reads instead of opening 200 simultaneous connections.
  for (let offset = 0; offset < recent.length; offset += 10) {
    const records = await Promise.all(recent.slice(offset, offset + 10).map(item => readLead(LEAD_PATH.exec(item.pathname)[1], context)));
    if (records.some(record => !record)) fail();
    leads.push(...records.map(record => safeLead(record.data)));
  }
  leads.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id.localeCompare(a.id));
  return { leads };
}

/** Server-only private storage; every caller must enforce its own authorization. */
export async function gateway(action, payload, { env = process.env, blobImpl = SDK, now = Date.now } = {}) {
  const credentials = credentialsFor(env);
  if (!credentials || !ACTIONS.has(action) || payload === null || typeof payload !== 'object' || Array.isArray(payload)) fail();
  const controller = new AbortController();
  const context = { sdk: blobImpl, now, options: { ...credentials, abortSignal: controller.signal } };
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => { controller.abort(); reject(new Error('admin-store-unavailable')); }, TIMEOUT_MS);
  });
  try {
    return await Promise.race([
      action === 'create' ? createLead(payload, context)
        : action === 'rate' ? rate(payload, context)
          : action === 'list' ? listLeads(payload, context) : mutateLead(action, payload, context),
      timeout,
    ]);
  } catch {
    // Do not propagate SDK messages containing private paths, tokens or payloads.
    throw new Error('admin-store-unavailable');
  } finally { clearTimeout(timeoutId); }
}
