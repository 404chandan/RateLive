import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export const RateLiveLogo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showTagline = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <Link to="/" className={`flex items-center gap-3 group select-none ${className}`}>
      <div className={`relative rounded-full overflow-hidden border border-[#c92323]/40 shadow-md shadow-[#c92323]/20 bg-white p-0.5 transition-transform duration-200 group-hover:scale-105 ${sizeClasses[size]}`}>
        <img
          src="/ratelive-logo.jpg"
          alt="RateLive Official Brand Logo"
          className="w-full h-full object-contain rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-extrabold font-display tracking-tight text-ink text-base md:text-lg">
            Rate<span className="text-[#c92323]">Live</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emeraldStrong live-pulse ml-0.5" />
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono tracking-wider text-muted uppercase">
            Real Experiences · Live Insights
          </span>
        )}
      </div>
    </Link>
  );
};

