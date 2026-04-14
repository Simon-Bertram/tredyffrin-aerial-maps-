"use client";

import { RotateCcw } from "lucide-react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

import type { MapStyleControlProps } from "@/components/ui/map-types";
import { useMap } from "@/components/ui/map";

const positionClasses = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-12 right-3",
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
        "bg-surface/85 absolute z-20 flex items-center gap-1 p-1.5 backdrop-blur-xl",
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
              "px-2.5 py-1 text-xs font-semibold tracking-[0.08em] uppercase transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-container hover:text-foreground",
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
        className="text-muted-foreground hover:bg-surface-container p-1.5 transition-colors hover:text-foreground"
        aria-label="Reset map view"
      >
        <RotateCcw className="size-3.5" />
      </button>
    </div>
  );
}

export { MapStyleControls };
