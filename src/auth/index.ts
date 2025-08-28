import Elysia from 'elysia'
import { Auth, authService, getUser } from './service'
import { User } from '../user'
import { authModel } from './model'
import { commonModel } from '../common'
import db from '../database'

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

    if ((code as any) === 'ECONNREFUSED') {
      console.error('Error on unknown: ', error)
      return status(500, {
        status: 'error',
        message: 'Gagal terhubung ke database',
      })
    }

    console.log('Error code: ', code)
    console.log('Error details: ', error)
  })

  .post(
    '/register',
    async ({ body: { username, password }, status }) => {
      const result = await Auth.register(username, password)
      if (result.message === 'fail') {
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
      const user = await User.findByUsername(username)
      if (!user) {
        return status(401, {
          status: 'fail',
          message: 'Nama pengguna atau password salah',
        })
      }

      const passwordValid = await Bun.password.verify(password, user.password)
      if (!passwordValid) {
        return status(401, {
          status: 'fail',
          message: 'Nama pengguna atau password salah',
        })
      }

      const accessToken = await accessTokenJwt.sign({
        id: user.id,
        username: user.username,
        iat: true,
        jti: crypto.randomUUID(),
      })
      const refreshToken = await refreshTokenJwt.sign({
        id: user.id,
        username: user.username,
        iat: true,
        jti: crypto.randomUUID(),
      })

      await Auth.addSession(user.id, refreshToken)

      return status(200, {
        status: 'success',
        message: 'Login berhasil',
        data: {
          id: user.id,
          username: user.username,
          accessToken,
          refreshToken,
        },
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
      const isRevoked = await Auth.checkSession(refreshToken)
      if (isRevoked) {
        return status(401, {
          status: 'fail',
          message: 'Refresh token kadaluarsa',
        })
      }

      const user = await refreshTokenJwt.verify(refreshToken)
      if (!user) {
        return status(401, {
          status: 'fail',
          message: 'Refresh token tidak valid atau kadaluarsa',
        })
      }

      const newAccessToken = await accessTokenJwt.sign({
        id: user.id,
        username: user.username,
        iat: true,
        jti: crypto.randomUUID(),
      })
      const newRefreshToken = await refreshTokenJwt.sign({
        id: user.id,
        username: user.username,
        iat: true,
        jti: crypto.randomUUID(),
      })

      await Auth.revokeSession(refreshToken)
      await Auth.addSession(user.id, newRefreshToken)

      return status(201, {
        status: 'success',
        message: 'Refresh dan access token berhasil di buat',
        data: {
          id: user.id,
          username: user.username,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
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
      await Auth.revokeSession(refreshToken)
      return status(200, {
        status: 'success',
        message: 'Logout berhasil',
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
