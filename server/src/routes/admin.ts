import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { Plant } from "../models/Plant";
import { Post } from "../models/Post";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [totalUsers, totalPlants, totalPostsThisWeek, topViewedPlants, recentUsers] = await Promise.all([
      User.countDocuments(),
      Plant.countDocuments(),
      Post.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Plant.find().sort({ viewCount: -1 }).limit(5),
      User.find({ createdAt: { $gte: sevenDaysAgo } }, { createdAt: 1 }),
    ]);

    // Bucket new users per day for the last 7 days (index 0 = 6 days ago ... index 6 = today)
    const newUsersLast7Days = new Array(7).fill(0);
    for (const u of recentUsers) {
      const diffDays = Math.floor((now.getTime() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const index = 6 - diffDays;
      if (index >= 0 && index < 7) newUsersLast7Days[index] += 1;
    }

    res.json({
      totalUsers,
      totalPlants,
      totalPostsThisWeek,
      topViewedPlants,
      newUsersLast7Days,
    });
  })
);

router.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  })
);

const updateUserSchema = z.object({
  isLocked: z.boolean().optional(),
  role: z.enum(["user", "admin"]).optional(),
  name: z.string().optional(),
  gardenName: z.string().optional(),
});

router.put(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const body = updateUserSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!user) {
      throw AppError.notFound("Khong tim thay nguoi dung", "USER_NOT_FOUND");
    }
    res.json(user);
  })
);

router.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw AppError.notFound("Khong tim thay nguoi dung", "USER_NOT_FOUND");
    }
    res.json({ success: true });
  })
);

export default router;
