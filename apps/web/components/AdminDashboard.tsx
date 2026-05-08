'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AdminSummary } from '@/lib/api';
import { ApiError, getAdminSummary } from '@/lib/api';
import { AdminAuditLogsPanel } from './admin/AdminAuditLogsPanel';
import { AdminCategoriesPanel } from './admin/AdminCategoriesPanel';
import { AdminOrdersPanel } from './admin/AdminOrdersPanel';
import { AdminProductsPanel } from './admin/AdminProductsPanel';
import { AdminSettingsPanel } from './admin/AdminSettingsPanel';
import { AdminShell, type AdminTab } from './admin/AdminShell';

function adminErrorMessage(error: unknown) {
  if (error instanceof ApiError) return `Admin API greška (${error.status}).`;
  return 'Admin podaci trenutno nisu dostupni.';
}

export function AdminDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminSummary();
        if (mounted) setSummary(data);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          router.replace('/admin/login');
          return;
        }
        if (mounted) setError(adminErrorMessage(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadSummary();
    return () => { mounted = false; };
  }, [router]);

  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-primary">Pregled prodavnice</h2>
          {loading && <div className="border border-slate-200 bg-white p-6">Učitavanje admin podataka...</div>}
          {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {!loading && !error && summary && (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Nove porudžbine', summary.new_orders],
                ['Aktivni proizvodi', summary.active_products],
                ['Bez zaliha', summary.out_of_stock_products],
              ].map(([label, value]) => (
                <div key={label} className="border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-primary">{value}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      {activeTab === 'orders' && <AdminOrdersPanel />}
      {activeTab === 'products' && <AdminProductsPanel />}
      {activeTab === 'categories' && <AdminCategoriesPanel />}
      {activeTab === 'settings' && <AdminSettingsPanel />}
      {activeTab === 'audit' && <AdminAuditLogsPanel />}
    </AdminShell>
  );
}
