import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { BlobPreconditionFailedError } from '@vercel/blob';
import { gateway, storeConfigured } from '../../lib/admin-store.mjs';

const env = { BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_teststore_test_only_dummy_token' };
const time = 1_800_000_000_000;
const id = '00000000-0000-4000-8000-000000000001';
const valid = { interest: 'Tourism', country: 'Germany', timeline: '1–2 months', contact: 'Email',
  name: 'Test Visitor', email: 'visitor@example.test', phone: '', locale: 'de', page: '/de',
  requestId: id, request_hash: 'a'.repeat(64) };
const pathname = `ito/leads/${id}.json`;

function fakeBlob() {
  const files = new Map();
  const calls = [];
  let sequence = 0;
  function seed(name, data, uploadedAt = time) {
    const record = { body: typeof data === 'string' ? data : JSON.stringify(data), etag: `"${++sequence}"`, uploadedAt: new Date(uploadedAt) };
    files.set(name, record);
    return record;
  }
  const sdk = {
    async get(name, options) {
      calls.push({ method: 'get', name, options });
      const record = files.get(name);
      if (!record) return null;
      return { statusCode: 200, stream: new Response(record.body).body,
        blob: { pathname: name, etag: record.etag, size: Buffer.byteLength(record.body) } };
    },
    async put(name, body, options) {
      calls.push({ method: 'put', name, options, body });
      const existing = files.get(name);
      if (options.ifMatch && existing?.etag !== options.ifMatch) throw new BlobPreconditionFailedError();
      if (existing && !options.allowOverwrite) throw new Error('already exists');
      const result = seed(name, body);
      return { pathname: name, etag: result.etag };
    },
    async list(options) {
      calls.push({ method: 'list', options });
      const all = [...files].filter(([name]) => name.startsWith(options.prefix)).sort(([a], [b]) => a.localeCompare(b));
      const offset = Number(options.cursor ?? 0);
      const count = Math.min(options.limit, 100);
      const selected = all.slice(offset, offset + count);
      return { blobs: selected.map(([name, file]) => ({ pathname: name, uploadedAt: file.uploadedAt })),
        hasMore: offset + count < all.length, cursor: String(offset + count) };
    },
  };
  return { files, calls, seed, sdk, options: { env, blobImpl: sdk, now: () => time } };
}

test('private immutable create and replay never expose storage details', async () => {
  const mock = fakeBlob();
  assert.deepEqual(await gateway('create', valid, mock.options), { id, inserted: true, notification_status: 'pending' });
  const first = mock.files.get(pathname).body;
  assert.deepEqual(await gateway('create', valid, mock.options), { id, inserted: false, notification_status: 'pending' });
  assert.equal(mock.files.get(pathname).body, first);
  await assert.rejects(gateway('create', { ...valid, request_hash: 'b'.repeat(64) }, mock.options), /^Error: admin-store-unavailable$/);
  assert.equal(mock.files.size, 1);
  const stored = JSON.parse(first);
  assert.equal(stored.name, valid.name);
  assert.equal(stored.request_hash, valid.request_hash);
  assert.equal(stored.status, 'new');
  assert.equal(stored.notes, '');
  for (const call of mock.calls) {
    assert.equal(call.options.token, env.BLOB_READ_WRITE_TOKEN);
    assert.ok(call.options.abortSignal instanceof AbortSignal);
    if (call.method === 'get') { assert.equal(call.options.access, 'private'); assert.equal(call.options.useCache, false); }
    if (call.method === 'put') {
      assert.equal(call.options.access, 'private'); assert.equal(call.options.allowOverwrite, false);
      assert.equal(call.options.addRandomSuffix, false);
    }
  }
});

test('two concurrent creates save one immutable record', async () => {
  const mock = fakeBlob();
  const outcomes = await Promise.all([gateway('create', valid, mock.options), gateway('create', valid, mock.options)]);
  assert.equal(outcomes.filter(result => result.inserted).length, 1);
  assert.equal(mock.files.size, 1);
});

test('notification and admin edits retry conditional conflicts and preserve each other', async () => {
  const mock = fakeBlob();
  await gateway('create', valid, mock.options);
  let competed = false;
  const originalPut = mock.sdk.put;
  mock.sdk.put = async (name, body, options) => {
    if (options.ifMatch && !competed) {
      competed = true;
      mock.seed(name, { ...JSON.parse(mock.files.get(name).body), notification_status: 'sent' });
    }
    return originalPut(name, body, options);
  };
  const { lead } = await gateway('update', { id, status: 'contacted', notes: 'Follow up tomorrow' }, mock.options);
  assert.equal(lead.notification_status, 'sent');
  assert.equal(lead.status, 'contacted');
  assert.equal(lead.notes, 'Follow up tomorrow');
  assert.equal(Object.hasOwn(lead, 'request_hash'), false);
  await gateway('notify', { id, status: 'failed' }, mock.options);
  const stored = JSON.parse(mock.files.get(pathname).body);
  assert.equal(stored.notes, 'Follow up tomorrow');
  assert.equal(stored.status, 'contacted');
  assert.equal(stored.notification_status, 'failed');
  assert.ok(mock.calls.filter(call => call.method === 'put' && call.options.allowOverwrite).every(call => call.options.ifMatch));
});

test('rate counters enforce fixed login and form caps without storing raw addresses', async () => {
  const mock = fakeBlob();
  const bucket = 'b'.repeat(64);
  for (const [kind, cap, duration] of [['login', 5, 900000], ['form', 10, 3600000]]) {
    for (let attempt = 0; attempt < cap; attempt += 1) assert.deepEqual(await gateway('rate', { kind, bucket }, mock.options), { allowed: true });
    assert.deepEqual(await gateway('rate', { kind, bucket }, mock.options), { allowed: false });
    assert.deepEqual(await gateway('rate', { kind, bucket }, { ...mock.options, now: () => time + duration }), { allowed: true });
  }
  for (const [name, record] of mock.files) {
    assert.match(name, /^ito\/rate\/(login|form)\/[a-f\d]{64}\/\d+\.json$/);
    assert.deepEqual(Object.keys(JSON.parse(record.body)).sort(), ['attempts', 'bucket', 'kind', 'window']);
  }
  await assert.rejects(gateway('rate', { kind: 'form', bucket: '192.0.2.1' }, mock.options), /admin-store-unavailable/);
});

test('concurrent rate calls cannot exceed the cap, including conditional-write races', async () => {
  const mock = fakeBlob();
  const payload = { kind: 'login', bucket: 'c'.repeat(64) };
  const results = await Promise.all(Array.from({ length: 12 }, () => gateway('rate', payload, mock.options)));
  const allowed = results.filter(result => result.allowed).length;
  const record = JSON.parse([...mock.files.values()][0].body);
  assert.ok(allowed >= 1 && allowed <= 5);
  assert.equal(record.attempts, allowed);
  for (let attempt = allowed; attempt < 5; attempt += 1) assert.equal((await gateway('rate', payload, mock.options)).allowed, true);
  assert.equal((await gateway('rate', payload, mock.options)).allowed, false);
});

test('list follows metadata cursors, loads only newest 200 and projects safe UI fields', async () => {
  const mock = fakeBlob();
  await gateway('create', valid, mock.options);
  const template = JSON.parse(mock.files.get(pathname).body);
  mock.files.clear();
  for (let index = 0; index < 205; index += 1) {
    const leadId = `00000000-0000-4000-8000-${index.toString().padStart(12, '0')}`;
    mock.seed(`ito/leads/${leadId}.json`, { ...template, id: leadId, name: `Visitor ${index}`,
      created_at: new Date(time + index * 1000).toISOString(), internal_secret: 'must not reach client' }, time + index * 1000);
  }
  mock.seed('ito/rate/login/unrelated.json', { private: true });
  const { leads } = await gateway('list', {}, mock.options);
  assert.equal(leads.length, 200);
  assert.equal(leads[0].name, 'Visitor 204');
  assert.equal(leads.at(-1).name, 'Visitor 5');
  assert.equal(mock.calls.filter(call => call.method === 'list').length, 3);
  assert.equal(mock.calls.filter(call => call.method === 'get').length, 200);
  for (const lead of leads) {
    assert.equal(Object.hasOwn(lead, 'request_hash'), false);
    assert.equal(Object.hasOwn(lead, 'internal_secret'), false);
    assert.equal(Object.hasOwn(lead, 'url'), false);
  }
});

test('rotating Vercel OIDC is resolved by the SDK instead of captured as a static token', async () => {
  const mock = fakeBlob();
  const oidcEnv = { BLOB_STORE_ID: 'store_testonly1234567890', VERCEL: '1' };
  assert.equal(storeConfigured(oidcEnv), true);
  assert.equal(storeConfigured({ BLOB_STORE_ID: oidcEnv.BLOB_STORE_ID, VERCEL_OIDC_TOKEN: 'test-only-oidc' }), true);
  await gateway('list', {}, { ...mock.options, env: oidcEnv });
  assert.equal(mock.calls[0].options.storeId, oidcEnv.BLOB_STORE_ID);
  assert.equal(Object.hasOwn(mock.calls[0].options, 'token'), false);
  assert.equal(Object.hasOwn(mock.calls[0].options, 'oidcToken'), false);
});

test('missing configuration, unsupported actions and invalid input never write', async () => {
  for (const invalidEnv of [null, {}, { BLOB_READ_WRITE_TOKEN: '' }, { BLOB_READ_WRITE_TOKEN: 'short' },
    { BLOB_READ_WRITE_TOKEN: 'vercel_blob_client_not_a_server_token' }, { BLOB_STORE_ID: 'store_testonly1234567890' },
    { BLOB_STORE_ID: 'https://evil.example', VERCEL: '1' }]) {
    assert.equal(storeConfigured(invalidEnv), false);
    const mock = fakeBlob();
    await assert.rejects(gateway('list', {}, { ...mock.options, env: invalidEnv }), /admin-store-unavailable/);
    assert.equal(mock.calls.length, 0);
  }
  const mock = fakeBlob();
  for (const [action, payload] of [['delete', {}], ['list', null], ['list', []], ['list', { includeSecrets: true }],
    ['create', { ...valid, requestId: '../escape' }], ['create', { ...valid, status: 'closed' }],
    ['create', { ...valid, name: 'Untrimmed ' }], ['create', { ...valid, contact: 'Unknown' }],
    ['create', { ...valid, locale: 'xx' }], ['create', { ...valid, page: '//evil.example' }],
    ['update', { id, status: 'deleted', notes: '' }], ['update', { id, status: 'new', notes: 'x'.repeat(5001) }],
    ['notify', { id, status: 'pending' }]]) {
    await assert.rejects(gateway(action, payload, mock.options), /^Error: admin-store-unavailable$/);
  }
  assert.equal(mock.files.size, 0);
});

test('SDK failures, malformed records and exhausted edit conflicts fail without secret leakage', async () => {
  const mock = fakeBlob();
  mock.sdk.list = async () => { throw new Error(`private ${env.BLOB_READ_WRITE_TOKEN}`); };
  await assert.rejects(gateway('list', {}, mock.options), (error) => error.message === 'admin-store-unavailable' && error.cause === undefined);
  mock.seed(pathname, '{invalid-json');
  await assert.rejects(gateway('update', { id, status: 'new', notes: '' }, mock.options), /admin-store-unavailable/);
  mock.files.clear();
  await gateway('create', valid, mock.options);
  mock.sdk.put = async () => { throw new BlobPreconditionFailedError(); };
  await assert.rejects(gateway('update', { id, status: 'closed', notes: '' }, mock.options), /admin-store-unavailable/);
  assert.equal(JSON.parse(mock.files.get(pathname).body).status, 'new');
});

test('ten-second timeout aborts stalled operations and late reads cannot write', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const mock = fakeBlob();
  let signal;
  let finish;
  mock.sdk.get = async (_name, options) => {
    signal = options.abortSignal;
    return new Promise(resolve => { finish = resolve; });
  };
  const pending = gateway('rate', { kind: 'login', bucket: 'd'.repeat(64) }, mock.options);
  const rejection = assert.rejects(pending, /^Error: admin-store-unavailable$/);
  t.mock.timers.tick(10000);
  await rejection;
  assert.equal(signal.aborted, true);
  finish(null);
  await new Promise(resolve => queueMicrotask(resolve));
  assert.equal(mock.files.size, 0);
});

