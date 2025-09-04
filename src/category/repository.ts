import { eq } from 'drizzle-orm'
import { getDatabaseExecutor, TransactionType } from '../database'
import { menuCategories, MenuCategoriesSelect } from '../database/schema'

export abstract class CategoryRepository {
  static async getAll(tx?: TransactionType): Promise<MenuCategoriesSelect[]> {
    const executor = getDatabaseExecutor(tx)
    return await executor.query.menuCategories.findMany()
  }

  static async add(
    name: string,
    description?: string | null,
    tx?: TransactionType,
  ): Promise<void> {
    const executor = getDatabaseExecutor(tx)
    await executor.insert(menuCategories).values({ name, description })
  }

  static async delete(id: string, tx?: TransactionType): Promise<void> {
    const executor = getDatabaseExecutor(tx)
    await executor.delete(menuCategories).where(eq(menuCategories.id, id))
  }
}
