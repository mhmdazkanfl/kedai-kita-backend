import { DatabaseService } from '@/database'
import { Status } from '@/common/enum'

export abstract class AuthService {
  static isUsernameTaken = async (username: string) =>
    await DatabaseService.isUsernameTaken(username)

  static async createUser(username: string, password: string) {
    const hashedPassword = await Bun.password.hash(password, 'argon2d')
    const [user] = await DatabaseService.insertUser(username, hashedPassword)

    return {
      status: Status.SUCCESS,
      message: 'Pengguna berhasil didaftarkan',
      data: {
        id: user.id,
        username,
      },
    }
  }
}
