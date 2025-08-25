import { eq } from 'drizzle-orm'
import db, { schema } from '../database'

abstract class User {
  static async findByUsername(username: string) {
    const row = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.username, username))
      .limit(1)

    return row.length === 0 ? null : row[0]
  }

  static async findById(id: string) {
    const row = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, id))
      .limit(1)
    return row.length === 0 ? null : row[0]
  }

  static async add(username: string, hashedPassword: string) {
    const addedUser = await db
      .insert(schema.user)
      .values({ username, password: hashedPassword })
      .returning()
      .onConflictDoNothing()

    return addedUser.length === 0 ? null : addedUser[0]
  }
}

export { User }
