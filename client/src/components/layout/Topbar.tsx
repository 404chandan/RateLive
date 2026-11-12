import React from "react";
import { Link } from "react-router-dom";
import { Bell, Flame, ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
  breadcrumbTitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ breadcrumbTitle = "Discover" }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-6 md:px-8 border-b border-line bg-sidebar/50 backdrop-blur-md flex items-center justify-between z-30">
      <div className="flex items-center gap-2 text-xs text-muted font-sans">
        <span className="text-muted">Bengaluru</span>
        <span className="text-quiet">/</span>
        <strong className="text-ink font-semibold">{breadcrumbTitle}</strong>
      </div>

      <nav className="hidden lg:flex items-center gap-6 text-xs text-muted">
        <a href="#features" className="hover:text-emeraldLive transition-colors">
          Features
        </a>
        <a href="#radar" className="hover:text-emeraldLive transition-colors">
          Dish Radar
        </a>
        <a href="#pricing" className="hover:text-emeraldLive transition-colors">
          Pricing
        </a>
        <a href="#about" className="hover:text-emeraldLive transition-colors">
          About Us
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-line bg-panel text-[11px] font-mono text-amber">
          <span className="w-1.5 h-1.5 rounded-full bg-amber live-pulse" />
          <span>PILOT · BENGALURU</span>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-mono text-quiet">
              {user.email}
            </span>
            <div className="w-7 h-7 rounded-full bg-emeraldStrong/20 border border-emeraldLive/40 text-emeraldLive flex items-center justify-center font-mono text-xs font-bold">
              {user.displayName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        ) : (
          <Link
            to="/auth/login"
            className="px-3 py-1.5 rounded-md bg-[#c92323] hover:bg-[#b01e1e] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

