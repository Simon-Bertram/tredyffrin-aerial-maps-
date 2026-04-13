// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import {
  access,
  cloudflareImages,
  cloudflareStream,
  d1,
  r2,
  sandbox,
} from "@emdash-cms/cloudflare";
import { formsPlugin } from "@emdash-cms/plugin-forms";
import { webhookNotifierPlugin } from "@emdash-cms/plugin-webhook-notifier";
import emdash from "emdash/astro";
import alchemy from "alchemy/cloudflare/astro";
import { defineConfig, envField } from "astro/config";

const cfAccessTeamDomain = process.env.CF_ACCESS_TEAM_DOMAIN;
/** When set, WebAuthn rpId/origin match the browser (see apps/web/.env.example). */
const publicPasskeyOrigin = process.env.PUBLIC_PASSKEY_ORIGIN?.replace(/\/$/, "");
const emdashAuth =
  cfAccessTeamDomain !== undefined && cfAccessTeamDomain.length > 0
    ? access({
        teamDomain: cfAccessTeamDomain,
        audienceEnvVar: "CF_ACCESS_AUDIENCE",
        autoProvision: true,
        defaultRole: 30,
      })
    : undefined;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Same file Alchemy's platformProxy validates; @astrojs/cloudflare must read it too or dev SSR omits nodejs_compat. */
const alchemyWranglerPath = path.join(
  __dirname,
  ".alchemy/local/wrangler.jsonc",
);

/**
 * Alchemy + @astrojs/cloudflare dev runs HTML from `dist/server` while Vite does not
 * expose matching `/_astro/*` URLs, so the browser gets 404 + empty Content-Type.
 * Serve hashed client chunks from `dist/client` when present (after `astro build`).
 */
function serveBuiltAstroClientChunks() {
  const clientDir = path.join(__dirname, "dist/client");
  return {
    name: "serve-built-astro-client-chunks",
    enforce: /** @type {"pre"} */ ("pre"),
    /** @param {any} server */
    configureServer(server) {
      server.middlewares.use(
        (
          /** @type {any} */ req,
          /** @type {any} */ res,
          /** @type {any} */ next,
        ) => {
          if (req.method !== "GET" && req.method !== "HEAD") {
            next();
            return;
          }
          const pathname = (req.url ?? "").split("?")[0] ?? "";
          if (!pathname.startsWith("/_astro/")) {
            next();
            return;
          }
          const abs = path.normalize(path.join(clientDir, pathname.slice(1)));
          if (!abs.startsWith(clientDir)) {
            next();
            return;
          }
          fs.stat(abs, (err, st) => {
            if (err || !st.isFile()) {
              next();
              return;
            }
            const ext = path.extname(abs);
            if (ext === ".js") {
              res.setHeader("Content-Type", "application/javascript");
            } else if (ext === ".css") {
              res.setHeader("Content-Type", "text/css");
            }
            if (req.method === "HEAD") {
              res.statusCode = 200;
              res.end();
              return;
            }
            fs.createReadStream(abs).pipe(res);
          });
        },
      );
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: alchemy({
    imageService: "cloudflare",
    configPath: alchemyWranglerPath,
  }),
  env: {
    schema: {
      PUBLIC_SERVER_URL: envField.string({
        access: "public",
        context: "client",
        default: "http://localhost:3000",
      }),
    },
  },
  integrations: [
    react(),
    emdash({
      mcp: true,
      database: d1({ binding: "DB", session: "disabled" }),
      storage: r2({ binding: "MEDIA" }),
      ...(publicPasskeyOrigin ? { passkeyPublicOrigin: publicPasskeyOrigin } : {}),
      ...(emdashAuth ? { auth: emdashAuth } : {}),
      mediaProviders:
        /** @type {import('emdash/media').MediaProviderDescriptor[]} */ ([
          cloudflareImages({
            accountIdEnvVar: "CF_MEDIA_ACCOUNT_ID",
            apiTokenEnvVar: "CF_MEDIA_API_TOKEN",
            accountHashEnvVar: "CF_IMAGES_ACCOUNT_HASH",
          }),
          cloudflareStream({
            accountIdEnvVar: "CF_MEDIA_ACCOUNT_ID",
            apiTokenEnvVar: "CF_MEDIA_API_TOKEN",
          }),
        ]),
      plugins: [
        /** @type {import('emdash').PluginDescriptor} */ (formsPlugin()),
      ],
      sandboxed: [webhookNotifierPlugin()],
      sandboxRunner: sandbox(),
      marketplace: "https://marketplace.emdashcms.com",
    }),
  ],
  vite: {
    plugins: [serveBuiltAstroClientChunks(), tailwindcss()],
  },
});
