'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { StoreSetting } from '@/lib/api';
import { ApiError, getAdminSettings, updateAdminSetting } from '@/lib/api';

const keys = ['store_phone', 'store_email', 'instagram_url', 'facebook_url', 'delivery_note', 'return_policy_short'];
function message(error: unknown) { return error instanceof ApiError ? `Admin API greška (${error.status}).` : 'Podešavanja trenutno nisu dostupna.'; }

export function AdminSettingsPanel() {
  const [settings, setSettings] = useState<Record<string, StoreSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { const rows = await getAdminSettings(); setSettings(Object.fromEntries(rows.map((row) => [row.key, row]))); } catch (err) { setError(message(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setError(null); setSuccess(null); const form = new FormData(event.currentTarget); try { await Promise.all(keys.map((key) => updateAdminSetting(key, { value: String(form.get(key) || ''), value_type: 'string', is_public: true }))); setSuccess('Podešavanja su sačuvana.'); await load(); } catch (err) { setError(message(err)); } finally { setSaving(false); } }
  return <section className="space-y-4"><h2 className="text-xl font-bold text-primary">Podešavanja</h2>{loading && <div className="border border-slate-200 bg-white p-6">Učitavanje podešavanja...</div>}{error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}{success && <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">{success}</div>}<form onSubmit={submit} className="grid gap-3 bg-white p-4 md:grid-cols-2">{keys.map((key) => <label key={key} className="text-sm font-medium">{key}<textarea name={key} defaultValue={settings[key]?.value ?? ''} className="mt-1 w-full border px-3 py-2" /></label>)}<button disabled={saving} className="bg-primary px-4 py-2 font-semibold text-white disabled:bg-slate-400 md:col-span-2">{saving ? 'Čuvanje...' : 'Sačuvaj podešavanja'}</button></form>{!loading && keys.length === 0 && <div className="border border-slate-200 bg-white p-6">Nema podešavanja.</div>}</section>;
}
