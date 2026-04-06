"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { REVIEWS } from "@/lib/data";
import {
  Star, ThumbsUp, Filter, ChevronLeft, CheckCircle2,
  Camera, ArrowLeft, MessageCircle
} from "lucide-react";

const vendor = {
  name: "Royal Bakes",
  category: "Cakes & Desserts",
  rating: 4.9,
  reviewCount: 320,
  sales: "2.1K",
  image: "/images/vendor-woman.jpg",
  cover: "/images/wedding-cake.jpg",
};

/* Extended review set */
const ALL_REVIEWS = [
  ...REVIEWS,
  { name: "Emily Clarke", initial: "E", color: "bg-brand-500", text: "Stunning cake! Everyone at the party was amazed. The detail work was exceptional and it tasted as good as it looked.", rating: 5, date: "3 weeks ago", hasPhotos: true, tags: ["Beautiful", "Delicious", "On Time"], helpful: 31 },
  { name: "James Whitfield", initial: "J", color: "bg-accent-400", text: "Second time ordering and they never disappoint. The team is super professional and responds quickly.", rating: 5, date: "1 month ago", hasPhotos: false, tags: ["Punctuality", "Communication"], helpful: 17 },
  { name: "Aisha Petrov", initial: "A", color: "bg-sage-500", text: "Beautiful presentation. Would have loved slightly more customization options but overall a wonderful experience.", rating: 4, date: "1 month ago", hasPhotos: false, tags: ["Quality"], helpful: 9 },
  { name: "Lucas Mendez", initial: "L", color: "bg-warm-500", text: "Perfect for my daughter's birthday! Delivered on time, looked exactly like the photo. Will order again!", rating: 5, date: "6 weeks ago", hasPhotos: true, tags: ["Fast Delivery", "Quality", "Affordable"], helpful: 44 },
];

const RATING_DIST = [
  { stars: 5, pct: 78, count: 249 },
  { stars: 4, pct: 12, count: 38 },
  { stars: 3, pct: 5, count: 16 },
  { stars: 2, pct: 3, count: 10 },
  { stars: 1, pct: 2, count: 7 },
];

