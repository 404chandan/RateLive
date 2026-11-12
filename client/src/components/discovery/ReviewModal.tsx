import React, { useState } from "react";
import { X, Star, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import { fetchApi } from "../../services/api";
import type { Restaurant } from "../../types";

interface ReviewModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [overall, setOverall] = useState(5);
  const [foodQuality, setFoodQuality] = useState(5);
  const [service, setService] = useState(4);
  const [staffBehaviour, setStaffBehaviour] = useState(5);
  const [ambience, setAmbience] = useState(4);
  const [cleanliness, setCleanliness] = useState(5);
  const [valueForMoney, setValueForMoney] = useState(4);

  const [dishOrdered, setDishOrdered] = useState("");
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  if (!isOpen) return null;

  const availableTags = [
    "Excellent food",
    "Great service",
    "Long waiting time",
    "Expensive",
    "Great ambience",
    "Friendly staff",
    "Worth visiting",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        restaurantId: restaurant._id,
        dishOrdered: dishOrdered.trim() || undefined,
        ratings: {
          overall,
          foodQuality,
          service,
          staffBehaviour,
          ambience,
          cleanliness,
          valueForMoney,
        },
        comment: comment.trim(),
        tags: selectedTags,
      };

      const res: any = await fetchApi("/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSubmittedResult(res);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2200);
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-panel border border-line rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line bg-sidebar">
          <div>
            <h2 className="text-sm font-semibold text-ink">Rate your visit</h2>
            <p className="text-[11px] text-muted">{restaurant.name} · {restaurant.neighborhood}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-panel text-muted hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {submittedResult ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 size={44} className="text-emeraldLive mx-auto animate-bounce" />
              <h3 className="font-display font-bold text-lg text-ink">Feedback Recorded!</h3>
              <p className="text-xs text-muted max-w-xs mx-auto">
                {submittedResult.message}
              </p>
              <div className="font-mono text-xs text-emeraldLive bg-emeraldStrong/10 border border-emeraldLive/30 rounded py-1.5 px-3 inline-block">
                Assigned: {submittedResult.data.anonymousLabel}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Privacy Notice Banner */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-line bg-panel-raised text-[11px] text-muted">
                <ShieldCheck size={16} className="text-emeraldLive flex-shrink-0" />
                <span>
                  <strong>Your identity stays private.</strong> Your feedback helps restaurants improve without exposing your name, email, or personal details.
                </span>
              </div>

              {/* Overall Rating */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink flex items-center justify-between">
                  <span>Overall Experience</span>
                  <span className="font-mono text-xs text-emeraldLive">{overall} of 5</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverall(star)}
                      className="p-1 text-quiet hover:text-amber transition-colors"
                    >
                      <Star
                        size={22}
                        className={star <= overall ? "text-amber fill-amber" : "text-quiet"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-category Rating Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-line">
                {[
                  { label: "Food Quality", val: foodQuality, set: setFoodQuality },
                  { label: "Service Speed", val: service, set: setService },
                  { label: "Staff Behaviour", val: staffBehaviour, set: setStaffBehaviour },
                  { label: "Ambience & Vibe", val: ambience, set: setAmbience },
                  { label: "Cleanliness", val: cleanliness, set: setCleanliness },
                  { label: "Value for Money", val: valueForMoney, set: setValueForMoney },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span>{item.label}</span>
                      <span className="font-mono text-ink">{item.val}★</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={item.val}
                      onChange={(e) => item.set(Number(e.target.value))}
                      className="w-full h-1 bg-line rounded-lg appearance-none cursor-pointer accent-emeraldStrong"
                    />
                  </div>
                ))}
              </div>

              {/* Dish Ordered */}
              <div className="space-y-1 pt-2 border-t border-line">
                <label className="text-xs font-medium text-ink">
                  Dish ordered (Optional)
                </label>
                <input
                  type="text"
                  value={dishOrdered}
                  onChange={(e) => setDishOrdered(e.target.value)}
                  placeholder="e.g., All American Cheese Burger, Ghee Roast Dosa"
                  className="w-full px-3 py-2 rounded-md bg-panel-raised border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive placeholder:text-quiet"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink">Experience Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-emeraldStrong/15 border-emeraldLive text-emeraldLive font-medium"
                          : "border-line text-muted hover:text-ink hover:bg-panel-raised"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Written Feedback */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">
                  Honest Anonymous Feedback
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="What stood out? What can the kitchen or service staff improve?"
                  className="w-full px-3 py-2 rounded-md bg-panel-raised border border-line text-ink text-xs focus:outline-none focus:border-emeraldLive placeholder:text-quiet resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-[#c92323] hover:bg-[#b01e1e] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Analyzing & Submitting Anonymously..." : "Submit Anonymous Feedback"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

