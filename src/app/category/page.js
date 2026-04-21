"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { productsAPI, vendorsAPI, categoriesAPI } from "@/lib/api";
import { Star, LayoutGrid, List, ChevronRight, MapPin, Package, CheckCircle2, X, SlidersHorizontal, Search, Filter } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest",       value: "newest" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Highest Rated",   value: "rating" },
];

function buildPriceRanges(min, max) {
  if (!max || max === 0) {
    return [
      { label: "Any price", min: 0, max: Infinity },
      { label: "Under $50", min: 0, max: 50 },
      { label: "$50–$150",  min: 50, max: 150 },
      { label: "$150–$300", min: 150, max: 300 },
      { label: "$300+",     min: 300, max: Infinity },
    ];
  }
  const ranges = [{ label: "Any price", min: 0, max: Infinity }];
  const step = Math.ceil(max / 4 / 50) * 50;
  let lo = 0;
  while (lo < max) {
    const hi = lo + step;
    if (lo === 0) ranges.push({ label: `Under $${hi}`, min: 0, max: hi });
    else if (hi >= max) ranges.push({ label: `$${lo}+`, min: lo, max: Infinity });
    else ranges.push({ label: `$${lo}–$${hi}`, min: lo, max: hi });
    lo = hi;
  }
  return ranges;
}

