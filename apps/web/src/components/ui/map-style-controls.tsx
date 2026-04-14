"use client";

import { RotateCcw } from "lucide-react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

import type { MapStyleControlProps } from "@/components/ui/map-types";
import { useMap } from "@/components/ui/map";

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

function MapStyleControls({
  options,
  selectedStyle,
  onStyleChange,
  onResetView,
  className,
  position = "top-right",
}: MapStyleControlProps) {
  const { map } = useMap();

  const handleResetView = useCallback(() => {
    onResetView?.();
    map?.easeTo({ pitch: 0, bearing: 0, duration: 500 });
  }, [map, onResetView]);

  return (
    <div
      className={cn(
        "bg-background/90 border-border absolute z-20 flex items-center gap-1 rounded-md border p-1 shadow-sm backdrop-blur-xs",
        positionClasses[position],
        className,
      )}
    >
      {options.map((option) => {
        const isActive = selectedStyle === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onStyleChange(option.id)}
            className={cn(
              "rounded px-2 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={handleResetView}
        className="hover:bg-accent rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Reset map view"
      >
        <RotateCcw className="size-3.5" />
      </button>
    </div>
  );
}

export { MapStyleControls };
