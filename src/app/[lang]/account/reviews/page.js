"use client";
import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { Star, Plus, X, Send, AlertCircle } from "lucide-react";

const STATUS_STYLES = {
  pending:  "bg-amber-50  text-amber-600  border-amber-200",
  approved: "bg-green-50  text-green-600  border-green-200",
  public:   "bg-green-50  text-green-600  border-green-200",
  rejected: "bg-red-50    text-red-500    border-red-200",
};

function Badge({ status }) {
  const cls = STATUS_STYLES[status?.toLowerCase()] || "bg-surface-100 text-surface-500 border-surface-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${cls}`}>
      {status || "pending"}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StarRating({ value, onChange, readonly = false, size = 18 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" disabled={readonly}
          onClick={() => !readonly && onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`bg-transparent border-none p-0 ${!readonly ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star size={size}
            className={`${(hovered || value) >= n ? "fill-amber-400 text-amber-400" : "text-surface-200"} transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

function WriteReviewModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ target_type: "vendor", target_id: "", rating: 0, title: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.target_id.trim()) { setError("Target ID is required."); return; }
    if (!form.rating)           { setError("Please select a rating."); return; }
    if (!form.body.trim())      { setError("Review text is required."); return; }
    setSaving(true);
    try {
      const res = await userAPI.createReview({
        target_type: form.target_type,
        target_id:   form.target_id.trim(),
        rating:      form.rating,
        title:       form.title.trim(),
        body:        form.body.trim(),
      });
      onCreated(res?.data || res);
    } catch (err) { setError(err.message || "Failed to submit review."); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-sm font-bold text-surface-900">Write a Review</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={15} className="text-surface-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Type *</label>
              <select name="target_type" value={form.target_type} onChange={set}
                className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 bg-white transition-all">
                <option value="vendor">Vendor</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Target ID *</label>
              <input name="target_id" value={form.target_id} onChange={set} placeholder="UUID"
                className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all font-mono" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-2">Rating *</label>
            <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} size={24} />
            {!form.rating && <p className="text-[11px] text-surface-400 mt-1">Click to set rating</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Title</label>
            <input name="title" value={form.title} onChange={set} placeholder="Summary of your experience"
              className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Review *</label>
            <textarea name="body" value={form.body} onChange={set} rows={4} placeholder="Share your experience…"
              className="w-full resize-none px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all" />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertCircle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
              <Send size={14} /> {saving ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountReviewsPage() {
  const [reviews,   setReviews]  = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [showModal, setModal]    = useState(false);

  useEffect(() => {
    userAPI.reviews({ limit: 50 })
      .then(res => setReviews(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (r) => { if (r?.id) setReviews(p => [r, ...p]); setModal(false); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">My Reviews</h1>
          <p className="text-sm text-surface-400 mt-0.5">Your submitted reviews</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
          <Plus size={15} /> Write Review
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
            <Star size={24} className="text-amber-300" />
          </div>
          <p className="font-semibold text-surface-700">No reviews yet</p>
          <p className="text-sm text-surface-400 mt-1 mb-4">Share your experience with vendors you've worked with.</p>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
            <Plus size={14} /> Write First Review
          </button>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 hover:border-surface-300 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
                    {review.target_type?.slice(0, 2).toUpperCase() || "??"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-surface-900 capitalize">{review.target_type}</p>
                      <span className="font-mono text-xs text-surface-400">···{review.target_id?.slice(-8)}</span>
                      <Badge status={review.status} />
                    </div>
                    {review.title && <p className="text-xs font-medium text-surface-600 mt-0.5">{review.title}</p>}
                  </div>
                </div>
                <span className="text-xs text-surface-400 flex-shrink-0">{formatDate(review.created_at)}</span>
              </div>

              <StarRating value={review.rating} readonly size={14} />

              {review.body && (
                <p className="text-sm text-surface-600 mt-2.5 leading-relaxed">{review.body}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && <WriteReviewModal onClose={() => setModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
