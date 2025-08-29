import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: true,
  },
  schema: schema,
})

export function getDatabaseExecutor(tx?: TransactionType) {
  return tx ?? db
}

export type DatabaseType = typeof db
export type TransactionType = Parameters<
  Parameters<DatabaseType['transaction']>[0]
>[0]

export { schema }
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
