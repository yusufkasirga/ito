const CONTACT_METHODS = new Set(['Email', 'WhatsApp', 'Phone call', 'Video meeting']);
const EMAIL_CONTACTS = new Set(['Email', 'Video meeting']);
const PHONE_CONTACTS = new Set(['WhatsApp', 'Phone call']);

export function normalizeLead(data) {
  return Object.fromEntries(
    ['interest', 'country', 'timeline', 'contact', 'name', 'email', 'phone']
      .map((field) => [field, typeof data[field] === 'string' ? data[field].trim() : '']),
  );
}

export function contactRequirements(contact) {
  return { email: EMAIL_CONTACTS.has(contact), phone: PHONE_CONTACTS.has(contact) };
}

export function validateLeadStep(input, step) {
  const data = normalizeLead(input);
  const errors = {};
  if (step === 1 && (!data.interest || data.interest.length > 100)) errors.interest = 'select';
  if (step === 2 && (!data.timeline || data.timeline.length > 100)) errors.timeline = 'select';
  if (step === 3) {
    if (!data.name || data.name.length > 150) errors.name = 'required';
    if (!data.country || data.country.length > 100) errors.country = 'required';
    if (!CONTACT_METHODS.has(data.contact)) errors.contact = 'select';
    const required = contactRequirements(data.contact);
    if (required.email && !data.email) errors.email = 'required';
    else if (data.email && (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) errors.email = 'email';
    if (required.phone && !data.phone) errors.phone = 'required';
    else if (data.phone.length > 40 || (required.phone && !/^\+[1-9]\d{6,14}$/.test(data.phone.replace(/[\s().-]/g, '')))) errors.phone = 'phone';
  }
  return errors;
}

/** Only resolves when the site's intake endpoint explicitly confirms acceptance. */
export async function sendLead(input, {
  requestId,
  locale = 'en',
  page = '-',
  website = '',
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
} = {}) {
  const data = normalizeLead(input);
  const errors = Object.assign({}, ...[1, 2, 3].map((step) => validateLeadStep(data, step)));
  if (Object.keys(errors).length) throw new Error('invalid-form');
  const submissionId = requestId ?? globalThis.crypto.randomUUID();
  if (typeof submissionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(submissionId)) throw new Error('invalid-request-id');
  const controller = new AbortController();
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error('request-timeout'));
    }, timeoutMs);
  });
  try {
    await Promise.race([
      (async () => {
        const response = await fetchImpl('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            ...data,
            locale,
            page,
            requestId: submissionId,
            website,
          }),
        });
        if (!response.ok) throw new Error('provider-http-error');
        const result = await response.json();
        if (result?.success !== true) throw new Error('provider-rejected');
      })(),
      timeout,
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}
