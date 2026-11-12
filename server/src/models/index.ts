import mongoose, { Schema, type Document } from "mongoose";

export type UserRole = "CUSTOMER" | "OWNER" | "MANAGER" | "ADMIN";
export type SentimentLabel = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type ModerationStatus = "APPROVED" | "PENDING" | "FLAGGED" | "REMOVED";
export type BusinessReviewStatus = "UNREVIEWED" | "REVIEWED" | "RESOLVED";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  refreshTokens: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["CUSTOMER", "OWNER", "MANAGER", "ADMIN"], default: "CUSTOMER" },
    isVerified: { type: Boolean, default: true },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  displayName: string;
  phone?: string;
  city: string;
  savedRestaurants: mongoose.Types.ObjectId[];
  preferences: {
    theme: "dark" | "light";
    liveAlerts: boolean;
    cuisines: string[];
  };
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    displayName: { type: String, required: true, trim: true },
    phone: { type: String },
    city: { type: String, default: "Bengaluru" },
    savedRestaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
    preferences: {
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
      liveAlerts: { type: Boolean, default: true },
      cuisines: [{ type: String }],
    },
  },
  { timestamps: true }
);

export interface IRestaurantOrganization extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  plan: "FREE_TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
}

const RestaurantOrganizationSchema = new Schema<IRestaurantOrganization>(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["FREE_TRIAL", "STARTER", "GROWTH", "ENTERPRISE"], default: "GROWTH" },
    status: { type: String, enum: ["ACTIVE", "PENDING", "SUSPENDED"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export interface IRestaurant extends Document {
  orgId: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  cuisine: string;
  priceTier: "$" | "$$" | "$$$";
  city: string;
  neighborhood: string;
  address: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  coverImage: string;
  description: string;
  topDishes: { name: string; rating: number; mentions: number }[];
  isVerified: boolean;
  isDemoData: boolean;
  metrics: {
    overallRating: number;
    totalReviews: number;
    recentRating3h: number;
    recentVisits3h: number;
    rating7d: number;
    trendDelta: number;
    statusTone: "active" | "trending" | "mixed";
    categoryAverages: {
      foodQuality: number;
      service: number;
      staffBehaviour: number;
      ambience: number;
      cleanliness: number;
      valueForMoney: number;
    };
    sentimentBreakdown: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: "RestaurantOrganization", required: true, index: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, index: true },
    priceTier: { type: String, enum: ["$", "$$", "$$$"], default: "$$" },
    city: { type: String, default: "Bengaluru", index: true },
    neighborhood: { type: String, required: true, index: true },
    address: { type: String, required: true },
    coordinates: {
      x: { type: Number, default: 50 },
      y: { type: Number, default: 50 },
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
    },
    coverImage: { type: String, required: true },
    description: { type: String, default: "" },
    topDishes: [
      {
        name: { type: String, required: true },
        rating: { type: Number, default: 4.5 },
        mentions: { type: Number, default: 1 },
      },
    ],
    isVerified: { type: Boolean, default: true },
    isDemoData: { type: Boolean, default: false },
    metrics: {
      overallRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      recentRating3h: { type: Number, default: 0 },
      recentVisits3h: { type: Number, default: 0 },
      rating7d: { type: Number, default: 0 },
      trendDelta: { type: Number, default: 0 },
      statusTone: { type: String, enum: ["active", "trending", "mixed"], default: "active" },
      categoryAverages: {
        foodQuality: { type: Number, default: 0 },
        service: { type: Number, default: 0 },
        staffBehaviour: { type: Number, default: 0 },
        ambience: { type: Number, default: 0 },
        cleanliness: { type: Number, default: 0 },
        valueForMoney: { type: Number, default: 0 },
      },
      sentimentBreakdown: {
        positive: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 },
        negative: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

export interface IRestaurantBranch extends Document {
  restaurantId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  branchName: string;
  neighborhood: string;
  address: string;
  city: string;
  isPrimary: boolean;
  overallRating: number;
  reviewCount: number;
  positiveSentimentPct: number;
}

const RestaurantBranchSchema = new Schema<IRestaurantBranch>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: "RestaurantOrganization", required: true, index: true },
    branchName: { type: String, required: true },
    neighborhood: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "Bengaluru" },
    isPrimary: { type: Boolean, default: false },
    overallRating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    positiveSentimentPct: { type: Number, default: 80 },
  },
  { timestamps: true }
);

