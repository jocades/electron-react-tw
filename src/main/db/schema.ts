import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const translations = sqliteTable('translation', {
  id: integer('id').primaryKey(),
  from: text('from').notNull(),
  to: text('to').notNull(),
  content: text('content').notNull(), // -> json
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = typeof translations.$inferInsert;
