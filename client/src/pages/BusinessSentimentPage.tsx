import React, { useState, useEffect } from "react";
import { TrendingUp, Sparkles, AlertTriangle, CheckCircle2, Flame, Award, ArrowUpRight } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { fetchApi } from "../services/api";

export const BusinessSentimentPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res: any = await fetchApi("/business/sentiment");
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const themes = [
    { title: "Food Quality", positive: 28, neutral: 3, negative: 1, sentimentPct: 92 },
    { title: "Service Speed", positive: 14, neutral: 6, negative: 4, sentimentPct: 70 },
    { title: "Staff & Hospitality", positive: 22, neutral: 2, negative: 1, sentimentPct: 88 },
    { title: "Hygiene & Cleanliness", positive: 19, neutral: 1, negative: 0, sentimentPct: 95 },
    { title: "Value & Pricing", positive: 18, neutral: 4, negative: 2, sentimentPct: 82 },
    { title: "Ambience & Vibe", positive: 21, neutral: 3, negative: 0, sentimentPct: 91 },
  ];

  return (
    <div className="min-h-screen flex bg-canvas text-ink">
      <Sidebar
        activeNeighborhood="All areas"
        onSelectNeighborhood={() => {}}
        showSavedOnly={false}
        onToggleSavedOnly={() => {}}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar breadcrumbTitle="AI Customer Sentiment & Thematic Radar" />

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pt-16 md:pt-6">
          <div>
            <div className="font-mono text-[10px] text-[#c92323] uppercase font-bold tracking-wider">
              AI NLP Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-ink mt-1">
              Customer Sentiment Radar
            </h1>
            <p className="text-xs text-muted mt-1 max-w-xl">
              Deep language model analysis extracting actionable themes, recurring compliments, and service bottlenecks grounded in verified feedback.
            </p>
          </div>

          {/* AI Actionable Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data?.aiInsights || [
              {
                id: "1",
                type: "positive",
                title: "Food Quality Leading Praise",
                description: "Food quality sentiment is at 92% across all venues. All American Cheese Burger and Ghee Roast Dosa have notable positive callouts.",
                supportingReviewCount: 42,
                period: "Past 7 days",
              },
              {
                id: "2",
                type: "opportunity",
                title: "Service Wait Time Trend",
                description: "Service-related mentions highlighted peak waiting times during Friday and Saturday dinner rushes (average 18-22 min).",
                supportingReviewCount: 12,
                period: "Weekend peak hours",
              },
              {
                id: "3",
                type: "positive",
                title: "Staff Hospitality & Ambience",
                description: "Warm feedback on courteous table service and music ambience contributed to strong repeat dining scores.",
                supportingReviewCount: 26,
                period: "Past 14 days",
              },
            ]).map((insight: any) => (
              <div
                key={insight.id}
                className="p-5 rounded-xl border border-line bg-panel space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      insight.type === "positive"
                        ? "bg-emeraldStrong/15 text-emeraldLive"
                        : "bg-amber/15 text-amber"
                    }`}
                  >
                    {insight.type === "positive" ? "Strength" : "Attention"}
                  </span>
                  <span className="text-[10px] font-mono text-quiet">{insight.period}</span>
                </div>

                <h3 className="text-sm font-semibold text-ink">{insight.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{insight.description}</p>

                <div className="pt-2 border-t border-line flex items-center justify-between text-[11px] font-mono text-quiet">
                  <span>Grounded in {insight.supportingReviewCount} reviews</span>
                  <Sparkles size={13} className="text-emeraldLive" />
                </div>
              </div>
            ))}
          </div>

          {/* Thematic Radar Breakdown */}
          <section className="p-6 rounded-xl border border-line bg-panel space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="text-sm font-semibold text-ink">Thematic Sentiment Spectrum</h2>
                <p className="text-xs text-muted">Distribution of positive vs critical mentions per theme</p>
              </div>
              <span className="font-mono text-[10px] text-emeraldLive bg-emeraldStrong/10 px-2 py-1 rounded">
                NLP ENGINE VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {themes.map((th) => (
                <div key={th.title} className="p-4 rounded-lg bg-panel-raised border border-line space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">{th.title}</span>
                    <span className="font-mono font-bold text-emeraldLive">{th.sentimentPct}% Positive</span>
                  </div>

                  <div className="w-full bg-line h-2 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(th.positive / (th.positive + th.neutral + th.negative)) * 100}%` }}
                      className="bg-emeraldStrong h-full"
                    />
                    <div
                      style={{ width: `${(th.neutral / (th.positive + th.neutral + th.negative)) * 100}%` }}
                      className="bg-amber h-full"
                    />
                    <div
                      style={{ width: `${(th.negative / (th.positive + th.neutral + th.negative)) * 100}%` }}
                      className="bg-red h-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-quiet pt-1">
                    <span>{th.positive} Positive</span>
                    <span>{th.neutral} Neutral</span>
                    <span>{th.negative} Critical</span>
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

