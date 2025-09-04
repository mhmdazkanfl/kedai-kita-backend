import db from '../database'
import { MenuCategoriesSelect } from '../database/schema'
import { CategoryRepository } from './repository'

export abstract class CategoryService {
  static async getAll(): Promise<MenuCategoriesSelect[]> {
    return await db.transaction(async (tx) => {
      return await CategoryRepository.getAll(tx)
    })
  }
}
