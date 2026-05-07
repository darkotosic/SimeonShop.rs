'use client';

/* eslint-disable react-hooks/set-state-in-effect */


import { useEffect, useState } from 'react';
import type { Category, Product } from '@/lib/api';
import { createAdminProduct, deleteAdminProduct, getAdminCategories, getAdminProducts, updateAdminProduct } from '@/lib/api';
import { AdminProductForm } from './AdminProductForm';
import { AdminProductImages } from './AdminProductImages';
import { AdminProductVariants } from './AdminProductVariants';

export function AdminProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]); const [categories, setCategories] = useState<Category[]>([]); const [editing, setEditing] = useState<Product | null>(null);
  const load = async () => { const [productData, categoryData] = await Promise.all([getAdminProducts({ page_size: 60 }), getAdminCategories()]); setProducts(productData.items); setCategories(categoryData); };
  useEffect(() => { load().catch(console.error); }, []);
  return <section className="space-y-4"><h2 className="text-xl font-bold text-primary">Proizvodi</h2><AdminProductForm categories={categories} product={editing} onSubmit={async (payload) => { if (editing) await updateAdminProduct(editing.id, payload); else await createAdminProduct(payload); setEditing(null); await load(); }} /><div className="space-y-4">{products.map((product) => <article key={product.id} className="space-y-3 border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">{product.name}</h3><p className="text-sm text-slate-500">{product.slug} · zalihe: {product.effective_stock_quantity ?? product.stock_quantity} · {product.is_active ? 'active' : 'inactive'}</p></div><div className="flex gap-2"><button onClick={() => setEditing(product)} className="border px-3 py-2">Izmeni</button><button onClick={async () => { await deleteAdminProduct(product.id); await load(); }} className="border px-3 py-2 text-red-700">Deaktiviraj</button></div></div><AdminProductImages product={product} onChanged={load} /><AdminProductVariants product={product} onChanged={load} /></article>)}</div></section>;
}
