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

  // Hook
  .onError(({ error, code, status }) => {
    if ((code as any) === 'ECONNREFUSED') {
      console.error('Error on unknown: ', error)
      return status(500, {
        status: 'error',
        message: 'Gagal terhubung ke database',
      })
    }

    if (code === 'VALIDATION') {
      console.error('Error on validation: ', error.all)
      return status(422, {
        status: 'fail',
        message: error.message,
      })
    }

    if (code === 'UNKNOWN') {
      console.error('Error on unknown: ', error)
      return status(500, {
        status: 'error',
        message: 'Terjadi kesalahan yang tidak diketahui',
      })
    }

    console.log('Error code: ', code)
    console.log('Error details: ', error)
  })

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
    '',
    async ({ status }) => {
      const categories = await CategoryService.getAll()
      return status(200, {
        status: categories.status,
        message: categories.message,
        data: categories.data,
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

  .post(
    '/add',
    async ({ status, body: { name, description } }) => {
      const category = await CategoryService.add(name, description)

      switch (category.code) {
        case 201:
          return status(category.code, {
            status: category.status,
            message: category.message,
            data: category.data,
          })
        case 409:
          return status(category.code, {
            status: category.status,
            message: category.message,
          })
      }
    },
    {
      body: 'addCategory',
      response: {
        201: 'success',
        401: 'fail',
        409: 'fail',
        500: 'error',
      },
    },
  )
