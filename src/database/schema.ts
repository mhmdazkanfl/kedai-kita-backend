import { relations } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  boolean,
  index,
  integer,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username').notNull().unique(),
  password: varchar('password').notNull(), // Store hashed password
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const refreshToken = pgTable(
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
  },
  (table) => [index('user_id_idx').on(table.userId)],
)

// Menu
export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull().unique(),
  description: text('description'),
})

export const menu = pgTable('menu', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => menuCategories.id, {
    onDelete: 'set null', // Keep item even if category is deleted
  }),
  name: varchar('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  imageUrl: varchar('image_url').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Order
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'preparing',
  'ready_for_pickup',
  'completed',
  'cancelled',
])

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => user.id, { onDelete: 'cascade' }) // Delete orders if user is deleted
    .notNull(),
  totalPrice: integer('total_price').notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// -- Order Items Table (Join Table) --
// Links menu items to orders, creating the line items for each order.
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' }) // Delete line item if order is deleted
    .notNull()
    .unique(),
  menuItemId: uuid('menu_item_id')
    .references(() => menu.id, {
      onDelete: 'set null',
    })
    .unique(), // Keep order history even if item is deleted
  quantity: integer('quantity').notNull(),
  // CRITICAL: Store the price at the time of order to prevent changes
  // if the menu item's price is updated later.
  priceAtTimeOfOrder: integer('price_at_time_of_order').notNull(),
})

// Relations
export const userRelations = relations(user, ({ many }) => ({
  refreshTokens: many(refreshToken),
  orders: many(orders),
}))

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
  user: one(user, {
    fields: [refreshToken.userId],
    references: [user.id],
  }),
}))

export const menuCategoriesRelations = relations(
  menuCategories,
  ({ many }) => ({
    menu: many(menu),
  }),
)

export const menuRelations = relations(menu, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [menu.categoryId],
    references: [menuCategories.id],
  }),
  orderItems: many(orderItems),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  orderItems: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menu, {
    fields: [orderItems.menuItemId],
    references: [menu.id],
  }),
}))

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

// export const userRelations = relations(user, ({ many }) => ({
//   orders: many(orders),
// }))
