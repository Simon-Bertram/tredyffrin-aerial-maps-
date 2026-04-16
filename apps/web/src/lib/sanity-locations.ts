import { z } from 'zod'

import type { LocationPhoto, LocationRecord } from '@/lib/locations'

const optionalTextSchema = z
	.string()
	.trim()
	.transform((value) => (value.length > 0 ? value : undefined))
	.optional()

const requiredTextSchema = z.string().trim().min(1)

const numericYearSchema = z
	.number()
	.int()
	.safe()
	.transform((value) => String(value))

const sanitySlugSchema = z.union([
	requiredTextSchema,
	z.object({
		current: requiredTextSchema,
	}),
])

const sanityCoordinatesSchema = z
	.object({
		lat: z.number().finite(),
		lng: z.number().finite(),
	})
	.transform((value) => ({
		latitude: value.lat,
		longitude: value.lng,
	}))

const sanityImageAssetSchema = z.object({
	asset: z.object({
		url: z.string().url(),
	}),
})

const sanityPhotoSrcSchema = z.union([
	z.string().url(),
	sanityImageAssetSchema.transform((value) => value.asset.url),
])

const sanityPhotoInputSchema = z.object({
	_key: optionalTextSchema,
	title: optionalTextSchema,
	src: sanityPhotoSrcSchema.optional(),
	photo: sanityPhotoSrcSchema.optional(),
	alt: optionalTextSchema,
	caption: optionalTextSchema,
	photographer: optionalTextSchema,
	photoDate: z.union([optionalTextSchema, numericYearSchema]).optional(),
	direction: optionalTextSchema,
	comments: optionalTextSchema,
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

const sanityLocationInputSchema = z.object({
	_id: requiredTextSchema,
	slug: sanitySlugSchema,
	name: requiredTextSchema,
	coordinates: sanityCoordinatesSchema,
	shortDescription: requiredTextSchema,
	fullDescription: requiredTextSchema,
	photos: z.array(sanityPhotoInputSchema),
})

const sanityLocationSchema = z.object({
	_id: requiredTextSchema,
	slug: requiredTextSchema,
	name: requiredTextSchema,
	coordinates: z.object({
		latitude: z.number().finite(),
		longitude: z.number().finite(),
	}),
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

function normalizeSanityPhoto(
	photo: z.output<typeof sanityPhotoInputSchema>,
): SanityLocationPhoto {
	return sanityPhotoSchema.parse({
		...photo,
		src: photo.src ?? photo.photo,
	})
}

function normalizeSanityLocation(
	location: z.output<typeof sanityLocationInputSchema>,
): SanityLocation {
	return sanityLocationSchema.parse({
		...location,
		slug:
			typeof location.slug === 'string'
				? location.slug
				: location.slug.current,
		photos: location.photos.map(normalizeSanityPhoto),
	})
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
		coordinates: location.coordinates,
		shortDescription: location.shortDescription,
		fullDescription: location.fullDescription,
		photos: location.photos.map((photo, index) =>
			mapSanityPhotoToLocationPhoto(location, photo, index),
		),
	}
}

export function parseSanityLocation(input: unknown): SanityLocation {
	return normalizeSanityLocation(sanityLocationInputSchema.parse(input))
}

export function parseSanityLocations(input: unknown): SanityLocation[] {
	return z.array(sanityLocationInputSchema).parse(input).map(normalizeSanityLocation)
}

export function parseSanityLocationList(
	input: unknown,
): SanityLocationListItem[] {
	return parseSanityLocations(input).map((location) =>
		sanityLocationListItemSchema.parse(location),
	)
}

export function parseLocationRecordFromSanity(input: unknown): LocationRecord {
	return mapSanityLocationToLocationRecord(parseSanityLocation(input))
}

export function parseLocationRecordsFromSanity(
	input: unknown,
): LocationRecord[] {
	return parseSanityLocations(input).map(mapSanityLocationToLocationRecord)
}
