import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export interface AuthPayload {
  id: string;
  role: "user" | "admin";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return null;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return next(AppError.unauthorized("Thieu token xac thuc"));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    next(err);
  }
}

// Optional auth: attaches req.user if a valid token is present, but never blocks the request.
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    req.user = { id: payload.id, role: payload.role };
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(AppError.unauthorized());
  }
  if (req.user.role !== "admin") {
    return next(AppError.forbidden("Chi admin moi co quyen thuc hien hanh dong nay"));
  }
  next();
}
