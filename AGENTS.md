# AGENTS.md

Coding agent instructions for the Manager Tool repository.

## Project Overview

This is a monorepo built with Turborepo and pnpm, containing:
- `apps/api` - Express.js backend with Prisma ORM (PostgreSQL)
- `apps/web` - Next.js 14 frontend with Tailwind CSS
- `packages/shared` - Shared types and utilities
- `packages/eslint-config` - Shared ESLint configuration
- `e2e` - Playwright end-to-end tests

## Prerequisites

- Node.js >= 20.0.0
- pnpm@8.15.0
- PostgreSQL database

## Build/Lint/Test Commands

### Root-level commands

```bash
pnpm dev                    # Start all apps in dev mode
pnpm build                  # Build all apps and packages
pnpm lint                   # Lint all packages
pnpm test:e2e               # Run all Playwright e2e tests
```

### App-specific commands

```bash
# API (apps/api)
pnpm --filter @manager-tool/api dev          # Start API in dev mode
pnpm --filter @manager-tool/api build        # Build API
pnpm --filter @manager-tool/api lint         # Lint API
pnpm --filter @manager-tool/api db:migrate   # Run Prisma migrations
pnpm --filter @manager-tool/api db:studio    # Open Prisma Studio

# Web (apps/web)
pnpm --filter @manager-tool/web dev          # Start Next.js dev server
pnpm --filter @manager-tool/web build        # Build Next.js
pnpm --filter @manager-tool/web lint         # Lint web app
```

### E2E Tests

```bash
pnpm --filter @manager-tool/e2e test:e2e                           # Run all e2e tests
pnpm --filter @manager-tool/e2e test:e2e -- tests/home.spec.ts     # Run single test file
pnpm --filter @manager-tool/e2e test:e2e -- --grep "homepage"      # Run tests matching pattern
pnpm --filter @manager-tool/e2e test:e2e:ui                        # Run e2e tests with UI
```

### Before Pushing / PR

**CRITICAL**: Before each push on PR, run the same steps as GitHub CI:

```bash
pnpm lint && pnpm build && pnpm test:e2e
```

All commands must pass without errors before pushing.

## Code Style Guidelines

### Prettier Configuration

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- 2-space indentation (`tabWidth: 2`)
- ES5 trailing commas (`trailingComma: "es5"`)
- Max line width: 100 characters (`printWidth: 100`)

### TypeScript

- Strict mode enabled, target ES2022
- Use explicit types for function parameters and return types when not obvious
- Avoid `any`; use `unknown` when type is truly unknown (triggers a warning)

### ESLint Rules

- `prettier/prettier`: error
- `@typescript-eslint/no-unused-vars`: error (args starting with `_` are ignored)
- `@typescript-eslint/no-explicit-any`: warn

## Import Conventions

### Import Order

1. External packages (React, Express, etc.)
2. Internal packages (`@manager-tool/shared`)
3. Local relative imports

### Import Style

```typescript
// External packages
import express, { type Express } from 'express'
import { Router, type Router as RouterType } from 'express'

// Internal packages
import { User, ApiResponse } from '@manager-tool/shared'

// Local imports - use .js extension for ES modules (even for .ts files)
import { healthRouter } from './routes/health.js'
```

## Naming Conventions

### Files and Directories

- Use lowercase with dashes: `health.ts`, `error-handler.ts`
- React components: PascalCase files (`Button.tsx`, `UserProfile.tsx`)
- Test files: `*.spec.ts` for Playwright tests

### Variables and Functions

- camelCase for variables, functions, and methods
- PascalCase for types, interfaces, and classes
- UPPER_SNAKE_CASE for constants

```typescript
const apiUrl = 'http://localhost:3001'
const router: RouterType = Router()

export function formatDate(date: Date | string): string { ... }

export interface User { ... }
export type ApiResponse<T = unknown> = { ... }

const MAX_RETRIES = 3
```

### React Components

- Use named exports or default exports
- Use arrow functions or function declarations

```typescript
export default function HomePage() { ... }
export const Button = () => { ... }
```

## Error Handling

### API Error Middleware

```typescript
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  })
}
```

### Route Error Handling

```typescript
router.get('/', async (_req, res) => {
  try {
    // operation
    res.json({ status: 'ok' })
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Service unavailable' })
  }
})
```

### Unused Parameters

Prefix unused parameters with underscore: `_req`, `_next`

## Project-Specific Patterns

### API Response Types

Use standardized response types from shared package:

```typescript
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  message?: string
}
```

### Database (Prisma)

- Schema file: `apps/api/prisma/schema.prisma`
- Use CUID for IDs: `@id @default(cuid())`
- Always include `createdAt` and `updatedAt` timestamps

### Frontend API Client

Use the configured Axios instance from `apps/web/src/lib/api.ts`:

```typescript
import api from '@/lib/api'
const response = await api.get('/health')
```

## Environment Variables

- **API**: `DATABASE_URL`, `PORT` (default: 3001), `NODE_ENV`
- **Web**: `NEXT_PUBLIC_API_URL` (default: http://localhost:3001)



## Testing

### E2E Tests with Playwright

Tests are in `e2e/tests/`. The setup automatically starts both API and web servers.
Add each additional functionnal item, e2e tests have to be written and executed.

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Expected Text')
  })
})
```

