import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const normalizeOrigin = (value) => value.replace(/\/+$/, "");
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((item) => item.trim())
  .map((item) => normalizeOrigin(item))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin ? normalizeOrigin(origin) : "";
      let isVercelPreview = false;
      if (normalizedOrigin) {
        try {
          isVercelPreview = /\.vercel\.app$/.test(new URL(normalizedOrigin).hostname);
        } catch {
          isVercelPreview = false;
        }
      }
      if (
        !normalizedOrigin ||
        allowedOrigins.includes(normalizedOrigin) ||
        isVercelPreview
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked"));
    }
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

export default app;
