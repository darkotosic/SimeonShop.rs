'use client';

import { FormEvent } from 'react';
import type { Product } from '@/lib/api';
import { createAdminProductImage, deleteAdminProductImage, setPrimaryAdminProductImage } from '@/lib/api';

export function AdminProductImages({ token, product, onChanged }: { token: string; product: Product; onChanged: () => Promise<void> }) {
  async function add(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); await createAdminProductImage(token, product.id, { image_url: String(form.get('image_url')), alt_text: String(form.get('alt_text') || '') || null, sort_order: Number(form.get('sort_order') || 0) }); event.currentTarget.reset(); await onChanged(); }
  return <div className="space-y-3 border border-slate-200 p-3"><h4 className="font-semibold">Slike</h4><form onSubmit={add} className="grid gap-2 md:grid-cols-4"><input name="image_url" required placeholder="Image URL" className="border px-2 py-2" /><input name="alt_text" placeholder="Alt tekst" className="border px-2 py-2" /><input name="sort_order" type="number" defaultValue={0} className="border px-2 py-2" /><button className="bg-primary px-3 py-2 text-white">Dodaj sliku</button></form><ul className="space-y-2">{product.images.map((image) => <li key={image.id} className="flex flex-wrap items-center gap-2 text-sm"><span className="font-medium">#{image.sort_order}</span><span className="max-w-lg truncate">{image.image_url}</span>{image.is_primary && <span className="bg-green-100 px-2 py-1 text-green-800">primarna</span>}<button onClick={async () => { await setPrimaryAdminProductImage(token, product.id, image.id); await onChanged(); }} className="border px-2 py-1">Primarna slika</button><button onClick={async () => { await deleteAdminProductImage(token, product.id, image.id); await onChanged(); }} className="border px-2 py-1 text-red-700">Obriši</button></li>)}</ul></div>;
}
