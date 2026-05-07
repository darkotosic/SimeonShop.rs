'use client';

import { FormEvent, useState } from 'react';
import type { Product } from '@/lib/api';
import { createAdminProductImage, deleteAdminProductImage, setPrimaryAdminProductImage, uploadAdminProductImage } from '@/lib/api';

export function AdminProductImages({ product, onChanged }: { product: Product; onChanged: () => Promise<void> }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(event.currentTarget);
    try {
      await createAdminProductImage(product.id, {
        image_url: String(form.get('image_url')),
        alt_text: String(form.get('alt_text') || '') || null,
        sort_order: Number(form.get('sort_order') || 0),
        is_primary: form.get('is_primary') === 'on',
      });
      event.currentTarget.reset();
      setSuccess('Slika je dodata preko URL-a.');
      await onChanged();
    } catch {
      setError('Backend je odbio URL. Proverite da li je apsolutan HTTP(S) URL i da li je HTTPS u produkciji.');
    }
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData(event.currentTarget);
      await uploadAdminProductImage(product.id, formData);
      event.currentTarget.reset();
      setPreview(null);
      setSuccess('Slika je uploadovana.');
      await onChanged();
    } catch {
      setError('Upload nije uspeo. Proverite tip slike, veličinu do 5MB i Cloudinary podešavanja.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4 border border-slate-200 p-3">
      <div>
        <h4 className="font-semibold">Slike</h4>
        <p className="text-xs text-slate-500">Upload preko Cloudinary-ja je primarni tok. URL unos ostaje fallback.</p>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
      <form onSubmit={upload} className="grid gap-2 rounded-2xl bg-slate-50 p-3 md:grid-cols-5">
        <input
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="border px-2 py-2 md:col-span-2"
        />
        <input name="alt_text" placeholder="Alt tekst" className="border px-2 py-2" />
        <input name="sort_order" type="number" defaultValue={0} className="border px-2 py-2" />
        <label className="flex items-center gap-2 text-sm"><input name="is_primary" type="checkbox" /> Primarna</label>
        {preview && <img src={preview} alt="Preview" className="h-20 w-20 rounded-xl object-cover" />}
        <button disabled={uploading} className="bg-primary px-3 py-2 text-white disabled:bg-slate-400 md:col-span-4">{uploading ? 'Upload...' : 'Upload sliku'}</button>
      </form>
      <form onSubmit={add} className="grid gap-2 md:grid-cols-5">
        <input name="image_url" required placeholder="https://..." className="border px-2 py-2 md:col-span-2" />
        <input name="alt_text" placeholder="Alt tekst (preporučeno)" className="border px-2 py-2" />
        <input name="sort_order" type="number" defaultValue={0} className="border px-2 py-2" />
        <label className="flex items-center gap-2 text-sm"><input name="is_primary" type="checkbox" /> Primarna</label>
        <button className="bg-slate-900 px-3 py-2 text-white md:col-span-5">Dodaj URL sliku</button>
      </form>
      <ul className="space-y-2">
        {product.images.map((image) => (
          <li key={image.id} className="grid gap-3 rounded-2xl border border-slate-100 p-3 text-sm md:grid-cols-[72px_1fr_auto]">
            <img src={image.image_url} alt={image.alt_text ?? product.name} className="h-16 w-16 rounded-xl bg-slate-100 object-cover" />
            <div className="min-w-0">
              <span className="font-medium">#{image.sort_order}</span>
              <p className="truncate text-slate-500">{image.image_url}</p>
              <p className={image.alt_text ? 'text-slate-500' : 'text-amber-700'}>Alt: {image.alt_text || 'nije unet - dodajte alt tekst'}</p>
              {image.is_primary && <span className="inline-block bg-green-100 px-2 py-1 text-green-800">primarna</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={async () => { await setPrimaryAdminProductImage(product.id, image.id); await onChanged(); }} className="border px-2 py-1">Primarna slika</button>
              <button onClick={async () => { if (confirm('Obrisati sliku?')) { await deleteAdminProductImage(product.id, image.id); await onChanged(); } }} className="border px-2 py-1 text-red-700">Obriši</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
