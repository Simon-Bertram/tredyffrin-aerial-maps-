import { z } from 'zod'

import type { LocationPhoto, LocationRecord } from '@/lib/locations'

const optionalTextSchema = z
	.string()
	.trim()
	.transform((value) => (value.length > 0 ? value : undefined))
	.optional()

const requiredTextSchema = z.string().trim().min(1)

const sanityCoordinatesSchema = z.object({
	lat: z.number().finite(),
	lng: z.number().finite(),
})

const sanityPhotoSchema = z.object({
	_key: optionalTextSchema,
	title: optionalTextSchema,
	src: z.string().url(),
	alt: optionalTextSchema,
	caption: optionalTextSchema,
	photographer: optionalTextSchema,
	photoDate: optionalTextSchema,
	direction: optionalTextSchema,
	comments: optionalTextSchema,
})

const sanityLocationSchema = z.object({
	_id: requiredTextSchema,
	slug: requiredTextSchema,
	name: requiredTextSchema,
	coordinates: sanityCoordinatesSchema,
	shortDescription: requiredTextSchema,
	fullDescription: requiredTextSchema,
	photos: z.array(sanityPhotoSchema),
})

export const sanityLocationListItemSchema = sanityLocationSchema.pick({
	_id: true,
	slug: true,
	name: true,
	coordinates: true,
	shortDescription: true,
	photos: true,
})

export const sanityLocationDetailSchema = sanityLocationSchema

export const sanityLocationsListSchema = z.array(sanityLocationListItemSchema)
export const sanityLocationDetailsSchema = z.array(sanityLocationDetailSchema)

export type SanityLocationPhoto = z.output<typeof sanityPhotoSchema>
export type SanityLocation = z.output<typeof sanityLocationSchema>
export type SanityLocationListItem = z.output<
	typeof sanityLocationListItemSchema
>

function normalizeOptionalText(value: string | undefined) {
	return value && value.length > 0 ? value : undefined
}

export function mapSanityPhotoToLocationPhoto(
	location: Pick<LocationRecord, 'name' | 'slug'>,
	photo: SanityLocationPhoto,
	index: number,
): LocationPhoto {
	const fallbackTitle = `${location.name} photo ${index + 1}`
	const title = photo.title ?? photo.caption ?? fallbackTitle
	const fallbackAlt = `${location.name} aerial photo ${index + 1}`

	return {
		id: photo._key ?? `${location.slug}-photo-${index + 1}`,
		title,
		src: photo.src,
		alt: photo.alt ?? title ?? fallbackAlt,
		caption: normalizeOptionalText(photo.caption),
		photographer: normalizeOptionalText(photo.photographer),
		photoDate: normalizeOptionalText(photo.photoDate),
		direction: normalizeOptionalText(photo.direction),
		comments: normalizeOptionalText(photo.comments),
	}
}

export function mapSanityLocationToLocationRecord(
	location: SanityLocation,
): LocationRecord {
	return {
		slug: location.slug,
		name: location.name,
		coordinates: {
			longitude: location.coordinates.lng,
			latitude: location.coordinates.lat,
		},
		shortDescription: location.shortDescription,
		fullDescription: location.fullDescription,
		photos: location.photos.map((photo, index) =>
			mapSanityPhotoToLocationPhoto(location, photo, index),
		),
	}
}

export function parseSanityLocation(input: unknown): SanityLocation {
	return sanityLocationDetailSchema.parse(input)
}

export function parseSanityLocations(input: unknown): SanityLocation[] {
	return sanityLocationDetailsSchema.parse(input)
}

export function parseSanityLocationList(
	input: unknown,
): SanityLocationListItem[] {
	return sanityLocationsListSchema.parse(input)
}

export function parseLocationRecordFromSanity(input: unknown): LocationRecord {
	return mapSanityLocationToLocationRecord(parseSanityLocation(input))
}

export function parseLocationRecordsFromSanity(
	input: unknown,
): LocationRecord[] {
	return parseSanityLocations(input).map(mapSanityLocationToLocationRecord)
}
