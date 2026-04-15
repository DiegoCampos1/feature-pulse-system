# Prompt 6 — Production Dockerfiles & Railway Deploy Prep

Prepare the project for Railway deployment. Do NOT commit.

## Frontend Dockerfile (`frontend/Dockerfile`)

Replace the current dev-only Dockerfile with a production-ready version:

- Base: `node:22-alpine`
- Accept `NEXT_PUBLIC_API_URL` as build ARG and set as ENV (needed at build time for Next.js)
- `npm install` then `COPY . .`
- Build with `npm run build` (unless `DEV=true` arg is set)
- Expose port 3000
- CMD: `npm run start -- -p ${PORT:-3000}` (Railway sets `PORT` dynamically)

## Frontend next.config.ts

Add `output: "standalone"` to the Next.js config — this is required for Railway/Docker deployments to produce a self-contained build:

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
};
```

## Backend Dockerfile (`backend/Dockerfile`)

Update to be production-ready:

- Base: `python:3.12-slim`
- Install requirements (support DEV arg for dev deps)
- COPY source
- Run `collectstatic --noinput` when not DEV (static files served by WhiteNoise)
- CMD: `python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2`

## Backend settings.py

Add `CSRF_TRUSTED_ORIGINS` support for production:

```python
CSRF_TRUSTED_ORIGINS = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    "http://localhost:3000",
).split(",")
```

## docker-compose.yml

Keep the current dev docker-compose.yml unchanged — it should remain dev-focused. The Railway deployment uses Dockerfiles directly, not docker-compose.

## Railway Environment Variables Reference

Add a section to README.md under "Deploy" documenting the env vars needed on Railway for each service:

### Backend (api) service:
- `DATABASE_URL` — provided automatically by Railway PostgreSQL plugin
- `DJANGO_SECRET_KEY` — strong random secret for production
- `DEBUG` — `false`
- `ALLOWED_HOSTS` — Railway domain (e.g., `api-production-xxxx.up.railway.app`)
- `CORS_ALLOWED_ORIGINS` — Frontend Railway URL (e.g., `https://featurepulse-production-xxxx.up.railway.app`)
- `CSRF_TRUSTED_ORIGINS` — Same as CORS_ALLOWED_ORIGINS
- `PORT` — set automatically by Railway

### Frontend (web) service:
- `NEXT_PUBLIC_API_URL` — Backend Railway URL + `/api/v1` (e.g., `https://api-production-xxxx.up.railway.app/api/v1`)
- `PORT` — set automatically by Railway

Do NOT commit.