function VendorCard({ vendor, lang = "en" }) {
  const slug = vendor.slug || vendor.id;
  return (
    <Link href={`/${lang}/vendor/${slug}`} className="no-underline">
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden hover:border-brand-200 hover:-translate-y-1 transition-all cursor-pointer group">
        <div className="relative h-[148px] overflow-hidden bg-surface-100">
          {vendor.cover_image || vendor.logo_url ? (
            <Image
              src={vendor.cover_image || vendor.logo_url}
              alt={vendor.business_name || vendor.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
              <Package size={32} className="text-brand-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star size={10} className="fill-warm-400 text-warm-400" />
            <span className="text-xs font-bold text-surface-700">
              {(vendor.avg_rating ?? vendor.rating ?? 4.8).toFixed(1)}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-semibold text-sm leading-tight">
              {vendor.business_name || vendor.name}
            </p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs bg-brand-50 text-brand-600 border border-brand-100 rounded-full px-2.5 py-0.5 font-medium">
              {vendor.category_name || "Vendor"}
            </span>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-brand-500" />
              <span className="text-xs text-surface-400">Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
            <span className="flex items-center gap-1"><Package size={10} />{vendor.product_count || 0} products</span>
            <span className="flex items-center gap-1"><MapPin size={10} />{vendor.city || "Yerevan"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CheckboxFilter({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={onChange}>
      <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all flex-shrink-0 ${checked ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-sm transition-colors ${checked ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>{label}</span>
    </label>
  );
}

export default function CategoryPage({ lang = "en", slug }) {
  const [mainTab, setMainTab]           = useState("products");
  const [view, setView]                 = useState("grid");
  const [sort, setSort]                 = useState("popular");
  const [priceIdx, setPriceIdx]         = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [search, setSearch]             = useState("");

  const [products, setProducts]         = useState([]);
  const [vendors, setVendors]           = useState([]);
  const [total, setTotal]               = useState(0);
  const [filters, setFilters]           = useState({ min_price: 0, max_price: 0, tags: [] });
  const [priceRanges, setPriceRanges]   = useState(buildPriceRanges(0, 0));
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [categoryID, setCategoryID]     = useState(null);

  const categoryName = categoryInfo?.name ||
    (slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "All Categories");

  // Step 1: resolve slug → category info + filters
  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    Promise.all([
      categoriesAPI.getBySlug(slug, lang).catch(() => null),
      categoriesAPI.getFilters(slug, lang).catch(() => null),
    ]).then(([catRes, filterRes]) => {
      if (catRes?.data) {
        setCategoryInfo(catRes.data);
        setCategoryID(catRes.data.id);
      }
      if (filterRes?.data) {
        const fd = filterRes.data;
        setFilters(fd);
        setPriceRanges(buildPriceRanges(fd.min_price, fd.max_price));
      }
    });
  }, [slug, lang]);

  // Step 2: fetch products when categoryID or sort changes
  const fetchProducts = useCallback(() => {
    if (!slug && !categoryID) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const pr = priceRanges[priceIdx];
    const params = {
      limit: 48,
      locale: lang,
      sort: sort,
    };
    if (categoryID) params.category_id = categoryID;
    if (pr && priceIdx > 0) {
      if (pr.min > 0) params.min_price = pr.min;
      if (pr.max !== Infinity) params.max_price = pr.max;
    }
    if (search) params.search = search;

    productsAPI.list(params).then(res => {
      const raw = res?.data || [];
      setTotal(res?.pagination?.total || raw.length);
      setProducts(raw.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug || "",
        vendor_slug: p.vendor_slug || "",
        price: parseFloat(p.price) || 0,
        originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
        rating: p.avg_rating ?? p.rating ?? 0,
        reviews: p.review_count || 0,
        vendor: p.vendor_name || p.business_name || "",
        image: p.thumbnail_url || p.images?.[0]?.url || null,
        tags: p.tags || [],
        gradient: "from-brand-50 to-brand-100",
      })));
    }).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [slug, categoryID, sort, priceIdx, priceRanges, search, lang]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Step 3: fetch vendors for this category
  useEffect(() => {
    const params = { limit: 20 };
    if (categoryID) params.category_id = categoryID;
    vendorsAPI.list(params).then(res => {
      setVendors(res?.data || []);
    }).catch(() => setVendors([]));
  }, [categoryID]);

  const toggleTag = (t) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  // Client-side tag filter (tags applied after fetch)
  const filtered = selectedTags.length > 0
    ? products.filter(p => selectedTags.some(t => p.tags?.includes(t)))
    : products;

  const activeFilterCount = (priceIdx > 0 ? 1 : 0) + selectedTags.length;

  const clearFilters = () => { setPriceIdx(0); setSelectedTags([]); };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className={`border-b border-surface-200 relative overflow-hidden ${categoryInfo?.image_url ? "" : "bg-gradient-to-br from-surface-50 to-white"}`}>
        {/* Background image when available */}
        {categoryInfo?.image_url && (
          <>
            <Image
              src={categoryInfo.image_url}
              alt={categoryName}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/55" />
          </>
        )}
        <div className={`relative max-w-container mx-auto px-6 md:px-8 py-12 flex items-center justify-between gap-8 flex-wrap ${categoryInfo?.image_url ? "text-white" : ""}`}>
          <div>
            <div className={`flex items-center gap-1.5 text-xs mb-4 ${categoryInfo?.image_url ? "text-white/70" : "text-surface-400"}`}>
              <Link href={`/${lang}`} className={`no-underline transition-colors ${categoryInfo?.image_url ? "hover:text-white text-white/70" : "hover:text-brand-600 text-surface-400"}`}>Home</Link>
              <ChevronRight size={12} />
              <span className={categoryInfo?.image_url ? "text-white font-medium" : "text-surface-700 font-medium"}>{categoryName}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              {categoryInfo?.emoji && <span className="text-4xl">{categoryInfo.emoji}</span>}
              <h1 className={`text-4xl md:text-5xl font-bold ${categoryInfo?.image_url ? "text-white" : "text-surface-900"}`}>{categoryName}</h1>
            </div>
            {categoryInfo?.description && (
              <p className={`text-base leading-relaxed max-w-[500px] mt-2 mb-5 ${categoryInfo?.image_url ? "text-white/80" : "text-surface-500"}`}>
                {categoryInfo.description}
              </p>
            )}
            <div className={`flex items-center gap-3 mt-4 ${categoryInfo?.image_url ? "text-white/70" : ""}`}>
              <span className="text-sm font-medium">{total} products available</span>
              {vendors.length > 0 && (
                <span className="text-sm opacity-70">· {vendors.length} vendors</span>
              )}
            </div>
          </div>
          {/* Search bar */}
          <div className="w-full md:w-[360px]">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder={`Search in ${categoryName}…`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchProducts()}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 text-sm bg-white outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container mx-auto px-6 md:px-8 py-8">

        {/* ── Tabs + toolbar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="flex bg-surface-100 rounded-xl p-1">
              <button
                onClick={() => setMainTab("products")}
                className={`px-5 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${mainTab === "products" ? "bg-white text-surface-900 shadow-sm" : "bg-transparent text-surface-500 hover:text-surface-700"}`}
              >
                Products
                {total > 0 && <span className="ml-1.5 text-xs text-surface-400">({total})</span>}
              </button>
              <button
                onClick={() => setMainTab("vendors")}
                className={`px-5 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${mainTab === "vendors" ? "bg-white text-surface-900 shadow-sm" : "bg-transparent text-surface-500 hover:text-surface-700"}`}
              >
                Vendors
                {vendors.length > 0 && <span className="ml-1.5 text-xs text-surface-400">({vendors.length})</span>}
              </button>
            </div>

            {mainTab === "products" && (
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium text-surface-600 bg-white cursor-pointer hover:border-surface-300 transition-colors relative"
              >
                <Filter size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {mainTab === "products" && (
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-surface-200 rounded-xl px-4 py-2 text-sm text-surface-700 bg-white outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <div className="flex border border-surface-200 rounded-xl overflow-hidden bg-white">
                <button onClick={() => setView("grid")} className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "grid" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400"}`}>
                  <LayoutGrid size={15} />
                </button>
                <button onClick={() => setView("list")} className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "list" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400"}`}>
                  <List size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">

          {/* ── Sidebar filters ── */}
          {mainTab === "products" && (
            <aside className="w-[220px] flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-xl border border-surface-200 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-semibold text-surface-900">Filters</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-brand-600 font-medium border-none bg-transparent cursor-pointer hover:text-brand-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Price range */}
                <div className="mb-5 pb-5 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-800 mb-3">Price range</p>
                  {priceRanges.map((p, i) => (
                    <label key={p.label} className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={() => setPriceIdx(i)}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${priceIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
                        {priceIdx === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-sm transition-colors ${priceIdx === i ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>{p.label}</span>
                    </label>
                  ))}
                </div>

                {/* Tags (from DB) */}
                {filters.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-surface-800 mb-3">Tags</p>
                    {filters.tags.map(t => (
                      <CheckboxFilter
                        key={t}
                        label={t}
                        checked={selectedTags.includes(t)}
                        onChange={() => toggleTag(t)}
                      />
                    ))}
                  </div>
                )}

                {filters.tags.length === 0 && !loading && (
                  <p className="text-xs text-surface-400 italic">No additional filters for this category.</p>
                )}
              </div>
            </aside>
          )}

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {activeFilterCount > 0 && mainTab === "products" && (
              <div className="flex flex-wrap gap-2 mb-5">
                {priceIdx > 0 && (
                  <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                    {priceRanges[priceIdx].label}
                    <button onClick={() => setPriceIdx(0)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
                  </span>
                )}
                {selectedTags.map(t => (
                  <span key={t} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                    {t}
                    <button onClick={() => toggleTag(t)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}

            {mainTab === "products" && (
              <>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-surface-100 rounded-xl h-[280px] animate-pulse" />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 text-center">
                    <Search size={40} className="text-surface-300 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-surface-700 mb-2">No products found</p>
                    <p className="text-sm text-surface-400">Try adjusting your filters or check back later.</p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 text-sm text-brand-600 font-medium border-none bg-transparent cursor-pointer hover:text-brand-700"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : view === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((p, i) => <ProductCard key={p.id || i} product={p} lang={lang} />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map((p, i) => {
                      const href = p.vendor_slug && p.slug
                        ? `/${lang}/${p.vendor_slug}/${p.slug}`
                        : `/${lang}/product/${p.id}`;
                      return (
                        <Link key={p.id || i} href={href} className="no-underline">
                          <div className="bg-white rounded-xl border border-surface-200 flex items-center gap-4 p-4 hover:border-brand-200 transition-all group">
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100 relative">
                              {p.image ? (
                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                              ) : (
                                <div className="h-full bg-gradient-to-br from-brand-50 to-brand-100" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-surface-800 mb-0.5 group-hover:text-brand-600 transition-colors truncate">{p.name}</p>
                              <p className="text-xs text-surface-400 mb-1.5 truncate">{p.vendor}</p>
                              <div className="flex items-center gap-1">
                                <Star size={11} className="fill-warm-400 text-warm-400" />
                                <span className="text-xs font-semibold text-surface-600">{p.rating?.toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <span className="font-bold text-lg text-surface-900">${p.price.toFixed(2)}</span>
                              {p.originalPrice && (
                                <p className="text-xs text-surface-400 line-through">${p.originalPrice.toFixed(2)}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {mainTab === "vendors" && (
              <>
                {vendors.length === 0 && !loading ? (
                  <div className="py-20 text-center">
                    <Package size={40} className="text-surface-300 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-surface-700 mb-2">No vendors yet</p>
                    <p className="text-sm text-surface-400">Be the first vendor in this category!</p>
                    <Link href={`/${lang}/apply`} className="inline-block mt-4 bg-brand-600 text-white rounded-xl px-6 py-2.5 text-sm font-semibold no-underline hover:bg-brand-700 transition-colors">
                      Apply as Vendor
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {vendors.map((v, i) => <VendorCard key={v.id || i} vendor={v} lang={lang} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="absolute right-0 top-0 bottom-0 bg-white w-[300px] p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-surface-900 text-lg">Filters</p>
              <button onClick={() => setShowMobileFilters(false)} className="border-none bg-transparent cursor-pointer">
                <X size={20} className="text-surface-500" />
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-surface-100">
              <p className="text-sm font-semibold text-surface-800 mb-3">Price range</p>
              {priceRanges.map((p, i) => (
                <label key={p.label} className="flex items-center gap-2.5 py-2 cursor-pointer" onClick={() => setPriceIdx(i)}>
                  <div className={`w-4 h-4 rounded-full border-2 ${priceIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300"}`} />
                  <span className="text-sm text-surface-600">{p.label}</span>
                </label>
              ))}
            </div>

            {filters.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-surface-800 mb-3">Tags</p>
                {filters.tags.map(t => (
                  <CheckboxFilter
                    key={t}
                    label={t}
                    checked={selectedTags.includes(t)}
                    onChange={() => toggleTag(t)}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-brand-600 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
