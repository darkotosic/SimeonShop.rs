# SimeonShop.rs Production Runbook

## Architecture

- **Frontend:** Next.js App Router deployed on Netlify for `https://simeonshop.rs`.
- **Backend:** FastAPI deployed on Render.com.
- **Database:** Render PostgreSQL managed database.
- **Media:** Cloudinary for product image uploads.

## Verify frontend

1. Open `https://simeonshop.rs` and confirm homepage renders.
2. Open `/products`, one product detail page, `/cart`, `/checkout`, and legal pages.
3. Confirm Netlify build used `npm run build` from `apps/web`.

## Verify backend health

```bash
curl -fsS https://<render-api-host>/api/v1/health
```

Expected: JSON with `status: "ok"` and `database: "ok"`.

## Verify CORS

- `ALLOWED_ORIGINS` must include `https://simeonshop.rs`.
- Browser requests from the storefront to backend should not show CORS errors.

## Verify environment variables

Backend required:

- `APP_ENV=production`
- `DATABASE_URL`
- `JWT_SECRET`
- `ALLOWED_ORIGINS`
- `FRONTEND_URL`
- `MEDIA_PROVIDER=cloudinary`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Frontend required:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL=https://simeonshop.rs`
- `API_BASE_URL` for server-side/proxy calls where needed

## Run migrations

Render start command uses `apps/api/start.sh`, which runs:

```bash
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" --proxy-headers
```

For manual verification in Render shell:

```bash
cd /app
alembic upgrade head
```

## Create the first admin

1. Temporarily set a strong `BOOTSTRAP_ADMIN_TOKEN` in Render.
2. Call the bootstrap admin endpoint documented in the API README or internal deployment notes.
3. Confirm admin can log in at `/admin/login`.

## Remove BOOTSTRAP_ADMIN_TOKEN

After the first admin is created:

1. Remove `BOOTSTRAP_ADMIN_TOKEN` from Render environment.
2. Redeploy/restart backend.
3. Confirm public registration/bootstrap cannot create another admin.

## Verify an order

1. Add an active product to cart.
2. Complete checkout and accept terms.
3. Confirm success page shows an order number.
4. In admin, verify order items include product snapshot data, variant label, and internal note field.

## Verify email notifications

- Confirm SMTP variables are set if email notifications are enabled.
- Checkout must remain successful even if email delivery fails.
- Check backend logs for email errors.

## Verify logs

- Render backend logs: health checks, checkout, admin actions, migration startup.
- Netlify deploy logs: build and runtime errors.

## Verify Sentry

If `SENTRY_DSN` is configured:

1. Trigger a controlled non-sensitive error in staging.
2. Confirm it appears in Sentry with the correct environment.
3. Never include secrets or customer payment data in Sentry events.

## Restore a database backup

1. Download or select a Render PostgreSQL backup/snapshot.
2. Restore into a new database first when possible.
3. Point staging backend to restored database and validate health, products, and orders.
4. Promote only after validation.

## Rollback procedure

1. Roll back Netlify to the previous successful deploy.
2. Roll back Render backend to the previous successful deploy.
3. If migrations were applied, assess whether downgrade is safe; avoid destructive rollback without backup.
4. If needed, restore PostgreSQL from the latest known-good backup.
5. Re-run health, checkout smoke test, admin login, and product detail checks.
