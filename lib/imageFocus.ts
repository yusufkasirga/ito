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
  gaziantep: '45% 25%', // Kurtuluş Camii solda, minareler üstte kesiliyordu
  alanya: '78% 50%', // Kızıl Kule sağda
  side: '50% 15%', // Apollon Tapınağı'nın üstü geniş kırpımda kesiliyordu
  datca: '70% 50%', // tekne sağda
  amasya: '22% 50%', // nehir kıyısı evleri solda
  konya: '58% 50%', // Mevlana'nın turkuaz kubbesi
  kusadasi: '60% 50%',
  canakkale: '35% 50%', // köprü kulesi
  izmir: '50% 60%',
};

export function destFocus(slug: string): string {
  return FOCUS[slug] ?? '50% 50%';
}
