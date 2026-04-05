# Finance Dashboard Backend

A production-ready REST API for a finance dashboard with role-based access control, built with Node.js, Express, and TypeScript.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Language | TypeScript |
| Primary DB | PostgreSQL (via `pg`) |
| Audit / Logs | MongoDB (via Mongoose) — optional |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Docs | Swagger UI (`/api-docs`) |
| Testing | Jest + Supertest |
| Logging | Winston |
| Security | Helmet, CORS, express-rate-limit |

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd finance-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL — required
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/finance_db?schema=public"

# MongoDB — optional (audit logs are silently skipped if unavailable)
MONGODB_URI="mongodb://localhost:27017/finance_audit"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

BCRYPT_ROUNDS=12
```

### 3. Set up the database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE finance_db;"

# Run migrations
psql -U postgres -d finance_db -f src/prisma/migrate.sql

# Seed with sample data (3 users + 8 records)
npm run prisma:seed
```

Seed creates these users (password: `Admin@123` for all):

| Email | Role |
|---|---|
| admin@finance.com | ADMIN |
| analyst@finance.com | ANALYST |
| viewer@finance.com | VIEWER |

### 4. Run the server

```bash
# Development (with hot reload via ts-node)
npm run dev

# Production
npm run build && npm start
```

Server starts at `http://localhost:3000`
Swagger UI at `http://localhost:3000/api-docs`

---

## Project Structure

```
src/
├── config/
│   ├── database.ts        # pg Pool + Mongoose connection
│   ├── env.ts             # Typed env variables
│   └── swagger.ts         # Swagger UI setup
├── middleware/
│   ├── auth.middleware.ts      # JWT verification
│   ├── role.middleware.ts      # Role guard (hierarchy-based)
│   ├── validate.middleware.ts  # Zod schema validation
│   ├── error.middleware.ts     # Global error handler + 404
│   └── rateLimiter.middleware.ts
├── models/
│   └── AuditLog.ts        # MongoDB schema for audit events
├── modules/
│   ├── auth/              # register, login, refresh, logout, /me
│   ├── users/             # CRUD + role/status management
│   ├── records/           # Financial records with filters + pagination
│   └── dashboard/         # Summary, trends, categories, recent activity
├── types/
│   └── index.ts           # Shared enums and interfaces
├── utils/
│   ├── AppError.ts        # Typed operational error class
│   ├── audit.ts           # MongoDB audit log helper
│   ├── logger.ts          # Winston logger
│   └── response.ts        # sendSuccess / sendError helpers
├── prisma/
│   ├── migrate.sql        # PostgreSQL schema
│   └── seed.ts            # Sample data seeder
├── app.ts                 # Express app (routes, middleware)
└── server.ts              # Entry point (DB connect, listen)

tests/
├── unit/
│   ├── auth.service.test.ts
│   ├── users.service.test.ts
│   ├── records.service.test.ts
│   ├── dashboard.service.test.ts
│   └── role.middleware.test.ts
└── integration/
    ├── auth.routes.test.ts
    └── records.routes.test.ts
```

---

## API Reference

Base URL: `/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Register (VIEWER by default) |
| POST | `/auth/login` | None | Login, receive access + refresh tokens |
| POST | `/auth/refresh` | None | Refresh access token |
| POST | `/auth/logout` | Any | Invalidate refresh token |
| GET | `/auth/me` | Any | Current user info |

### Users (ADMIN only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users (search, filter, paginate) |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user with role |
| PATCH | `/users/:id` | Update name, role, or status |
| DELETE | `/users/:id` | Soft delete user |

### Records

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/records` | All | List (non-admins see only own records) |
| GET | `/records/:id` | All | Get by ID (ownership enforced) |
| POST | `/records` | ADMIN | Create record |
| PATCH | `/records/:id` | ADMIN | Update record |
| DELETE | `/records/:id` | ADMIN | Soft delete |

**Filter params for GET /records:**
`type`, `category`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `search`, `sortBy`, `sortOrder`, `page`, `limit`

### Dashboard

| Endpoint | Roles | Description |
|----------|-------|-------------|
| GET `/dashboard/summary` | All | Total income, expense, net balance |
| GET `/dashboard/recent-activity` | All | Latest N records |
| GET `/dashboard/categories` | ANALYST, ADMIN | Category-wise breakdown |
| GET `/dashboard/trends/monthly` | ANALYST, ADMIN | Monthly income/expense trends |
| GET `/dashboard/trends/weekly` | ANALYST, ADMIN | Weekly income/expense trends |
| GET `/dashboard/top-categories` | ANALYST, ADMIN | Top expense categories with % |

---

## Access Control

Roles follow a strict hierarchy: `ADMIN > ANALYST > VIEWER`

| Action | VIEWER | ANALYST | ADMIN |
|--------|--------|---------|-------|
| View own records | ✅ | ✅ | ✅ |
| View all records | ❌ | ❌ | ✅ |
| Dashboard summary | ✅ | ✅ | ✅ |
| Analytics & trends | ❌ | ✅ | ✅ |
| Create/Edit/Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

Access control is enforced at two levels:
- **Route level** — middleware rejects requests before they reach the controller
- **Service level** — queries are scoped by `user_id` for non-admin roles

---

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage report
npm run test:coverage
```

All tests mock the database — no live DB connection required to run tests.

---

## Design Decisions & Assumptions

**Why `pg` instead of an ORM?**
Prisma's binary engine CDN is blocked in restricted environments. Raw SQL with `pg` gives explicit query control, is lighter weight, and makes the data access layer fully transparent for review.

**MongoDB for audit logs only**
MongoDB's flexible, append-only document model suits audit events well. The system gracefully degrades — if MongoDB is unavailable, audit logging is silently skipped and the rest of the API continues normally.

**Soft deletes everywhere**
Both `users` and `financial_records` use a `deletedAt` timestamp instead of hard deletes. This preserves data integrity (foreign keys stay valid) and supports future recovery or audit requirements.

**Refresh token rotation**
Each refresh call issues a new refresh token and invalidates the old one (stored in the DB). This limits the blast radius of a stolen refresh token.

**Role hierarchy over explicit permission lists**
`ADMIN > ANALYST > VIEWER` covers all use cases cleanly and avoids the complexity of a permission table for this scale.

**Rate limiting**
Global: 100 requests per 15 minutes. Auth endpoints: 10 requests per 15 minutes (stricter to mitigate brute force).

**All amounts as `NUMERIC(15,2)` in PostgreSQL**
Avoids floating-point precision errors common with `FLOAT` when dealing with money.