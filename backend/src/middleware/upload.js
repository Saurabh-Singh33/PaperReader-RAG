import multer from 'multer'
import path from 'node:path'
import { v4 as uuid } from 'uuid'

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, path.resolve('uploads')),
  filename: (_req, file, callback) => callback(null, `${uuid()}${path.extname(file.originalname).toLowerCase()}`),
})

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') callback(null, true)
    else callback(new Error('Only PDF files are accepted.'))
  },
})
