// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/astro";
import { defineConfig, envField } from "astro/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Satisfy DevTools source-map fetch for React DevTools injected script (avoids 404 noise). */
function installHookSourceMapPlugin() {
  return {
    name: "installhook-sourcemap-stub",
    /**
     * @param {{
     *   middlewares: {
     *     use: (
     *       fn: (
     *         req: import('node:http').IncomingMessage & { url?: string },
     *         res: import('node:http').ServerResponse,
     *         next: () => void
     *       ) => unknown
     *     ) => unknown
     *   }
     * }} server
     */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (url === "/installHook.js.map") {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end('{"version":3,"sources":[],"names":[],"mappings":""}');
          return;
        }
        next();
      });
    },
  };
}

/** @type {ReturnType<typeof installHookSourceMapPlugin>} */
const tailwindPlugin = /** @type {any} */ (tailwindcss());

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: alchemy({
    // This tells Astro to use Node.js to generate static paths
    // instead of the restricted Cloudflare workerd environment.
    prerenderEnvironment: "node",
  }),

  env: {
    schema: {
      PUBLIC_SERVER_URL: envField.string({
        access: "public",
        context: "client",
        default: "http://localhost:3000",
      }),
      PUBLIC_SANITY_PROJECT_ID: envField.string({
        access: "public",
        context: "client",
      }),
      PUBLIC_SANITY_DATASET: envField.string({
        access: "public",
        context: "client",
      }),
      PUBLIC_SANITY_API_VERSION: envField.string({
        access: "public",
        context: "client",
        default: "2026-04-16",
      }),
    },
  },

  vite: {
    plugins: [installHookSourceMapPlugin(), tailwindPlugin],
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
  },

  integrations: [react()],
});
