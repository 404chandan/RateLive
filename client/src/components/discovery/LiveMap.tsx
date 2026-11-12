import React, { useState } from "react";
import { Utensils, Coffee, Pizza, Soup, ZoomIn, ZoomOut, MapPin, Eye } from "lucide-react";
import type { Restaurant } from "../../types";

interface LiveMapProps {
  venues: Restaurant[];
  onSelectVenue: (venue: Restaurant) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ venues, onSelectVenue }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredVenue, setHoveredVenue] = useState<Restaurant | null>(null);

  const getPinIcon = (cuisine: string) => {
    switch (cuisine.toLowerCase()) {
      case "coffee":
        return <Coffee size={13} />;
      case "burgers":
        return <Utensils size={13} />;
      case "south indian":
        return <Soup size={13} />;
      default:
        return <Utensils size={13} />;
    }
  };

  return (
    <section className="relative rounded-lg border border-line bg-panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-panel">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-xs text-ink">
            Live around Bengaluru
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emeraldStrong live-pulse" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted">
          <span>{venues.length} VENUES MONITORED</span>
        </div>
      </div>

      {/* Styled Interactive SVG Map Surface */}
      <div className="relative h-64 md:h-72 w-full map-grid-bg overflow-hidden select-none">
        {/* Road networks */}
        <div
          className="absolute h-1 bg-[#47574e] opacity-75 shadow-sm transform -rotate-12 w-[120%] -left-10 top-[55%]"
          style={{ transformOrigin: "left center" }}
        />
        <div
          className="absolute h-1 bg-[#47574e] opacity-75 shadow-sm transform rotate-24 w-[110%] left-2 top-[30%]"
          style={{ transformOrigin: "left center" }}
        />
        <div
          className="absolute h-1 bg-[#47574e] opacity-65 transform rotate-65 w-[90%] left-[25%] top-0"
          style={{ transformOrigin: "left center" }}
        />

        {/* Street & Area Labels */}
        <span className="absolute top-[18%] left-[16%] text-[9px] font-mono text-muted/70 uppercase tracking-widest pointer-events-none">
          Indiranagar
        </span>
        <span className="absolute top-[22%] left-[58%] text-[9px] font-mono text-muted/70 uppercase tracking-widest pointer-events-none">
          Koramangala
        </span>
        <span className="absolute top-[72%] left-[66%] text-[9px] font-mono text-muted/70 uppercase tracking-widest pointer-events-none">
          HSR Layout
        </span>
        <span className="absolute top-[78%] left-[22%] text-[9px] font-mono text-muted/70 uppercase tracking-widest pointer-events-none">
          Jayanagar
        </span>
        <span className="absolute top-[48%] left-[36%] text-[8px] font-mono text-ink/40 tracking-wider -rotate-12 pointer-events-none">
          100 Feet Road
        </span>

        {/* Live Interactive Venue Pins */}
        {venues.map((venue) => {
          const isSelected = hoveredVenue?._id === venue._id;
          return (
            <div
              key={venue._id}
              style={{
                left: `${venue.coordinates.x}%`,
                top: `${venue.coordinates.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              onMouseEnter={() => setHoveredVenue(venue)}
              onMouseLeave={() => setHoveredVenue(null)}
            >
              <button
                type="button"
                onClick={() => onSelectVenue(venue)}
                className={`relative w-8 h-8 rounded-full border-2 border-white/90 flex items-center justify-center transition-all duration-200 shadow-lg ${
                  venue.metrics.statusTone === "trending"
                    ? "bg-cyanLive text-[#112320] border-cyan-100 hover:scale-110"
                    : venue.metrics.statusTone === "mixed"
                    ? "bg-amber text-[#261f12] border-amber-100 hover:scale-110"
                    : "bg-emeraldStrong text-[#0f2415] border-emerald-100 hover:scale-110"
                }`}
                aria-label={`View ${venue.name} live details`}
              >
                {getPinIcon(venue.cuisine)}
                {venue.metrics.statusTone === "trending" && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-black animate-ping" />
                )}
              </button>

              {/* Hover Tooltip */}
              {isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2 bg-[#121915]/95 border border-[#52675a] rounded-md shadow-xl text-ink text-left pointer-events-none z-30">
                  <div className="font-semibold text-xs truncate">{venue.name}</div>
                  <div className="text-[10px] text-muted truncate">
                    {venue.address} · {venue.neighborhood}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-emeraldLive">
                    <span>{venue.metrics.overallRating.toFixed(1)} ★</span>
                    <span className="text-muted">
                      {venue.metrics.recentVisits3h} visits in 3h
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-3 right-3 flex flex-col bg-panel/90 border border-line rounded overflow-hidden shadow">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
            className="p-1.5 hover:bg-panel-raised text-muted hover:text-ink transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-1.5 hover:bg-panel-raised text-muted hover:text-ink transition-colors border-t border-line"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute left-3 bottom-3 flex items-center gap-3 px-2.5 py-1.5 bg-[#141d18]/90 border border-line rounded text-[10px] font-mono text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emeraldStrong" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyanLive" />
            <span>Trending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber" />
            <span>Mixed</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-[10px] font-mono text-muted bg-panel/50 border-t border-line">
        <span className="flex items-center gap-1.5 text-emeraldLive">
          <MapPin size={12} /> Live Spatial Coordinate Projection
        </span>
        <span>RATE LIVE PROTOTYPE MAP</span>
      </div>
    </section>
  );
};

