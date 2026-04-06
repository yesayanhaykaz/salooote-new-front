"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SAMPLE_PRODUCTS, REVIEWS } from "@/lib/data";
import {
  Star, Filter, ArrowLeft, LayoutGrid, List, ChevronDown,
  Search, MapPin, CheckCircle2, MessageCircle, ShoppingCart,
  Heart, SlidersHorizontal, X
} from "lucide-react";
import ProductPopup from "@/components/ProductPopup";

const PRICE_RANGES = ["Any price", "Under $50", "$50–$100", "$100–$200", "$200+"];
const SORT_OPTIONS = ["Most Popular", "Newest", "Price: Low–High", "Price: High–Low", "Highest Rated"];
const DELIVERY = ["Same Day", "Next Day", "2–3 Days"];

const vendor = {
  name: "Royal Bakes",
  category: "Cakes & Desserts",
  rating: 4.9,
  reviewCount: 320,
  sales: "2.1K",
  location: "Yerevan, Armenia",
  since: "2019",
  image: "/images/vendor-woman.jpg",
  cover: "/images/wedding-cake.jpg",
};

const allProducts = [
  ...SAMPLE_PRODUCTS,
  ...SAMPLE_PRODUCTS.map((p, i) => ({ ...p, id: p.id + 8, name: p.name + " — Premium" })),
].slice(0, 16).map((p, i) => ({ ...p, id: i + 1 }));

