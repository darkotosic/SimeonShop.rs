'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CartLine } from '@/lib/api';
import { clearCart, getCart, removeCartLine, updateCartLine } from '@/lib/cart';
import { Price } from './Price';

export function CartView() {
  const [lines, setLines] = useState<CartLine[]>(() => getCart());
  const refresh = () => setLines(getCart());
  useEffect(() => { window.addEventListener('simeonshop:cart', refresh); return () => window.removeEventListener('simeonshop:cart', refresh); }, []);
  const total = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  if (!lines.length) return <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6"><p className="text-slate-600">Korpa je trenutno prazna.</p><Link className="mt-6 inline-block bg-primary px-5 py-3 text-sm font-semibold text-white" href="/products">Nastavi kupovinu</Link></div>;
  return <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><div className="space-y-4">{lines.map((line) => <div key={line.lineId} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-[96px_1fr_auto]"><div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">{line.imageUrl && <img src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />}</div><div><Link href={`/products/${line.slug}`} className="font-semibold text-primary">{line.name}</Link>{line.variantLabel && <p className="text-sm text-slate-500">{line.variantLabel}</p>}<p className="mt-2"><Price cents={line.unitPriceCents} currency={line.currency} /></p>{line.quantity > line.stockQuantity && <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">Količina je veća od dostupne zalihe ({line.stockQuantity}).</p>}</div><div className="flex items-center gap-3"><input type="number" min={1} value={line.quantity} onChange={(e) => { updateCartLine(line.lineId, Number(e.target.value)); refresh(); }} className="w-20 border border-slate-300 px-3 py-2" /><button onClick={() => { removeCartLine(line.lineId); refresh(); }} className="text-sm font-semibold text-red-700">Ukloni</button></div></div>)}</div><aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-primary">Pregled kupovine</h2><div className="mt-4 space-y-2 text-sm text-slate-600"><p className="flex justify-between"><span>Proizvodi</span><span>{lines.length}</span></p><p className="flex justify-between"><span>Dostava</span><span>Po dogovoru</span></p><p className="flex justify-between text-lg font-bold text-primary"><span>Ukupno</span><Price cents={total} currency={lines[0]?.currency ?? 'RSD'} /></p></div><Link href="/checkout" className="mt-6 block bg-primary px-5 py-3 text-center text-sm font-semibold text-white">Nastavi na checkout</Link><Link href="/products" className="mt-3 block text-center text-sm font-semibold text-secondary">Nazad ka katalogu</Link><button onClick={() => { clearCart(); refresh(); }} className="mt-3 w-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">Isprazni korpu</button></aside></div>;
}
