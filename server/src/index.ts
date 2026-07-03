import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { createApp } from "./app";
import { connectDB } from "./db";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDB();
  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[Cham Xanh API] Dang chay tai http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[FATAL] Khong the khoi dong server:", err);
  process.exit(1);
});
