# Local Cloudflare Workers dev (Astro + Miniflare)

## Symptom

`pnpm dev` / `alchemy dev` fails when Astro starts, with an error similar to:

```text
This Worker requires compatibility date "YYYY-MM-DD", but the newest date supported
by this server binary is "YYYY-MM-DD-minus-one".
The Workers runtime failed to start.
```

Stack traces often mention `miniflare` and `@astrojs/cloudflare` / Vite.

## Why it happens

1. **Default compatibility date is “today.”** The Cloudflare Vite plugin (`@cloudflare/vite-plugin`, used by `@astrojs/cloudflare`) resolves worker config from a Wrangler file if present; otherwise it applies defaults. When `compatibility_date` is missing, it is filled with **today’s UTC calendar date** (`getTodaysCompatDate()`).

2. **The local workerd binary lags by a day.** Miniflare bundles a `workerd` build. That binary advertises a **maximum** compatibility date that can be **one day behind** the date your toolchain uses for “today,” especially right after Cloudflare publishes a new compatibility date.

3. **Mismatch = runtime won’t start.** The Worker bundle is configured with one compatibility date (e.g. today), but the local runtime only supports up to yesterday, so Miniflare refuses to start.

This is an **environment / toolchain skew** problem, not a bug in your app logic.

## Fix (this repo)

`apps/web/wrangler.toml` sets an explicit `compatibility_date` that is **≤ the max date your installed Miniflare supports**. The Vite plugin reads this file (see discovery order: `wrangler.json`, `wrangler.jsonc`, `wrangler.toml` in the app root) and no longer substitutes “today” for that field.

When Miniflare updates, you can bump `compatibility_date` to match [Cloudflare’s compatibility dates](https://developers.cloudflare.com/workers/configuration/compatibility-dates/) or to the value your `wrangler` / Miniflare version supports.

## What to do next time

1. Read the error: note **required** vs **supported** compatibility dates.
2. Prefer **upgrading** `wrangler`, `@astrojs/cloudflare`, and Miniflare (via lockfile refresh) so local and production stay aligned.
3. If you still see a one-day gap, **pin** `compatibility_date` in `apps/web/wrangler.toml` (or `wrangler.json`) to the **supported** (older) date until packages catch up.
4. Avoid adding a root-level `wrangler.json` that shadows `wrangler.toml` unless you also set `compatibility_date` there (JSON wins over TOML in discovery order).
