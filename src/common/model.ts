import { t } from 'elysia'
import { Status, STATUS } from './enum'

const createResponseSchema = (defaultStatus: Status) => {
  return t.Object({
    status: t.UnionEnum([STATUS.SUCCESS, STATUS.FAIL, STATUS.ERROR], {
      default: defaultStatus,
    }),
    message: t.String(),
  })
}

export const AppResponse = {
  Success: createResponseSchema(STATUS.SUCCESS),
  Fail: createResponseSchema(STATUS.FAIL),
  Error: createResponseSchema(STATUS.ERROR),
}
