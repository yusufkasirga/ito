import 'server-only';

import { createHash, createHmac } from 'node:crypto';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySession } from './admin-auth.mjs';
import { gateway, storeConfigured } from './admin-store.mjs';

export function adminConfigured() {
  return storeConfigured() && /^[a-f0-9]{32}:[a-f0-9]{64}$/.test(process.env.ITO_ADMIN_PASSWORD_HASH ?? '')
    && (process.env.ITO_ADMIN_SESSION_SECRET?.length ?? 0) >= 32;
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  return verifySession((await cookies()).get(ADMIN_COOKIE)?.value, process.env.ITO_ADMIN_SESSION_SECRET);
}

export function privateJson(payload: unknown, status = 200) {
  return Response.json(payload, { status, headers: {
    'Cache-Control': 'private, no-store, max-age=0', Pragma: 'no-cache', Vary: 'Cookie',
    'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff',
  } });
}

export async function readJson(request: Request, limit = 16384): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new Error('invalid-body');
  if (Number(request.headers.get('content-length')) > limit) throw new Error('invalid-body');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid-body');
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) { await reader.cancel(); throw new Error('invalid-body'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid-body');
  return parsed;
}

export function digest(value: string) { return createHash('sha256').update(value).digest('hex'); }

export async function allowedRequest(request: Request, kind: 'login' | 'form') {
  // Vercel supplies the forwarded client address. Only a keyed digest is stored,
  // and the shared login bucket also bounds attempts across rotating addresses.
  const address = kind === 'login' ? 'all-admin-logins' :
    (request.headers.get('x-vercel-forwarded-for') ?? request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim().slice(0, 128);
  const secret = process.env.ITO_ADMIN_SESSION_SECRET;
  if (!secret || !storeConfigured()) return false;
  const bucket = createHmac('sha256', secret).update(`${kind}:${address}`).digest('hex');
  const result = await gateway('rate', { kind, bucket }) as { allowed?: boolean };
  return result.allowed === true;
}

export function validId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
