import { sanityClient } from '@/lib/sanity-client'
import {
	LOCATION_DETAIL_BY_SLUG_QUERY,
	LOCATION_LIST_QUERY,
} from '@/lib/sanity-queries'
import {
	parseLocationRecordFromSanity,
} from '@/lib/sanity-locations'

import type { LocationRecord } from '@/lib/locations'

interface LocationDetailBySlugQueryParams {
	slug: string
}

export async function getSanityLocationRecordsList(): Promise<LocationRecord[]> {
	const locations = await sanityClient.fetch<unknown>(LOCATION_LIST_QUERY)

	if (!Array.isArray(locations)) {
		return []
	}

	return locations.flatMap((location) => {
		try {
			return [parseLocationRecordFromSanity(location)]
		} catch {
			return []
		}
	})
}

export async function getSanityLocationRecordBySlug(
	slug: string,
): Promise<LocationRecord | undefined> {
	const location = await sanityClient.fetch<unknown>(
		LOCATION_DETAIL_BY_SLUG_QUERY,
		{ slug } satisfies LocationDetailBySlugQueryParams,
	)

	if (!location) {
		return undefined
	}

	try {
		return parseLocationRecordFromSanity(location)
	} catch {
		return undefined
	}
}
