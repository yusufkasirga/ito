# Sayısal İddia Denetimi (C-03 / C-05)
**Tarih:** 2026-07-16 · Her madde için sahip kararı gerekli: **[A] Kanıt sun** / **[B] Yumuşat** / **[C] Kaldır**.
Kural: Kanıtlanamayan iddia ücretli trafik başlamadan yayında kalmamalı.

> **GÜNCELLEME 2026-07-16 — UYGULANDI.** Sahip onayı ("sırayla tamamlayalım") ile önerilen seçenekler koda işlendi:
> #1 "1,200+" → "Verified — partner clinics screened..." [B] · #2 %98/96/97 rozetleri → "Verified Partner Clinics / Specialists" [C→B] · #3 "24/7" → "Replies within hours" [B] · #4 blog fiyatlarına gösterge niteliği dipnotu [B] · #5 "Verified Client" → "Client Story" [B].
> Build doğrulandı (compile + TS + 14 sayfa SSG). Sahip ileride gerçek rakam belgeleyebilirse [A]'ya dönülebilir. C-05 tam uyum taraması (hukukçu onayı) hâlâ açık.

## 1. "1,200+ Successful procedures completed with our partners"
- **Yer:** app/page.tsx ~satır 894 (Medical Tourism stat rozeti)
- **Risk:** Yüksek — doğrulanabilir kaynak repo'da yok; medikal bağlamda yanıltıcı reklam riski (UK ASA / DE HWG).
- **[B] önerisi:** "Trusted clinic partners across Istanbul & Antalya" (sayısız, doğru kalır) — ya da sahip gerçek sayıyı belgeleyip [A].

## 2. "%98 / %96 / %97 Satisfaction" rozetleri
- **Yer:** app/page.tsx satır 142–156 (medikal kategori kartları)
- **Risk:** Yüksek — memnuniyet yüzdesi, anket metodolojisi olmadan sağlık reklamı mevzuatında sorunlu.
- **[C] önerisi:** Rozetleri kaldır; yerine olgusal nitelik ("JCI-accredited partner clinics" — yalnız doğruysa).

## 3. "✓ Available 24/7" rozeti
- **Yer:** app/page.tsx satır 683
- **Risk:** Orta — operasyonel taahhüt; WhatsApp hattı 7/24 gerçekten yanıtlıyor mu?
- **Karar:** Gerçekse kalsın [A]; değilse "Replies within hours" ile hizala [B].

## 4. Saç ekimi fiyat aralıkları (€1,500–€3,500 vs £8,000–£15,000)
- **Yer:** app/blogs/blogData.ts satır 31 (cost-guide yazısı)
- **Risk:** Orta — fiyatlar savunulabilir olmalı; UK karşılaştırması ASA hassasiyeti taşır.
- **Karar:** Sahip aralıkların arkasında durduğunu teyit etmeli; "prices vary by clinic and case, figures are indicative (2026)" dipnotu önerilir [B].

## 5. "Verified Client" etiketi (testimonials)
- **Yer:** app/page.tsx (747, 870, 872), /testimonials
- **Durum:** Stok yüzler kaldırıldı (D-15) → isim rozetleri. Kalan karar: "Verified" kelimesi.
- **Risk:** Orta — doğrulama süreci tanımlı değilse etiket temelsiz.
- **Öneri:** Ya doğrulama tanımı yap (gerçek booking kaydı) [A] ya etiketi "Client Story" yap [B].

## 6. Diğer
- "200+" benzeri başka rozet taramada yalnız #1 ile ilişkili çıktı; yeni sayı eklenirken bu denetime tabi olmalı.
- Blog yazılarındaki "%98 graft survival" tipi klinik sonuç ifadeleri varsa C-05 taramasında ayrıca işaretlenecek (uzman/medikal danışman onayı gerekir).

## Uygulama notu
Kararlar verildikten sonra kod değişiklikleri tek commit'te yapılır ve bu belge RESOLVED işaretleriyle güncellenir. **Bu belge hukuki görüş değildir; C-05 kapsamındaki nihai değerlendirme uzman hukukçu onayı gerektirir.**
