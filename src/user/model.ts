import Elysia, { t } from 'elysia'

const user = t.Object({
  id: t.String({ format: 'uuid' }),
  username: t.String(),
  password: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

export const userModel = new Elysia().model({
  user: user,
})
