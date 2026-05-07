'use client';

import type { ReactNode } from 'react';

type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'settings';
const tabs: { id: AdminTab; label: string }[] = [
  { id: 'overview', label: 'Pregled' },
  { id: 'orders', label: 'Porudžbine' },
  { id: 'products', label: 'Proizvodi' },
  { id: 'categories', label: 'Kategorije' },
  { id: 'settings', label: 'Podešavanja' },
];

export function AdminShell({ activeTab, onTabChange, children }: { activeTab: AdminTab; onTabChange: (tab: AdminTab) => void; children: ReactNode }) {
  return <div className="mt-8 space-y-6"><nav className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">{tabs.map((tab) => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`whitespace-nowrap px-4 py-2 text-sm font-semibold ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>{tab.label}</button>)}</nav>{children}</div>;
}
export type { AdminTab };
