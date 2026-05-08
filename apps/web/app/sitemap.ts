import type { MetadataRoute } from 'next';
import { getProducts, type Product } from '@/lib/api';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://simeonshop.rs').replace(/\/$/, '');
const now = new Date();

const staticPaths = [
  '',
  '/products',
  '/about',
  '/contact',
  '/shipping',
  '/returns',
  '/size-guide',
  '/privacy-policy',
  '/terms-and-conditions',
];

const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
  url: `${siteUrl}${path}`,
  lastModified: now,
  changeFrequency: path === '' || path === '/products' ? 'daily' : 'monthly',
  priority: path === '' ? 1 : path === '/products' ? 0.9 : 0.6,
}));

async function getAllActiveProducts(): Promise<Product[]> {
  const pageSize = 100;
  const products: Product[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await getProducts({ page, page_size: pageSize });
    products.push(...response.items.filter((product) => product.is_active));
    totalPages = response.pages || 1;
    page += 1;
  } while (page <= totalPages);

  return products;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await getAllActiveProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${siteUrl}/products/${encodeURIComponent(product.slug)}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
