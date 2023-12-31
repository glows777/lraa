import { AppRouter } from '@/server'
import { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>

type Messages = RouterOutput['getFileMessages']['messages']

type OmitText = Omit<Messages[number], 'content'>

type ExtendedText = {
  content: string | JSX.Element
}

export type ExtendedMessage = OmitText & ExtendedText
