import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { ingestPDF } from '../services/ingest.js'

const router = Router()
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'A PDF file is required.' })
  try {
    const result = await ingestPDF(req.file.path, req.auth.userId)
    res.json({ ...result, message: 'Paper indexed successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to process the PDF.' })
  }
})
export default router
