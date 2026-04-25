"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Star,
  ThumbsUp,
  Camera,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { reviewsAPI } from "@/lib/api";

const PAGE_SIZE = 12;

function formatRelative(dateStr, lang = "en") {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const day = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(diffMs / day);
  const rtf = new Intl.RelativeTimeFormat(lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US", { numeric: "auto" });
  if (diffDays < 1) return rtf.format(-Math.max(1, Math.floor(diffMs / (60 * 60 * 1000))), "hour");
  if (diffDays < 30) return rtf.format(-diffDays, "day");
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), "month");
  return rtf.format(-Math.floor(diffDays / 365), "year");
}

function initialFromName(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function avatarColor(seed = "") {
  const palette = ["bg-brand-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-violet-500", "bg-pink-500"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function targetHref(r, lang) {
  const langPrefix = lang ? `/${lang}` : "";
  if (r.target_type === "vendor" && r.target_slug) return `${langPrefix}/vendor/${r.target_slug}`;
  if (r.target_type === "product" && r.target_slug) return `${langPrefix}/product/${r.target_slug}`;
  return null;
}

export default function ReviewsClient({ lang = "en", dict = {} }) {
  const t = dict.reviewsPage || {};
  const auth = dict.auth || {};

  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState("recent");
  const [helpfulClicked, setHelpfulClicked] = useState({});

  const filters = useMemo(
    () => [
      { key: "All", label: t.filtersAll || "All" },
      { key: "5", label: (t.filtersStars || "{n} stars").replace("{n}", "5") },
      { key: "4", label: (t.filtersStars || "{n} stars").replace("{n}", "4") },
      { key: "3", label: (t.filtersStars || "{n} stars").replace("{n}", "3") },
    ],
    [t]
  );

  const sortOptions = [
    { value: "recent", label: t.sortRecent || "Most recent" },
    { value: "highest", label: t.sortHighest || "Highest rated" },
    { value: "lowest", label: t.sortLowest || "Lowest rated" },
  ];

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const [statsResp, listResp] = await Promise.all([
          reviewsAPI.stats().catch(() => null),
          reviewsAPI.list({ page: 1, limit: PAGE_SIZE, ...(activeFilter !== "All" ? { rating: activeFilter } : {}) }),
        ]);
        if (cancel) return;
        setStats(statsResp?.data || null);
        setReviews(listResp?.data || []);
        setTotal(listResp?.pagination?.total || 0);
        setPage(1);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [activeFilter]);

  async function loadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const r = await reviewsAPI.list({ page: next, limit: PAGE_SIZE, ...(activeFilter !== "All" ? { rating: activeFilter } : {}) });
      setReviews((prev) => [...prev, ...(r?.data || [])]);
      setPage(next);
    } finally {
      setLoadingMore(false);
    }
  }

  const sorted = useMemo(() => {
    const list = [...reviews];
    if (sort === "highest") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "lowest") list.sort((a, b) => a.rating - b.rating);
    else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return list;
  }, [reviews, sort]);

  const totalReviews = stats?.total ?? total ?? 0;
  const avgRating = stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : "0.0";
  const distribution = stats?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const maxBar = Math.max(1, ...Object.values(distribution));

  const langPrefix = lang ? `/${lang}` : "";
  const hasMore = reviews.length < total;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
          <nav className="flex items-center gap-2 text-[13px] text-surface-500 mb-6">
            <Link href={langPrefix || "/"} className="hover:text-brand-600 transition-colors no-underline text-surface-500">
              {t.breadcrumbHome || "Home"}
            </Link>
            <span>/</span>
            <span className="text-surface-800 font-medium">{t.breadcrumbReviews || "Reviews"}</span>
          </nav>

          <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-rose-100 text-rose-600 rounded-full px-3 py-1 text-[11.5px] font-semibold mb-5">
                <Sparkles size={13} />
                {t.heroEyebrow || "Real customers, real moments"}
              </div>
              <h1 className="font-display text-[34px] md:text-[48px] font-bold text-surface-900 leading-[1.1] tracking-tight mb-4">
                {t.heroTitle || "What people say about Salooote"}
              </h1>
              <p className="text-surface-500 text-[15.5px] md:text-[17px] leading-relaxed max-w-[560px]">
                {t.heroSubtitle ||
                  "Honest reviews from people who planned their dream events with our verified partners."}
              </p>
            </div>

            {/* Score card */}
            <div className="bg-white border border-surface-100 rounded-3xl shadow-soft p-6 md:p-7">
              <p className="text-[12px] uppercase tracking-wider text-surface-400 font-semibold mb-2">
                {t.overallRating || "Overall rating"}
              </p>
              <div className="flex items-end gap-3 mb-3">
                <span className="font-display text-[56px] md:text-[64px] leading-none font-bold text-surface-900">{avgRating}</span>
                <div className="flex flex-col mb-2">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-surface-200"}
                      />
                    ))}
                  </div>
                  <p className="text-surface-500 text-[13px]">
                    {(t.totalReviews || "{count} reviews").replace("{count}", totalReviews.toLocaleString())}
                  </p>
                </div>
              </div>

              <p className="text-[11.5px] uppercase tracking-wider text-surface-400 font-semibold mb-2">
                {t.ratingDistribution || "Rating breakdown"}
              </p>
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((s) => {
                  const count = distribution[s] ?? distribution[String(s)] ?? 0;
                  const pct = Math.round((count / maxBar) * 100);
                  return (
                    <button
                      key={s}
                      onClick={() => setActiveFilter(activeFilter === String(s) ? "All" : String(s))}
                      className={`w-full flex items-center gap-2 group cursor-pointer rounded-lg px-1.5 py-1 transition-colors ${
                        activeFilter === String(s) ? "bg-rose-50" : "hover:bg-surface-50"
                      }`}
                    >
                      <span className="text-[12px] font-medium text-surface-600 w-3">{s}</span>
                      <Star size={11} className="fill-amber-400 text-amber-400 -ml-0.5" />
                      <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-rose-400 to-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11.5px] text-surface-400 w-7 text-right tabular-nums">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-24">
        <div className="grid md:grid-cols-[1fr_320px] gap-10">
          {/* Reviews column */}
          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3.5 py-2 rounded-full text-[12.5px] font-semibold border transition-all cursor-pointer ${
                      activeFilter === f.key
                        ? "bg-brand-600 text-white border-brand-600 shadow-glow"
                        : "bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-surface-200 rounded-full px-4 py-2 text-[12.5px] font-medium text-surface-700 outline-none cursor-pointer focus:border-brand-300"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <p className="text-surface-400 text-[13px] mb-5">
              {(t.showingCount || "{count} reviews").replace("{count}", total.toLocaleString())}
            </p>

            {loading ? (
              <div className="bg-white rounded-3xl border border-surface-100 py-24 text-center shadow-soft">
                <Loader2 size={28} className="animate-spin text-brand-500 mx-auto mb-3" />
                <p className="text-surface-500 text-sm">Loading reviews…</p>
              </div>
            ) : sorted.length === 0 ? (
              <EmptyState t={t} totalReviews={totalReviews} />
            ) : (
              <div className="space-y-4">
                {sorted.map((r, i) => {
                  const name = r.user_name || t.anonymous || "Anonymous";
                  const date = formatRelative(r.created_at, lang);
                  const href = targetHref(r, lang);
                  return (
                    <article
                      key={r.id || i}
                      className="bg-white rounded-3xl p-6 md:p-7 border border-surface-100 shadow-soft hover:shadow-md hover:border-rose-100 transition-all"
                    >
                      <header className="flex items-start gap-4 mb-4">
                        <div className={`w-11 h-11 rounded-full ${avatarColor(name)} flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0`}>
                          {initialFromName(name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-[14.5px] text-surface-900 truncate">{name}</p>
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 font-semibold">
                              <ShieldCheck size={11} />
                              {t.verified || "Verified"}
                            </span>
                          </div>
                          <p className="text-[12px] text-surface-400 mt-0.5">{date}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} size={14} className={j < r.rating ? "fill-amber-400 text-amber-400" : "text-surface-200"} />
                            ))}
                          </div>
                          <span className="text-[11.5px] font-semibold text-surface-600">{r.rating}/5</span>
                        </div>
                      </header>

                      {r.title && (
                        <h3 className="text-[16px] font-semibold text-surface-900 mb-1.5 leading-snug">{r.title}</h3>
                      )}
                      {r.body && (
                        <p className="text-[14px] text-surface-600 leading-relaxed">{r.body}</p>
                      )}

                      <footer className="flex items-center justify-between flex-wrap gap-3 mt-5 pt-4 border-t border-surface-50">
                        {href && r.target_name ? (
                          <Link
                            href={href}
                            className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 no-underline group"
                          >
                            <span className="text-surface-400 font-medium">
                              {r.target_type === "vendor" ? (t.viewVendor || "View vendor") : (t.viewProduct || "View product")}:
                            </span>
                            <span>{r.target_name}</span>
                            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        ) : <span />}
                        <button
                          onClick={() => setHelpfulClicked((p) => ({ ...p, [r.id || i]: !p[r.id || i] }))}
                          className={`flex items-center gap-1.5 text-[12px] font-medium border rounded-full px-3 py-1.5 cursor-pointer transition-all ${
                            helpfulClicked[r.id || i]
                              ? "bg-rose-50 text-brand-600 border-brand-200"
                              : "bg-transparent text-surface-400 border-surface-200 hover:border-brand-200 hover:text-brand-500"
                          }`}
                        >
                          <ThumbsUp size={12} />
                          {t.helpful || "Helpful"}
                        </button>
                      </footer>
                    </article>
                  );
                })}

                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 border border-surface-200 rounded-full px-6 py-3 text-[13px] font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 disabled:opacity-60 transition-all bg-white cursor-pointer"
                    >
                      {loadingMore && <Loader2 size={14} className="animate-spin" />}
                      {t.loadMore || "Load more reviews"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky CTA sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-24 space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-rose-500 to-rose-400 p-6 text-white shadow-glow">
                <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
                <MessageCircle size={22} className="mb-3 opacity-90" />
                <p className="font-semibold text-[15.5px] mb-1.5">{t.writeCtaTitle || "Share your experience"}</p>
                <p className="text-white/85 text-[12.5px] leading-relaxed mb-5">
                  {t.writeCtaSubtitle || "Help others find the right vendor by writing a quick review."}
                </p>
                <Link
                  href={`${langPrefix}/login`}
                  className="block w-full bg-white text-brand-700 text-center rounded-full py-2.5 text-[13px] font-semibold hover:bg-rose-50 transition-colors no-underline"
                >
                  {t.writeCtaButton || "Write a review"}
                </Link>
              </div>

              <div className="bg-white border border-surface-100 rounded-3xl p-5 shadow-soft">
                <p className="text-[12px] uppercase tracking-wider text-surface-400 font-semibold mb-3">Trust</p>
                <ul className="space-y-3 text-[13px] text-surface-600">
                  <li className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    {t.verified || "Verified purchase"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Camera size={16} className="text-rose-500" />
                    Photo evidence allowed
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    Hand-curated by our team
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ t, totalReviews }) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-surface-100 shadow-soft px-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 mx-auto mb-4 flex items-center justify-center">
        <Star size={24} className="text-rose-400" />
      </div>
      <p className="text-surface-800 font-semibold text-[15px] mb-1.5">
        {totalReviews === 0 ? (t.noReviewsYet || "No reviews yet") : (t.noMatch || "No reviews match this filter")}
      </p>
      <p className="text-surface-500 text-[13px]">{t.noReviewsHint || "Be the first to share your experience after your next celebration."}</p>
    </div>
  );
}
