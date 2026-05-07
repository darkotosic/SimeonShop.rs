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
    return `Greška API-ja (${error.status}).`;
  }
  return 'Porudžbina nije poslata. Proverite podatke i pokušajte ponovo.';
};

export function CheckoutForm() {
  const router = useRouter();
  const [lines] = useState<CartLine[]>(() => getCart());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);
  const total = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  if (!lines.length) return <div className="mt-8 border border-slate-200 bg-white p-6"><p>Korpa je prazna.</p><Link href="/products" className="mt-4 inline-block bg-primary px-5 py-3 text-sm font-semibold text-white">Pogledaj proizvode</Link></div>;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setSubmitting(true);
    const form = new FormData(event.currentTarget);
    idempotencyKeyRef.current ||= (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `checkout-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    if (form.get('terms') !== 'on') { setError('Morate prihvatiti uslove kupovine i politiku privatnosti.'); setSubmitting(false); return; }
    try {
      const order = await createGuestOrder({ customer_name: String(form.get('customer_name') ?? ''), customer_email: String(form.get('customer_email') ?? '') || undefined, customer_phone: String(form.get('customer_phone') ?? ''), shipping_city: String(form.get('shipping_city') ?? ''), shipping_postal_code: String(form.get('shipping_postal_code') ?? ''), shipping_address: String(form.get('shipping_address') ?? ''), note: String(form.get('note') ?? '') || undefined, idempotency_key: idempotencyKeyRef.current, items: lines.map((line) => ({ product_id: line.productId, variant_id: line.variantId, quantity: line.quantity })) });
      clearCart(); router.push(`/checkout/success?order=${encodeURIComponent(order.order_number)}`);
    } catch (err) { setError(extractError(err)); } finally { setSubmitting(false); }
  }
  return <form onSubmit={submit} className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:grid-cols-2">{[['customer_name','Ime i prezime'], ['customer_phone','Telefon'], ['customer_email','Email'], ['shipping_city','Grad'], ['shipping_postal_code','Poštanski broj'], ['shipping_address','Adresa']].map(([name,label]) => <label key={name} className="text-sm font-medium text-slate-700">{label}<input name={name} required={name !== 'customer_email'} type={name === 'customer_email' ? 'email' : 'text'} className="mt-2 w-full border border-slate-300 px-3 py-3 outline-none focus:border-primary" /></label>)}<label className="text-sm font-medium text-slate-700 sm:col-span-2">Napomena<textarea name="note" className="mt-2 min-h-28 w-full border border-slate-300 px-3 py-3 outline-none focus:border-primary" /></label><div className="rounded-2xl bg-slate-50 p-4 text-sm sm:col-span-2"><p className="font-semibold text-primary">Mini pregled: <Price cents={total} currency={lines[0]?.currency ?? 'RSD'} /></p><p className="mt-1 text-slate-600">Plaćanje pouzećem. Idempotentna porudžbina štiti od duplog submit-a.</p></div><label className="flex gap-3 text-sm text-slate-700 sm:col-span-2"><input name="terms" type="checkbox" required className="mt-1" />Prihvatam uslove kupovine i politiku privatnosti</label>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p>}<button disabled={isSubmitting} className="bg-primary px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-400 sm:col-span-2">{isSubmitting ? 'Slanje...' : 'Pošalji porudžbinu'}</button></form>;
}
