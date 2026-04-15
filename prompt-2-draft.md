# Prompt 2 — Core Feature Implementation

Implement the full core feature set for FeaturePulse. Do NOT commit — I will review and commit myself.

## Backend — Django Models

### `apps/accounts/`
- Use Django's built-in `AbstractUser` as custom User model
- Fields: `email` (unique, used as USERNAME_FIELD), `username`, `first_name`, `last_name`
- Inherit from `UUIDMixin` and `TimestampMixin`
- Register in Django admin

### `apps/features/`

**FeatureRequest model:**
- Inherits `UUIDMixin`, `TimestampMixin`
- `title` — CharField(max_length=255)
- `description` — TextField
- `created_by` — ForeignKey to User (related_name="feature_requests")
- `status` — CharField with choices: `open`, `under_review`, `planned`, `in_progress`, `completed`, `declined` (default: `open`)
- `vote_count` — PositiveIntegerField(default=0) — denormalized count for fast sorting
- Ordering: `-vote_count`, `-created_at`
- `__str__`: return title

**Vote model:**
- Inherits `UUIDMixin`, `TimestampMixin`
- `user` — ForeignKey to User (related_name="votes")
- `feature_request` — ForeignKey to FeatureRequest (related_name="votes")
- `unique_together`: (`user`, `feature_request`) — one vote per user per feature
- On save/delete, update `feature_request.vote_count` (use Django signals or override save/delete)

Register both in Django admin.

## Backend — API Endpoints

All under `/api/v1/`. Use ViewSets + Router.

### Auth (`apps/accounts/`)
- `POST /api/v1/auth/register/` — Create new user (email, password, first_name, last_name). Public.
- `POST /api/v1/auth/login/` — JWT token pair (use simplejwt TokenObtainPairView). Public.
- `POST /api/v1/auth/refresh/` — Refresh token (use simplejwt TokenRefreshView). Public.
- `GET /api/v1/auth/me/` — Get current user profile. Auth required.

### Features (`apps/features/`)
- `GET /api/v1/features/` — List all feature requests with vote_count, ordered by popularity. **Public (no auth required).** Support query params: `?ordering=vote_count|-vote_count|created_at|-created_at` and `?search=` (search in title and description).
- `POST /api/v1/features/` — Create a new feature request. **Auth required.** Auto-set `created_by` from request.user.
- `GET /api/v1/features/{id}/` — Get feature detail. **Public.**
- `PATCH /api/v1/features/{id}/` — Update feature. **Auth required, only owner.**
- `DELETE /api/v1/features/{id}/` — Delete feature. **Auth required, only owner.**
- `POST /api/v1/features/{id}/vote/` — Toggle vote (vote if not voted, unvote if already voted). **Auth required.** Return updated vote_count and `has_voted` boolean.

### Serializers
- `FeatureRequestSerializer`: include all fields + `created_by` as nested (id, email, first_name) + `has_voted` (boolean, computed from request.user if authenticated, always false if anonymous)
- `FeatureRequestCreateSerializer`: only `title` and `description`
- `UserSerializer`: id, email, first_name, last_name
- `RegisterSerializer`: email, password, first_name, last_name (validate email uniqueness, password strength)

### Permissions
- Create custom permission `IsOwnerOrReadOnly` — allows edit/delete only if `obj.created_by == request.user`
- Feature list/detail: `AllowAny`
- Feature create/vote: `IsAuthenticated`
- Feature update/delete: `IsAuthenticated & IsOwnerOrReadOnly`

## Frontend — Pages & Components

Mobile-first design. Use shadcn/ui components throughout. All pages responsive.

### Layout (`src/app/layout.tsx`)
- Global providers: QueryClientProvider (TanStack), AuthProvider (context)
- Navbar component with: logo/app name "FeaturePulse", navigation links, auth buttons (Login/Register or User dropdown with logout)
- Toaster for notifications (shadcn toast)

### Auth Store (`src/stores/auth-store.ts`)
- Zustand store managing: `user`, `accessToken`, `refreshToken`, `isAuthenticated`
- Actions: `login`, `logout`, `setTokens`, `setUser`
- Persist tokens in cookies (js-cookie) for SSR compatibility
- Axios interceptor: attach Bearer token to requests, auto-refresh on 401

### API Client (`src/lib/api.ts`)
- Axios instance with `baseURL` from `NEXT_PUBLIC_API_URL`
- Request interceptor: attach JWT token
- Response interceptor: handle 401 → try refresh → if fails, logout

### Pages

**Home / Feature List (`src/app/page.tsx`)**
- Hero section: app name, tagline "Shape the future of our product", brief description
- Sort controls: "Most Voted" (default), "Newest", "Oldest"
- Search bar to filter features
- List of FeatureRequestCard components
- Floating action button (or prominent button) "Submit Feature" — if not logged in, show dialog prompting to login/register
- If user is not authenticated, show a subtle banner/toast: "Sign in to vote and submit features"

**Feature Request Card (`src/components/feature-card.tsx`)**
- Card with: title, description (truncated to 2-3 lines), vote count with upvote button, author name, time ago (relative date), status badge
- Upvote button: filled/highlighted if user has voted, click to toggle vote
- If not authenticated, clicking vote shows a tooltip/dialog: "Please sign in to vote"
- Animate vote count changes

**Login Page (`src/app/login/page.tsx`)**
- Form with: email, password
- Validation with react-hook-form + zod
- On success: redirect to home, store tokens
- Link to register page

**Register Page (`src/app/register/page.tsx`)**
- Form with: first_name, last_name, email, password, confirm_password
- Validation with react-hook-form + zod
- On success: auto-login and redirect to home
- Link to login page

**Submit Feature Dialog/Page (`src/app/features/new/page.tsx` or Dialog)**
- Form with: title, description
- Validation with react-hook-form + zod
- On success: redirect to home, show toast "Feature submitted!", new feature appears in list

### Hooks
- `useFeatures()` — TanStack Query hook for fetching feature list with sorting and search
- `useVote()` — TanStack mutation hook for toggling vote (optimistic update)
- `useAuth()` — hook that reads from zustand auth store

## Implementation Notes
- All API errors should show user-friendly toast messages
- Loading states with skeleton components (shadcn skeleton)
- Empty states when no features exist ("No feature requests yet. Be the first!")
- Mobile-first: design for 375px first, then scale up
- Use CSS Grid or Flexbox for the feature list layout
- Dark mode support is optional but nice to have
- Seed the database with a Django management command `seed_features` that creates a test user and 5-10 sample feature requests with votes

## Run and Verify
After implementing:
1. `docker compose up --build`
2. Run `docker compose exec api python manage.py migrate`
3. Run `docker compose exec api python manage.py seed_features` (if created)
4. Open http://localhost:3000 and verify:
   - Feature list loads (public, no auth)
   - Login/Register works
   - Submit feature works (auth required)
   - Vote toggle works (auth required)
   - Unauthenticated users see login prompt when trying to vote/submit
5. Use Playwright MCP to take a screenshot of the working app

Do NOT commit. Log this prompt in prompts.txt.
