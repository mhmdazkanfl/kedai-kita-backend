import { Elysia, t } from 'elysia'
import { Status } from '../auth/model'

export const errorModel = new Elysia().model({
  'Error Response': t.Object({
    status: t.UnionEnum([Status.SUCCESS, Status.FAIL, Status.ERROR]),
    message: t.String(),
  }),
})
