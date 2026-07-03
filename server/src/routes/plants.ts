import { Router } from "express";
import { z } from "zod";
import { Plant } from "../models/Plant";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { emitPublic } from "../socket";

const router = Router();

const plantSchema = z.object({
  name: z.string().min(1, "Ten cay khong duoc de trong"),
  scientificName: z.string().optional(),
  description: z.string().optional(),
  careLevel: z.enum(["easy", "medium", "hard"]).optional(),
  light: z.string().optional(),
  water: z.string().optional(),
  category: z.string().min(1, "Danh muc khong duoc de trong"),
  images: z.array(z.string()).optional(),
  isMedicinal: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

const plantUpdateSchema = plantSchema.partial();

// GET /api/plants?category=&search=&isMedicinal=
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, search, isMedicinal } = req.query;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (isMedicinal !== undefined) filter.isMedicinal = isMedicinal === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: "i" } },
        { scientificName: { $regex: String(search), $options: "i" } },
        { tags: { $regex: String(search), $options: "i" } },
      ];
    }

    const plants = await Plant.find(filter).sort({ createdAt: -1 });
    res.json(plants);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!plant) {
      throw AppError.notFound("Khong tim thay cay nay", "PLANT_NOT_FOUND");
    }
    res.json(plant);
  })
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const body = plantSchema.parse(req.body);
    const plant = await Plant.create(body);
    emitPublic("plant:created", plant);
    res.status(201).json(plant);
  })
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const body = plantUpdateSchema.parse(req.body);
    const plant = await Plant.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!plant) {
      throw AppError.notFound("Khong tim thay cay nay", "PLANT_NOT_FOUND");
    }
    emitPublic("plant:updated", plant);
    res.json(plant);
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      throw AppError.notFound("Khong tim thay cay nay", "PLANT_NOT_FOUND");
    }
    emitPublic("plant:deleted", { _id: plant._id.toString() });
    res.json({ success: true });
  })
);

export default router;
