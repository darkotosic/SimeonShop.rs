import type { Metadata } from 'next';
import { loadPublicStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = { title: 'Uslovi kupovine', description: 'Uslovi kupovine, plaćanja, dostave i prihvatanja porudžbine.', alternates: { canonical: '/terms-and-conditions' } };

export default async function TermsPage() {
  const settings = await loadPublicStoreSettings();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-700">
      <h1 className="text-4xl font-bold text-primary">Uslovi kupovine</h1>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Prodavac</h2>
        <p>{settings.company_name}</p>
        {settings.company_address && <p>{settings.company_address}</p>}
        {settings.company_registration_number && <p>Matični broj: {settings.company_registration_number}</p>}
        {settings.company_tax_id && <p>PIB: {settings.company_tax_id}</p>}
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Poručivanje i plaćanje</h2>
        <p>Porudžbina se kreira kroz checkout i čuva se sa artiklima, količinama i pravnim tragom prihvatanja ovih uslova.</p>
        <p>Plaćanje je trenutno pouzećem, prilikom preuzimanja pošiljke.</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Dostava, zamene i reklamacije</h2>
        <p>{settings.delivery_note}</p>
        <p>{settings.return_policy_short}</p>
        <p>Za sve upite koristite {settings.store_email} {settings.store_phone ? `ili ${settings.store_phone}` : ''}.</p>
      </section>
    </main>
  );
}
