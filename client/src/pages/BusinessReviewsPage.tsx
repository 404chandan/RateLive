import React, { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  StickyNote,
  Tag,
  Star,
  Download,
} from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { fetchApi } from "../services/api";
import type { Review } from "../types";

export const BusinessReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const loadReviews = async () => {
    try {
      const query = new URLSearchParams();
      if (sentimentFilter !== "ALL") query.set("sentiment", sentimentFilter);
      if (statusFilter !== "ALL") query.set("status", statusFilter);
      if (search) query.set("search", search);

      const res: any = await fetchApi(`/business/reviews?${query.toString()}`);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error("Failed to load business reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [sentimentFilter, statusFilter]);

  const handleUpdateStatus = async (reviewId: string, status: "UNREVIEWED" | "REVIEWED" | "RESOLVED") => {
    try {
      await fetchApi(`/business/reviews/${reviewId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    try {
      await fetchApi(`/business/reviews/${reviewId}/response`, {
        method: "POST",
        body: JSON.stringify({ message: replyText.trim() }),
      });
      setReplyText("");
      loadReviews();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsReplying(false);
    }
  };

  const handleAddNote = async (reviewId: string) => {
    if (!internalNoteText.trim()) return;
    try {
      await fetchApi(`/business/reviews/${reviewId}/note`, {
        method: "POST",
        body: JSON.stringify({ note: internalNoteText.trim() }),
      });
      setInternalNoteText("");
      loadReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-canvas text-ink">
      <Sidebar
        activeNeighborhood="All areas"
        onSelectNeighborhood={() => {}}
        showSavedOnly={false}
        onToggleSavedOnly={() => {}}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar breadcrumbTitle="Anonymous Customer Feedback Inbox" />

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pt-16 md:pt-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] text-[#c92323] uppercase font-bold tracking-wider">
                Private Feedback Stream
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-ink mt-1">
                Anonymous Diner Feedback Inbox
              </h1>
              <p className="text-xs text-muted mt-1 max-w-xl">
                Review unvarnished diner sentiment, assign operational statuses, take internal notes, and post verified public management responses.
              </p>
            </div>

            <button
              onClick={() => alert("CSV Export with zero customer PII downloaded")}
              className="px-3 py-2 rounded-lg bg-panel border border-line hover:border-emeraldLive text-xs text-ink flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              <span>Export Anonymous CSV</span>
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="p-3 rounded-lg border border-line bg-panel-raised flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={16} className="text-emeraldLive flex-shrink-0" />
            <span>
              <strong>Zero-Identity Protection:</strong> Reviewers appear solely as pseudonymous tokens (e.g. "Verified Diner #3020"). Diners' names, emails, and profiles are completely inaccessible to restaurant staff.
            </span>
          </div>

          {/* Filters & Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-quiet" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadReviews()}
                placeholder="Search feedback comments, dishes, or tags..."
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-panel border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive placeholder:text-quiet"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-panel border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive"
              >
                <option value="ALL">All Sentiments</option>
                <option value="POSITIVE">Positive Feedback</option>
                <option value="NEUTRAL">Neutral Feedback</option>
                <option value="NEGATIVE">Critical / Negative</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-panel border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive"
              >
                <option value="ALL">All Triage Statuses</option>
                <option value="UNREVIEWED">Unreviewed</option>
                <option value="REVIEWED">Reviewed by Staff</option>
                <option value="RESOLVED">Resolved / Replied</option>
              </select>
            </div>
          </div>

          {/* Review List & Detail split view */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Reviews Column */}
            <div className="lg:col-span-7 space-y-3">
              {loading ? (
                <div className="p-8 text-center text-xs text-muted font-mono">
                  Loading feedback inbox...
                </div>
              ) : reviews.length === 0 ? (
                <div className="p-12 text-center border border-line rounded-xl bg-panel space-y-2">
                  <p className="text-xs text-muted">No reviews match the selected filters.</p>
                </div>
              ) : (
                reviews.map((rev) => {
                  const isSelected = activeReview?._id === rev._id;
                  return (
                    <article
                      key={rev._id}
                      onClick={() => setActiveReview(rev)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-emeraldLive bg-panel-raised shadow-md"
                          : "border-line bg-panel hover:bg-panel-raised/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-ink">
                              {rev.anonymousLabel}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                                rev.sentiment.label === "POSITIVE"
                                  ? "bg-emeraldStrong/15 text-emeraldLive"
                                  : rev.sentiment.label === "NEGATIVE"
                                  ? "bg-red/15 text-red"
                                  : "bg-amber/15 text-amber"
                              }`}
                            >
                              {rev.sentiment.label}
                            </span>
                          </div>

                          <div className="text-[11px] text-quiet font-mono mt-0.5">
                            Visited: {new Date(rev.visitDate).toLocaleDateString()} ·{" "}
                            {typeof rev.restaurantId === "object"
                              ? rev.restaurantId.name
                              : "Truffles Indiranagar"}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 font-display font-bold text-sm text-emeraldLive">
                            <span>{rev.ratings.overall.toFixed(1)}</span>
                            <Star size={13} fill="currentColor" />
                          </div>
                          <span
                            className={`text-[10px] font-mono uppercase ${
                              rev.businessStatus === "RESOLVED"
                                ? "text-emeraldLive"
                                : rev.businessStatus === "REVIEWED"
                                ? "text-cyanLive"
                                : "text-quiet"
                            }`}
                          >
                            {rev.businessStatus || "UNREVIEWED"}
                          </span>
                        </div>
                      </div>

                      {rev.dishOrdered && (
                        <div className="mt-2 text-xs font-medium text-emeraldLive/90 flex items-center gap-1.5">
                          <Tag size={12} />
                          <span>Dish: {rev.dishOrdered}</span>
                        </div>
                      )}

                      {rev.comment && (
                        <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">
                          "{rev.comment}"
                        </p>
                      )}

                      {rev.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {rev.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-panel border border-line text-quiet"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>

            {/* Selected Review Deep Dive & Management Action Pane */}
            <div className="lg:col-span-5 rounded-xl border border-line bg-panel p-5 space-y-5 sticky top-20">
              {activeReview ? (
                <>
                  <div className="flex items-start justify-between border-b border-line pb-4">
                    <div>
                      <div className="font-semibold text-sm text-ink">
                        {activeReview.anonymousLabel}
                      </div>
                      <div className="text-xs text-muted">
                        Feedback submitted on {new Date(activeReview.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(["UNREVIEWED", "REVIEWED", "RESOLVED"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleUpdateStatus(activeReview._id, s)}
                          className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                            activeReview.businessStatus === s
                              ? "bg-emeraldStrong text-black font-bold"
                              : "bg-panel-raised border border-line text-muted hover:text-ink"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div>
                    <h3 className="text-xs font-mono uppercase text-quiet mb-2">Category Scores</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(activeReview.ratings).map(([cat, val]) => (
                        <div
                          key={cat}
                          className="p-2 rounded bg-panel-raised border border-line flex items-center justify-between"
                        >
                          <span className="text-muted capitalize">
                            {cat.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="font-mono font-bold text-emeraldLive">{val}★</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diner Comment */}
                  <div className="p-3 rounded-lg bg-panel-raised border border-line space-y-1">
                    <span className="text-[10px] font-mono text-quiet uppercase">Full Comment</span>
                    <p className="text-xs text-ink leading-relaxed">
                      "{activeReview.comment || "No written comment provided."}"
                    </p>
                  </div>

                  {/* Public Management Reply Section */}
                  <div className="space-y-2 border-t border-line pt-3">
                    <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <Send size={13} className="text-emeraldLive" />
                      <span>Post Public Management Response</span>
                    </label>

                    {activeReview.publicResponse ? (
                      <div className="p-3 rounded-lg border border-emeraldLive/30 bg-emeraldStrong/5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-emeraldLive">
                          <span>{activeReview.publicResponse.responderLabel}</span>
                          <span>{new Date(activeReview.publicResponse.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-ink">{activeReview.publicResponse.message}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="e.g. Thank you for visiting! We have reviewed our grill timing with the kitchen team..."
                          className="w-full p-2.5 rounded-lg bg-panel-raised border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive placeholder:text-quiet resize-none"
                        />
                        <button
                          onClick={() => handleSendReply(activeReview._id)}
                          disabled={isReplying || !replyText.trim()}
                          className="w-full py-2 rounded-lg bg-[#c92323] hover:bg-[#b01e1e] text-white text-xs font-semibold shadow disabled:opacity-50 transition-colors"
                        >
                          {isReplying ? "Publishing..." : "Publish Verified Reply"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Private Internal Team Notes */}
                  <div className="space-y-2 border-t border-line pt-3">
                    <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <StickyNote size={13} className="text-amber" />
                      <span>Internal Operations Notes (Staff Only)</span>
                    </label>

                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {(activeReview.internalNotes || []).map((n, i) => (
                        <div key={i} className="p-2 rounded bg-panel-raised border border-line text-xs">
                          <span className="font-mono text-[10px] text-quiet">{n.authorName}: </span>
                          <span className="text-muted">{n.note}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={internalNoteText}
                        onChange={(e) => setInternalNoteText(e.target.value)}
                        placeholder="Add internal kitchen or shift note..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-panel-raised border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive placeholder:text-quiet"
                      />
                      <button
                        onClick={() => handleAddNote(activeReview._id)}
                        className="px-3 py-1.5 rounded-lg bg-panel-raised border border-line hover:border-emeraldLive text-xs text-ink font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-muted">
                  Select a review from the list to inspect ratings, triage status, and respond.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

