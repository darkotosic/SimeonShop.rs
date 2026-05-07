'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { adminLogout } from '@/lib/api';

type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'settings' | 'audit';
const tabs: { id: AdminTab; label: string }[] = [
  { id: 'overview', label: 'Pregled' },
  { id: 'orders', label: 'Porudžbine' },
  { id: 'products', label: 'Proizvodi' },
  { id: 'categories', label: 'Kategorije' },
  { id: 'settings', label: 'Podešavanja' },
  { id: 'audit', label: 'Audit log' },
];

export function AdminShell({ activeTab, onTabChange, children }: { activeTab: AdminTab; onTabChange: (tab: AdminTab) => void; children: ReactNode }) {
  const router = useRouter();
  async function logout() { await adminLogout(); router.replace('/admin/login'); }
  return <div className="mt-8 space-y-6"><nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2"><div className="flex gap-2 overflow-x-auto">{tabs.map((tab) => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`whitespace-nowrap px-4 py-2 text-sm font-semibold ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>{tab.label}</button>)}</div><button onClick={logout} className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Odjavi se</button></nav>{children}</div>;
}
export type { AdminTab };
