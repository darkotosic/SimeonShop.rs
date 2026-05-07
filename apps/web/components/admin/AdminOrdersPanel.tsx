'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Order } from '@/lib/api';
import { ApiError, getAdminOrders, updateAdminOrderInternalNote, updateAdminOrderStatus } from '@/lib/api';
import { Price } from '../Price';

const statuses = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return `Admin API greška (${error.status}).`;
  return 'Porudžbine trenutno nisu dostupne.';
}

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setOrders(await getAdminOrders());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const visible = filter ? orders.filter((order) => order.status === filter) : orders;

  async function saveNote(order: Order, internalNote: string) {
    setSavingId(order.id);
    setError(null);
    try {
      await updateAdminOrderInternalNote(order.id, internalNote || null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-primary">Porudžbine</h2>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="border px-3 py-2">
          <option value="">Svi statusi</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      {loading && <div className="border border-slate-200 bg-white p-6">Učitavanje porudžbina...</div>}
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {!loading && visible.length === 0 && <div className="border border-slate-200 bg-white p-6">Nema porudžbina za izabrani filter.</div>}
      {!loading && visible.length > 0 && (
        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">Broj</th>
                <th>Kupac</th>
                <th>Status</th>
                <th>Stavke</th>
                <th>Interna napomena</th>
                <th>Ukupno</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id} className="border-b align-top">
                  <td className="p-3 font-medium">{order.order_number}</td>
                  <td>{order.customer_name}<br /><span className="text-slate-500">{order.customer_phone}</span></td>
                  <td>
                    <select
                      value={order.status}
                      onChange={async (event) => {
                        if (event.target.value === 'cancelled' && !confirm('Da li sigurno otkazujete porudžbinu?')) return;
                        setSavingId(order.id);
                        await updateAdminOrderStatus(order.id, event.target.value);
                        await load();
                        setSavingId(null);
                      }}
                      className="border px-2 py-1"
                    >
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td>
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex gap-2">
                          {item.product_image_url && <Image src={item.product_image_url} alt={item.product_name} width={40} height={40} className="h-10 w-10 object-cover" />}
                          <span>{item.product_name}{item.variant_label ? ` • ${item.variant_label}` : ''} × {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <textarea
                      defaultValue={order.internal_note ?? ''}
                      onBlur={(event) => void saveNote(order, event.target.value)}
                      className="min-h-20 w-56 border border-slate-300 p-2"
                      placeholder="Napomena samo za admin tim"
                    />
                    {savingId === order.id && <p className="text-xs text-slate-500">Čuvanje...</p>}
                  </td>
                  <td><Price cents={order.total_cents} currency={order.currency} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
