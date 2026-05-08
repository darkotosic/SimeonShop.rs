import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';
import { loadPublicStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = {
  title: 'Kontakt',
  alternates: { canonical: '/contact' },
  description: 'Kontakt podaci za Simeon Shop.',
};

export default async function ContactPage() {
  const settings = await loadPublicStoreSettings();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title="Kontakt" description="Za pitanja o proizvodima i porudžbinama kontaktirajte nas direktno." />
      <div className="mt-8 space-y-3 border border-slate-200 bg-white p-6 text-slate-700">
        {settings.store_email ? <p><strong>Email:</strong> {settings.store_email}</p> : <p>Kontakt email još nije podešen.</p>}
        {settings.store_phone && <p><strong>Telefon:</strong> {settings.store_phone}</p>}
        {settings.company_name && <p><strong>Prodavac:</strong> {settings.company_name}</p>}
        {settings.company_address && <p><strong>Adresa:</strong> {settings.company_address}</p>}
        {settings.company_registration_number && <p><strong>Matični broj:</strong> {settings.company_registration_number}</p>}
        {settings.company_tax_id && <p><strong>PIB:</strong> {settings.company_tax_id}</p>}
      </div>
    </main>
  );
}
