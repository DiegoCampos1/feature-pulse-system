# FeaturePulse

**Shape the future of your product.**

A full-stack feature voting system where users submit, discover, and prioritize product feature requests. Built with Django REST Framework and Next.js as a production-ready monorepo with Docker Compose orchestration.

## Screenshots

| Dark Mode | Light Mode |
|-----------|------------|
| ![Home - Dark](./docs/screenshots/home-dark.png) | ![Home - Light](./docs/screenshots/home-light.png) |
| ![Login](./docs/screenshots/login.png) | ![Submit Feature](./docs/screenshots/submit-feature.png) |

## Tech Stack

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=fff)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=fff)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000?logo=shadcnui)

- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **API Client**: Axios + TanStack React Query
- **Theme**: next-themes (dark/light mode)
- **Notifications**: Sonner

### Backend

![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django&logoColor=fff)
![DRF](https://img.shields.io/badge/DRF-3.15-A30000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=fff)

- **Auth**: JWT via djangorestframework-simplejwt
- **Filtering**: django-filter
- **CORS**: django-cors-headers
- **Static Files**: WhiteNoise

### Infrastructure

![Docker](https://img.shields.io/badge/Docker_Compose-3_services-2496ED?logo=docker&logoColor=fff)

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Git](https://git-scm.com/)

### Run the project

```bash
# Clone the repository
git clone git@github.com:DiegoCampos1/feature-pulse-system.git
cd feature-pulse-system

# Start all services
docker compose up --build
```

| Service  | URL                                  |
|----------|--------------------------------------|
| Frontend | http://localhost:3000                 |
| API      | http://localhost:8000/api/v1/         |
| Admin    | http://localhost:8000/admin/          |

### Seed demo data

```bash
docker compose exec api python manage.py seed_features
```

This creates 4 users and 10 sample feature requests with random votes.

**Test credentials:**

| Email               | Password      |
|---------------------|---------------|
| test@example.com    | testpass123   |

## Project Structure

```
feature-pulse-system/
├── backend/
│   ├── apps/
│   │   ├── accounts/       # User model, auth, JWT endpoints
│   │   └── features/       # Feature requests, voting, seed command
│   ├── config/             # Django settings, urls, wsgi, asgi
│   ├── core/               # Shared mixins (UUIDMixin, TimestampMixin)
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # UI components (shadcn/ui + custom)
│   │   ├── hooks/          # React Query hooks
│   │   ├── lib/            # API client, providers, utils
│   │   ├── stores/         # Zustand auth store
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── CLAUDE.md
```

## API Endpoints

### Auth (`/api/v1/auth/`)

| Method | Endpoint      | Description              | Auth     |
|--------|---------------|--------------------------|----------|
| POST   | `/register/`  | Create a new user        | Public   |
| POST   | `/login/`     | Get JWT token pair       | Public   |
| POST   | `/refresh/`   | Refresh access token     | Public   |
| GET    | `/me/`        | Get current user profile | Required |

### Features (`/api/v1/features/`)

| Method | Endpoint        | Description                   | Auth          |
|--------|-----------------|-------------------------------|---------------|
| GET    | `/`             | List features (search, sort)  | Public        |
| POST   | `/`             | Create a feature request      | Required      |
| GET    | `/{id}/`        | Get feature detail            | Public        |
| PATCH  | `/{id}/`        | Update feature (owner only)   | Owner         |
| DELETE | `/{id}/`        | Delete feature (owner only)   | Owner         |
| POST   | `/{id}/vote/`   | Toggle vote on a feature      | Required      |

**Query parameters** for `GET /`: `?ordering=-vote_count|vote_count|-created_at|created_at` and `?search=<term>` (searches title and description).

## Features

- **Feature Requests** — Submit, edit, and delete feature ideas
- **Voting** — One-click toggle vote with optimistic UI updates
- **Search & Sort** — Filter by keyword, sort by popularity or date
- **JWT Authentication** — Register, login, auto-refresh tokens
- **Dark/Light Mode** — Dark by default, toggle with persistence
- **Responsive Design** — Mobile-first layout, works on all screen sizes
- **Colored Status Badges** — Visual status indicators per feature
- **Skeleton Loading** — Shimmer placeholders while data loads
- **Vote Animations** — Pulse effect and accent border on voted cards

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Django + Next.js** | Django provides a battle-tested ORM, admin panel, and auth system. Next.js offers SSR, file-based routing, and a modern React DX. Together they cover the full stack with clear separation. |
| **JWT Authentication** | Stateless auth that works naturally with a decoupled frontend/backend. Access + refresh token rotation balances security with UX. |
| **Denormalized `vote_count`** | Avoids an aggregate query on every feature list request. Updated atomically on vote toggle — fast reads at the cost of a slightly more complex write. |
| **Docker Compose** | Single command to run all three services (PostgreSQL, Django, Next.js) with consistent environments. Volume mounts enable hot reload in development. |
| **Mobile-first** | All layouts designed for 375px first, then scaled up with `sm:` breakpoints. Ensures the most constrained viewport is always usable. |
| **UUID Primary Keys** | Prevents enumeration attacks and avoids sequential ID conflicts in distributed scenarios. All models inherit from `UUIDMixin`. |
