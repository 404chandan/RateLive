import React from "react";
import { Link } from "react-router-dom";
import { Star, TrendingUp, TrendingDown, Bookmark, ArrowUpRight, Utensils } from "lucide-react";
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
    <article className="group p-3.5 border-b border-line last:border-b-0 hover:bg-panel-raised/60 transition-colors flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={venue.coverImage}
          alt={venue.name}
          className="w-14 h-14 rounded-lg object-cover bg-panel border border-line flex-shrink-0"
          loading="lazy"
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-xs text-ink truncate group-hover:text-emeraldLive transition-colors">
              {venue.name}
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-panel border border-line text-quiet">
              {venue.priceTier}
            </span>
          </div>

          <p className="text-[11px] text-muted truncate mt-0.5">
            {venue.address} · <span className="text-ink">{venue.neighborhood}</span>
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-emeraldLive/90 mt-1 truncate">
            <Utensils size={12} className="flex-shrink-0" />
            <span className="truncate">
              {venue.topDishes[0]?.name || `${venue.cuisine} specialties`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 font-display font-bold text-base text-emeraldLive">
            <span>{currentScore.toFixed(1)}</span>
            <Star size={13} fill="currentColor" />
          </div>

          <div className="text-[10px] font-mono text-quiet mt-0.5">
            {venue.metrics.recentVisits3h} visits in 3h
          </div>

          <div
            className={`flex items-center justify-end gap-0.5 text-[10px] font-mono mt-0.5 ${
              isTrendNegative ? "text-red" : "text-emeraldLive"
            }`}
          >
            {isTrendNegative ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
            <span>
              {venue.metrics.trendDelta > 0 ? `+${venue.metrics.trendDelta}` : venue.metrics.trendDelta}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onToggleSave(venue._id)}
            title={isSaved ? "Remove from saved" : "Save place"}
            className={`p-1.5 rounded hover:bg-panel transition-colors ${
              isSaved ? "text-emeraldLive" : "text-quiet hover:text-ink"
            }`}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          </button>

          <button
            onClick={() => onOpenDetails(venue)}
            title="Inspect Live Signals"
            className="p-1.5 rounded hover:bg-panel text-quiet hover:text-ink transition-colors"
          >
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

