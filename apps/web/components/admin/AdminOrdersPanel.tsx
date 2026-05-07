'use client';

/* eslint-disable react-hooks/set-state-in-effect */


import { useEffect, useState } from 'react';
import type { Order } from '@/lib/api';
import { getAdminOrders, updateAdminOrderStatus } from '@/lib/api';
import { Price } from '../Price';

const statuses = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]); const [filter, setFilter] = useState(''); const load = async () => setOrders(await getAdminOrders()); useEffect(() => { load().catch(console.error); }, []); const visible = filter ? orders.filter((order) => order.status === filter) : orders;
  return <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-primary">Porudžbine</h2><select value={filter} onChange={(event) => setFilter(event.target.value)} className="border px-3 py-2"><option value="">Svi statusi</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div><div className="overflow-x-auto bg-white"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b"><th className="p-3">Broj</th><th>Kupac</th><th>Status</th><th>Stavke</th><th>Ukupno</th></tr></thead><tbody>{visible.map((order) => <tr key={order.id} className="border-b align-top"><td className="p-3 font-medium">{order.order_number}</td><td>{order.customer_name}<br /><span className="text-slate-500">{order.customer_phone}</span></td><td><select value={order.status} onChange={async (event) => { await updateAdminOrderStatus(order.id, event.target.value); await load(); }} className="border px-2 py-1">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td><ul>{order.items.map((item) => <li key={item.id}>{item.product_name} × {item.quantity}</li>)}</ul></td><td><Price cents={order.total_cents} currency={order.currency} /></td></tr>)}</tbody></table></div></section>;
}
