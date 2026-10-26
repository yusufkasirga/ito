import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as lead from '../../lib/lead-form.mjs';

// Execute the real component's event handlers with a small hook host. No DOM,
// real network request, or third-party test dependency is needed for this flow.
const componentJs = ts.transpileModule(
  readFileSync(new URL('../../app/components/LeadForm.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
).outputText;

function formHost(fetchImpl, locale = 'en') {
  const state = [];
  const events = [];
  let cursor = 0;
  let idCount = 0;
  const jsx = (type, props) => ({ type, props: props ?? {} });
  const react = {
    useId: () => 'test-form',
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], (value) => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = { current: initial };
      return state[index];
    },
  };
  const modules = {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx },
    '@/lib/config': { whatsAppUrl: () => 'https://wa.me/example' },
    '@/lib/lead-form.mjs': { ...lead, sendLead: (data, options) => lead.sendLead(data, { ...options, fetchImpl, timeoutMs: 1000 }) },
    '@vercel/analytics': { track: (...args) => events.push(args) },
    './Icon': { default: () => null },
  };
  const evaluated = { exports: {} };
  vm.runInNewContext(componentJs, {
    exports: evaluated.exports,
    require: (name) => { assert.ok(name in modules, `Unexpected dependency: ${name}`); return modules[name]; },
    window: { location: { pathname: '/contact' } },
    crypto: { randomUUID: () => { idCount++; return `ef66ce9b-fb98-48a6-807a-${idCount.toString(16).padStart(12, '0')}`; } },
  });
  function render() {
    cursor = 0;
    return evaluated.exports.default({ locale });
  }
  function nodes(tree = render()) {
    if (!tree || typeof tree !== 'object') return [];
    return [tree, ...[tree.props?.children].flat(Infinity).flatMap((child) => nodes(child ?? null))];
  }
  function fill(name, value) {
    const input = nodes().find((node) => node.props.name === name);
    assert.ok(input, `Missing field: ${name}`);
    input.props.onChange({ target: { value } });
  }
  function submit() {
    nodes().find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  }
  function prepare() {
    fill('interest', 'Tourism'); submit();
    fill('timeline', '1–2 months'); submit();
    fill('name', 'Sample Visitor'); fill('country', 'Germany');
    fill('contact', 'Email'); fill('email', 'visitor@example.test');
  }
  return { nodes, fill, submit, prepare, events, get idCount() { return idCount; } };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));

test('real form prevents repeated pending submissions and tracks only confirmed delivery', async () => {
  let calls = 0;
  let resolveRequest;
  const host = formHost(async () => {
    calls++;
    return new Promise((resolve) => { resolveRequest = resolve; });
  });
  host.prepare();
  assert.equal(host.idCount, 0);
  host.submit(); host.submit();
  assert.equal(host.idCount, 1);
  assert.equal(calls, 1);
  assert.equal(host.nodes().find((node) => node.type === 'fieldset').props.disabled, true);
  assert.equal(host.events.length, 0);
  assert.equal(host.nodes().some((node) => node.props.className === 'lf-success'), false);
  resolveRequest({ ok: true, json: async () => ({ success: true }) });
  await settle();
  assert.equal(host.nodes().some((node) => node.props.className === 'lf-success'), true);
  assert.equal(host.events.length, 1);
  assert.equal(host.events[0][0], 'lead_submit');
  host.submit();
  assert.equal(calls, 1);
});

test('real form failure keeps values, displays an explicit WhatsApp fallback and allows retry', async () => {
  let calls = 0;
  const requests = [];
  const host = formHost(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    return { ok: true, json: async () => ({ success: ++calls === 2 }) };
  });
  host.prepare(); host.submit();
  await settle();
  const failed = host.nodes();
  assert.equal(host.events.length, 0);
  assert.equal(failed.some((node) => node.props.className === 'lf-success'), false);
  assert.ok(failed.some((node) => node.props.role === 'alert'));
  assert.ok(failed.some((node) => node.props['data-wa-source'] === 'form_fallback'));
  assert.equal(failed.find((node) => node.props.name === 'name').props.value, 'Sample Visitor');
  assert.equal(failed.find((node) => node.props.name === 'email').props.value, 'visitor@example.test');
  assert.equal(failed.find((node) => node.type === 'fieldset').props.disabled, false);
  host.submit();
  await settle();
  assert.equal(host.nodes().some((node) => node.props.className === 'lf-success'), true);
  assert.equal(host.events.length, 1);
  assert.equal(host.idCount, 1);
  assert.deepEqual(requests[0], requests[1]);
  assert.equal(requests[0].url, '/api/leads');
  assert.equal(Object.hasOwn(requests[0].body, 'access_key'), false);
});

test('each language shows a factual privacy notice beside final submission', () => {
  const notices = {
    en: ['We use these details to respond to your enquiry.', '/privacy'],
    de: ['Wir verwenden diese Angaben, um Ihre Anfrage zu beantworten.', '/de/privacy'],
    ru: ['Мы используем эти данные, чтобы ответить на вашу заявку.', '/privacy'],
  };
  for (const [locale, [notice, path]] of Object.entries(notices)) {
    const host = formHost(async () => assert.fail('Preparing a form must not send it'), locale);
    host.prepare();
    const nodes = host.nodes();
    assert.ok(nodes.some((node) => node.type === 'p' && node.props.children?.includes(notice)));
    assert.ok(nodes.some((node) => node.type === 'a' && node.props.href === path));
    assert.equal(host.idCount, 0);
  }
});

test('editing a failed enquiry allocates a new identity only at the next valid send', async () => {
  const requests = [];
  const host = formHost(async (_url, init) => {
    requests.push(JSON.parse(init.body));
    return { ok: true, json: async () => ({ success: requests.length === 3 }) };
  });
  host.prepare(); host.submit();
  await settle();
  assert.equal(host.idCount, 1);

  host.fill('name', 'Sample Visitor');
  host.submit();
  await settle();
  assert.equal(host.idCount, 1);
  assert.equal(requests[1].requestId, requests[0].requestId);

  host.fill('name', 'Updated Visitor');
  assert.equal(host.idCount, 1);
  host.submit();
  await settle();
  assert.equal(host.idCount, 2);
  assert.notEqual(requests[2].requestId, requests[0].requestId);
  assert.equal(requests[2].name, 'Updated Visitor');
  assert.equal(host.events.length, 1);
  assert.equal(host.nodes().some((node) => node.props.className === 'lf-success'), true);
});
