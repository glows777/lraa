import { useIntersection } from '@mantine/hooks'
import { Loader2, MessageSquare } from 'lucide-react'
import { FC, useContext, useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import Simplebar from 'simplebar-react'

import { trpc } from '@/app/_trpc/client'
import { ChatContext } from '@/components/providers/chat-provider'
import { INFINITE_QUERY_LIMIT } from '@/constant'

import Message from './message'
import { useTranslations } from 'next-intl'

interface MessageListProps {
  fileId: string
}

const MessageList: FC<MessageListProps> = ({ fileId }) => {
  const { isLoading: isAiThinking } = useContext(ChatContext)
  const t = useTranslations('file')

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    )
  const messages = data?.pages.flatMap((page) => page.messages)

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    content: (
      <span className=" flex h-full items-center justify-center">
        <Loader2 className=" h-4 w-4 animate-spin" />
      </span>
    ),
  }

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ]

  const lastMessageRef = useRef<HTMLDivElement>(null)

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  })

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  return (
    <div
      className=" w-full flex max-h-[calc(100vh-3.5rem-7rem)] overflow-y-auto border-neutral-200 flex-1 flex-col-reverse gap-4 p-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((msg, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                key={msg.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={msg}
                ref={ref}
              />
            )
          }
          return (
            <Message
              key={msg.id}
              isNextMessageSamePerson={isNextMessageSamePerson}
              message={msg}
            />
          )
        })
      ) : isLoading ? (
        <div className=" w-full flex flex-col gap-2">
          <Skeleton className=" h-16" />
          <Skeleton className=" h-20" />
          <Skeleton className=" h-16" />
          <Skeleton className=" h-20" />
        </div>
      ) : (
        <div className=" flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className=" h-8 w-8 text-black-500" />
          <h3 className=" font-semibold text-xl">{t('allSet')}</h3>
          <p className=" text-neutral-500 text-sm">
            {t('tooltip-success')}
          </p>
        </div>
      )}
    </div>
  )
}

export default MessageList
