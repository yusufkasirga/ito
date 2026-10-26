import { cookies } from 'next/headers';
import { ADMIN_COOKIE, acceptsMutation } from '@/lib/admin-auth.mjs';
import { privateJson } from '@/lib/admin-server';

export async function POST(request: Request) {
  if (!acceptsMutation(request)) return privateJson({ error: 'forbidden' }, 403);
  (await cookies()).set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return privateJson({ ok: true });
}
