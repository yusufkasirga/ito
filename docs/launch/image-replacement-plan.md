# Görsel Değişim Planı (P-04)
**Tarih:** 2026-07-16 · **Sorun:** 14 benzersiz görsel Pexels sunucusundan hotlink — lisans/erişilebilirlik kontrolü bizde değil, `next/image` optimizasyonu yok, LCP zayıf.

## Envanter
- app/ altında 17 Pexels URL, 14 benzersiz foto (3889742 üç, 2076930 iki boyutta kullanılıyor).
- Kullanım yerleri: hero slider (1920×1080), deneyim/bölge kartları (800×1200, 700×900), yatay kartlar (1200×800, 800×500).

## Strateji (iki aşama)
**Aşama 1 — hızlı ve ücretsiz (bu hafta):**
1. Aynı Pexels fotoğraflarını indirip `/public/images/` altına al (Pexels lisansı ticari kullanıma ve değişikliğe izin verir, atıf zorunlu değil; yine de fotoğrafçı listesini `docs/launch/image-credits.md` olarak tut).
2. `<img src="https://images.pexels.com/...">` kullanımlarını `next/image` + yerel dosya ile değiştir; boyutları mevcut crop'lara göre üret (1920w hero, 800w kart), WebP/AVIF otomatik.
3. `next.config.ts`'te uzak görsel domain'i kalmasın.

**Aşama 2 — marka görselleri (lansman sonrası):**
- Premium konumlandırma için stok yerine özel çekim/lisanslı kütüphane (ör. gerçek partner klinik ve tur kareleri, izinli).
- Öncelik: hero slider + medikal bölüm (güven algısını en çok taşıyan yüzeyler).

## Kabul kriterleri
- app/ içinde `images.pexels.com` referansı sıfır.
- Lighthouse mobil performans ≥ 85 (Q-02).
- Tüm görsellerde anlamlı `alt` metni (mevcutlar korunur/iyileştirilir).

## Uygulama
Onay verildiğinde Aşama 1'i ben uygularım (indirme + kod değişikliği + yerel build doğrulaması); commit ve push sahip tarafından yapılır.

## Aşama 1b — Konu Uygunluğu Denetimi (2026-07-17, görsel içerik gözle doğrulandı)
Kontak-föy ile 13 benzersiz foto tek tek incelendi. **Emekliye ayrılanlar (konu dışı):** 1539581 ("CREATE" tabelaları), 3807517 (oto tamircisi!), 2467285 (Hong Kong silüeti!), 2456718 (fırtınalı boş arazi). Bunlar artık hiçbir sayfada kullanılmıyor.
**Yeniden eşleştirme:** İstanbul yazısı → Boğaz köprüsü (1549326); Kapadokya yazıları → gerçek balon fotoğrafları (2325446/3889742); Riviera+valiz → turkuaz sahil/bavullu gezgin (1268855); kombine prosedür → dental (3779709); vize/emlak → İstanbul; yaşam maliyeti → yemek (3338497); hero'dan 2 yanlış slayt çıktı (3 slayt: 2×Kapadokya + İstanbul); Nature kartı → çadır/dağ (2419278); History kartı → Kapadokya vadileri; Services görselleri düzeltildi.

## Aşama 1c — İndirilecek eksik konular (Pexels'ten seçim bekliyor)
1. Ayasofya/İstanbul silüeti (hero + Istanbul yazısı yükseltme)
2. Ölüdeniz/turkuaz koy (Riviera)
3. Efes antik kenti (History & Heritage kartı)
4. Bavul/valiz hazırlığı flat-lay (packing)
5. Pasaport/seyahat belgeleri (visa)
6. Karlı Kapadokya (winter)
7. Kapalıçarşı/pazar (cost of living)
8. Doktor-hasta konsültasyonu (combining/insurance/consultation)
9. İstanbul konut/rezidans (property yazıları)
Seçim yöntemi: Pexels araması → aday ID'ler → indirme script'i → kontak-föy ile görsel doğrulama → atama.
