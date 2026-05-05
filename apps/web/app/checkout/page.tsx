import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Checkout forma za porudzbine pouzecem.',
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title="Checkout" description="Prva MVP faza podrzava placanje pouzecem." />
      <form className="mt-8 grid gap-4 border border-slate-200 bg-white p-6 sm:grid-cols-2">
        {['Ime i prezime', 'Telefon', 'Email', 'Grad', 'Postanski broj', 'Adresa'].map((label) => (
          <label key={label} className="text-sm font-medium text-slate-700">
            {label}
            <input className="mt-2 w-full border border-slate-300 px-3 py-3 outline-none focus:border-primary" />
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Napomena
          <textarea className="mt-2 min-h-28 w-full border border-slate-300 px-3 py-3 outline-none focus:border-primary" />
        </label>
        <button className="bg-primary px-5 py-3 text-sm font-semibold text-white sm:col-span-2">
          Posalji porudzbinu
        </button>
      </form>
    </main>
  );
}