export default function VendorCatalogPage() {
  const [view, setView] = useState("grid");
  const [priceRange, setPriceRange] = useState("Any price");
  const [sort, setSort] = useState("Most Popular");
  const [search, setSearch] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState([]);
  const [popup, setPopup] = useState(null);

  const toggleRating = (r) =>
    setSelectedRatings((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const toggleDelivery = (d) =>
    setSelectedDelivery((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const filtered = allProducts.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (priceRange === "Under $50" && p.price >= 50) return false;
    if (priceRange === "$50–$100" && (p.price < 50 || p.price > 100)) return false;
    if (priceRange === "$100–$200" && (p.price < 100 || p.price > 200)) return false;
    if (priceRange === "$200+" && p.price < 200) return false;
    if (selectedRatings.length > 0 && !selectedRatings.some((r) => p.rating >= r)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Vendor banner */}
      <div className="relative h-[200px] overflow-hidden">
        <Image src={vendor.cover} alt="Vendor Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900/85 via-surface-900/55 to-transparent" />
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-8 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
            <Link href="/" className="hover:text-white no-underline text-white/60">Home</Link>
            <span>/</span>
            <Link href="/vendor" className="hover:text-white no-underline text-white/60">Royal Bakes</Link>
            <span>/</span>
            <span className="text-white">Catalog</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/30 flex-shrink-0">
              <Image src={vendor.image} alt={vendor.name} width={56} height={56} className="object-cover w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-[28px] font-bold text-white">{vendor.name}</h1>
                <CheckCircle2 size={16} className="text-brand-300" />
              </div>
              <div className="flex items-center gap-4 text-white/60 text-xs mt-1">
                <div className="flex items-center gap-1">
                  <Star size={11} className="fill-warm-400 text-warm-400" />
                  <span className="text-white font-semibold">{vendor.rating}</span>
                  <span>({vendor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={11} />
                  <span>{vendor.location}</span>
                </div>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Link href="/vendor">
                <button className="bg-white/15 text-white border border-white/25 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-white/25 transition-all flex items-center gap-1.5">
                  <ArrowLeft size={13} /> Back to Shop
                </button>
              </Link>
              <button className="bg-brand-600 text-white border-none rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer shadow-glow flex items-center gap-1.5">
                <MessageCircle size={13} /> Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 md:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-[240px] flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl p-5 border border-surface-100 shadow-soft sticky top-24">
              <h3 className="font-semibold text-surface-800 text-[14px] mb-4 flex items-center gap-2">
                <Filter size={14} className="text-brand-500" /> Filters
              </h3>

              {/* Search */}
              <div className="flex items-center bg-surface-50 rounded-xl px-3 py-2.5 border border-surface-200 mb-5 focus-within:border-brand-300 transition-colors">
                <Search size={13} className="text-surface-400 mr-2 flex-shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 bg-transparent border-none outline-none text-[12.5px] text-surface-700 placeholder:text-surface-400"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="border-none bg-transparent cursor-pointer p-0">
                    <X size={12} className="text-surface-400" />
                  </button>
                )}
              </div>

              {/* Price */}
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide mb-3">Price Range</p>
                {PRICE_RANGES.map((r) => (
                  <label key={r} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === r}
                      onChange={() => setPriceRange(r)}
                      className="accent-brand-600"
                    />
                    <span className="text-[13px] text-surface-600">{r}</span>
                  </label>
                ))}
              </div>

              {/* Rating */}
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide mb-3">Rating</p>
                {[5, 4, 3].map((r) => (
                  <label key={r} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(r)}
                      onChange={() => toggleRating(r)}
                      className="accent-brand-600"
                    />
                    <div className="flex gap-0.5">
                      {[...Array(r)].map((_, i) => (
                        <Star key={i} size={11} className="fill-warm-500 text-warm-500" />
                      ))}
                    </div>
                    <span className="text-[12px] text-surface-500">& up</span>
                  </label>
                ))}
              </div>

              {/* Delivery */}
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide mb-3">Delivery</p>
                {DELIVERY.map((d) => (
                  <label key={d} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDelivery.includes(d)}
                      onChange={() => toggleDelivery(d)}
                      className="accent-brand-600"
                    />
                    <span className="text-[13px] text-surface-600">{d}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => { setPriceRange("Any price"); setSelectedRatings([]); setSelectedDelivery([]); setSearch(""); }}
                className="w-full mt-2 bg-brand-600 text-white border-none rounded-xl py-2.5 text-[13px] font-semibold cursor-pointer hover:bg-brand-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={() => { setPriceRange("Any price"); setSelectedRatings([]); setSelectedDelivery([]); setSearch(""); }}
                className="w-full mt-2 bg-transparent text-surface-400 border-none text-[12px] cursor-pointer hover:text-surface-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-surface-500 text-[13px]">
                <span className="font-bold text-surface-800">{filtered.length}</span> products
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border border-surface-200 rounded-xl px-4 py-2.5 text-[12.5px] font-medium text-surface-700 outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <div className="flex border border-surface-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setView("grid")}
                    className={`px-3 py-2.5 border-none cursor-pointer transition-colors ${view === "grid" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400 hover:bg-surface-50"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`px-3 py-2.5 border-none cursor-pointer transition-colors ${view === "list" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400 hover:bg-surface-50"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((product, i) => (
                  <CatalogCard key={i} product={product} onQuickView={() => setPopup(product)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((product, i) => (
                  <ListCard key={i} product={product} onQuickView={() => setPopup(product)} />
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <p className="text-surface-300 text-5xl mb-4">🔍</p>
                <p className="text-surface-500 font-medium">No products match your filters</p>
                <button
                  onClick={() => { setPriceRange("Any price"); setSelectedRatings([]); setSearch(""); }}
                  className="mt-4 text-brand-600 text-sm font-semibold hover:underline border-none bg-transparent cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="text-center mt-10">
                <button className="border border-surface-200 rounded-2xl px-8 py-3 text-[13px] font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent cursor-pointer">
                  Load more products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick-view popup */}
      {popup && <ProductPopup product={popup} onClose={() => setPopup(null)} />}
    </div>
  );
}

/* ── Catalog card (grid view) ── */
function CatalogCard({ product, onQuickView }) {
  const images = {
    1: "/images/wedding-cake.jpg", 2: "/images/party-balloons.jpg",
    3: "/images/flowers-roses.jpg", 4: "/images/cupcakes.jpg",
    5: "/images/catering-setup.jpg", 6: "/images/wedding-cake2.jpg",
    7: "/images/flowers-roses.jpg", 8: "/images/party-hats.jpg",
  };
  const imgSrc = images[product.id] || null;

  return (
    <div className="product-card bg-white rounded-2xl border border-surface-200/60 overflow-hidden shadow-card group">
      <div className="h-[175px] relative overflow-hidden">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`h-full bg-gradient-to-br ${product.gradient || "from-brand-50 to-brand-100"}`} />
        )}
        {product.tag && (
          <span className="absolute top-3 left-3 badge-glow text-white text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide">
            {product.tag}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm hover:bg-white transition-all group/heart"
        >
          <Heart size={14} className="text-surface-400 group-hover/heart:text-accent-500 transition-all" />
        </button>
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={onQuickView}
            className="bg-white text-surface-800 border-none rounded-xl px-4 py-2 text-[12px] font-semibold cursor-pointer shadow-md hover:bg-brand-600 hover:text-white transition-all"
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="p-4">
        <Link href="/product" className="no-underline">
          <p className="text-[13px] font-semibold leading-snug text-surface-800 mb-1 line-clamp-2 hover:text-brand-700 transition-colors">
            {product.name}
          </p>
        </Link>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-surface-400 font-medium truncate max-w-[120px]">{product.vendor}</span>
          <div className="flex items-center gap-0.5">
            <Star size={11} className="fill-warm-500 text-warm-500" />
            <span className="text-[11px] text-surface-500 font-semibold">{product.rating}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-[16px] text-surface-900">${product.price.toFixed(2)}</span>
          <button
            onClick={(e) => e.preventDefault()}
            className="bg-brand-600 text-white border-none rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-brand-700 hover:shadow-glow transition-all"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── List card (list view) ── */
function ListCard({ product, onQuickView }) {
  const images = {
    1: "/images/wedding-cake.jpg", 2: "/images/party-balloons.jpg",
    3: "/images/flowers-roses.jpg", 4: "/images/cupcakes.jpg",
    5: "/images/catering-setup.jpg", 6: "/images/wedding-cake2.jpg",
    7: "/images/flowers-roses.jpg", 8: "/images/party-hats.jpg",
  };
  const imgSrc = images[product.id] || null;

  return (
    <div className="bg-white rounded-2xl border border-surface-100 shadow-soft overflow-hidden flex items-center gap-5 p-4 hover:border-brand-200 hover:shadow-md transition-all group">
      <div className="w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0 relative">
        {imgSrc ? (
          <Image src={imgSrc} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`h-full bg-gradient-to-br ${product.gradient || "from-brand-50 to-brand-100"}`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link href="/product" className="no-underline">
          <p className="text-[14px] font-semibold text-surface-800 mb-1 hover:text-brand-700 transition-colors line-clamp-1">
            {product.name}
          </p>
        </Link>
        <p className="text-[12px] text-surface-400 mb-2">{product.vendor}</p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < Math.floor(product.rating) ? "fill-warm-500 text-warm-500" : "text-surface-200"} />
          ))}
          <span className="text-[11px] text-surface-500 ml-1">{product.rating}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onQuickView}
          className="border border-surface-200 rounded-xl px-3 py-2 text-[12px] font-semibold text-surface-600 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent cursor-pointer hidden md:block"
        >
          Quick View
        </button>
        <span className="font-bold text-[18px] text-surface-900">${product.price.toFixed(2)}</span>
        <button className="bg-brand-600 text-white border-none rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-brand-700 hover:shadow-glow transition-all">
          <ShoppingCart size={14} />
        </button>
      </div>
    </div>
  );
}
