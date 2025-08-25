// import { relations } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  boolean,
  index,
} from 'drizzle-orm/pg-core'

const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username').notNull().unique(),
  password: varchar('password').notNull(), // Store hashed password
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

const refreshToken = pgTable(
  'refresh_token',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    token: text('token').notNull().unique(), // Store hashed refresh token
    expiresAt: timestamp('expires_at').notNull(),
    isRevoked: boolean('is_revoked').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('user_id_idx').on(table.userId)],
)

export const schema = { user, refreshToken }

// Relations
// export const userRelations = relations(user, ({ many }) => ({
//   refreshTokens: many(refreshToken),
// }))

// export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
//   user: one(user, {
//     fields: [refreshToken.userId],
//     references: [user.id],
//   }),
// }))

// export const table = {
//   user,
//   refreshToken,
// } as const

// export type Table = typeof table

// requires you passed { schema } to drizzle(...)
// const u = await db.query.user.findFirst({
//   where: eq(user.username, 'alice'),
//   with: { refreshTokens: true },   // <-- needs relations(user, ...)
// });

// const tokens = await db.query.refreshToken.findMany({
//   where: eq(refreshToken.isRevoked, false),
//   with: { user: true },            // <-- needs relations(refreshToken, ...)
// });
