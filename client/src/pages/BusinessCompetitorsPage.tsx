import React, { useState, useEffect } from "react";
import { Sliders, TrendingUp, ShieldCheck, Star, Award, Building2 } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { fetchApi } from "../services/api";

export const BusinessCompetitorsPage: React.FC = () => {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res: any = await fetchApi("/business/competitors");
        if (res.success) {
          setCompetitors(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
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
        <Topbar breadcrumbTitle="Competitor Intelligence & Benchmarks" />

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pt-16 md:pt-6">
          <div>
            <div className="font-mono text-[10px] text-[#c92323] uppercase font-bold tracking-wider">
              Market Benchmarking
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-ink mt-1">
              Public Competitor Benchmarks
            </h1>
            <p className="text-xs text-muted mt-1 max-w-xl">
              Compare your restaurant's live ratings, category performance, and verified visit velocity against citywide public peer venues.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-line bg-panel-raised flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={16} className="text-emeraldLive flex-shrink-0" />
            <span>
              <strong>Confidentiality Guarantee:</strong> Only public aggregate ratings are compared. Private customer feedback and internal notes of peer restaurants are strictly inaccessible.
            </span>
          </div>

          {/* Benchmark Table */}
          <div className="rounded-xl border border-line bg-panel overflow-hidden">
            <div className="p-4 border-b border-line bg-sidebar flex items-center justify-between">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                Bengaluru Dining Peer Comparison
              </span>
              <span className="font-mono text-[10px] text-muted">
                {competitors.length} MONITORED PEERS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-panel-raised text-[10px] font-mono text-quiet uppercase">
                    <th className="p-3.5">Venue Name</th>
                    <th className="p-3.5">Neighborhood</th>
                    <th className="p-3.5">Cuisine</th>
                    <th className="p-3.5">Overall Rating</th>
                    <th className="p-3.5">Visits (3h)</th>
                    <th className="p-3.5">Food Quality</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Sentiment Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {competitors.map((c, index) => {
                    const isOwnGroup = c.name === "Truffles";
                    return (
                      <tr
                        key={c._id || index}
                        className={`transition-colors ${
                          isOwnGroup
                            ? "bg-[#c92323]/10 font-medium"
                            : "hover:bg-panel-raised/50"
                        }`}
                      >
                        <td className="p-3.5 flex items-center gap-2">
                          <span className="text-ink font-semibold">{c.name}</span>
                          {isOwnGroup && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#c92323] text-white font-bold">
                              YOU
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-muted">{c.neighborhood}</td>
                        <td className="p-3.5 text-muted">{c.cuisine}</td>
                        <td className="p-3.5 font-mono font-bold text-emeraldLive">
                          {c.metrics?.overallRating?.toFixed(1) || 4.5} ★
                        </td>
                        <td className="p-3.5 font-mono text-ink">
                          {c.metrics?.recentVisits3h || 18}
                        </td>
                        <td className="p-3.5 font-mono text-emeraldLive">
                          {c.metrics?.categoryAverages?.foodQuality || 4.8}★
                        </td>
                        <td className="p-3.5 font-mono text-emeraldLive">
                          {c.metrics?.categoryAverages?.service || 4.4}★
                        </td>
                        <td className="p-3.5 font-mono text-emeraldLive">
                          {c.metrics?.sentimentBreakdown?.positive || 88}% pos
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

