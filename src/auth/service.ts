import bearer from '@elysiajs/bearer'
import jwt from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'
import db, { schema } from '../database'
import { eq } from 'drizzle-orm'
import { User } from '../user'
import { createDateTime } from '../utils'

export abstract class Auth {
  static async addSession(userId: string, refreshToken: string) {
    await db.insert(schema.refreshToken).values({
      userId,
      token: refreshToken,
      expiresAt: createDateTime({ days: 30, returnType: 'date' }),
    })
  }

  static async checkSession(refreshToken: string) {
    const row = await db
      .select()
      .from(schema.refreshToken)
      .where(eq(schema.refreshToken.token, refreshToken))
      .limit(1)

    if (row.length === 0) return false

    const token = row[0]

    return token.isRevoked
  }

  static async revokeSession(refreshToken: string) {
    await db
      .update(schema.refreshToken)
      .set({ isRevoked: true })
      .where(eq(schema.refreshToken.token, refreshToken))
  }

  static async register(username: string, password: string) {
    return await db.transaction(async (tx) => {
      const row = await tx
        .select()
        .from(schema.user)
        .where(eq(schema.user.username, username))
        .limit(1)

      tx.query.user.findFirst()

      if (row.length === 0) {
        return {
          status: 'fail',
          message: 'Pengguna sudah terdaftar',
        }
      }

      return row.length === 0 ? null : row[0]
    })
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

        const user = await User.findByUsername(isValid.username, db)
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
