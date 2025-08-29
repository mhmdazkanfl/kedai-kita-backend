import { getDatabaseExecutor, schema, TransactionType } from '../database'
import { UserSelect } from '../database/schema'

export abstract class UserRepository {
  static async findByUsername(
    username: string,
    tx?: TransactionType,
  ): Promise<UserSelect | undefined> {
    const executor = getDatabaseExecutor(tx)
    return await executor.query.user.findFirst({
      where: (user, { eq }) => eq(user.username, username),
    })
  }

  static async findById(
    id: string,
    tx?: TransactionType,
  ): Promise<UserSelect | undefined> {
    const executor = getDatabaseExecutor(tx)
    return await executor.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    })
  }

  static async add(
    username: string,
    hashedPassword: string,
    tx?: TransactionType,
  ): Promise<UserSelect | null> {
    const executor = getDatabaseExecutor(tx)
    const addedUser = await executor
      .insert(schema.user)
      .values({ username, password: hashedPassword })
      .returning()
      .onConflictDoNothing()

    return addedUser.length === 0 ? null : addedUser[0]
  }
}
