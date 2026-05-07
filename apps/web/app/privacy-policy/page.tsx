import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = { title: 'Politika privatnosti', description: 'Template politike privatnosti za Simeon Shop.' };
const sections = ['Identitet prodavca', 'Podaci koji se obrađuju', 'Svrha obrade', 'Poručivanje', 'Dostava', 'Reklamacije', 'Povraćaj robe', 'Kontakt'];
export default function PrivacyPolicyPage() { return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeader title="Politika privatnosti" description="Radni template za transparentnu obradu podataka kupaca." /><p className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-amber-900">Finalni tekst uskladiti sa pravnim/licenciranim savetnikom pre javnog puštanja.</p><div className="mt-8 space-y-6">{sections.map((section) => <section key={section} className="border border-slate-200 bg-white p-5"><h2 className="text-xl font-semibold text-primary">{section}</h2><p className="mt-2 text-slate-700">Ova sekcija treba da opiše stvarne procese prodavca, podatke koji se prikupljaju, rokove čuvanja, prava kupaca i kanale za ostvarivanje prava.</p></section>)}</div></main>; }
