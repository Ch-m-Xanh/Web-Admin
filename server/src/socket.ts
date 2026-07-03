import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import type { AuthPayload } from "./middleware/auth";

// Module-level singleton, giu tren module nay de tranh circular import:
// cac route khac chi import { getIO } va goi getIO().emit(...) / emitToUser(...).
let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("Origin khong duoc phep boi CORS"));
      },
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    // Client gui JWT qua socket.handshake.auth.token de duoc join room rieng.
    // Neu token thieu/khong hop le, van cho connect nhung khong join room nao
    // (khong throw loi lam crash) - client van nhan duoc cac su kien public.
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (token) {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
        if (payload?.id) {
          socket.join(`user:${payload.id}`);
        }
      }
    } catch {
      // ignore invalid/missing token - client stays connected without a user room
    }
  });

  return io;
}

export function getIO(): Server | null {
  return io;
}

// Phat su kien public cho tat ca client dang ket noi (khong can auth).
export function emitPublic(event: string, payload: unknown) {
  io?.emit(event, payload);
}

// Phat su kien rieng cho 1 user (moi thiet bi da join room 'user:<userId>').
export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(`user:${userId}`).emit(event, payload);
}
