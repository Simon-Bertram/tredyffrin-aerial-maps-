# tehs-aerial-images

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Astro, Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Astro** - The web framework for content-driven websites
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Hono** - Lightweight, performant server framework
- **workers** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **SQLite/Turso** - Database engine
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Testing

Testing framework usage is documented in
[`docs/testing-framework-guide.md`](docs/testing-framework-guide.md).

## Database Setup

This project uses SQLite with Drizzle ORM.

1. Start the local SQLite database (optional):
   D1 local development and migrations are handled automatically by Alchemy during dev and deploy.

2. Update your `.env` file in the `apps/server` directory with the appropriate connection details if needed.

3. Apply the schema to your database:

```bash
pnpm run db:push
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Deployment (Cloudflare via Alchemy)

- Dev: pnpm run dev
- Deploy: pnpm run deploy
- Destroy: pnpm run destroy

For more details, see the guide on [Deploying to Cloudflare with Alchemy](https://www.better-t-stack.dev/docs/guides/cloudflare-alchemy).

## Persistent Alchemy State For `pnpm run dev`

`pnpm run dev` starts the infra package, which runs Alchemy. Alchemy tracks
infrastructure state (what it created, updated, and should destroy). If that
state is not persisted, a restart can orphan resources or make local/dev state
drift from real cloud resources.

Alchemy detects CI-like environments and blocks the default local state store
for safety. In this repo, the devcontainer sets `CI=1`, so you must provide a
persistent state location.

### Local Devcontainer Setup (recommended)

Use a named volume for `/.alchemy` so state survives container rebuilds:

```jsonc
{
  "mounts": [
    "source=alchemy-state,target=${containerWorkspaceFolder}/.alchemy,type=volume"
  ]
}
```

This project already includes that mount in `.devcontainer/devcontainer.json`.

### CI/Shared Environments (recommended)

Use a remote persistent store instead of local files:

- `CloudflareStateStore`: https://alchemy.run/concepts/state/#cloudflare-state-store
- `S3StateStore`: https://alchemy.run/providers/aws/s3-state-store/

### Temporary Override (local only)

If you intentionally use local state in a CI-like environment, you can disable
the guard with:

```bash
ALCHEMY_CI_STATE_STORE_CHECK=false
```

This repo sets that value in `packages/infra/alchemy.run.ts` for local
devcontainer workflows. Keep this as a local convenience, not a production CI
default.

## Project Structure

```
tehs-aerial-images/
├── apps/
│   ├── web/         # Frontend application (Astro)
│   └── server/      # Backend API (Hono)
├── packages/
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:server`: Start only the server
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:generate`: Generate database client/types
