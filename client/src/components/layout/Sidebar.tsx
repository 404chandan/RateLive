import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Compass,
  MapPin,
  Bookmark,
  Bell,
  Sliders,
  BarChart3,
  MessageSquareQuote,
  TrendingUp,
  Building2,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  LogIn,
  Store,
  Menu,
  X,
} from "lucide-react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, savedVenueIds, theme, toggleTheme } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isBusinessRoute = location.pathname.startsWith("/business");
  const isAdminRoute = location.pathname.startsWith("/admin");

  const neighborhoods = [
    { name: "All areas", count: 142 },
    { name: "Indiranagar", count: 48 },
    { name: "Koramangala", count: 62 },
    { name: "HSR Layout", count: 32 },
  ];

  return (
    <>
      {/* Mobile top trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-line z-40 flex items-center justify-between px-4">
        <RateLiveLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded text-muted hover:text-ink"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded text-muted hover:text-ink"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-60 bg-sidebar border-r border-line flex flex-col p-4 z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="pb-4">
          <RateLiveLogo size="md" showTagline />
        </div>

        {/* View Switcher: Customer vs Business Platform */}
        <div className="flex items-center p-1 bg-panel border border-line rounded-lg mb-4 text-xs font-medium">
          <button
            onClick={() => {
              navigate("/explore");
              setMobileOpen(false);
            }}
            className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1.5 transition-all ${
              !isBusinessRoute && !isAdminRoute
                ? "bg-emeraldStrong/15 text-emeraldLive font-semibold shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <Compass size={14} />
            <span>Diner</span>
          </button>
          <button
            onClick={() => {
              navigate("/business");
              setMobileOpen(false);
            }}
            className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1.5 transition-all ${
              isBusinessRoute
                ? "bg-[#c92323]/20 text-[#c92323] font-semibold shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <Store size={14} />
            <span>Business</span>
          </button>
        </div>

        {/* Navigation Links */}
        {!isBusinessRoute ? (
          <nav className="space-y-1">
            <Link
              to="/explore"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === "/explore" || location.pathname === "/"
                  ? "bg-emeraldStrong/15 text-emeraldLive font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <Compass size={16} />
              <span>Explore Venues</span>
            </Link>

            <Link
              to="/live"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === "/live"
                  ? "bg-emeraldStrong/15 text-emeraldLive font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emeraldStrong opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emeraldStrong"></span>
              </span>
              <span>Live Intelligence</span>
            </Link>

            <button
              onClick={() => {
                onToggleSavedOnly();
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                showSavedOnly
                  ? "bg-emeraldStrong/15 text-emeraldLive font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <Bookmark size={16} />
              <span>Saved Places</span>
              {savedVenueIds.length > 0 && (
                <span className="ml-auto font-mono text-[10px] bg-line px-1.5 py-0.5 rounded text-muted">
                  {savedVenueIds.length}
                </span>
              )}
            </button>
          </nav>
        ) : (
          <nav className="space-y-1">
            <Link
              to="/business"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === "/business"
                  ? "bg-[#c92323]/20 text-[#c92323] font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <BarChart3 size={16} />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              to="/business/reviews"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === "/business/reviews"
                  ? "bg-[#c92323]/20 text-[#c92323] font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <MessageSquareQuote size={16} />
              <span>Anonymous Inbox</span>
            </Link>

            <Link
              to="/business/sentiment"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === "/business/sentiment"
                  ? "bg-[#c92323]/20 text-[#c92323] font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <TrendingUp size={16} />
              <span>AI Sentiment & Radar</span>
            </Link>

            <Link
              to="/business/locations"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === "/business/locations"
                  ? "bg-[#c92323]/20 text-[#c92323] font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <Building2 size={16} />
              <span>Branch Management</span>
            </Link>

            <Link
              to="/business/competitors"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === "/business/competitors"
                  ? "bg-[#c92323]/20 text-[#c92323] font-semibold"
                  : "text-muted hover:text-ink hover:bg-panel"
              }`}
            >
              <Sliders size={16} />
              <span>Competitor Benchmarks</span>
            </Link>
          </nav>
        )}

        {/* Neighborhood Filter (Customer view) */}
        {!isBusinessRoute && (
          <div className="mt-6 pt-4 border-t border-line">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-quiet">
                Bengaluru Areas
              </span>
              <MapPin size={12} className="text-quiet" />
            </div>
            <div className="space-y-0.5">
              {neighborhoods.map((nh) => (
                <button
                  key={nh.name}
                  onClick={() => {
                    onSelectNeighborhood(nh.name);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-left transition-colors ${
                    activeNeighborhood === nh.name
                      ? "bg-panel text-ink font-medium"
                      : "text-muted hover:text-ink hover:bg-panel/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeNeighborhood === nh.name
                          ? "bg-emeraldStrong shadow-[0_0_8px_rgba(103,199,124,0.6)]"
                          : "bg-quiet"
                      }`}
                    />
                    <span>{nh.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-quiet">{nh.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Account & Status */}
        <div className="mt-auto pt-4 border-t border-line space-y-3">
          <div className="p-2.5 rounded-lg border border-line bg-panel text-[11px] leading-relaxed text-muted">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-emeraldLive uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emeraldStrong live-pulse" />
              Live Socket Active
            </div>
            <p className="mt-1 text-[10px]">Anonymous zero-PII layer protected with HMAC hashing.</p>
          </div>

          <div className="flex items-center justify-between px-1">
            {user ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-panel-raised border border-line flex items-center justify-center font-mono text-xs text-emeraldLive font-semibold">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate text-xs">
                  <div className="font-medium text-ink truncate">{user.displayName}</div>
                  <div className="text-[10px] font-mono text-quiet">{user.role}</div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center gap-1.5 text-xs text-muted hover:text-ink font-medium"
              >
                <LogIn size={15} />
                <span>Sign in / Demo</span>
              </Link>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-1.5 rounded-md hover:bg-panel text-muted hover:text-ink transition-colors"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              {user && (
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-md hover:bg-panel text-muted hover:text-red transition-colors"
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
