## EthioBooks — project presentation notes

### 1) Title slide

- **Project**: EthioBooks
- **Type**: Book discovery + review platform
- **Stack**: Next.js (App Router) frontend + Express/Prisma backend API

### 2) What problem it solves

- Helps readers **discover books**, **browse by categories**, and **read/post reviews**
- Provides a simple **community-style** experience: favorites, latest reviews, and a curated landing page

### 3) Core features (user-facing)

- **Home**: hero + featured sections (popular books, categories, latest reviews, testimonials, about, call-to-action)
- **Books**
  - List books
  - Book details page (`/books/[id]`)
- **Categories**
  - List categories (`/categories`)
  - Category detail page (`/categories/[id]`) showing related books
- **Reviews**: browse reviews (`/reviews`)
- **Favorites**: saved books (`/favorites`)
- **Account**
  - Register (`/register`)
  - Login (`/login`)
  - Forgot/reset password (`/forgot-password`, `/reset-password`)
  - Profile (`/profile`)

### 4) Admin features

- Admin dashboard routes under `/admin/*`
  - **Users** management
  - **Books** management
  - **Categories** management
  - **Reviews** moderation
  - **Settings**

### 5) How the frontend works (high level)

- Built with **Next.js App Router**:
  - Pages live in `app/**/page.tsx`
  - Layout is defined in `app/layout.tsx`
- UI components live in `components/`:
  - `components/layout/*` for shared layout pieces like `Navbar` and `Footer`
  - `components/sections/*` for landing-page sections
  - `components/ui/*` for reusable primitives (buttons, inputs, dialogs, etc.)
- Theme support via `components/theme-provider.tsx` (uses `next-themes`)

### 6) How the frontend talks to the backend

- API wrapper lives in `lib/api/*`
- The base URL is controlled by:
  - **`NEXT_PUBLIC_API_URL`**
  - default: `http://localhost:5000/api`
- Requests are made with `fetch`/`axios` (depending on the module) and return JSON.

### 7) How the backend works (high level)

- Node/Express app in `server/src`
  - `server/src/app.ts` wires middlewares (CORS, helmet, rate limit, cookies, CSRF) + mounts routes at `/api`
  - `server/src/server.ts` starts the server (default port `5000`)
- Prisma handles database access in services
- The backend enforces:
  - **CORS** (allowed origin is `FRONTEND_ORIGIN`)
  - **CSRF** protection for cookie-based auth flows

### 8) Database & seed data

- Prisma schema and migrations are under `server/prisma`
- Seed script: `server/prisma/seed.ts`
  - Creates roles (admin/user)
  - Seeds categories
  - Seeds an admin account
  - Seeds a small set of sample books

### 9) Demo flow (what to show live)

- Start backend, then frontend
- Open home page and navigate:
  - Books list → open book details
  - Categories → open category detail
  - Register/Login pages (form validation)
  - Favorites and Reviews pages
  - Admin pages (show management screens)

### 10) Setup steps (quick)

- Frontend:

```bash
npm install
npm run dev
```

- Backend:

```bash
cd server
npm install
npm run dev
```

Run everything locally (frontend + backend + DB + Prisma Studio)
1) Start PostgreSQL (Database)
You need PostgreSQL running on your machine.

Option A (recommended on Windows): Install PostgreSQL (pgAdmin is fine too) and start the PostgreSQL service.
Create the database (example name from your env): EthioBooks_db
If you use pgAdmin: create a database named EthioBooks_db.

2) Backend (Express + Prisma)
Open a terminal in EthioBooks\server and run:

cd c:\Users\kidan\Downloads\EthioBooks\server
npm install
Backend environment
You already have server/.env. Make sure it contains all required values (your .env.example shows these):

PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/EthioBooks_db"
JWT_SECRET=...
FRONTEND_ORIGIN=http://localhost:3001 (important because your frontend is on 3001)
COOKIE_SECURE=false
Prisma migrate + generate + seed
Still inside server/:

npm run db:generate
npm run db:migrate
npm run db:seed
Start backend server
npm run dev
Backend should be at:

http://localhost:5000
API base: http://localhost:5000/api
Prisma Studio
In another terminal (still in server/):

npm run db:studio
This will open Prisma Studio (usually prints a local URL in the terminal).

3) Frontend (Next.js)
Open a terminal in the project root and run:

cd c:\Users\kidan\Downloads\EthioBooks
npm install
npm run dev
If 3000 is busy, Next will use 3001 (or another free port). Use the exact URL it prints.
Frontend API URL (optional but recommended)
Set this in a root .env.local file:

NEXT_PUBLIC_API_URL=http://localhost:5000/api
(If you don’t set it, the frontend code already defaults to http://localhost:5000/api.)

Quick checklist if a page still looks blank
Open the correct port (likely http://localhost:3001).
Backend running on 5000.
server/.env has FRONTEND_ORIGIN=http://localhost:3001.
PostgreSQL is running and Prisma migration succeeded.