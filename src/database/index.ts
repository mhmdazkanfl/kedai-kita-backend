import { drizzle } from 'drizzle-orm/node-postgres'

const db = drizzle(process.env.DATABASE_URL!)

export default db
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
