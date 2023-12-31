import { Send } from 'lucide-react'
import { FC, useContext, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatContext } from '@/components/providers/chat-provider'

interface ChatInputProps {
  isDisable?: boolean
}

const ChatInput: FC<ChatInputProps> = ({ isDisable }) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleSendMessage = () => {
    addMessage()
    textareaRef.current?.focus()
  }
  return (
    <div className=" absolute bottom-0 left-0 w-full">
      <div className=" mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className=" relative flex h-full flex-1 items-stretch md:flex-col">
          <div className=" relative flex flex-col w-full flex-grow p-4">
            <div className=" relative">
              <Textarea
                rows={1}
                maxRows={4}
                autoFocus
                disabled={isDisable}
                placeholder="Enter your question..."
                className=" resize-none pr-12 text-base py-3 focus-visible:border-none"
                ref={textareaRef}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                className=" absolute right-[8px] top-[25%]"
                aria-label="send message"
                // variant='ghost'
                onClick={handleSendMessage}
              >
                <Send className=" h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
