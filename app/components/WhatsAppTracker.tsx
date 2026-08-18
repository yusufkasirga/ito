'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

/**
 * WhatsApp tıklama ölçümü (denetim bulgusu Y-01).
 *
 * Sitenin tek dönüşüm noktası WhatsApp bağlantıları. Bu bileşen tek bir
 * belge düzeyi dinleyici kurar; her wa.me bağlantısına ayrı ayrı onClick
 * eklemek gerekmez, yeni eklenen butonlar da otomatik kapsanır.
 *
 * Gizlilik: sunucuya kişisel veri gitmez. Yalnızca hangi bölümden tıklandığı,
 * sayfa yolu ve dil gönderilir — form içeriği veya kullanıcı bilgisi değil.
 * Bu, /privacy sayfasındaki "çerez ve sunucu tarafı form yok" beyanıyla uyumludur.
 */
export default function WhatsAppTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target as HTMLElement | null;
      const link = el?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!link) return;

      // Kaynak: önce açık etiket, sonra en yakın bölüm/landmark
      const explicit = link.closest('[data-wa-source]')?.getAttribute('data-wa-source');
      const section = link.closest('section')?.id;
      const landmark = link.closest('header') ? 'header'
        : link.closest('footer') ? 'footer'
        : link.closest('nav') ? 'nav'
        : null;
      const floating = link.classList.contains('wa-btn') ? 'floating-button' : null;

      const source = explicit || floating || section || landmark || 'other';

      const path = window.location.pathname;
      const locale = path.startsWith('/de') ? 'de' : path.startsWith('/ru') ? 'ru' : 'en';

      track('whatsapp_click', { source, locale, path });
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
