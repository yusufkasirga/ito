# Trafik Büyüme Planı — Eylül 2026
**Hedefler (sahip, 25 Eyl 2026):** 1. ay sonunda **≥2.000** aylık ziyaretçi · 6. ay sonunda **10.000** aylık ziyaretçi.
**Mevcut varlık:** ~40 EN + 27 DE blog yazısı, 12 destinasyon sayfası, EN/DE/RU ana sayfa, sinematik hero videosu.

⚠️ Rakamlar hedeftir, ölçülmüş veri değildir. Her ay sonunda Vercel Analytics + Search Console ile karşılaştırılıp plan revize edilir.

## İlerleme — 25 Eyl 2026 (canlıda)
- [x] Ana sayfada tam ekran video hero (EN/DE/RU)
- [x] Destinasyonlar: 10 → 52 rehber; 60 kartın tamamı bir rehbere gidiyor (alt bölgeler üst rehbere)
- [x] Her rehberde en iyi zaman / kaç gün / ulaşım + SSS + TouristDestination/FAQPage şeması
- [x] 3 yeni turizm yazısı (İstanbul 3/5/7 gün, dolandırıcılık tuzakları, ay ay en iyi zaman)
- [x] 5 yazının Almanca çevirisi + hreflang düzeltmesi
- [ ] **Sahip:** Search Console'da sitemap'i yeniden gönder; Bing Webmaster Tools'a ekle
- [ ] Sıradaki: şehir fotoğrafları (`public/images/dest/`), yazı ritmi haftada 3, RU çeviriler

---

## 1. Dürüst tablo: 30 günde 2.000 nasıl olur?
Genç bir alan adında Google organik trafiği ilk 30 günde tek başına 2.000'e nadiren ulaşır; sıralama birikimi 3-6 ay sürer.
Bu yüzden 1. ay hedefi **karma kanal** ile tutulur, organik SEO ise 6. ay hedefini taşır:

| Kanal | 1. ay hedefi | 6. ay hedefi | Not |
|---|---|---|---|
| Google organik (blog + destinasyon) | 400–700 | 5.500+ | Ana motor; 3. aydan sonra hızlanır |
| Instagram Reels + TikTok (video → siteye link) | 500–800 | 2.000 | Hero videosu ve yeni kısa videolar yeniden kullanılır |
| Pinterest (dikey pinler → blog) | 150–300 | 1.000 | Seyahat içeriğinde en ucuz trafik |
| Reddit / Quora cevapları (r/Turkey, r/travel, r/HairTransplants) | 200–300 | 600 | Reklam değil; gerçek cevap + ilgili rehbere link |
| Google Business Profile + haritalar | 50–100 | 300 | Yerel/marka aramaları |
| Doğrudan / e-posta / WhatsApp paylaşımları | 100–200 | 600 | |
| **Toplam** | **~1.400–2.400** | **~10.000** | |

Ücretli reklam (Google Ads) C-05 medikal iddia onayı gelmeden açılmaz; onay gelirse 1. ay açığını kapatmak için 10–15 USD/gün test bütçesi yeterlidir.

## 2. İçerik motoru (organik trafiğin %55'i)
1. **Destinasyon sayfaları: 12 → 60.** Her şehir gerçek içerikle (ince sayfa yok): giriş, 6 durak, en iyi zaman, ulaşım, SSS + şema. Haftada 6 şehir.
2. **Blog ritmi: haftada 3 yazı** (Ay 1–2), sonra haftada 2. Öncelik "ilk kez gelen çift" soruları — turizm ağırlığı artar:
   - "Istanbul 3 / 5 / 7 day itinerary", "Is Istanbul safe at night", "Turkey tourist traps to avoid", "Best time to visit Cappadocia by month", "Istanbul airport to Sultanahmet", "Turkish breakfast guide", "Turkey travel budget per day 2026".
3. **Her yazı GEO formatında:** 40–60 kelimelik direkt cevap + tablo + SSS şeması (mevcut şablon destekliyor).
4. **İç link ağı:** her destinasyon ↔ ilgili 3 blog; her blog → 1 hizmet sayfası.
5. **DE ve RU:** en çok trafik alan 10 EN yazının çevirisi (Ay 2–3). Almanca pazar sağlık turizminde yüksek hacimli.

## 3. Video ve görsel kimlik (GoTürkiye seviyesi)
- **Yapıldı:** ana sayfada tam ekran sinematik hero videosu (EN/DE/RU), bölüm etiketleri, duraklatma düğmesi, mobilde hafif sürüm, veri tasarrufu modunda otomatik kapalı.
- **Sıradaki:** gerçek drone/telefon çekimleri (İstanbul, Kapadokya, Antalya, Muğla) geldiğinde `public/videos/` altına aynı adla konur, kod değişmez.
- Destinasyon sayfalarına 6–8 saniyelik şehir videoları (aynı bileşen).
- Her hero/blog videosu dikey kesilip Reels/TikTok/Pinterest'e gider → tek üretim, 4 kanal.

## 4. Stok görsel kuralları — "insanlara zarar vermeyen stok"
Stok kullanımı kabul; ama güven işinde yanıltıcı olmamalı:
1. **Yer doğru olmalı:** Türkiye dışında çekilmiş kare Türkiye diye kullanılmaz (ör. Hong Kong manzarası destinasyonda asla).
2. **Sahte kişi yok:** stok fotoğraf "ekibimiz", "doktorumuz", "müşterimiz" olarak sunulmaz. Yorumlarda yüz yerine isim rozeti (D-15) devam.
3. **Medikal sonuç görseli yok:** önce/sonra, "sonuç" izlenimi veren stok kullanılmaz (HWG/ASA riski).
4. **Lisans kaydı:** her yeni stok görsel/video `docs/launch/image-credits.md`'ye kaynak linkiyle eklenir; hotlink yok, self-host.
5. **Stoktan çıkış:** her şehirde gerçek çekim geldikçe stok emekli edilir (hedef: 6 ayda ana sayfa + ilk 10 şehir özgün).

## 5. Teknik SEO kontrol listesi (Ay 1)
- [ ] Search Console: sitemap yeniden gönder, "Sayfa dizine ekleme" hatalarını sıfırla
- [ ] Bing Webmaster Tools + IndexNow (ChatGPT/Copilot aramaları Bing'den beslenir)
- [ ] Core Web Vitals: hero posteri LCP'de, video hidrasyondan sonra yükleniyor — mobil LCP < 2,5 sn doğrula
- [ ] Destinasyon + blog sayfalarına `VideoObject` şeması (video eklendikçe)
- [ ] Google Business Profile oluştur/doğrula

## 6. Haftalık ritim (günde ~1,5 saat sahip zamanı varsayımıyla)
| Gün | Sahip | Claude |
|---|---|---|
| Pzt | 15 dk onay | 3 blog yazısı taslağı + 6 destinasyon |
| Çar | 30 dk: 2 Reels çekimi/paylaşımı | Reels metinleri, Pinterest pinleri |
| Cum | 30 dk: Reddit/Quora'da 3 cevap | Cevap taslakları, haftalık trafik raporu |

## 7. Ölçüm
- **Birincil:** Vercel Analytics aylık ziyaretçi, Search Console tıklama/gösterim.
- **Kontrol noktaları:** Gün 30 (≥2.000), Gün 90 (≥5.000), Gün 180 (≥10.000).
- Kontrol noktası kaçarsa: en çok trafik getiren 3 kanala bütçe/zaman kaydırılır, düşük performanslı içerik türü durdurulur.
