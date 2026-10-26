import { cookies } from 'next/headers';
import { ADMIN_COOKIE, SESSION_SECONDS, acceptsMutation, createSession, verifyPassword } from '@/lib/admin-auth.mjs';
import { adminConfigured, allowedRequest, privateJson, readJson } from '@/lib/admin-server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!acceptsMutation(request)) return privateJson({ error: 'forbidden' }, 403);
  if (!adminConfigured()) return privateJson({ error: 'unavailable' }, 503);
  try {
    const body = await readJson(request, 2048);
    if (!(await allowedRequest(request, 'login'))) return privateJson({ error: 'try-later' }, 429);
    if (!(await verifyPassword(body.password, process.env.ITO_ADMIN_PASSWORD_HASH))) return privateJson({ error: 'invalid-login' }, 401);
    (await cookies()).set(ADMIN_COOKIE, createSession(process.env.ITO_ADMIN_SESSION_SECRET!), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',
      path: '/', maxAge: SESSION_SECONDS,
    });
    return privateJson({ ok: true });
  } catch { return privateJson({ error: 'unavailable' }, 503); }
}
