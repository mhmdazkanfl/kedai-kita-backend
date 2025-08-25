import Elysia from 'elysia'
import { authService, getUser } from './service'
import { User } from '../user'
import { authModel } from './model'
import { commonModel } from '../common'
import swagger from '@elysiajs/swagger'

const auth = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
})
  .use(authModel)
  .use(commonModel)
  .use(authService)

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
        201: 'success',
        409: 'fail',
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
      })
      const refreshToken = await refreshTokenJwt.sign({
        id: user.id,
        username: user.username,
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
        200: 'loginSuccess',
        401: 'fail',
      },
    },
  )

  .use(getUser)
  .post('/logout', ({ user, status }) => {}, {
    detail: {
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  })

export { auth }
