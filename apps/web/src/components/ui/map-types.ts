import type MapLibreGL from "maplibre-gl";

type MapStyleOption = string | MapLibreGL.StyleSpecification;

type Theme = "light" | "dark";

type MapTerrainSourceConfig = {
  /** TileJSON endpoint for DEM tiles. */
  url?: string;
  /** Direct DEM tile template URLs. */
  tiles?: string[];
  tileSize?: number;
  maxzoom?: number;
  attribution?: string;
  encoding?: "terrarium" | "mapbox";
};

type MapTerrainConfig = {
  enabled?: boolean;
  sourceId?: string;
  exaggeration?: number;
  source: MapTerrainSourceConfig;
  hillshade?: {
    enabled?: boolean;
    layerId?: string;
    shadowColor?: string;
  };
  sky?: {
    enabled?: boolean;
    layerId?: string;
  };
  initialCamera?: {
    pitch?: number;
    bearing?: number;
    duration?: number;
  };
};

type MapVisualStyleId = "terrain" | "streets" | "dark";

type MapVisualStyleOption = {
  id: MapVisualStyleId;
  label: string;
};

type MapStyleControlProps = {
  options: MapVisualStyleOption[];
  selectedStyle: MapVisualStyleId;
  onStyleChange: (style: MapVisualStyleId) => void;
  onResetView?: () => void;
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export type {
  MapStyleControlProps,
  MapStyleOption,
  MapTerrainConfig,
  MapTerrainSourceConfig,
  MapVisualStyleId,
  MapVisualStyleOption,
  Theme,
};
