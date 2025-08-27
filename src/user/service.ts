import { DatabaseType, schema, TransactionType } from '../database'

export abstract class User {
  static async findByUsername(
    username: string,
    db: DatabaseType | TransactionType,
  ) {
    return await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.username, username),
    })
  }

  static async findById(id: string, db: DatabaseType | TransactionType) {
    return await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    })
  }

  static async add(
    username: string,
    hashedPassword: string,
    db: DatabaseType | TransactionType,
  ) {
    const addedUser = await db
      .insert(schema.user)
      .values({ username, password: hashedPassword })
      .returning()
      .onConflictDoNothing()

    return addedUser.length === 0 ? null : addedUser[0]
  }
}

// class User {
//   private static instance: User

//   private constructor(private db: DatabaseType) {}

//   static getInstance(db?: DatabaseType): User {
//     // If the instance doesn't exist yet, create it.
//     if (!User.instance) {
//       // The 'db' object is required for the first time.
//       if (!db) {
//         throw new Error(
//           'Database instance must be provided on first call to getInstance.',
//         )
//       }
//       User.instance = new User(db)
//     }
//     // Return the single, existing instance.
//     return User.instance
//   }

//   private getExecutor(tx?: TransactionType): Executor {
//     return tx ?? this.db
//   }

//   static async findByUsername(username: string, tx?: TransactionType) {
//     const executor = this.getExecutor(tx)
//     const row = await executor
//       .select()
//       .from(schema.user)
//       .where(eq(schema.user.username, username))
//       .limit(1)

//     return row.length === 0 ? null : row[0]
//   }

//   static async findById(id: string) {
//     const row = await db
//       .select()
//       .from(schema.user)
//       .where(eq(schema.user.id, id))
//       .limit(1)
//     return row.length === 0 ? null : row[0]
//   }

//   static async add(username: string, hashedPassword: string) {
//     const addedUser = await db
//       .insert(schema.user)
//       .values({ username, password: hashedPassword })
//       .returning()
//       .onConflictDoNothing()

//     return addedUser.length === 0 ? null : addedUser[0]
//   }
// }
