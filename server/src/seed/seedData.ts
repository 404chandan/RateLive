import bcrypt from "bcryptjs";
import {
  User,
  UserProfile,
  RestaurantOrganization,
  Restaurant,
  RestaurantBranch,
  Review,
} from "../models/index.js";
import { generateAuthorHash } from "../utils/privacy.js";

export async function seedInitialData() {
  const existingCount = await Restaurant.countDocuments();
  if (existingCount > 0) return;

  console.log("🌱 Seeding RateLive initial data...");

  // 1. Create Default Users (Owner & Customer & Admin)
  const ownerPasswordHash = await bcrypt.hash("owner123", 10);
  const ownerUser = await User.create({
    email: "owner@ratelive.io",
    passwordHash: ownerPasswordHash,
    role: "OWNER",
    isVerified: true,
  });

  await UserProfile.create({
    userId: ownerUser._id,
    displayName: "Ananya Sharma",
    phone: "+91 98765 43210",
    city: "Bengaluru",
    preferences: { theme: "dark", liveAlerts: true, cuisines: ["Burgers", "South Indian"] },
  });

  const customerPasswordHash = await bcrypt.hash("customer123", 10);
  const customerUser = await User.create({
    email: "customer@ratelive.io",
    passwordHash: customerPasswordHash,
    role: "CUSTOMER",
    isVerified: true,
  });

  await UserProfile.create({
    userId: customerUser._id,
    displayName: "Aarav Rao",
    city: "Bengaluru",
    preferences: { theme: "dark", liveAlerts: true, cuisines: ["Burgers", "Coffee"] },
  });

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  await User.create({
    email: "admin@ratelive.io",
    passwordHash: adminPasswordHash,
    role: "ADMIN",
    isVerified: true,
  });

  // 2. Create Restaurant Organization
  const org = await RestaurantOrganization.create({
    name: "Apex Dining Group",
    ownerId: ownerUser._id,
    plan: "GROWTH",
    status: "ACTIVE",
  });

  // 3. Create Restaurants
  const restaurantsData = [
    {
      orgId: org._id,
      slug: "truffles",
      name: "Truffles",
      cuisine: "Burgers",
      priceTier: "$$",
      city: "Bengaluru",
      neighborhood: "Indiranagar",
      address: "100 Feet Road, Indiranagar",
      coordinates: { x: 27, y: 34, lat: 12.9719, lng: 77.6412 },
      coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      description: "Iconic Bengaluru comfort eatery famed for heavyweight burgers, seasoned peri-peri fries, and indulgent desserts.",
      topDishes: [
        { name: "All American Cheese Burger", rating: 4.9, mentions: 48 },
        { name: "Peri Peri Fries", rating: 4.7, mentions: 36 },
        { name: "Classic Chicken Burger", rating: 4.6, mentions: 29 },
      ],
      isVerified: true,
      isDemoData: false,
      metrics: {
        overallRating: 4.7,
        totalReviews: 42,
        recentRating3h: 4.7,
        recentVisits3h: 18,
        rating7d: 4.5,
        trendDelta: 0.2,
        statusTone: "active",
        categoryAverages: {
          foodQuality: 4.8,
          service: 4.4,
          staffBehaviour: 4.6,
          ambience: 4.7,
          cleanliness: 4.7,
          valueForMoney: 4.8,
        },
        sentimentBreakdown: { positive: 88, neutral: 8, negative: 4 },
      },
    },
    {
      orgId: org._id,
      slug: "mtr",
      name: "MTR 1924",
      cuisine: "South Indian",
      priceTier: "$",
      city: "Bengaluru",
      neighborhood: "Koramangala",
      address: "5th Block, near Sony World, Koramangala",
      coordinates: { x: 55, y: 57, lat: 12.9352, lng: 77.6245 },
      coverImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      description: "A century of South Indian culinary heritage. World-famous Rava Idlis, golden Ghee Roast Dosas, and artisanal filter coffee.",
      topDishes: [
        { name: "Ghee Roast Dosa", rating: 4.9, mentions: 89 },
        { name: "Rava Idli", rating: 4.8, mentions: 64 },
        { name: "Pure Filter Coffee", rating: 4.9, mentions: 52 },
      ],
      isVerified: true,
      isDemoData: false,
      metrics: {
        overallRating: 4.9,
        totalReviews: 89,
        recentRating3h: 4.9,
        recentVisits3h: 31,
        rating7d: 4.8,
        trendDelta: 0.1,
        statusTone: "trending",
        categoryAverages: {
          foodQuality: 5.0,
          service: 4.7,
          staffBehaviour: 4.8,
          ambience: 4.6,
          cleanliness: 4.9,
          valueForMoney: 4.9,
        },
        sentimentBreakdown: { positive: 94, neutral: 4, negative: 2 },
      },
    },
    {
      orgId: org._id,
      slug: "third-wave",
      name: "Third Wave Coffee",
      cuisine: "Coffee",
      priceTier: "$$",
      city: "Bengaluru",
      neighborhood: "HSR Layout",
      address: "Sector 3, 27th Main, HSR Layout",
      coordinates: { x: 69, y: 25, lat: 12.9121, lng: 77.6446 },
      coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80",
      description: "Artisanal specialty coffee roastery and collaborative workspace with custom single-origin manual pour-overs and fresh bakes.",
      topDishes: [
        { name: "V60 Pour Over · Guji", rating: 4.8, mentions: 34 },
        { name: "Classic Cold Brew", rating: 4.5, mentions: 24 },
        { name: "Toasted Banana Bread", rating: 4.4, mentions: 18 },
      ],
      isVerified: true,
      isDemoData: false,
      metrics: {
        overallRating: 4.4,
        totalReviews: 34,
        recentRating3h: 4.4,
        recentVisits3h: 12,
        rating7d: 4.5,
        trendDelta: -0.1,
        statusTone: "trending",
        categoryAverages: {
          foodQuality: 4.6,
          service: 4.3,
          staffBehaviour: 4.5,
          ambience: 4.8,
          cleanliness: 4.6,
          valueForMoney: 4.2,
        },
        sentimentBreakdown: { positive: 84, neutral: 10, negative: 6 },
      },
    },
    {
      orgId: org._id,
      slug: "nagarjuna",
      name: "Nagarjuna",
      cuisine: "Andhra",
      priceTier: "$$",
      city: "Bengaluru",
      neighborhood: "Indiranagar",
      address: "Double Road, Indiranagar",
      coordinates: { x: 78, y: 67, lat: 12.9734, lng: 77.6389 },
      coverImage: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80",
      description: "Legendary fiery Andhra meals served on banana leaves with spicy Gunpowder, hot ghee, and signature Sholay Kebab.",
      topDishes: [
        { name: "Andhra Meals on Banana Leaf", rating: 4.8, mentions: 67 },
        { name: "Sholay Kebab", rating: 4.7, mentions: 49 },
        { name: "Gongura Chicken", rating: 4.6, mentions: 33 },
      ],
      isVerified: true,
      isDemoData: false,
      metrics: {
        overallRating: 4.6,
        totalReviews: 67,
        recentRating3h: 4.6,
        recentVisits3h: 22,
        rating7d: 4.4,
        trendDelta: 0.3,
        statusTone: "active",
        categoryAverages: {
          foodQuality: 4.9,
          service: 4.4,
          staffBehaviour: 4.5,
          ambience: 4.3,
          cleanliness: 4.6,
          valueForMoney: 4.7,
        },
        sentimentBreakdown: { positive: 89, neutral: 7, negative: 4 },
      },
    },
  ];

  const createdRestaurants = await Restaurant.create(restaurantsData);

  // 4. Create Branches for Truffles (Multi-branch demonstration)
  const truffles = createdRestaurants.find((r) => r.slug === "truffles")!;
  await RestaurantBranch.create([
    {
      restaurantId: truffles._id,
      orgId: org._id,
      branchName: "Indiranagar Flagship",
      neighborhood: "Indiranagar",
      address: "100 Feet Road, Indiranagar",
      isPrimary: true,
      overallRating: 4.7,
      reviewCount: 28,
      positiveSentimentPct: 90,
    },
    {
      restaurantId: truffles._id,
      orgId: org._id,
      branchName: "Koramangala 5th Block",
      neighborhood: "Koramangala",
      address: "80 Feet Road, 5th Block",
      isPrimary: false,
      overallRating: 4.6,
      reviewCount: 14,
      positiveSentimentPct: 86,
    },
  ]);

  // 5. Seed Anonymous Reviews (strictly without any customer PII)
  const sampleReviews = [
    {
      restaurantId: truffles._id,
      dishOrdered: "All American Cheese Burger",
      ratings: { overall: 5, foodQuality: 5, service: 5, staffBehaviour: 5, ambience: 5, cleanliness: 5, valueForMoney: 5 },
      comment: "Burger patties were exceptionally juicy and the peri peri fries were hot and crispy. Quick seating too!",
      tags: ["Excellent food", "Great service", "Worth visiting"],
      sentiment: { label: "POSITIVE", score: 0.94, themes: ["Food Quality", "Service Speed"] },
    },
    {
      restaurantId: truffles._id,
      dishOrdered: "Peri Peri Fries",
      ratings: { overall: 4, foodQuality: 5, service: 3, staffBehaviour: 4, ambience: 4, cleanliness: 4, valueForMoney: 4 },
      comment: "Food was fantastic as always, but there was a 20 minute waiting line at 8 PM.",
      tags: ["Long waiting time", "Excellent food"],
      sentiment: { label: "NEUTRAL", score: 0.62, themes: ["Food Quality", "Service Speed"] },
    },
    {
      restaurantId: createdRestaurants.find((r) => r.slug === "mtr")!._id,
      dishOrdered: "Ghee Roast Dosa",
      ratings: { overall: 5, foodQuality: 5, service: 5, staffBehaviour: 5, ambience: 4, cleanliness: 5, valueForMoney: 5 },
      comment: "Crispy edges, fragrant pure desi ghee, and authentic piping hot sambar. The benchmark for South Indian food.",
      tags: ["Excellent food", "Friendly staff", "Worth visiting"],
      sentiment: { label: "POSITIVE", score: 0.98, themes: ["Food Quality", "Staff & Hospitality"] },
    },
    {
      restaurantId: createdRestaurants.find((r) => r.slug === "third-wave")!._id,
      dishOrdered: "V60 Pour Over · Guji",
      ratings: { overall: 5, foodQuality: 5, service: 4, staffBehaviour: 5, ambience: 5, cleanliness: 5, valueForMoney: 4 },
      comment: "Outstanding floral notes in the pour over. Perfect lighting and tranquil vibe to get creative work done.",
      tags: ["Great ambience", "Friendly staff"],
      sentiment: { label: "POSITIVE", score: 0.91, themes: ["Ambience & Vibe", "Food Quality"] },
    },
    {
      restaurantId: createdRestaurants.find((r) => r.slug === "nagarjuna")!._id,
      dishOrdered: "Andhra Meals on Banana Leaf",
      ratings: { overall: 4, foodQuality: 5, service: 4, staffBehaviour: 4, ambience: 4, cleanliness: 4, valueForMoney: 5 },
      comment: "Unmatched spice kick and genuine gunpowder. The sholay kebab was tender and hot.",
      tags: ["Excellent food", "Worth visiting"],
      sentiment: { label: "POSITIVE", score: 0.88, themes: ["Food Quality", "Value & Pricing"] },
    },
  ];

  for (let i = 0; i < sampleReviews.length; i++) {
    const rev = sampleReviews[i];
    await Review.create({
      ...rev,
      authorHash: generateAuthorHash(`seed-client-${i}`),
      anonymousLabel: `Verified Diner #${3020 + i}`,
      visitDate: new Date(Date.now() - (i + 1) * 3600 * 1000),
      moderationStatus: "APPROVED",
      businessStatus: "UNREVIEWED",
    });
  }

  console.log("✅ Seed finished successfully.");
}

