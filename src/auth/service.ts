import bearer from '@elysiajs/bearer'
import jwt from '@elysiajs/jwt'
import Elysia, { InferContext, t } from 'elysia'
import db from '../database'
import { UserRepository } from '../user'
import { createDateTime } from '../utils'
import { ResponseStatus, Response } from '../common'
import { AuthRepository } from './respoitory'

export abstract class AuthService {
  static async register(username: string, password: string): Promise<Response> {
    const transactionResult = await db.transaction(async (tx) => {
      const user = await UserRepository.findByUsername(username, tx)
      if (user) {
        return {
          code: 409,
          status: ResponseStatus.FAIL,
          message: 'Pengguna sudah terdaftar',
        }
      }

      const hashedPassword = await Bun.password.hash(password, 'argon2id')
      const newUser = await UserRepository.add(username, hashedPassword, tx)

      if (!newUser) {
        return {
          code: 409,
          status: ResponseStatus.FAIL,
          message:
            'Terjadi kesalahan saat mendaftarkan pengguna, coba lagi dalam beberapa saat',
        }
      }

      return {
        code: 201,
        status: ResponseStatus.SUCCESS,
        message: 'Pengguna berhasil terdaftar',
      }
    })

    return transactionResult
  }

  static async login(
    username: string,
    password: string,
    accessTokenJwt: AccessTokenJwtDecorator,
    refreshTokenJwt: RefreshTokenJwtDecorator,
  ): Promise<Response> {
    const transactionResult = await db.transaction(async (tx) => {
      const user = await UserRepository.findByUsername(username, tx)
      if (!user) {
        return {
          code: 401,
          status: ResponseStatus.FAIL,
          message: 'Nama pengguna atau password salah',
        }
      }

      const passwordValid = await Bun.password.verify(password, user.password)
      if (!passwordValid) {
        return {
          code: 401,
          status: ResponseStatus.FAIL,
          message: 'Nama pengguna atau password salah',
        }
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

      await AuthRepository.addSession(user.id, refreshToken, tx)

      return {
        code: 200,
        status: ResponseStatus.SUCCESS,
        message: 'Login berhasil',
        data: {
          id: user.id,
          username: user.username,
          accessToken,
          refreshToken,
        },
      }
    })

    return transactionResult
  }

  static async refresh(
    refreshToken: string,
    accessTokenJwt: AccessTokenJwtDecorator,
    refreshTokenJwt: RefreshTokenJwtDecorator,
  ): Promise<Response> {
    const transactionResult = await db.transaction(async (tx) => {
      const oldSession = await AuthRepository.getSession(refreshToken, tx)
      if (!oldSession) {
        return {
          code: 401,
          status: ResponseStatus.FAIL,
          message: 'Refresh token tidak valid',
        }
      }

      if (oldSession.isRevoked) {
        return {
          code: 401,
          status: ResponseStatus.FAIL,
          message: 'Refresh token kadaluarsa',
        }
      }

      const user = await refreshTokenJwt.verify(refreshToken)
      if (!user) {
        return {
          code: 401,
          status: ResponseStatus.FAIL,
          message: 'Refresh token kadaluarsa',
        }
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

      await AuthRepository.revokeSession(refreshToken, tx)
      await AuthRepository.addSession(user.id, newRefreshToken, tx)

      return {
        code: 201,
        status: ResponseStatus.SUCCESS,
        message: 'Refresh dan access token berhasil di buat',
        data: {
          id: user.id,
          username: user.username,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      }
    })

    return transactionResult
  }

  static async logout(refreshToken: string): Promise<Response> {
    const transactionResult = await db.transaction(async (tx) => {
      const oldRefreshToken = await AuthRepository.getSession(refreshToken, tx)

      if (!oldRefreshToken) {
        return {
          code: 401,
          status: ResponseStatus.FAIL,
          message: 'Refresh token tidak valid',
        }
      }

      await AuthRepository.revokeSession(refreshToken)

      return {
        code: 200,
        status: ResponseStatus.SUCCESS,
        message: 'Logout berhasil',
      }
    })

    return transactionResult
  }
}

export const authService = new Elysia({ name: 'auth/service' })
  .use(
    jwt({
      name: 'accessTokenJwt',
      secret: process.env.JWT_SECRET!,
      exp: createDateTime({ minutes: 15 }),
      schema: t.Object({
        id: t.String(),
        username: t.String(),
      }),
    }),
  )
  .use(
    jwt({
      name: 'refreshTokenJwt',
      secret: process.env.JWT_SECRET!,
      exp: createDateTime({ days: 30 }),
      schema: t.Object({
        id: t.String(),
        username: t.String(),
      }),
    }),
  )
  .use(bearer())
  .macro({
    isAuth: {
      resolve: async ({ status, bearer, accessTokenJwt, set, path }) => {
        if (!bearer) {
          set.headers['www-authenticate'] =
            `Bearer realm="${path}", error="invalid_request", error_description="Token tidak ditemukan"`
          return status(401, { status: 'fail', message: 'Tidak terotorisasi' })
        }

        const isValid = await accessTokenJwt.verify(bearer)
        if (!isValid) {
          set.headers['www-authenticate'] =
            `Bearer realm="${path}", error="invalid_token", error_description="Access token kadaluarsa"`
          return status(401, { status: 'fail', message: 'Tidak terotorisasi' })
        }

        const user = await UserRepository.findByUsername(isValid.username)
        if (!user) {
          set.headers['www-authenticate'] =
            `Bearer realm="${path}", error="user_not_found", error_description="Pengguna tidak ditemukan"`
          return status(401, { status: 'fail', message: 'Tidak terotorisasi' })
        }
        const { password, ...userProfile } = user
        return { user: userProfile }
      },
    },
  })

export const getUser = new Elysia({ name: 'auth/getUser' })
  .use(authService)
  .guard({
    isAuth: true,
  })
  .as('scoped')

export type AccessTokenJwtDecorator = InferContext<
  typeof authService
>['accessTokenJwt']
export type RefreshTokenJwtDecorator = InferContext<
  typeof authService
>['refreshTokenJwt']
// export abstract class Auth {
//   static async addSession(userId: string, refreshToken: string) {
//     await db.insert(schema.refreshToken).values({
//       userId,
//       token: refreshToken,
//       expiresAt: createDateTime({ days: 30, returnType: 'date' }),
//     })
//   }

//   static async checkSession(refreshToken: string) {
//     const row = await db
//       .select()
//       .from(schema.refreshToken)
//       .where(eq(schema.refreshToken.token, refreshToken))
//       .limit(1)

//     if (row.length === 0) return false

//     const token = row[0]

//     return token.isRevoked
//   }

//   static async revokeSession(refreshToken: string) {
//     await db
//       .update(schema.refreshToken)
//       .set({ isRevoked: true })
//       .where(eq(schema.refreshToken.token, refreshToken))
//   }

//   static async register(username: string, password: string) {
//     return await db.transaction(async (tx) => {
//       const row = await tx
//         .select()
//         .from(schema.user)
//         .where(eq(schema.user.username, username))
//         .limit(1)

//       tx.query.user.findFirst()

//       if (row.length === 0) {
//         return {
//           status: 'fail',
//           message: 'Pengguna sudah terdaftar',
//         }
//       }

//       return row.length === 0 ? null : row[0]
//     })
//   }
// }

// export const authService = new Elysia({ name: 'auth/service' })
//   .use(
//     jwt({
//       name: 'accessTokenJwt',
//       secret: process.env.JWT_SECRET!,
//       exp: createDateTime({ minutes: 15 }),
//       schema: t.Object({
//         id: t.String(),
//         username: t.String(),
//       }),
//     }),
//   )
//   .use(
//     jwt({
//       name: 'refreshTokenJwt',
//       secret: process.env.JWT_SECRET!,
//       exp: createDateTime({ days: 30 }),
//       schema: t.Object({
//         id: t.String(),
//         username: t.String(),
//       }),
//     }),
//   )
//   .use(bearer())
//   .macro({
//     isAuth: {
//       resolve: async ({ status, bearer, accessTokenJwt, set, path }) => {
//         if (!bearer) {
//           set.headers['www-authenticate'] =
//             `Bearer realm="${path}", error="invalid_request", error_description="Token tidak ditemukan"`
//           return status(401, { status: 'fail', message: 'Tidak terotorisasi' })
//         }

//         const isValid = await accessTokenJwt.verify(bearer)
//         if (!isValid) {
//           set.headers['www-authenticate'] =
//             `Bearer realm="${path}", error="invalid_token", error_description="Access token kadaluarsa"`
//           return status(401, { status: 'fail', message: 'Tidak terotorisasi' })
//         }

//         const user = await User.findByUsername(isValid.username)
//         if (!user) {
//           set.headers['www-authenticate'] =
//             `Bearer realm="${path}", error="user_not_found", error_description="Pengguna tidak ditemukan"`
//           return status(401, { status: 'fail', message: 'Tidak terotorisasi' })
//         }
//         const { password, ...userProfile } = user
//         return { user: userProfile }
//       },
//     },
//   })

// export const getUser = new Elysia({ name: 'auth/getUser' })
//   .use(authService)
//   .guard({
//     isAuth: true,
//   })
//   .as('scoped')
