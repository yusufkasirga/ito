import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as auth from '../../lib/admin-auth.mjs';
import * as lead from '../../lib/lead-form.mjs';

// Execute the saved route handlers and their actual server/auth helpers. Only
// framework cookies, environment configuration, persistence and email are faked.
const password = 'test-only-admin-password';
const passwordHash = await auth.hashPassword(password);
const sessionSecret = 'test-only-session-secret-with-at-least-32-characters';
const leadId = 'ef66ce9b-fb98-48a6-807a-2d0c02fc165c';
const origin = 'https://itineraryofturkiye.com';
const savedLead = { id: leadId, name: 'Sample Visitor', status: 'new', notes: '', email: 'visitor@example.test' };
const validLead = {
  interest: 'Tourism', country: 'Germany', timeline: '1–2 months', contact: 'Email',
  name: 'Sample Visitor', email: 'visitor@example.test', phone: '', locale: 'en',
  page: '/contact', requestId: leadId, website: '',
};
const compiled = new Map();

function compile(path) {
  if (!compiled.has(path)) {
    compiled.set(path, ts.transpileModule(readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText);
  }
  return compiled.get(path);
}

function harness({ authorized = false, configured = true, env: extraEnv = {}, gateway, fetchImpl } = {}) {
  const calls = [];
  const emails = [];
  const cookieWrites = [];
  const env = {
    NODE_ENV: 'production', ITO_ADMIN_PASSWORD_HASH: passwordHash,
    ITO_ADMIN_SESSION_SECRET: sessionSecret, ITO_BACKEND_KEY: 'test-only-backend-secret', ...extraEnv,
  };
  const cookieValues = new Map(authorized ? [[auth.ADMIN_COOKIE, auth.createSession(sessionSecret)]] : []);
  const cookieStore = {
    get: name => cookieValues.has(name) ? { name, value: cookieValues.get(name) } : undefined,
    set(name, value, options) { cookieWrites.push({ name, value, options }); cookieValues.set(name, value); },
  };
  const store = {
    storeConfigured: () => configured,
    gateway: async (operation, data) => {
      calls.push({ operation, data });
      if (gateway) return gateway(operation, data);
      if (operation === 'rate') return { allowed: true };
      if (operation === 'list') return { leads: [savedLead] };
      if (operation === 'create') return { id: leadId, inserted: true };
      if (operation === 'update') return { lead: { ...savedLead, ...data } };
      if (operation === 'notify') return { ok: true };
      assert.fail(`Unexpected gateway operation: ${operation}`);
    },
  };
  const modules = {
    'server-only': {}, 'node:crypto': crypto,
    'next/headers': { cookies: async () => cookieStore },
    './admin-auth.mjs': auth, '@/lib/admin-auth.mjs': auth,
    './admin-store.mjs': store, '@/lib/admin-store.mjs': store,
    '@/lib/lead-form.mjs': lead,
    '@/lib/config': { SITE_URL: origin, WEB3FORMS_ACCESS_KEY: 'test-only-public-form-key' },
  };
  function load(path) {
    const evaluated = { exports: {} };
    vm.runInNewContext(compile(path), {
      exports: evaluated.exports,
      require: name => { assert.ok(name in modules, `Unexpected dependency: ${name}`); return modules[name]; },
      process: { env }, Buffer, Response, AbortSignal,
      fetch: async (url, init) => {
        emails.push({ url, init });
        assert.equal(url, 'https://api.web3forms.com/submit');
        return fetchImpl ? fetchImpl(url, init) : Response.json({ success: true });
      },
      console: { error() {} },
    }, { filename: path });
    return evaluated.exports;
  }
  modules['@/lib/admin-server'] = load('lib/admin-server.ts');
  return { load, calls, emails, cookieWrites, env };
}

function mutation(path, body, { method = 'POST', csrf = true } = {}) {
  return new Request(`${origin}${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(csrf ? { Origin: origin } : {}) },
    body: JSON.stringify(body),
  });
}

function privateResponse(response) {
  assert.match(response.headers.get('cache-control'), /private/);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(response.headers.get('vary'), 'Cookie');
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
}

test('GET enquiries rejects an unauthenticated visitor before any database operation', async () => {
  const host = harness();
  const response = await host.load('app/api/admin/leads/route.ts').GET();
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: 'unauthorized' });
  assert.equal(host.calls.length, 0);
  privateResponse(response);
});

test('GET enquiries returns stored rows only with a valid session and disables caching', async () => {
  const host = harness({ authorized: true });
  const response = await host.load('app/api/admin/leads/route.ts').GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { leads: [savedLead] });
  assert.deepEqual(host.calls.map(call => call.operation), ['list']);
  privateResponse(response);
});

test('PATCH enquiries refuses missing CSRF, missing authentication and invalid updates before storage', async () => {
  const cases = [
    { authorized: true, csrf: false, id: leadId, body: { status: 'contacted', notes: '' }, status: 403 },
    { authorized: false, csrf: true, id: leadId, body: { status: 'contacted', notes: '' }, status: 401 },
    { authorized: true, csrf: true, id: 'not-a-uuid', body: { status: 'contacted', notes: '' }, status: 404 },
    { authorized: true, csrf: true, id: leadId, body: { status: 'delete', notes: '' }, status: 400 },
    { authorized: true, csrf: true, id: leadId, body: { status: 'contacted', notes: 'x'.repeat(5001) }, status: 400 },
    { authorized: true, csrf: true, id: leadId, body: { status: 'contacted', notes: {} }, status: 400 },
  ];
  for (const entry of cases) {
    const host = harness({ authorized: entry.authorized });
    const response = await host.load('app/api/admin/leads/[id]/route.ts').PATCH(
      mutation(`/api/admin/leads/${entry.id}`, entry.body, { method: 'PATCH', csrf: entry.csrf }),
      { params: Promise.resolve({ id: entry.id }) },
    );
    assert.equal(response.status, entry.status);
    assert.equal(host.calls.length, 0);
    privateResponse(response);
  }
});

test('PATCH enquiries persists an authorized status and notes update', async () => {
  const host = harness({ authorized: true });
  const body = { status: 'contacted', notes: 'Replied by email.' };
  const response = await host.load('app/api/admin/leads/[id]/route.ts').PATCH(
    mutation(`/api/admin/leads/${leadId}`, body, { method: 'PATCH' }),
    { params: Promise.resolve({ id: leadId }) },
  );
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).lead, { ...savedLead, ...body });
  assert.deepEqual(JSON.parse(JSON.stringify(host.calls)), [{ operation: 'update', data: { id: leadId, ...body } }]);
});

test('login fails closed without complete server configuration and performs no database call', async () => {
  for (const options of [{ configured: false }, { env: { ITO_ADMIN_PASSWORD_HASH: '' } }, { env: { ITO_ADMIN_SESSION_SECRET: 'short' } }]) {
    const host = harness(options);
    const response = await host.load('app/api/admin/login/route.ts').POST(mutation('/api/admin/login', { password }));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'unavailable' });
    assert.equal(host.calls.length, 0);
    assert.equal(host.cookieWrites.length, 0);
  }
});

test('login rate denial prevents a cookie even when the password is correct', async () => {
  const host = harness({ gateway: async operation => { assert.equal(operation, 'rate'); return { allowed: false }; } });
  const response = await host.load('app/api/admin/login/route.ts').POST(mutation('/api/admin/login', { password }));
  assert.equal(response.status, 429);
  assert.equal(host.cookieWrites.length, 0);
  assert.deepEqual(host.calls.map(call => call.operation), ['rate']);
});

test('wrong login passwords never issue a cookie', async () => {
  const host = harness();
  const response = await host.load('app/api/admin/login/route.ts').POST(mutation('/api/admin/login', { password: 'wrong-password' }));
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: 'invalid-login' });
  assert.equal(host.cookieWrites.length, 0);
  privateResponse(response);
});

test('successful login sets a verifiable secure HttpOnly SameSite cookie', async () => {
  const host = harness();
  const response = await host.load('app/api/admin/login/route.ts').POST(mutation('/api/admin/login', { password }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(host.cookieWrites.length, 1);
  const cookie = host.cookieWrites[0];
  assert.equal(cookie.name, auth.ADMIN_COOKIE);
  assert.equal(auth.verifySession(cookie.value, sessionSecret), true);
  assert.deepEqual(JSON.parse(JSON.stringify(cookie.options)), {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: auth.SESSION_SECONDS,
  });
  assert.equal(cookie.value.includes(password), false);
  privateResponse(response);
});

test('public intake rejects invalid payloads before database or notification work', async () => {
  for (const invalid of [{ ...validLead, email: 'bad-email' }, { ...validLead, requestId: 'bad-id' },
    { ...validLead, interest: 'Unlisted service' }, { ...validLead, timeline: 'Tomorrow' },
    { ...validLead, locale: 'xx' }, { ...validLead, page: '//evil.example' }, { ...validLead, name: '' }]) {
    const host = harness();
    const response = await host.load('app/api/leads/route.ts').POST(mutation('/api/leads', invalid));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'invalid-input' });
    assert.equal(host.calls.length, 0);
    assert.equal(host.emails.length, 0);
  }
});

test('every interest offered by the real public form is accepted by the intake route', async () => {
  const source = ts.createSourceFile('LeadForm.tsx', readFileSync(new URL('../../app/components/LeadForm.tsx', import.meta.url), 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  let interests;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'INTERESTS' && ts.isArrayLiteralExpression(node.initializer)) {
      interests = node.initializer.elements.map(value => {
        assert.ok(ts.isStringLiteral(value));
        return value.text;
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(interests?.length, 'The form must offer at least one interest');
  for (const interest of interests) {
    const host = harness();
    const response = await host.load('app/api/leads/route.ts').POST(mutation('/api/leads', { ...validLead, interest }));
    assert.equal(response.status, 200, `Visible option rejected by the server: ${interest}`);
    assert.equal(host.calls.filter(call => call.operation === 'create').length, 1);
  }
});

test('public intake never emails an enquiry that failed to save', async () => {
  const host = harness({ gateway: async operation => {
    if (operation === 'rate') return { allowed: true };
    assert.equal(operation, 'create');
    throw new Error('test-only-storage-failure');
  } });
  const response = await host.load('app/api/leads/route.ts').POST(mutation('/api/leads', validLead));
  assert.equal(response.status, 503);
  assert.equal(host.emails.length, 0);
  assert.deepEqual(host.calls.map(call => call.operation), ['rate', 'create']);
});

test('saved enquiries remain accepted when secondary email fails and record failed notification', async () => {
  let host;
  host = harness({ fetchImpl: async () => {
    assert.equal(host.calls.at(-1).operation, 'create');
    throw new Error('test-only-email-failure');
  } });
  const response = await host.load('app/api/leads/route.ts').POST(mutation('/api/leads', validLead));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(host.emails.length, 1);
  assert.deepEqual(host.calls.map(call => call.operation), ['rate', 'create', 'notify']);
  assert.deepEqual(JSON.parse(JSON.stringify(host.calls.at(-1).data)), { id: leadId, status: 'failed' });
  privateResponse(response);
});

test('retries of saved request identities succeed without a second external email', async () => {
  const host = harness({ gateway: async operation => {
    if (operation === 'rate') return { allowed: true };
    assert.equal(operation, 'create');
    return { id: leadId, inserted: false };
  } });
  const response = await host.load('app/api/leads/route.ts').POST(mutation('/api/leads', validLead));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(host.emails.length, 0);
  assert.deepEqual(host.calls.map(call => call.operation), ['rate', 'create']);
});
