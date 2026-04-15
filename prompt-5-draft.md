# Prompt 5 — README.md

Create a professional README.md for the project. Do NOT commit.

## Requirements

The README should include:

### Header
- Project name "FeaturePulse" with a short tagline
- A brief description (2-3 sentences) explaining what the system does

### Screenshots
- Add a screenshots section with placeholders for: dark mode home page, light mode home page, login page, submit feature page
- Use relative paths like `./docs/screenshots/home-dark.png` — I will add the actual images later

### Tech Stack
- List all technologies used, organized by Frontend, Backend, and Infrastructure
- Keep it concise, use badges if possible (shields.io)

### Getting Started
Step-by-step instructions to run locally:
1. Prerequisites (Docker, Docker Compose, Git)
2. Clone the repo
3. `docker compose up --build`
4. Access URLs (frontend, API, admin)
5. Seed data command for demo content
6. Test credentials from seed

### Project Structure
- Show the monorepo folder structure (top 2 levels)

### API Endpoints
- Table with method, endpoint, description, and auth requirement
- Group by Auth and Features

### Features
- Bullet list of implemented features (submit, vote, search, sort, auth, dark mode, responsive, etc.)

### Architecture Decisions
- Brief explanation of key decisions: why Django + Next.js, why JWT, why denormalized vote_count, why Docker, mobile-first approach

Do NOT commit.
