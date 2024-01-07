import { format } from 'date-fns'
import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'

import { Icons } from '@/components/icon'
import { cn } from '@/lib/utils'
import { ExtendedMessage } from '@/types/message'

interface MessageProps {
  message: ExtendedMessage
  isNextMessageSamePerson: boolean
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        className={cn('flex items-end w-full my-5', {
          'justify-end': message.isUserMessage,
        })}
        ref={ref}
      >
        <div
          className={cn(
            'relative flex h-6 w-6 aspect-square items-center justify-center',
            {
              'order-2 bg-blue-600 rounded-sm': message.isUserMessage,
              'order-1 bg-neutral-800 rounded-sm': !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-neutral-200 text-neutral-200 h-3/4 w-3/4" />
          ) : (
            <Icons.logo className="fill-neutral-300 h-3/4 w-3/4" />
          )}
        </div>

        <div
          className={cn('flex flex-col space-y-2 text-base max-w-md mx-2 w-[94%]', {
            'order-1 items-end': message.isUserMessage,
            'order-2 items-start': !message.isUserMessage,
          })}
        >
          <div
            className={cn('px-4 py-2 rounded-lg inline-block w-[calc(100%-40px)]', {
              'bg-blue-600 text-white': message.isUserMessage,
              'bg-gray-200 text-gray-900': !message.isUserMessage,
              'rounded-br-none':
                !isNextMessageSamePerson && message.isUserMessage,
              'rounded-bl-none':
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.content === 'string' ? (
              <ReactMarkdown
                className={cn('prose', {
                  'text-neutral-50': message.isUserMessage,
                })}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              message.content
            )}
            {message.id !== 'loading-message' ? (
              <div
                className={cn('text-xs select-none mt-2 w-full text-right', {
                  'text-neutral-500': !message.isUserMessage,
                  'text-blue-300': message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), 'HH:mm')}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

Message.displayName = 'Message'

export default Message
