import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const collectionName = process.env.QDRANT_COLLECTION || "pdf_docs";

export function getEmbeddings() {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });
}

function qdrantConfig() {
  return {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName,
  };
}

export async function ensurePayloadIndexes() {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });
  for (const fieldName of [
    "metadata.userId",
    "metadata.documentId",
    "metadata.source",
  ]) {
    await client.createPayloadIndex(collectionName, {
      field_name: fieldName,
      field_schema: "keyword",
      wait: true,
    });
  }
}

export async function createVectorStore(documents) {
  const store = await QdrantVectorStore.fromDocuments(
    documents,
    getEmbeddings(),
    qdrantConfig(),
  );
  await ensurePayloadIndexes();
  return store;
}

export async function getVectorStore() {
  const store = await QdrantVectorStore.fromExistingCollection(
    getEmbeddings(),
    qdrantConfig(),
  );
  await ensurePayloadIndexes();
  return store;
}
