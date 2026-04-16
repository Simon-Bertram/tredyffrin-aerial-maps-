# Testing Framework Guide

This project uses a layered testing approach:

- `Vitest` + `@cloudflare/vitest-pool-workers` for Worker runtime
  integration tests (including D1 access)
- `Playwright` for end-to-end browser tests
- `Zod`-driven Sanity mocks for deterministic CMS data in tests

## Test Layers

### 1) Server integration tests (Worker runtime)

- Location: `apps/server/src/*.spec.ts`
- Config: `apps/server/vitest.config.ts`
- Worker test setup: `apps/server/test/setup.ts`

These tests run inside the Cloudflare Worker test runtime and can use:

- `SELF.fetch(...)` from `cloudflare:test` to hit Worker routes
- `env.DB` for D1 reads/writes

Run:

```bash
pnpm --filter server test
```

### 2) Web unit tests

- Location: `apps/web/src/**/*.test.ts(x)`
- Config: `apps/web/vitest.config.ts`

Run:

```bash
pnpm --filter web test:unit
```

### 3) Web E2E smoke tests

- Config: `apps/web/playwright.config.ts`
- Specs: `apps/web/tests/e2e/*.spec.ts`

Playwright starts:

- the backend Worker dev server (`apps/server`)
- the Astro preview server (`apps/web`)

Run:

```bash
pnpm --filter web test:e2e
```

## Sanity Mocking

Shared utility:

- `packages/shared/testing/sanity-mock.ts`

Key helpers:

- `createSanityMockData(schema, seed)` validates seeded mock payloads with Zod
- `createSanityClientFetchMock(schema, options)` creates a query-aware mock
  `fetch` implementation and tracks query calls
- `mockSanityClient(schema, options)` provides a Vitest module factory for
  `@sanity/client` mocking

In Worker integration tests, prefer runtime-safe seams (for example a test hook
in app code) over relying only on module interception, since `SELF.fetch` runs
inside the Worker runtime boundary.

## Turborepo Usage

- Root test task: `turbo run test`
- Task config: `turbo.json` (`test` depends on `^build`)

Run all tests through Turbo:

```bash
pnpm test
```

## CI

Workflow:

- `.github/workflows/test.yml`

CI flow:

1. Install dependencies
2. Install Playwright Chromium
3. Setup Wrangler auth (`cloudflare/wrangler-action`)
4. Ensure migrations exist (`pnpm db:generate`)
5. Run full tests (`pnpm test`)

## Quick Troubleshooting

- Worker tests fail to start:
  - Check `apps/server/wrangler.toml` bindings and compatibility date.
- D1 assertions fail:
  - Ensure `apps/server/test/setup.ts` creates required test tables.
- E2E times out on startup:
  - Verify both servers boot locally (`pnpm --filter server dev` and
    `pnpm --filter web preview`).
