import type { Metadata } from 'next';
import { loadPublicStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = { title: 'Povraćaj i reklamacije', description: 'Pravila povraćaja, zamene i reklamacija za Simeon Shop.', alternates: { canonical: '/returns' } };

export default async function ReturnsPage() {
  const settings = await loadPublicStoreSettings();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Povraćaj i reklamacije</h1>
      <p className="mt-4 text-slate-700">{settings.return_policy_short}</p>
      <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-6 text-slate-700">
        <p>Za zamenu veličine, povraćaj ili reklamaciju javite nam se sa brojem porudžbine.</p>
        <p>Proizvod treba vratiti nekorišćen, u originalnom stanju, osim kada je u pitanju opravdana reklamacija.</p>
        <p>Kontakt: {settings.store_email} {settings.store_phone ? `• ${settings.store_phone}` : ''}</p>
      </div>
    </main>
  );
}
