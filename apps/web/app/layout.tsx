import type { Metadata } from 'next';
import Link from 'next/link';
import '../styles/globals.css';

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? 'Simeon Shop';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;
const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'dev@simeonshop.rs';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${brandName} | Online prodavnica garderobe`, template: `%s | ${brandName}` },
  description: 'Simeon Shop je online prodavnica kvalitetne garderobe sa brzom isporukom, sigurnom porudžbinom i modernim dizajnom.',
  openGraph: { type: 'website', url: siteUrl, siteName: brandName, title: `${brandName} | Online prodavnica garderobe`, description: 'Kvalitetna garderoba, brza isporuka i jednostavna porudžbina.', images: logoUrl ? [{ url: logoUrl, alt: brandName }] : undefined },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sameAs = [instagramUrl, facebookUrl].filter(Boolean);
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: brandName, url: siteUrl, logo: logoUrl, sameAs, contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: contactEmail, availableLanguage: ['sr'] }] },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: brandName, url: siteUrl },
  ];
  return <html lang="sr"><body className="min-h-screen font-sans antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"><nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"><Link href="/" className="text-xl font-bold tracking-wide text-primary">{brandName}</Link><div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700"><Link href="/products" className="hover:text-primary">Proizvodi</Link><Link href="/shipping" className="hover:text-primary">Dostava</Link><Link href="/returns" className="hover:text-primary">Povraćaj</Link><Link href="/size-guide" className="hover:text-primary">Veličine</Link><Link href="/cart" className="hover:text-primary">Korpa</Link><Link href="/checkout" className="hover:text-primary">Checkout</Link></div></nav></header>{children}<footer className="border-t border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-4 lg:px-8"><div><p className="font-semibold text-primary">{brandName}</p><p className="mt-2">Online prodavnica garderobe sa fokusom na sigurnu porudžbinu i jasnu komunikaciju.</p></div><div className="flex flex-col gap-2"><Link href="/about">O nama</Link><Link href="/contact">Kontakt</Link><Link href="/products">Proizvodi</Link><Link href="/admin/login">Admin</Link></div><div className="flex flex-col gap-2"><Link href="/shipping">Dostava</Link><Link href="/returns">Povraćaj</Link><Link href="/size-guide">Vodič za veličine</Link><Link href="/terms-and-conditions">Uslovi kupovine</Link></div><div className="flex flex-col gap-2"><Link href="/privacy-policy">Politika privatnosti</Link>{instagramUrl && <a href={instagramUrl} rel="noreferrer" target="_blank">Instagram</a>}{facebookUrl && <a href={facebookUrl} rel="noreferrer" target="_blank">Facebook</a>}<span>{contactEmail}</span></div></div></footer></body></html>;
}
