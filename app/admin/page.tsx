import type { Metadata } from 'next';
import AdminPanel from './AdminPanel';
import { adminConfigured, isAdmin } from '@/lib/admin-server';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Başvuru yönetimi — Itinerary of Türkiye',
  description: 'Itinerary of Türkiye özel yönetim alanı.',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/admin', languages: {} },
};

export default async function AdminPage() {
  return <AdminPanel configured={adminConfigured()} initialAuthenticated={await isAdmin()} />;
}
