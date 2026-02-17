# Tech Spec: Modern Web Application Skeleton

## Summary

| Component | Choice |
|-----------|--------|
| Monorepo | Turborepo + pnpm |
| Backend | Express + TypeScript |
| Frontend | Next.js 14 + Tailwind CSS |
| Database | PostgreSQL (Railway add-on) |
| ORM | Prisma |
| E2E Tests | Playwright |
| CI/CD | GitHub Actions |
| Code Review | CodeRabbit AI |
| Deployment | Railway |
| Repository | `github.com/lks/manager-tool` |

---

## Project Structure

```
manager-tool/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # React components
│   │   │   ├── lib/            # Utilities, API client
│   │   │   └── styles/         # Global styles
│   │   ├── tailwind.config.ts
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   └── api/                    # Express backend
│       ├── src/
│       │   ├── routes/         # API routes
│       │   ├── middleware/     # Express middleware
│       │   ├── services/       # Business logic
│       │   └── index.ts        # Entry point
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── packages/
│   ├── shared/                 # Shared types, utils
│   │   ├── src/
│   │   │   ├── types/          # Shared TypeScript types
│   │   │   └── utils/          # Shared utilities
│   │   └── package.json
│   │
│   └── eslint-config/          # Shared ESLint config
│
├── e2e/                        # Playwright tests
│   ├── tests/
│   ├── playwright.config.ts
│   └── package.json
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Lint, test, build
│   │   └── deploy.yml          # Production deployment
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .coderabbit.yaml            # CodeRabbit configuration
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml
├── package.json
└── railway.toml                # Railway deployment config
```

---

## Key Dependencies

### Root
- `turbo` - Monorepo build system
- `typescript` - TypeScript compiler

### apps/api
- `express` - Web framework
- `cors` - CORS middleware
- `helmet` - Security headers
- `prisma` - ORM
- `@prisma/client` - DB client
- `zod` - Validation

### apps/web
- `next` - React framework
- `react` + `react-dom`
- `tailwindcss` + `postcss` + `autoprefixer`
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client

### e2e
- `@playwright/test`
- `@axe-core/playwright` (optional a11y testing)

---

## Configuration Files

### turbo.json
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] },
    "test": { "dependsOn": ["^build"] }
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "e2e"
```

### .coderabbit.yaml
```yaml
language: en
reviews:
  profile: assertive
  request_changes_workflow: true
  high_level_summary: true
  poem: false
  review_status: true
  collapse_walkthrough: false
  auto_review:
    enabled: true
    drafts: false
  tools:
    eslint:
      enabled: true
```

---

## GitHub Actions Workflows

### CI (`.github/workflows/ci.yml`)

Triggers: Pull Request

```yaml
name: CI
on: [pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint
      
      - name: Build
        run: pnpm build
      
      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
```

### Deploy (`.github/workflows/deploy.yml`)

Triggers: Push to `main`

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy API to Railway
        uses: bakerstreet13/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api

  deploy-web:
    runs-on: ubuntu-latest
    needs: deploy-api
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy Web to Railway
        uses: bakerstreet13/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: web
```

---

## PR Workflow

1. Create feature branch from `main`
2. Push commits → CI runs automatically
3. Open PR → CodeRabbit reviews automatically
4. Address CodeRabbit feedback
5. Manual review approval
6. Squash & merge to `main`
7. Deploy workflow triggers

### PR Template (`.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## Summary
<!-- Brief description of changes -->

## Test plan
<!-- How to verify the changes work -->

## Checklist
- [ ] Tests added/updated
- [ ] Lint passes
- [ ] E2E tests pass
```

---

## Railway Deployment

### Services

| Service | Build Command | Start Command |
|---------|---------------|---------------|
| api | `pnpm --filter api build` | `pnpm --filter api start` |
| web | `pnpm --filter web build` | `pnpm --filter web start` |

### Environment Variables

| Service | Variable | Source |
|---------|----------|--------|
| api | `DATABASE_URL` | PostgreSQL add-on (auto-linked) |
| api | `NODE_ENV` | `production` |
| api | `PORT` | Railway sets automatically |
| web | `NEXT_PUBLIC_API_URL` | URL of api service |

### railway.toml (root)

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "pnpm start"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

---

## GitHub Secrets Required

Configure in repo Settings → Secrets and variables → Actions

| Secret | Description |
|--------|-------------|
| `RAILWAY_TOKEN` | Railway API token for deployments |

---

## Environment Variables

### apps/api/.env (local development)

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/manager_tool"
PORT=3001
NODE_ENV=development
```

### apps/web/.env.local (local development)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Development Scripts

```bash
pnpm dev          # Start all apps in dev mode
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm test:e2e     # Run Playwright tests
pnpm db:migrate   # Run Prisma migrations
pnpm db:studio    # Open Prisma Studio
```

---

## Implementation Plan

| Step | Task |
|------|------|
| 1 | Initialize monorepo (pnpm + Turborepo) |
| 2 | Setup `apps/api` (Express + Prisma) |
| 3 | Setup `apps/web` (Next.js + Tailwind) |
| 4 | Setup `packages/shared` (types) |
| 5 | Setup `e2e` (Playwright) |
| 6 | Configure ESLint + Prettier |
| 7 | Init git, push to `github.com/lks/manager-tool` |
| 8 | Add GitHub Actions workflows |
| 9 | Add CodeRabbit config |
| 10 | Create Railway project + PostgreSQL |
| 11 | Add `RAILWAY_TOKEN` to GitHub secrets |
| 12 | Open PR → verify CI + CodeRabbit |
| 13 | Merge → verify deploy |

---

## CodeRabbit Setup

1. Install [CodeRabbit AI](https://coderabbit.ai) GitHub App
2. Authorize for `lks/manager-tool`
3. `.coderabbit.yaml` committed for configuration

---

## Railway Setup

1. Create Railway account at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL add-on
4. Create two services: `api` and `web`
5. Link `DATABASE_URL` from PostgreSQL to both services
6. Generate API token from Railway dashboard
7. Add token to GitHub secrets as `RAILWAY_TOKEN`
