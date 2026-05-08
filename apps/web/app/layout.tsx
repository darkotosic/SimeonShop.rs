import type { Metadata } from 'next';
import Link from 'next/link';
import { loadPublicStoreSettings } from '@/lib/store-settings';
import '../styles/globals.css';

const fallbackBrandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? 'Simeon Shop';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const fallbackLogoUrl = process.env.NEXT_PUBLIC_LOGO_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${fallbackBrandName} | Online prodavnica garderobe`, template: `%s | ${fallbackBrandName}` },
  description: 'Simeon Shop je online prodavnica kvalitetne garderobe sa brzom isporukom, sigurnom porudžbinom i modernim dizajnom.',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: fallbackBrandName,
    title: `${fallbackBrandName} | Online prodavnica garderobe`,
    description: 'Kvalitetna garderoba, brza isporuka i jednostavna porudžbina.',
    images: fallbackLogoUrl ? [{ url: fallbackLogoUrl, alt: fallbackBrandName }] : undefined,
  },
  twitter: { card: 'summary_large_image' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await loadPublicStoreSettings();
  const brandName = settings.company_name ?? fallbackBrandName;
  const contactEmail = settings.store_email;
  const sameAs = [settings.instagram_url, settings.facebook_url].filter(Boolean);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brandName,
      url: siteUrl,
      logo: settings.logo_url,
      address: settings.company_address,
      sameAs,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: contactEmail,
          telephone: settings.store_phone,
          availableLanguage: ['sr'],
        },
      ],
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: brandName, url: siteUrl },
  ];

  return (
    <html lang="sr">
      <body className="min-h-screen font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold tracking-wide text-primary">{brandName}</Link>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
              <Link href="/products" className="hover:text-primary">Proizvodi</Link>
              <Link href="/shipping" className="hover:text-primary">Dostava</Link>
              <Link href="/returns" className="hover:text-primary">Povraćaj</Link>
              <Link href="/size-guide" className="hover:text-primary">Veličine</Link>
              <Link href="/cart" className="hover:text-primary">Korpa</Link>
              <Link href="/checkout" className="hover:text-primary">Checkout</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-4 lg:px-8">
            <div>
              <p className="font-semibold text-primary">{brandName}</p>
              <p className="mt-2">Online prodavnica garderobe sa fokusom na sigurnu porudžbinu i jasnu komunikaciju.</p>
              {settings.company_address && <p className="mt-2">{settings.company_address}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/about">O nama</Link>
              <Link href="/contact">Kontakt</Link>
              <Link href="/products">Proizvodi</Link>
              <Link href="/admin/login">Admin</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/shipping">Dostava</Link>
              <Link href="/returns">Povraćaj</Link>
              <Link href="/size-guide">Vodič za veličine</Link>
              <Link href="/terms-and-conditions">Uslovi kupovine</Link>
              <Link href="/privacy-policy">Politika privatnosti</Link>
            </div>
            <div className="flex flex-col gap-2">
              {settings.instagram_url && <a href={settings.instagram_url} rel="noreferrer" target="_blank">Instagram</a>}
              {settings.facebook_url && <a href={settings.facebook_url} rel="noreferrer" target="_blank">Facebook</a>}
              {contactEmail && <span>{contactEmail}</span>}
              {settings.store_phone && <span>{settings.store_phone}</span>}
              {!contactEmail && !settings.store_phone && <span>Kontakt podaci još nisu podešeni.</span>}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
