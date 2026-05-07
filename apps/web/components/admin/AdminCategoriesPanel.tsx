'use client';

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { FormEvent, useEffect, useState } from 'react';
import type { Category } from '@/lib/api';
import { createAdminCategory, deleteAdminCategory, getAdminCategories, updateAdminCategory } from '@/lib/api';

export function AdminCategoriesPanel({ token }: { token: string }) {
  const [categories, setCategories] = useState<Category[]>([]); const load = async () => setCategories(await getAdminCategories(token)); useEffect(() => { load().catch(console.error); }, []);
  async function add(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); await createAdminCategory(token, { name: String(form.get('name')), slug: String(form.get('slug') || '') || null, sort_order: Number(form.get('sort_order') || 0), is_active: true }); event.currentTarget.reset(); await load(); }
  return <section className="space-y-4"><h2 className="text-xl font-bold text-primary">Kategorije</h2><form onSubmit={add} className="grid gap-2 bg-white p-4 md:grid-cols-4"><input name="name" required placeholder="Naziv" className="border px-3 py-2" /><input name="slug" placeholder="Slug" className="border px-3 py-2" /><input name="sort_order" type="number" defaultValue={0} className="border px-3 py-2" /><button className="bg-primary px-3 py-2 text-white">Dodaj</button></form><div className="space-y-2">{categories.map((category) => <form key={category.id} onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); await updateAdminCategory(token, category.id, { name: String(form.get('name')), slug: String(form.get('slug') || '') || null, sort_order: Number(form.get('sort_order') || 0), is_active: form.get('is_active') === 'on' }); await load(); }} className="grid gap-2 bg-white p-3 md:grid-cols-6"><input name="name" defaultValue={category.name} className="border px-2 py-1" /><input name="slug" defaultValue={category.slug} className="border px-2 py-1" /><input name="sort_order" type="number" defaultValue={category.sort_order} className="border px-2 py-1" /><label><input name="is_active" type="checkbox" defaultChecked={category.is_active} /> active</label><button className="border px-2 py-1">Snimi</button><button type="button" onClick={async () => { await deleteAdminCategory(token, category.id); await load(); }} className="border px-2 py-1 text-red-700">Deaktiviraj</button></form>)}</div></section>;
}
