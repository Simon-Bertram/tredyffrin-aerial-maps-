import { useState } from "react";

import { AerialMapControls } from "@/components/aerial-map-controls";
import { AerialMapMarker } from "@/components/aerial-map-marker";
import { Map } from "@/components/ui/map";
import {
  getMapStylesForVisualStyle,
  getTerrainForVisualStyle,
} from "@/components/ui/map-style-config";
import type { MapVisualStyleId } from "@/components/ui/map-types";
import type { LocationRecord } from "@/lib/locations";

/** Tredyffrin area — MapLibre uses [longitude, latitude] (GeoJSON order). */
const TREDDYFFRIN_CENTER: [number, number] = [-75.4368, 40.0902];

interface AerialMapProps {
  locations: LocationRecord[];
}

export function AerialMap({ locations }: AerialMapProps) {
  const [activePhotoTabs, setActivePhotoTabs] = useState<
    Record<string, string>
  >({});
  const [selectedStyle, setSelectedStyle] =
    useState<MapVisualStyleId>("terrain");
  const mapStyles = getMapStylesForVisualStyle(selectedStyle);
  const terrain3d = getTerrainForVisualStyle(selectedStyle);

  return (
    <Map
      className="h-[800px] w-full bg-surface-container border border-outline-variant/15 shadow-[0_24px_32px_color-mix(in_srgb,var(--foreground)_4%,transparent)]"
      center={TREDDYFFRIN_CENTER}
      zoom={12}
      styles={mapStyles}
      terrain3d={terrain3d}
    >
      <AerialMapControls
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
      />
      {locations.map((location) => {
        const activeTab = activePhotoTabs[location.slug] ?? "1";

        return (
          <AerialMapMarker
            key={location.slug}
            location={location}
            activeTab={activeTab}
            onActiveTabChange={(nextTab) => {
              setActivePhotoTabs((prev) => ({
                ...prev,
                [location.slug]: nextTab,
              }));
            }}
          />
        );
      })}
    </Map>
  );
}
