import { eq } from 'drizzle-orm'
import { getDatabaseExecutor, TransactionType } from '../database'
import {
  menuCategories,
  MenuCategoriesInsert,
  MenuCategoriesSelect,
} from '../database/schema'

export abstract class CategoryRepository {
  static async getAll(tx?: TransactionType): Promise<MenuCategoriesSelect[]> {
    const executor = getDatabaseExecutor(tx)
    return await executor.query.menuCategories.findMany()
  }

  static async getById(
    id: string,
    tx?: TransactionType,
  ): Promise<MenuCategoriesSelect | undefined> {
    const executor = getDatabaseExecutor(tx)
    return await executor.query.menuCategories.findFirst({
      where: eq(menuCategories.id, id),
    })
  }

  static async add(
    name: string,
    description?: string | null,
    tx?: TransactionType,
  ): Promise<MenuCategoriesSelect | null> {
    const executor = getDatabaseExecutor(tx)
    const result = await executor
      .insert(menuCategories)
      .values({ name, description })
      .returning()
      .onConflictDoNothing()

    return result.length === 0 ? null : result[0]
  }

  static async delete(id: string, tx?: TransactionType): Promise<void> {
    const executor = getDatabaseExecutor(tx)
    await executor.delete(menuCategories).where(eq(menuCategories.id, id))
  }
}
