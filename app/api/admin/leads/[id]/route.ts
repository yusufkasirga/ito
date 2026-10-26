import { acceptsMutation } from '@/lib/admin-auth.mjs';
import { gateway } from '@/lib/admin-store.mjs';
import { isAdmin, privateJson, readJson, validId } from '@/lib/admin-server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!acceptsMutation(request)) return privateJson({ error: 'forbidden' }, 403);
  if (!(await isAdmin())) return privateJson({ error: 'unauthorized' }, 401);
  const { id } = await params;
  if (!validId(id)) return privateJson({ error: 'not-found' }, 404);
  try {
    const body = await readJson(request, 24576);
    if (!['new', 'contacted', 'closed'].includes(String(body.status)) || typeof body.notes !== 'string' || body.notes.length > 5000) return privateJson({ error: 'invalid-input' }, 400);
    const result = await gateway('update', { id, status: body.status, notes: body.notes }) as { lead?: unknown };
    return result.lead ? privateJson(result) : privateJson({ error: 'not-found' }, 404);
  } catch { return privateJson({ error: 'unavailable' }, 503); }
}
