import { Elysia, t } from 'elysia'
import { authModel } from '@/auth/model'
import { errorModel } from '@/common/model'
import { Status } from '@/common/enum'
import { AuthService } from '@/auth/service'
import jwt from '@elysiajs/jwt'
import { createJWTExp } from '@/utils'

export const auth = new Elysia({ prefix: '/auth', name: 'service/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    }),
  )
  .use(authModel)
  .use(errorModel)
  .guard({
    response: {
      400: 'errorFail',
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
      const user = await AuthService.findUserByUsername(username)
      if (user) {
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
        409: 'errorFail',
      },
    },
  )
  .post(
    '/login',
    async ({ body: { username, password }, status, jwt }) => {
      const user = await AuthService.findUserByUsername(username)
      if (!user) {
        return status(401, {
          status: Status.FAIL,
          message: 'Nama pengguna atau kata sandi salah',
        })
      }

      const isValid = await AuthService.validatePassword(
        password,
        user.password,
      )
      if (!isValid) {
        return status(401, {
          status: Status.FAIL,
          message: 'Nama pengguna atau kata sandi salah',
        })
      }

      const accessTokenExp = createJWTExp({ minutes: 10 })
      const refreshTokenExp = createJWTExp({ days: 7 })

      const accessToken = await jwt.sign({
        iss: user.id,
        exp: accessTokenExp,
      })
      const refreshToken = await jwt.sign({
        id: user.id,
        exp: refreshTokenExp,
      })

      await AuthService.insertRefreshToken(
        user.id,
        refreshToken,
        new Date(refreshTokenExp * 1000),
      )

      return status(200, {
        status: Status.SUCCESS,
        message: 'Login berhasil',
        data: {
          id: user.id,
          username,
          accessToken,
          refreshToken,
        },
      })
    },
    {
      body: 'loginBody',
      response: {
        200: 'loginResponse',
        401: 'errorFail',
      },
    },
  )
