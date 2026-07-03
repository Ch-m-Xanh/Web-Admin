import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

// Centralized error handler. Every error response across the whole API has the
// SAME shape so mobile/web clients can render a single "Global Popup" component:
//   { error: { message: string, code: string } }
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Known, intentional application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { message: err.message, code: err.code } });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(", ");
    return res.status(422).json({ error: { message, code: "VALIDATION_ERROR" } });
  }

  // Mongoose validation errors
  if (err && err.name === "ValidationError") {
    return res.status(422).json({ error: { message: err.message, code: "VALIDATION_ERROR" } });
  }

  // Mongoose duplicate key error
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      error: { message: `Gia tri cua truong '${field}' da ton tai`, code: "DUPLICATE_KEY" },
    });
  }

  // Mongoose bad ObjectId cast
  if (err && err.name === "CastError") {
    return res.status(400).json({ error: { message: "Id khong hop le", code: "INVALID_ID" } });
  }

  // JWT errors
  if (err && (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")) {
    return res.status(401).json({ error: { message: "Token khong hop le hoac da het han", code: "UNAUTHORIZED" } });
  }

  // Multer errors
  if (err && err.name === "MulterError") {
    return res.status(400).json({ error: { message: err.message, code: "UPLOAD_ERROR" } });
  }

  // Fallback: unknown/unexpected error
  // eslint-disable-next-line no-console
  console.error("[UNHANDLED ERROR]", err);
  return res.status(500).json({
    error: { message: "Loi he thong, vui long thu lai sau", code: "INTERNAL_ERROR" },
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: { message: `Khong tim thay route ${req.method} ${req.originalUrl}`, code: "ROUTE_NOT_FOUND" },
  });
}
