import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery, getProductImages } from '@/components/ProductGallery';
import { ProductPurchaseBox } from '@/components/ProductPurchaseBox';
import { ApiError, getProduct } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    const image = getProductImages(product)[0]?.image_url;
    return {
      title: product.seo_title ?? product.name,
      description: product.seo_description ?? product.short_description ?? product.description ?? undefined,
      alternates: { canonical: `/products/${product.slug}` },
      openGraph: {
        title: product.name,
        description: product.short_description ?? product.description ?? undefined,
        url: `${siteUrl}/products/${product.slug}`,
        images: image ? [{ url: image, alt: product.name }] : undefined,
      },
    };
  } catch {
    return { title: 'Proizvod' };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    product = await getProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const images = getProductImages(product);
  const stock = product.effective_stock_quantity ?? product.stock_quantity;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo_description ?? product.short_description ?? product.description,
    image: images.map((image) => image.image_url),
    sku: product.sku ?? product.variants?.find((variant) => variant.sku)?.sku,
    url: `${siteUrl}/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: (product.price_cents / 100).toFixed(2),
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/products/${product.slug}`,
    },
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <ProductGallery product={product} />
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{product.category?.name}</p>
        <h1 className="mt-2 text-4xl font-bold text-primary">{product.name}</h1>
        <p className="mt-4 text-slate-700">{product.description ?? product.short_description}</p>
        <ProductPurchaseBox product={product} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl bg-slate-50 p-5">
            <h2 className="font-bold text-primary">Dostava i plaćanje</h2>
            <p className="mt-2 text-sm text-slate-600">Plaćanje pouzećem. Potvrđujemo porudžbinu pre slanja.</p>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <h2 className="font-bold text-primary">Povraćaj i zamena</h2>
            <p className="mt-2 text-sm text-slate-600">Zamena veličine i povraćaj su dostupni za nekorišćene proizvode u originalnom stanju.</p>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <h2 className="font-bold text-primary">Vodič za veličine</h2>
            <p className="mt-2 text-sm text-slate-600">Ako ste između dve veličine, kontaktirajte nas pre poručivanja.</p>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <h2 className="font-bold text-primary">Materijal</h2>
            <p className="mt-2 text-sm text-slate-600">{product.material ?? 'Detalji o materijalu dostupni su na zahtev.'}</p>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5 sm:col-span-2">
            <h2 className="font-bold text-primary">Održavanje</h2>
            <p className="mt-2 text-sm text-slate-600">{product.care_instructions ?? 'Pratite oznaku na proizvodu i perite sa sličnim bojama.'}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
