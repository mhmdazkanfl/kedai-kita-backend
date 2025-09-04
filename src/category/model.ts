import Elysia, { t } from 'elysia'
import { createResponse, ResponseStatus } from '../common'

const addCategory = t.Object({
  name: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
})

const getAllCategories = t.Composite([
  createResponse(ResponseStatus.SUCCESS),
  t.Object({
    data: t.Array(
      t.Object({
        id: t.String({ format: 'uuid' }),
        name: t.String(),
        description: t.Union([t.String(), t.Null()]),
      }),
    ),
  }),
])

export type getAllCategories = typeof getAllCategories.static

export const categoryModel = new Elysia().model({
  addCategory: addCategory,
  getAllCategories: getAllCategories,
})
