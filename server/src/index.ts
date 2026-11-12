import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { seedInitialData } from "./seed/seedData.js";

import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import reviewRoutes from "./routes/reviews.js";
import businessRoutes from "./routes/business.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

// Real-time WebSocket connection handling
io.on("connection", (socket) => {
  socket.on("join-restaurant", (restaurantId: string) => {
    socket.join(`restaurant:${restaurantId}`);
  });

  socket.on("leave-restaurant", (restaurantId: string) => {
    socket.leave(`restaurant:${restaurantId}`);
  });
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "RateLive Core API",
    time: new Date().toISOString(),
  });
});

async function startServer() {
  try {
    const dbType = await connectDatabase();
    console.log(` Connected to MongoDB (${dbType})`);

    await seedInitialData();

    server.listen(env.PORT, () => {
      console.log(` RateLive API Server listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, server };

