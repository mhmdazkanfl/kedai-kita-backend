import { Elysia, t } from 'elysia'
import { Status } from '@/common/enum'

export const errorModel = new Elysia({ name: 'model/error' }).model({
  errorFail: t.Object({
    status: t.UnionEnum([Status.SUCCESS, Status.FAIL, Status.ERROR], {
      default: Status.FAIL,
    }),
    message: t.String(),
  }),
  errorError: t.Object({
    status: t.UnionEnum([Status.SUCCESS, Status.FAIL, Status.ERROR], {
      default: Status.ERROR,
    }),
    message: t.String(),
  }),
})
