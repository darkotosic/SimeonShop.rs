'use client';

/* eslint-disable react-hooks/set-state-in-effect */


import { FormEvent, useEffect, useState } from 'react';
import type { StoreSetting } from '@/lib/api';
import { getAdminSettings, updateAdminSetting } from '@/lib/api';

const keys = ['store_phone', 'store_email', 'instagram_url', 'facebook_url', 'delivery_note', 'return_policy_short'];

export function AdminSettingsPanel() {
  const [settings, setSettings] = useState<Record<string, StoreSetting>>({});
  const load = async () => { const rows = await getAdminSettings(); setSettings(Object.fromEntries(rows.map((row) => [row.key, row]))); };
  useEffect(() => { load().catch(console.error); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); await Promise.all(keys.map((key) => updateAdminSetting(key, { value: String(form.get(key) || ''), value_type: 'string', is_public: true }))); await load(); }
  return <section className="space-y-4"><h2 className="text-xl font-bold text-primary">Podešavanja</h2><form onSubmit={submit} className="grid gap-3 bg-white p-4 md:grid-cols-2">{keys.map((key) => <label key={key} className="text-sm font-medium">{key}<textarea name={key} defaultValue={settings[key]?.value ?? ''} className="mt-1 w-full border px-3 py-2" /></label>)}<button className="bg-primary px-4 py-2 font-semibold text-white md:col-span-2">Sačuvaj podešavanja</button></form></section>;
}
