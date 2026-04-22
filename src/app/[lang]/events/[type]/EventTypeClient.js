"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { productsAPI, vendorsAPI } from "@/lib/api";
import {
  Heart, PartyPopper, Users, Sparkles, Star, Gift,
  Cake, Flower2, UtensilsCrossed, Music, Camera,
  ChevronRight, ArrowLeft,
} from "lucide-react";

const EVENT_META = {
  wedding: {
    label: "Weddings",
    labelHy: "Հարսանիքներ",
    labelRu: "Свадьбы",
    desc: "Everything you need to make your wedding day absolutely perfect.",
    icon: Heart,
    gradient: "from-pink-500 via-rose-500 to-red-400",
    keywords: ["wedding", "bride", "cake", "flowers", "catering", "ring"],
    suggestedCats: ["cakes", "flowers", "catering", "music", "photography"],
    checklist: ["Book venue", "Order wedding cake", "Hire florist", "Book catering", "Find photographer", "Book DJ/Band", "Arrange transport", "Order invitations"],
  },
  birthday: {
    label: "Birthdays",
    labelHy: "Ծննդյան Տոներ",
    labelRu: "Дни Рождения",
    desc: "Celebrate every year in style with the best vendors in Armenia.",
    icon: PartyPopper,
    gradient: "from-blue-400 via-cyan-500 to-sky-400",
    keywords: ["birthday", "party", "cake", "balloons", "kids"],
    suggestedCats: ["cakes", "balloons", "catering", "music"],
    checklist: ["Order birthday cake", "Get balloons & decor", "Book catering", "Arrange entertainment", "Send invitations"],
  },
  corporate: {
    label: "Corporate Events",
    labelHy: "Կորպորատիվ Միջոցառումներ",
    labelRu: "Корпоративные Мероприятия",
    desc: "Impress your clients and team with a professionally organized corporate event.",
    icon: Users,
    gradient: "from-slate-500 via-gray-600 to-zinc-500",
    keywords: ["corporate", "business", "catering", "conference"],
    suggestedCats: ["catering", "music", "decor"],
    checklist: ["Book venue", "Arrange catering", "Set up AV/tech", "Book entertainment", "Print materials"],
  },
  engagement: {
    label: "Engagements",
    labelHy: "Նշանդրեք",
    labelRu: "Помолвки",
    desc: "Plan the perfect engagement — from the ring moment to the celebration.",
    icon: Sparkles,
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    keywords: ["engagement", "proposal", "ring", "flowers", "romantic"],
    suggestedCats: ["flowers", "cakes", "photography"],
    checklist: ["Choose the venue", "Order flowers", "Get a cake", "Book photographer", "Plan the surprise"],
  },
  anniversary: {
    label: "Anniversaries",
    labelHy: "Ամյակ",
    labelRu: "Юбилеи",
    desc: "Honor every milestone with a celebration your loved ones will treasure.",
    icon: Star,
    gradient: "from-orange-400 via-amber-500 to-yellow-400",
    keywords: ["anniversary", "celebration", "flowers", "cake", "romantic"],
    suggestedCats: ["cakes", "flowers", "catering"],
    checklist: ["Pick a venue", "Order a special cake", "Get flowers", "Plan dinner/event", "Arrange entertainment"],
  },
  "kids-party": {
    label: "Kids' Parties",
    labelHy: "Մանկական Տոներ",
    labelRu: "Детские Праздники",
    desc: "Create magical moments that little ones will remember forever.",
    icon: Gift,
    gradient: "from-green-400 via-emerald-500 to-teal-500",
    keywords: ["kids", "children", "birthday", "balloons", "party", "fun"],
    suggestedCats: ["cakes", "balloons", "catering"],
    checklist: ["Order themed cake", "Get balloons & decor", "Arrange entertainment", "Prepare party favors", "Invite friends"],
  },
};

const SUGGESTED_VENDORS = {
  wedding:     ["Cakes & Pastry", "Florists", "Catering", "Photography", "DJ & Music"],
  birthday:    ["Cakes & Pastry", "Balloons", "Catering", "Entertainment"],
  corporate:   ["Catering", "AV & Tech", "Entertainment", "Decor"],
  engagement:  ["Florists", "Cakes & Pastry", "Photography", "Jewelry"],
  anniversary: ["Cakes & Pastry", "Florists", "Catering", "Entertainment"],
  "kids-party":["Cakes & Pastry", "Balloons & Decor", "Catering", "Animators"],
};

