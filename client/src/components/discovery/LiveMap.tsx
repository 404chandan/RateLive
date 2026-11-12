import React, { useState } from "react";
import { Utensils, Coffee, Soup, ZoomIn, ZoomOut, MapPin, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      case "south indian":
        return <Soup size={13} />;
      default:
        return <Utensils size={13} />;
    }
  };

  return (
    <section className="relative rounded-2xl border border-line bg-panel/80 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header telemetry status */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-sidebar/80">
        <div className="flex items-center gap-2.5">
          <span className="font-display font-bold text-xs tracking-tight text-ink">
            Live Geospatial Radar · Bengaluru Hub
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald live-pulse-beacon" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted">
          <span className="px-2 py-0.5 rounded bg-panel border border-line font-bold text-emerald">
            {venues.length} SATELLITE NODES
          </span>
        </div>
      </div>

      {/* Styled Interactive Coordinate Grid */}
      <div className="relative h-72 md:h-80 w-full overflow-hidden select-none bg-[#0b100d]">
        {/* Animated Radial Radar Scan Line */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,224,128,0.06)_0%,transparent_70%)] pointer-events-none" />

        {/* Precision Grid Coordinates Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-emerald/10 [stroke-dasharray:4_4] pointer-events-none">
          <line x1="0" y1="25%" x2="100%" y2="25%" />
          <line x1="0" y1="50%" x2="100%" y2="50%" />
          <line x1="0" y1="75%" x2="100%" y2="75%" />
          <line x1="25%" y1="0" x2="25%" y2="100%" />
          <line x1="50%" y1="0" x2="50%" y2="100%" />
          <line x1="75%" y1="0" x2="75%" y2="100%" />
        </svg>

        {/* Ambient road paths */}
        <div
          className="absolute h-1.5 bg-[#25392e] shadow-sm transform -rotate-12 w-[120%] -left-10 top-[55%]"
          style={{ transformOrigin: "left center" }}
        />
        <div
          className="absolute h-1.5 bg-[#25392e] shadow-sm transform rotate-24 w-[110%] left-2 top-[30%]"
          style={{ transformOrigin: "left center" }}
        />
        <div
          className="absolute h-1 bg-[#25392e] transform rotate-65 w-[90%] left-[25%] top-0"
          style={{ transformOrigin: "left center" }}
        />

        {/* Street & Area Overlays */}
        <span className="absolute top-[18%] left-[16%] text-[10px] font-mono text-emerald/60 uppercase tracking-widest font-bold pointer-events-none">
          Indiranagar
        </span>
        <span className="absolute top-[22%] left-[58%] text-[10px] font-mono text-cyan/60 uppercase tracking-widest font-bold pointer-events-none">
          Koramangala
        </span>
        <span className="absolute top-[72%] left-[66%] text-[10px] font-mono text-amber/60 uppercase tracking-widest font-bold pointer-events-none">
          HSR Layout
        </span>
        <span className="absolute top-[78%] left-[22%] text-[10px] font-mono text-muted/60 uppercase tracking-widest font-bold pointer-events-none">
          Jayanagar
        </span>

        {/* Interactive Pulsing Venue Markers */}
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
                className={`relative w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-xl ${
                  venue.metrics.statusTone === "trending"
                    ? "bg-cyan text-black border-cyan/60 hover:scale-125 shadow-cyan/30"
                    : venue.metrics.statusTone === "mixed"
                    ? "bg-amber text-black border-amber/60 hover:scale-125 shadow-amber/30"
                    : "bg-emerald text-black border-emerald/60 hover:scale-125 shadow-emerald/30"
                }`}
                aria-label={`View ${venue.name} live details`}
              >
                {getPinIcon(venue.cuisine)}
                {venue.metrics.trendDelta > 0.1 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-coral border-2 border-black animate-ping" />
                )}
              </button>

              {/* Floating Holographic Tooltip */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 p-3 bg-panel/95 backdrop-blur-xl border border-emerald/40 rounded-xl shadow-2xl text-ink text-left pointer-events-none z-30"
                  >
                    <div className="font-bold text-xs text-ink truncate">{venue.name}</div>
                    <div className="text-[10px] text-muted truncate mt-0.5">
                      {venue.address} · {venue.neighborhood}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-line font-mono text-[11px] text-emerald">
                      <span className="font-bold">{venue.metrics.overallRating.toFixed(1)} ★</span>
                      <span className="text-muted font-normal">
                        {venue.metrics.recentVisits3h} visits · 3h
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Precision Legend */}
        <div className="absolute left-4 bottom-4 flex items-center gap-3 px-3 py-1.5 bg-sidebar/90 backdrop-blur-md border border-line rounded-lg text-[10px] font-mono text-muted shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald live-pulse-beacon" />
            <span className="font-medium text-ink">Active Peak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan" />
            <span>High Recency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber" />
            <span>Mixed Trend</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col bg-sidebar/90 backdrop-blur-md border border-line rounded-lg overflow-hidden shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
            className="p-2 hover:bg-panel text-muted hover:text-ink transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-2 hover:bg-panel text-muted hover:text-ink transition-colors border-t border-line"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-2.5 text-[10px] font-mono text-muted bg-sidebar/60 border-t border-line">
        <span className="flex items-center gap-1.5 text-emerald font-semibold">
          <MapPin size={12} /> High-fidelity Spatial Coordinate Tracking
        </span>
        <span className="text-quiet">RATE LIVE GEO ENGINE</span>
      </div>
    </section>
  );
};
