# Hukuki İnceleme Paketi (C-06)
**Tarih:** 2026-07-16 · **Durum:** TASLAK — ⚠️ **Bu paket hukuki görüş değildir. Aşağıdaki taslaklar yayınlanmadan önce KVKK/GDPR ve sağlık turizmi mevzuatına hâkim bir avukat tarafından incelenmeli ve onaylanmalıdır.** Onay öncesi siteye eklenmeyecektir.

## Avukat onayı gereken kritik noktalar
1. **Şirket kimliği:** Veri sorumlusu/işletmeci tüzel kişilik (unvan, adres, MERSİS/vergi no) — taslaklarda `[COMPANY]` alanları. Şirket henüz kurulmadıysa bu, lansman öncesi ayrı bir engel.
2. **Roller:** Site bir **aracı/danışmanlık** hizmetidir; sağlık hizmeti sunucusu değildir. Sorumluluk sınırlaması ifadesinin TR + hedef ülke hukukunda geçerliliği.
3. **KVKK + GDPR birlikte uygulanması:** EU/UK ziyaretçi hedeflendiği için GDPR Art. 3(2) kapsamı; KVKK aydınlatma metni ayrıca gerekir mi?
4. **WhatsApp intake:** Kişisel veri Meta üzerinden akar; ortak sorumluluk/aktarım analizi. Sitede veri saklanmadığı doğru, ancak WhatsApp Business + Kommo CRM tarafındaki işleme için aydınlatma gerekir.
5. **Sağlık verisi:** Form hassas veri toplamıyor ve kullanıcı uyarılıyor; yine de kullanıcı kendiliğinden sağlık bilgisi yazarsa izlenecek prosedür (özel nitelikli veri).
6. **Impressum:** DE trafiği hedefleniyorsa TMG §5 benzeri işletme künyesi sayfası gerekli mi?
7. **Tüketici hakları:** Hizmet satışı site üzerinden yapılmıyor (ödeme yok) — mesafeli satış mevzuatı şimdilik kapsam dışı; ileride rezervasyon/ödeme eklenirse yeniden değerlendirilmeli.

---

## TASLAK A — Privacy Policy (EN, /privacy)

**Privacy Policy — Itinerary of Türkiye**
*Last updated: [DATE] — DRAFT, pending legal review*

**Who we are.** [COMPANY LEGAL NAME], [address, registration no] ("we") operates itineraryofturkiye.com. Contact: [EMAIL]. We act as data controller for the processing described below. *(⚠️ avukat: KVKK veri sorumlusu + GDPR temsilci gerekliliği)*

**What this website does NOT collect.** Our website has no accounts, no server-side forms, no cookies for tracking, and no analytics *(A-01 kararı sonrası güncellenecek)*. The application form on this site prepares a message in your browser only; nothing you type is stored on our servers.

**WhatsApp contact.** If you choose to contact us, your message is transmitted via WhatsApp (Meta Platforms Ireland Ltd.) under WhatsApp's own terms and privacy policy. We receive your name, phone number and message content, and manage conversations in our CRM ([Kommo]) to respond to your inquiry. Legal basis: steps prior to entering a contract (GDPR Art. 6(1)(b)) and legitimate interest (Art. 6(1)(f)). *(⚠️ avukat: Kommo/360dialog veri işleme sözleşmeleri ve yurt dışı aktarım)*

**Please do not send sensitive data.** Do not send medical reports, photos, passport documents or payment details via the form or chat. If you share health information voluntarily, we use it only to arrange the consultation you requested and delete it when no longer needed. *(⚠️ avukat: özel nitelikli veri açık rıza prosedürü)*

**Hosting.** The site is hosted on Vercel; standard server logs (IP address, user agent) may be processed briefly for security and delivery. *(⚠️ avukat: Vercel DPA / aktarım mekanizması)*

**Retention.** Conversation records are kept for [X months/years] and then deleted. *(⚠️ sahip + avukat: süre belirlenecek)*

**Your rights.** Depending on your location, you may have rights to access, correct, delete, restrict or port your data, and to object (GDPR Art. 15–21; KVKK m.11). Contact [EMAIL]. You may lodge a complaint with your supervisory authority (in Türkiye: KVKK; in the EU: your local DPA; in the UK: ICO).

**Changes.** We will post updates on this page.

---

## TASLAK B — Terms of Service (EN, /terms)

**Terms of Service — Itinerary of Türkiye**
*Last updated: [DATE] — DRAFT, pending legal review*

1. **Who we are.** [COMPANY LEGAL NAME] provides consultancy and coordination services for visitors to Türkiye (travel experiences, medical travel facilitation, and related services on request).
2. **We are not a healthcare provider.** ⚠️ We do not provide medical advice, diagnosis or treatment. All medical services are delivered by independent licensed clinics and physicians in Türkiye under their own responsibility and terms. Any decision about treatment is between you and the treating clinic. *(⚠️ avukat: aracılık sorumluluk sınırının TR/EU/UK'de geçerliliği — kritik madde)*
3. **Informational content.** Content on this site (including blog articles and indicative price ranges) is general information, not an offer or guarantee. Prices, availability and outcomes vary by case and provider.
4. **No online booking or payment.** This website does not process bookings or payments. Any engagement is agreed separately in writing. *(İleride değişirse bu bölüm yeniden yazılmalı.)*
5. **Liability.** To the extent permitted by law, we are not liable for services rendered by third-party providers, nor for indirect or consequential losses. Nothing limits liability that cannot be limited by law. *(⚠️ avukat)*
6. **Intellectual property.** Site content and branding belong to [COMPANY] or its licensors; do not reuse without permission.
7. **Governing law & disputes.** These terms are governed by the laws of the Republic of Türkiye; courts of [Istanbul] have jurisdiction, without prejudice to mandatory consumer protections in your country of residence. *(⚠️ avukat)*
8. **Contact.** [COMPANY, address, email].

---

## TASLAK C — İşletme künyesi (/imprint — DE trafiği hedefleniyorsa)
Alanlar: işletme unvanı, adres, temsilci, e-posta, telefon, ticaret sicil/MERSİS, vergi no, (varsa) TÜRSAB/sağlık turizmi yetki belgesi no. *(⚠️ avukat: sağlık turizmi aracı kuruluş yetki belgesi (Sağlık Bakanlığı) gerekip gerekmediği — kritik soru)*

---

## Uygulama planı (onay sonrası)
1. Avukat onaylı metinler `/app/privacy/page.tsx`, `/app/terms/page.tsx` (+ gerekirse `/imprint`) olarak eklenir; footer'a linklenir; sitemap güncellenir.
2. Analytics eklenirse (A-01) Privacy Policy güncellenir; Meta Pixel eklenirse consent banner zorunlu olur (A-02 ile birlikte karar).
3. Checklist C-06 kapatılır ve karar kaydına işlenir.
