import { describe, expect, it } from "vitest";

import {
  MAP_STYLE_OPTIONS,
  getMapStylesForVisualStyle,
  getTerrainForVisualStyle,
} from "@/components/ui/map-style-config";

describe("map style controls", () => {
it("style options include terrain, streets, and dark", () => {
  const styleIds = MAP_STYLE_OPTIONS.map((option) => option.id);
  expect(styleIds).toEqual(["terrain", "streets", "dark"]);
});

it("visual styles resolve to a light/dark style URL pair", () => {
  const terrainStyles = getMapStylesForVisualStyle("terrain");
  const streetsStyles = getMapStylesForVisualStyle("streets");

  expect(typeof terrainStyles.light).toBe("string");
  expect(typeof terrainStyles.dark).toBe("string");
  expect(typeof streetsStyles.light).toBe("string");
  expect(typeof streetsStyles.dark).toBe("string");
});

it("terrain config is only enabled for the terrain visual style", () => {
  expect(getTerrainForVisualStyle("terrain")).toBeTruthy();
  expect(getTerrainForVisualStyle("streets")).toBeUndefined();
  expect(getTerrainForVisualStyle("dark")).toBeUndefined();
});
});
