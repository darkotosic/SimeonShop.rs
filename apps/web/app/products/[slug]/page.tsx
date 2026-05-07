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
    return { title: product.seo_title ?? product.name, description: product.seo_description ?? product.short_description ?? product.description ?? undefined };
  } catch { return { title: 'Proizvod' }; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try { product = await getProduct(slug); } catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
  const images = product.images?.length ? product.images : product.image_url ? [{ id: 0, image_url: product.image_url, alt_text: product.name, sort_order: 0, is_primary: true }] : [];
  const stock = product.effective_stock_quantity ?? product.stock_quantity;
  const productJsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.seo_description ?? product.short_description ?? product.description, image: images.map((image) => image.image_url), sku: product.sku, offers: { '@type': 'Offer', priceCurrency: product.currency, price: (product.price_cents / 100).toFixed(2), availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${siteUrl}/products/${product.slug}` } };
  return <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} /><section className="grid gap-4">{images.length ? images.map((image) => <img key={image.id} src={image.image_url} alt={image.alt_text ?? product.name} className="aspect-[4/5] w-full bg-slate-100 object-cover" />) : <div className="flex aspect-[4/5] items-center justify-center bg-slate-100 text-slate-500">Slika proizvoda uskoro</div>}</section><section><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{product.category?.name}</p><h1 className="mt-2 text-3xl font-bold text-primary">{product.name}</h1><p className="mt-4 text-2xl font-bold"><Price cents={product.price_cents} currency={product.currency} /></p><p className="mt-4 text-slate-700">{product.description ?? product.short_description}</p><div className="mt-6 rounded border border-slate-200 p-4 text-sm text-slate-700"><p>Stanje: {stock > 0 ? `${stock} komada dostupno` : 'nema na stanju'}</p>{product.material && <p>Materijal: {product.material}</p>}{product.care_instructions && <p>Održavanje: {product.care_instructions}</p>}</div><div className="mt-6"><AddToCartButton product={product} /></div></section></main>;
}
