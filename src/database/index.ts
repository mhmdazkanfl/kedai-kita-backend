import { drizzle } from 'drizzle-orm/node-postgres'
import { user } from '@/database/schema'
import { eq } from 'drizzle-orm'

export const db = drizzle(process.env.DATABASE_URL!)

export abstract class DatabaseService {
  static async isUsernameTaken(username: string) {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
    return result.length > 0
  }

  static async insertUser(username: string, hashedPassword: string) {
    return await db
      .insert(user)
      .values({ username, password: hashedPassword })
      .returning()
      .onConflictDoNothing()
  }
}

// if (error instanceof DrizzleQueryError) {
//   const code = (error.cause as SystemError).code
//   switch (code) {
//     case 'ENOTFOUND':
//     case 'ETIMEDOUT':
//     case 'ECONNREFUSED':
//       throw status(500, {
//         status: Status.ERROR,
//         message: 'Gagal terkoneksi ke database',
//       })

//     default:
//       break
//   }

//   throw status(500, {
//     status: Status.ERROR,
//     message: 'Terjadi kesalahan ketika melakukan query ke database',
//   })
// }

// if (error instanceof TransactionRollbackError) {
//   const code = (error.cause as SystemError).code
//   switch (code) {
//     case 'ENOTFOUND':
//     case 'ETIMEDOUT':
//     case 'ECONNREFUSED':
//       throw status(500, {
//         status: Status.ERROR,
//         message: 'Gagal terkoneksi ke database',
//       })

//     default:
//       break
//   }

//   throw status(500, {
//     status: Status.ERROR,
//     message: 'Terjadi sebuah kesalahan, transaksi database dibatalkan',
//   })
// }

// if (error instanceof DrizzleError) {
//   return status(500, {
//     status: Status.ERROR,
//     message: 'Terjadi kesalahan pada database',
//   })
// }
