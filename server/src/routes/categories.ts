import { Router } from "express";
import { CATEGORIES } from "../utils/categories";

const router = Router();

// Tra ve mang phang [{ value, label }] de khop voi Web Admin / Web User client.
router.get("/", (_req, res) => {
  const categories = CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));
  res.json(categories);
});

export default router;
