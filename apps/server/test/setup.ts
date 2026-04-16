import { beforeAll } from 'vitest'
import { env } from 'cloudflare:test'

beforeAll(async () => {
	await env.DB.prepare(
		`CREATE TABLE IF NOT EXISTS event_logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			event_type TEXT NOT NULL,
			payload TEXT NOT NULL,
			created_at INTEGER NOT NULL DEFAULT (unixepoch())
		)`,
	).run()
})
