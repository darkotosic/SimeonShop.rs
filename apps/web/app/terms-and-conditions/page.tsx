import type { Metadata } from 'next';
import { loadPublicStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = { title: 'Uslovi kupovine', description: 'Uslovi kupovine, plaćanja, dostave i prihvatanja porudžbine.', alternates: { canonical: '/terms-and-conditions' } };

export default async function TermsPage() {
  const settings = await loadPublicStoreSettings();
  const hasSellerDetails = Boolean(
    settings.company_name || settings.company_address || settings.company_registration_number || settings.company_tax_id,
  );
  const contact = [settings.store_email, settings.store_phone].filter(Boolean).join(' ili ');

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-700">
      <h1 className="text-4xl font-bold text-primary">Uslovi kupovine</h1>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Prodavac</h2>
        {hasSellerDetails ? (
          <>
            {settings.company_name && <p>{settings.company_name}</p>}
            {settings.company_address && <p>{settings.company_address}</p>}
            {settings.company_registration_number && <p>Matični broj: {settings.company_registration_number}</p>}
            {settings.company_tax_id && <p>PIB: {settings.company_tax_id}</p>}
          </>
        ) : (
          <p>Podaci o prodavcu trenutno nisu javno podešeni.</p>
        )}
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Poručivanje i plaćanje</h2>
        <p>Porudžbina se kreira kroz checkout i čuva se sa artiklima, količinama i pravnim tragom prihvatanja ovih uslova.</p>
        <p>Plaćanje je trenutno pouzećem, prilikom preuzimanja pošiljke.</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Dostava, zamene i reklamacije</h2>
        <p>{settings.delivery_note ?? 'Detalji dostave biće potvrđeni nakon obrade porudžbine.'}</p>
        <p>{settings.return_policy_short ?? 'Detalji povraćaja i reklamacija biće dostupni nakon potvrde sa podrškom.'}</p>
        {contact ? <p>Za sve upite koristite {contact}.</p> : <p>Kontakt podaci podrške još nisu podešeni.</p>}
      </section>
    </main>
  );
}
