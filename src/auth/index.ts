import { Elysia, status } from 'elysia'
import { authModel, Status } from './model'
import { AuthService } from './service'
import { errorModel } from '../common/model'

export const auth = new Elysia({ prefix: '/auth' })
  .use(authModel)
  .use(errorModel)
  .onError(({ code, error }) => {
    if (code === 'VALIDATION') {
      return {
        status: Status.FAIL,
        message: error.message,
      }
    }
  })
  .post(
    '/register',
    async ({ body }) => {
      const result = await AuthService.register(body.username, body.password)
      return status(201, result)
    },
    {
      body: 'Register Body',
      response: {
        201: 'Register Success Response',
        422: 'Error Response',
        500: 'Error Response',
      },
    },
  )
