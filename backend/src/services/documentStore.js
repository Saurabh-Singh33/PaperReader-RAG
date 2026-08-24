import { createHash } from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";
import { ensurePayloadIndexes } from "./qdrant.js";

const collectionName = process.env.QDRANT_COLLECTION || "pdf_docs";

function client() {
  return new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });
}

function legacyId(source) {
  return createHash("sha256").update(source).digest("hex").slice(0, 24);
}

export async function listDocuments(userId) {
  await ensurePayloadIndexes();
  const response = await client().scroll(collectionName, {
    limit: 1000,
    with_payload: true,
    with_vector: false,
    filter: { must: [{ key: "metadata.userId", match: { value: userId } }] },
  });
  const documents = new Map();
  for (const point of response.points || []) {
    const metadata = point.payload?.metadata || {};
    if (
      !metadata.source ||
      documents.has(metadata.documentId || metadata.source)
    )
      continue;
    documents.set(metadata.documentId || metadata.source, {
      id: metadata.documentId || legacyId(metadata.source),
      documentId: metadata.documentId || "",
      name: metadata.documentName || metadata.source.split(/[\\/]/).pop(),
      source: metadata.source,
      uploadedAt: metadata.uploadedAt,
    });
  }
  return [...documents.values()].sort(
    (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt),
  );
}

export async function deleteDocument(userId, documentId, source) {
  await ensurePayloadIndexes();
  const selector = documentId
    ? { key: "metadata.documentId", match: { value: documentId } }
    : { key: "metadata.source", match: { value: source } };
  await client().delete(collectionName, {
    wait: true,
    filter: {
      must: [{ key: "metadata.userId", match: { value: userId } }, selector],
    },
  });
}
