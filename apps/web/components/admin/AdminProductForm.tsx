'use client';

import { FormEvent } from 'react';
import type { Category, Product } from '@/lib/api';

const centsToRsd = (cents?: number | null) => cents ? String(cents / 100) : '';
const rsdToCents = (value: FormDataEntryValue | null) => Math.round(Number(value || 0) * 100);
const optionalCents = (value: FormDataEntryValue | null) => value ? Math.round(Number(value) * 100) : null;

export function AdminProductForm({ product, categories, onSubmit }: { product?: Product | null; categories: Category[]; onSubmit: (payload: Record<string, unknown>) => Promise<void> }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await onSubmit({
      name: String(form.get('name') || ''), slug: String(form.get('slug') || '') || null, sku: String(form.get('sku') || '') || null,
      category_id: form.get('category_id') ? Number(form.get('category_id')) : null,
      short_description: String(form.get('short_description') || '') || null, description: String(form.get('description') || '') || null,
      price_cents: rsdToCents(form.get('price')), compare_at_price_cents: optionalCents(form.get('compare_at_price')),
      material: String(form.get('material') || '') || null, care_instructions: String(form.get('care_instructions') || '') || null,
      seo_title: String(form.get('seo_title') || '') || null, seo_description: String(form.get('seo_description') || '') || null,
      sort_order: Number(form.get('sort_order') || 0), stock_quantity: Number(form.get('stock_quantity') || 0), is_active: form.get('is_active') === 'on', currency: 'RSD',
    });
    if (!product) event.currentTarget.reset();
  }
  const input = 'mt-1 w-full border border-slate-300 px-3 py-2';
  return <form onSubmit={submit} className="grid gap-3 border border-slate-200 bg-white p-4 md:grid-cols-2"><input name="name" required defaultValue={product?.name} placeholder="Naziv" className={input} /><input name="slug" defaultValue={product?.slug} placeholder="Slug" className={input} /><input name="sku" defaultValue={product?.sku ?? ''} placeholder="SKU" className={input} /><select name="category_id" defaultValue={product?.category_id ?? ''} className={input}><option value="">Bez kategorije</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><textarea name="short_description" defaultValue={product?.short_description ?? ''} placeholder="Kratak opis" className={input} /><textarea name="description" defaultValue={product?.description ?? ''} placeholder="Pun opis" className={input} /><input name="price" type="number" step="0.01" required defaultValue={centsToRsd(product?.price_cents)} placeholder="Cena RSD" className={input} /><input name="compare_at_price" type="number" step="0.01" defaultValue={centsToRsd(product?.compare_at_price_cents)} placeholder="Compare-at cena" className={input} /><input name="material" defaultValue={product?.material ?? ''} placeholder="Materijal" className={input} /><input name="care_instructions" defaultValue={product?.care_instructions ?? ''} placeholder="Instrukcije održavanja" className={input} /><input name="seo_title" defaultValue={product?.seo_title ?? ''} placeholder="SEO title" className={input} /><input name="seo_description" defaultValue={product?.seo_description ?? ''} placeholder="SEO description" className={input} /><input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} placeholder="Sort order" className={input} /><input name="stock_quantity" type="number" min="0" defaultValue={product?.stock_quantity ?? 0} placeholder="Zalihe" className={input} /><label className="flex items-center gap-2 text-sm"><input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} /> Aktivan proizvod</label><button className="bg-primary px-4 py-2 font-semibold text-white">{product ? 'Sačuvaj proizvod' : 'Dodaj proizvod'}</button></form>;
}
