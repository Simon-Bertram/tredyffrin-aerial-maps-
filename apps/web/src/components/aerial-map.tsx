import { Camera, MapPin } from 'lucide-react'
import { useState } from 'react'

import Phototab from '@/components/smoothui/phototab'
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from '@/components/ui/map'
import { locations } from '@/lib/locations'

/** Tredyffrin area — MapLibre uses [longitude, latitude] (GeoJSON order). */
const TREDDYFFRIN_CENTER: [number, number] = [-75.4368, 40.0902]

export function AerialMap() {
  const [activePhotoTabs, setActivePhotoTabs] = useState<Record<string, string>>(
    {},
  )

  return (
    <Map
      className="h-[800px] w-full rounded-lg border"
      center={TREDDYFFRIN_CENTER}
      zoom={12}
    >
      <MapControls />
      {locations.map((location) => {
        const detailPath = `/locations/${location.slug}`
        const firstPhoto = location.photos[0]
        const multiplePhotos = location.photos.length > 1
        const activeTab = activePhotoTabs[location.slug] ?? '1'
        const activePhotoIndex = Number(activeTab) - 1
        const activePhoto =
          location.photos[activePhotoIndex] ?? location.photos[0]
        const phototabItems = location.photos.map((photo, index) => ({
          name: `${index + 1}`,
          icon: <span className="block size-1.5 rounded-full bg-current" />,
          image: photo.src,
        }))

        return (
          <MapMarker
            key={location.slug}
            longitude={location.coordinates.longitude}
            latitude={location.coordinates.latitude}
            onClick={() => {
              window.location.href = detailPath
            }}
          >
            <MarkerContent>
              <button
                type="button"
                aria-label={`View details for ${location.name}`}
                className="group relative cursor-pointer rounded-full"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/35" />
                <span className="relative flex size-8 items-center justify-center rounded-full border border-white/30 bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
                  <MapPin className="size-4" />
                </span>
              </button>
            </MarkerContent>

            <MarkerTooltip className="w-72 p-0">
              <article className="overflow-hidden rounded-md border bg-popover">
                <div className="relative h-40">
                  {multiplePhotos ? (
                    <Phototab
                      tabs={phototabItems}
                      value={activeTab}
                      onValueChange={(nextTab) => {
                        setActivePhotoTabs((prev) => ({
                          ...prev,
                          [location.slug]: nextTab,
                        }))
                      }}
                      height={160}
                      className="h-40 w-full rounded-none"
                      imageClassName="rounded-none"
                      tabListClassName="bottom-0 w-28 translate-y-0 py-1"
                    />
                  ) : (
                    <img
                      src={firstPhoto.src}
                      alt={firstPhoto.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] text-white">
                    {location.photos.length} photo
                    {location.photos.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="space-y-2 p-3">
                  <p className="text-sm font-semibold text-popover-foreground">
                    {location.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {location.shortDescription}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Camera className="size-3.5" />
                    <span>{activePhoto.direction}</span>
                    <span aria-hidden="true">•</span>
                    <span>{activePhoto.photoDate}</span>
                    {multiplePhotos && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>
                          {activePhotoIndex + 1} / {location.photos.length}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </article>
            </MarkerTooltip>
          </MapMarker>
        )
      })}
    </Map>
  )
}
