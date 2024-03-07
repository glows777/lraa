import { useMutation } from '@tanstack/react-query'
import {
  ChangeEvent,
  FC,
  ReactNode,
  createContext,
  useRef,
  useState,
} from 'react'

import { trpc } from '@/app/_trpc/client'
import { toast } from '@/components/ui/use-toast'
import { INFINITE_QUERY_LIMIT } from '@/constant'
import { useTranslations } from 'next-intl'

interface ChatProviderProps {
  children: ReactNode
  fileId: string
}

interface StreamResponse {
  addMessage: () => void
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
  message: string
}

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  handleInputChange: () => {},
  isLoading: false,
  message: '',
})

const ChatProvider: FC<ChatProviderProps> = ({ children, fileId }) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('common')

  const backupMessage = useRef('')

  const utils = trpc.useUtils()

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send Message')
      }

      return response.body
    },

    onMutate: async ({ message }) => {
      backupMessage.current = message
      setMessage('')

      await utils.getFileMessages.cancel()
      const previousMessages = utils.getFileMessages.getInfiniteData()
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            }
          }

          let newPages = [...old.pages]
          let latestPage = newPages[0]!

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              content: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ]
          newPages[0] = latestPage

          return {
            ...old,
            pages: newPages,
          }
        }
      )

      setIsLoading(true)
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      }
    },
    onSuccess: async (stream) => {
      if (!stream) {
        return toast({
          title: t('chat-failed-title'),
          description: t('chat-failed-description'),
          variant: 'destructive',
        })
      }

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let done = false

      let accResponse = ''
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)

        accResponse += chunkValue

        utils.getFileMessages.setInfiniteData(
          {
            fileId,
            limit: INFINITE_QUERY_LIMIT,
          },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              }
            }

            let isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((msg) => msg.id === 'ai-response')
            )

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: 'ai-response',
                      content: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ]
                } else {
                  updatedMessages = page.messages.map((msg) => {
                    if (msg.id === 'ai-response') {
                      return {
                        ...msg,
                        content: accResponse,
                      }
                    }
                    return msg
                  })
                }
                return {
                  ...page,
                  messages: updatedMessages,
                }
              }
              return page
            })

            return { ...old, pages: updatedPages }
          }
        )
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current)
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      )
    },
    onSettled: async () => {
      setIsLoading(false)
      await utils.getFileMessages.invalidate({ fileId })
    },
  })

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }
  const addMessage = () => sendMessage({ message })

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
