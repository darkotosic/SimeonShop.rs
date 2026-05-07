import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Price } from '@/components/Price';
import { ApiError, getProduct } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    const image = product.images?.find((img) => img.is_primary)?.image_url ?? product.images?.[0]?.image_url ?? product.image_url ?? undefined;
    return { title: product.seo_title ?? product.name, description: product.seo_description ?? product.short_description ?? product.description ?? undefined, alternates: { canonical: `/products/${product.slug}` }, openGraph: { title: product.name, description: product.short_description ?? product.description ?? undefined, url: `${siteUrl}/products/${product.slug}`, images: image ? [{ url: image, alt: product.name }] : undefined } };
  } catch { return { title: 'Proizvod' }; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try { product = await getProduct(slug); } catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
  const images = product.images?.length ? product.images : product.image_url ? [{ id: 0, image_url: product.image_url, alt_text: product.name, sort_order: 0, is_primary: true }] : [];
  const stock = product.effective_stock_quantity ?? product.stock_quantity;
  const productJsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.seo_description ?? product.short_description ?? product.description, image: images.map((image) => image.image_url), sku: product.sku ?? product.variants?.find((variant) => variant.sku)?.sku, url: `${siteUrl}/products/${product.slug}`, offers: { '@type': 'Offer', priceCurrency: product.currency, price: (product.price_cents / 100).toFixed(2), availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${siteUrl}/products/${product.slug}` } };
  return <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} /><section className="grid gap-4">{images.length ? <><img src={images[0].image_url} alt={images[0].alt_text ?? product.name} className="aspect-[4/5] w-full rounded-3xl bg-slate-100 object-cover" /><div className="grid grid-cols-4 gap-3">{images.slice(1, 5).map((image) => <img key={image.id} src={image.image_url} alt={image.alt_text ?? product.name} className="aspect-square rounded-2xl bg-slate-100 object-cover" />)}</div></> : <div className="flex aspect-[4/5] items-center justify-center rounded-3xl bg-slate-100 text-slate-500">Slika proizvoda uskoro</div>}</section><section><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{product.category?.name}</p><h1 className="mt-2 text-4xl font-bold text-primary">{product.name}</h1><div className="mt-4 flex items-baseline gap-3"><p className="text-2xl font-bold"><Price cents={product.price_cents} currency={product.currency} /></p>{product.compare_at_price_cents && <p className="text-slate-400 line-through"><Price cents={product.compare_at_price_cents} currency={product.currency} /></p>}</div><p className="mt-4 text-slate-700">{product.description ?? product.short_description}</p><div className="mt-6 grid gap-3 rounded-3xl border border-slate-200 p-5 text-sm text-slate-700"><p>Stanje: {stock > 0 ? `${stock} komada dostupno` : 'nema na stanju'}</p>{product.sku && <p>SKU: {product.sku}</p>}{product.variants?.length > 0 && <div><p className="font-semibold">Varijante</p><div className="mt-2 flex flex-wrap gap-2">{product.variants.filter((variant) => variant.is_active).map((variant) => <span key={variant.id} className="rounded-full border border-slate-300 px-3 py-1">{[variant.size, variant.color].filter(Boolean).join(' / ') || variant.sku} · {variant.stock_quantity} kom.</span>)}</div></div>}</div><div className="mt-6"><AddToCartButton product={product} /></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><article className="rounded-3xl bg-slate-50 p-5"><h2 className="font-bold text-primary">Dostava i plaćanje</h2><p className="mt-2 text-sm text-slate-600">Plaćanje pouzećem. Potvrđujemo porudžbinu pre slanja.</p></article><article className="rounded-3xl bg-slate-50 p-5"><h2 className="font-bold text-primary">Materijal</h2><p className="mt-2 text-sm text-slate-600">{product.material ?? 'Detalji o materijalu dostupni su na zahtev.'}</p></article><article className="rounded-3xl bg-slate-50 p-5 sm:col-span-2"><h2 className="font-bold text-primary">Održavanje</h2><p className="mt-2 text-sm text-slate-600">{product.care_instructions ?? 'Pratite oznaku na proizvodu i perite sa sličnim bojama.'}</p></article></div></section></main>;
}
