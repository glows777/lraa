'use client'

import { Loader2, XCircle } from 'lucide-react'
import { FC, ReactNode } from 'react'

import { trpc } from '@/app/_trpc/client'

import ChatInput from './chat-input'

interface ChatWrapperProps {
  fileId: string
}

const ChatWrapper: FC<ChatWrapperProps> = ({ fileId }) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500,
    }
  )

  if (isLoading) {
    return (
      <div className=" relative min-h-full bg-neutral-50 flex divide-y divide-neutral-200 flex-col justify-between gap-2">
        <div className=" flex-1 flex justify-center items-center flex-col mb-20">
          <div className=" flex flex-col items-center gap-2">
            <Loader2 className=" h-8 w08 text-blue-500 animate-spin" />
            <h3 className=" font-semibold text-xl">Loading...</h3>
            <p className=" text-neutral-500 text-sm">
              we&apos;re preparing your PDF
            </p>
          </div>
        </div>
        <ChatInput isDisable />
      </div>
    )
  }

  if (data?.status === 'FAILED') {
    return (
      <div className=" relative min-h-full bg-neutral-50 flex divide-y divide-neutral-200 flex-col justify-between gap-2">
        <div className=" flex-1 flex justify-center items-center flex-col mb-20">
          <div className=" flex flex-col items-center gap-2">
            <XCircle className=" h-8 w-8 text-red-500" />
            <h3 className=" font-semibold text-xl">
              Oops, there seems to have some errors
            </h3>
          </div>
        </div>
        <ChatInput isDisable />
      </div>
    )
  }

  if (data?.status === 'PROCESSING') {
    return (
      <div className=" relative min-h-full bg-neutral-50 flex divide-y divide-neutral-200 flex-col justify-between gap-2">
        <div className=" flex-1 flex justify-center items-center flex-col mb-28">
          <div className=" flex flex-col items-center gap-2">
            <Loader2 className=" h-8 w-8 text-blue-500 animate-spin" />
            <h3 className=" font-semibold text-xl">Processing PDF...</h3>
            <p className=" text-neutral-500 text-sm">
              This won&apos;t take long
            </p>
          </div>
        </div>
        <ChatInput isDisable />
      </div>
    )
  }

  return (
    <div className=" relative min-h-full bg-neutral-50 flex divide-y divide-neutral-200 flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        message container
      </div>

      <ChatInput />
    </div>
  )
}

export default ChatWrapper
