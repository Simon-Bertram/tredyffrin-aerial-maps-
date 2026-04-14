import { useEffect, useRef } from "react";
import type MapLibreGL from "maplibre-gl";

import type { MapTerrainConfig } from "@/components/ui/map-types";

type UseMapTerrainArgs = {
  map: MapLibreGL.Map | null;
  isStyleLoaded: boolean;
  terrain3d?: MapTerrainConfig;
};

const DEFAULT_SOURCE_ID = "terrain-dem";
const DEFAULT_HILLSHADE_SOURCE_ID = "terrain-hillshade-dem";
const DEFAULT_HILLSHADE_LAYER_ID = "terrain-hillshade";
const DEFAULT_SKY_LAYER_ID = "terrain-sky";
const DEFAULT_TERRAIN_EXAGGERATION = 1;

function removeLayerIfPresent(map: MapLibreGL.Map, layerId: string) {
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
}

function removeTerrainArtifacts(
  map: MapLibreGL.Map,
  config: Pick<MapTerrainConfig, "sourceId" | "hillshade" | "sky">,
) {
  const terrainSourceId = config.sourceId ?? DEFAULT_SOURCE_ID;
  const hillshadeSourceId = `${terrainSourceId}-${DEFAULT_HILLSHADE_SOURCE_ID}`;
  const hillshadeLayerId =
    config.hillshade?.layerId ?? DEFAULT_HILLSHADE_LAYER_ID;
  const skyLayerId = config.sky?.layerId ?? DEFAULT_SKY_LAYER_ID;

  map.setTerrain(null);
  removeLayerIfPresent(map, hillshadeLayerId);
  removeLayerIfPresent(map, skyLayerId);

  if (map.getSource(hillshadeSourceId)) {
    map.removeSource(hillshadeSourceId);
  }
  if (map.getSource(terrainSourceId)) {
    map.removeSource(terrainSourceId);
  }
}

function ensureTerrainSource(
  map: MapLibreGL.Map,
  sourceId: string,
  source: MapTerrainConfig["source"],
) {
  if (map.getSource(sourceId)) {
    return;
  }

  if (!source.url && (!source.tiles || source.tiles.length === 0)) {
    return;
  }

  map.addSource(sourceId, {
    type: "raster-dem",
    ...source,
  } as MapLibreGL.RasterDEMSourceSpecification);
}

function ensureTerrainLayers(map: MapLibreGL.Map, terrain3d: MapTerrainConfig) {
  const terrainSourceId = terrain3d.sourceId ?? DEFAULT_SOURCE_ID;
  const hillshadeSourceId = `${terrainSourceId}-${DEFAULT_HILLSHADE_SOURCE_ID}`;
  const hillshadeLayerId =
    terrain3d.hillshade?.layerId ?? DEFAULT_HILLSHADE_LAYER_ID;
  const skyLayerId = terrain3d.sky?.layerId ?? DEFAULT_SKY_LAYER_ID;

  ensureTerrainSource(map, terrainSourceId, terrain3d.source);

  if (!map.getSource(terrainSourceId)) {
    return false;
  }

  map.setTerrain({
    source: terrainSourceId,
    exaggeration: terrain3d.exaggeration ?? DEFAULT_TERRAIN_EXAGGERATION,
  });

  if (terrain3d.hillshade?.enabled) {
    ensureTerrainSource(map, hillshadeSourceId, terrain3d.source);
    if (!map.getLayer(hillshadeLayerId)) {
      map.addLayer({
        id: hillshadeLayerId,
        type: "hillshade",
        source: hillshadeSourceId,
        paint: terrain3d.hillshade.shadowColor
          ? {
              "hillshade-shadow-color": terrain3d.hillshade.shadowColor,
            }
          : undefined,
      });
    }
  } else {
    removeLayerIfPresent(map, hillshadeLayerId);
    if (map.getSource(hillshadeSourceId)) {
      map.removeSource(hillshadeSourceId);
    }
  }

  if (terrain3d.sky?.enabled) {
    if (!map.getLayer(skyLayerId)) {
      try {
        map.addLayer({
          id: skyLayerId,
          type: "sky",
        });
      } catch {
        // Some styles/runtimes do not support "sky" layers. Terrain still works without it.
      }
    }
  } else {
    removeLayerIfPresent(map, skyLayerId);
  }

  return true;
}

function useMapTerrain({ map, isStyleLoaded, terrain3d }: UseMapTerrainArgs) {
  const hasAppliedInitialCameraRef = useRef(false);

  useEffect(() => {
    hasAppliedInitialCameraRef.current = false;
  }, [map, isStyleLoaded]);

  useEffect(() => {
    if (!map || !isStyleLoaded || !terrain3d) {
      return;
    }
    if (!map.isStyleLoaded()) {
      return;
    }

    if (!terrain3d.enabled) {
      removeTerrainArtifacts(map, terrain3d);
      return;
    }

    const hasTerrain = ensureTerrainLayers(map, terrain3d);
    if (!hasTerrain || hasAppliedInitialCameraRef.current) {
      return;
    }

    const { initialCamera } = terrain3d;
    const pitch = initialCamera?.pitch;
    const bearing = initialCamera?.bearing;
    const duration = initialCamera?.duration ?? 700;

    if (pitch === undefined && bearing === undefined) {
      hasAppliedInitialCameraRef.current = true;
      return;
    }

    map.easeTo({
      pitch: pitch ?? map.getPitch(),
      bearing: bearing ?? map.getBearing(),
      duration,
    });
    hasAppliedInitialCameraRef.current = true;
  }, [map, isStyleLoaded, terrain3d]);
}

export { useMapTerrain };
export { ensureTerrainLayers, removeTerrainArtifacts };
