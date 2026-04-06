"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { SAMPLE_PRODUCTS, VENDORS } from "@/lib/data";
import { Star, LayoutGrid, List, ChevronDown, ChevronRight, MapPin, Package, CheckCircle2, X, SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = ["Most Popular", "Newest", "Price: Low–High", "Price: High–Low", "Highest Rated"];

const allProducts = [...SAMPLE_PRODUCTS, ...SAMPLE_PRODUCTS].slice(0, 16).map((p, i) => ({ ...p, id: i + 1 }));

const vendorImages = {
  1: "/images/wedding-cake.jpg",   2: "/images/flowers-roses.jpg",
  3: "/images/party-balloons.jpg", 4: "/images/cupcakes.jpg",
  5: "/images/catering-setup.jpg", 6: "/images/wedding-cake2.jpg",
  7: "/images/balloons-blue.jpg",  8: "/images/catering-buffet.jpg",
  9: "/images/event-dinner.jpg",
};

function VendorCard({ vendor }) {
  const imgSrc = vendorImages[vendor.id] || "/images/wedding-cake.jpg";
  return (
    <Link href="/vendor" className="no-underline">
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden hover:border-brand-200 hover:-translate-y-1 transition-all cursor-pointer group">
        <div className="relative h-[148px] overflow-hidden">
          <Image src={imgSrc} alt={vendor.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star size={10} className="fill-warm-400 text-warm-400" />
            <span className="text-xs font-bold text-surface-700">{vendor.rating}</span>
          </div>
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-semibold text-sm leading-tight">{vendor.name}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs bg-brand-50 text-brand-600 border border-brand-100 rounded-full px-2.5 py-0.5 font-medium">{vendor.category}</span>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-brand-500" />
              <span className="text-xs text-surface-400">Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
            <span className="flex items-center gap-1"><Package size={10} />{Math.floor(vendor.id * 37 + 50)} products</span>
            <span className="flex items-center gap-1"><MapPin size={10} />Yerevan</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const FILTER_CONTAINERS = ["Clay vase", "Basket", "Box"];
const FILTER_COLORS = ["Multicolored", "Beige", "Yellow", "Green", "Blue", "Red"];
const FILTER_TYPES  = ["Bouquet", "Arrangement", "Sweet arrangement"];
const PRICE_RANGES  = [
  { label: "Any price",    min: 0,   max: Infinity },
  { label: "Under $50",    min: 0,   max: 50       },
  { label: "$50–$100",     min: 50,  max: 100      },
  { label: "$100–$200",    min: 100, max: 200      },
  { label: "$200+",        min: 200, max: Infinity },
];

export default function CategoryPage() {
  const [mainTab, setMainTab]           = useState("products");
  const [view, setView]                 = useState("grid");
  const [sort, setSort]                 = useState("Most Popular");
  const [priceIdx, setPriceIdx]         = useState(0);
  const [selectedColors, setSelectedColors]   = useState([]);
  const [selectedTypes, setSelectedTypes]     = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleColor = (c) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleType  = (t) => setSelectedTypes(prev  => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const pr = PRICE_RANGES[priceIdx];
  const filtered = allProducts.filter(p => {
    if (p.price < pr.min || p.price >= pr.max) return false;
    return true;
  });

  const activeFilterCount = (priceIdx > 0 ? 1 : 0) + selectedColors.length + selectedTypes.length;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 py-12 flex items-center justify-between gap-8 flex-wrap">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-surface-400 mb-4">
              <Link href="/" className="hover:text-brand-600 no-underline text-surface-400 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-surface-700 font-medium">Cakes & Desserts</span>
            </div>
            <h1 className="text-5xl font-bold text-surface-900 mb-3">Cakes</h1>
            <p className="text-surface-500 text-base leading-relaxed max-w-[400px] mb-6">
              Dive into the best of both worlds — from classic wedding tiers to custom celebration cakes.
            </p>
            <Link href="/category">
              <button className="btn-primary bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer">
                Shop Now
              </button>
            </Link>
          </div>
          <div className="relative w-[240px] h-[180px] flex-shrink-0 hidden md:block">
            <Image src="/images/wedding-cake.jpg" alt="Cakes" fill className="object-cover rounded-2xl" />
          </div>
        </div>
      </section>

      <div className="max-w-container mx-auto px-6 md:px-8 py-8">

        {/* ── Tabs + toolbar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {/* Product/Vendor tabs */}
            <div className="flex bg-surface-100 rounded-xl p-1">
              <button
                onClick={() => setMainTab("products")}
                className={`px-5 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${mainTab === "products" ? "bg-white text-surface-900 shadow-sm" : "bg-transparent text-surface-500 hover:text-surface-700"}`}
              >
                All Cakes
              </button>
              <button
                onClick={() => setMainTab("vendors")}
                className={`px-5 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${mainTab === "vendors" ? "bg-white text-surface-900 shadow-sm" : "bg-transparent text-surface-500 hover:text-surface-700"}`}
              >
                Vendors
              </button>
            </div>

            {/* Mobile filter button */}
            {mainTab === "products" && (
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium text-surface-600 bg-white cursor-pointer hover:border-surface-300 transition-colors relative"
              >
                <SlidersHorizontal size={15} />
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
              <p className="text-sm text-surface-400 hidden md:block">
                <span className="font-semibold text-surface-700">{filtered.length}</span> products
              </p>
              <select
                value={sort} onChange={e => setSort(e.target.value)}
                className="border border-surface-200 rounded-xl px-4 py-2 text-sm text-surface-700 bg-white outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
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

          {/* ── Sidebar ── */}
          {mainTab === "products" && (
            <aside className="w-[220px] flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-xl border border-surface-200 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-semibold text-surface-900">Filters</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { setPriceIdx(0); setSelectedColors([]); setSelectedTypes([]); }}
                      className="text-xs text-brand-600 font-medium border-none bg-transparent cursor-pointer hover:text-brand-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Price */}
                <div className="mb-5 pb-5 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-800 mb-3">Price range</p>
                  {PRICE_RANGES.map((p, i) => (
                    <label key={p.label} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${priceIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}
                        onClick={() => setPriceIdx(i)}
                      >
                        {priceIdx === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-sm transition-colors ${priceIdx === i ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>{p.label}</span>
                    </label>
                  ))}
                </div>

                {/* Color */}
                <div className="mb-5 pb-5 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-800 mb-3">Color</p>
                  {FILTER_COLORS.map(c => (
                    <label key={c} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedColors.includes(c) ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}
                        onClick={() => toggleColor(c)}
                      >
                        {selectedColors.includes(c) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${selectedColors.includes(c) ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>{c}</span>
                    </label>
                  ))}
                </div>

                {/* Type */}
                <div>
                  <p className="text-sm font-semibold text-surface-800 mb-3">Type</p>
                  {FILTER_TYPES.map(t => (
                    <label key={t} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedTypes.includes(t) ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}
                        onClick={() => toggleType(t)}
                      >
                        {selectedTypes.includes(t) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${selectedTypes.includes(t) ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>{t}</span>
                    </label>
                  ))}
                </div>
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
                    {PRICE_RANGES[priceIdx].label}
                    <button onClick={() => setPriceIdx(0)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
                  </span>
                )}
                {selectedColors.map(c => (
                  <span key={c} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                    {c}
                    <button onClick={() => toggleColor(c)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
                  </span>
                ))}
                {selectedTypes.map(t => (
                  <span key={t} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                    {t}
                    <button onClick={() => toggleType(t)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Products grid */}
            {mainTab === "products" && (
              <>
                {view === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((p, i) => <ProductCard key={i} product={p} />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map((p, i) => (
                      <Link key={i} href="/product" className="no-underline">
                        <div className="bg-white rounded-xl border border-surface-200 flex items-center gap-4 p-4 hover:border-brand-200 transition-all group">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100 relative">
                            <div className={`h-full bg-gradient-to-br ${p.gradient || "from-brand-50 to-brand-100"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-surface-800 mb-0.5 group-hover:text-brand-600 transition-colors">{p.name}</p>
                            <p className="text-xs text-surface-400 mb-1.5">{p.vendor}</p>
                            <div className="flex items-center gap-1">
                              <Star size={11} className="fill-warm-400 text-warm-400" />
                              <span className="text-xs font-semibold text-surface-600">{p.rating}</span>
                            </div>
                          </div>
                          <span className="font-bold text-lg text-surface-900 flex-shrink-0">${p.price.toFixed(2)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="text-center mt-10">
                  <button className="border border-surface-200 rounded-xl px-8 py-3 text-sm font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent cursor-pointer">
                    Load more products
                  </button>
                </div>
              </>
            )}

            {/* Vendors grid */}
            {mainTab === "vendors" && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {VENDORS.map((v, i) => <VendorCard key={i} vendor={v} />)}
                </div>
                <div className="text-center mt-10">
                  <button className="border border-surface-200 rounded-xl px-8 py-3 text-sm font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent cursor-pointer">
                    Load more vendors
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilters && (
        <div className="modal-overlay fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="modal-content absolute right-0 top-0 bottom-0 bg-white w-[300px] p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-surface-900 text-lg">Filters</p>
              <button onClick={() => setShowMobileFilters(false)} className="border-none bg-transparent cursor-pointer">
                <X size={20} className="text-surface-500" />
              </button>
            </div>
            {/* Same filter content as sidebar — simplified */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-surface-800 mb-3">Price range</p>
              {PRICE_RANGES.map((p, i) => (
                <label key={p.label} className="flex items-center gap-2.5 py-2 cursor-pointer" onClick={() => setPriceIdx(i)}>
                  <div className={`w-4 h-4 rounded-full border-2 ${priceIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300"}`} />
                  <span className="text-sm text-surface-600">{p.label}</span>
                </label>
              ))}
            </div>
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