export default function EventTypeClient({ lang, type, dict }) {
  const meta = EVENT_META[type] || {
    label: type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    desc: "Find the best vendors for your event.",
    icon: Sparkles,
    gradient: "from-brand-500 to-brand-600",
    keywords: [],
    suggestedCats: [],
    checklist: [],
  };

  const Icon = meta.icon;
  const [products, setProducts] = useState([]);
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [checked, setChecked]   = useState({});

  useEffect(() => {
    const q = meta.keywords[0] || type;
    Promise.all([
      productsAPI.list({ search: q, limit: 10, locale: lang }).catch(() => null),
      vendorsAPI.list({ limit: 8 }).catch(() => null),
    ]).then(([pRes, vRes]) => {
      setProducts((pRes?.data || []).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug || "",
        vendor_slug: p.vendor_slug || "",
        price: parseFloat(p.price) || 0,
        originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
        rating: parseFloat(p.rating) || 0,
        reviews: p.review_count || 0,
        vendor: p.vendor_name || "",
        image: p.thumbnail_url || p.images?.[0]?.url || null,
        tags: p.tags || [],
        gradient: "from-brand-50 to-brand-100",
      })));
      setVendors(vRes?.data || []);
    }).finally(() => setLoading(false));
  }, [type, lang]);

  const localLabel = lang === "hy" ? meta.labelHy : lang === "ru" ? meta.labelRu : meta.label;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className={`bg-gradient-to-br ${meta.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
        <div className="max-w-container mx-auto px-6 md:px-8 py-16 relative">
          <Link href={`/${lang}`} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm no-underline mb-6 transition-colors">
            <ArrowLeft size={14} /> Home
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Icon size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{localLabel}</h1>
              <p className="text-white/80 text-base max-w-[480px]">{meta.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-surface-200 bg-surface-50">
        <div className="max-w-container mx-auto px-6 md:px-8 py-3 flex items-center gap-2 text-xs text-surface-400">
          <Link href={`/${lang}`} className="hover:text-brand-600 no-underline text-surface-400 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-surface-700 font-medium">{localLabel}</span>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 md:px-8 py-12">
        <div className="flex gap-10 flex-wrap lg:flex-nowrap">

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Products */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900">Products for {localLabel}</h2>
                <Link href={`/${lang}/products`} className="text-sm text-brand-600 font-medium no-underline flex items-center gap-1 hover:gap-2 transition-all">
                  Browse all <ChevronRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-[260px] bg-surface-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <ProductCard product={p} lang={lang} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-surface-50 rounded-2xl border border-surface-200">
                  <p className="text-surface-400 text-sm mb-2">No products yet for this event type.</p>
                  <Link href={`/${lang}/products`} className="text-brand-600 text-sm font-semibold no-underline hover:underline">Browse all products →</Link>
                </div>
              )}
            </div>

            {/* Vendors */}
            {vendors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-surface-900">Recommended Vendors</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendors.slice(0, 6).map((v, i) => (
                    <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={`/${lang}/vendor/${v.slug}`} className="no-underline">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-brand-300 hover:shadow-md transition-all">
                          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {v.business_name?.[0] || "V"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-surface-900 text-sm truncate">{v.business_name}</p>
                            {v.city && <p className="text-xs text-surface-400 mt-0.5">{v.city}</p>}
                          </div>
                          <ChevronRight size={14} className="text-surface-300 ml-auto flex-shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar: Planning Checklist ── */}
          {meta.checklist.length > 0 && (
            <div className="w-full lg:w-[300px] flex-shrink-0">
              <div className="bg-surface-50 rounded-2xl border border-surface-200 p-5 sticky top-24">
                <h3 className="font-bold text-surface-900 mb-4 text-sm">
                  {localLabel} Checklist
                </h3>
                <div className="space-y-2">
                  {meta.checklist.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white transition-colors cursor-pointer border-none bg-transparent text-left"
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checked[i] ? "bg-brand-600 border-brand-600" : "border-surface-300"
                      }`}>
                        {checked[i] && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${checked[i] ? "line-through text-surface-400" : "text-surface-700"}`}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-surface-200">
                  <p className="text-xs text-surface-400 text-center">
                    {Object.values(checked).filter(Boolean).length} / {meta.checklist.length} done
                  </p>
                </div>
              </div>

              {/* Vendor categories needed */}
              <div className="mt-4 bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="font-bold text-surface-900 mb-3 text-sm">Vendors you may need</h3>
                <div className="flex flex-wrap gap-2">
                  {(SUGGESTED_VENDORS[type] || []).map((v, i) => (
                    <span key={i} className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-3 py-1.5 rounded-full font-medium">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
