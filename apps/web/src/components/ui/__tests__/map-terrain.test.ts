import assert from "node:assert/strict";
import test from "node:test";

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

test("ensureTerrainLayers adds source/layers and sets terrain", () => {
  const map = new MockMap();
  const applied = ensureTerrainLayers(map as never, TERRAIN_CONFIG);

  assert.equal(applied, true);
  assert.ok(map.getSource("dem"));
  assert.ok(map.getLayer("hills"));
  assert.ok(map.getLayer("sky"));
  assert.deepEqual(map.terrain, { source: "dem", exaggeration: 1.25 });
});

test("ensureTerrainLayers is idempotent for source and layer registration", () => {
  const map = new MockMap();
  ensureTerrainLayers(map as never, TERRAIN_CONFIG);
  ensureTerrainLayers(map as never, TERRAIN_CONFIG);

  assert.equal(map.sources.size, 1);
  assert.equal(map.layers.size, 2);
});

test("removeTerrainArtifacts clears terrain, layers, and source", () => {
  const map = new MockMap();
  ensureTerrainLayers(map as never, TERRAIN_CONFIG);
  removeTerrainArtifacts(map as never, TERRAIN_CONFIG);

  assert.equal(map.terrain, null);
  assert.equal(map.sources.size, 0);
  assert.equal(map.layers.size, 0);
});
