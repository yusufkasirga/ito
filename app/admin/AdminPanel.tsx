'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import './admin.css';

type LeadStatus = 'new' | 'contacted' | 'closed';
type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  timeline: string;
  contact: string;
  locale: string;
  page: string;
  status: LeadStatus;
  notes: string;
  notification_status?: string;
};

const statuses: Record<LeadStatus, string> = { new: 'Yeni', contacted: 'İletişime geçildi', closed: 'Tamamlandı' };

function formatDate(value: string, short = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tarih belirtilmedi';
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: short ? 'short' : 'long', year: short ? undefined : 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul',
  }).format(date);
}

function Glyph({ name }: { name: 'inbox' | 'arrow' | 'search' | 'refresh' | 'lock' | 'logout' | 'check' | 'mail' | 'phone' }) {
  const paths: Record<string, ReactNode> = {
    inbox: <><path d="m4 5-2 9v5h20v-5l-2-9H4Z" /><path d="M2 14h6l2 3h4l2-3h6" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    refresh: <><path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    logout: <><path d="M9 4H4v16h5M10 12h11M17 8l4 4-4 4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    phone: <path d="M6 3H3c-1 9 9 19 18 18v-4l-5-2-2 2c-3-1-6-4-7-7l2-2-3-5Z" />,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Brand() {
  return <Link className="admin-brand" href="/"><span className="admin-brand-mark">İ</span><span>Itinerary <em>of Türkiye</em><small>YÖNETİM ALANI</small></span></Link>;
}

function LeadDetail({ lead, onSave, onExpired }: { lead: Lead; onSave: (lead: Lead) => void; onExpired: () => void }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const digits = lead.phone.replace(/\D/g, '');
  const changed = status !== lead.status || notes !== (lead.notes || '');

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !changed) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/admin/leads/${encodeURIComponent(lead.id)}`, {
        method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }), signal: AbortSignal.timeout(15000),
      });
      if (response.status === 401) { onExpired(); return; }
      const result = await response.json();
      if (!response.ok || !result.lead) throw new Error('save');
      onSave(result.lead);
      setMessage('Değişiklikler kaydedildi.');
    } catch {
      setError('Değişiklikler kaydedilemedi. Notların burada duruyor; tekrar deneyebilirsin.');
    } finally { setSaving(false); }
  }

  return <section className="admin-detail" aria-labelledby="lead-detail-title">
    <div className="admin-detail-heading"><span className="admin-eyebrow">BAŞVURU DETAYI</span><span className={`admin-status is-${lead.status}`}>{statuses[lead.status]}</span></div>
    <div className="admin-person"><span className="admin-avatar" aria-hidden="true">{(lead.name || '?').slice(0, 1).toLocaleUpperCase('tr-TR')}</span><div><h2 id="lead-detail-title">{lead.name || 'İsimsiz başvuru'}</h2><p>{formatDate(lead.created_at)} · Türkiye saati</p></div></div>
    <div className="admin-contact-actions">
      {lead.email && <a href={`mailto:${encodeURIComponent(lead.email)}`}><Glyph name="mail" /> E-posta yaz</a>}
      {digits.length >= 7 && digits.length <= 15 && <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer"><Glyph name="phone" /> WhatsApp’ta aç <span className="admin-sr-only">(yeni sekme)</span></a>}
    </div>
    <dl className="admin-fields">
      <div><dt>E-posta</dt><dd>{lead.email || 'Belirtilmedi'}</dd></div>
      <div><dt>Telefon</dt><dd>{lead.phone || 'Belirtilmedi'}</dd></div>
      <div><dt>Ülke</dt><dd>{lead.country || 'Belirtilmedi'}</dd></div>
      <div><dt>İlgilendiği hizmet</dt><dd>{lead.interest || 'Belirtilmedi'}</dd></div>
      <div><dt>Planlanan tarih</dt><dd>{lead.timeline || 'Belirtilmedi'}</dd></div>
      <div><dt>İletişim tercihi</dt><dd>{lead.contact || 'Belirtilmedi'}</dd></div>
      <div><dt>Form dili</dt><dd>{lead.locale ? lead.locale.toUpperCase() : 'Belirtilmedi'}</dd></div>
      <div><dt>Gönderildiği sayfa</dt><dd>{lead.page || 'Belirtilmedi'}</dd></div>
    </dl>
    {lead.notification_status === 'failed' && <p className="admin-notice">Başvuru kaydedildi; e-posta bildirimi iletilemedi. İletişimi buradan sürdürebilirsin.</p>}
    <form onSubmit={save} className="admin-detail-form">
      <label htmlFor="lead-status">Başvuru durumu</label>
      <select id="lead-status" value={status} onChange={event => { setStatus(event.target.value as LeadStatus); setMessage(''); }} disabled={saving}>
        {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <label htmlFor="lead-notes">Ekip notu <span>Yalnızca yönetim panelinde görünür</span></label>
      <textarea id="lead-notes" rows={4} maxLength={5000} placeholder="Görüşme özeti veya bir sonraki adım…" value={notes} onChange={event => { setNotes(event.target.value); setMessage(''); }} disabled={saving} />
      <p className="admin-field-help">Ödeme bilgisi veya tıbbi belge ekleme.</p>
      <div aria-live="polite">{error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="admin-success"><Glyph name="check" />{message}</p>}</div>
      <button className="admin-primary" type="submit" disabled={saving || !changed}>{saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}<Glyph name="check" /></button>
    </form>
  </section>;
}

export default function AdminPanel({ initialAuthenticated, configured }: { initialAuthenticated: boolean; configured: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(initialAuthenticated);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');

  function expireSession() {
    setAuthenticated(false);
    setLeads([]);
    setPassword('');
    setAuthMessage('Oturumun sona erdi. Devam etmek için tekrar giriş yap.');
  }

  useEffect(() => {
    if (!authenticated || !configured) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/leads', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
        if (!active) return;
        if (response.status === 401) { expireSession(); return; }
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.leads)) throw new Error('load');
        if (active) { setLeads(result.leads); setUpdatedAt(new Date().toISOString()); }
      } catch {
        if (active) setError('Başvurular yüklenemedi. Bağlantını kontrol edip tekrar dene.');
      } finally { if (active) setLoading(false); clearTimeout(timeout); }
    }
    void load();
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [authenticated, configured, revision]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);
    setAuthMessage('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('login');
      setPassword('');
      setAuthenticated(true);
    } catch { setAuthMessage('Giriş yapılamadı. Şifreni kontrol edip biraz sonra tekrar dene.'); }
    finally { setLoggingIn(false); }
  }

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin', signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('logout');
      window.location.reload();
    } catch { setError('Çıkış yapılamadı. Lütfen tekrar dene.'); setLoggingOut(false); }
  }

  const normalizedQuery = query.toLocaleLowerCase('tr-TR').trim();
  const visibleLeads = leads.filter(lead => (filter === 'all' || lead.status === filter) && (!normalizedQuery || [lead.name, lead.email, lead.phone, lead.country, lead.interest].join(' ').toLocaleLowerCase('tr-TR').includes(normalizedQuery)));
  const selected = visibleLeads.find(lead => lead.id === selectedId) || visibleLeads[0];

  if (!configured || !authenticated) return <main className="admin-shell admin-auth-shell" lang="tr">
    <div className="admin-auth-brand"><Brand /><Link className="admin-back-link" href="/">Siteye dön ↗</Link></div>
    <div className="admin-auth-layout">
      <div className="admin-auth-intro"><span className="admin-eyebrow">ITINERARY OF TÜRKİYE</span><h1>Her yolculuk,<br /><em>bir merhaba ile başlar.</em></h1><p>Yeni başvuruları tek yerden görüntüle, görüşmelerini takip et ve bir sonraki adımı planla.</p><div className="admin-auth-line" /><span className="admin-auth-caption">Kişiye özel deneyimler. Özenli iletişim.</span></div>
      <section className="admin-auth-card" aria-labelledby="admin-login-title"><span className="admin-lock"><Glyph name="lock" /></span><span className="admin-eyebrow">ÖZEL ERİŞİM</span><h2 id="admin-login-title">{configured ? 'Yönetim paneline giriş' : 'Panel hazırlanıyor'}</h2>
        {configured ? <><p>Başvuruları görüntülemek için yönetici şifreni gir.</p><form onSubmit={login}><label htmlFor="admin-password">Yönetici şifresi</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} disabled={loggingIn} /><div aria-live="polite">{authMessage && <p className="admin-error" role="alert">{authMessage}</p>}</div><button className="admin-primary" type="submit" disabled={loggingIn || !password}>{loggingIn ? 'Giriş yapılıyor…' : 'Güvenli giriş yap'}<Glyph name="arrow" /></button></form><div className="admin-auth-footnote"><Glyph name="lock" /><span>Yalnızca yetkili ekip üyeleri içindir.</span></div></> : <><p>Yönetim paneli henüz etkinleştirilmedi. Erişim ve başvuru kaydı hazır olduğunda burada giriş yapabileceksin.</p><p className="admin-muted">Daha önce yalnızca e-postaya gönderilen başvurular otomatik olarak aktarılmaz.</p><Link className="admin-primary" href="/">Siteye dön<Glyph name="arrow" /></Link></>}
      </section>
    </div><footer className="admin-auth-footer">Itinerary of Türkiye <span>·</span> Başvuru yönetimi</footer>
  </main>;

  return <main className="admin-shell admin-workspace" lang="tr">
    <aside className="admin-sidebar"><Brand /><div className="admin-sidebar-label">ÇALIŞMA ALANI</div><a className="admin-sidebar-current" href="#submissions" aria-current="page"><Glyph name="inbox" />Başvurular<span>{leads.length}</span></a><div className="admin-sidebar-bottom"><p>Bir sonraki yolculuğun<br />ilk adımı burada.</p><Link href="/" target="_blank" rel="noopener noreferrer">Siteyi görüntüle ↗<span className="admin-sr-only"> (yeni sekme)</span></Link><button type="button" onClick={logout} disabled={loggingOut}><Glyph name="logout" />{loggingOut ? 'Çıkış yapılıyor…' : 'Güvenli çıkış'}</button></div></aside>
    <div className="admin-main">
      <header className="admin-topbar"><span>YÖNETİM / BAŞVURULAR</span><span className="admin-private"><Glyph name="lock" />Özel çalışma alanı</span></header>
      <div className="admin-page-content"><div className="admin-page-heading"><div><span className="admin-eyebrow">İLETİŞİMİ TAKİP ET</span><h1>Başvurular</h1><p>Yeni tanışmalar, özenle planlanacak yolculuklar.</p></div><button type="button" className="admin-secondary admin-refresh" onClick={() => setRevision(value => value + 1)} disabled={loading}><Glyph name="refresh" />{loading ? 'Yükleniyor…' : 'Yenile'}</button></div>
        <div className="admin-metrics" aria-label="Yüklenen başvuruların özeti">{[{ label: 'Toplam başvuru', value: leads.length, type: 'total' }, { label: 'Yeni başvuru', value: leads.filter(lead => lead.status === 'new').length, type: 'new' }, { label: 'İletişime geçildi', value: leads.filter(lead => lead.status === 'contacted').length, type: 'contacted' }, { label: 'Tamamlandı', value: leads.filter(lead => lead.status === 'closed').length, type: 'closed' }].map(item => <div className={`admin-metric is-${item.type}`} key={item.type}><span>{item.label}</span><strong>{loading && !leads.length ? '—' : item.value}</strong><span className="admin-metric-dot" aria-hidden="true" /></div>)}</div>
        <div className="admin-load-note"><span>Son oluşturulan veya güncellenen 200 kayıt gösterilir. Sayılar yüklenen kayıtları kapsar.</span>{updatedAt && <span>Son yenileme: {formatDate(updatedAt, true)}</span>}</div>
        {error && <div className="admin-error admin-load-error" role="alert">{error}<button type="button" onClick={() => setRevision(value => value + 1)} disabled={loading}>Tekrar dene</button></div>}
        <section className="admin-inbox" id="submissions" aria-labelledby="submissions-heading" aria-busy={loading}>
          <div className="admin-inbox-toolbar"><h2 id="submissions-heading">Başvuru kutusu <span>{visibleLeads.length}</span></h2><div className="admin-search"><Glyph name="search" /><label className="admin-sr-only" htmlFor="admin-search">Ad, e-posta, telefon, ülke veya hizmet ara</label><input id="admin-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Başvurularda ara…" /></div></div>
          <div className="admin-filters" aria-label="Başvuru durumuna göre filtrele">{(['all', 'new', 'contacted', 'closed'] as const).map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'all' ? 'Tümü' : statuses[value]}</button>)}</div>
          {loading && !leads.length ? <div className="admin-empty" role="status"><span className="admin-empty-icon"><Glyph name="refresh" /></span><h3>Başvurular yükleniyor</h3><p>Başvuru kutun hazırlanıyor.</p></div> : !leads.length ? <div className="admin-empty"><span className="admin-empty-icon"><Glyph name="inbox" /></span><span className="admin-eyebrow">YENİ BİR BAŞLANGIÇ</span><h3>{error ? 'Başvurular şu anda görüntülenemiyor' : 'Henüz başvuru yok'}</h3><p>{error ? 'Yukarıdaki tekrar dene düğmesiyle yeniden yükleyebilirsin.' : 'Başvuru kaydı etkinleştirildikten sonra gönderilen yeni formlar burada görünecek.'}</p>{!error && <p className="admin-empty-note">Daha önce yalnızca e-postaya gönderilen formlar bu listeye otomatik aktarılmaz.</p>}</div> : !visibleLeads.length ? <div className="admin-empty"><span className="admin-empty-icon"><Glyph name="search" /></span><h3>Eşleşen başvuru yok</h3><p>Farklı bir arama veya durum filtresi deneyebilirsin.</p><button className="admin-secondary" onClick={() => { setQuery(''); setFilter('all'); }} type="button">Filtreleri temizle</button></div> : <div className="admin-inbox-grid"><div className="admin-lead-list" aria-label="Başvurular">{visibleLeads.map(lead => <button type="button" className={`admin-lead-row ${selected?.id === lead.id ? 'is-selected' : ''}`} key={lead.id} onClick={() => setSelectedId(lead.id)} aria-pressed={selected?.id === lead.id}><span className="admin-lead-row-top"><strong>{lead.name || 'İsimsiz başvuru'}</strong><time dateTime={lead.created_at}>{formatDate(lead.created_at, true)}</time></span><span className="admin-lead-service">{lead.interest || 'Genel başvuru'}</span><span className="admin-lead-row-bottom"><span className={`admin-status is-${lead.status}`}>{statuses[lead.status]}</span><span>{lead.country || lead.email || 'Ülke belirtilmedi'}</span><span aria-hidden="true">↗</span></span></button>)}</div>{selected && <LeadDetail key={`${selected.id}:${updatedAt}`} lead={selected} onSave={updated => setLeads(current => current.map(lead => lead.id === updated.id ? updated : lead))} onExpired={expireSession} />}</div>}
        </section>
        <footer className="admin-workspace-footer">Itinerary of Türkiye <span>·</span> Başvurular yalnızca yetkili ekip üyelerine görünür.</footer>
      </div>
    </div>
  </main>;
}
