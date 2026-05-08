'use client';

/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */

import { Fragment, useCallback, useEffect, useState } from 'react';
import type { Order } from '@/lib/api';
import { ApiError, getAdminOrders, updateAdminOrderInternalNote, updateAdminOrderStatus } from '@/lib/api';
import { Price } from '../Price';

const statuses = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
function getErrorMessage(error: unknown) { return error instanceof ApiError ? `Admin API greška (${error.status}).` : 'Porudžbine trenutno nisu dostupne.'; }

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await getAdminOrders(); setOrders(data); setNotes(Object.fromEntries(data.map((order) => [order.id, order.internal_note ?? '']))); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  const visible = filter ? orders.filter((order) => order.status === filter) : orders;

  async function saveNote(order: Order) {
    setSavingId(order.id); setError(null); setSuccess(null);
    try { await updateAdminOrderInternalNote(order.id, notes[order.id] || null); setSuccess('Interna napomena je sačuvana.'); await load(); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setSavingId(null); }
  }

  async function changeStatus(order: Order, status: string) {
    if (status === 'cancelled' && !confirm('Da li sigurno otkazujete porudžbinu?')) return;
    setSavingId(order.id); setError(null); setSuccess(null);
    try { await updateAdminOrderStatus(order.id, status); setSuccess('Status porudžbine je ažuriran.'); await load(); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setSavingId(null); }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-primary">Porudžbine</h2>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="border px-3 py-2"><option value="">Svi statusi</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
      </div>
      {loading && <div className="border border-slate-200 bg-white p-6">Učitavanje porudžbina...</div>}
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">{success}</div>}
      {!loading && visible.length === 0 && <div className="border border-slate-200 bg-white p-6">Nema porudžbina za izabrani filter.</div>}
      {!loading && visible.length > 0 && (
        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead><tr className="border-b bg-slate-50"><th className="p-3">Broj</th><th>Kupac</th><th>Status</th><th>Stavke</th><th>Interna napomena</th><th>Ukupno</th><th>Detalji</th></tr></thead>
            <tbody>
              {visible.map((order) => (
                <Fragment key={order.id}>
                  <tr className="border-b align-top">
                    <td className="p-3 font-medium">{order.order_number}</td>
                    <td>{order.customer_name}<br /><span className="text-slate-500">{order.customer_email || 'bez email-a'} · {order.customer_phone}</span></td>
                    <td><select disabled={savingId === order.id} value={order.status} onChange={(event) => void changeStatus(order, event.target.value)} className="border px-2 py-1">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                    <td><ul className="space-y-2">{order.items.map((item) => <li key={item.id} className="flex gap-2">{item.product_image_url && <img src={item.product_image_url} alt={item.product_name} className="h-10 w-10 object-cover" loading="lazy" />}<span>{item.product_name}{item.variant_label ? ` • ${item.variant_label}` : ''} × {item.quantity}</span></li>)}</ul></td>
                    <td><textarea value={notes[order.id] ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [order.id]: event.target.value }))} className="min-h-20 w-56 border border-slate-300 p-2" placeholder="Napomena samo za admin tim" /><button type="button" disabled={savingId === order.id} onClick={() => void saveNote(order)} className="mt-2 block border px-2 py-1 text-xs disabled:text-slate-400">Sačuvaj napomenu</button>{savingId === order.id && <p className="text-xs text-slate-500">Čuvanje...</p>}</td>
                    <td><Price cents={order.total_cents} currency={order.currency} /></td>
                    <td><button type="button" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} className="border px-2 py-1">{expandedId === order.id ? 'Sakrij' : 'Detalji'}</button></td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-details`} className="border-b bg-slate-50 align-top"><td colSpan={7} className="p-4"><div className="grid gap-4 md:grid-cols-3"><div><h4 className="font-semibold">Dostava</h4><p>{order.shipping_address}</p><p>{order.shipping_postal_code} {order.shipping_city}</p><p className="mt-2 text-xs text-slate-500">Accepted terms: {order.accepted_terms_at ? new Date(order.accepted_terms_at).toLocaleString('sr-RS') : '-'}</p><p className="text-xs text-slate-500">Source: {order.source ?? '-'}</p></div><div><h4 className="font-semibold">Status timeline</h4><ol className="space-y-1">{(order.status_events ?? []).map((event) => <li key={event.id} className="text-xs"><span className="font-semibold">{event.new_status}</span> · {new Date(event.created_at).toLocaleString('sr-RS')}{event.note ? ` · ${event.note}` : ''}</li>)}{(!order.status_events || order.status_events.length === 0) && <li className="text-xs text-slate-500">Nema status događaja.</li>}</ol></div><details><summary className="cursor-pointer font-semibold">Advanced</summary><p className="mt-2 break-all text-xs text-slate-600">IP: {order.customer_ip ?? '-'}</p><p className="break-all text-xs text-slate-600">User agent: {order.user_agent ?? '-'}</p><p className="break-all text-xs text-slate-600">Idempotency: {order.idempotency_key ?? '-'}</p></details></div></td></tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
