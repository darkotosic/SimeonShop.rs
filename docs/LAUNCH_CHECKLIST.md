# SimeonShop.rs Launch Checklist

## Backend

- [ ] `pytest` passes in `apps/api`.
- [ ] `alembic upgrade head` passes against production database.
- [ ] `/api/v1/health` returns `status=ok` and `database=ok`.
- [ ] CORS allows `https://simeonshop.rs` and does not use `*` in production.
- [ ] `JWT_SECRET` is strong and not a default value.
- [ ] `BOOTSTRAP_ADMIN_TOKEN` is removed after first admin creation.
- [ ] SMTP settings are configured or explicitly disabled with checkout still succeeding.
- [ ] Sentry is configured if required.
- [ ] Rate limits are active for auth and checkout.

## Frontend

- [ ] `npm ci` passes in `apps/web`.
- [ ] `npm run lint` passes.
- [ ] `npm run type-check` passes.
- [ ] `npm run build` passes.
- [ ] `/sitemap.xml` includes static routes and active products.
- [ ] `/robots.txt` disallows `/admin`, `/checkout`, and `/checkout/success`.
- [ ] Product detail gallery, variant selection, price, SKU, and stock work.
- [ ] Cart keeps variant label and product image.
- [ ] Checkout requires accepted terms and creates order.
- [ ] Admin login works.
- [ ] Admin CRUD for products, categories, images, variants, settings, and orders works.

## Business

- [ ] Legal pages are reviewed by the business/legal owner.
- [ ] Contact email and phone are correct.
- [ ] Company name, address, registration number, and tax ID are correct.
- [ ] Delivery information is accurate.
- [ ] Return/exchange policy is accurate.
- [ ] Size guide is accurate.
- [ ] Test order is placed end-to-end.
- [ ] Admin status update is tested.
