# EthioBooks

EthioBooks is a **book discovery + review platform** with a **Next.js (App Router)** frontend and an **Express + Prisma** backend API.

## Run the project

### Frontend (Next.js)

```bash
npm install
npm run dev
```

- Opens at `http://localhost:3000`

### Backend (Express API)

```bash
cd server
npm install
npm run dev
```

- Runs at `http://localhost:5000`
- API base: `http://localhost:5000/api`

## Environment variables

### Frontend

- **`NEXT_PUBLIC_API_URL`**: backend API base URL (defaults to `http://localhost:5000/api`)

### Backend (`server/.env`)

You’ll need to set at least:

- **`DATABASE_URL`**: Prisma database connection string
- **`FRONTEND_ORIGIN`**: the frontend origin (example: `http://localhost:3000`)
- **`JWT_SECRET`**: secret for JWT tokens (if auth routes use it)

## What’s inside

- **Frontend**: Next.js pages under `app/` (books, categories, reviews, auth pages, admin pages)
- **UI**: reusable components under `components/` (kept only the ones actually used)
- **API clients**: `lib/api/*` uses `NEXT_PUBLIC_API_URL` to talk to the backend
- **Backend**: `server/src` Express app, routes, controllers, services
- **Database**: `server/prisma` Prisma schema + seed script

## Presentation notes

See `PRESENTATION.md`.
