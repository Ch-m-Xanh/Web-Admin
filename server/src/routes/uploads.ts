import { Router } from "express";
import { upload } from "../middleware/upload";
import { AppError } from "../utils/AppError";

const router = Router();

router.post("/", upload.single("file"), (req, res, next) => {
  if (!req.file) {
    return next(AppError.validation("Khong co file nao duoc gui len", "NO_FILE"));
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;
