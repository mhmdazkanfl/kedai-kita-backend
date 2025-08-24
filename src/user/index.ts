import { eq } from 'drizzle-orm'
import { user } from '../database/schema'
import db from '../database'

abstract class User {
  static async findByUsername(username: string) {
    const row = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
      .limit(1)

    return row.length === 0 ? null : row[0]
  }

  static async findById(id: string) {
    const row = await db.select().from(user).where(eq(user.id, id)).limit(1)
    return row.length === 0 ? null : row[0]
  }

  static async add(username: string, hashedPassword: string) {
    const addedUser = await db
      .insert(user)
      .values({ username, password: hashedPassword })
      .returning()
      .onConflictDoNothing()

    return addedUser.length === 0 ? null : addedUser[0]
  }
}

export default User
