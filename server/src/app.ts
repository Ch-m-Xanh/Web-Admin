import path from "path";
import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import plantRoutes from "./routes/plants";
import categoryRoutes from "./routes/categories";
import articleRoutes from "./routes/articles";
import userPlantRoutes from "./routes/userPlants";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/users";
import chatRoutes from "./routes/chat";
import uploadRoutes from "./routes/uploads";
import adminRoutes from "./routes/admin";

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      // No Origin header (mobile apps, curl, server-to-server) -> always allow.
      // Browser requests -> only allow origins listed in ALLOWED_ORIGINS.
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("Origin khong duoc phep boi CORS"));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Static file serving for uploaded images -> /uploads/<filename>
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "cham-xanh-server" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/plants", plantRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/user-plants", userPlantRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
