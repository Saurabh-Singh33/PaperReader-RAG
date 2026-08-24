import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const defaultModel = "google/gemini-2.0-flash-001";

router.post("/", requireAuth, async (req, res) => {
  const question =
    typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const history = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const webSearch = req.body?.webSearch === true;
  const model =
    typeof req.body?.model === "string" && req.body.model
      ? req.body.model
      : defaultModel;
  if (!question)
    return res.status(400).json({ error: "A question is required." });
  if (!process.env.OPENROUTER_API_KEY)
    return res
      .status(503)
      .json({ error: "OpenRouter is not configured on the server." });
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
    if (!response.ok)
      return res
        .status(response.status)
        .json({ error: data.error?.message || "OpenRouter request failed." });
    res.json({
      answer:
        data.choices?.[0]?.message?.content ||
        "The AI returned an empty response.",
    });
  } catch (error) {
    res
      .status(502)
      .json({ error: error.message || "Unable to reach OpenRouter." });
  }
});

export default router;
