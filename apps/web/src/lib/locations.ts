export interface LocationPhoto {
  id: string;
  title: string;
  src: string;
  alt: string;
  caption?: string;
  photographer?: string;
  photoDate?: string;
  direction?: string;
  comments?: string;
}

export interface LocationRecord {
  slug: string;
  name: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  shortDescription: string;
  fullDescription: string;
  photos: LocationPhoto[];
}

export const locations: LocationRecord[] = [
  {
    slug: "valley-creek-overlook",
    name: "Valley Creek Overlook",
    coordinates: {
      longitude: -75.4404,
      latitude: 40.0891,
    },
    shortDescription:
      "Tree-lined creek corridor with a broad view toward the northeast ridge.",
    fullDescription:
      "Valley Creek Overlook captures seasonal changes along the riparian edge and nearby trail corridor. This point is useful for documenting vegetation density, creek bank condition, and neighboring canopy health over time.",
    photos: [
      {
        id: "vco-01",
        title: "Early spring canopy along Valley Creek",
        src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
        alt: "Creek corridor and trees at Valley Creek Overlook",
        caption: "Early spring canopy along Valley Creek",
        photographer: "Alex Rivera",
        photoDate: "2025-04-12",
        direction: "Looking northeast",
        comments: "Light overcast provided even ground detail.",
      },
      {
        id: "vco-02",
        title: "Meadow boundary and drainage path",
        src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
        alt: "Open meadow edge near Valley Creek Overlook",
        caption: "Meadow boundary and drainage path",
        photographer: "Alex Rivera",
        photoDate: "2025-06-03",
        direction: "Looking east",
      },
      {
        id: "vco-03",
        title: "Evening canopy coverage check",
        src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
        alt: "Sunset light over tree canopy at overlook",
        caption: "Evening canopy coverage check",
        photographer: "Jamie Park",
        photoDate: "2025-09-18",
        direction: "Looking north",
        comments: "Useful for comparing late-summer foliage thickness.",
      },
    ],
  },
  {
    slug: "paoli-station-corridor",
    name: "Paoli Station Corridor",
    coordinates: {
      longitude: -75.4843,
      latitude: 40.0432,
    },
    shortDescription:
      "Rail-adjacent corridor showing adjacent road network and lot coverage.",
    fullDescription:
      "The Paoli Station Corridor location tracks land-use transitions around transportation infrastructure. It is intended to support periodic visual review of surface coverage, staging areas, and adjoining access routes.",
    photos: [
      {
        id: "psc-01",
        title: "Primary station approach view",
        src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
        alt: "Rail corridor and surrounding development near station",
        caption: "Primary station approach view",
        photographer: "Morgan Lee",
        photoDate: "2025-05-21",
        direction: "Looking southeast",
        comments: "Single-photo site for baseline documentation.",
      },
    ],
  },
  {
    slug: "berwyn-ridge-line",
    name: "Berwyn Ridge Line",
    coordinates: {
      longitude: -75.4521,
      latitude: 40.0549,
    },
    shortDescription:
      "Elevated ridge perspective with mixed residential and wooded parcels.",
    fullDescription:
      "Berwyn Ridge Line provides a higher-angle reference for observing parcel boundaries and tree-cover continuity. The sequence of photos supports directional comparisons from west-facing to northeast-facing perspectives.",
    photos: [
      {
        id: "brl-01",
        title: "Primary ridge view",
        src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80",
        alt: "Ridge viewpoint with layered treetops",
        caption: "Primary ridge view",
        photographer: "Taylor Chen",
        photoDate: "2025-03-30",
        direction: "Looking west",
      },
      {
        id: "brl-02",
        title: "Secondary angle across valley",
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        alt: "Ridge line with distant valley and sky",
        caption: "Secondary angle across valley",
        photographer: "Taylor Chen",
        photoDate: "2025-03-30",
        direction: "Looking northeast",
        comments: "Captured immediately after first angle for same lighting.",
      },
    ],
  },
];

export function getLocationBySlug(slug: string): LocationRecord | undefined {
  return locations.find((location) => location.slug === slug);
}
