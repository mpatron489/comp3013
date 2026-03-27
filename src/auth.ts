import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db, schema } from './db'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema,
        camelCase: true,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [tanstackStartCookies()]
});