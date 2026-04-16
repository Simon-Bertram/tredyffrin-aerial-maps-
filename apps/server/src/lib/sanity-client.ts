import { createClient } from '@sanity/client'

type SanityFetchMock = <T = unknown>(
	query: string,
	params?: Record<string, unknown>,
) => Promise<T>

declare global {
	// Test-only escape hatch used by Worker integration tests.
	var __SANITY_FETCH_MOCK__: SanityFetchMock | undefined
}

const sanityClient = createClient({
	projectId: 'test-project',
	dataset: 'production',
	apiVersion: '2026-04-16',
	useCdn: true,
})

export async function fetchLocationsFromSanity() {
	const query = '*[_type == "location"]{_id,name}'

	if (globalThis.__SANITY_FETCH_MOCK__) {
		return globalThis.__SANITY_FETCH_MOCK__<unknown[]>(query)
	}

	return sanityClient.fetch<unknown[]>(query)
}
