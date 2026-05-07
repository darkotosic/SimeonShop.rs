'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AdminSummary } from '@/lib/api';
import { getAdminSummary } from '@/lib/api';
import { getAdminToken } from '@/lib/admin-auth';
import { AdminCategoriesPanel } from './admin/AdminCategoriesPanel';
import { AdminOrdersPanel } from './admin/AdminOrdersPanel';
import { AdminProductsPanel } from './admin/AdminProductsPanel';
import { AdminSettingsPanel } from './admin/AdminSettingsPanel';
import { AdminShell, type AdminTab } from './admin/AdminShell';

export function AdminDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  useEffect(() => {
    const stored = getAdminToken();
    if (!stored) { router.replace('/admin/login'); return; }
    setToken(stored);
    getAdminSummary(stored).then(setSummary).catch(() => router.replace('/admin/login'));
  }, [router]);
  if (!token || !summary) return <div className="mt-8 border border-slate-200 bg-white p-6">Učitavanje admin podataka...</div>;
  return <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>{activeTab === 'overview' && <div className="grid gap-4 sm:grid-cols-3">{[['Nove porudžbine', summary.new_orders], ['Aktivni proizvodi', summary.active_products], ['Bez zaliha', summary.out_of_stock_products]].map(([label, value]) => <div key={label} className="border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-primary">{value}</p></div>)}</div>}{activeTab === 'orders' && <AdminOrdersPanel token={token} />}{activeTab === 'products' && <AdminProductsPanel token={token} />}{activeTab === 'categories' && <AdminCategoriesPanel token={token} />}{activeTab === 'settings' && <AdminSettingsPanel token={token} />}</AdminShell>;
}
