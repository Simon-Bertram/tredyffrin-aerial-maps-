import assert from "node:assert/strict";
import test from "node:test";

import {
  MAP_STYLE_OPTIONS,
  getMapStylesForVisualStyle,
  getTerrainForVisualStyle,
} from "@/components/ui/map-style-config";

test("style options include terrain, streets, and dark", () => {
  const styleIds = MAP_STYLE_OPTIONS.map((option) => option.id);
  assert.deepEqual(styleIds, ["terrain", "streets", "dark"]);
});

test("visual styles resolve to a light/dark style URL pair", () => {
  const terrainStyles = getMapStylesForVisualStyle("terrain");
  const streetsStyles = getMapStylesForVisualStyle("streets");

  assert.equal(typeof terrainStyles.light, "string");
  assert.equal(typeof terrainStyles.dark, "string");
  assert.equal(typeof streetsStyles.light, "string");
  assert.equal(typeof streetsStyles.dark, "string");
});

test("terrain config is only enabled for the terrain visual style", () => {
  assert.ok(getTerrainForVisualStyle("terrain"));
  assert.equal(getTerrainForVisualStyle("streets"), undefined);
  assert.equal(getTerrainForVisualStyle("dark"), undefined);
});
