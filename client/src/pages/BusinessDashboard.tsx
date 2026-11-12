import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  MessageSquareQuote,
  Star,
  Users,
  Building2,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { fetchApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  const trendData = [
    { day: "Mon", rating: 4.5, visits: 24 },
    { day: "Tue", rating: 4.6, visits: 29 },
    { day: "Wed", rating: 4.6, visits: 31 },
    { day: "Thu", rating: 4.7, visits: 38 },
    { day: "Fri", rating: 4.8, visits: 62 },
    { day: "Sat", rating: 4.9, visits: 85 },
    { day: "Sun", rating: 4.7, visits: 72 },
  ];

  const categoryPerformance = [
    { name: "Food Quality", score: 4.8 },
    { name: "Cleanliness", score: 4.7 },
    { name: "Staff Hospitality", score: 4.6 },
    { name: "Ambience", score: 4.5 },
    { name: "Service Speed", score: 4.3 },
    { name: "Value for Money", score: 4.6 },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const res: any = await fetchApi("/business/dashboard");
        if (res.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error("Failed to load business dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex bg-canvas text-ink">
      <Sidebar
        activeNeighborhood="All areas"
        onSelectNeighborhood={() => {}}
        showSavedOnly={false}
        onToggleSavedOnly={() => {}}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar breadcrumbTitle="Restaurant Intelligence Dashboard" />

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pt-16 md:pt-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#c92323] uppercase font-bold tracking-wider">
                <Building2 size={13} />
                Apex Dining Group · Multi-Unit Intelligence
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-ink mt-1">
                Executive Operations Dashboard
              </h1>
              <p className="text-xs text-muted mt-1 max-w-xl">
                Real-time diner sentiment, anonymous review telemetry, and category benchmarks across all dining branches.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/business/reviews"
                className="px-3.5 py-2 rounded-lg bg-[#c92323] hover:bg-[#b01e1e] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
              >
                <MessageSquareQuote size={15} />
                <span>Open Anonymous Inbox</span>
              </Link>
            </div>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="p-3.5 rounded-lg border border-line bg-panel-raised flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emeraldLive flex-shrink-0" />
              <span>
                <strong>Zero-PII Compliance Enforced:</strong> All diner identities, emails, and phone numbers are cryptographically isolated and never displayed in business portals.
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-[10px] text-emeraldLive bg-emeraldStrong/10 px-2 py-0.5 rounded border border-emeraldLive/20">
              HMAC SECURE
            </span>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-line bg-panel space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Average Live Rating</span>
                <Star size={16} className="text-amber" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-extrabold text-ink">
                  {dashboardData?.kpi.averageRating || 4.7}
                </span>
                <span className="text-emeraldLive font-mono text-xs">+0.2 vs last week</span>
              </div>
              <div className="w-full bg-line h-1 rounded-full overflow-hidden">
                <div className="bg-emeraldStrong h-full w-[94%]" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-line bg-panel space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Total Verified Feedback</span>
                <MessageSquareQuote size={16} className="text-emeraldLive" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-extrabold text-ink">
                  {dashboardData?.kpi.totalReviews || 42}
                </span>
                <span className="text-emeraldLive font-mono text-xs">+18 today</span>
              </div>
              <p className="text-[10px] text-quiet">Verified dining visits</p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-panel space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Positive Sentiment</span>
                <TrendingUp size={16} className="text-emeraldLive" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-extrabold text-emeraldLive">
                  {dashboardData?.kpi.sentiment.positive || 88}%
                </span>
                <span className="text-muted font-mono text-xs">
                  {dashboardData?.kpi.sentiment.negative || 4}% neg
                </span>
              </div>
              <p className="text-[10px] text-quiet">AI theme classification</p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-panel space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Customer Satisfaction (CSAT)</span>
                <Sparkles size={16} className="text-cyanLive" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-extrabold text-ink">
                  {dashboardData?.kpi.customerSatisfactionScore || 94} / 100
                </span>
                <span className="text-emeraldLive font-mono text-xs">High index</span>
              </div>
              <p className="text-[10px] text-quiet">Grounded in verified ratings</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Trend Chart */}
            <div className="lg:col-span-8 p-5 rounded-xl border border-line bg-panel space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-ink">Rating Trend & Visit Volume</h2>
                  <p className="text-xs text-muted">Weekly dynamic telemetry</p>
                </div>
                <div className="flex items-center gap-1 bg-panel-raised p-1 rounded-lg border border-line text-xs font-mono">
                  {(["today", "7d", "30d"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedTimeRange(r)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        selectedTimeRange === r
                          ? "bg-[#c92323] text-white font-bold"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#67c77c" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#67c77c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      stroke="#6f8075"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[3.5, 5]}
                      stroke="#6f8075"
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18211d",
                        borderColor: "#2a3931",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rating"
                      stroke="#67c77c"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#ratingGrad)"
                      name="Rating"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Performance Matrix */}
            <div className="lg:col-span-4 p-5 rounded-xl border border-line bg-panel space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-ink">Category Radar</h2>
                <p className="text-xs text-muted">Multi-attribute customer score</p>
              </div>

              <div className="space-y-3 pt-2">
                {categoryPerformance.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">{cat.name}</span>
                      <span className="font-mono font-bold text-emeraldLive">
                        {cat.score} ★
                      </span>
                    </div>
                    <div className="w-full bg-line h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emeraldStrong h-full rounded-full transition-all"
                        style={{ width: `${(cat.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Branch Comparison */}
          <section className="rounded-xl border border-line bg-panel overflow-hidden">
            <div className="p-4 border-b border-line bg-sidebar flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                  Managed Restaurant Locations
                </h2>
                <p className="text-[11px] text-muted">Comparative multi-branch health</p>
              </div>

              <Link
                to="/business/locations"
                className="text-xs text-emeraldLive hover:underline flex items-center gap-1 font-mono"
              >
                Manage branches <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-line">
              {(dashboardData?.branches || [
                {
                  _id: "1",
                  branchName: "Indiranagar Flagship",
                  neighborhood: "Indiranagar",
                  overallRating: 4.7,
                  reviewCount: 28,
                  positiveSentimentPct: 90,
                },
                {
                  _id: "2",
                  branchName: "Koramangala 5th Block",
                  neighborhood: "Koramangala",
                  overallRating: 4.6,
                  reviewCount: 14,
                  positiveSentimentPct: 86,
                },
              ]).map((branch: any) => (
                <div
                  key={branch._id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-panel-raised/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-xs text-ink">{branch.branchName}</div>
                    <div className="text-[11px] text-muted">{branch.neighborhood}</div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emeraldLive">
                        {branch.overallRating.toFixed(1)} ★
                      </div>
                      <div className="text-[10px] text-quiet">
                        {branch.reviewCount} visits
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emeraldLive">
                        {branch.positiveSentimentPct}%
                      </div>
                      <div className="text-[10px] text-quiet">Positive sentiment</div>
                    </div>

                    <Link
                      to="/business/reviews"
                      className="px-3 py-1.5 rounded bg-panel border border-line hover:border-emeraldLive text-xs text-ink transition-colors"
                    >
                      View Inbox
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

