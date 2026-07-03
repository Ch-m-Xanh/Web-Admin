import { Router } from "express";
import { z } from "zod";
import { UserPlant } from "../models/UserPlant";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

const reminderSchema = z.object({
  enabled: z.boolean().optional(),
  wateringIntervalDays: z.number().optional(),
  fertilizingIntervalDays: z.number().optional(),
  notifyTime: z.string().optional(),
});

const createSchema = z.object({
  plantId: z.string().optional(),
  customName: z.string().min(1, "Ten cay khong duoc de trong"),
  photoUrl: z.string().min(1, "Anh cay khong duoc de trong"),
  reminder: reminderSchema.optional(),
});

const updateSchema = createSchema.partial();

// GET /api/user-plants -> cay cua user hien tai
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userPlants = await UserPlant.find({ userId: req.user!.id })
      .populate("plantId")
      .sort({ addedAt: -1 });
    res.json({ userPlants });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const userPlant = await UserPlant.create({ ...body, userId: req.user!.id });
    res.status(201).json({ userPlant });
  })
);

async function findOwnedUserPlant(id: string, userId: string) {
  const userPlant = await UserPlant.findOne({ _id: id, userId });
  if (!userPlant) {
    throw AppError.notFound("Khong tim thay cay trong vuon cua ban", "USER_PLANT_NOT_FOUND");
  }
  return userPlant;
}

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    await findOwnedUserPlant(req.params.id, req.user!.id);
    const userPlant = await UserPlant.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    res.json({ userPlant });
  })
);

router.put(
  "/:id/reminder",
  asyncHandler(async (req, res) => {
    const reminder = reminderSchema.parse(req.body);
    await findOwnedUserPlant(req.params.id, req.user!.id);
    const userPlant = await UserPlant.findByIdAndUpdate(
      req.params.id,
      { $set: Object.fromEntries(Object.entries(reminder).map(([k, v]) => [`reminder.${k}`, v])) },
      { new: true, runValidators: true }
    );
    res.json({ userPlant });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await findOwnedUserPlant(req.params.id, req.user!.id);
    await UserPlant.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  })
);

export default router;
