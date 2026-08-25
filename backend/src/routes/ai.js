import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const defaultModel =
  process.env.OPENROUTER_API_KEY || "google/gemini-3.1-flash-lite";

router.post("/", requireAuth, async (req, res) => {
  const question =
    typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const history = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const webSearch = req.body?.webSearch === true;
  if (!question)
    return res.status(400).json({ error: "A question is required." });
  if (!process.env.OPENROUTER_API_KEY)
    return res
      .status(503)
      .json({
        error: "The AI service is not configured. Please check your settings.",
      });
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "PaperReader",
        },
        body: JSON.stringify({
          model,
          messages: [
            ...history.filter((message) => message?.role && message?.content),
            { role: "user", content: question },
          ],
          ...(webSearch ? { plugins: [{ id: "web", max_results: 5 }] } : {}),
        }),
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = data.error?.message || "";
      const error =
        response.status === 429
          ? "Too many requests. Please wait a moment and try again."
          : /endpoint|model/i.test(providerMessage)
            ? "The AI service is currently unavailable. Please try again later."
            : "I'm having trouble connecting. Please try again.";
      return res.status(response.status).json({ error });
    }
    res.json({
      answer:
        data.choices?.[0]?.message?.content ||
        "The AI returned an empty response.",
    });
  } catch (error) {
    res.status(502).json({
      error:
        "I'm having trouble connecting. Please check your internet and try again.",
    });
  }
});

export default router;
