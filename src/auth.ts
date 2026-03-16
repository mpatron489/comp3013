import { betterAuth } from 'better-auth'
import Database  from 'better-sqlite3'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [tanstackStartCookies()]
});