import { Router } from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getVectorStore } from "../services/qdrant.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const prompt =
  ChatPromptTemplate.fromTemplate(`You answer questions about a research paper. Use ONLY the context below. If the answer is not in the context, say you could not find it in the uploaded paper. Be concise but useful.

Context:\n{context}\n\nQuestion: {question}`);

router.post("/", requireAuth, async (req, res) => {
  const question =
    typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question)
    return res.status(400).json({ error: "A question is required." });
  try {
    const store = await getVectorStore();
    const documents = await store.similaritySearch(question, 3, {
      userId: req.auth.userId,
    });
    if (!documents.length)
      return res.json({
        answer: "No relevant information was found in your uploaded papers.",
        sources: [],
      });
    const context = documents
      .map((document) => document.pageContent)
      .join("\n\n---\n\n");
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0.2,
    });
    const answer = await prompt
      .pipe(model)
      .pipe(new StringOutputParser())
      .invoke({ context, question });
    res.json({
      answer,
      sources: documents.map((document) => document.pageContent.slice(0, 200)),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Unable to answer the question." });
  }
});
export default router;
