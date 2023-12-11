import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server'
import { publicProcedure, router } from './trpc'
import { TRPCError } from '@trpc/server'

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return { success: true, user }
  }),
})

export type AppRouter = typeof appRouter
