import { status } from 'elysia'
import { DatabaseService } from '../database'
import { Status } from './model'
import {
  DrizzleQueryError,
  DrizzleError,
  TransactionRollbackError,
} from 'drizzle-orm/errors'

export abstract class AuthService {
  static async register(username: string, password: string) {
    try {
      if (await DatabaseService.isUsernameTaken(username)) {
        throw status(422, {
          status: Status.FAIL,
          message: 'Nama pengguna sudah ada',
        })
      }

      const hashedPassword = await Bun.password.hash(password, 'argon2d')
      const result = await DatabaseService.insertUser(username, hashedPassword)

      return {
        status: Status.SUCCESS,
        message: 'Pengguna berhasil didaftarkan',
        data: {
          id: result[0].id,
          username,
        },
      }
    } catch (error) {
      console.error('Database error:', error)

      if (error instanceof DrizzleQueryError) {
        if (error.cause?.message.includes('ECONNREFUSED')) {
          throw status(500, {
            status: Status.ERROR,
            message: 'Gagal terkoneksi ke database',
          })
        } else {
          throw status(500, {
            status: Status.ERROR,
            message: 'Kesalahan pada query database',
          })
        }
      }

      if (error instanceof DrizzleError) {
        throw status(500, {
          status: Status.ERROR,
          message: 'Terjadi kesalahan pada database',
        })
      }

      if (error instanceof TransactionRollbackError) {
        throw status(500, {
          status: Status.ERROR,
          message: 'Transaksi database dibatalkan',
        })
      }

      throw status(500, {
        status: Status.ERROR,
        message: 'Terjadi sebuah kesalahan',
      })
    }
  }
}
