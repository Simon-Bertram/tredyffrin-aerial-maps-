# mapcn map as a React island in Astro

This project uses [Astro’s React integration](https://docs.astro.build/en/guides/integrations-guide/react/) (`@astrojs/react`) so React components can hydrate in an otherwise static or server-rendered page. The map UI follows the [mapcn API](https://www.mapcn.dev/docs/api-reference) (MapLibre GL–based components).

## Prerequisites

- **`@astrojs/react`** in `astro.config.*` under `integrations: [react()]`.
- **Peer deps**: `react`, `react-dom`, and typically `@types/react` / `@types/react-dom`.
- **`tsconfig.json`**: `compilerOptions` should include `"jsx": "react-jsx"` and `"jsxImportSource": "react"` (see the [manual install](https://docs.astro.build/en/guides/integrations-guide/react/#manual-install) section).

In this repo, `apps/web` already satisfies these.

## Why an island

MapLibre runs in the browser and needs a DOM container. The mapcn `Map` and related components are React components that use hooks and browser APIs. Mark them as **client islands** so Astro ships JS only for that subtree and hydrates it on the client.

## Recommended pattern

### 1. One React file that composes the map

Keep `Map`, `MapControls`, markers, etc. in a single React module (for example `apps/web/src/components/site/aerial-map.tsx`). Per the [mapcn API reference](https://www.mapcn.dev/docs/api-reference), **`MapControls` and other map parts must be children of `Map`** so `useMap()` context is available.

Example shape:

```tsx
import { Map, MapControls } from '@/components/ui/map'

export function AerialMap() {
	return (
		<div className="h-[480px] w-full rounded-lg border">
			<Map
				className="h-full w-full rounded-lg"
				center={[-74.006, 40.7128]}
				zoom={12}
			>
				<MapControls position="bottom-right" showZoom />
			</Map>
		</div>
	)
}
```

Give the outer wrapper an explicit **height** (for example `h-[480px]` or `min-h-[400px]`). The map fills its parent; without height the canvas often collapses.

### 2. Import that component from Astro with a client directive

In `apps/web/src/pages/index.astro` (or any page):

```astro
---
import Layout from '../layouts/Layout.astro'
import { AerialMap } from '@/components/site/aerial-map'
---

<Layout title="…">
	<AerialMap client:load />
</Layout>
```

Choose a directive that matches UX and performance:

| Directive        | When to use |
|------------------|-------------|
| `client:load`    | Hydrate as soon as possible; good for above-the-fold maps. |
| `client:visible` | Hydrate when the component enters the viewport; good for maps lower on the page. |
| `client:idle`    | Hydrate when the main thread is idle. |

See Astro’s [UI framework docs](https://docs.astro.build/en/guides/framework-components/#hydrating-interactive-components) for the full list.

### 3. Coordinates and data

mapcn / MapLibre expect positions as **`[longitude, latitude]`** (see the [MapRoute](https://www.mapcn.dev/docs/api-reference) and marker props in the API reference). Align any GeoJSON or API data with that order.

## Optional: installing mapcn in another project

If you are not copying the `map` component from this repo, use the [mapcn installation](https://www.mapcn.dev/docs/installation) flow (CLI adds the component and dependencies). You still wrap the exported `Map` tree in one React component and use `client:*` from Astro the same way.

## References

- [Astro: `@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/)
- [mapcn: API reference](https://www.mapcn.dev/docs/api-reference)
