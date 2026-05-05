import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Pregled proizvoda u korpi i ukupne cene porudzbine.',
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title="Korpa" description="MVP prikaz korpe sa prostorom za kolicine, uklanjanje i dostavu." />
      <div className="mt-8 border border-slate-200 bg-white p-6">
        <p className="text-slate-600">Korpa je trenutno prazna.</p>
        <Link className="mt-6 inline-block bg-primary px-5 py-3 text-sm font-semibold text-white" href="/products">
          Nastavi kupovinu
        </Link>
      </div>
    </main>
  );
}
