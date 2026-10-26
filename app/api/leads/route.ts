import { acceptsMutation } from '@/lib/admin-auth.mjs';
import { gateway, storeConfigured } from '@/lib/admin-store.mjs';
import { allowedRequest, digest, privateJson, readJson, validId } from '@/lib/admin-server';
import { normalizeLead, validateLeadStep } from '@/lib/lead-form.mjs';
import { WEB3FORMS_ACCESS_KEY, SITE_URL } from '@/lib/config';
import type { LeadData } from '@/lib/lead-form.mjs';

export const runtime = 'nodejs';
export const maxDuration = 30;

async function notify(data: LeadData, locale: string, page: string) {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(8000),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: SITE_URL },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY, subject: `New enquiry — ${data.interest} — ${data.name}`,
      from_name: 'Itinerary of Türkiye — Website', Name: data.name,
      ...(data.email ? { email: data.email } : {}), Email: data.email || '-', Phone: data.phone || '-',
      Country: data.country, 'Area of interest': data.interest, Timeline: data.timeline,
      'Preferred contact': data.contact, Language: locale, Page: page,
    }),
  });
  if (!response.ok || (await response.json())?.success !== true) throw new Error('notification-failed');
}

export async function POST(request: Request) {
  if (!acceptsMutation(request)) return privateJson({ error: 'forbidden' }, 403);
  if (!storeConfigured()) return privateJson({ error: 'unavailable' }, 503);
  try {
    const body = await readJson(request);
    if (typeof body.website === 'string' && body.website.trim()) return privateJson({ success: true });
    const data = normalizeLead(body as Partial<LeadData>);
    const errors = Object.assign({}, ...[1, 2, 3].map(step => validateLeadStep(data, step)));
    if (Object.keys(errors).length || !validId(body.requestId)
      || !['Tourism', 'Medical Tourism', 'Investment / Real Estate', 'Business', 'Other'].includes(data.interest)
      || !['Within 2 weeks', '1–2 months', '3–6 months', 'Exploratory only'].includes(data.timeline)
      || !['en', 'de', 'ru'].includes(String(body.locale))
      || typeof body.page !== 'string' || !body.page.startsWith('/') || body.page.startsWith('//') || body.page.length > 512) return privateJson({ error: 'invalid-input' }, 400);
    if (!(await allowedRequest(request, 'form'))) return privateJson({ error: 'try-later' }, 429);
    const payload = { ...data, locale: body.locale, page: body.page, requestId: body.requestId };
    const saved = await gateway('create', { ...payload, request_hash: digest(JSON.stringify(payload)) }) as { id?: string; inserted?: boolean };
    if (!saved.id) throw new Error('not-saved');
    if (saved.inserted) {
      let status = 'sent';
      try { await notify(data, String(body.locale), body.page); }
      catch { status = 'failed'; }
      try { await gateway('notify', { id: saved.id, status }); }
      catch { console.error('ITO notification status could not be updated'); }
    }
    // A saved enquiry is accepted even if its secondary email notification fails.
    return privateJson({ success: true });
  } catch { return privateJson({ error: 'unavailable' }, 503); }
}
