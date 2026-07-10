import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { requireAuth } from "../middleware/auth";

const router = Router();

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().optional(),
  gardenName: z.string().optional(),
  gardenDescription: z.string().optional(),
});

// Self-service profile update — lets a logged-in user edit their own
// name/avatar/garden name/garden description (matches Mobile's
// EditProfileScreen/EditGardenScreen). Kept separate from the admin-only
// user management in routes/admin.ts, which can edit any user.
router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = updateMeSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.user!.id, body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw AppError.notFound("Khong tim thay nguoi dung");
    }
    res.json(user);
  })
);

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
