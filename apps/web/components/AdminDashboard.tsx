'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AdminSummary, Order } from '@/lib/api';
import { getAdminOrders, getAdminSummary, updateAdminOrderStatus } from '@/lib/api';
import { Price } from './Price';

export function AdminDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const load = async (adminToken: string) => { setSummary(await getAdminSummary(adminToken)); setOrders(await getAdminOrders(adminToken)); };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const stored = sessionStorage.getItem('simeonshop.admin.token'); if (!stored) { router.replace('/admin/login'); return; } load(stored).catch(() => router.replace('/admin/login')); }, [router]);
  if (!summary) return <div className="mt-8 border border-slate-200 bg-white p-6">Učitavanje admin podataka...</div>;
  return <div className="mt-8 space-y-8"><div className="grid gap-4 sm:grid-cols-3">{[['Nove porudžbine', summary.new_orders], ['Aktivni proizvodi', summary.active_products], ['Bez zaliha', summary.out_of_stock_products]].map(([label,value]) => <div key={label} className="border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-primary">{value}</p></div>)}</div><section className="border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold text-primary">Poslednje porudžbine</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b"><th className="py-2">Broj</th><th>Kupac</th><th>Status</th><th>Ukupno</th><th>Promena statusa</th></tr></thead><tbody>{orders.slice(0, 10).map((order) => <tr key={order.id} className="border-b"><td className="py-3 font-medium">{order.order_number}</td><td>{order.customer_name}</td><td>{order.status}</td><td><Price cents={order.total_cents} currency={order.currency} /></td><td><select defaultValue={order.status} onChange={async (event) => { const adminToken = sessionStorage.getItem('simeonshop.admin.token'); if (!adminToken) return; await updateAdminOrderStatus(adminToken, order.id, event.target.value); await load(adminToken); }} className="border border-slate-300 px-2 py-2"><option value="new">new</option><option value="confirmed">confirmed</option><option value="packed">packed</option><option value="shipped">shipped</option><option value="delivered">delivered</option><option value="cancelled">cancelled</option></select></td></tr>)}</tbody></table></div></section></div>;
}
