import assert from 'node:assert/strict';
import test from 'node:test';
import { contactRequirements, normalizeLead, sendLead, validateLeadStep } from '../../lib/lead-form.mjs';

const valid = {
  interest: 'Tourism', country: ' Germany ', timeline: '1–2 months',
  contact: 'Email', name: ' Sample Visitor ', email: ' visitor@example.test ', phone: '',
};
const options = { accessKey: 'test-key', timeoutMs: 1000 };

test('accepted HTTP and provider response resolves with trimmed contact details', async () => {
  let request;
  await sendLead(valid, {
    ...options, locale: 'de', page: '/contact',
    fetchImpl: async (url, init) => {
      request = { url, ...init, payload: JSON.parse(init.body) };
      return { ok: true, json: async () => ({ success: true }) };
    },
  });
  assert.equal(request.url, 'https://api.web3forms.com/submit');
  assert.equal(request.method, 'POST');
  assert.equal(request.payload.Name, 'Sample Visitor');
  assert.equal(request.payload.Email, 'visitor@example.test');
  assert.equal(request.payload.email, 'visitor@example.test');
  assert.equal(request.payload.Country, 'Germany');
  assert.equal(request.payload.Language, 'de');
  assert.equal(request.payload.Page, '/contact');
  assert.ok(request.signal instanceof AbortSignal);
  assert.equal(valid.name, ' Sample Visitor ');
});

test('HTTP failure never becomes a successful send even if JSON claims success', async () => {
  let parsed = false;
  await assert.rejects(sendLead(valid, {
    ...options,
    fetchImpl: async () => ({ ok: false, json: async () => { parsed = true; return { success: true }; } }),
  }), /provider-http-error/);
  assert.equal(parsed, false);
});

test('HTTP success still requires explicit boolean provider success', async () => {
  for (const result of [{ success: false }, { success: 'true' }, {}, null]) {
    await assert.rejects(sendLead(valid, {
      ...options, fetchImpl: async () => ({ ok: true, json: async () => result }),
    }), /provider-rejected/);
  }
});

test('malformed JSON and a network rejection preserve the failed outcome', async () => {
  await assert.rejects(sendLead(valid, {
    ...options, fetchImpl: async () => ({ ok: true, json: async () => { throw new SyntaxError('bad-json'); } }),
  }), /bad-json/);
  await assert.rejects(sendLead(valid, {
    ...options, fetchImpl: async () => { throw new TypeError('offline'); },
  }), /offline/);
});

test('a hanging request is aborted and rejects within its deadline', async () => {
  let signal;
  await assert.rejects(sendLead(valid, {
    ...options, timeoutMs: 5,
    fetchImpl: async (_url, init) => { signal = init.signal; return new Promise(() => {}); },
  }), /request-timeout/);
  assert.equal(signal.aborted, true);
});

test('Email and Video meeting require valid email addresses', () => {
  for (const contact of ['Email', 'Video meeting']) {
    assert.deepEqual(contactRequirements(contact), { email: true, phone: false });
    assert.equal(validateLeadStep({ ...valid, contact, email: '   ' }, 3).email, 'required');
    assert.equal(validateLeadStep({ ...valid, contact, email: 'visitor@' }, 3).email, 'email');
    assert.deepEqual(validateLeadStep({ ...valid, contact }, 3), {});
  }
});

test('WhatsApp and Phone call require an international phone, with email optional', async () => {
  for (const contact of ['WhatsApp', 'Phone call']) {
    assert.deepEqual(contactRequirements(contact), { email: false, phone: true });
    assert.equal(validateLeadStep({ ...valid, contact, email: '', phone: '   ' }, 3).phone, 'required');
    for (const phone of ['hello', '123', '07700900123', '+0000000', '+4412345678901234']) {
      assert.equal(validateLeadStep({ ...valid, contact, email: '', phone }, 3).phone, 'phone');
    }
    assert.deepEqual(validateLeadStep({ ...valid, contact, email: '', phone: ' +44 (7700) 900-123 ' }, 3), {});
    let payload;
    await sendLead({ ...valid, contact, email: '', phone: ' +44 7700 900123 ' }, {
      ...options,
      fetchImpl: async (_url, init) => { payload = JSON.parse(init.body); return { ok: true, json: async () => ({ success: true }) }; },
    });
    assert.equal(payload.Phone, '+44 7700 900123');
    assert.equal(payload.Email, '-');
    assert.equal(Object.hasOwn(payload, 'email'), false);
  }
});

test('whitespace, unknown contact methods, and invalid optional email cannot pass validation', async () => {
  assert.deepEqual(validateLeadStep({ ...valid, name: '  ', country: '\t', contact: '' }, 3), {
    name: 'required', country: 'required', contact: 'select',
  });
  assert.equal(validateLeadStep({ ...valid, contact: 'Unknown method' }, 3).contact, 'select');
  assert.equal(validateLeadStep({ ...valid, contact: 'WhatsApp', phone: '+447700900123', email: 'bad' }, 3).email, 'email');
  assert.equal(validateLeadStep({ interest: '  ' }, 1).interest, 'select');
  assert.equal(validateLeadStep({ timeline: '  ' }, 2).timeline, 'select');
  assert.equal(normalizeLead({ name: null }).name, '');
  let called = false;
  await assert.rejects(sendLead({ ...valid, contact: 'Phone call', email: '' }, {
    ...options, fetchImpl: async () => { called = true; },
  }), /invalid-form/);
  assert.equal(called, false);
});

test('a failed request may be retried using the same unchanged fields', async () => {
  const original = structuredClone(valid);
  let attempts = 0;
  const requestOptions = {
    ...options,
    fetchImpl: async () => ({ ok: true, json: async () => ({ success: ++attempts === 2 }) }),
  };
  await assert.rejects(sendLead(valid, requestOptions), /provider-rejected/);
  await sendLead(valid, requestOptions);
  assert.deepEqual(valid, original);
  assert.equal(attempts, 2);
});

test('missing provider configuration does not make a request', async () => {
  let called = false;
  await assert.rejects(sendLead(valid, {
    accessKey: ' ', fetchImpl: async () => { called = true; },
  }), /missing-configuration/);
  assert.equal(called, false);
});
