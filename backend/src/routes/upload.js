import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { ingestPDF } from "../services/ingest.js";
import { randomUUID } from "node:crypto";

const router = Router();
router.post("/", requireAuth, upload.array("files", 10), async (req, res) => {
  if (!req.files?.length)
    return res
      .status(400)
      .json({ error: "At least one PDF file is required." });
  try {
    const documents = [];
    for (const file of req.files) {
      const documentId = randomUUID();
      const result = await ingestPDF(file.path, req.auth.userId, {
        documentId,
        name: file.originalname,
      });
      documents.push({
        id: documentId,
        documentId,
        name: file.originalname,
        source: file.path,
        uploadedAt: result.uploadedAt,
      });
    }
    res.json({
      documents,
      message: "Paper indexed successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Unable to process the PDF." });
  }
});
export default router;
