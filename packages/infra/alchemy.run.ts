import alchemy from "alchemy";
import { Astro } from "alchemy/cloudflare";
import { Worker } from "alchemy/cloudflare";
import { D1Database, R2Bucket } from "alchemy/cloudflare";
import { config } from "dotenv";

// 1. Load environment variables from multiple .env files
config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });

// 2. Allow local state store in CI-like devcontainer environments.
process.env.ALCHEMY_CI_STATE_STORE_CHECK ??= "false";

// 3. Create the Alchemy application.
const app = await alchemy("tehs-aerial-images");

// 4. Initialize the D1 database.
const db = await D1Database("database", {
  migrationsDir: "../../packages/db/src/migrations",
});

// 5. Initialize the R2 bucket.
const r2 = await R2Bucket("r2");

// 6. Create the Astro website.
export const web = await Astro("web", {
  cwd: "../../apps/web",
  entrypoint: "dist/server/entry.mjs",
  assets: "dist/client",
  bindings: {
    PUBLIC_SERVER_URL: alchemy.env.PUBLIC_SERVER_URL!,
  },
});

// 7. Create the server worker.
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
