'use client';

import { FormEvent, useState } from 'react';
import type { Product } from '@/lib/api';
import { ApiError, createAdminProductVariant, deleteAdminProductVariant, updateAdminProductVariant } from '@/lib/api';

const toCents = (value: FormDataEntryValue | null) => value ? Math.round(Number(String(value).replace(',', '.')) * 100) : null;
const toRsd = (value?: number | null) => value ? String(value / 100) : '';

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return `Greška (${error.status}) pri čuvanju varijante.`;
  return 'Varijanta nije sačuvana.';
}

export function AdminProductVariants({ product, onChanged }: { product: Product; onChanged: () => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock_quantity, 0);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const stock = Number(form.get('stock_quantity') || 0);
    if (stock < 0) { setError('Zalihe ne mogu biti negativne.'); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      await createAdminProductVariant(product.id, { sku: String(form.get('sku') || '') || null, size: String(form.get('size') || '') || null, color: String(form.get('color') || '') || null, price_cents: toCents(form.get('price')), stock_quantity: stock, is_active: true });
      event.currentTarget.reset();
      setSuccess('Varijanta je dodata.');
      await onChanged();
    } catch (err) { setError(errorMessage(err)); } finally { setSaving(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>, variantId: number) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const stock = Number(form.get('stock_quantity') || 0);
    if (stock < 0) { setError('Zalihe ne mogu biti negativne.'); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      await updateAdminProductVariant(product.id, variantId, { size: String(form.get('size') || '') || null, color: String(form.get('color') || '') || null, sku: String(form.get('sku') || '') || null, price_cents: toCents(form.get('price')), stock_quantity: stock, is_active: form.get('is_active') === 'on' });
      setSuccess('Varijanta je sačuvana.');
      await onChanged();
    } catch (err) { setError(errorMessage(err)); } finally { setSaving(false); }
  }

  async function deactivate(variantId: number) {
    if (!confirm('Deaktivirati varijantu?')) return;
    setSaving(true); setError(null); setSuccess(null);
    try { await deleteAdminProductVariant(product.id, variantId); setSuccess('Varijanta je deaktivirana.'); await onChanged(); }
    catch (err) { setError(errorMessage(err)); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-3 border border-slate-200 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold">Varijante</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Ukupno zaliha: {totalStock}</span>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
      <form onSubmit={add} className="grid gap-2 md:grid-cols-6"><input name="size" placeholder="Veličina" className="border px-2 py-2" /><input name="color" placeholder="Boja" className="border px-2 py-2" /><input name="sku" placeholder="SKU" className="border px-2 py-2" /><input name="price" type="number" step="0.01" min="0" placeholder="Cena RSD" className="border px-2 py-2" /><input name="stock_quantity" type="number" min="0" defaultValue={0} className="border px-2 py-2" /><button disabled={saving} className="bg-primary px-3 py-2 text-white disabled:bg-slate-400">Dodaj</button></form>
      {product.variants.length === 0 && <p className="text-sm text-slate-500">Nema varijanti.</p>}
      <div className="space-y-2">
        {product.variants.map((variant) => (
          <form key={variant.id} onSubmit={(event) => void save(event, variant.id)} className="grid gap-2 rounded-xl border border-slate-100 p-2 text-sm md:grid-cols-8">
            <input name="size" defaultValue={variant.size ?? ''} className="border px-2 py-1" />
            <input name="color" defaultValue={variant.color ?? ''} className="border px-2 py-1" />
            <input name="sku" defaultValue={variant.sku ?? ''} className="border px-2 py-1" />
            <input name="price" type="number" step="0.01" min="0" defaultValue={toRsd(variant.price_cents)} className="border px-2 py-1" />
            <input name="stock_quantity" type="number" min="0" defaultValue={variant.stock_quantity} className="border px-2 py-1" />
            <label className="flex items-center gap-1"><input name="is_active" type="checkbox" defaultChecked={variant.is_active} /> active</label>
            <span className={`px-2 py-1 text-center ${variant.is_active ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}`}>{variant.is_active ? 'Aktivna' : 'Neaktivna'}</span>
            <span className="flex gap-2"><button disabled={saving} className="border px-2 py-1">Snimi</button><button type="button" onClick={() => void deactivate(variant.id)} className="border px-2 py-1 text-red-700">Deaktiviraj</button></span>
          </form>
        ))}
      </div>
    </div>
  );
}
