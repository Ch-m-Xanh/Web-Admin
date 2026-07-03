import { NextFunction, Request, Response } from "express";

// Wrap async route handlers so rejected promises reach the error middleware
// instead of crashing the process / hanging the request.
type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
