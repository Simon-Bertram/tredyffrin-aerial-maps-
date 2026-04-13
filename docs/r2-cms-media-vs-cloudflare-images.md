# R2 + EmDash image fields vs Cloudflare Images (product)

This document compares **CMS image handling** in this repository—**R2** via EmDash **`storage: r2({ binding: "MEDIA" })`** without the **`cloudflareImages()`** media provider—against using the **Cloudflare Images** paid/metered product through EmDash.

For how this relates to **Astro `astro:assets`** and **`imageService: "cloudflare"`**, see [cms-media-and-astro-images.md](./cms-media-and-astro-images.md). For full integration details, see [emdash-cms-integration.md](./emdash-cms-integration.md).

## Scope in this repo

[apps/web/astro.config.mjs](../apps/web/astro.config.mjs) uses **R2-only CMS media** (no `mediaProviders` for Images/Stream). [apps/web/seed/seed.json](../apps/web/seed/seed.json) uses **`type: "image"`** on fields such as **`posts.featured_image`**. An **aerial photos** (or similar) collection would use the same pattern: image fields are **EmDash media backed by R2**, not by the Cloudflare Images product, unless you add **`cloudflareImages()`** back to `emdash({ ... })`.

## Current configuration (R2 + EmDash image fields)

| Topic | What you get |
|--------|----------------|
| **Storage** | Original files in **R2** (`MEDIA` binding). |
| **Admin** | EmDash media library and **`image`** fields; uploads go through the Worker + R2 pipeline. |
| **URLs** | Typically EmDash/media routes (e.g. file URLs from the app), **not** `imagedelivery.net/...`. |
| **Resizing / variants** | **Not** Cloudflare Images’ variant system. You rely on **originals**, **pre-sized assets**, **your own Worker logic**, or **Astro `<Image />` / `getImage()`** for allowed remotes (see [cms-media-and-astro-images.md](./cms-media-and-astro-images.md)). |
| **Cost shape** | **R2** storage + operations + **egress**; **Workers** for the site. No separate **Images** product line item. |
| **Env / ops** | No **`CF_MEDIA_*` / `CF_IMAGES_ACCOUNT_HASH`** for EmDash media providers unless you reintroduce Images/Stream. |
| **Fit for aerial libraries** | Strong when you want **full-resolution masters in object storage**, simpler billing, and you accept owning **derivatives** (generate offline, or optimize in theme code) or **larger** browser loads if you serve big originals. |

## Cloudflare Images (product + EmDash `cloudflareImages()`)

| Topic | What you get |
|--------|----------------|
| **Storage / delivery** | Images **product** stores/serves through **Images** infrastructure; public URLs are usually **`imagedelivery.net/<account_hash>/<id>/<variant>`** (or a custom domain per Cloudflare docs). |
| **Admin** | EmDash can register **Cloudflare Images** as a **`mediaProvider`**: listing, metadata, provider-specific flows (requires **`CF_MEDIA_*`**, account hash; **`apps/web/.dev.vars`** locally for the Worker). |
| **Resizing / variants** | **Declared variants** and **flexible URL transforms** (width, fit, etc.) on the **Images** edge—useful for **many sizes** without storing every derivative in R2 yourself. |
| **Cost shape** | **Images** pricing (stored images, delivery, optional features) **in addition to** Workers/R2 for the rest of the app. |
| **Fit for aerial libraries** | Strong when editors need **many responsive sizes**, **fast parameterized transforms**, and a **single** CDN-style URL model without building your own derivative pipeline. |

## Astro `imageService: "cloudflare"` (not the same as the Images product)

**`imageService: "cloudflare"`** on the Alchemy adapter helps **Astro** optimize **`astro:assets`** sources (and configured remotes). That is **parallel** to, not a replacement for, **EmDash + Cloudflare Images** as the **CMS media backend**. R2 URLs from the CMS can still be passed into `<Image />` if you **allow** those hosts in Astro’s image config—but that is **theme** wiring, not the Images product’s variant API.

## Summary

- **R2 + EmDash (this repo’s default)** — Masters in R2, simpler product surface, **you** own transformation strategy (or lean on Astro for eligible URLs).
- **Cloudflare Images** — Managed image pipeline (variants, `imagedelivery.net`, Images billing) via **`cloudflareImages()`**, when that edge-native model is worth the extra product and configuration.

Re-adding the Images provider: restore **`cloudflareImages()`** (and optional **`cloudflareStream()`**) in **`emdash({ mediaProviders: [...] })`**, imports from **`@emdash-cms/cloudflare`**, and env vars documented in [apps/web/.env.example](../apps/web/.env.example).
