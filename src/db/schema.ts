import { relations } from 'drizzle-orm'
import { customType, index, sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

/** Matches better-auth SQLite migrations: `date` columns store ISO strings. */
const isoDate = customType<{ data: Date; driverData: string }>({
  dataType: () => 'text',
  fromDriver: (value) => new Date(value),
  toDriver: (value) => value.toISOString(),
})

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: isoDate('createdAt').notNull(),
  updatedAt: isoDate('updatedAt').notNull(),
})

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: isoDate('expiresAt').notNull(),
    token: text('token').notNull().unique(),
    createdAt: isoDate('createdAt').notNull(),
    updatedAt: isoDate('updatedAt').notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: isoDate('accessTokenExpiresAt'),
    refreshTokenExpiresAt: isoDate('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: isoDate('createdAt').notNull(),
    updatedAt: isoDate('updatedAt').notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: isoDate('expiresAt').notNull(),
    createdAt: isoDate('createdAt').notNull(),
    updatedAt: isoDate('updatedAt').notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const schema = {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
}
