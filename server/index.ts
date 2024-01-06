import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { z } from 'zod'

import { INFINITE_QUERY_LIMIT } from '@/constant'
import { db } from '@/db'
import { TRPCError } from '@trpc/server'

import { privateProcedure, publicProcedure, router } from './trpc'

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id || !user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    // * check if user exists in db
    const dbUser = await db.user.findFirst({
      where: { id: user.id },
    })

    if (!dbUser) {
      // * create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      })
    }
    return { success: true, user }
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx
    const files = await db.file.findMany({
      where: { userId },
    })
    return files
  }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx
      const { id } = input
      const file = await db.file.findFirst({
        where: { id, userId },
      })
      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      await db.file.delete({
        where: { id },
      })
      return { success: true }
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      })

      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return file
    }),

  getFileUploadStatus: privateProcedure
    .input(
      z.object({
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx
      const { fileId } = input

      const file = await db.file.findFirst({
        where: {
          userId,
          id: fileId,
        },
      })

      if (!file) {
        return { status: 'PENDING' as const }
      }

      return { status: file.status }
    }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(99).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx
      const { fileId, cursor } = input
      const limit = input.limit ?? INFINITE_QUERY_LIMIT

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      })

      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          content: true,
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (messages.length > limit) {
        const nextItem = messages.pop()
        nextCursor = nextItem?.id
      }

      return {
        messages,
        nextCursor,
      }
    }),
})

export type AppRouter = typeof appRouter
