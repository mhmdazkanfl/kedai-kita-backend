import { Response, ResponseStatus } from '../common'
import db from '../database'
import { CategoryRepository } from './repository'

export abstract class CategoryService {
  static async getAll(): Promise<Response> {
    const categories = await db.transaction(async (tx) => {
      return await CategoryRepository.getAll(tx)
    })

    return {
      code: 200,
      status: ResponseStatus.SUCCESS,
      message: 'Kategori berhasil diambil',
      data: categories,
    }
  }

  static async add(
    name: string,
    description?: string | null,
  ): Promise<Response> {
    const category = await db.transaction(async (tx) => {
      const category = await CategoryRepository.add(name, description, tx)

      if (!category) {
        return {
          code: 409,
          status: ResponseStatus.FAIL,
          message: 'Kategori sudah ada',
        }
      }

      return {
        code: 201,
        status: ResponseStatus.SUCCESS,
        message: 'Kategori berhasil ditambahkan',
        data: category,
      }
    })

    return category
  }

  static async delete(id: string): Promise<Response> {
    const result = await db.transaction(async (tx) => {
      const category = await CategoryRepository.getById(id, tx)

      if (!category) {
        return {
          code: 404,
          status: ResponseStatus.FAIL,
          message: 'Kategori tidak ditemukan',
        }
      }

      await CategoryRepository.delete(id, tx)

      return {
        code: 200,
        status: ResponseStatus.SUCCESS,
        message: 'Kategori berhasil dihapus',
      }
    })

    return result
  }
}
