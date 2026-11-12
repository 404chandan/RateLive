import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { RateLiveLogo } from "../components/common/RateLiveLogo";
import { useAuth } from "../context/AuthContext";
import { fetchApi } from "../services/api";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("owner@ratelive.io");
  const [password, setPassword] = useState("owner123");
  const [displayName, setDisplayName] = useState("Ananya Sharma");
  const [role, setRole] = useState<"CUSTOMER" | "OWNER">("OWNER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? { email, password, displayName, role, businessName: `${displayName}'s Group` }
        : { email, password };

      const res: any = await fetchApi(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        login(res.token, res.user);
        if (res.user.role === "OWNER") {
          navigate("/business");
        } else {
          navigate("/explore");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoRole: "OWNER" | "CUSTOMER") => {
    if (demoRole === "OWNER") {
      setEmail("owner@ratelive.io");
      setPassword("owner123");
      setIsRegister(false);
    } else {
      setEmail("customer@ratelive.io");
      setPassword("customer123");
      setIsRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <RateLiveLogo size="lg" showTagline />
          </div>
          <h1 className="text-xl font-bold font-display text-ink mt-3">
            {isRegister ? "Create RateLive Account" : "Sign in to RateLive"}
          </h1>
          <p className="text-xs text-muted">
            {isRegister
              ? "Join the dual-sided dining intelligence ecosystem."
              : "Enter your verified credentials to access your portal."}
          </p>
        </div>

        {/* Demo Fast Login Switcher */}
        <div className="p-3 rounded-lg border border-line bg-panel space-y-2 text-xs">
          <div className="font-mono text-[10px] text-emeraldLive uppercase font-semibold">
            One-Click Demo Profiles:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("OWNER")}
              className="py-1.5 px-2 rounded bg-panel-raised border border-line hover:border-[#c92323] text-ink font-medium text-[11px] transition-colors"
            >
              Restaurant Owner Demo
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("CUSTOMER")}
              className="py-1.5 px-2 rounded bg-panel-raised border border-line hover:border-emeraldLive text-ink font-medium text-[11px] transition-colors"
            >
              Verified Diner Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red/10 border border-red/30 text-red text-xs">
            {error}
          </div>
        )}

        {/* Auth Card */}
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-line bg-panel space-y-4 shadow-xl">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-ink">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-quiet" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-md bg-panel-raised border border-line text-xs text-ink focus:outline-none focus:border-emeraldLive"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-ink">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-quiet" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-md bg-panel-raised border border-line text-xs text-ink focus:outline-none focus:border-emeraldLive"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-ink">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-quiet" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-md bg-panel-raised border border-line text-xs text-ink focus:outline-none focus:border-emeraldLive"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-ink">Platform Portal</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`py-2 rounded-md border text-xs font-medium transition-colors ${
                    role === "CUSTOMER"
                      ? "border-emeraldLive bg-emeraldStrong/10 text-emeraldLive"
                      : "border-line text-muted"
                  }`}
                >
                  Diner Explorer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("OWNER")}
                  className={`py-2 rounded-md border text-xs font-medium transition-colors ${
                    role === "OWNER"
                      ? "border-[#c92323] bg-[#c92323]/10 text-[#c92323]"
                      : "border-line text-muted"
                  }`}
                >
                  Restaurant Owner
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-[#c92323] hover:bg-[#b01e1e] text-white text-xs font-bold shadow transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <span>{loading ? "Verifying..." : isRegister ? "Create Account" : "Sign In"}</span>
            <ArrowRight size={14} />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-muted hover:text-ink transition-colors underline"
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "New to RateLive? Create an account"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/explore" className="text-xs text-emeraldLive hover:underline font-mono">
            ← Continue as Guest to Live Discovery
          </Link>
        </div>
      </div>
    </div>
  );
};

