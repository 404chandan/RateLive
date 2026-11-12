import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Sparkles,
  Utensils,
  Store,
  RefreshCw,
  X,
  MapPin,
} from "lucide-react";
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

  // Filtered and sorted venues
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
    <div className="min-h-screen flex bg-canvas text-ink">
      <Sidebar
        activeNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={setSelectedNeighborhood}
        showSavedOnly={showSavedOnly}
        onToggleSavedOnly={() => setShowSavedOnly((s) => !s)}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar breadcrumbTitle="Discover" />

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pt-16 md:pt-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] text-emeraldLive uppercase tracking-wider font-semibold">
                Bengaluru · City Pulse
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-ink mt-1">
                Find your next great meal.
              </h1>
              <p className="text-xs text-muted mt-1 max-w-lg">
                Real-time dining intelligence and live community sentiment from diners right now.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-muted self-start md:self-end">
              <span className="w-2 h-2 rounded-full bg-emeraldStrong live-pulse" />
              <span>LIVE BENGALURU RADAR ACTIVE</span>
            </div>
          </div>

          {/* Controls bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-quiet"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a place, dish, or neighborhood..."
                className="w-full h-11 pl-9 pr-4 rounded-lg bg-panel border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive placeholder:text-quiet"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-panel border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive"
              >
                <option value="recent">Sort: Highest Recency Trend</option>
                <option value="rating">Sort: Top Rated Overall</option>
                <option value="activity">Sort: Most Active Visits</option>
              </select>
            </div>

            <div className="md:col-span-3 flex p-1 bg-panel border border-line rounded-lg">
              {(["3h", "today", "7d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                    timeRange === r
                      ? "bg-emeraldStrong/15 text-emeraldLive font-semibold shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {r === "3h" ? "Now · 3h" : r === "today" ? "Today" : "7 Days"}
                </button>
              ))}
            </div>
          </div>

          {/* Citywide stat counter cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg border border-line bg-panel flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted">Venues monitored</span>
                <div className="text-xl font-display font-bold text-ink mt-0.5">
                  {cityStats.totalVenues}
                </div>
              </div>
              <span className="font-mono text-[10px] text-emeraldLive bg-emeraldStrong/10 px-2 py-0.5 rounded">
                +6 this week
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-line bg-panel flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted">Verified visits today</span>
                <div className="text-xl font-display font-bold text-ink mt-0.5">
                  {cityStats.verifiedVisitsToday.toLocaleString()}
                </div>
              </div>
              <span className="font-mono text-[10px] text-emeraldLive bg-emeraldStrong/10 px-2 py-0.5 rounded">
                ↑ 12%
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-line bg-panel flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted">Citywide rating</span>
                <div className="text-xl font-display font-bold text-emeraldLive mt-0.5">
                  {cityStats.citywideRating} ★
                </div>
              </div>
              <span className="font-mono text-[10px] text-emeraldLive bg-emeraldStrong/10 px-2 py-0.5 rounded">
                +0.08
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-line bg-panel flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted">Live signals</span>
                <div className="text-xl font-display font-bold text-ink mt-0.5">
                  {cityStats.liveSignalsCount}
                </div>
              </div>
              <span className="font-mono text-[10px] text-amber bg-amber/10 px-2 py-0.5 rounded">
                across 9 areas
              </span>
            </div>
          </div>

          {/* Main Content Grid: Map + List on Left, Live Pulse on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 space-y-5">
              {/* Interactive Map */}
              <LiveMap
                venues={venues}
                onSelectVenue={(v) => {
                  setSelectedVenue(v);
                  setIsDetailModalOpen(true);
                }}
              />

              {/* Venue Results List */}
              <section className="rounded-lg border border-line bg-panel overflow-hidden">
                <div className="p-3.5 border-b border-line flex items-center justify-between bg-sidebar">
                  <div>
                    <h2 className="text-xs font-semibold text-ink">
                      Places with recent diner visits
                    </h2>
                    <span className="text-[10px] font-mono text-muted">
                      {filteredVenues.length} {filteredVenues.length === 1 ? "place" : "places"} matching filters
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
                      className="text-xs text-emeraldLive hover:underline flex items-center gap-1 font-mono"
                    >
                      Clear filters <X size={13} />
                    </button>
                  )}
                </div>

                {/* Cuisine Filter Pills */}
                <div className="flex items-center gap-1.5 p-2.5 border-b border-line overflow-x-auto scrollbar-none">
                  {cuisines.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCuisine(c)}
                      className={`text-[11px] px-3 py-1 rounded-md border whitespace-nowrap transition-colors ${
                        selectedCuisine === c
                          ? "bg-emeraldStrong/15 border-emeraldLive text-emeraldLive font-medium"
                          : "border-line text-muted hover:text-ink hover:bg-panel-raised"
                      }`}
                    >
                      {c === "all" ? "All cuisines" : c}
                    </button>
                  ))}
                </div>

                {/* Venues Rendered */}
                <div className="divide-y divide-line">
                  {loading ? (
                    <div className="p-8 text-center text-xs text-muted font-mono">
                      Loading live restaurant radar...
                    </div>
                  ) : filteredVenues.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <p className="text-xs text-muted">
                        No restaurants match those criteria. Try another search or neighborhood.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedNeighborhood("All areas");
                          setSelectedCuisine("all");
                        }}
                        className="text-xs text-emeraldLive font-semibold underline"
                      >
                        Reset filters
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
                </div>
              </section>
            </div>

            {/* Right Column: Live Pulse, Signals, Radar */}
            <aside className="lg:col-span-4 space-y-5">
              {/* Pulse & Trend Card */}
              <div className="rounded-lg border border-line bg-panel p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="text-xs font-semibold text-ink">Bengaluru Pulse</div>
                  <span className="font-mono text-[10px] text-muted uppercase">Past 6 Hours</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-display font-extrabold text-ink">
                      4.36 <span className="text-emeraldLive text-lg">★</span>
                    </div>
                    <div className="text-[11px] text-muted">Average recent visit rating</div>
                  </div>
                  <div className="text-xs font-mono text-emeraldLive bg-emeraldStrong/10 border border-emeraldLive/30 px-2 py-1 rounded">
                    +0.08 ↑
                  </div>
                </div>

                {/* SVG Trend Wave */}
                <div className="relative h-24 w-full border-b border-line pt-2">
                  <svg
                    viewBox="0 0 420 90"
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="liveWave" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#67c77c" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#67c77c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 70 C30 65, 60 75, 90 55 C120 40, 150 60, 180 45 C210 35, 240 50, 270 30 C300 25, 330 40, 360 20 C390 15, 410 22, 420 12 L420 90 L0 90 Z"
                      fill="url(#liveWave)"
                    />
                    <path
                      d="M0 70 C30 65, 60 75, 90 55 C120 40, 150 60, 180 45 C210 35, 240 50, 270 30 C300 25, 330 40, 360 20 C390 15, 410 22, 420 12"
                      fill="none"
                      stroke="#67c77c"
                      strokeWidth="2.5"
                    />
                    <circle cx="420" cy="12" r="4" fill="#a4e2ad" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-quiet">
                  <span>10:00</span>
                  <span>12:00</span>
                  <span>14:00</span>
                  <span>16:00</span>
                </div>
              </div>

              {/* Recent Live Signals */}
              <div className="rounded-lg border border-line bg-panel p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-line pb-2.5">
                  <span className="text-xs font-semibold text-ink">Recent Signals</span>
                  <span className="font-mono text-[10px] text-emeraldLive flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emeraldStrong live-pulse" />
                    LIVE STREAM
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded bg-panel-raised border border-line">
                    <div className="p-1 rounded bg-emeraldStrong/15 text-emeraldLive">
                      <TrendingUp size={14} />
                    </div>
                    <div>
                      <div className="text-ink font-medium">Dish trending: Ghee Roast Dosa</div>
                      <div className="text-[10px] text-muted">MTR 1924 · Koramangala (2m ago)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded bg-panel-raised border border-line">
                    <div className="p-1 rounded bg-cyanLive/15 text-cyanLive">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div className="text-ink font-medium">Cold brew gaining momentum</div>
                      <div className="text-[10px] text-muted">Third Wave · HSR Layout (8m ago)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded bg-panel-raised border border-line">
                    <div className="p-1 rounded bg-amber/15 text-amber">
                      <Utensils size={14} />
                    </div>
                    <div>
                      <div className="text-ink font-medium">Wait times elevated · 18 min</div>
                      <div className="text-[10px] text-muted">Truffles · Indiranagar (12m ago)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Visit Spotlight */}
              <div className="rounded-lg border border-line bg-panel p-4 space-y-3">
                <div className="text-xs font-semibold text-ink border-b border-line pb-2">
                  Popular Right Now (Recent Visits)
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { dish: "Smash Burgers", area: "Indiranagar", visits: 38, delta: "+18%" },
                    { dish: "Ghee Roast Dosa", area: "Koramangala", visits: 31, delta: "+12%" },
                    { dish: "Iced Filter Coffee", area: "HSR Layout", visits: 24, delta: "+9%" },
                  ].map((item) => (
                    <div
                      key={item.dish}
                      className="flex items-center justify-between p-2 rounded bg-panel-raised border border-line"
                    >
                      <div>
                        <div className="font-medium text-ink">{item.dish}</div>
                        <div className="text-[10px] text-muted">
                          {item.area} · {item.visits} visits
                        </div>
                      </div>
                      <span className="font-mono text-xs text-emeraldLive font-semibold">
                        {item.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Marketing Sections: Features, Pricing, About */}
          <div className="space-y-6 pt-10 border-t border-line">
            <section id="features" className="rounded-lg border border-line bg-panel p-6 space-y-4">
              <div>
                <div className="font-mono text-[10px] text-emeraldLive uppercase">
                  A Better Signal For Every Meal
                </div>
                <h2 className="text-lg font-bold font-display text-ink mt-0.5">
                  Features built around what matters right now
                </h2>
                <p className="text-xs text-muted mt-1 max-w-xl">
                  Useful context from recent diner visits, organized to help diners make quick decisions and restaurants act on real feedback.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    title: "Recency-First Ratings",
                    desc: "See how places perform right now, today, and across the last 7 days rather than years-old stale reviews.",
                  },
                  {
                    title: "Dish-Level Discovery",
                    desc: "Discover the specific dishes that diners are praising or critiquing in the past few hours.",
                  },
                  {
                    title: "Neighborhood Context",
                    desc: "Compare dynamic footfalls and customer satisfaction across Bengaluru's top dining districts.",
                  },
                  {
                    title: "Zero-PII Privacy Layer",
                    desc: "Diners share candid, honest feedback without ever worrying about restaurants knowing their identity.",
                  },
                ].map((f) => (
                  <div key={f.title} className="p-4 rounded-lg bg-panel-raised border border-line space-y-2">
                    <h3 className="font-semibold text-xs text-ink">{f.title}</h3>
                    <p className="text-[11px] text-muted leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="pricing" className="rounded-lg border border-line bg-panel p-6 space-y-4">
              <div>
                <div className="font-mono text-[10px] text-emeraldLive uppercase">
                  Transparent Plans
                </div>
                <h2 className="text-lg font-bold font-display text-ink mt-0.5">
                  Pricing for diners & restaurant owners
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-panel-raised border border-line space-y-3">
                  <div className="text-[10px] font-mono text-muted uppercase">Diner · Free</div>
                  <div className="text-2xl font-display font-bold text-ink">
                    ₹0 <span className="text-xs font-sans text-muted font-normal">/ always</span>
                  </div>
                  <p className="text-xs text-muted">
                    Explore live ratings, real-time dish radars, and submit private feedback.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-panel-raised border border-[#c92323]/40 space-y-3 relative overflow-hidden">
                  <div className="text-[10px] font-mono text-[#c92323] uppercase font-bold">
                    Venue · Growth
                  </div>
                  <div className="text-2xl font-display font-bold text-ink">
                    ₹1,999 <span className="text-xs font-sans text-muted font-normal">/ month</span>
                  </div>
                  <p className="text-xs text-muted">
                    Dish performance tracking, anonymous customer inbox, AI sentiment analysis, and competitor benchmarks.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-panel-raised border border-line space-y-3">
                  <div className="text-[10px] font-mono text-muted uppercase">Enterprise Chain</div>
                  <div className="text-2xl font-display font-bold text-ink">
                    Custom <span className="text-xs font-sans text-muted font-normal">/ multi-branch</span>
                  </div>
                  <p className="text-xs text-muted">
                    Consolidated multi-unit executive reporting, SLA monitoring, and API integrations.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Venue Detail Modal */}
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

      {/* Live Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border border-emeraldLive/40 bg-panel text-emeraldLive shadow-2xl font-sans text-xs animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emeraldStrong live-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

