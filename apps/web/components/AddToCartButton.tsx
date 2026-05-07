'use client';

import { useState } from 'react';
import type { Product, ProductVariant } from '@/lib/api';
import { addToCart } from '@/lib/cart';

export function AddToCartButton({ product, variants = product.variants }: { product: Product; variants?: ProductVariant[] }) {
  const activeVariants = variants.filter((variant) => variant.is_active);
  const [variantId, setVariantId] = useState<number | undefined>(activeVariants[0]?.id);
  const selectedVariant = activeVariants.find((variant) => variant.id === variantId);
  const stock = selectedVariant?.stock_quantity ?? product.effective_stock_quantity ?? product.stock_quantity;

  return (
    <div className="space-y-3">
      {activeVariants.length > 0 && (
        <label className="block text-sm font-medium text-slate-700">
          Veličina / boja
          <select className="mt-2 w-full border border-slate-300 px-3 py-3" value={variantId} onChange={(event) => setVariantId(Number(event.target.value))}>
            {activeVariants.map((variant) => (
              <option key={variant.id} value={variant.id}>{[variant.size, variant.color].filter(Boolean).join(' / ') || variant.sku || `Varijanta ${variant.id}`}</option>
            ))}
          </select>
        </label>
      )}
      <button disabled={stock <= 0} onClick={() => addToCart(product, selectedVariant, 1)} className="w-full bg-primary px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">
        {stock > 0 ? 'Dodaj u korpu' : 'Nema na stanju'}
      </button>
    </div>
  );
}
