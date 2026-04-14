# Progress - 2026-04-14 - Map Island

## Objective

Enable and document the Astro + React island map setup.

## Scope

- `apps/web/astro.config.mjs`
- `apps/web/src/pages/index.astro`
- `apps/web/src/components/aerial-map.tsx`
- `apps/web/src/components/ui/map.tsx`
- `docs/astro-mapcn-react-island.md`

## Changes

- Added/updated map-related web files for React island usage
- Added setup and usage guidance in docs

## Validation

- Pending: run web build/type checks after map iteration stabilizes

## Risks or blockers

- Hydration timing and mobile map sizing may need tuning

## Next actions

- Validate with `pnpm --filter web build`
- Validate with `pnpm --filter web check-types`
