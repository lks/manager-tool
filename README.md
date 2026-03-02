# Manager Tool

A modern toolbox application for managers with Google Sign-In authentication.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Backend**: Express.js, Prisma ORM, PostgreSQL
- **Testing**: Playwright (E2E)
- **Infrastructure**: Docker, Railway

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm@8.15.0
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
cd apps/api && pnpm exec prisma generate
```

### Database Setup

```bash
# Start development database
docker-compose up -d postgres

# Run migrations
cd apps/api && pnpm exec prisma migrate dev
```

### Development

```bash
# Start all apps in dev mode
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials (Web application)
3. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
4. Copy `.env.example` to `.env` and add your credentials:

```bash
cp apps/api/.env.example apps/api/.env
# Edit .env with your Google OAuth credentials
```

## E2E Testing

### Prerequisites

- Docker must be running
- Ports 5432 (dev db) and 5433 (test db) available

### Running E2E Tests

```bash
# Start test database
docker-compose up -d postgres-test

# Run migrations on test database
cd apps/api
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/manager_tool_test" \
  pnpm exec prisma migrate deploy

# Start API with test database (in one terminal)
cd apps/api
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/manager_tool_test" \
  pnpm dev

# Start web (in another terminal)
cd apps/web && pnpm dev

# Run e2e tests
cd e2e && pnpm test:e2e
```

### E2E Test Commands

```bash
# Run all tests
cd e2e && pnpm test:e2e

# Run tests with UI
cd e2e && pnpm test:e2e:ui
```

## Build & Lint

```bash
# Build all apps
pnpm build

# Lint all packages
pnpm lint
```

## Deployment

See `railway.json` for Railway deployment configuration.

### Required Secrets

Set these in Railway dashboard:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET`
