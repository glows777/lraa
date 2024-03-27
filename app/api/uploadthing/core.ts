import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import { db } from '@/db'
import { getPineconeClient } from '@/lib/pinecore'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: '128MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      if (!user || !user.id) {
        throw new Error('Unauthorized')
      }
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const isFileExist = await db.file.findFirst({
        where: {
          key: file.key,
          userId: metadata.userId,
        },
      })
      if (isFileExist) return

      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          status: 'PROCESSING',
        },
      })

      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        )

        const blob = await response.blob()
        const loader = new PDFLoader(blob)
        // * load the document by langchain
        const pageLevelDocs = await loader.load()

        //*  get pinecone client && index
        const pinecone = await getPineconeClient()
        const pineconeIndex = pinecone.Index('lraa')

        // * create embeddings
        // * so that we can store the document in pinecone by using embeddings
        const embedings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        })

        // * store the document in pinecone by openaiEmbeddings
        await PineconeStore.fromDocuments(pageLevelDocs, embedings, {
          pineconeIndex,
          namespace: createdFile.id,
        })

        await db.file.update({
          data: {
            status: 'SUCCESS',
          },
          where: {
            id: createdFile.id,
          },
        })
      } catch (e) {
        // console.log(e)
        await db.file.update({
          data: {
            status: 'FAILED'
          },
          where: {
            id: createdFile.id
          }
        })
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
