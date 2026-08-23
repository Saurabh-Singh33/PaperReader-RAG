import fs from 'node:fs/promises'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { createVectorStore } from './qdrant.js'

export async function ingestPDF(filePath, userId) {
  try {
    const loader = new PDFLoader(filePath)
    const pages = await loader.load()
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
    const chunks = await splitter.splitDocuments(pages)
    const timestamp = new Date().toISOString()
    chunks.forEach((chunk) => { chunk.metadata = { ...chunk.metadata, userId, uploadedAt: timestamp } })
    if (chunks.length === 0) throw new Error('No readable text was found in the PDF.')
    await createVectorStore(chunks)
    return { success: true, chunkCount: chunks.length }
  } finally {
    await fs.unlink(filePath).catch(() => {})
  }
}
