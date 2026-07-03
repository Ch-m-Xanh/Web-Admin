import { Router } from "express";
import { z } from "zod";
import { Post } from "../models/Post";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { requireAuth } from "../middleware/auth";

const router = Router();

const createSchema = z.object({
  userPlantId: z.string().optional(),
  imageUrl: z.string().min(1, "Anh khong duoc de trong"),
  caption: z.string().optional(),
});

// GET /api/posts?userId=  -> danh sach post cua 1 user (dung cho tab Grid/Calendar Ho so vuon)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      throw AppError.validation("Thieu tham so userId", "MISSING_USER_ID");
    }
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.json({ posts });
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const post = await Post.create({ ...body, userId: req.user!.id });
    res.status(201).json({ post });
  })
);

export default router;
