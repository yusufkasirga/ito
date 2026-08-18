# "100.000$ Görünüm" Değerlendirmesi — Tasarım Konseyi
**Tarih:** 2026-07-17 · Katılım: Tasarım/UX (design-taste-frontend kriterleri), Pazarlama, CEO
**Soru:** Bu site ile gerçek bir 100K$ ajans işi arasındaki fark nedir? Dürüst envanter + öncelikli kapatma planı.

## Dürüst durum tespiti
Kod/yapı tarafında (SEO, şema, performans altyapısı, responsive, erişilebilirlik) site şimdiden üst segmentte. 100K$ hissini ayıran şey kod değil, **özgün varlıklar ve kanıt katmanı**. Stok fotoğraf + hazır font + tek dil kombinasyonu, ne kadar iyi yerleştirilirse yerleştirilsin "şablon üstü ama ajans altı" algısı bırakır.

## Fark yaratan 8 kalem (öncelik sırasıyla)

**P1 — Algıyı en çok taşıyanlar**
1. **Özgün görsel prodüksiyon.** 100K$ sitelerin %80 farkı budur: kendi çekimlerimiz — İstanbul/Kapadokya'da marka renk paletiyle çekilmiş kareler, ekibin gerçek fotoğrafları, kısa (10-15 sn) hero video loop. Maliyet: 1-2 günlük çekim. Stok tamamen emekli olur.
2. **Logo ve marka kiti.** Mevcut logo (sarı-kırmızı amblem) sitenin lacivert-altın premium diliyle çelişiyor — sitenin en görünür "pahalı olmayan" sinyali. Profesyonel yeniden çizim (altın/lacivert, serif harf logosu) + favicon/OG seti. ⚠️ Sahip kararı gerektirir — marka değişikliği hassastır.
3. **Kanıt katmanı.** Gerçek vaka hikâyeleri (video testimonial idealde), partner klinik profilleri (doktor adı, akreditasyon belgesi görselleri), süreç sayfası ("bizimle 7 gün nasıl geçer"). Güven satan sitelerde en pahalı görünen şey gerçekliktir.

**P2 — İncelik katmanı**
4. **Tipografi yükseltmesi.** Playfair+Inter kombinasyonu skill'in "LLM default" listesinde. Lisanslı bir display font (ör. editorial bir serif ailesi + özgün sans) tek başına "ajans işi" hissi verir. Yıllık lisans ~200-400$.
5. **Motion imzası.** Sayfa geçiş animasyonları, sayılar için count-up, form adımlarında mikro-animasyonlar, özel 404. Mevcut scroll-reveal iyi; imza haline getirilmeli.
6. **Foto sanat yönetimi.** Tüm görsellere tek renk grade (lacivert-altın tonlama) — çekim yapılana kadar mevcut stoklara CSS filter ile yaklaşık uygulanabilir.

**P3 — Kapsam büyütenler**
7. **Çok dillilik.** AR (Körfez) + DE landing'leri; 100K$ uluslararası site tek dilli olmaz. (Roadmap Kasım'la uyumlu.)
8. **Akıllı kişiselleştirme.** Ülke algısına göre içerik vurgusu (UK ziyaretçisine dental/saç, Körfez'e estetik/yatırım) — statik sitede edge middleware ile mümkün.

## Ne YAPMAYACAĞIZ (konsey retleri)
- Sahte ekip fotoğrafı / stok "doktor" görselleri — güven işinde ölümcül.
- Ağır 3D/WebGL gösterişi — hedef kitle (hasta/gezgin) hız ve netlik istiyor.
- Şu aşamada tam site yeniden tasarımı — mevcut dil doğru, eksik olan varlıklar.

## Önerilen sıra ve yaklaşık efor
| Adım | Efor | Bağımlılık |
|---|---|---|
| Logo yeniden çizimi (3 konsept sunumu) | Ben taslak konseptleri hazırlarım → sahip seçer → tasarımcıya finalize | Sahip kararı |
| Çekim planı (shot list) hazırlığı | 1 saat (ben) | Sahip: fotoğrafçı bütçesi |
| Kanıt sayfaları iskeleti (process + partners) | 2-3 saat (ben) | Gerçek partner bilgisi |
| Renk grade CSS geçici çözümü | 1 saat (ben) | — |
| Font seçenekleri sunumu | 1 saat (ben) | Sahip: lisans onayı |

**Sonuç:** 100K$ görünümün yolu kod değil; (1) özgün görseller, (2) marka kiti, (3) gerçek kanıt. Üçü de sahip girdisi gerektirir; hazırlık işlerinin tamamını ekip üstlenebilir.
