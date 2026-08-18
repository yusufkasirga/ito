# STATUS — Itinerary of Türkiye
**Tarih:** 2026-07-16 · **Hazırlayan:** Claude (Program Yönetimi)
**Kaynaklar:** git geçmişi, docs/pre-launch-checklist.md (2026-07-03), karar kaydı, QA raporu, Nisan–Haziran Claude konuşmaları.

## 1. Proje kimliği
- **Ürün:** itineraryofturkiye.com — Türkiye'ye gelen yabancılara premium danışmanlık sitesi.
- **Birincil yolculuklar:** Medical Travel + Private Türkiye Experiences (D-06). Business/Investment yalnız footer'daki /future-services sayfasında.
- **Hedef kitle:** Orta-üst ve varlıklı yabancı müşteri (B2C + B2B), EN dili.
- **Lead akışı:** Yalnız WhatsApp (sunucu tarafında hiçbir veri saklanmaz — D-02, bilinçli tasarım).

## 2. Teknik durum
- Next.js 16.2.4, React 19, Tailwind 4, TypeScript. Tüm rotalar statik/SSG.
- Vercel deploy: ito-rust.vercel.app · Canonical URL'ler itineraryofturkiye.com'a çevrildi (commit 9d248bb).
- Sayfalar: `/`, `/about`, `/services`, `/blogs` (+3 yazı), `/testimonials`, `/future-services`, sitemap, robots. QA: 0 kırık link, tüm rotalar 200 (2026-07-03 raporu).
- WhatsApp numarası env değişkeninde (`NEXT_PUBLIC_WHATSAPP_E164_NUMBER`), kodda yok.
- Git durumu temiz; son işler premium görsel katman (aurora hero, 3D slider).

## 3. Tamamlananlar (özet)
İçerik yerleşimi ve logo · güven odaklı revizyon (şeffaflık, gerçek yorum, 4 soruluk form) · erişilebilirlik katmanı (D-08) · SEO/JSON-LD (Article, FAQPage, BreadcrumbList) · OG görseli · sahte canlı sayaç kaldırıldı (D-03) · stok yüz fotoğrafları yerine isim rozetleri (D-15) · hassas veri uyarıları 3 noktada (D-04).

## 4. Açık işler (pre-launch-checklist ile eşleşir)
| Öncelik | Madde | Durum |
|---|---|---|
| 🔴 Kritik | C-06 Hukuki sayfalar (Privacy, Terms, Impressum) | Yok — EU/UK müşterisi öncesi zorunlu. Taslak paketi: docs/legal/ |
| ✅ Kapandı (16 Tem) | C-03 Kaynaksız sayısal iddialar | Yumuşatıldı/kaldırıldı — D-17, claims-audit.md |
| ✅ Kapandı (16 Tem) | P-04 Pexels hotlink görseller | 16 asset self-host; ölü hero slaytı kaldırıldı — D-18 |
| 🟠 Yüksek | P-01 Vercel env'e WhatsApp numarası | Sahip aksiyonu (Vercel panosu) |
| 🟠 Yüksek | P-03 WhatsApp Business hattı hazır/bakımlı mı | Sahip aksiyonu |
| 🟠 Yüksek | C-05 Medikal iddia uyum taraması (HWG/ASA) | Ücretli trafik öncesi şart |
| 🟡 Orta | Q-01..Q-05 Final QA (gerçek cihaz, Lighthouse, VoiceOver, konsol) | Görsel işi sonrası |
| 🟡 Orta | A-01 Analytics kararı (çerezsiz öneri: Plausible/Vercel) | Sahip kararı |
| ✅ Kapandı (16 Tem) | C-04 "Verified Client" ibaresi | "Client Story" yapıldı — D-17 |
| ⚪ Sonra | Çoklu dil (AR/TR), yeni içerik, klinik doğrulama sistemi | Roadmap'te |

## 5. Riskler
- **Hukuk/uyum (Yüksek):** Hukuki sayfa yokluğu + kaynaksız medikal iddialar; EU/UK hedefleniyorsa tüketici koruma ve reklam mevzuatı riski. Uzman hukukçu onayı şart (Legal eklentisi kurulu değil; yalnız inceleme paketi hazırlanır).
- **Görsel lisans/performans (Orta):** Pexels hotlink — erişilebilirlik ve lisans kontrolü bizde değil; LCP performansını da düşürüyor.
- **Tek kanal intake (Orta):** WhatsApp hattı kesilirse lead akışı durur; yedek kanal (e-posta) düşünülmeli.

## 6. Sonraki adım önerisi
1) Sahip kararları: C-03 iddiaları (kanıt ver / yumuşat / kaldır), C-04 ibare, A-01 analytics.
2) Görsel değişimi uygula → Q-02 Lighthouse.
3) Hukuki taslaklar avukat onayından sonra siteye eklenir.
4) P-01/P-03 sahip tarafından Vercel/WhatsApp'ta tamamlanır → final QA → yayın onayı.
