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
const emdashAuth =
  cfAccessTeamDomain !== undefined && cfAccessTeamDomain.length > 0
    ? access({
        teamDomain: cfAccessTeamDomain,
        audienceEnvVar: "CF_ACCESS_AUDIENCE",
        autoProvision: true,
        defaultRole: 30,
      })
    : undefined;

// #region agent log
fetch("http://localhost:7863/ingest/3b9fb545-c701-4112-be3a-7ef1749fe1a4", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "d047fe",
  },
  body: JSON.stringify({
    sessionId: "d047fe",
    location: "astro.config.mjs:emdashAuth",
    message: "EmDash Cloudflare Access env at config load",
    data: {
      hypothesisId: "H-A",
      cfAccessTeamDomainSet: Boolean(cfAccessTeamDomain?.length),
      cfAccessTeamDomainSample: cfAccessTeamDomain
        ? `${String(cfAccessTeamDomain).slice(0, 24)}…`
        : null,
      cfAccessAudiencePreview: process.env.CF_ACCESS_AUDIENCE
        ? `${String(process.env.CF_ACCESS_AUDIENCE).slice(0, 40)}…`
        : null,
      emdashAuthObjectCreated: Boolean(emdashAuth),
    },
    timestamp: Date.now(),
    runId: "pre-fix",
  }),
}).catch(() => {});
// #endregion

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
