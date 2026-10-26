import { gateway } from '@/lib/admin-store.mjs';
import { isAdmin, privateJson } from '@/lib/admin-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return privateJson({ error: 'unauthorized' }, 401);
  try { return privateJson(await gateway('list', {})); }
  catch { return privateJson({ error: 'unavailable' }, 503); }
}
