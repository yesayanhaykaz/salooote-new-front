"use client";
import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { Star } from "lucide-react";

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

function StarRating({ value, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={size}
          className={`${value >= n ? "fill-amber-400 text-amber-400" : "text-surface-200"} transition-colors`}
        />
      ))}
    </div>
  );
}

export default function AccountReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.reviews({ limit: 50 })
      .then(res => setReviews(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-surface-900">My Reviews</h1>
        <p className="text-sm text-surface-400 mt-0.5">Your submitted reviews</p>
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
          <p className="text-sm text-surface-400 mt-1">Your submitted reviews will appear here.</p>
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

              <StarRating value={review.rating} />

              {review.body && (
                <p className="text-sm text-surface-600 mt-2.5 leading-relaxed">{review.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
