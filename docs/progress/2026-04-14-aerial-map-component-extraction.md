# 2026-04-14 — Aerial map component extraction

- Objective: Reduce `aerial-map` complexity by extracting control and marker UI into reusable components.
- Scope: `apps/web/src/components/aerial-map.tsx`, `apps/web/src/components/aerial-map-controls.tsx`, `apps/web/src/components/aerial-map-marker.tsx`.
- Changes: Moved map overlay controls into `AerialMapControls`; moved full marker + tooltip/photo-preview rendering into `AerialMapMarker`; kept photo-tab state ownership in `AerialMap` and passed per-location state via props.
- Validation: `ReadLints` on all touched component files returned no errors.
- Risks/Blockers: No functional blockers; behavior should remain unchanged but map tooltip interactions should be spot-checked in-browser.
- Next actions: If more map features are added, colocate marker-specific handlers in `AerialMapMarker` and keep global map state in `AerialMap`.
