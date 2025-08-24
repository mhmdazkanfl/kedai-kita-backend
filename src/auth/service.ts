// import { DatabaseService } from '@/database'
// import { Status } from '@/common/enum'

// export abstract class AuthService {
//   static findUserByUsername = async (username: string) =>
//     await DatabaseService.findUserByUsername(username)

//   static async createUser(username: string, password: string) {
//     const hashedPassword = await Bun.password.hash(password, 'argon2d')
//     const [user] = await DatabaseService.insertUser(username, hashedPassword)

//     return {
//       status: Status.SUCCESS,
//       message: 'Pengguna berhasil didaftarkan',
//       data: {
//         id: user.id,
//         username,
//       },
//     }
//   }

//   static validatePassword = async (password: string, hashedPassword: string) =>
//     await Bun.password.verify(password, hashedPassword)

//   static insertRefreshToken = async (
//     userId: string,
//     token: string,
//     expiresAt: Date,
//   ) => await DatabaseService.insertRefreshToken(userId, token, expiresAt)
// }
