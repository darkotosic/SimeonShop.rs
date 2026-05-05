import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'O nama',
  description: 'Informacije o Simeon Shop brendu.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        title="O nama"
        description="Simeon Shop gradi moderan online kanal prodaje fokusiran na kvalitetnu garderobu, brzu isporuku i jednostavnu porudzbinu."
      />
    </main>
  );
}
