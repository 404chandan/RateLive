import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "ratelive-dev-jwt-secret-change-in-prod",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "ratelive-dev-refresh-secret-change-in-prod",
  PRIVACY_HMAC_SECRET: process.env.PRIVACY_HMAC_SECRET || "ratelive-dev-hmac-privacy-key",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

