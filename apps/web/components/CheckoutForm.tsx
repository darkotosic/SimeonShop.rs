'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import type { CartLine } from '@/lib/api';
import { ApiError, createGuestOrder } from '@/lib/api';
import { clearCart, getCart } from '@/lib/cart';
import { Price } from './Price';

const extractError = (error: unknown) => {
  if (error instanceof ApiError) {
    if (typeof error.details === 'object' && error.details && 'detail' in error.details) return String((error.details as { detail: unknown }).detail);
    return `Porudžbina nije poslata zbog greške API-ja (${error.status}). Proverite podatke ili pokušajte ponovo za nekoliko minuta.`;
  }
  return 'Porudžbina nije poslata. Proverite obavezna polja, telefon i adresu, pa pokušajte ponovo.';
};

const fields = [
  ['customer_name', 'Ime i prezime', 'text'],
  ['customer_phone', 'Telefon', 'tel'],
  ['customer_email', 'Email', 'email'],
  ['shipping_city', 'Grad', 'text'],
  ['shipping_postal_code', 'Poštanski broj', 'text'],
  ['shipping_address', 'Adresa', 'text'],
];

export function CheckoutForm() {
  const router = useRouter();
  const [lines] = useState<CartLine[]>(() => getCart());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const idempotencyKeyRef = useRef<string | null>(null);
  const total = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  if (!lines.length) return <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6"><p>Korpa je prazna.</p><Link href="/products" className="mt-4 inline-block bg-primary px-5 py-3 text-sm font-semibold text-white">Pogledaj proizvode</Link></div>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    idempotencyKeyRef.current ||= (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `checkout-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    if (form.get('terms') !== 'on') { setError('Morate prihvatiti uslove kupovine i politiku privatnosti pre slanja porudžbine.'); setSubmitting(false); return; }
    try {
      const order = await createGuestOrder({ customer_name: String(form.get('customer_name') ?? ''), customer_email: String(form.get('customer_email') ?? '') || undefined, customer_phone: String(form.get('customer_phone') ?? ''), shipping_city: String(form.get('shipping_city') ?? ''), shipping_postal_code: String(form.get('shipping_postal_code') ?? ''), shipping_address: String(form.get('shipping_address') ?? ''), note: String(form.get('note') ?? '') || undefined, accepted_terms: true, source: 'web', idempotency_key: idempotencyKeyRef.current, items: lines.map((line) => ({ product_id: line.productId, variant_id: line.variantId, quantity: line.quantity })) });
      clearCart(); router.push(`/checkout/success?order=${encodeURIComponent(order.order_number)}`);
    } catch (err) { setError(extractError(err)); } finally { setSubmitting(false); }
  }

  return <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]"><section className="rounded-3xl border border-slate-200 bg-white p-6"><div className="grid gap-4 sm:grid-cols-2">{fields.map(([name, label, type]) => <label key={name} className="text-sm font-medium text-slate-700">{label}<input name={name} required={name !== 'customer_email'} type={type} disabled={isSubmitting} className="mt-2 w-full border border-slate-300 px-3 py-3 outline-none focus:border-primary disabled:bg-slate-100" /></label>)}<label className="text-sm font-medium text-slate-700 sm:col-span-2">Napomena za porudžbinu<textarea name="note" disabled={isSubmitting} className="mt-2 min-h-28 w-full border border-slate-300 px-3 py-3 outline-none focus:border-primary disabled:bg-slate-100" placeholder="Npr. najbolje vreme za poziv ili dodatna napomena za dostavu" /></label><label className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:col-span-2"><input name="terms" type="checkbox" required disabled={isSubmitting} className="mt-1" /><span>Prihvatam <Link href="/terms-and-conditions" className="font-semibold text-primary underline">uslove kupovine</Link> i <Link href="/privacy-policy" className="font-semibold text-primary underline">politiku privatnosti</Link>.</span></label>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2" role="alert">{error}</p>}<button disabled={isSubmitting} className="bg-primary px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400 sm:col-span-2">{isSubmitting ? 'Slanje porudžbine...' : 'Pošalji porudžbinu'}</button></div></section><aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-primary">Vaša porudžbina</h2><div className="mt-4 space-y-4">{lines.map((line) => {
    const imageFailed = line.imageUrl ? failedImages.includes(line.imageUrl) : false;
    return <div key={line.lineId} className="grid grid-cols-[64px_1fr] gap-3"><div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">{line.imageUrl && !imageFailed ? <img src={line.imageUrl} alt={`${line.name} u porudžbini`} onError={() => setFailedImages((urls) => line.imageUrl ? [...urls, line.imageUrl] : urls)} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-1 text-center text-[10px] text-slate-500">Slika uskoro</div>}</div><div className="text-sm"><p className="font-semibold text-primary">{line.name}</p>{line.variantLabel && <p className="text-slate-500">{line.variantLabel}</p>}<p className="text-slate-500">Količina: {line.quantity}</p><p className="mt-1 font-semibold"><Price cents={line.unitPriceCents * line.quantity} currency={line.currency} /></p></div></div>;
  })}</div><div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600"><p className="flex justify-between"><span>Artikli</span><span>{itemCount}</span></p><p className="flex justify-between"><span>Dostava</span><span>Po dogovoru</span></p><p className="flex justify-between text-lg font-bold text-primary"><span>Ukupno</span><Price cents={total} currency={lines[0]?.currency ?? 'RSD'} /></p><p className="rounded-2xl bg-green-50 p-3 text-green-800">Plaćanje pouzećem. Porudžbinu potvrđujemo pre slanja.</p></div></aside></form>;
}
