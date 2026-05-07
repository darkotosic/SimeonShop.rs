# SimeonShop.rs

Enterprise-grade e-commerce MVP for selling clothing through Instagram/Facebook channels with a decoupled storefront, protected admin dashboard, FastAPI backend and PostgreSQL database.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, App Router, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, Pydantic, JWT authentication, SlowAPI rate limiting
- **Database:** PostgreSQL in production, Alembic migrations, SQLite-compatible test setup
- **Deployment:** Netlify frontend, Render backend, Render PostgreSQL

## Core API endpoints

- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/bootstrap-admin`
- `GET /api/v1/products`
- `GET /api/v1/products/{slug}`
- `GET /api/v1/categories`
- `POST /api/v1/orders/guest-checkout`

## Admin API endpoints

All admin endpoints require `Authorization: Bearer <token>` from an admin user:

- `GET /api/v1/admin/summary`
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `PATCH /api/v1/admin/products/{product_id}`
- `DELETE /api/v1/admin/products/{product_id}` (soft delete)
- `GET /api/v1/admin/orders`
- `PATCH /api/v1/admin/orders/{order_id}/status`
- `GET /api/v1/admin/categories`
- `POST /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/{category_id}`
- `DELETE /api/v1/admin/categories/{category_id}` (soft delete)
- `GET /api/v1/admin/settings`
- `PATCH /api/v1/admin/settings/{key}`

## Local development

### Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd apps/web
cp .env.example .env.local
npm ci
npm run dev
```

## Required environment variables

See `apps/api/.env.example` and `apps/web/.env.example`. Do not hardcode API URLs, JWT secrets, SMTP credentials, admin bootstrap tokens or database URLs.

## Quality gates

```bash
cd apps/api
python -m compileall app
pytest
alembic upgrade head
```

```bash
cd apps/web
npm ci
npm run lint
npm run type-check
npm run build
```