export interface IReview extends Document {
  restaurantId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  authorHash: string; // One-way HMAC for duplicate/abuse check ONLY — never exposed to businesses or public
  anonymousLabel: string;
  visitDate: Date;
  dishOrdered?: string;
  ratings: {
    overall: number;
    foodQuality: number;
    service: number;
    staffBehaviour: number;
    ambience: number;
    cleanliness: number;
    valueForMoney: number;
  };
  comment: string;
  tags: string[];
  images: string[];
  sentiment: {
    label: SentimentLabel;
    score: number;
    themes: string[];
  };
  moderationStatus: ModerationStatus;
  businessStatus: BusinessReviewStatus;
  businessCategory?: string;
  isDemoData: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "RestaurantBranch" },
    authorHash: { type: String, required: true, select: false, index: true },
    anonymousLabel: { type: String, required: true },
    visitDate: { type: Date, required: true },
    dishOrdered: { type: String, trim: true },
    ratings: {
      overall: { type: Number, min: 1, max: 5, required: true },
      foodQuality: { type: Number, min: 1, max: 5, required: true },
      service: { type: Number, min: 1, max: 5, required: true },
      staffBehaviour: { type: Number, min: 1, max: 5, required: true },
      ambience: { type: Number, min: 1, max: 5, required: true },
      cleanliness: { type: Number, min: 1, max: 5, required: true },
      valueForMoney: { type: Number, min: 1, max: 5, required: true },
    },
    comment: { type: String, default: "", maxlength: 2000 },
    tags: [{ type: String }],
    images: [{ type: String }],
    sentiment: {
      label: { type: String, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"], default: "POSITIVE" },
      score: { type: Number, default: 0.7 },
      themes: [{ type: String }],
    },
    moderationStatus: {
      type: String,
      enum: ["APPROVED", "PENDING", "FLAGGED", "REMOVED"],
      default: "APPROVED",
      index: true,
    },
    businessStatus: {
      type: String,
      enum: ["UNREVIEWED", "REVIEWED", "RESOLVED"],
      default: "UNREVIEWED",
    },
    businessCategory: { type: String },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ restaurantId: 1, createdAt: -1 });
ReviewSchema.index({ restaurantId: 1, authorHash: 1, visitDate: 1 });

export interface IReviewResponse extends Document {
  reviewId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  responderLabel: string;
  message: string;
  createdAt: Date;
}

const ReviewResponseSchema = new Schema<IReviewResponse>(
  {
    reviewId: { type: Schema.Types.ObjectId, ref: "Review", required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    orgId: { type: Schema.Types.ObjectId, ref: "RestaurantOrganization", required: true },
    responderLabel: { type: String, default: "Management Team" },
    message: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

export interface IInternalNote extends Document {
  reviewId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  authorName: string;
  note: string;
  createdAt: Date;
}

const InternalNoteSchema = new Schema<IInternalNote>(
  {
    reviewId: { type: Schema.Types.ObjectId, ref: "Review", required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: "RestaurantOrganization", required: true },
    authorName: { type: String, required: true },
    note: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

export interface IAuditLog extends Document {
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
export const UserProfile = mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
export const RestaurantOrganization = mongoose.model<IRestaurantOrganization>(
  "RestaurantOrganization",
  RestaurantOrganizationSchema
);
export const Restaurant = mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
export const RestaurantBranch = mongoose.model<IRestaurantBranch>("RestaurantBranch", RestaurantBranchSchema);
export const Review = mongoose.model<IReview>("Review", ReviewSchema);
export const ReviewResponse = mongoose.model<IReviewResponse>("ReviewResponse", ReviewResponseSchema);
export const InternalNote = mongoose.model<IInternalNote>("InternalNote", InternalNoteSchema);
export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

