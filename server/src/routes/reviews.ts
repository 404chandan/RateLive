import { Router } from "express";
import { z } from "zod";
import { Review, Restaurant, AuditLog } from "../models/index.js";
import { generateAuthorHash, generateAnonymousLabel, sanitizeReviewText } from "../utils/privacy.js";
import { analyzeSentiment } from "../utils/sentiment.js";
import { io } from "../index.js";

const router = Router();

const submitReviewSchema = z.object({
  restaurantId: z.string().min(1),
  branchId: z.string().optional(),
  visitDate: z.string().or(z.date()).default(() => new Date()),
  dishOrdered: z.string().optional(),
  ratings: z.object({
    overall: z.number().min(1).max(5),
    foodQuality: z.number().min(1).max(5),
    service: z.number().min(1).max(5),
    staffBehaviour: z.number().min(1).max(5),
    ambience: z.number().min(1).max(5),
    cleanliness: z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
  }),
  comment: z.string().max(2000).optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
});

// POST /api/reviews - Anonymous Customer Feedback Submission
router.post("/", async (req, res) => {
  try {
    const parsed = submitReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.format() });
    }

    const data = parsed.data;
    const restaurant = await Restaurant.findById(data.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // PRIVACY ENFORCEMENT: Derive one-way privacy hash from caller identifier or IP
    const callerId = (req.headers["x-user-id"] as string) || req.ip || "guest-session";
    const authorHash = generateAuthorHash(callerId, restaurant._id.toString());

    // Sanitize comment to strip accidental phone numbers or email addresses
    const cleanedComment = sanitizeReviewText(data.comment || "");

    // Real-time sentiment analysis
    const sentiment = analyzeSentiment(cleanedComment, data.ratings.overall);

    // Friendly anonymous label (zero PII)
    const anonymousLabel = generateAnonymousLabel(restaurant.metrics.totalReviews + 1);

    // Save review (authorHash is select:false in Mongoose schema)
    const review = await Review.create({
      restaurantId: restaurant._id,
      branchId: data.branchId,
      authorHash,
      anonymousLabel,
      visitDate: new Date(data.visitDate),
      dishOrdered: data.dishOrdered,
      ratings: data.ratings,
      comment: cleanedComment,
      tags: data.tags,
      images: data.images,
      sentiment,
      moderationStatus: "APPROVED",
      businessStatus: "UNREVIEWED",
      isDemoData: false,
    });

    // Update restaurant metrics dynamically
    const allApprovedReviews = await Review.find({
      restaurantId: restaurant._id,
      moderationStatus: "APPROVED",
    }).lean();

    const count = allApprovedReviews.length;
    const avgOverall = allApprovedReviews.reduce((acc, r) => acc + r.ratings.overall, 0) / count;
    const avgFood = allApprovedReviews.reduce((acc, r) => acc + r.ratings.foodQuality, 0) / count;
    const avgService = allApprovedReviews.reduce((acc, r) => acc + r.ratings.service, 0) / count;
    const avgStaff = allApprovedReviews.reduce((acc, r) => acc + r.ratings.staffBehaviour, 0) / count;
    const avgAmbience = allApprovedReviews.reduce((acc, r) => acc + r.ratings.ambience, 0) / count;
    const avgClean = allApprovedReviews.reduce((acc, r) => acc + r.ratings.cleanliness, 0) / count;
    const avgValue = allApprovedReviews.reduce((acc, r) => acc + r.ratings.valueForMoney, 0) / count;

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    for (const r of allApprovedReviews) {
      if (r.sentiment.label === "POSITIVE") positiveCount++;
      else if (r.sentiment.label === "NEGATIVE") negativeCount++;
      else neutralCount++;
    }

    restaurant.metrics.totalReviews = count;
    restaurant.metrics.overallRating = Number(avgOverall.toFixed(1));
    restaurant.metrics.recentRating3h = Number(avgOverall.toFixed(1));
    restaurant.metrics.recentVisits3h = Math.min(count, restaurant.metrics.recentVisits3h + 1);
    restaurant.metrics.categoryAverages = {
      foodQuality: Number(avgFood.toFixed(1)),
      service: Number(avgService.toFixed(1)),
      staffBehaviour: Number(avgStaff.toFixed(1)),
      ambience: Number(avgAmbience.toFixed(1)),
      cleanliness: Number(avgClean.toFixed(1)),
      valueForMoney: Number(avgValue.toFixed(1)),
    };
    restaurant.metrics.sentimentBreakdown = {
      positive: Math.round((positiveCount / count) * 100),
      neutral: Math.round((neutralCount / count) * 100),
      negative: Math.round((negativeCount / count) * 100),
    };
    await restaurant.save();

    // Broadcast live event via Socket.IO for real-time dashboards
    if (io) {
      const publicReviewPayload = {
        _id: review._id,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        neighborhood: restaurant.neighborhood,
        anonymousLabel: review.anonymousLabel,
        dishOrdered: review.dishOrdered,
        ratings: review.ratings,
        comment: review.comment,
        tags: review.tags,
        sentiment: review.sentiment,
        createdAt: review.createdAt,
      };

      // Broadcast to public live feed
      io.emit("live-review", publicReviewPayload);
      // Broadcast to restaurant private room
      io.to(`restaurant:${restaurant._id}`).emit("business-review", publicReviewPayload);
    }

    // Audit log
    await AuditLog.create({
      actorRole: "ANONYMOUS_CUSTOMER",
      action: "SUBMIT_REVIEW",
      targetType: "Restaurant",
      targetId: restaurant._id.toString(),
      metadata: { rating: data.ratings.overall, sentiment: sentiment.label },
    });

    return res.status(201).json({
      success: true,
      message: "Your identity stays private. Your feedback helps restaurants improve.",
      data: {
        reviewId: review._id,
        anonymousLabel: review.anonymousLabel,
        sentiment: review.sentiment,
        restaurantRating: restaurant.metrics.overallRating,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

