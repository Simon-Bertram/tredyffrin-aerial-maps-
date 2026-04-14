"use client";

import { MapControls } from "@/components/ui/map";
import { MapStyleControls } from "@/components/ui/map-style-controls";
import { MAP_STYLE_OPTIONS } from "@/components/ui/map-style-config";
import type { MapVisualStyleId } from "@/components/ui/map-types";

interface AerialMapControlsProps {
  selectedStyle: MapVisualStyleId;
  onStyleChange: (nextStyle: MapVisualStyleId) => void;
}

export function AerialMapControls({
  selectedStyle,
  onStyleChange,
}: AerialMapControlsProps) {
  return (
    <>
      <MapStyleControls
        options={MAP_STYLE_OPTIONS}
        selectedStyle={selectedStyle}
        onStyleChange={onStyleChange}
      />
      <MapControls />
    </>
  );
}
