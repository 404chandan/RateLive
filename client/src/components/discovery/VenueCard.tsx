import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  TrendingUp,
  TrendingDown,
  Bookmark,
  ArrowUpRight,
  Utensils,
  Sparkles,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Restaurant } from "../../types";

interface VenueCardProps {
  venue: Restaurant;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetails: (venue: Restaurant) => void;
  timeRange?: "3h" | "today" | "7d";
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  isSaved,
  onToggleSave,
  onOpenDetails,
  timeRange = "3h",
}) => {
  const currentScore =
    timeRange === "7d" ? venue.metrics.rating7d : venue.metrics.overallRating;
  const isTrendNegative = venue.metrics.trendDelta < 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative p-4 rounded-xl border border-line bg-panel/75 backdrop-blur-md hover:border-emerald/40 hover:bg-panel-raised transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/30 flex items-center justify-between gap-4 overflow-hidden"
    >
      {/* Dynamic Left accent bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-gradient-to-b group-hover:from-emerald group-hover:to-cyan transition-colors" />

      {/* Restaurant Photo & Meta */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-panel border border-line flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {venue.metrics.trendDelta > 0.15 && (
            <div className="absolute top-1 left-1 p-0.5 bg-coral/90 rounded text-white shadow">
              <Flame size={11} />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold font-display text-sm text-ink truncate group-hover:text-emerald transition-colors">
              {venue.name}
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-panel-raised border border-line text-quiet font-bold">
              {venue.priceTier}
            </span>
          </div>

          <p className="text-xs text-muted truncate">
            {venue.address} · <span className="text-ink font-medium">{venue.neighborhood}</span>
          </p>

          <div className="flex items-center gap-1.5 text-xs text-emerald font-medium truncate pt-0.5">
            <Utensils size={12} className="flex-shrink-0" />
            <span className="truncate">
              {venue.topDishes[0]?.name || `${venue.cuisine} specialties`}
            </span>
          </div>
        </div>
      </div>

      {/* Live Metrics Column */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 font-display font-extrabold text-lg text-emerald">
            <span>{currentScore.toFixed(1)}</span>
            <Star size={14} className="fill-emerald text-emerald animate-pulse" />
          </div>

          <div className="text-[11px] font-mono text-muted mt-0.5">
            {venue.metrics.recentVisits3h} visits in 3h
          </div>

          <div
            className={`flex items-center justify-end gap-1 text-[11px] font-mono font-bold mt-0.5 ${
              isTrendNegative ? "text-coral" : "text-emerald"
            }`}
          >
            {isTrendNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            <span>
              {venue.metrics.trendDelta > 0
                ? `+${venue.metrics.trendDelta}`
                : venue.metrics.trendDelta}
            </span>
          </div>
        </div>

        {/* Micro-actions */}
        <div className="flex flex-col items-center gap-1.5 border-l border-line/60 pl-3">
          <button
            onClick={() => onToggleSave(venue._id)}
            title={isSaved ? "Remove from saved" : "Save place"}
            className={`p-2 rounded-lg border transition-all ${
              isSaved
                ? "bg-emerald/15 border-emerald/40 text-emerald"
                : "border-line bg-panel text-quiet hover:text-ink hover:border-line-strong"
            }`}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          </button>

          <button
            onClick={() => onOpenDetails(venue)}
            title="Inspect Live Signals"
            className="p-2 rounded-lg border border-line bg-panel text-quiet hover:text-emerald hover:border-emerald/40 transition-all hover:scale-110"
          >
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
