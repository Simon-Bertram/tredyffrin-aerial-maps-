import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const eventLogs = sqliteTable('event_logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	eventType: text('event_type').notNull(),
	payload: text('payload').notNull(),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(unixepoch())`),
})
