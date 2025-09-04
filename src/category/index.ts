import Elysia, { t } from 'elysia'
import { getUser } from '../auth'
import { categoryModel } from './model'
import { CategoryService } from './service'
import { commonModel } from '../common'

export const category = new Elysia({
  prefix: '/category',
  detail: {
    tags: ['Category'],
  },
}) // Required bearer
  .use(categoryModel)
  .use(commonModel)
  .guard({
    // Putting this swagger security config in a separate elysia instance
    // does not work. Even after changing the scope
    detail: {
      security: [{ bearerAuth: [] }],
    },
  })
  // Protected route
  .use(getUser)

  .get(
    '/',
    async ({ status }) => {
      const categories = await CategoryService.getAll()
      return status(200, {
        status: 'success',
        message: 'Kategori berhasil diambil',
        data: categories,
      })
    },
    {
      response: {
        200: 'getAllCategories',
        401: 'fail',
        500: 'error',
      },
    },
  )
