export const LOCATION_LIST_QUERY = `
  *[_type == "location" && defined(slug.current)] | order(name asc) {
    _id,
    "slug": slug.current,
    name,
    "coordinates": {
      "lat": coordinates.lat,
      "lng": coordinates.lng
    },
    shortDescription,
    fullDescription,
    photos[] {
      _key,
      title,
      "src": photo.asset->url,
      alt,
      caption,
      photographer,
      "photoDate": select(defined(photoDate) => string(photoDate), null),
      direction,
      comments
    }
  }
`

export const LOCATION_DETAIL_BY_SLUG_QUERY = `
  *[_type == "location" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    name,
    "coordinates": {
      "lat": coordinates.lat,
      "lng": coordinates.lng
    },
    shortDescription,
    fullDescription,
    photos[] {
      _key,
      title,
      "src": photo.asset->url,
      alt,
      caption,
      photographer,
      "photoDate": select(defined(photoDate) => string(photoDate), null),
      direction,
      comments
    }
  }
`
