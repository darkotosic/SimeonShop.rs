# SimeonShop.rs

Enterprise-ready e-commerce monorepo for `simeonshop.rs`.

## Architecture

- Frontend: Next.js, TypeScript, Tailwind CSS, hosted on Netlify
- Backend: FastAPI, hosted on Render.com
- Database target: PostgreSQL on Render.com
- Admin: protected dashboard under `/admin`

## Project Structure

```txt
apps/
  web/
    app/
    components/
    lib/
    styles/
  api/
    app/
      api/v1/
      core/
      main.py
README.md
AGENTS.md
netlify.toml
```

## Frontend

```bash
cd apps/web
npm install
npm run dev
```

Local URL: `http://localhost:3000`

Required environment:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BRAND_NAME=Simeon Shop
NEXT_PUBLIC_DEFAULT_LOCALE=sr
```

## Backend

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Local API docs: `http://localhost:8000/api/docs`

Required environment:

```env
APP_ENV=development
APP_NAME=SimeonShop API
API_PREFIX=/api/v1
DATABASE_URL=postgresql://user:password@localhost:5432/simeonshop
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000
JWT_SECRET=change-me
```

## Current Routes

Frontend:

- `/`
- `/products`
- `/cart`
- `/checkout`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-and-conditions`
- `/admin/login`
- `/admin/dashboard`

Backend:

- `GET /api/v1/health`
- `GET /api/v1/products`
- `POST /api/v1/orders`

## Quality Gates

Frontend:

```bash
cd apps/web
npm run lint
npm run type-check
npm run build
```

Backend:

```bash
cd apps/api
pytest
```

## Deployment

Netlify uses `netlify.toml` with `apps/web` as the build base.

Render web service:

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
