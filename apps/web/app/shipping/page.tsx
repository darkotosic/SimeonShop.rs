import type { Metadata } from 'next';
import { loadPublicStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = { title: 'Dostava', description: 'Informacije o dostavi i plaćanju pouzećem za Simeon Shop.', alternates: { canonical: '/shipping' } };

export default async function ShippingPage() {
  const settings = await loadPublicStoreSettings();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Dostava i plaćanje</h1>
      <p className="mt-4 text-slate-700">{settings.delivery_note ?? 'Detalji dostave biće potvrđeni nakon obrade porudžbine.'}</p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-700">
        <li>Plaćanje je trenutno organizovano pouzećem, pri preuzimanju pošiljke.</li>
        <li>Kontaktiramo vas ako je potrebna dodatna potvrda veličine, dostupnosti ili adrese.</li>
        <li>Trošak dostave se komunicira transparentno pre slanja.</li>
        <li>Checkout ostaje uspešan čak i ako opciona email potvrda trenutno nije dostupna.</li>
      </ul>
    </main>
  );
}
