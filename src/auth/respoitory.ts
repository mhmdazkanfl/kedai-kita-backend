import { eq } from 'drizzle-orm'
import { getDatabaseExecutor, schema, TransactionType } from '../database'
import { createDateTime } from '../utils'

export abstract class AuthRepository {
  static async addSession(
    userId: string,
    refreshToken: string,
    tx?: TransactionType,
  ): Promise<void> {
    const executor = getDatabaseExecutor(tx)
    await executor.insert(schema.refreshToken).values({
      userId,
      token: refreshToken,
      expiresAt: createDateTime({ days: 30, returnType: 'date' }),
    })
  }

  static async checkSession(
    refreshToken: string,
    tx?: TransactionType,
  ): Promise<boolean> {
    const executor = getDatabaseExecutor(tx)
    const result = await executor.query.refreshToken.findFirst({
      where: eq(schema.refreshToken.token, refreshToken),
    })

    if (!result) return false

    return result.isRevoked
  }

  static async revokeSession(
    refreshToken: string,
    tx?: TransactionType,
  ): Promise<void> {
    const executor = getDatabaseExecutor(tx)
    await executor
      .update(schema.refreshToken)
      .set({ isRevoked: true })
      .where(eq(schema.refreshToken.token, refreshToken))
  }
}
