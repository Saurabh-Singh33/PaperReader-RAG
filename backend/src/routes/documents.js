import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { deleteDocument, listDocuments } from "../services/documentStore.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    res.json({ documents: await listDocuments(req.auth.userId) });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Unable to load documents." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await deleteDocument(
      req.auth.userId,
      req.query.documentId,
      req.query.source,
    );
    res.json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Unable to delete document." });
  }
});

export default router;
