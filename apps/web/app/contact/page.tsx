import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Kontakt',
  alternates: { canonical: '/contact' },
  description: 'Kontakt podaci za Simeon Shop.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title="Kontakt" description="Za pitanja o proizvodima i porudžbinama kontaktirajte nas direktno." />
      <div className="mt-8 border border-slate-200 bg-white p-6 text-slate-700">
        <p>Email: dev@simeonshop.rs</p>
        <p className="mt-2">Telefon: +381 00 000 000</p>
      </div>
    </main>
  );
}
