import { Router } from "express";
import { requireAuth, requireRoles, type AuthRequest } from "../middleware/auth.js";
import { User, Restaurant, Review, AuditLog } from "../models/index.js";

const router = Router();

// GET /api/admin/overview
router.get("/overview", requireAuth, requireRoles("ADMIN"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalReviews = await Review.countDocuments();
    const flaggedReviews = await Review.countDocuments({ moderationStatus: "FLAGGED" });

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalRestaurants,
        totalReviews,
        flaggedReviews,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/moderation - Review Moderation Queue
router.get("/moderation", requireAuth, requireRoles("ADMIN"), async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("restaurantId", "name neighborhood")
      .lean();

    return res.json({ success: true, data: reviews });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/moderation/:reviewId
router.patch("/moderation/:reviewId", requireAuth, requireRoles("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    review.moderationStatus = status;
    await review.save();

    await AuditLog.create({
      actorRole: "ADMIN",
      action: `SET_MODERATION_${status}`,
      targetType: "Review",
      targetId: review._id.toString(),
      metadata: { adminId: req.user?.userId },
    });

    return res.json({ success: true, message: `Review set to ${status}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

