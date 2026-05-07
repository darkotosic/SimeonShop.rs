'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CartLine } from '@/lib/api';
import { getCart, removeCartLine, updateCartLine } from '@/lib/cart';
import { Price } from './Price';

export function CartView() {
  const [lines, setLines] = useState<CartLine[]>(() => getCart());
  const refresh = () => setLines(getCart());
  useEffect(() => { window.addEventListener('simeonshop:cart', refresh); return () => window.removeEventListener('simeonshop:cart', refresh); }, []);
  const total = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  if (!lines.length) return <div className="mt-8 border border-slate-200 bg-white p-6"><p className="text-slate-600">Korpa je trenutno prazna.</p><Link className="mt-6 inline-block bg-primary px-5 py-3 text-sm font-semibold text-white" href="/products">Nastavi kupovinu</Link></div>;
  return <div className="mt-8 space-y-4">{lines.map((line) => <div key={line.lineId} className="grid gap-4 border border-slate-200 bg-white p-4 sm:grid-cols-[96px_1fr_auto]"><div className="aspect-square bg-slate-100">{line.imageUrl && <img src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />}</div><div><Link href={`/products/${line.slug}`} className="font-semibold text-primary">{line.name}</Link>{line.variantLabel && <p className="text-sm text-slate-500">{line.variantLabel}</p>}<p className="mt-2"><Price cents={line.unitPriceCents} currency={line.currency} /></p></div><div className="flex items-center gap-3"><input type="number" min={1} max={line.stockQuantity} value={line.quantity} onChange={(e) => { updateCartLine(line.lineId, Number(e.target.value)); refresh(); }} className="w-20 border border-slate-300 px-3 py-2" /><button onClick={() => { removeCartLine(line.lineId); refresh(); }} className="text-sm font-semibold text-red-700">Ukloni</button></div></div>)}<div className="flex flex-col items-start justify-between gap-4 border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"><p className="text-xl font-bold">Ukupno: <Price cents={total} currency={lines[0]?.currency ?? 'RSD'} /></p><Link href="/checkout" className="bg-primary px-5 py-3 text-sm font-semibold text-white">Nastavi na checkout</Link></div></div>;
}
