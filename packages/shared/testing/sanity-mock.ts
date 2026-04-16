import type { z } from 'zod'

type SanityFetchMock = <T = unknown>(
	query: string,
	params?: Record<string, unknown>,
) => Promise<T>

interface SanityMockState {
	defaultData: unknown
	byQuery: Record<string, unknown>
	queries: Array<{ query: string; params?: Record<string, unknown> }>
}

function cloneData<T>(value: T): T {
	return structuredClone(value)
}

export function createSanityMockData<TSchema extends z.ZodTypeAny>(
	schema: TSchema,
	seed: z.input<TSchema>,
): z.output<TSchema> {
	return schema.parse(seed)
}

export function createSanityClientFetchMock<TSchema extends z.ZodTypeAny>(
	schema: TSchema,
	options: {
		defaultData: z.input<TSchema>
		byQuery?: Record<string, z.input<TSchema>>
	},
): {
	state: SanityMockState
	fetch: SanityFetchMock
} {
	const state: SanityMockState = {
		defaultData: schema.parse(options.defaultData),
		byQuery: Object.fromEntries(
			Object.entries(options.byQuery ?? {}).map(([query, data]) => [
				query,
				schema.parse(data),
			]),
		),
		queries: [],
	}

	const fetch: SanityFetchMock = async <T = unknown>(
		query: string,
		params?: Record<string, unknown>,
	) => {
		state.queries.push({ query, params })
		const match = state.byQuery[query] ?? state.defaultData

		return cloneData(match) as T
	}

	return { state, fetch }
}

export function mockSanityClient<TSchema extends z.ZodTypeAny>(
	schema: TSchema,
	options: {
		defaultData: z.input<TSchema>
		byQuery?: Record<string, z.input<TSchema>>
	},
) {
	const mock = createSanityClientFetchMock(schema, options)

	return {
		...mock,
		moduleFactory: () => ({
			createClient: () => ({
				fetch: mock.fetch,
			}),
		}),
	}
}
