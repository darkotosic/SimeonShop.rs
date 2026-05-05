import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Politika privatnosti',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title="Politika privatnosti" description="Osnovni pravni skeleton za obradu podataka kupaca." />
      <p className="mt-8 text-slate-700">Detaljan tekst politike privatnosti treba uskladiti pre produkcije.</p>
    </main>
  );
}
