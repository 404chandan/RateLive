import crypto from "crypto";
import { env } from "../config/env.js";

/**
 * Creates a one-way deterministic HMAC hash of a user's ID or IP.
 * Used exclusively for internal rate-limiting and duplicate review prevention.
 * NEVER exposed to restaurants, public APIs, or client dashboards.
 */
export function generateAuthorHash(identifier: string, salt: string = ""): string {
  return crypto
    .createHmac("sha256", env.PRIVACY_HMAC_SECRET)
    .update(`${identifier}:${salt}`)
    .digest("hex");
}

/**
 * Generates an anonymous, friendly label such as "Verified Diner · Table 4"
 * or "Diner #8492" without any personally identifiable information.
 */
export function generateAnonymousLabel(visitIndex?: number): string {
  const descriptors = [
    "Verified Diner",
    "Evening Guest",
    "Weekend Diner",
    "Food Enthusiast",
    "Lunch Diner",
    "Local Explorer",
  ];
  const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
  const token = (visitIndex || Math.floor(1000 + Math.random() * 9000)).toString();
  return `${descriptor} #${token}`;
}

/**
 * Basic review content scrubber to prevent diners from inadvertently leaking
 * their personal contact details (phone numbers, emails) in review comments.
 */
export function sanitizeReviewText(text: string): string {
  if (!text) return "";
  // Mask email addresses
  const maskedEmail = text.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[email redacted]"
  );
  // Mask 10-digit phone numbers
  const maskedPhone = maskedEmail.replace(
    /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    "[phone redacted]"
  );
  return maskedPhone.trim();
}

