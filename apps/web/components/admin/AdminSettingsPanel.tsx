'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { StoreSetting } from '@/lib/api';
import { ApiError, getAdminSettings, updateAdminSetting } from '@/lib/api';

type PublicSettingConfig = {
  key: string;
  label: string;
  description: string;
  field: 'input' | 'textarea';
  inputType?: 'email' | 'tel' | 'url' | 'text';
  defaultPublic: boolean;
};

const publicSettings: PublicSettingConfig[] = [
  {
    key: 'store_phone',
    label: 'Telefon prodavnice',
    description: 'Prikazuje se u footeru, na kontakt strani i pravnim stranama kada je unet.',
    field: 'input',
    inputType: 'tel',
    defaultPublic: true,
  },
  {
    key: 'store_email',
    label: 'Email prodavnice',
    description: 'Prikazuje se u footeru, na kontakt strani i kao kontakt za kupce.',
    field: 'input',
    inputType: 'email',
    defaultPublic: true,
  },
  {
    key: 'instagram_url',
    label: 'Instagram URL',
    description: 'Prikazuje se u footeru kao link ka Instagram profilu.',
    field: 'input',
    inputType: 'url',
    defaultPublic: true,
  },
  {
    key: 'facebook_url',
    label: 'Facebook URL',
    description: 'Prikazuje se u footeru kao link ka Facebook stranici.',
    field: 'input',
    inputType: 'url',
    defaultPublic: true,
  },
  {
    key: 'delivery_note',
    label: 'Napomena o dostavi',
    description: 'Prikazuje se na strani za dostavu i u uslovima kupovine.',
    field: 'textarea',
    defaultPublic: true,
  },
  {
    key: 'return_policy_short',
    label: 'Kratka politika povraćaja',
    description: 'Prikazuje se na strani za povraćaj i u uslovima kupovine.',
    field: 'textarea',
    defaultPublic: true,
  },
  {
    key: 'company_name',
    label: 'Naziv firme',
    description: 'Prikazuje se na kontakt strani, pravnim stranama i koristi se kao naziv prodavca.',
    field: 'input',
    inputType: 'text',
    defaultPublic: true,
  },
  {
    key: 'company_address',
    label: 'Adresa firme',
    description: 'Prikazuje se na kontakt strani, u footeru i pravnim stranama kada je uneta.',
    field: 'textarea',
    defaultPublic: true,
  },
  {
    key: 'company_registration_number',
    label: 'Matični broj firme',
    description: 'Prikazuje se na kontakt strani i pravnim stranama kada je unet.',
    field: 'input',
    inputType: 'text',
    defaultPublic: true,
  },
  {
    key: 'company_tax_id',
    label: 'PIB firme',
    description: 'Prikazuje se na kontakt strani i pravnim stranama kada je unet.',
    field: 'input',
    inputType: 'text',
    defaultPublic: true,
  },
  {
    key: 'logo_url',
    label: 'URL logotipa',
    description: 'Koristi se za SEO metadata i strukturirane podatke sajta.',
    field: 'input',
    inputType: 'url',
    defaultPublic: true,
  },
];

function message(error: unknown) {
  return error instanceof ApiError ? `Admin API greška (${error.status}).` : 'Podešavanja trenutno nisu dostupna.';
}

export function AdminSettingsPanel() {
  const [settings, setSettings] = useState<Record<string, StoreSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getAdminSettings();
      setSettings(Object.fromEntries(rows.map((row) => [row.key, row])));
    } catch (err) {
      setError(message(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const form = new FormData(event.currentTarget);
    try {
      await Promise.all(
        publicSettings.map((setting) => updateAdminSetting(setting.key, {
          value: String(form.get(setting.key) || ''),
          value_type: 'string',
          is_public: form.get(`${setting.key}_is_public`) === 'on',
        })),
      );
      setSuccess('Podešavanja su sačuvana.');
      await load();
    } catch (err) {
      setError(message(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-primary">Javna podešavanja prodavnice</h2>
        <p className="mt-1 text-sm text-slate-600">Upravljajte podacima koji se prikazuju na javnom sajtu.</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Podaci označeni kao javni prikazuju se na sajtu i mogu biti vidljivi kupcima i pretraživačima.
      </div>

      {loading && <div className="border border-slate-200 bg-white p-6">Učitavanje podešavanja...</div>}
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">{success}</div>}

      {!loading && (
        <form onSubmit={submit} className="grid gap-4 bg-white p-4 md:grid-cols-2">
          {publicSettings.map((setting) => {
            const savedSetting = settings[setting.key];
            const isPublic = savedSetting?.is_public ?? setting.defaultPublic;

            return (
              <div key={setting.key} className="rounded-lg border border-slate-200 p-4">
                <label className="block text-sm font-semibold text-slate-900" htmlFor={setting.key}>
                  {setting.label}
                </label>
                <p className="mt-1 text-xs text-slate-500">{setting.description}</p>
                {setting.field === 'textarea' ? (
                  <textarea
                    id={setting.key}
                    name={setting.key}
                    defaultValue={savedSetting?.value ?? ''}
                    rows={4}
                    className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <input
                    id={setting.key}
                    name={setting.key}
                    type={setting.inputType ?? 'text'}
                    defaultValue={savedSetting?.value ?? ''}
                    className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                )}
                <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                  <input
                    name={`${setting.key}_is_public`}
                    type="checkbox"
                    defaultChecked={isPublic}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Javno prikazuj ovaj podatak</span>
                </label>
                <p className="mt-2 text-xs text-slate-400">Tip vrednosti: string</p>
              </div>
            );
          })}
          <button
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 font-semibold text-white disabled:bg-slate-400 md:col-span-2"
            type="submit"
          >
            {saving ? 'Čuvanje...' : 'Sačuvaj podešavanja'}
          </button>
        </form>
      )}
    </section>
  );
}
