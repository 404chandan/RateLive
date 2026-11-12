import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  MapPin,
  Bookmark,
  BarChart3,
  MessageSquareQuote,
  TrendingUp,
  Building2,
  Sliders,
  Moon,
  Sun,
  LogOut,
  LogIn,
  Store,
  Menu,
  X,
  Radio,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RateLiveLogo } from "../common/RateLiveLogo";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  activeNeighborhood: string;
  onSelectNeighborhood: (area: string) => void;
  showSavedOnly: boolean;
  onToggleSavedOnly: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNeighborhood,
  onSelectNeighborhood,
  showSavedOnly,
  onToggleSavedOnly,
}) => {
  const { user, logout, savedVenueIds, theme, toggleTheme } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"diner" | "business">("diner");

  const neighborhoods = [
    { name: "All areas", count: 142, icon: "📍" },
    { name: "Indiranagar", count: 48, icon: "🍸" },
    { name: "Koramangala", count: 62, icon: "🍔" },
    { name: "HSR Layout", count: 32, icon: "☕" },
  ];

  return (
    <>
      {/* Mobile Top Navigation Glass Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar/85 backdrop-blur-xl border-b border-line z-40 flex items-center justify-between px-4">
        <RateLiveLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-panel border border-line text-muted hover:text-ink transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-panel border border-line text-muted hover:text-ink transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-sidebar/95 backdrop-blur-2xl border-r border-line flex flex-col p-4 z-50 transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="pb-5 pt-1">
          <RateLiveLogo size="md" showTagline />
        </div>

        {/* Dual-Sided Mode Selector Toggle */}
        <div className="relative p-1 bg-panel border border-line rounded-xl mb-5 flex items-center shadow-inner">
          <button
            onClick={() => setActiveTab("diner")}
            className={`relative flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 z-10 ${
              activeTab === "diner"
                ? "text-emerald font-bold"
                : "text-muted hover:text-ink"
            }`}
          >
            <Compass size={14} className={activeTab === "diner" ? "animate-spin-slow" : ""} />
            <span>Diner Mode</span>
            {activeTab === "diner" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-panel-raised border border-line-strong rounded-lg shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("business")}
            className={`relative flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 z-10 ${
              activeTab === "business"
                ? "text-coral font-bold"
                : "text-muted hover:text-ink"
            }`}
          >
            <Store size={14} />
            <span>Business</span>
            {activeTab === "business" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-[#c92323]/15 border border-[#c92323]/40 rounded-lg shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        </div>

        {/* Navigation list with micro-interactions */}
        <nav className="space-y-1">
          {activeTab === "diner" ? (
            <>
              <Link
                to="/explore"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-ink bg-panel/60 hover:bg-panel-raised border border-transparent hover:border-line transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Compass size={15} />
                </div>
                <span>Explore Venues</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald live-pulse-beacon" />
              </Link>

              <Link
                to="/live"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-ink hover:bg-panel-raised border border-transparent hover:border-line transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Radio size={15} className="animate-pulse" />
                </div>
                <span>Live Feed Radar</span>
                <span className="ml-auto font-mono text-[9px] bg-cyan/15 text-cyan px-1.5 py-0.5 rounded font-bold">
                  LIVE
                </span>
              </Link>

              <button
                onClick={() => {
                  onToggleSavedOnly();
                  setMobileOpen(false);
                }}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  showSavedOnly
                    ? "bg-emerald/15 text-emerald border border-emerald/30 font-semibold"
                    : "text-muted hover:text-ink hover:bg-panel-raised border border-transparent hover:border-line"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber/10 text-amber flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bookmark size={15} fill={showSavedOnly ? "currentColor" : "none"} />
                </div>
                <span>Saved Venues</span>
                {savedVenueIds.length > 0 && (
                  <span className="ml-auto font-mono text-[10px] bg-panel-raised border border-line px-1.5 py-0.5 rounded text-ink font-semibold">
                    {savedVenueIds.length}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/business"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-ink bg-panel/60 hover:bg-panel-raised border border-transparent hover:border-line transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-coral/10 text-coral flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 size={15} />
                </div>
                <span>Operations Desk</span>
              </Link>

              <Link
                to="/business/reviews"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-ink hover:bg-panel-raised border border-transparent hover:border-line transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquareQuote size={15} />
                </div>
                <span>Anonymous Inbox</span>
                <span className="ml-auto font-mono text-[9px] bg-emerald/15 text-emerald px-1.5 py-0.5 rounded font-bold">
                  ZERO-PII
                </span>
              </Link>

              <Link
                to="/business/sentiment"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-ink hover:bg-panel-raised border border-transparent hover:border-line transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp size={15} />
                </div>
                <span>AI Sentiment Radar</span>
              </Link>

              <Link
                to="/business/competitors"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-ink hover:bg-panel-raised border border-transparent hover:border-line transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-amber/10 text-amber flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sliders size={15} />
                </div>
                <span>Peer Benchmarks</span>
              </Link>
            </>
          )}
        </nav>

        {/* Dynamic Neighborhood Filter with micro visual tags */}
        {activeTab === "diner" && (
          <div className="mt-6 pt-4 border-t border-line/80">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-quiet font-semibold">
                Bengaluru Hubs
              </span>
              <MapPin size={12} className="text-quiet" />
            </div>

            <div className="space-y-1">
              {neighborhoods.map((nh) => {
                const isSelected = activeNeighborhood === nh.name;
                return (
                  <button
                    key={nh.name}
                    onClick={() => {
                      onSelectNeighborhood(nh.name);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                      isSelected
                        ? "bg-panel border border-emerald/40 text-ink font-semibold shadow-sm"
                        : "text-muted hover:text-ink hover:bg-panel/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{nh.icon}</span>
                      <span>{nh.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-quiet bg-panel-raised px-1.5 py-0.5 rounded">
                      {nh.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Ambient Real-time Telemetry Pill */}
        <div className="mt-auto pt-4 border-t border-line space-y-3">
          <div className="p-3 rounded-xl border border-line bg-panel/70 backdrop-blur-md relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-emerald uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald live-pulse-beacon" />
                Live Node 24.1
              </span>
              <Zap size={13} className="text-amber group-hover:scale-125 transition-transform" />
            </div>
            <p className="mt-1 text-[10px] text-muted leading-relaxed">
              Real-time telemetry stream synchronized via WebSocket.
            </p>
          </div>

          {/* User profile & session controls */}
          <div className="flex items-center justify-between px-1 pt-1">
            {user ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald/20 to-cyan/20 border border-emerald/40 flex items-center justify-center font-mono text-xs text-emerald font-bold">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate text-xs">
                  <div className="font-semibold text-ink truncate">{user.displayName}</div>
                  <div className="text-[10px] font-mono text-quiet">{user.role}</div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center gap-2 text-xs text-emerald hover:underline font-semibold"
              >
                <LogIn size={15} />
                <span>Sign in Demo</span>
              </Link>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                title="Toggle visual mode"
                className="p-2 rounded-lg hover:bg-panel text-muted hover:text-ink transition-colors"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              {user && (
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-lg hover:bg-panel text-muted hover:text-coral transition-colors"
                >
                  <LogOut size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
