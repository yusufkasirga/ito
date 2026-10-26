# Başvuru yönetim paneli

Güncelleme: 26 Ekim 2026. Panel adresi: `/admin`. Kullanıcı adı yoktur; yalnızca yönetici şifresiyle giriş yapılır. Ziyaretçiler hesap oluşturmaz. Başvurular **private Vercel Blob** içinde saklanır; bu özellik için Supabase projesi veya veritabanı kullanılmaz.

## Kurulum

1. Vercel'de `ito` projesinin **Storage → Create Storage → Blob** adımından erişimi **Private** olan bir store oluşturun veya bu özelliğe ayrılmış mevcut private store'u bağlayın. Public store kullanmayın.
2. Bağlantıyı **Production** ve **Preview** ortamlarına ekleyin. Mevcut SDK, Vercel üzerinde platformun OIDC kimliğini ve store bağlantısını kullanır; canlı ortam için manuel okuma/yazma anahtarı gerekmez. Bağlantının eklediği `BLOB_STORE_ID` ve `BLOB_WEBHOOK_PUBLIC_KEY` ayarlarını koruyun. Development erişimini yalnızca yerel test gerekiyorsa ekleyin. Gerçek başvurulara erişebilen Preview dağıtımlarını ve ekip erişimini koruyun.
3. Aynı ortamlarda iki yönetici sırrını ayarlayıp yeniden dağıtın. İlgili ortam değişkenleri:

| Değişken | İçerik |
| --- | --- |
| `BLOB_STORE_ID` | Store bağlantısının otomatik eklediği kimlik; Vercel OIDC yetkilendirmesiyle kullanılır |
| `BLOB_WEBHOOK_PUBLIC_KEY` | Vercel'in bağlantı sırasında eklediği platform ayarı; yönetici şifresi değildir |
| `ITO_ADMIN_PASSWORD_HASH` | `lib/admin-auth.mjs` içindeki `hashPassword` fonksiyonuyla üretilmiş scrypt özeti: `salt:key` biçiminde 32 hex karakter tuz ve 64 hex karakter türetilmiş anahtar |
| `ITO_ADMIN_SESSION_SECRET` | Kriptografik rastgele en az 32 bayt; örneğin `randomBytes(32).toString('hex')` ile üretilmiş gizli değer |
| `BLOB_READ_WRITE_TOKEN` | İsteğe bağlı, Vercel dışındaki yerel çalışma için gizli fallback; Vercel üzerinde zorunlu değildir |

Şifreyi güvenli bir parola yöneticisinde tutun. Düz metin şifreyi, hash üretim girdisini, session secret'ı, isteğe bağlı Blob anahtarını veya platformun OIDC token'ını Git'e, dokümana, PR'a veya herkese açık loglara eklemeyin. Bu sunucu değişkenlerinin hiçbirine `NEXT_PUBLIC_` prefix'i vermeyin. OIDC token'ını elle kopyalayıp sabitlemeyin; SDK platform kimliğini kendisi kullanır. Mevcut Web3Forms bildirim yapılandırması ayrı kalır; onun form anahtarı yönetici erişimi sağlamaz. Storage/erişim ayarları tamamlanmadan panelin etkin olduğunu söylemeyin.

## Günlük kullanım

- Şifreyle girişten sonra son oluşturulan veya güncellenen **200** kayıt yüklenir ve başvuru tarihine göre yeniden eskiye gösterilir. Arama, durum filtreleri ve sayaçlar yalnızca yüklenen bu kayıtları kapsar; tüm zamanlara ait analitik değildir.
- Durumlar: **Yeni**, **İletişime geçildi**, **Tamamlandı**. Ekip notu en fazla **5.000 karakterdir**; ödeme bilgisi, pasaport veya tıbbi belge eklemeyin.
- E-posta ve WhatsApp bağlantıları görüşmeyi başlatmak üzere ilgili uygulamayı açar; panel kendiliğinden mesaj göndermez.
- Yeni formlarda önce kalıcı başvuru kaydı oluşturulur, ardından Web3Forms e-posta bildirimi denenir. Bildirim ikincildir: e-posta hatası kaydedilmiş başvuruyu silmez. Kayıt başarısızsa form başarılı sayılmaz. Web3Forms yalnızca e-posta iletimi içindir; yönetim panelinin veri kaynağı değildir.
- Eski, yalnızca e-postaya iletilmiş formlar otomatik içe aktarılmaz. Test, yanlışlıkla gerçek müşteriye veya ekibe e-posta göndermeyecek şekilde yapılmalıdır.

Oturum HttpOnly cookie ile en fazla **8 saat** sürer. Çıkış mevcut tarayıcıdaki cookie'yi kaldırır. Tüm açık oturumları geçersiz kılmak için **hem şifre hash'ini hem session secret'ı değiştirin ve yeniden dağıtın**; yalnız şifre değişimi mevcut imzalı cookie'leri geçersiz kılmaz. Form kötüye kullanımına karşı uygulama ham IP'yi başvuru kaydına yazmaz; oran sınırlama için anahtarlı bir hash kullanır. Vercel'in altyapı logları ayrı bir veri işlemidir.

## Kota, saklama ve işletim

Vercel'in 26 Ekim 2026'da kontrol edilen belgelerinde Hobby için dahil Blob kotası aylık **1 GB depolama**, **10.000 basit işlem**, **2.000 gelişmiş işlem** ve **10 GB veri aktarımıdır**. Yükleme, listeleme ve store oluşturma gelişmiş işlem tüketir; paneli yenilemek ve Vercel dashboard işlemleri de kota tüketebilir. Hobby kotası aşılınca ek kullanım ücreti yerine Blob erişimi durur; sağlayıcıya göre yeniden kullanım için 30 gün beklemek gerekebilir. Pro planın ücretlendirmesi farklıdır. Planı veya ücretli seçeneği değiştirmeden önce onay alın; bu uygulama otomatik plan yükseltmez. Güncel durumu Vercel Usage ekranından izleyin. [Resmî kota ve fiyatlandırma](https://vercel.com/docs/vercel-blob/usage-and-pricing).

Panelin otomatik yedekleme, otomatik saklama süresi uygulama, dışa aktarma veya silme ekranı yoktur. Yetkili işletmeci gereken yedekleri private store'dan güvenli bir yere manuel almalı; gereksiz başvuru, not, ilgili e-posta ve yedekleri yayımlanan gizlilik politikasına göre manuel silmelidir. **Tamamlandı** durumu silme değildir; 200 kayıt görüntüleme sınırı da eski kayıtları silmez. Yedek ve silme işlemleri yapılmış gibi raporlanmamalı, gerçek işlem kaydı tutulmalıdır.

Sağlayıcı kurulumu: [Vercel Blob bağlantı ve ortam değişkenleri](https://vercel.com/docs/vercel-blob/using-blob-sdk). E-posta işleyişi: [Web3Forms FAQ](https://docs.web3forms.com/getting-started/faq).
