import { Elysia, t } from 'elysia'
import { authModel } from '@/auth/model'
import { errorModel } from '@/common/model'
import { Status } from '@/common/enum'
import { AuthService } from '@/auth/service'

export const auth = new Elysia({ prefix: '/auth', name: 'service/auth' })
  .use(authModel)
  .use(errorModel)
  .guard({
    response: {
      400: 'errorFail',
      409: 'errorFail',
      422: 'errorFail',
      500: 'errorError',
    },
  })
  .onError(({ code, error, status }) => {
    console.error('Error occurred:', error)

    switch (code) {
      case 'VALIDATION':
        return status(422, {
          status: Status.FAIL,
          message: error.message,
        })
      case 'PARSE':
        return status(400, {
          status: Status.FAIL,
          message: 'Gagal memparsing request body',
        })

      default:
        return status(500, {
          status: Status.ERROR,
          message: 'Terjadi kesalahan yang tidak diketahui',
        })
    }
  })
  .post(
    '/register',
    async ({ body: { username, password }, status }) => {
      if (await AuthService.isUsernameTaken(username)) {
        return status(409, {
          status: Status.FAIL,
          message: 'Nama pengguna sudah ada',
        })
      }

      const result = await AuthService.createUser(username, password)
      return status(201, result)
    },
    {
      body: 'registerBody',
      response: {
        201: 'registerResponse',
      },
    },
  )
