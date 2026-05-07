const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type ApiFetchOptions = RequestInit & { revalidate?: number; token?: string; publicGet?: boolean };

export async function apiFetch<T>(path: string, init: ApiFetchOptions = {}): Promise<T> {
  const method = init.method ?? 'GET';
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && method !== 'GET') headers.set('Content-Type', 'application/json');
  if (init.token) headers.set('Authorization', `Bearer ${init.token}`);

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: method === 'GET' && init.publicGet !== false ? undefined : 'no-store',
    next: method === 'GET' && init.publicGet !== false ? { revalidate: init.revalidate ?? 60 } : undefined,
  });

  if (!response.ok) {
    let details: unknown;
    try { details = await response.json(); } catch { details = await response.text(); }
    throw new ApiError(`API request failed with status ${response.status}`, response.status, details);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type Category = { id: number; name: string; slug: string; description?: string | null; sort_order: number; is_active: boolean };
export type ProductImage = { id: number; image_url: string; alt_text?: string | null; sort_order: number; is_primary: boolean };
export type ProductVariant = { id: number; sku?: string | null; size?: string | null; color?: string | null; price_cents?: number | null; stock_quantity: number; is_active: boolean };
export type Product = {
  id: number; name: string; slug: string; sku?: string | null; description?: string | null; category_id?: number | null; category?: Category | null;
  short_description?: string | null; price_cents: number; compare_at_price_cents?: number | null; currency: string; image_url?: string | null;
  stock_quantity: number; effective_stock_quantity?: number; material?: string | null; care_instructions?: string | null; seo_title?: string | null; seo_description?: string | null;
  is_active: boolean; images: ProductImage[]; variants: ProductVariant[]; created_at: string; updated_at: string;
};
export type ProductListResponse = { items: Product[]; total: number; page: number; page_size: number; pages: number };
export type CartLine = { lineId: string; productId: number; variantId?: number; name: string; slug: string; imageUrl?: string | null; sku?: string | null; variantLabel?: string; unitPriceCents: number; quantity: number; stockQuantity: number; currency: string };
export type GuestCheckoutPayload = { customer_name: string; customer_email?: string; customer_phone: string; shipping_city: string; shipping_postal_code: string; shipping_address: string; note?: string; items: { product_id: number; variant_id?: number; quantity: number }[] };
export type Order = { id: number; order_number: string; status: string; total_cents: number; currency: string; customer_name: string; created_at: string; items: { id: number; product_name: string; quantity: number; total_price_cents: number }[] };
export type AdminSummary = { new_orders: number; active_products: number; out_of_stock_products: number; latest_orders: Order[] };

const paramsToQuery = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') search.set(key, String(value)); });
  const q = search.toString();
  return q ? `?${q}` : '';
};

export const getProducts = (params: Record<string, string | number | undefined> = {}) => apiFetch<ProductListResponse>(`/api/v1/products/${paramsToQuery(params)}`, { publicGet: true });
export const getProduct = (slug: string) => apiFetch<Product>(`/api/v1/products/${encodeURIComponent(slug)}`, { publicGet: true });
export const getCategories = () => apiFetch<Category[]>('/api/v1/categories/', { publicGet: true });
export const createGuestOrder = (payload: GuestCheckoutPayload) => apiFetch<Order>('/api/v1/orders/guest-checkout', { method: 'POST', body: JSON.stringify(payload) });
export const adminLogin = async (email: string, password: string) => {
  const body = new URLSearchParams({ username: email, password });
  return apiFetch<{ access_token: string; token_type: string }>('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
};
export const getAdminSummary = (token: string) => apiFetch<AdminSummary>('/api/v1/admin/summary', { token, publicGet: false });
export const getAdminOrders = (token: string) => apiFetch<Order[]>('/api/v1/admin/orders', { token, publicGet: false });
export const updateAdminOrderStatus = (token: string, orderId: number, status: string) => apiFetch<Order>(`/api/v1/admin/orders/${orderId}/status`, { method: 'PATCH', token, body: JSON.stringify({ status }) });

export type HealthResponse = { status: string; message: string; version: string; environment: string };
