import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  Utensils,
  RefreshCw,
  X,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { VenueCard } from "../components/discovery/VenueCard";
import { LiveMap } from "../components/discovery/LiveMap";
import { VenueDetailModal } from "../components/discovery/VenueDetailModal";
import { ReviewModal } from "../components/discovery/ReviewModal";
import { fetchApi } from "../services/api";
import { getLiveSocket } from "../services/socket";
import { useAuth } from "../context/AuthContext";
import type { Restaurant } from "../types";

export const ExplorePage: React.FC = () => {
  const { savedVenueIds, toggleSaveVenue } = useAuth();

  const [venues, setVenues] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("All areas");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [timeRange, setTimeRange] = useState<"3h" | "today" | "7d">("3h");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [selectedVenue, setSelectedVenue] = useState<Restaurant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewVenueTarget, setReviewVenueTarget] = useState<Restaurant | null>(null);

  const [cityStats, setCityStats] = useState({
    totalVenues: 142,
    verifiedVisitsToday: 1284,
    citywideRating: 4.36,
    liveSignalsCount: 28,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadVenues = async () => {
    try {
      const res: any = await fetchApi("/restaurants");
      if (res.success) {
        setVenues(res.data);
      }
    } catch (err) {
      console.error("Failed to load venues", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCitySummary = async () => {
    try {
      const res: any = await fetchApi("/restaurants/signals/city-summary");
      if (res.success) {
        setCityStats({
          totalVenues: res.data.totalVenues,
          verifiedVisitsToday: res.data.verifiedVisitsToday,
          citywideRating: res.data.citywideRating,
          liveSignalsCount: res.data.liveSignalsCount,
        });
      }
    } catch (err) {
      console.error("City summary failed", err);
    }
  };

  useEffect(() => {
    loadVenues();
    loadCitySummary();

    const socket = getLiveSocket();
    socket.on("live-review", (payload: any) => {
      triggerToast(`Live visit recorded at ${payload.restaurantName}`);
      loadVenues();
      loadCitySummary();
    });

    return () => {
      socket.off("live-review");
    };
  }, []);

  const cuisines = ["all", "South Indian", "Burgers", "Coffee", "Andhra"];

  const filteredVenues = venues
    .filter((venue) => {
      const matchesArea =
        selectedNeighborhood === "All areas" ||
        venue.neighborhood.toLowerCase() === selectedNeighborhood.toLowerCase();
      const matchesCuisine =
        selectedCuisine === "all" ||
        venue.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        venue.name.toLowerCase().includes(q) ||
        venue.cuisine.toLowerCase().includes(q) ||
        venue.neighborhood.toLowerCase().includes(q) ||
        venue.topDishes.some((d) => d.name.toLowerCase().includes(q));
      const matchesSaved = !showSavedOnly || savedVenueIds.includes(venue._id);

      return matchesArea && matchesCuisine && matchesSearch && matchesSaved;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.metrics.overallRating - a.metrics.overallRating;
      if (sortBy === "activity") return b.metrics.totalReviews - a.metrics.totalReviews;
      return b.metrics.trendDelta - a.metrics.trendDelta;
    });

  return (
    <div className="min-h-screen flex bg-canvas text-ink aurora-bg">
      <Sidebar
        activeNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={setSelectedNeighborhood}
        showSavedOnly={showSavedOnly}
        onToggleSavedOnly={() => setShowSavedOnly((s) => !s)}
      />

      <main className="flex-1 min-w-0 flex flex-col relative z-10">
        <Topbar breadcrumbTitle="Live Food & Venue Intelligence" />

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pt-16 md:pt-6">
          {/* Hero Banner Section */}
          <div className="relative rounded-3xl p-6 md:p-8 border border-line bg-gradient-to-r from-panel via-panel-raised to-panel overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald/30 bg-emerald/10 text-[11px] font-mono text-emerald font-semibold shimmer-badge">
                <span className="w-2 h-2 rounded-full bg-emerald live-pulse-beacon" />
                <span>BENGALURU REAL-TIME METROPOLIS RADAR</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-ink">
                Real Experiences. <span className="text-emerald">Live Insights.</span>
              </h1>
              <p className="text-xs md:text-sm text-muted leading-relaxed">
                Experience dining discovery free of outdated algorithms. Monitor genuine customer sentiment, verified recent visits, and dish quality shifts happening across Bengaluru right now.
              </p>
            </div>
          </div>

          {/* Precision Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input with floating keyboard shortcut */}
            <div className="md:col-span-6 relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-quiet"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant, dish, or neighborhood..."
                className="w-full h-11 pl-10 pr-12 rounded-xl bg-panel/90 border border-line text-ink text-xs focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20 transition-all placeholder:text-quiet"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-quiet border border-line px-1.5 py-0.5 rounded bg-panel-raised pointer-events-none">
                /
              </span>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-panel/90 border border-line text-ink text-xs focus:outline-none focus:border-emerald font-medium transition-all"
              >
                <option value="recent">Sort: Highest Recency Trend</option>
                <option value="rating">Sort: Top Rated Overall</option>
                <option value="activity">Sort: Most Active Footfall</option>
              </select>
            </div>

            {/* Recency Time Filter Tabs */}
            <div className="md:col-span-3 flex p-1 bg-panel/90 border border-line rounded-xl shadow-inner">
              {(["3h", "today", "7d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    timeRange === r
                      ? "bg-emerald text-black shadow-md shadow-emerald/20"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {r === "3h" ? "Now · 3h" : r === "today" ? "Today" : "7 Days"}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                label: "Venues Monitored",
                val: cityStats.totalVenues,
                delta: "+6 this week",
                color: "text-ink",
              },
              {
                label: "Verified Visits Today",
                val: cityStats.verifiedVisitsToday.toLocaleString(),
                delta: "↑ 12% velocity",
                color: "text-emerald",
              },
              {
                label: "Citywide Average Rating",
                val: `${cityStats.citywideRating} ★`,
                delta: "+0.08 shift",
                color: "text-emerald",
              },
              {
                label: "Live Dynamic Signals",
                val: cityStats.liveSignalsCount,
                delta: "across 9 zones",
                color: "text-cyan",
              },
            ].map((kpi, idx) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="p-4 rounded-2xl border border-line bg-panel/75 backdrop-blur-md flex items-center justify-between glass-card"
              >
                <div>
                  <span className="text-[11px] text-muted font-sans font-medium">{kpi.label}</span>
                  <div className={`text-2xl font-display font-extrabold ${kpi.color} mt-1`}>
                    {kpi.val}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded font-bold">
                  {kpi.delta}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Main Grid: Interactive Map + Filtered Venue Radar List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Satellite Interactive Map */}
              <LiveMap
                venues={venues}
                onSelectVenue={(v) => {
                  setSelectedVenue(v);
                  setIsDetailModalOpen(true);
                }}
              />

              {/* Dynamic Venue List */}
              <section className="rounded-2xl border border-line bg-panel/80 backdrop-blur-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-line flex items-center justify-between bg-sidebar/80">
                  <div>
                    <h2 className="text-xs font-bold text-ink uppercase tracking-wider font-mono">
                      Verified Venue Radar Stream
                    </h2>
                    <span className="text-[11px] font-mono text-muted">
                      {filteredVenues.length} {filteredVenues.length === 1 ? "venue" : "venues"} matching live filters
                    </span>
                  </div>

                  {(searchQuery || selectedNeighborhood !== "All areas" || selectedCuisine !== "all" || showSavedOnly) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedNeighborhood("All areas");
                        setSelectedCuisine("all");
                        setShowSavedOnly(false);
                      }}
                      className="text-xs text-emerald hover:underline flex items-center gap-1 font-mono font-bold"
                    >
                      Reset filters <X size={14} />
                    </button>
                  )}
                </div>

                {/* Cuisine Filter Pills with active neon glow */}
                <div className="flex items-center gap-2 p-3 border-b border-line overflow-x-auto scrollbar-none bg-panel/40">
                  {cuisines.map((c) => {
                    const isSelected = selectedCuisine === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedCuisine(c)}
                        className={`text-xs px-3.5 py-1.5 rounded-xl border whitespace-nowrap font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-emerald text-black border-emerald font-bold shadow-md shadow-emerald/30 scale-105"
                            : "border-line text-muted hover:text-ink hover:bg-panel-raised"
                        }`}
                      >
                        {c === "all" ? "All Cuisines" : c}
                      </button>
                    );
                  })}
                </div>

                {/* Venue Cards List */}
                <div className="p-3 space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <div className="p-12 text-center text-xs text-muted font-mono animate-pulse">
                        Synchronizing live satellite telemetry...
                      </div>
                    ) : filteredVenues.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <p className="text-xs text-muted">
                          No restaurants match your filters. Try selecting another area or cuisine.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedNeighborhood("All areas");
                            setSelectedCuisine("all");
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald text-black text-xs font-bold shadow hover:bg-emerald/90 transition-all"
                        >
                          Show all venues
                        </button>
                      </div>
                    ) : (
                      filteredVenues.map((venue) => (
                        <VenueCard
                          key={venue._id}
                          venue={venue}
                          isSaved={savedVenueIds.includes(venue._id)}
                          onToggleSave={toggleSaveVenue}
                          onOpenDetails={(v) => {
                            setSelectedVenue(v);
                            setIsDetailModalOpen(true);
                          }}
                          timeRange={timeRange}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </div>

            {/* Right Column: Dynamic Live Stream & Trending Dish Signals */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Citywide Pulse Card */}
              <div className="rounded-2xl border border-line bg-panel/80 backdrop-blur-xl p-5 space-y-4 shadow-xl glass-card">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="text-xs font-bold text-ink uppercase tracking-wider font-mono">
                    Bengaluru Recency Wave
                  </div>
                  <span className="font-mono text-[10px] text-emerald bg-emerald/10 px-2 py-0.5 rounded font-bold">
                    PAST 6H
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-3xl font-display font-extrabold text-ink">
                      4.36 <span className="text-emerald text-xl">★</span>
                    </div>
                    <div className="text-xs text-muted mt-0.5">Weighted visit satisfaction</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald bg-emerald/10 border border-emerald/30 px-2 py-1 rounded">
                    +0.08 ↑
                  </div>
                </div>

                {/* Animated SVG Trend Wave */}
                <div className="relative h-24 w-full border-b border-line pt-2">
                  <svg
                    viewBox="0 0 420 90"
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="liveGlowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5be080" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#5be080" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 70 C30 65, 60 75, 90 55 C120 40, 150 60, 180 45 C210 35, 240 50, 270 30 C300 25, 330 40, 360 20 C390 15, 410 22, 420 12 L420 90 L0 90 Z"
                      fill="url(#liveGlowGrad)"
                    />
                    <path
                      d="M0 70 C30 65, 60 75, 90 55 C120 40, 150 60, 180 45 C210 35, 240 50, 270 30 C300 25, 330 40, 360 20 C390 15, 410 22, 420 12"
                      fill="none"
                      stroke="#5be080"
                      strokeWidth="2.5"
                    />
                    <circle cx="420" cy="12" r="5" fill="#5be080" className="animate-ping" />
                    <circle cx="420" cy="12" r="3.5" fill="#5be080" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-quiet">
                  <span>10:00 AM</span>
                  <span>12:00 PM</span>
                  <span>02:00 PM</span>
                  <span>NOW</span>
                </div>
              </div>

              {/* Verified Trending Dishes Radar */}
              <div className="rounded-2xl border border-line bg-panel/80 backdrop-blur-xl p-5 space-y-4 shadow-xl glass-card">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider font-mono">
                    Dish Radar Velocity
                  </span>
                  <Flame size={15} className="text-coral animate-bounce" />
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { dish: "All American Smash Burger", area: "Truffles · Indiranagar", mentions: "38 in 3h", pct: "+18%", color: "text-emerald" },
                    { dish: "Crispy Ghee Roast Dosa", area: "MTR 1924 · Koramangala", mentions: "31 in 3h", pct: "+14%", color: "text-emerald" },
                    { dish: "Single-Origin Cold Brew", area: "Third Wave · HSR", mentions: "24 in 3h", pct: "+9%", color: "text-cyan" },
                    { dish: "Fiery Andhra Banana Leaf Meal", area: "Nagarjuna · Indiranagar", mentions: "19 in 3h", pct: "+11%", color: "text-emerald" },
                  ].map((item) => (
                    <div
                      key={item.dish}
                      className="p-3 rounded-xl bg-panel-raised border border-line flex items-center justify-between hover:border-emerald/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-ink">{item.dish}</div>
                        <div className="text-[10px] text-muted">
                          {item.area} · {item.mentions}
                        </div>
                      </div>
                      <span className={`font-mono text-xs font-bold ${item.color}`}>
                        {item.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zero-PII Security Shield Pill */}
              <div className="p-4 rounded-2xl border border-emerald/30 bg-emerald/5 backdrop-blur-xl flex items-center gap-3 text-xs text-muted">
                <ShieldCheck size={24} className="text-emerald flex-shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-ink">Zero-PII Privacy Shield Active</div>
                  <p className="text-[11px] leading-relaxed">
                    Customer feedback is pseudonymized and authenticated via server-side HMAC hashing.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedVenue && (
        <VenueDetailModal
          venue={selectedVenue}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          isSaved={savedVenueIds.includes(selectedVenue._id)}
          onToggleSave={toggleSaveVenue}
          onOpenReviewModal={() => {
            setReviewVenueTarget(selectedVenue);
            setIsReviewModalOpen(true);
          }}
        />
      )}

      {/* Review Submission Modal */}
      {reviewVenueTarget && (
        <ReviewModal
          restaurant={reviewVenueTarget}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            loadVenues();
            loadCitySummary();
            triggerToast("Feedback received! Identity stays private.");
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald/40 bg-panel/95 text-emerald shadow-2xl font-sans text-xs animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald live-pulse-beacon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