const FILTER_OPTIONS = ["All", "5 Stars", "4 Stars", "3 Stars", "With Photos"];
const SORT_OPTIONS = ["Most Recent", "Most Helpful", "Highest Rated", "Lowest Rated"];

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState("Most Recent");
  const [helpfulClicked, setHelpfulClicked] = useState({});

  const filtered = ALL_REVIEWS.filter((r) => {
    if (activeFilter === "5 Stars") return r.rating >= 5;
    if (activeFilter === "4 Stars") return r.rating >= 4 && r.rating < 5;
    if (activeFilter === "3 Stars") return r.rating >= 3 && r.rating < 4;
    if (activeFilter === "With Photos") return r.hasPhotos;
    return true;
  });

  const toggleHelpful = (i) =>
    setHelpfulClicked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header banner */}
      <div className="relative h-[200px] overflow-hidden">
        <Image src={vendor.cover} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900/88 via-surface-900/55 to-transparent" />
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-8 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-4">
            <Link href="/" className="hover:text-white no-underline text-white/60">Home</Link>
            <span>/</span>
            <Link href="/vendor" className="hover:text-white no-underline text-white/60">Royal Bakes</Link>
            <span>/</span>
            <span className="text-white">Reviews</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/30 flex-shrink-0">
              <Image src={vendor.image} alt={vendor.name} width={56} height={56} className="object-cover w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-[28px] font-bold text-white">{vendor.name}</h1>
                <CheckCircle2 size={16} className="text-brand-300" />
              </div>
              <div className="flex items-center gap-1.5 text-white/70 text-xs">
                <Star size={12} className="fill-warm-400 text-warm-400" />
                <span className="text-white font-semibold text-sm">{vendor.rating}</span>
                <span>· {vendor.reviewCount} reviews · {vendor.sales} sales</span>
              </div>
            </div>
            <Link href="/vendor" className="ml-auto no-underline">
              <button className="bg-white/15 text-white border border-white/25 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-white/25 transition-all flex items-center gap-1.5">
                <ArrowLeft size={13} /> Back to Shop
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-10">
        <div className="flex gap-10 flex-wrap">
          {/* Left — rating overview */}
          <div className="w-full md:w-[280px] flex-shrink-0">
            {/* Overall score */}
            <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft mb-5">
              <div className="text-center mb-5">
                <p className="text-[56px] font-bold text-surface-900 leading-none">{vendor.rating}</p>
                <div className="flex justify-center gap-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.floor(vendor.rating) ? "fill-warm-500 text-warm-500" : "text-surface-200"} />
                  ))}
                </div>
                <p className="text-surface-400 text-sm">{vendor.reviewCount} reviews</p>
              </div>

              {/* Distribution bars */}
              <div className="space-y-2">
                {RATING_DIST.map(({ stars, pct, count }) => (
                  <button
                    key={stars}
                    onClick={() => setActiveFilter(`${stars} Stars`)}
                    className={`w-full flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0 rounded-lg hover:bg-surface-50 transition-colors px-1 py-0.5 ${activeFilter === `${stars} Stars` ? "ring-1 ring-brand-200 bg-brand-50 rounded-lg" : ""}`}
                  >
                    <span className="text-[12px] text-surface-500 w-10 text-right flex-shrink-0">{stars}★</span>
                    <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warm-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-surface-400 w-7 flex-shrink-0">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category tags */}
            <div className="bg-white rounded-2xl p-5 border border-surface-100 shadow-soft mb-5">
              <p className="text-[12px] font-semibold text-surface-500 uppercase tracking-wide mb-3">Most Mentioned</p>
              {["Quality", "Punctuality", "Communication", "Affordable", "Fast Delivery", "Beautiful"].map((tag) => (
                <div key={tag} className="flex items-center justify-between py-2 border-b border-surface-50 last:border-none">
                  <span className="text-[13px] text-surface-600">{tag}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < 4 ? "fill-warm-400 text-warm-400" : "text-surface-200"} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Write review CTA */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 text-white">
              <MessageCircle size={20} className="mb-3 opacity-80" />
              <p className="font-semibold text-[14px] mb-1">Share your experience</p>
              <p className="text-white/70 text-[12px] mb-4">Help others make the right choice.</p>
              <button className="w-full bg-white text-brand-700 border-none rounded-xl py-2.5 text-[13px] font-semibold cursor-pointer hover:bg-brand-50 transition-colors">
                Write a Review
              </button>
            </div>
          </div>

          {/* Right — review list */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${activeFilter === f ? "bg-brand-600 text-white border-brand-600 shadow-glow" : "bg-white text-surface-600 border-surface-200 hover:border-brand-200"}`}
                  >
                    {f === "With Photos" && <Camera size={11} className="inline mr-1" />}
                    {f}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-surface-200 rounded-xl px-4 py-2 text-[12.5px] font-medium text-surface-700 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <p className="text-surface-400 text-[13px] mb-5">{filtered.length} reviews</p>

            <div className="space-y-5">
              {filtered.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft hover:border-surface-200 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                        {r.initial}
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] text-surface-800">{r.name}</p>
                        <p className="text-[11px] text-surface-400">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={13}
                            className={j < Math.floor(r.rating) ? "fill-warm-500 text-warm-500" : "text-surface-200"}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-surface-600">{r.rating}/5</span>
                    </div>
                  </div>

                  <p className="text-[13.5px] text-surface-600 leading-relaxed mb-4">{r.text}</p>

                  {/* Review photos (placeholder) */}
                  {r.hasPhotos && (
                    <div className="flex gap-2 mb-4">
                      {["/images/wedding-cake.jpg", "/images/cupcakes.jpg"].map((src, j) => (
                        <div key={j} className="w-16 h-16 rounded-xl overflow-hidden relative border border-surface-100">
                          <Image src={src} alt="Review photo" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags + helpful */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {r.tags.map((tag, j) => (
                        <span key={j} className="text-[11px] bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full border border-brand-100 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleHelpful(i)}
                      className={`flex items-center gap-1.5 text-[12px] font-medium border rounded-xl px-3 py-1.5 cursor-pointer transition-all ${helpfulClicked[i] ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-transparent text-surface-400 border-surface-200 hover:border-brand-200 hover:text-brand-500"}`}
                    >
                      <ThumbsUp size={12} />
                      Helpful ({r.helpful + (helpfulClicked[i] ? 1 : 0)})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-surface-100">
                <Star size={40} className="text-surface-200 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No reviews match this filter</p>
                <button
                  onClick={() => setActiveFilter("All")}
                  className="mt-3 text-brand-600 text-sm font-semibold hover:underline border-none bg-transparent cursor-pointer"
                >
                  Show all reviews
                </button>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="text-center mt-8">
                <button className="border border-surface-200 rounded-2xl px-8 py-3 text-[13px] font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent cursor-pointer">
                  Load more reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
