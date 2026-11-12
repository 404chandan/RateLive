import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  TrendingUp,
  Sparkles,
  Flame,
  Star,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  MessageSquareQuote,
  Utensils,
} from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { fetchApi } from "../services/api";
import { getLiveSocket } from "../services/socket";
import type { Review } from "../types";

export const LiveIntelligencePage: React.FC = () => {
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reviewsToday: 1284,
    positiveSentimentPct: 88,
    activeTrendingVenues: 4,
    signalsReceived: 42,
  });

  useEffect(() => {
    async function loadInitial() {
      try {
        const res: any = await fetchApi("/restaurants/signals/city-summary");
        if (res.success && res.data.recentReviews) {
          setLiveReviews(res.data.recentReviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();

    const socket = getLiveSocket();
    socket.on("live-review", (payload: any) => {
      setLiveReviews((prev) => [payload, ...prev.slice(0, 19)]);
      setStats((s) => ({
        ...s,
        reviewsToday: s.reviewsToday + 1,
        signalsReceived: s.signalsReceived + 1,
      }));
    });

    return () => {
      socket.off("live-review");
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-canvas text-ink">
      <Sidebar
        activeNeighborhood="All areas"
        onSelectNeighborhood={() => {}}
        showSavedOnly={false}
        onToggleSavedOnly={() => {}}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar breadcrumbTitle="Live Dining Intelligence & Stream" />

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pt-16 md:pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emeraldLive uppercase font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emeraldStrong live-pulse" />
                Real-Time Telemetry Stream
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-ink mt-1">
                Live Dining Intelligence
              </h1>
              <p className="text-xs text-muted mt-1 max-w-xl">
                Watch verified anonymous reviews, customer sentiment shifts, and dish ratings stream directly from diners across Bengaluru in real time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/explore"
                className="px-3.5 py-2 rounded-lg bg-panel border border-line hover:border-emeraldLive text-xs text-ink flex items-center gap-1.5 transition-colors"
              >
                <Compass size={14} />
                <span>Explore Map</span>
              </Link>
            </div>
          </div>

          {/* Pulse Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-line bg-panel space-y-1">
              <div className="text-[11px] text-muted font-sans">Reviews Received Today</div>
              <div className="text-2xl font-display font-extrabold text-ink">
                {stats.reviewsToday.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-emeraldLive">↑ 14% vs weekday avg</div>
            </div>

            <div className="p-4 rounded-xl border border-line bg-panel space-y-1">
              <div className="text-[11px] text-muted font-sans">Positive Sentiment %</div>
              <div className="text-2xl font-display font-extrabold text-emeraldLive">
                {stats.positiveSentimentPct}%
              </div>
              <div className="text-[10px] font-mono text-muted">Citywide aggregate</div>
            </div>

            <div className="p-4 rounded-xl border border-line bg-panel space-y-1">
              <div className="text-[11px] text-muted font-sans">Venues Trending Right Now</div>
              <div className="text-2xl font-display font-extrabold text-cyanLive">
                {stats.activeTrendingVenues}
              </div>
              <div className="text-[10px] font-mono text-cyanLive">High velocity check-ins</div>
            </div>

            <div className="p-4 rounded-xl border border-line bg-panel space-y-1">
              <div className="text-[11px] text-muted font-sans">Signals Processed</div>
              <div className="text-2xl font-display font-extrabold text-amber">
                {stats.signalsReceived}
              </div>
              <div className="text-[10px] font-mono text-amber">Socket connected</div>
            </div>
          </div>

          {/* Live Feed Stream */}
          <div className="rounded-xl border border-line bg-panel overflow-hidden">
            <div className="p-4 border-b border-line bg-sidebar flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emeraldStrong live-pulse" />
                <span className="font-semibold text-xs text-ink uppercase tracking-wider font-mono">
                  Verified Anonymous Feed Stream
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted">
                STREAMING WEBSOCKET PAYLOADS
              </span>
            </div>

            <div className="divide-y divide-line">
              {loading ? (
                <div className="p-8 text-center text-xs text-muted font-mono">
                  Connecting to live telemetry socket...
                </div>
              ) : liveReviews.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted">
                  Awaiting next real-time diner submission...
                </div>
              ) : (
                liveReviews.map((rev) => (
                  <article
                    key={rev._id}
                    className="p-4 hover:bg-panel-raised/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in duration-300"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-ink">
                          {rev.anonymousLabel}
                        </span>
                        <span className="text-[10px] text-quiet">rated</span>
                        <span className="text-xs font-semibold text-emeraldLive">
                          {typeof rev.restaurantId === "object"
                            ? rev.restaurantId.name
                            : (rev as any).restaurantName || "Restaurant"}
                        </span>
                        <span className="text-[10px] font-mono text-quiet">
                          ({typeof rev.restaurantId === "object"
                            ? rev.restaurantId.neighborhood
                            : (rev as any).neighborhood || "Bengaluru"})
                        </span>
                      </div>

                      {rev.dishOrdered && (
                        <div className="text-xs text-ink/80 flex items-center gap-1">
                          <Utensils size={11} className="text-emeraldLive" />
                          <span>Ordered: {rev.dishOrdered}</span>
                        </div>
                      )}

                      {rev.comment && (
                        <p className="text-xs text-muted line-clamp-2">
                          "{rev.comment}"
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[10px] font-mono text-quiet">
                        <span>{new Date(rev.createdAt).toLocaleTimeString()}</span>
                        <span>·</span>
                        <span className="text-emeraldLive font-medium">
                          Sentiment: {rev.sentiment?.label || "POSITIVE"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                      <div className="flex items-center gap-1 font-display font-bold text-base text-emeraldLive">
                        <span>{rev.ratings.overall.toFixed(1)}</span>
                        <Star size={14} fill="currentColor" />
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

