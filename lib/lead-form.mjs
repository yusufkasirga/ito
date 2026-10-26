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
  if (step === 1 && !data.interest) errors.interest = 'select';
  if (step === 2 && !data.timeline) errors.timeline = 'select';
  if (step === 3) {
    if (!data.name) errors.name = 'required';
    if (!data.country) errors.country = 'required';
    if (!CONTACT_METHODS.has(data.contact)) errors.contact = 'select';
    const required = contactRequirements(data.contact);
    if (required.email && !data.email) errors.email = 'required';
    else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'email';
    if (required.phone && !data.phone) errors.phone = 'required';
    else if (required.phone && !/^\+[1-9]\d{6,14}$/.test(data.phone.replace(/[\s().-]/g, ''))) errors.phone = 'phone';
  }
  return errors;
}

/** Only resolves when Web3Forms explicitly accepts the request. Never returns provider text to the UI. */
export async function sendLead(input, {
  accessKey,
  locale = 'en',
  page = '-',
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
} = {}) {
  const data = normalizeLead(input);
  const errors = Object.assign({}, ...[1, 2, 3].map((step) => validateLeadStep(data, step)));
  if (Object.keys(errors).length) throw new Error('invalid-form');
  if (!accessKey?.trim()) throw new Error('missing-configuration');
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
        const response = await fetchImpl('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New enquiry — ${data.interest} — ${data.name}`,
            from_name: 'Itinerary of Türkiye — Website',
            Name: data.name,
            ...(data.email ? { email: data.email } : {}),
            Email: data.email || '-',
            Phone: data.phone || '-',
            Country: data.country,
            'Area of interest': data.interest,
            Timeline: data.timeline,
            'Preferred contact': data.contact,
            Language: locale,
            Page: page,
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
