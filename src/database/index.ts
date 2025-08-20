import { drizzle } from 'drizzle-orm/node-postgres'
import { user } from './schema'
import { eq } from 'drizzle-orm'

export const db = drizzle(process.env.DATABASE_URL!)

export abstract class DatabaseService {
  static async isUsernameTaken(username: string) {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
    return result.length > 0
  }

  static async insertUser(username: string, hashedPassword: string) {
    return await db
      .insert(user)
      .values({ username, password: hashedPassword })
      .returning()
      .onConflictDoNothing()
  }
}
