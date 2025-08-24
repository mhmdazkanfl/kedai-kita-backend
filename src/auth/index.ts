import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import jwt from '@elysiajs/jwt'
import authModel from './model'
import { AppResponse } from '../common/model'
import User from '../user'
import { createJWTExp } from '../utils'

const authService = new Elysia({ name: 'auth/service' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    }),
  )
  .use(authModel)
  .use(bearer())
  .macro({
    isAuth: {
      beforeHandle: async ({
        bearer,
        status,
        jwt,
        cookie: { access_token },
      }) => {
        if (!bearer && !access_token)
          return status(401, {
            status: 'fail',
            message: 'Tidak terotorisasi',
          })

        const tokenOk = await jwt.verify(access_token.value)
        const bearerOk = await jwt.verify(bearer)

        if (!bearerOk && !tokenOk)
          return status(401, {
            status: 'fail',
            message: 'Tidak terotorisasi',
          })
      },
    },
  })

const protectedRoute = new Elysia()
  .use(authService)
  .guard({
    isAuth: true,
    cookie: 'token',
  })
  .as('scoped')

const auth = new Elysia({ prefix: '/auth' })
  .use(authService)
  .guard({
    response: {
      422: AppResponse.Fail,
      500: AppResponse.Error,
    },
  })
  .onError(({ code, error, status }) => {
    console.error(error)
    if (code === 'VALIDATION') {
      return status(422, {
        status: 'fail',
        message: error.message,
      })
    }

    if (code === 'UNKNOWN') {
      return status(500, {
        status: 'error',
        message: 'Terjadi kesalahan yang tidak diketahui',
      })
    }
  })
  .post(
    '/register',
    async ({ body: { username, password }, status }) => {
      const isFound = await User.findByUsername(username)
      if (isFound) {
        return status(409, {
          status: 'fail',
          message: 'Pengguna sudah terdaftar',
        })
      }

      const hashedPassword = await Bun.password.hash(password, 'argon2id')
      const user = await User.add(username, hashedPassword)

      if (!user) {
        return status(409, {
          status: 'fail',
          message:
            'Terjadi kesalahan saat mendaftarkan pengguna, coba lagi dalam beberapa saat',
        })
      }

      return status(201, {
        status: 'success',
        message: 'Pengguna berhasil di daftarkan',
      })
    },
    {
      body: 'register',
      response: {
        201: AppResponse.Success,
        409: AppResponse.Fail,
      },
    },
  )
  .post(
    '/login',
    async ({
      cookie: { access_token, refresh_token },
      body: { username, password },
      jwt,
      set,
      status,
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

      const accessTokenExp = createJWTExp({ minutes: 15 })
      const refreshTokenExp = createJWTExp({ days: 30 })
      const currentTime = createJWTExp({})

      const accessToken = await jwt.sign({
        sub: user.id,
        exp: accessTokenExp,
        nbf: currentTime,
        name: user.username,
      })

      const refreshToken = await jwt.sign({
        sub: user.id,
        exp: refreshTokenExp,
        nbf: currentTime,
        name: user.username,
      })

      set.headers['content-type'] = 'application/json' // For some reason set value on cookie causing response body to plain/text

      access_token.set({
        value: accessToken,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: accessTokenExp,
        path: '/',
      })

      refresh_token.set({
        value: refreshToken,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: refreshTokenExp,
        path: '/auth/refresh',
      })

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
        200: t.Composite([
          AppResponse.Success,
          t.Object({
            data: t.Object({
              id: t.String({ format: 'uuid' }),
              username: t.String(),
              accessToken: t.String(),
              refreshToken: t.String(),
            }),
          }),
        ]),
        401: AppResponse.Fail,
      },
      cookie: 'tokenOptional',
    },
  )
  .use(protectedRoute)
  .get('/profile', () => 'Hi')

export default auth
