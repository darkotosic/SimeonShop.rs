import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Proizvodi',
  description: 'Pregled Simeon Shop proizvoda sa osnovnim filterima i sortiranjem za MVP.',
};

const products = ['Premium majica', 'Oversized majica', 'Duks', 'Trenerka', 'Kacket', 'Torba'];

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Shop"
        title="Proizvodi"
        description="Skeleton za product listing sa prostorom za kategorije, cenu, pretragu, sortiranje i paginaciju."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-primary">Filteri</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Kategorija</p>
            <p>Cena</p>
            <p>Sortiranje: najnovije</p>
            <p>Pretraga</p>
          </div>
        </aside>
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <article key={product} className="border border-slate-200 bg-white">
              <div className="aspect-[4/5] bg-slate-200" />
              <div className="p-5">
                <p className="text-sm text-slate-500">SKU-SIM-{index + 1}</p>
                <h2 className="mt-1 text-lg font-semibold text-primary">{product}</h2>
                <p className="mt-2 font-bold">{(index + 2) * 1200} RSD</p>
                <button className="mt-4 w-full bg-primary px-4 py-3 text-sm font-semibold text-white">
                  Dodaj u korpu
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
