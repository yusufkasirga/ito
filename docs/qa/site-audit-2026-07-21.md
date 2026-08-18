# Site Denetimi — itineraryofturkiye.com
**Tarih:** 21 Temmuz 2026
**Yöntem:** Canlı sayfa incelemesi (EN + DE) + kaynak kod analizi + WCAG 2.1 AA kontrol listesi
**Departmanlar:** Tasarım/UX, Erişilebilirlik, Pazarlama/SEO, İçerik, Teknik, Hukuk/Uyumluluk, Kalite Güvence

> **Kanıt notu:** Aşağıdaki her bulgu ya canlı sayfa çıktısından ya da dosya/satır referansından doğrulanmıştır.
> Varsayım olan yerler açıkça "varsayım" diye işaretlenmiştir. Hukuki maddeler uzman teyidi gerektirir.

---

## Yönetici Özeti

Site teknik ve editoryal olarak beklenenin üzerinde: hukuki sayfalar mevcut, hassas veri politikası tutarlı,
"garanti yok" dili doğru kurgulanmış, 26 EN + 26 DE yazılık ciddi bir içerik varlığı var, şema işaretlemesi
ve sitemap düzgün. Bu, üç haftalık bir site için güçlü bir temel.

Buna karşılık **11 gerçek eksik** bulundu. Bunlardan 3'ü yayına çıkmış durumda ve ticari/hukuki risk taşıyor:

1. **Almanca sayfada Impressum yok** — Almanya'ya yönelik ticari sitelerde yasal zorunluluk.
2. **Almanca ana sayfada İngilizce kalıntılar ve dil sızıntıları var** — "EN kalıntısı: 0" kaydı hatalıymış.
3. **Otomatik dönen hero, duraklatma kontrolü olmadan çalışıyor** — WCAG Seviye A ihlali.

Ayrıca ölçüm tarafında kritik bir boşluk var: **WhatsApp tıklamaları ölçülmüyor**, yani dönüşüm oranınız
şu anda bilinemez durumda.

| Öncelik | Adet | Tahmini süre |
|---|---|---|
| 🔴 Kritik | 3 | ~3 saat |
| 🟠 Yüksek | 4 | ~4 saat |
| 🟡 Orta | 4 | ~3 saat |

---

## 🔴 KRİTİK

### K-01 · Almanca sürümde Impressum yok
**Departman:** Hukuk/Uyumluluk · **Kanıt:** `grep -ril impressum app/` → yalnızca docs içinde geçiyor, sayfa yok

Almanya'da ticari amaçlı web sitelerinde sağlayıcı künyesi (Impressum) yasal zorunluluktur — işletme adı,
temsilci, açık adres, e-posta ve telefon. `/de` sürümü Alman pazarına hitap ediyor ve `/de/privacy` +
`/de/terms` var, ancak Impressum yok. Bu eksiklik Almanya'da uyarı mektubu (Abmahnung) riski doğurur;
ayrıca Almanca reklam vermeye başladığınızda risk büyür.

**Öneri:** `/de/impressum` sayfası + tüm DE footer'larında link. Şirket kimliği zaten elimizde
(Itinerary of Türkiye, Yenibosna VD, VN 76003842, İstanbul), eksik olan **e-posta ve telefon**.
Metin taslağı hazırlanabilir; **yayın öncesi Alman hukukuna hâkim avukat teyidi şart.**

### K-02 · Almanca ana sayfada İngilizce kalıntılar ve dil sızıntıları
**Departman:** İçerik/UX · **Kanıt:** canlı `/de` çıktısı

Karar kaydı D-35'te "DE sayfada EN kalıntı taraması: 0" yazıyor — bu doğru değil. Canlıdaki `/de` sayfasında:

| Yer | Şu an | Olması gereken |
|---|---|---|
| Saç ekimi kartı etiketleri | "Hair Transplant / Beard & Mustache / Eyebrow Restoration" | Almanca |
| Diş kartı etiketleri | "Hollywood Smile / Veneers / Dental Implants" | Almanca |
| Estetik kartı etiketleri | "Rhinoplasty / Facelift" | Almanca |
| Diş kartı rozeti | "✓ Verified Partner Clinics" | "✓ Geprüfte Partnerkliniken" |
| Yorum etiketleri (3 adet) | "Client Story" | "Kundenstimme (übersetzt)" |
| Hero alt yazısı | "✨ Cappadocia · Istanbul · Aegean Coast" | Almanca yer adları |
| Logo linki | `/` (EN ana sayfa) | `/de` |
| Footer "Business-Beratung" | `/future-services` (EN) | `/de/future-services` |
| Footer "Investment & Immobilien" | `/future-services` (EN) | `/de/future-services` |

