import { Elysia, status, t } from 'elysia'
import { authModel, Status } from './model'
import { AuthService } from './service'
import { errorModel } from '../common/model'

export const auth = new Elysia({ prefix: '/auth' })
  .use(authModel)
  .use(errorModel)
  .onRequest(({ request }) => {
    if (request.headers.get('content-type') !== 'application/json') {
      return status(400, {
        status: Status.FAIL,
        message: 'Content Type pada request body tidak sesuai',
      })
    }
  })
  .onError(({ code, error }) => {
    if (code === 'VALIDATION') {
      return status(422, {
        status: Status.FAIL,
        message: error.message,
      })
    }

    if (code === 'PARSE') {
      return status(400, {
        status: Status.FAIL,
        message: 'Gagal memparsing request body',
      })
    }
  })
  .post(
    '/register',
    async ({ body }) => {
      const result = await AuthService.register(body.username, body.password)
      return status(201, result)
    },
    {
      body: t.Ref('registerBody'),
      response: {
        201: t.Ref('registerResponse'),
        400: t.Ref('errorResponse'),
        422: t.Ref('errorResponse'),
        500: t.Ref('errorResponse'),
      },
    },
  )
  .post('/login', {})
