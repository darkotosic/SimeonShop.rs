import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://simeonshop.rs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/products', '/about', '/contact', '/privacy-policy', '/terms-and-conditions'].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }));
  try {
    const products = await getProducts({ page_size: 60 });
    return [...staticRoutes, ...products.items.map((product) => ({ url: `${siteUrl}/products/${product.slug}`, lastModified: new Date(product.updated_at) }))];
  } catch { return staticRoutes; }
}
