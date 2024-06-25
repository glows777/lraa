import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { NextRequest } from 'next/server'

import { db } from '@/db'
import { openai } from '@/lib/openai'
import { getPineconeClient } from '@/lib/pinecore'
import { sendMessageValidator } from '@/lib/validators/send-message-vallidator'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user || !user.id) {
    throw new Response('Unauthorized', { status: 401 })
  }

  // * validator the params and get its params
  const { fileId, message } = sendMessageValidator.parse(body)

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  })

  if (!file) {
    return new Response('NOT found', { status: 404 })
  }

  await db.message.create({
    data: {
      content: message,
      isUserMessage: true,
      userId: user.id,
      fileId,
    },
  })

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })
  const pinecone = await getPineconeClient()
  const index = pinecone.Index('lraa')

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: file.id,
  })

  const results = await vectorStore.similaritySearch(message, 4)

  const prevMessage = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 6,
  })

  const formattedPrevMessages = prevMessage.map((msg) => ({
    role: msg.isUserMessage ? ('user' as const) : ('assistant' as const),
    content: msg.content,
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedPrevMessages.map((message) => {
      if (message.role === 'user') return `User: ${message.content}\n`
      return `Assistant: ${message.content}\n`
    })}
    
    \n----------------\n
    
    CONTEXT:
    ${results.map((r) => r.pageContent).join('\n\n')}
    
    USER INPUT: ${message}`,
      },
    ],
  })

  const stream = OpenAIStream(response, {
    onCompletion: async (completions) => {
      await db.message.create({
        data: {
          fileId,
          userId: user.id,
          content: completions,
          isUserMessage: false,
        },
      })
    },
  })

  return new StreamingTextResponse(stream)
}
