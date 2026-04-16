import { beforeEach, describe, expect, it } from 'vitest'
import { SELF, env } from 'cloudflare:test'

import { z } from 'zod'
import { createSanityClientFetchMock } from '@tehs-aerial-images/shared/testing/sanity-mock'

const locationsSchema = z.array(
	z.object({
		_id: z.string(),
		name: z.string(),
	}),
)

describe('locations sync integration', () => {
	beforeEach(async () => {
		await env.DB.exec('DELETE FROM event_logs')

		const mock = createSanityClientFetchMock(locationsSchema, {
			defaultData: [{ _id: 'location-1', name: 'Demo Location' }],
		})
		globalThis.__SANITY_FETCH_MOCK__ = mock.fetch
	})

	it('returns 200 and logs a Drizzle-backed event in D1', async () => {
		const response = await SELF.fetch('http://internal/locations/sync')
		expect(response.status).toBe(200)

		const rows = await env.DB.prepare(
			'SELECT event_type, payload FROM event_logs ORDER BY id DESC LIMIT 1',
		).all<{ event_type: string; payload: string }>()
		const latestLog = rows.results.at(0)

		expect(latestLog?.event_type).toBe('sanity.sync')
		expect(JSON.parse(latestLog?.payload ?? '{}')).toEqual({ count: 1 })
	})
})