Alman ziyaretçi logoya tıkladığında İngilizce siteye düşüyor. Premium konumlandırma için bu, güven kıran
türden bir detay — hedef kitleniz bunu fark eder.

### K-03 · Otomatik dönen içerik duraklatılamıyor (WCAG 2.2.2, Seviye A)
**Departman:** Erişilebilirlik · **Kanıt:** `app/page.tsx:70` (4sn hero) ve `:81` (5sn yorum döngüsü)

Hero görselleri 4 saniyede bir, güven şeridindeki yorum 5 saniyede bir otomatik değişiyor.
Duraklat/durdur kontrolü yok ve `prefers-reduced-motion` koruması bu iki döngüyü **kapsamıyor**
(mevcut koruma yalnızca kaydırma animasyonlarını kapsıyor, `app/page.tsx:16`).

WCAG 2.1'de 5 saniyeden uzun süren otomatik hareket için duraklatma imkânı **Seviye A** gerekliliğidir —
yani en temel seviye. Vestibüler rahatsızlığı, dikkat eksikliği veya yavaş okuyan kullanıcıları doğrudan etkiler.

**Öneri:** (a) `prefers-reduced-motion: reduce` durumunda her iki `setInterval` da çalışmasın,
(b) hero'ya küçük bir duraklat/oynat düğmesi eklensin. ~30 dakikalık iş.

---

## 🟠 YÜKSEK

### Y-01 · WhatsApp tıklamaları ölçülmüyor — dönüşüm oranı bilinmiyor
**Departman:** Pazarlama/Analitik · **Kanıt:** kodda hiçbir olay (event) takibi yok

Vercel Analytics yalnızca sayfa görüntüleme sayıyor. Sitenin **tek** dönüşüm noktası WhatsApp butonları
ve bunlara kaç kez tıklandığı hiçbir yerde kaydedilmiyor. Şu anda "100 ziyaretçiden kaçı iletişime geçti"
sorusunun cevabı yok — yani hangi sayfanın, hangi yazının iş getirdiğini göremiyorsunuz.

**Öneri:** Vercel Analytics'in özel olay (custom event) fonksiyonu ile her WhatsApp bağlantısına
`track('whatsapp_click', { source: 'hero' | 'form' | 'footer' | 'blog' })` eklenmesi. Sunucu tarafı veri
saklamaz, gizlilik politikanızla çelişmez. ~1 saat.

### Y-02 · Rusça sayfalar sitemap'te yok ve hreflang ağı asimetrik
**Departman:** SEO · **Kanıt:** `app/sitemap.ts` içinde "ru" geçmiyor; `app/layout.tsx:12` ve `app/de/layout.tsx:6` yalnızca en+de tanımlıyor

`app/ru/` altında sayfalar mevcut ama:
- Hiçbiri sitemap'te değil → Google'ın keşfetmesi için sinyal yok
- EN ve DE sayfaları hreflang'de Rusça'yı göstermiyor; sadece `/ru` üçünü birden gösteriyor.
  Google karşılıklı olmayan hreflang bildirimlerini yok sayar → üç dilin hiçbiri fayda görmez.
- RU navigasyonundaki bağlantılar İngilizce sayfalara gidiyor (`/blogs`)

Yani Rusça sürüm şu an ne indeksleniyor ne de dil eşleşmesinden yararlanıyor — yapılan iş boşta duruyor.

**Öneri:** Rusça'yı ya tamamlayın (sitemap + karşılıklı hreflang + RU iç linkler) ya da geçici olarak
`noindex` verip Almanca gibi bitirdikten sonra açın. **Karar sizin** — hangisini istediğinizi söyleyin.

### Y-03 · Sosyal medya bağlantısı yok — hazır güven sinyali kullanılmıyor
**Departman:** Pazarlama · **Kanıt:** footer'da yalnızca WhatsApp; `layout.tsx` şemasında `"sameAs": []` boş

