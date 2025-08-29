import Elysia from 'elysia'
import { AuthService, authService, getUser } from './service'
import { authModel } from './model'
import { commonModel } from '../common'

export const auth = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
})
  .use(authModel)
  .use(commonModel)
  .use(authService)

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

  .post(
    '/register',
    async ({ body: { username, password }, status }) => {
      const result = await AuthService.register(username, password)

      if (result.code === 409) {
        return status(409, {
          status: result.status,
          message: result.message,
        })
      }

      return status(201, {
        status: result.status,
        message: result.message,
      })
    },
    {
      body: 'register',
      response: {
        201: 'success',
        409: 'fail',
        422: 'fail',
        500: 'error',
      },
    },
  )

  .post(
    '/login',
    async ({
      body: { username, password },
      status,
      accessTokenJwt,
      refreshTokenJwt,
    }) => {
      const result = await AuthService.login(
        username,
        password,
        accessTokenJwt,
        refreshTokenJwt,
      )

      if (result.code === 401) {
        return status(401, {
          status: result.status,
          message: result.message,
        })
      }

      return status(200, {
        status: result.status,
        message: result.message,
        data: result.data,
      })
    },
    {
      body: 'login',
      response: {
        200: 'loginSuccess',
        401: 'fail',
        422: 'fail',
        500: 'error',
      },
    },
  )

  .post(
    '/refresh',
    async ({
      accessTokenJwt,
      refreshTokenJwt,
      status,
      body: { refreshToken },
    }) => {
      const result = await AuthService.refresh(
        refreshToken,
        accessTokenJwt,
        refreshTokenJwt,
      )

      if (result.code === 401) {
        return status(401, {
          status: result.status,
          message: result.message,
        })
      }

      return status(201, {
        status: result.status,
        message: result.message,
        data: result.data,
      })
    },
    {
      body: 'refresh',
      response: {
        201: 'loginSuccess',
        401: 'fail',
        422: 'fail',
        500: 'error',
      },
    },
  )

  // Required bearer
  .guard({
    // Putting this swagger security config in a separate elysia instance
    // does not work. Even after changing the scope
    detail: {
      security: [{ bearerAuth: [] }],
    },
  })
  // Protected route
  .use(getUser)

  .post(
    '/logout',
    async ({ status, body: { refreshToken } }) => {
      const result = await AuthService.logout(refreshToken)

      if (result.code === 200) {
        return status(200, {
          status: result.status,
          message: result.message,
        })
      }

      return status(500, {
        status: result.status,
        message: result.message,
      })
    },
    {
      body: 'refresh',
      response: {
        200: 'success',
        401: 'fail',
        422: 'fail',
        500: 'error',
      },
    },
  )
