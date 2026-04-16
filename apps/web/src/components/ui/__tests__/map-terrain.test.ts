import { describe, expect, it } from "vitest";

import {
  ensureTerrainLayers,
  removeTerrainArtifacts,
} from "@/components/ui/use-map-terrain";
import type { MapTerrainConfig } from "@/components/ui/map-types";

class MockMap {
  terrain: { source: string; exaggeration?: number } | null = null;
  sources = new Map<string, unknown>();
  layers = new Map<string, unknown>();

  addSource(id: string, source: unknown) {
    this.sources.set(id, source);
  }

  getSource(id: string) {
    return this.sources.get(id);
  }

  removeSource(id: string) {
    this.sources.delete(id);
  }

  addLayer(layer: { id: string }) {
    this.layers.set(layer.id, layer);
  }

  getLayer(id: string) {
    return this.layers.get(id);
  }

  removeLayer(id: string) {
    this.layers.delete(id);
  }

  setTerrain(terrain: { source: string; exaggeration?: number } | null) {
    this.terrain = terrain;
  }
}

const TERRAIN_CONFIG: MapTerrainConfig = {
  enabled: true,
  sourceId: "dem",
  source: {
    url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
  },
  hillshade: {
    enabled: true,
    layerId: "hills",
  },
  sky: {
    enabled: true,
    layerId: "sky",
  },
  exaggeration: 1.25,
};

describe("map terrain helpers", () => {
it("ensureTerrainLayers adds source/layers and sets terrain", () => {
  const map = new MockMap();
  const applied = ensureTerrainLayers(map as never, TERRAIN_CONFIG);

  expect(applied).toBe(true);
  expect(map.getSource("dem")).toBeTruthy();
  expect(map.getLayer("hills")).toBeTruthy();
  expect(map.getLayer("sky")).toBeTruthy();
  expect(map.terrain).toEqual({ source: "dem", exaggeration: 1.25 });
});

it("ensureTerrainLayers is idempotent for source and layer registration", () => {
  const map = new MockMap();
  ensureTerrainLayers(map as never, TERRAIN_CONFIG);
  ensureTerrainLayers(map as never, TERRAIN_CONFIG);

  expect(map.sources.size).toBe(2);
  expect(map.layers.size).toBe(2);
});

it("removeTerrainArtifacts clears terrain, layers, and source", () => {
  const map = new MockMap();
  ensureTerrainLayers(map as never, TERRAIN_CONFIG);
  removeTerrainArtifacts(map as never, TERRAIN_CONFIG);

  expect(map.terrain).toBeNull();
  expect(map.sources.size).toBe(0);
  expect(map.layers.size).toBe(0);
});
});
