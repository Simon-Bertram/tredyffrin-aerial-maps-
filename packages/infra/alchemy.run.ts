import alchemy from "alchemy";
import {
  Astro,
  D1Database,
  KVNamespace,
  R2Bucket,
  Worker,
  WorkerLoader,
} from "alchemy/cloudflare";
import { config } from "dotenv";

// 1. Load environment variables from multiple .env files
config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });

// 2. Allow local state store in CI-like devcontainer environments.
process.env.ALCHEMY_CI_STATE_STORE_CHECK ??= "false";

// 3. Create the Alchemy application.
const app = await alchemy("tehs-aerial-images");

// 4. Initialize the D1 database (Drizzle / Hono API).
const db = await D1Database("database", {
  migrationsDir: "../../packages/db/src/migrations",
});

// 5. EmDash CMS uses its own D1 (Kysely migrations managed by EmDash).
const emdashDb = await D1Database("emdash-database");

// 6. Initialize the R2 bucket (API uses R2; web worker also binds MEDIA → same bucket).
const r2 = await R2Bucket("r2");

// 6b. KV for Astro / EmDash session store (@astrojs/cloudflare expects binding "SESSION").
const sessionKv = await KVNamespace("emdash-sessions");

// 7. Create the Astro website.
export const web = await Astro("web", {
  cwd: "../../apps/web",
  entrypoint: "dist/server/entry.mjs",
  assets: "dist/client",
  // Vite plugin requires `main` not be a missing .mjs; package entry matches @astrojs/cloudflare default.
  wrangler: {
    transform: async (spec) => ({
      ...spec,
      main: "@astrojs/cloudflare/entrypoints/server",
    }),
  },
  compatibilityFlags: ["nodejs_compat", "disable_nodejs_process_v2"],
  bindings: {
    PUBLIC_SERVER_URL: alchemy.env.PUBLIC_SERVER_URL!,
    DB: emdashDb,
    MEDIA: r2,
    SESSION: sessionKv,
    LOADER: WorkerLoader(),
  },
});

// 8. Create the server worker.
export const server = await Worker("server", {
  cwd: "../../apps/server",
  entrypoint: "src/index.ts",
  compatibility: "node",
  bindings: {
    DB: db,
    R2: r2,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
  },
  dev: {
    port: 3000,
  },
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
