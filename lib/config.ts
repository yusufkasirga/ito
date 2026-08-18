// =====================================================
// SITE CONFIGURATION — environment-driven
// The WhatsApp number is NEVER hardcoded in components.
// Set in .env.local (local) and Vercel env vars (deploy):
//   NEXT_PUBLIC_WHATSAPP_E164_NUMBER=+90XXXXXXXXXX  (gerçek numara .env.local / Vercel içinde)
// =====================================================

export const SITE_URL = 'https://itineraryofturkiye.com';

/** E.164 formatted number from environment, e.g. "+90XXXXXXXXXX". */
export const WHATSAPP_E164_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_E164_NUMBER ?? '';

/**
 * Builds a wa.me click-to-chat URL from the configured number.
 * Returns '/#contact' as a safe fallback if the env var is missing,
 * so the site never renders a broken link.
 */
// =====================================================
// FORM → E-POSTA (Web3Forms)
// Başvurular itineraryofturkiye@gmail.com adresine e-posta olarak gelir.
//
// Anahtarı almak için: https://web3forms.com adresine git, e-posta adresini
// gir, gelen doğrulama mailindeki linke tıkla — anahtar sana e-postayla gelir.
// Aldığın anahtarı aşağıdaki tırnakların arasına yapıştır.
//
// Bu anahtar gizli değildir; herkese açık olacak şekilde tasarlanmıştır ve
// gerçek e-posta adresini gizler (takma ad gibi çalışır).
// =====================================================
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? 'e6662099-ba49-46bb-bad3-582a0b5d51ca';

export function whatsAppUrl(message?: string): string {
  const digits = WHATSAPP_E164_NUMBER.replace(/\D/g, '');
  if (!digits) return '/#contact';
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
