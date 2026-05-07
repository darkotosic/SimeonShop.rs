'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from 'react';
import type { AuditLogResponse } from '@/lib/api';
import { ApiError, getAdminAuditLogs } from '@/lib/api';

type Filters = { action: string; entity_type: string; actor_user_id: string };

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return `Greška (${error.status}) pri učitavanju audit loga.`;
  return 'Audit log trenutno nije dostupan.';
}

export function AdminAuditLogsPanel() {
  const [filters, setFilters] = useState<Filters>({ action: '', entity_type: '', actor_user_id: '' });
  const [data, setData] = useState<AuditLogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(nextFilters = filters) {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminAuditLogs({
        action: nextFilters.action || undefined,
        entity_type: nextFilters.entity_type || undefined,
        actor_user_id: nextFilters.actor_user_id || undefined,
      });
      setData(response);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load();
  }

  return (
    <section className="space-y-4">
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input value={filters.action} onChange={(event) => setFilters({ ...filters, action: event.target.value })} placeholder="Action" className="border border-slate-300 px-3 py-2" />
        <input value={filters.entity_type} onChange={(event) => setFilters({ ...filters, entity_type: event.target.value })} placeholder="Entity type" className="border border-slate-300 px-3 py-2" />
        <input value={filters.actor_user_id} onChange={(event) => setFilters({ ...filters, actor_user_id: event.target.value })} placeholder="Actor user ID" className="border border-slate-300 px-3 py-2" />
        <button className="bg-primary px-4 py-2 text-sm font-semibold text-white">Filtriraj</button>
      </form>
      {loading && <div className="border border-slate-200 bg-white p-6">Učitavanje audit loga...</div>}
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {!loading && data && data.items.length === 0 && <div className="border border-slate-200 bg-white p-6">Nema audit log zapisa za izabrane filtere.</div>}
      {!loading && data && data.items.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3">Vreme</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Entity ID</th>
                <th className="p-3">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 align-top">
                  <td className="p-3">{new Date(item.created_at).toLocaleString('sr-RS')}</td>
                  <td className="p-3">{item.actor_user_id ?? 'system'}</td>
                  <td className="p-3 font-semibold text-primary">{item.action}</td>
                  <td className="p-3">{item.entity_type}</td>
                  <td className="p-3">{item.entity_id ?? '-'}</td>
                  <td className="max-w-md p-3 font-mono text-xs text-slate-600">{item.metadata_json ?? '{}'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
