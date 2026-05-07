import type { Metadata } from 'next';
import Link from 'next/link';
import '../styles/globals.css';

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? 'Simeon Shop';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} | Online prodavnica garderobe`,
    template: `%s | ${brandName}`,
  },
  description:
    'Simeon Shop je online prodavnica kvalitetne garderobe sa brzom isporukom, sigurnom porudžbinom i modernim dizajnom.',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: brandName,
    title: `${brandName} | Online prodavnica garderobe`,
    description: 'Kvalitetna garderoba, brza isporuka i jednostavna porudžbina.',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: brandName, url: siteUrl },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: brandName, url: siteUrl },
  ];
  return (
    <html lang="sr">
      <body className="min-h-screen font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold tracking-wide text-primary">
              {brandName}
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
              <Link href="/products" className="hover:text-primary">
                Proizvodi
              </Link>
              <Link href="/cart" className="hover:text-primary">
                Korpa
              </Link>
              <Link href="/checkout" className="hover:text-primary">
                Checkout
              </Link>
              <Link href="/admin/login" className="hover:text-primary">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <p className="font-semibold text-primary">{brandName}</p>
              <p className="mt-2">Online prodavnica spremna za brz MVP i produkcioni rast.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/about">O nama</Link>
              <Link href="/contact">Kontakt</Link>
              <Link href="/products">Proizvodi</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/privacy-policy">Politika privatnosti</Link>
              <Link href="/terms-and-conditions">Uslovi korišćenja</Link>
              <span>dev@simeonshop.rs</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
