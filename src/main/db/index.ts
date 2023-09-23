import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('data.db')
export const db = drizzle(sqlite, { schema })

// migrate(db, { migrationsFolder: 'drizzle' });

async function main() {
  await db.insert(schema.translations).values({
    from: 'es',
    to: 'en',
    content: JSON.stringify({
      title: 'Hello',
      content: 'World',
    }),
    createdAt: new Date(),
  })

  const data = await db.query.translations.findMany()
  console.log(data)

  const data2 = await db.select().from(schema.translations)
  console.log(data2)
}

// main().catch(console.error)
