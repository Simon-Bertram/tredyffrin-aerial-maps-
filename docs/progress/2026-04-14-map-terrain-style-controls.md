# Progress Note

- Objective: enable 3D terrain rendering on the homepage map and add a maintainable path for user-selectable map styles.
- Scope: `apps/web/src/components/ui/map.tsx`, `apps/web/src/components/ui/map-types.ts`, `apps/web/src/components/ui/use-map-terrain.ts`, `apps/web/src/components/ui/map-style-controls.tsx`, `apps/web/src/components/ui/map-style-config.ts`, `apps/web/src/components/aerial-map.tsx`, plus focused tests under `apps/web/src/components/ui/__tests__/`.
- Changes: added typed terrain/style contracts, extracted terrain lifecycle side effects into `useMapTerrain`, introduced `MapStyleControls` (`useMap`-based child control), and wired `AerialMap` to switch between `terrain`, `streets`, and `dark` visual modes while enabling terrain only for the terrain mode.
- Validation: ran `pnpm build` in `apps/web` successfully; no linter diagnostics on edited files.
- Risks or blockers: test files are compile-time coverage only right now because this package does not yet define a test runner script.
- Next actions: add a dedicated test command (`vitest` or equivalent), then run the new tests in CI and consider moving `MapStyleControls` to broader reuse once another map screen adopts it.
