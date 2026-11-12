import React, { useState } from "react";
import { X, Star, Bookmark, TrendingUp, TrendingDown, Clock, ShieldCheck, Utensils, MessageSquarePlus } from "lucide-react";
import type { Restaurant } from "../../types";

interface VenueDetailModalProps {
  venue: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenReviewModal: () => void;
}

export const VenueDetailModal: React.FC<VenueDetailModalProps> = ({
  venue,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onOpenReviewModal,
}) => {
  if (!isOpen) return null;

  const isTrendNegative = venue.metrics.trendDelta < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-panel border border-line rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cover image header */}
        <div className="relative h-44 w-full bg-sidebar">
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-black/30" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emeraldStrong/80 text-black font-bold">
                {venue.cuisine}
              </span>
              <h2 className="text-xl font-display font-extrabold text-white mt-1">
                {venue.name}
              </h2>
              <p className="text-xs text-white/80">{venue.address} · {venue.neighborhood}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 font-display font-extrabold text-2xl text-emeraldLive">
                <span>{venue.metrics.overallRating.toFixed(1)}</span>
                <Star size={16} fill="currentColor" />
              </div>
              <span className="text-[10px] font-mono text-white/70">
                {venue.metrics.totalReviews} verified ratings
              </span>
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Live intelligence pill grid */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-lg border border-line bg-panel-raised text-center">
            <div>
              <div className="text-[10px] font-mono text-muted uppercase">Recent Rating</div>
              <div className="text-base font-display font-bold text-emeraldLive mt-0.5">
                {venue.metrics.recentRating3h.toFixed(1)} ★
              </div>
              <div className="text-[9px] font-mono text-quiet">Past 3 hours</div>
            </div>
            <div className="border-x border-line">
              <div className="text-[10px] font-mono text-muted uppercase">Visits Today</div>
              <div className="text-base font-display font-bold text-ink mt-0.5">
                {venue.metrics.recentVisits3h}
              </div>
              <div className="text-[9px] font-mono text-quiet">Verified visits</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-muted uppercase">Recency Trend</div>
              <div
                className={`flex items-center justify-center gap-0.5 text-base font-display font-bold mt-0.5 ${
                  isTrendNegative ? "text-red" : "text-emeraldLive"
                }`}
              >
                {isTrendNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>
                  {venue.metrics.trendDelta > 0
                    ? `+${venue.metrics.trendDelta}`
                    : venue.metrics.trendDelta}
                </span>
              </div>
              <div className="text-[9px] font-mono text-quiet">vs. 7-day average</div>
            </div>
          </div>

          {/* Description */}
          {venue.description && (
            <p className="text-xs text-muted leading-relaxed">
              {venue.description}
            </p>
          )}

          {/* Category score breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2 font-mono">
              Live Category Performance
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(venue.metrics.categoryAverages).map(([cat, val]) => (
                <div key={cat} className="p-2 rounded bg-panel-raised border border-line flex items-center justify-between">
                  <span className="text-muted capitalize">
                    {cat.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-mono font-bold text-emeraldLive">{val} ★</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top rated dishes */}
          <div>
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2 font-mono">
              Most Praised Dishes
            </h3>
            <div className="space-y-1.5">
              {venue.topDishes.map((dish) => (
                <div
                  key={dish.name}
                  className="p-2 rounded border border-line bg-panel-raised flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Utensils size={13} className="text-emeraldLive" />
                    <span className="text-ink font-medium">{dish.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-quiet">{dish.mentions} mentions</span>
                    <span className="font-mono font-bold text-emeraldLive">{dish.rating} ★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-line bg-sidebar flex items-center gap-3">
          <button
            onClick={() => onToggleSave(venue._id)}
            className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              isSaved
                ? "border-emeraldLive text-emeraldLive bg-emeraldStrong/10"
                : "border-line text-muted hover:text-ink hover:bg-panel"
            }`}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
            <span>{isSaved ? "Place Saved" : "Save Place"}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenReviewModal();
            }}
            className="flex-1 py-2.5 rounded-lg bg-[#c92323] hover:bg-[#b01e1e] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <MessageSquarePlus size={15} />
            <span>Rate Your Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

