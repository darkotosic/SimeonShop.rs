import type { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { getCategories, getProducts, type Category, type ProductListResponse } from '@/lib/api';

export const metadata: Metadata = { title: 'Proizvodi', description: 'Pregled Simeon Shop proizvoda sa filterima, kategorijama i sortiranjem.' };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

async function loadCatalog(params: Record<string, string | undefined>): Promise<{ products: ProductListResponse; categories: Category[] } | null> {
  try { const [products, categories] = await Promise.all([getProducts(params), getCategories().catch(() => [])]); return { products, categories }; } catch { return null; }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const params = { q: first(raw.q), category: first(raw.category), min_price: first(raw.min_price), max_price: first(raw.max_price), sort: first(raw.sort), page: first(raw.page) };
  const catalog = await loadCatalog(params);
  if (!catalog) return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeader eyebrow="Shop" title="Proizvodi" description="Katalog trenutno nije dostupan. Pokušajte kasnije." /><div className="mt-8 border border-amber-200 bg-amber-50 p-6 text-amber-900">Katalog trenutno nije dostupan. Pokušajte kasnije.</div></main>;
  return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeader eyebrow="Shop" title="Proizvodi" description="Katalog garderobe dostupan za poručivanje preko web sajta, Instagrama i Facebook kanala." /><div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]"><ProductFilters categories={catalog.categories} searchParams={params} /><div><ProductGrid products={catalog.products.items} />{catalog.products.pages > 1 && <p className="mt-6 text-sm text-slate-600">Strana {catalog.products.page} od {catalog.products.pages}</p>}</div></div></main>;
}