test('client import trees do not include the store adapter or storage credentials', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const sourceExtensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs'];
  const sourceFiles = [];
  async function collect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await collect(file);
      else if (sourceExtensions.includes(path.extname(file))) sourceFiles.push(file);
    }
  }
  await collect(path.join(root, 'app'));
  const contents = new Map(await Promise.all(sourceFiles.map(async file => [file, await readFile(file, 'utf8')])));
  const visited = new Set();
  async function inspect(file) {
    if (visited.has(file)) return;
    visited.add(file);
    const source = contents.get(file) ?? await readFile(file, 'utf8');
    assert.notEqual(path.basename(file), 'admin-store.mjs', `Store adapter imported by client tree: ${file}`);
    for (const forbidden of ['BLOB_READ_WRITE_TOKEN', 'VERCEL_OIDC_TOKEN', 'ITO_BACKEND_KEY']) {
      assert.equal(source.includes(forbidden), false, `Credential referenced by client tree: ${file}`);
    }
    for (const match of source.matchAll(/(?:import\s+(?!type\b)(?:[^'";]*?\s+from\s+)?|export\s+[^'";]*?\s+from\s+|import\s*\()(['"])([^'"]+)\1/g)) {
      const specifier = match[2];
      if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue;
      const base = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(file), specifier);
      const choices = path.extname(base) ? [base] : [...sourceExtensions.map(extension => base + extension), ...sourceExtensions.map(extension => path.join(base, 'index' + extension))];
      for (const candidate of choices) {
        if (!sourceExtensions.includes(path.extname(candidate))) continue;
        try { await readFile(candidate); } catch { continue; }
        await inspect(candidate);
        break;
      }
    }
  }
  const clients = [...contents].filter(([, source]) => /^\s*['"]use client['"]/.test(source));
  assert.ok(clients.length > 0);
  for (const [file] of clients) await inspect(file);
});
