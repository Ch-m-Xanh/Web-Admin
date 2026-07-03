import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { requireAuth } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1, "Ten khong duoc de trong"),
  email: z.string().email("Email khong hop le"),
  password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
  gardenName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(1, "Mat khau khong duoc de trong"),
});

function signAccessToken(user: { _id: any; role: string }) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

function signRefreshToken(user: { _id: any; role: string }) {
  const secret = (process.env.JWT_REFRESH_SECRET as string) || (process.env.JWT_SECRET as string);
  return jwt.sign({ id: user._id.toString(), role: user.role }, secret, { expiresIn: "30d" });
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) {
      throw AppError.conflict("Email nay da duoc dang ky", "EMAIL_TAKEN");
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      gardenName: body.gardenName || "",
      role: "user",
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.status(201).json({ token: accessToken, accessToken, refreshToken, user });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user) {
      throw new AppError("Email hoac mat khau khong dung", 401, "INVALID_CREDENTIALS");
    }

    if (user.isLocked) {
      throw AppError.forbidden("Tai khoan cua ban da bi khoa", "ACCOUNT_LOCKED");
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      throw new AppError("Email hoac mat khau khong dung", 401, "INVALID_CREDENTIALS");
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({ token: accessToken, accessToken, refreshToken, user });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw AppError.notFound("Khong tim thay nguoi dung");
    }
    res.json(user);
  })
);

export default router;
