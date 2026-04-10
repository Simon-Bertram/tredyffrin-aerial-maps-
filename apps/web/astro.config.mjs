// @ts-check
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Same file Alchemy's platformProxy validates; @astrojs/cloudflare must read it too or dev SSR omits nodejs_compat. */
const alchemyWranglerPath = path.join(__dirname, ".alchemy/local/wrangler.jsonc");

// #region agent log
fetch("http://localhost:7863/ingest/3b9fb545-c701-4112-be3a-7ef1749fe1a4", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"X-Debug-Session-Id": "ba1ffa",
	},
	body: JSON.stringify({
		sessionId: "ba1ffa",
		runId: "post-fix-v3",
		hypothesisId: "H2",
		location: "astro.config.mjs:alchemyWranglerPath",
		message: "adapter configPath matches Alchemy wrangler for Vite workerd compat flags",
		data: { configPathSet: true },
		timestamp: Date.now(),
	}),
}).catch(() => {});
// #endregion

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
			database: d1({ binding: "DB", session: "disabled" }),
			storage: r2({ binding: "MEDIA" }),
			...(emdashAuth ? { auth: emdashAuth } : {}),
			mediaProviders: [
				cloudflareImages({
					accountIdEnvVar: "CF_MEDIA_ACCOUNT_ID",
					apiTokenEnvVar: "CF_MEDIA_API_TOKEN",
					accountHashEnvVar: "CF_IMAGES_ACCOUNT_HASH",
				}),
				cloudflareStream({
					accountIdEnvVar: "CF_MEDIA_ACCOUNT_ID",
					apiTokenEnvVar: "CF_MEDIA_API_TOKEN",
				}),
			],
			plugins: [formsPlugin()],
			sandboxed: [webhookNotifierPlugin()],
			sandboxRunner: sandbox(),
			marketplace: "https://marketplace.emdashcms.com",
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
