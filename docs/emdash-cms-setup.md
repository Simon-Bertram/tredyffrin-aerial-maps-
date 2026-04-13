# EmDash CMS — setup guide

Short steps to run and use EmDash in this monorepo. For architecture, bindings, and troubleshooting, see [emdash-cms-integration.md](./emdash-cms-integration.md).

## Prerequisites

- [pnpm](https://pnpm.io/) and dependencies installed at the repo root: `pnpm install`
- Local dev uses **Alchemy** (`pnpm run dev`), which provisions Cloudflare resources (including EmDash’s D1, R2 `MEDIA`, and `SESSION` KV). See the root README for persistent Alchemy state in devcontainers.

## 1. Environment variables

Copy `apps/web/.env.example` to `apps/web/.env` and adjust:

| Variable | Purpose |
| --- | --- |
| `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUDIENCE` | Optional. Cloudflare Access for admin; when set, passkey-only admin auth is replaced per EmDash behavior. |
| `CF_MEDIA_ACCOUNT_ID`, `CF_MEDIA_API_TOKEN`, `CF_IMAGES_ACCOUNT_HASH` | Optional. Only if you add Cloudflare Images / Stream to `emdash({ mediaProviders })` ([cms-media-and-astro-images.md](./cms-media-and-astro-images.md)); this repo uses R2-only CMS media by default. |

Infra-related values used at deploy time are loaded where Alchemy expects them (see `packages/infra/alchemy.run.ts` and `.cursor/rules/alchemy-deployment.mdc`).

## 2. What the project already wires up

- **Astro** (`apps/web`): `emdash/astro` in `astro.config.mjs`, with `@emdash-cms/cloudflare` helpers for D1, R2, and optional auth/plugins.
- **Separate D1**: EmDash uses `emdash-database`; the Hono API uses a different D1 with Drizzle — do not share migration folders.
- **Seed path**: `apps/web/package.json` → `"emdash": { "seed": "seed/seed.json" }`.

## 3. Run the app

From the repository root:

```bash
pnpm run dev
```

Open the site (default Astro port **4321**), then the admin:

- **Admin:** [http://localhost:4321/_emdash/admin](http://localhost:4321/_emdash/admin)  
  Complete EmDash onboarding (passkey unless Access env vars are set).

- **Example front-end usage:** `/blog` uses `getEmDashCollection` / `getEmDashEntry` from `emdash` in `.astro` pages.

Do not add Astro routes under `/_emdash/*` — they are reserved for EmDash.

## 4. Selecting templates

EmDash uses “templates” in two different ways: **per-page layout templates** (chosen in the CMS for each page) and **starter themes** (picked when you scaffold a brand-new site).

### Page / layout templates (editors, in admin)

These are options on a collection field (commonly `pages`) so each entry can pick a layout (for example **Default** vs **Full Width**).

1. **Define the field in your schema** — in `apps/web/seed/seed.json`, add a `template` field to the relevant collection’s `fields` array using a **select** control and the choices you want. Example (adjust slugs/labels to match your theme):

```json
{
	"slug": "template",
	"label": "Page Template",
	"type": "string",
	"widget": "select",
	"options": {
		"choices": [
			{ "value": "Default", "label": "Default" },
			{ "value": "Full Width", "label": "Full Width" }
		]
	},
	"defaultValue": "Default"
}
```

(EmDash also documents a `type` / `validation.options` style for selects; either pattern is fine as long as the stored values match what your Astro code expects.)

2. **Apply seed / migrate** — restart dev or follow your usual flow so the collection definition is applied.

3. **Choose a template per page** — in **`/_emdash/admin`**, open **Pages** (or your collection), edit a page, and use the **Page Template** (or **Template**) control to pick **Default**, **Full Width**, or any other option you defined.

4. **Render the right layout** — in your Astro route (often a dynamic page under `src/pages`), read the entry (e.g. `getEmDashEntry("pages", slug)`) and branch on `page.data.template` to render the matching layout component. See [EmDash: page layouts / themes](https://github.com/emdash-cms/emdash/blob/main/docs/src/content/docs/guides/page-layouts.mdx) and [creating themes](https://github.com/emdash-cms/emdash/blob/main/docs/src/content/docs/themes/creating-themes.mdx).

In this repo, generated types in `apps/web/emdash-env.d.ts` already include `template?: "Default" | "Full Width"` on **`Page`** once that field exists in the live schema; run `pnpm --filter web emdash:types` after you add or change options so types stay in sync.

### Starter themes (new Astro projects only)

Official starters (blog, portfolio, marketing, etc.) are **not** switched inside this repo’s admin. You pick them when creating a **new** project, for example:

```bash
npm create astro@latest -- --template @emdash-cms/template-blog
```

Use other published `@emdash-cms/template-*` packages or GitHub theme repos as documented in [EmDash themes overview](https://github.com/emdash-cms/emdash/blob/main/docs/src/content/docs/themes/overview.mdx). This monorepo is already wired for EmDash on the **web** app; changing starter usually means a new scaffold, then porting config and content—not a setting under `/_emdash/admin`.

### Plugins and marketplace

`astro.config.mjs` sets `marketplace: "https://marketplace.emdashcms.com"` for EmDash’s plugin marketplace. Browse or install extensions from there according to EmDash’s UI; that is separate from **page template** dropdowns on collections.

## 5. After you change collections or fields

Regenerate TypeScript types for collections (dev server reachable):

```bash
pnpm --filter web emdash:types
```

Or edit `apps/web/emdash-env.d.ts` manually if the CLI cannot reach your instance.

## 6. Optional / production notes

- **Sandboxed plugins** (`LOADER`, Dynamic Workers): requires a **paid** Cloudflare Workers capability; see the longer integration doc before relying on this in production.
- **Aerial images** in schema: prefer `z.image()` so assets go through the R2 upload pipeline (see `.cursor/rules/emdash.mdc`).

## References

- [EmDash on GitHub](https://github.com/emdash-cms/emdash)
- [emdash-cms-integration.md](./emdash-cms-integration.md) — full integration report for this repo
