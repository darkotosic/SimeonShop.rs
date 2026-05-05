import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Uslovi koriscenja',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title="Uslovi koriscenja" description="Osnovni pravni skeleton za uslove kupovine i koriscenja sajta." />
      <p className="mt-8 text-slate-700">Finalni uslovi prodaje treba da pokriju dostavu, povrat i reklamacije.</p>
    </main>
  );
}
