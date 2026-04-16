import { sanityClient } from '@/lib/sanity-client'
import {
	LOCATION_DETAIL_BY_SLUG_QUERY,
	LOCATION_LIST_QUERY,
} from '@/lib/sanity-queries'
import {
	parseLocationRecordFromSanity,
	parseLocationRecordsFromSanity,
} from '@/lib/sanity-locations'

import type { LocationRecord } from '@/lib/locations'

interface LocationDetailBySlugQueryParams {
	slug: string
}

export async function getSanityLocationRecordsList(): Promise<LocationRecord[]> {
	const locations = await sanityClient.fetch<unknown>(LOCATION_LIST_QUERY)

	return parseLocationRecordsFromSanity(locations)
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

	return parseLocationRecordFromSanity(location)
}
