import { Router } from "express";
import { Article } from "../models/Article";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (!article) {
      throw AppError.notFound("Khong tim thay bai viet nay", "ARTICLE_NOT_FOUND");
    }
    res.json(article);
  })
);

export default router;
