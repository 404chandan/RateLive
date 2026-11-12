import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User, UserProfile, RestaurantOrganization } from "../models/index.js";
import { generateToken, generateRefreshToken, requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
  role: z.enum(["CUSTOMER", "OWNER"]).default("CUSTOMER"),
  businessName: z.string().optional(),
});

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.format() });
    }

    const { email, password, displayName, role, businessName } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      role,
      isVerified: true,
    });

    await UserProfile.create({
      userId: user._id,
      displayName,
      preferences: { theme: "dark", liveAlerts: true, cuisines: [] },
    });

    let organization = null;
    if (role === "OWNER") {
      organization = await RestaurantOrganization.create({
        name: businessName || `${displayName}'s Group`,
        ownerId: user._id,
        plan: "GROWTH",
        status: "ACTIVE",
      });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user._id.toString() });
    user.refreshTokens.push(refreshToken);
    await user.save();

    return res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        displayName,
        organizationId: organization?._id,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const profile = await UserProfile.findOne({ userId: user._id });
    const organization = await RestaurantOrganization.findOne({ ownerId: user._id });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user._id.toString() });
    user.refreshTokens.push(refreshToken);
    await user.save();

    return res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        displayName: profile?.displayName || "User",
        organizationId: organization?._id,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const profile = await UserProfile.findOne({ userId: user._id });
    const organization = await RestaurantOrganization.findOne({ ownerId: user._id });

    return res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        displayName: profile?.displayName || "User",
        preferences: profile?.preferences,
        savedRestaurants: profile?.savedRestaurants || [],
        organizationId: organization?._id,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
