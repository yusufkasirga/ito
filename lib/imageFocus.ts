// =====================================================
// FOTOĞRAF ODAK NOKTALARI — object-position değerleri.
// Aynı kare hem dikey kartlarda (3:4) hem geniş rehber kapağında (~2.6:1)
// kırpılır; ortadan kırpmanın ana konuyu kestiği fotoğraflar burada düzeltilir.
// Anahtar: public/images/dest/<slug>.jpg dosyasının slug'ı.
// Yeni fotoğraf eklerken iki kırpımı da kontrol edin.
// =====================================================

const FOCUS: Record<string, string> = {
  istanbul: '32% 55%', // Süleymaniye Camii sol-ortada; ortadan kırpınca dikey kartta kesiliyordu
  bodrum: '50% 72%', // geniş kapakta yalnız yelkenler kalıyordu; tekne ve kale aşağıda
};

export function destFocus(slug: string): string {
  return FOCUS[slug] ?? '50% 50%';
}
