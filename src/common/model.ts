import Elysia, { t } from 'elysia'
import { ResponseStatus } from './enum'
import type { ResponseStatusType } from './enum'
import { NumOverloads } from 'bun-types/vendor/expect-type'

export const createResponse = (defaultStatus: ResponseStatusType) => {
  return t.Object({
    status: t.UnionEnum(
      [ResponseStatus.SUCCESS, ResponseStatus.FAIL, ResponseStatus.ERROR],
      {
        default: defaultStatus,
      },
    ),
    message: t.String(),
  })
}

export const commonModel = new Elysia().model({
  fail: createResponse(ResponseStatus.FAIL),
  error: createResponse(ResponseStatus.ERROR),
  success: createResponse(ResponseStatus.SUCCESS),
})

export type Response = {
  code: number
  status: ResponseStatusType
  message: string
  data?: any
}
