import { Pinecone } from '@pinecone-database/pinecone'

export const getPineconeClient = async () => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: 'gcp-starter',
  })

  return pinecone
}
