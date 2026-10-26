import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

export const ADMIN_COOKIE = 'ito_admin';
export const SESSION_SECONDS = 8 * 60 * 60;

const deriveKey = promisify(scrypt);
const scryptOptions = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const passwordHashPattern = /^[a-f\d]{32}:[a-f\d]{64}$/i;
const base64urlPattern = /^[A-Za-z\d_-]+$/;

function validPassword(password) {
  return typeof password === 'string' && password.length >= 1 && password.length <= 512;
}

function validSecret(secret) {
  return typeof secret === 'string' && secret.length >= 32 && Buffer.byteLength(secret, 'utf8') >= 32;
}

function secondsAt(now) {
  if (!Number.isSafeInteger(now) || now < 0) throw new TypeError('Invalid session time');
  return Math.floor(now / 1000);
}

function signature(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest();
}

/** Only the derived hash belongs in server configuration; never store the password. */
export async function hashPassword(password) {
  if (!validPassword(password)) throw new TypeError('Password must contain 1 to 512 characters');
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, 32, scryptOptions);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

export async function verifyPassword(password, hash) {
  if (!validPassword(password) || typeof hash !== 'string' || !passwordHashPattern.test(hash)) return false;
  const [saltHex, keyHex] = hash.split(':');
  try {
    const key = await deriveKey(password, Buffer.from(saltHex, 'hex'), 32, scryptOptions);
    return timingSafeEqual(key, Buffer.from(keyHex, 'hex'));
  } catch {
    return false;
  }
}

/** The signed payload contains no credentials or applicant data. */
export function createSession(secret, now = Date.now()) {
  if (!validSecret(secret)) throw new TypeError('An admin session secret of at least 32 characters is required');
  const iat = secondsAt(now);
  const payload = Buffer.from(JSON.stringify({
    nonce: randomBytes(16).toString('hex'),
    iat,
    exp: iat + SESSION_SECONDS,
  }), 'utf8').toString('base64url');
  return `${payload}.${signature(payload, secret).toString('base64url')}`;
}

export function verifySession(token, secret, now = Date.now()) {
  if (!validSecret(secret) || typeof token !== 'string' || token.length > 2048) return false;
  try {
    const time = secondsAt(now);
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payload, signed] = parts;
    if (!base64urlPattern.test(payload) || !base64urlPattern.test(signed) || signed.length !== 43) return false;
    const actualSignature = Buffer.from(signed, 'base64url');
    if (actualSignature.length !== 32 || actualSignature.toString('base64url') !== signed) return false;
    if (!timingSafeEqual(actualSignature, signature(payload, secret))) return false;

    const decoded = Buffer.from(payload, 'base64url');
    if (decoded.toString('base64url') !== payload) return false;
    const session = JSON.parse(decoded.toString('utf8'));
    if (session === null || Array.isArray(session) || typeof session !== 'object') return false;
    if (Object.keys(session).sort().join(',') !== 'exp,iat,nonce') return false;
    if (typeof session.nonce !== 'string' || !/^[a-f\d]{32}$/.test(session.nonce)) return false;
    if (!Number.isSafeInteger(session.iat) || !Number.isSafeInteger(session.exp)) return false;
    return session.iat >= 0 && session.iat <= time && session.exp > time
      && session.exp > session.iat && session.exp - session.iat <= SESSION_SECONDS;
  } catch {
    return false;
  }
}

/** Apply to every state-changing route, including login and logout. */
export function acceptsMutation(request) {
  try {
    const url = new URL(request.url);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    const site = request.headers.get('sec-fetch-site');
    if (site === 'cross-site') return false;
    const origin = request.headers.get('origin');
    if (origin !== null) return origin === url.origin;
    return site === 'same-origin';
  } catch {
    return false;
  }
}
