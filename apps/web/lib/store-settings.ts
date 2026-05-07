import { getPublicStoreSettings, type PublicStoreSettings } from './api';

export const fallbackStoreSettings = (): PublicStoreSettings => ({
  store_phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+381 00 000 000',
  store_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'dev@simeonshop.rs',
  instagram_url: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? null,
  facebook_url: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? null,
  delivery_note: process.env.NEXT_PUBLIC_DELIVERY_NOTE ?? 'Porudžbine šaljemo nakon potvrde dostupnosti. Plaćanje je moguće pouzećem.',
  return_policy_short: process.env.NEXT_PUBLIC_RETURN_POLICY_SHORT ?? 'Zamena ili povraćaj su mogući za nekorišćene proizvode u originalnom stanju.',
  company_name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? process.env.NEXT_PUBLIC_BRAND_NAME ?? 'Simeon Shop',
  company_address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? null,
  company_registration_number: process.env.NEXT_PUBLIC_COMPANY_REGISTRATION_NUMBER ?? null,
  company_tax_id: process.env.NEXT_PUBLIC_COMPANY_TAX_ID ?? null,
  logo_url: process.env.NEXT_PUBLIC_LOGO_URL ?? null,
});

export async function loadPublicStoreSettings(): Promise<PublicStoreSettings> {
  const fallback = fallbackStoreSettings();
  try {
    const settings = await getPublicStoreSettings();
    return { ...fallback, ...settings };
  } catch {
    return fallback;
  }
}
