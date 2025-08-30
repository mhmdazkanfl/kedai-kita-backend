import { eq } from 'drizzle-orm'
import { getDatabaseExecutor, schema, TransactionType } from '../database'
import { createDateTime } from '../utils'
import { RefreshTokenSelect } from '../database/schema'

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

  static async getSession(
    refreshToken: string,
    tx?: TransactionType,
  ): Promise<RefreshTokenSelect | undefined> {
    const executor = getDatabaseExecutor(tx)
    return await executor.query.refreshToken.findFirst({
      where: eq(schema.refreshToken.token, refreshToken),
    })
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
