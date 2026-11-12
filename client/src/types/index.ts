export interface Restaurant {
  _id: string;
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

export interface Review {
  _id: string;
  restaurantId: string | { _id: string; name: string; neighborhood: string; cuisine?: string };
  anonymousLabel: string;
  visitDate: string;
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
  images?: string[];
  sentiment: {
    label: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    score: number;
    themes: string[];
  };
  moderationStatus: "APPROVED" | "PENDING" | "FLAGGED" | "REMOVED";
  businessStatus?: "UNREVIEWED" | "REVIEWED" | "RESOLVED";
  businessCategory?: string;
  publicResponse?: {
    responderLabel: string;
    message: string;
    createdAt: string;
  };
  internalNotes?: {
    authorName: string;
    note: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface UserSession {
  id: string;
  email: string;
  role: "CUSTOMER" | "OWNER" | "MANAGER" | "ADMIN";
  displayName: string;
  organizationId?: string;
}

