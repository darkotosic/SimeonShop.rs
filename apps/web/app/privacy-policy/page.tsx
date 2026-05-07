import type { Metadata } from 'next';
import { loadPublicStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = { title: 'Politika privatnosti', description: 'Informacije o obradi podataka kupaca i kontaktima za privatnost.', alternates: { canonical: '/privacy-policy' } };

export default async function PrivacyPolicyPage() {
  const settings = await loadPublicStoreSettings();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-700">
      <h1 className="text-4xl font-bold text-primary">Politika privatnosti</h1>
      <p className="mt-4">Podatke kupaca koristimo za obradu porudžbine, dostavu, komunikaciju i ispunjenje zakonskih obaveza.</p>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Koje podatke obrađujemo</h2>
        <p>Ime i prezime, telefon, email ako je unet, adresu za dostavu, sadržaj porudžbine, IP adresu i user-agent zbog bezbednosti i pravnog traga poručivanja.</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Kontakt za privatnost</h2>
        <p>{settings.company_name}</p>
        <p>{settings.store_email} {settings.store_phone ? `• ${settings.store_phone}` : ''}</p>
      </section>
    </main>
  );
}
