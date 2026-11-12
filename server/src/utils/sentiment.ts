import type { SentimentLabel } from "../models/index.js";

interface SentimentResult {
  label: SentimentLabel;
  score: number; // 0.0 to 1.0
  themes: string[];
}

const POSITIVE_LEXICON = [
  "great", "amazing", "delicious", "crispy", "fresh", "excellent", "superb",
  "fast", "friendly", "polite", "loved", "best", "worth", "clean", "vibrant",
  "flavorful", "welcoming", "perfection", "tender", "cozy"
];

const NEGATIVE_LEXICON = [
  "slow", "waiting", "delay", "cold", "bland", "dirty", "unhygienic", "rude",
  "expensive", "overpriced", "poor", "worst", "bad", "undercooked", "burnt",
  "salty", "oily", "noisy", "disappointing", "terrible"
];

const THEME_MAPPINGS: Record<string, string[]> = {
  "Food Quality": ["taste", "flavor", "delicious", "fresh", "bland", "cold", "raw", "crispy", "undercooked"],
  "Service Speed": ["waiting", "slow", "delay", "quick", "fast", "queue", "rush", "prompt"],
  "Staff & Hospitality": ["friendly", "rude", "polite", "welcoming", "behaviour", "staff", "attentive", "ignored"],
  "Hygiene & Cleanliness": ["clean", "dirty", "washroom", "table", "hygiene", "tidy", "stained"],
  "Value & Pricing": ["expensive", "worth", "overpriced", "pocket-friendly", "bill", "portion", "value"],
  "Ambience & Vibe": ["music", "noisy", "cozy", "lighting", "aesthetic", "vibe", "seating", "crowded"],
};

export function analyzeSentiment(comment: string, overallRating: number): SentimentResult {
  const normalized = (comment || "").toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of POSITIVE_LEXICON) {
    if (normalized.includes(word)) positiveScore += 1;
  }
  for (const word of NEGATIVE_LEXICON) {
    if (normalized.includes(word)) negativeScore += 1;
  }

  // Weight by overall numerical rating (1-5)
  if (overallRating >= 4) positiveScore += 2;
  else if (overallRating <= 2) negativeScore += 2;

  let label: SentimentLabel = "NEUTRAL";
  let score = 0.5;

  if (positiveScore > negativeScore) {
    label = "POSITIVE";
    score = Math.min(0.95, 0.6 + positiveScore * 0.08);
  } else if (negativeScore > positiveScore) {
    label = "NEGATIVE";
    score = Math.max(0.1, 0.4 - negativeScore * 0.08);
  } else {
    label = overallRating >= 4 ? "POSITIVE" : overallRating <= 2 ? "NEGATIVE" : "NEUTRAL";
    score = overallRating / 5.0;
  }

  const themes: string[] = [];
  for (const [theme, keywords] of Object.entries(THEME_MAPPINGS)) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      themes.push(theme);
    }
  }

  if (themes.length === 0) {
    themes.push("Overall Experience");
  }

  return { label, score: Number(score.toFixed(2)), themes };
}
