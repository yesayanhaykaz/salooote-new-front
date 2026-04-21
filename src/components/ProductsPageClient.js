"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { SAMPLE_PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES, EVENT_TYPES, PRODUCT_SECTIONS } from "@/lib/data";
import { productsAPI, categoriesAPI } from "@/lib/api";
import {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music, Heart,
  Search, SlidersHorizontal, ChevronRight, X, Star,
} from "lucide-react";

const catIcons = { Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music, Heart };
const catImages = {
  Cakes:         "/images/wedding-cake.jpg",
  Catering:      "/images/catering-setup.jpg",
  Flowers:       "/images/flowers-roses.jpg",
  Balloons:      "/images/balloons-blue.jpg",
  "Party Props": "/images/party-balloons.jpg",
  "DJ & Music":  "/images/hero-dj.jpg",
};

const sectionImages = {
  Cakes:    ["/images/wedding-cake.jpg", "/images/wedding-cake2.jpg", "/images/cupcakes.jpg", "/images/cookies-box.jpg", "/images/cookies-box2.jpg"],
  Catering: ["/images/catering-setup.jpg", "/images/catering-buffet.jpg", "/images/event-dinner.jpg", "/images/catering-setup.jpg", "/images/catering-buffet.jpg"],
  Flowers:  ["/images/flowers-roses.jpg", "/images/wedding-arch-beach.jpg", "/images/flowers-roses.jpg", "/images/wedding-ceremony.jpg", "/images/flowers-roses.jpg"],
};

const eventColors = {
  Birthdays:          "bg-blue-50 border-blue-100",
  Weddings:           "bg-pink-50 border-pink-100",
  "Flowers & Gifts":  "bg-green-50 border-green-100",
  Parties:            "bg-amber-50 border-amber-100",
};

