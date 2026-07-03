import { Router } from "express";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post(
  "/:id/follow",
  requireAuth,
  asyncHandler(async (req, res) => {
    const targetId = req.params.id;
    const currentId = req.user!.id;

    if (targetId === currentId) {
      throw AppError.validation("Ban khong the tu theo doi chinh minh", "CANNOT_FOLLOW_SELF");
    }

    const target = await User.findById(targetId);
    if (!target) {
      throw AppError.notFound("Khong tim thay nguoi dung nay", "USER_NOT_FOUND");
    }

    await User.findByIdAndUpdate(currentId, { $addToSet: { followingIds: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followerIds: currentId } });

    res.json({ success: true });
  })
);

router.delete(
  "/:id/follow",
  requireAuth,
  asyncHandler(async (req, res) => {
    const targetId = req.params.id;
    const currentId = req.user!.id;

    const target = await User.findById(targetId);
    if (!target) {
      throw AppError.notFound("Khong tim thay nguoi dung nay", "USER_NOT_FOUND");
    }

    await User.findByIdAndUpdate(currentId, { $pull: { followingIds: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { followerIds: currentId } });

    res.json({ success: true });
  })
);

export default router;
