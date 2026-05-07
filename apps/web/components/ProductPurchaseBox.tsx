'use client';

import { useMemo, useState } from 'react';
import type { Product, ProductVariant } from '@/lib/api';
import { Price } from './Price';
import { AddToCartButton } from './AddToCartButton';

const variantLabel = (variant: ProductVariant) => [variant.size, variant.color].filter(Boolean).join(' / ') || variant.sku || `Varijanta ${variant.id}`;

export function ProductPurchaseBox({ product }: { product: Product }) {
  const activeVariants = useMemo(() => product.variants.filter((variant) => variant.is_active), [product.variants]);
  const [variantId, setVariantId] = useState<number | ''>('');
  const selectedVariant = activeVariants.find((variant) => variant.id === variantId);
  const stock = selectedVariant?.stock_quantity ?? product.effective_stock_quantity ?? product.stock_quantity;
  const price = selectedVariant?.price_cents ?? product.price_cents;
  const sku = selectedVariant?.sku ?? product.sku;
  const requiresVariant = activeVariants.length > 0;

  return (
    <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 p-5 text-sm text-slate-700">
      <div className="flex items-baseline gap-3">
        <p className="text-2xl font-bold text-slate-950"><Price cents={price} currency={product.currency} /></p>
        {product.compare_at_price_cents && <p className="text-slate-400 line-through"><Price cents={product.compare_at_price_cents} currency={product.currency} /></p>}
      </div>
      {requiresVariant && (
        <label className="block font-medium">
          Veličina / boja
          <select value={variantId} onChange={(event) => setVariantId(event.target.value ? Number(event.target.value) : '')} className="mt-2 w-full border border-slate-300 px-3 py-3">
            <option value="">Izaberite veličinu/boju</option>
            {activeVariants.map((variant) => <option key={variant.id} value={variant.id}>{variantLabel(variant)} · {variant.stock_quantity} kom.</option>)}
          </select>
        </label>
      )}
      {requiresVariant && !selectedVariant && <p className="rounded-lg bg-amber-50 p-3 text-amber-800">Izaberite veličinu/boju</p>}
      <p>Stanje: {stock > 0 ? `${stock} komada dostupno` : 'nema na stanju'}</p>
      {sku && <p>SKU: {sku}</p>}
      <AddToCartButton product={product} selectedVariant={selectedVariant} requiresVariant={requiresVariant} />
    </div>
  );
}
