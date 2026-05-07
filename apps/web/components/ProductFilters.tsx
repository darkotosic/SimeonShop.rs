import type { Category } from '@/lib/api';

export function ProductFilters({ categories, searchParams }: { categories: Category[]; searchParams: Record<string, string | undefined> }) {
  return (
    <form className="space-y-4 border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-primary">Filteri</h2>
      <label className="block text-sm text-slate-700">Pretraga<input name="q" defaultValue={searchParams.q} className="mt-2 w-full border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm text-slate-700">Kategorija<select name="category" defaultValue={searchParams.category ?? ''} className="mt-2 w-full border border-slate-300 px-3 py-2"><option value="">Sve</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</select></label>
      <div className="grid grid-cols-2 gap-3"><label className="block text-sm text-slate-700">Min RSD<input name="min_price" defaultValue={searchParams.min_price} className="mt-2 w-full border border-slate-300 px-3 py-2" /></label><label className="block text-sm text-slate-700">Max RSD<input name="max_price" defaultValue={searchParams.max_price} className="mt-2 w-full border border-slate-300 px-3 py-2" /></label></div>
      <label className="block text-sm text-slate-700">Sortiranje<select name="sort" defaultValue={searchParams.sort ?? 'newest'} className="mt-2 w-full border border-slate-300 px-3 py-2"><option value="newest">Najnovije</option><option value="price_asc">Cena rastuće</option><option value="price_desc">Cena opadajuće</option><option value="name_asc">Naziv A-Z</option><option value="sort_order">Preporučeno</option></select></label>
      <button className="w-full bg-primary px-4 py-3 text-sm font-semibold text-white">Primeni filtere</button>
    </form>
  );
}