Aktif bir Instagram hesabınız var (@itineraryofturkiye) ama siteden hiçbir yerde linklenmiyor.
Yeni bir markaya güvenip güvenmeyeceğine karar veren ziyaretçi için canlı bir sosyal hesap,
sitedeki her metinden daha ikna edici olabilir. Aynı şekilde şemadaki `sameAs` dizisi boş —
Google'ın markanızı sosyal varlığınızla eşleştirmesi için doldurulması gereken alan.

**Öneri:** Footer'a Instagram ikonu + `sameAs: ["https://instagram.com/itineraryofturkiye"]`.
15 dakika, bedava güven.

### Y-04 · Yorumlarda gösterilen hizmetler "gelecek hizmet" olarak konumlanmış
**Departman:** Pazarlama/Uyumluluk · **Kanıt:** canlı ana sayfa — 4 yorumdan 2'si Emlak ve Yatırım kategorili; bu ikisi footer'da "Future Services" başlığı altında

Ana sayfada Alan G. "emlak anlaşması yaptım", Pawan K. "yatırım sürecinde yardım aldım" diyor.
Ama aynı sayfada Emlak ve Yatırım, henüz sunulmayan "Gelecek Hizmetler" olarak sınıflandırılmış.
Ziyaretçi açısından çelişkili: hizmet veriliyor mu, verilmiyor mu?

Ayrıca dört yorumun tamamında **★★★★★ derecelendirme** gösteriliyor. Şema işaretlemesi bilinçli olarak
eklenmemiş (D-21 kararı doğru), ancak görsel yıldızlar duruyor. Birleşik Krallık'ta 2025'te yürürlüğe giren
tüketici mevzuatı, doğrulanamayan veya yanıltıcı değerlendirmelerde ceza öngörüyor ve hedef pazarlarınızdan
biri Birleşik Krallık.

**Öneri:** (a) Yorumların kaynağı (tarih, kanal, izin) dosyalanmalı — sizde varsa sorun yok, kayıt altına alalım;
(b) Emlak/Yatırım çelişkisi için ya bu iki yorum "geçmiş çalışmalar" olarak etiketlensin ya da hizmet
konumlandırması netleştirilsin. **Uzman hukukçu teyidi önerilir.**

---

## 🟡 ORTA

### O-01 · Form etiketleri girdilere bağlı değil (WCAG 3.3.2 / 4.1.2)
**Kanıt:** `app/page.tsx:1071-1121` — 6 adet `<label>`, sıfır `htmlFor`, girdilerde `id` yok

Ekran okuyucu kullanan biri forma geldiğinde alanların ne olduğunu duymuyor; ayrıca etikete tıklayınca
alan odaklanmıyor. Hata mesajları da `role="alert"` veya `aria-describedby` olmadan yazılıyor
(WCAG 3.3.1) ve 11px kırmızı metin olarak görünüyor — hem küçük hem kontrastı sınırda.

**Öneri:** Her girdiye `id`, her etikete `htmlFor`, hata `<span>`lerine `role="alert"` ve
`aria-describedby` bağı. Hata metni 13px'e çıkarılsın. ~45 dakika.

### O-02 · Altın rengi metin açık zeminde kontrast bırakmıyor (WCAG 1.4.3)
**Kanıt:** `--gold: #c9a96a` (`app/page.tsx:286`); beyaz zeminde kontrast ≈ **2,3:1** (gerekli: 4,5:1 normal, 3:1 büyük metin)

Altın renk koyu lacivert zeminde mükemmel (≈7,3:1), ancak açık/krem zeminlerde başlık vurguları
ve "Read the guide →" bağlantıları için kullanıldığında okunabilirlik sınırın belirgin altında kalıyor.
Ayrıca `--muted: #647889` krem zeminde ≈4,4:1 ile sınırda.

**Öneri:** Açık zeminlerde daha koyu bir altın tonu (ör. `#9a7c3f` ≈ 4,6:1) kullanan bir varyant
tanımlansın; koyu zeminde mevcut ton korunsun. Marka görünümü değişmez, okunabilirlik geçer.
Bu, gerçek cihazda görsel kontrolle birlikte yapılmalı.

### O-03 · Almanca sayfaların sosyal paylaşım kartı İngilizce
**Kanıt:** canlı `/de` → `og:locale: en_US`, `og:title`/`og:description` İngilizce, `og:url` kök adrese işaret ediyor

