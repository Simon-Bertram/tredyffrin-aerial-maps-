# Progress Notes

Lightweight project progress notes for substantial changes.

## Latest session note

- `2026-04-14-map-debug-instrumentation-cleanup-final.md`
- Covers removing all temporary map debugging instrumentation after confirming style/terrain lifecycle fixes, while preserving the functional rendering improvements.
- `2026-04-14-map-style-readiness-signal-fix.md`
- Covers switching map style readiness to `style.load`/`idle` event signals so terrain setup resumes reliably while preserving the non-diff style swap fix.
- `2026-04-14-map-style-loading-debug-fix.md`
- Covers the map style-switch stability fix by disabling style diffing for full style URL changes, gating terrain setup on true `map.isStyleLoaded()` readiness, and removing temporary debug instrumentation after verification.
- `2026-04-14-digital-curator-color-scheme-phase-1.md`
- Covers Digital Curator Phase 1 rollout: archive palette tokens, surface-layered homepage, no-line header treatment, and map overlay restyling with ghost-border/ambient depth.
- `2026-04-14-map-terrain-style-controls.md`
- Covers 3D terrain support, `useMap`-based style controls, SOLID-oriented map refactors, and the Firefox terrain 404 fix by replacing the DEM source.
- `2026-04-14-photo-enabled-markers.md`
- Covers map marker hover previews, SmoothUI `phototab` integration, location detail routing, and CMS-ready photo metadata fields.
- `2026-04-14-aerial-map-component-extraction.md`
- Covers extracting map controls and marker rendering into dedicated components while preserving existing map behavior.

## When to add a note

- After substantial code or config changes
- Any time explicitly requested

## File naming

- `YYYY-MM-DD-topic.md`
- Keep topic short and kebab-case

## Entry format

Use concise sections:

- Objective
- Scope
- Changes
- Validation
- Risks or blockers
- Next actions

## Keep it lightweight

- Prefer 3-8 bullets total
- Focus on decisions and outcomes, not play-by-play
- Include only commands that were actually run

## Recent example topics

- Photo-enabled location markers with hover preview and detail pages
- CMS-ready location schema (`photographer`, `photoDate`, `direction`, `comments`)
- Terrain DEM source migration to resolve browser console 404s
- Digital Curator color system rollout (palette tokens, layered surfaces, sharp-corner map UI)
