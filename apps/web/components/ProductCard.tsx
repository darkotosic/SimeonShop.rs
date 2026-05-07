import Link from 'next/link';
import type { Product } from '@/lib/api';
import { AddToCartButton } from './AddToCartButton';
import { Price } from './Price';

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.find((img) => img.is_primary)?.image_url ?? product.images?.[0]?.image_url ?? product.image_url;
  const stock = product.effective_stock_quantity ?? product.stock_quantity;
  return (
    <article className="flex h-full flex-col border border-slate-200 bg-white">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] bg-slate-100">
        {image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">Slika proizvoda uskoro</div>}
        {stock <= 0 && <span className="absolute left-3 top-3 bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Nema na stanju</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-slate-500">{product.category?.name ?? product.sku}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 text-lg font-semibold text-primary hover:underline">{product.name}</Link>
        {product.short_description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.short_description}</p>}
        <p className="mt-3 font-bold"><Price cents={product.price_cents} currency={product.currency} /></p>
        <div className="mt-auto pt-4"><AddToCartButton product={product} variants={[]} /></div>
      </div>
    </article>
  );
}