Bir Alman kullanıcı `/de` sayfasını WhatsApp veya LinkedIn'de paylaştığında karşıya İngilizce başlık
ve İngilizce açıklama gidiyor, link de kök adrese çıkıyor. Almanca içerik üretimine harcanan emeğin
paylaşım anında geri dönmediği nokta.

**Öneri:** `app/de/layout.tsx` içine Almanca `openGraph` bloğu (`locale: 'de_DE'`, DE başlık/açıklama,
`url: /de`). ~20 dakika. Aynısı RU için de gerekli.

### O-04 · Blog yazılarında yazar/uzman imzası yok
**Kanıt:** `app/blogs/[slug]/page.tsx:79` — şema yazarı "Organization", sayfada isim/biyografi/inceleyen yok

26 yazının önemli kısmı tıbbi konularda. Google'ın sağlık içeriği için beklediği güven sinyalleri
(kimin yazdığı, kimin tıbben incelediği) sitede yok. Rakip klinik siteleri bunu giderek daha çok
kullanıyor. Bu, sıralamada orta vadede fark yaratan bir eksik.

**Öneri:** İki adım: (1) yazılara "Itinerary of Türkiye danışmanlık ekibi tarafından hazırlanmıştır"
imzası + kısa ekip kutusu; (2) partner kliniklerden bir hekimin tıbbi inceleme imzası (Eylül'de gerçek
partnerler siteye eklenirken birlikte yapılabilir). Tıbbi inceleme iddiası **yalnızca gerçekten
yapılırsa** yazılmalı.

---

## 🟢 KÜÇÜK / HIZLI

| # | Bulgu | Kanıt | Öneri |
|---|---|---|---|
| D-01 | `meta keywords` etiketi hâlâ var | canlı EN + DE | Google 2009'dan beri yok sayıyor; kaldırılabilir |
| D-02 | Hero nokta göstergeleri 6×6 px | `app/page.tsx:390` | Dokunma hedefi çok küçük; görünmez dolgu ile 24×24'e çıkarılsın |
| D-03 | Görseller `next/image` yerine düz `<img>` | kodda `next/image` kullanımı: 0 | Mobil LCP kazancı; Q-02 olarak zaten kayıtlı |
| D-04 | Şemada adres yalnızca "TR" | `app/layout.tsx` | Impressum işiyle birlikte tam adres eklenebilir |

---

## Doğru Yapılmış — Bozmayın

- Hassas veri uyarısı üç ayrı yerde ve WhatsApp mesajının içinde: mevzuat açısından doğru kurgu
- "Keine Garantien / No Guarantees" bölümü: sağlık turizminde nadiren görülen dürüst bir konumlandırma
- Sunucu tarafı form yok, çerez yok: gizlilik politikasıyla kodun birebir uyumlu olması denetlenebilirlik demek
- Sayısal iddiaların temizlenmiş olması (D-17)
- 26 EN + 26 DE yazı, karşılıklı hreflang ve iç link ağı
- Blogda "indicative ranges" ve Almanca "unverbindliche Richtwerte" dili

---

## Önerilen Sıra

**Bugün (hızlı ve risksiz):** Y-03 Instagram linki + sameAs · D-01 meta keywords · O-03 DE OG etiketleri
**Bu hafta:** K-03 duraklatma kontrolü · K-02 Almanca kalıntı temizliği · Y-01 WhatsApp olay takibi · O-01 form etiketleri
**Karar gerektiren:** K-01 Impressum (e-posta/telefon + avukat) · Y-02 Rusça (tamamla mı, beklet mi) · Y-04 yorum kaynakları
**Eylül'e planlanan:** O-04 yazar/inceleyen imzaları (gerçek partnerlerle birlikte)

---

## Bu Denetimin Sınırları

- Gerçek cihazda test yapılmadı (iPhone/Android) — Q-01 hâlâ açık
- Lighthouse performans ölçümü çalıştırılmadı — sayısal skor verilmedi
- Ekran okuyucu ile manuel test yapılmadı; erişilebilirlik bulguları koddan çıkarıldı
- Kontrast oranları renk değerlerinden hesaplandı, ekrandan ölçülmedi
- Hukuki maddeler risk işareti niteliğindedir, hukuki görüş değildir; uzman teyidi gerekir
