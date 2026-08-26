import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import uploadRoute from "./routes/upload.js";
import queryRoute from "./routes/query.js";
import documentsRoute from "./routes/documents.js";
import aiRoute from "./routes/ai.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
fs.mkdirSync(path.resolve("uploads"), { recursive: true });
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin))
        return callback(null, true);
      callback(new Error("Origin is not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "paperreader-api" }),
);
app.use(clerkMiddleware());
app.use("/api/upload", uploadRoute);
app.use("/api/query", queryRoute);
app.use("/api/documents", documentsRoute);
app.use("/api/ai", aiRoute);
app.use((error, _req, res, _next) => {
  if (error.code === "LIMIT_FILE_SIZE")
    return res.status(413).json({ error: "PDFs must be 10 MB or smaller." });
  res.status(400).json({ error: error.message || "Request failed." });
});
app.listen(port, () =>
  console.log(`PaperReader backend running on http://localhost:${port}`),
);
