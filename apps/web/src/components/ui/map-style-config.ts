import type {
  MapStyleOption,
  MapTerrainConfig,
  MapVisualStyleId,
  MapVisualStyleOption,
} from "@/components/ui/map-types";

type ResolvedMapStyles = {
  light: MapStyleOption;
  dark: MapStyleOption;
};

const MAP_STYLE_OPTIONS: MapVisualStyleOption[] = [
  { id: "terrain", label: "Terrain" },
  { id: "streets", label: "Streets" },
  { id: "dark", label: "Dark" },
];

const BASE_STYLES: Record<MapVisualStyleId, string> = {
  terrain: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  streets: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

const TERRAIN_STYLE_ID: MapVisualStyleId = "terrain";

const TERRAIN_CONFIG: MapTerrainConfig = {
  enabled: true,
  source: {
    tiles: [
      "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
    ],
    tileSize: 256,
    maxzoom: 15,
    encoding: "terrarium",
    attribution:
      "Terrain data: [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/)",
  },
  exaggeration: 1.2,
  hillshade: {
    enabled: true,
    shadowColor: "#473B24",
  },
  initialCamera: {
    pitch: 55,
    bearing: -20,
    duration: 800,
  },
};

function getMapStylesForVisualStyle(styleId: MapVisualStyleId): ResolvedMapStyles {
  const styleUrl = BASE_STYLES[styleId];
  return {
    light: styleUrl,
    dark: styleUrl,
  };
}

function getTerrainForVisualStyle(
  styleId: MapVisualStyleId,
): MapTerrainConfig | undefined {
  if (styleId !== TERRAIN_STYLE_ID) {
    return undefined;
  }
  return TERRAIN_CONFIG;
}

export {
  MAP_STYLE_OPTIONS,
  TERRAIN_STYLE_ID,
  getMapStylesForVisualStyle,
  getTerrainForVisualStyle,
};
export type { ResolvedMapStyles };
