import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import { TRPCError, initTRPC } from '@trpc/server'

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create()

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure

const authMiddleware = t.middleware(async (opts) => {
    const { getUser } = getKindeServerSession()

    const user = await getUser()

    if (!user || !user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED'})
    }

    return opts.next({
        ctx: {
            user,
            userId: user.id
        }
    })
})

export const privateProcedure = t.procedure.use(authMiddleware)