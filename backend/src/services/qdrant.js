import { QdrantVectorStore } from '@langchain/qdrant'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'

const collectionName = process.env.QDRANT_COLLECTION || 'pdf_docs'

export function getEmbeddings() {
  return new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY, model: 'text-embedding-004' })
}

function qdrantConfig() {
  return { url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY, collectionName }
}

export async function createVectorStore(documents) {
  return QdrantVectorStore.fromDocuments(documents, getEmbeddings(), qdrantConfig())
}

export async function getVectorStore() {
  return QdrantVectorStore.fromExistingCollection(getEmbeddings(), qdrantConfig())
}
