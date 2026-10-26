import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import {
  ADMIN_COOKIE, SESSION_SECONDS, acceptsMutation, createSession, hashPassword, verifyPassword, verifySession,
} from '../../lib/admin-auth.mjs';

const secret = 'test-only-secret-with-at-least-32-characters';
const now = 1_800_000_000_000;
const seconds = now / 1000;

function signedPayload(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}

function mutation(headers = {}, url = 'https://itineraryofturkiye.com/api/admin/login') {
  return new Request(url, { method: 'POST', headers });
}

test('passwords use random salts and verify only the original password', async () => {
  const password = 'test-only password with spaces ✓';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.match(first, /^[a-f\d]{32}:[a-f\d]{64}$/);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword(`${password} `, first), false);
  const [salt, key] = first.split(':');
  const alteredKey = `${key[0] === '0' ? '1' : '0'}${key.slice(1)}`;
  assert.equal(await verifyPassword(password, `${salt}:${alteredKey}`), false);
});

test('password input bounds and malformed stored hashes fail closed', async () => {
  for (const password of ['', 'x'.repeat(513), null, {}, 123]) {
    await assert.rejects(hashPassword(password), /Password must contain/);
    assert.equal(await verifyPassword(password, 'a'.repeat(32) + ':' + 'b'.repeat(64)), false);
  }
  for (const hash of [undefined, null, '', {}, 'no-colon', 'a:b', `${'x'.repeat(32)}:${'b'.repeat(64)}`,
    `${'a'.repeat(32)}:${'b'.repeat(62)}`, `${'a'.repeat(32)}:${'b'.repeat(64)}:extra`]) {
    assert.equal(await verifyPassword('valid password', hash), false);
  }
});

test('sessions last eight hours and independent sign-ins have distinct nonces', () => {
  assert.equal(ADMIN_COOKIE, 'ito_admin');
  assert.equal(SESSION_SECONDS, 28800);
  const token = createSession(secret, now);
  assert.notEqual(token, createSession(secret, now));
  const data = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
  assert.equal(data.iat, seconds);
  assert.equal(data.exp, seconds + SESSION_SECONDS);
  assert.equal(verifySession(token, secret, now), true);
  assert.equal(verifySession(token, secret, now + SESSION_SECONDS * 1000 - 1), true);
  assert.equal(verifySession(token, secret, now + SESSION_SECONDS * 1000), false);
  assert.equal(verifySession(token, secret, now - 1000), false);
  assert.equal(verifySession(token, `${secret}other`, now), false);
});

test('altered cookies cannot extend expiry or change signed payloads', () => {
  const token = createSession(secret, now);
  const [payload, sig] = token.split('.');
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  data.exp += 86400;
  const alteredPayload = Buffer.from(JSON.stringify(data)).toString('base64url');
  assert.equal(verifySession(`${alteredPayload}.${sig}`, secret, now), false);
  const alteredSig = `${sig[0] === 'A' ? 'B' : 'A'}${sig.slice(1)}`;
  assert.equal(verifySession(`${payload}.${alteredSig}`, secret, now), false);
});

test('even correctly signed malformed, future or overlong sessions are rejected', () => {
  const valid = { nonce: 'a'.repeat(32), iat: seconds, exp: seconds + SESSION_SECONDS };
  for (const data of [null, [], {}, { ...valid, iat: seconds + 1 },
    { ...valid, exp: seconds }, { ...valid, exp: seconds + SESSION_SECONDS + 1 },
    { ...valid, iat: -1 }, { ...valid, iat: String(seconds) },
    { ...valid, exp: NaN }, { ...valid, nonce: 'short' }, { ...valid, admin: true }]) {
    assert.equal(verifySession(signedPayload(data), secret, now), false);
  }
  assert.equal(verifySession(signedPayload({ ...valid, exp: seconds + 60 }), secret, now), true);
});

test('malformed cookie encodings and missing secrets do not authenticate', () => {
  const token = createSession(secret, now);
  const [payload, sig] = token.split('.');
  for (const value of [undefined, null, '', {}, 'not-a-token', `${token}.extra`,
    `${payload}=.${sig}`, `${payload}.${sig}=`, `${payload}.${'A'.repeat(42)}`, 'A'.repeat(2049)]) {
    assert.equal(verifySession(value, secret, now), false);
  }
  for (const badSecret of [undefined, null, '', 'x'.repeat(31), {}]) {
    assert.throws(() => createSession(badSecret, now), /session secret/);
    assert.equal(verifySession(token, badSecret, now), false);
  }
  for (const invalidTime of [-1, Infinity, NaN, 'now', 0.5]) {
    assert.throws(() => createSession(secret, invalidTime), /session time/);
    assert.equal(verifySession(token, secret, invalidTime), false);
  }
});

test('mutation checks require an exact origin, including scheme and port', () => {
  assert.equal(acceptsMutation(mutation({ origin: 'https://itineraryofturkiye.com' })), true);
  for (const origin of ['https://evil.example', 'https://itineraryofturkiye.com.evil.example',
    'http://itineraryofturkiye.com', 'https://itineraryofturkiye.com:8443',
    'https://itineraryofturkiye.com/', 'null', '']) {
    assert.equal(acceptsMutation(mutation({ origin })), false);
  }
  assert.equal(acceptsMutation(mutation({ origin: 'http://localhost:3000' }, 'http://localhost:3000/api/admin/login')), true);
});

test('missing Origin only accepts explicit same-origin fetch metadata', () => {
  assert.equal(acceptsMutation(mutation()), false);
  assert.equal(acceptsMutation(mutation({ 'sec-fetch-site': 'same-origin' })), true);
  for (const site of ['cross-site', 'same-site', 'none', '']) {
    assert.equal(acceptsMutation(mutation({ 'sec-fetch-site': site })), false);
  }
  assert.equal(acceptsMutation(mutation({ origin: 'https://itineraryofturkiye.com', 'sec-fetch-site': 'cross-site' })), false);
  assert.equal(acceptsMutation(mutation({ origin: 'https://evil.example', 'sec-fetch-site': 'same-origin' })), false);
  assert.equal(acceptsMutation({ url: 'bad-url', headers: new Headers() }), false);
  assert.equal(acceptsMutation(null), false);
});