export default function ProductsPageClient({ dict, lang }) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [rawProducts, setRawProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const params = { locale: lang, limit: 50 };
    if (selectedCat) params.category = selectedCat;
    if (search) params.search = search;

    productsAPI.list(params).then(res => {
      {
        setRawProducts((res?.data || []).map(p => ({
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
          category: p.category_name || "",
          status: p.status,
          gradient: "from-brand-50 to-brand-100",
        })));
      }
    }).catch(() => {});

    categoriesAPI.list(lang).then(res => {
      const gradients = [
        "from-pink-400 via-rose-400 to-red-400",
        "from-orange-400 via-amber-400 to-yellow-300",
        "from-rose-400 via-pink-400 to-fuchsia-400",
        "from-blue-400 via-cyan-400 to-sky-300",
        "from-violet-500 via-purple-400 to-indigo-400",
        "from-green-400 via-emerald-400 to-teal-400",
      ];
      setCategories((res?.data || []).map((c, i) => ({
        name: c.name,
        slug: c.slug,
        icon: "Gift",
        gradient: gradients[i % gradients.length],
        count: c.product_count || 0,
      })));
    }).catch(() => {});
  }, [lang, selectedCat]);

  const allProducts = useMemo(() => {
    return rawProducts.map((p, i) => ({ ...p, id: typeof p.id === "string" ? p.id : i + 1 }));
  }, [rawProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase());
      const matchRating = p.rating >= minRating;
      const numPrice = typeof p.price === "string" ? parseFloat(p.price.replace(/[^0-9.]/g, "")) : p.price;
      const matchPrice = numPrice <= maxPrice;
      return matchSearch && matchRating && matchPrice;
    });
  }, [allProducts, search, minRating, maxPrice]);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Breadcrumb ── */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-surface-400">
            <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors no-underline">{dict.nav.home}</Link>
            <ChevronRight size={12} />
            <span className="text-surface-700 font-medium">Products</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 py-12 flex items-center justify-between gap-8 flex-wrap">
          <motion.div
            className="max-w-[500px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">Everything in one place</p>
            <h1 className="text-5xl font-bold text-surface-900 leading-tight mb-4">All Products</h1>
            <p className="text-surface-500 text-base leading-relaxed mb-8 max-w-[420px]">
              Thousands of products from verified vendors — cakes, catering, flowers, music, and more for every occasion.
            </p>
            {/* Search bar */}
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-surface-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-[380px] pl-10 pr-4 py-3 border border-surface-200 rounded-xl text-sm bg-white placeholder:text-surface-400 outline-none focus:border-brand-400 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 text-surface-400 hover:text-surface-700 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            className="relative w-[260px] h-[200px] flex-shrink-0 hidden md:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Image src="/images/cupcakes.jpg" alt="Products" fill className="object-cover rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Filter bar (mobile toggle) ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-surface-200 shadow-sm">
        <div className="max-w-container mx-auto px-6 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {/* Rating quick filters */}
            {[0, 4, 4.5].map((r) => (
              <motion.button
                key={r}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  minRating === r
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"
                }`}
              >
                <Star size={11} className={minRating === r ? "fill-white" : "fill-warm-400 text-warm-400"} />
                {r === 0 ? "All" : `${r}+`}
              </motion.button>
            ))}

            {/* Price filter */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-xs text-surface-500 whitespace-nowrap">Max ${maxPrice}</span>
              <input
                type="range"
                min={20}
                max={300}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-brand-600 cursor-pointer"
              />
            </div>
          </div>

          <motion.button
            onClick={() => setFiltersOpen(!filtersOpen)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-surface-200 text-xs font-semibold text-surface-600 hover:border-brand-400 hover:text-brand-600 transition-all bg-white cursor-pointer flex-shrink-0"
          >
            <SlidersHorizontal size={13} /> Filters
          </motion.button>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-surface-100"
            >
              <div className="max-w-container mx-auto px-6 md:px-8 py-4">
                <p className="text-xs font-semibold text-surface-700 mb-3">Filter by category</p>
                <div className="flex gap-2 flex-wrap">
                  <motion.button
                    onClick={() => setSelectedCat(null)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      !selectedCat ? "bg-brand-600 text-white border-brand-600" : "bg-white text-surface-600 border-surface-200"
                    }`}
                  >
                    All
                  </motion.button>
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.slug}
                      onClick={() => setSelectedCat(selectedCat === cat.slug ? null : cat.slug)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        selectedCat === cat.slug ? "bg-brand-600 text-white border-brand-600" : "bg-white text-surface-600 border-surface-200"
                      }`}
                    >
                      {cat.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-container mx-auto px-6 md:px-8">

        {/* ── Event types ── */}
        <section className="py-10">
          <p className="text-sm font-semibold text-surface-700 mb-5">Shop by occasion</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EVENT_TYPES.map((ev, i) => {
              const Icon = catIcons[ev.icon] || Gift;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/${lang}/category`} className="no-underline">
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.10)" }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-xl p-5 border ${eventColors[ev.title] || "bg-brand-50 border-brand-100"} cursor-pointer`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                          <Icon size={16} className="text-brand-600" strokeWidth={1.5} />
                        </div>
                        <span className="font-semibold text-sm text-surface-800">{ev.title}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ev.tags.slice(0, 4).map((tag, j) => (
                          <span key={j} className="text-xs bg-white/70 text-surface-600 px-2 py-0.5 rounded-full border border-white/60">{tag}</span>
                        ))}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="pb-10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xl font-bold text-surface-900">{dict.nav.categories}</p>
            <Link href={`/${lang}/category`} className="text-sm font-medium text-brand-600 no-underline flex items-center gap-1 hover:gap-2 transition-all">
              {dict.categories.viewAll} <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((cat, i) => {
              const Icon = catIcons[cat.icon] || Gift;
              const imgSrc = catImages[cat.name];
              return (
                <Link key={i} href={`/${lang}/category/${cat.slug}`} className="no-underline flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-[124px] h-[156px] rounded-xl overflow-hidden relative border border-surface-200 group cursor-pointer"
                  >
                    {imgSrc
                      ? <Image src={imgSrc} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      : <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-white/85 flex items-center justify-center">
                      <Icon size={16} className="text-brand-600" strokeWidth={1.5} />
                    </div>
                    <div className="absolute bottom-2.5 left-0 right-0 text-center">
                      <span className="text-xs font-semibold text-white">{cat.name}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Filtered search results ── */}
        {(search || minRating > 0 || maxPrice < 300) && (
          <section className="pb-12">
            <div className="flex items-center justify-between mb-5">
              <p className="text-lg font-bold text-surface-900">
                Search results <span className="text-surface-400 font-normal text-sm">({filtered.length} items)</span>
              </p>
              <button
                onClick={() => { setSearch(""); setMinRating(0); setMaxPrice(300); }}
                className="text-xs text-brand-600 font-medium flex items-center gap-1 cursor-pointer bg-transparent border-none hover:underline"
              >
                <X size={12} /> Clear filters
              </button>
            </div>
            {filtered.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <ProductCard product={p} lang={lang} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-surface-400 text-sm">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </section>
        )}

        {/* ── Products by section ── */}
        {!search && minRating === 0 && maxPrice >= 300 && PRODUCT_SECTIONS.map((section, si) => {
          const Icon = catIcons[section.icon] || Gift;
          const imgs = sectionImages[section.title] || [];
          const sectionProducts = rawProducts.slice(0, 5).map((p, i) => ({
            ...p, id: si * 10 + i + 1, image: imgs[i] || null,
          }));
          return (
            <section key={si} className="pb-16">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={18} className="text-brand-600" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-surface-900">{section.title}</h2>
                  </div>
                  <p className="text-surface-400 text-sm max-w-[340px]">{section.desc}</p>
                </div>
                <Link href={`/${lang}/category`} className="text-sm font-medium text-brand-600 no-underline flex items-center gap-1 hover:gap-2 transition-all">
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {sectionProducts.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <ProductCard product={p} lang={lang} />
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {sectionProducts.map((p, i) => (
                  <motion.div
                    key={i + 5}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <ProductCard product={{ ...p, id: p.id + 5 }} lang={lang} />
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}

        {/* ── Promo banner ── */}
        <section className="pb-16">
          <motion.div
            className="rounded-2xl overflow-hidden relative min-h-[200px] flex items-center bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-100"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative z-10 p-10 md:p-14 max-w-[480px]">
              <p className="text-brand-600 text-xs font-bold uppercase tracking-widest mb-2">Limited Time</p>
              <h2 className="text-4xl font-bold text-surface-900 leading-tight mb-2">Yearly Sale</h2>
              <p className="text-surface-600 text-base mb-6">On all birthday decoration items.</p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 10px 28px -4px rgba(225,29,92,0.36)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer"
              >
                Shop the Sale
              </motion.button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-[260px] overflow-hidden hidden md:block">
              <Image src="/images/party-balloons2.jpg" alt="Sale" fill className="object-cover object-left opacity-30" />
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
