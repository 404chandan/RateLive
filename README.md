# RateLive — Real Experiences. Live Insights.

RateLive is a two-sided RestaurantTech and Customer Experience Intelligence platform built on the **MERN + Vite React + TypeScript** stack.

The platform unifies **Real-Time Diner Discovery & Sentiment Intelligence** with **Private, Zero-PII Anonymous Feedback Telemetry** and **Enterprise Multi-Branch Operations Analytics**.

---

## Brand Logo
The official RateLive chef-hat and cursive typography brand logo provided is embedded across the entire application navigation, page headers, branding cards, and mobile bars:
- Path: `client/public/ratelive-logo.jpg`
- Component: `client/src/components/common/RateLiveLogo.tsx`

---

## Architectural Highlights

### 1. Dual-Platform Unified Architecture
- **Diner Experience (`/`, `/explore`, `/live`)**:
  - Live spatial coordinate map of monitored restaurants across Bengaluru (Indiranagar, Koramangala, HSR Layout, Jayanagar).
  - Recency-first filters: Now (3h), Today, 7-day historical trends.
  - Interactive dish radar with real-time dining mentions.
  - Frictionless, privacy-preserving review submission modal with 6-dimension rating sliders.
- **Restaurant Business Platform (`/business`, `/business/reviews`, `/business/sentiment`, `/business/competitors`)**:
  - Executive KPI dashboards: CSAT index, live visit velocity, positive sentiment index, volume over time.
  - Anonymous feedback inbox allowing owners to mark feedback as reviewed, resolved, attach internal operations notes, and post verified public management responses.
  - AI thematic sentiment breakdown (Food Quality, Service Speed, Staff Hospitality, Hygiene, Value, Ambience).
  - Public competitor benchmarking without ever leaking peer confidential data.

### 2. Strict Privacy & Zero-PII Compliance (Rule #1 & Rule #2)
- Customer personal identifiers (email, name, phone, user profile links) are **never** returned in business-facing API responses or stored on review records.
- Reviews use one-way HMAC SHA-256 hashes for rate limiting and duplicate prevention.
- Public & business views only receive friendly pseudonymous tokens (e.g. `Verified Diner #3021`).
- Review comments are sanitized server-side to strip accidental phone numbers or email addresses.
- Verified by automated unit tests in `server/src/tests/privacy.test.ts`.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Framer Motion primitives, Socket.IO Client.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose ODM, Helmet, CORS, JWT authentication with role-based access control, Socket.IO for real-time live events.
- **Database**: MongoDB with automatic embedded in-memory database fallback (`mongodb-memory-server`) for instantaneous zero-config local execution or external MongoDB Atlas connection via `MONGO_URI`.

---

## Quick Start & Running Locally

### 1. Run the Backend API Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000 with automatic initial database seeding
```

### 2. Run the Vite React Frontend
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Run Automated Tests
```bash
npm run test:server
```

---

## Default Seeded Accounts
- **Restaurant Owner**: `owner@ratelive.io` (password: `owner123`)
- **Verified Customer**: `customer@ratelive.io` (password: `customer123`)
- **Platform Admin**: `admin@ratelive.io` (password: `admin123`)

