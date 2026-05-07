import type { Product } from '@/lib/api';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="border border-slate-200 bg-white p-8 text-slate-600">Nema proizvoda za izabrane filtere.</div>;
  return <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</section>;
}
