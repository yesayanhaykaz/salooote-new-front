"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { productsAPI, categoriesAPI } from "@/lib/api";
import {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music, Heart,
  Search, SlidersHorizontal, ChevronRight, X, Star,
  Camera, Mic2, Utensils, MapPin, Sparkles,
  ShoppingBag as Bag,
} from "lucide-react";

const T = {
  en: {
    breadcrumbHome: "Home",
    breadcrumbProducts: "Products",
    eyebrow: "Everything in one place",
    heroTitle: "All Products",
    heroSub: "Thousands of products from verified vendors — cakes, catering, flowers, music, and more for every occasion.",
    searchPlaceholder: "Search products, vendors…",
    quickFilterAll: "All",
    quickFilterPrefix: "+",
    maxPriceLabel: "Up to",
    filtersBtn: "Filters",
    filterByCat: "Filter by category",
    catAll: "All",
    categoriesLabel: "Categories",
    viewAll: "View all",
    searchResults: "Search results",
    items: "items",
    clearFilters: "Clear filters",
    noResults: "No products found. Try a different keyword or category.",
    allProducts: "All Products",
    loadingMore: "Loading more…",
    allLoaded: "All",
    productsLoaded: "products loaded",
    noProductsYet: "No products available yet. Check back soon!",
    promoEyebrow: "Limited Time",
    promoTitle: "Yearly Sale",
    promoBody: "On all birthday decoration items.",
    promoCta: "Shop the sale",
  },
  hy: {
    breadcrumbHome: "Գլխ․",
    breadcrumbProducts: "Ապրանքներ",
    eyebrow: "Ամեն ինչ մեկ տեղում",
    heroTitle: "Բոլոր Ապրանքները",
    heroSub: "Հազարավոր ապրանքներ ստուգված վաճառողներից՝ տորթեր, քեյթերինգ, ծաղիկներ, երաժշտություն և շատ ավելին։",
    searchPlaceholder: "Որոնել ապրանքներ, վաճառողներ…",
    quickFilterAll: "Բոլորը",
    quickFilterPrefix: "+",
    maxPriceLabel: "Մինչև",
    filtersBtn: "Ֆիլտրեր",
    filterByCat: "Ընտրել կատեգորիա",
    catAll: "Բոլորը",
    categoriesLabel: "Կատեգորիաներ",
    viewAll: "Բոլորը",
    searchResults: "Որոնման արդյունքներ",
    items: "ապրանք",
    clearFilters: "Մաքրել",
    noResults: "Ոչինչ չի գտնվել։ Փորձեք այլ բառ կամ կատեգորիա։",
    allProducts: "Բոլոր Ապրանքները",
    loadingMore: "Բեռնվում է…",
    allLoaded: "Բոլոր",
    productsLoaded: "ապրանքները բեռնված են",
    noProductsYet: "Ապրանքներ դեռ չկան։ Կարող եք ստուգել ավելի ուշ։",
    promoEyebrow: "Սահմանափակ ժամանակ",
    promoTitle: "Տարեկան վաճառք",
    promoBody: "Ծննդյան տոնական զարդարման իրերի վրա։",
    promoCta: "Տեսնել առաջարկները",
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbProducts: "Товары",
    eyebrow: "Всё в одном месте",
    heroTitle: "Все товары",
    heroSub: "Тысячи товаров от проверенных продавцов — торты, кейтеринг, цветы, музыка и многое другое для любого события.",
    searchPlaceholder: "Поиск товаров, продавцов…",
    quickFilterAll: "Все",
    quickFilterPrefix: "+",
    maxPriceLabel: "До",
    filtersBtn: "Фильтры",
    filterByCat: "Фильтр по категории",
    catAll: "Все",
    categoriesLabel: "Категории",
    viewAll: "Смотреть все",
    searchResults: "Результаты поиска",
    items: "товаров",
    clearFilters: "Сбросить",
    noResults: "Ничего не найдено. Попробуйте другой запрос или категорию.",
    allProducts: "Все товары",
    loadingMore: "Загрузка…",
    allLoaded: "Загружено",
    productsLoaded: "товаров",
    noProductsYet: "Товаров пока нет. Заходите позже!",
    promoEyebrow: "Ограниченное время",
    promoTitle: "Годовая распродажа",
    promoBody: "На все товары для дня рождения.",
    promoCta: "К распродаже",
  },
};

const catIcons = {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music, Heart,
  Camera, Mic2, Utensils, MapPin, Sparkles, Star, Bag,
};

const slugIcon = (slug = "") => {
  const s = slug.toLowerCase();
  if (s.includes("cake") || s.includes("pastry") || s.includes("dessert")) return Cake;
  if (s.includes("cater") || s.includes("food") || s.includes("buffet")) return UtensilsCrossed;
  if (s.includes("flower") || s.includes("floral") || s.includes("bouquet")) return Flower2;
  if (s.includes("balloon") || s.includes("party") || s.includes("decor")) return PartyPopper;
  if (s.includes("music") || s.includes("dj") || s.includes("band")) return Music;
  if (s.includes("photo") || s.includes("camera") || s.includes("video")) return Camera;
  if (s.includes("venue") || s.includes("hall") || s.includes("location")) return MapPin;
  if (s.includes("gift") || s.includes("favor")) return Gift;
  if (s.includes("makeup") || s.includes("beauty") || s.includes("hair")) return Sparkles;
  return Gift;
};

// Price slider — products are in AMD, so default ceiling is huge
const PRICE_MIN = 0;
const PRICE_MAX = 2_000_000;
const PRICE_STEP = 50_000;

export default function ProductsPageClient({ dict, lang }) {
  const t = T[lang] || T.en;
  const PAGE_SIZE = 24;
  const searchParams = useSearchParams();

  // Initial state from URL params
  const [search, setSearch] = useState(() => searchParams?.get("search") || searchParams?.get("q") || "");
  const [selectedCat, setSelectedCat] = useState(() => searchParams?.get("category") || null);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [rawProducts, setRawProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);
  const fetchKeyRef = useRef(0);

  const fetchProducts = useCallback(async (pageNum = 1) => {
    const myKey = ++fetchKeyRef.current;
    if (pageNum > 1) setLoadingMore(true); else setLoading(true);
    const params = { locale: lang, limit: PAGE_SIZE, page: pageNum };
    if (selectedCat) params.category = selectedCat;
    if (search) params.search = search;
    try {
      const res = await productsAPI.list(params);
      if (fetchKeyRef.current !== myKey) return;
      const pag = res?.pagination;
      setTotalCount(pag?.total || 0);
      setHasMore(pag?.has_next || false);
      const mapped = (res?.data || []).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug || "",
        vendor_slug: p.vendor_slug || "",
        vendor_id: p.vendor_id || null,
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
      }));
      if (pageNum === 1) setRawProducts(mapped);
      else setRawProducts(prev => [...prev, ...mapped]);
    } catch {}
    finally { setLoadingMore(false); setLoading(false); }
  }, [lang, selectedCat, search]);

  // Reset on filter change
  useEffect(() => { setPage(1); fetchProducts(1); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [fetchProducts]);

  // Load next page
  useEffect(() => { if (page > 1) fetchProducts(page); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page]);

  // IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loadingMore) setPage(p => p + 1);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore]);

  // Categories — same source as homepage (categoriesAPI with current locale)
  useEffect(() => {
    categoriesAPI.list(lang).then(res => {
      const gradients = [
        "from-pink-400 via-rose-400 to-red-400",
        "from-orange-400 via-amber-400 to-yellow-300",
        "from-rose-400 via-pink-400 to-fuchsia-400",
        "from-blue-400 via-cyan-400 to-sky-300",
        "from-fuchsia-500 via-pink-400 to-rose-400",
        "from-green-400 via-emerald-400 to-teal-400",
      ];
      setCategories((res?.data || []).map((c, i) => ({
        name: c.name, slug: c.slug,
        icon: c.icon || null, emoji: c.emoji || null,
        gradient: gradients[i % gradients.length],
        count: c.product_count || 0,
      })));
    }).catch(() => {});
  }, [lang]);

  const allProducts = useMemo(() => {
    return rawProducts.map((p, i) => ({ ...p, id: typeof p.id === "string" ? p.id : i + 1 }));
  }, [rawProducts]);

  // Client-side rating + price filters (search & category are server-side)
  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchRating = (p.rating || 0) >= minRating;
      const numPrice = typeof p.price === "string" ? parseFloat(p.price.replace(/[^0-9.]/g, "")) : (p.price || 0);
      const matchPrice = numPrice <= maxPrice;
      return matchRating && matchPrice;
    });
  }, [allProducts, minRating, maxPrice]);

  const hasActiveFilters = !!search || minRating > 0 || maxPrice < PRICE_MAX || !!selectedCat;
  const fmtAMD = (n) => Number(n || 0).toLocaleString();

  return (
    // overflow-x-clip on root prevents the rare horizontal scroll
    // bug Armenian users were seeing when filter pills push slightly wider
    <div className="min-h-screen bg-white overflow-x-clip">

      {/* ── Breadcrumb ── */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-surface-400 flex-wrap">
            <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors no-underline whitespace-nowrap">
              {t.breadcrumbHome}
            </Link>
            <ChevronRight size={12} className="flex-shrink-0" />
            <span className="text-surface-700 font-medium">{t.breadcrumbProducts}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 py-10 md:py-12 flex items-center justify-between gap-8 flex-wrap">
          <motion.div
            className="max-w-[560px] min-w-0 flex-1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">{t.eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-900 leading-tight mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-surface-500 text-base leading-relaxed mb-7 max-w-[480px]">
              {t.heroSub}
            </p>
            {/* Search bar */}
            <div className="relative flex items-center max-w-[420px]">
              <Search size={16} className="absolute left-4 text-surface-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-3 border border-surface-200 rounded-xl text-sm bg-white placeholder:text-surface-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 transition-all"
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

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-surface-200 shadow-sm">
        <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center gap-3 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0 flex-1 min-w-0">
            {/* Rating quick filters */}
            {[0, 4, 4.5].map((r) => (
              <motion.button
                key={r}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  minRating === r
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"
                }`}
              >
                <Star size={11} className={minRating === r ? "fill-white" : "fill-warm-400 text-warm-400"} />
                {r === 0 ? t.quickFilterAll : `${r}${t.quickFilterPrefix}`}
              </motion.button>
            ))}

            {/* Price filter (AMD-aware) */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-1">
              <span className="text-xs text-surface-500 whitespace-nowrap">
                {t.maxPriceLabel} {fmtAMD(maxPrice)} ֏
              </span>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-28 accent-brand-600 cursor-pointer"
              />
            </div>
          </div>

          <motion.button
            onClick={() => setFiltersOpen(!filtersOpen)}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-surface-200 text-xs font-semibold text-surface-600 hover:border-brand-400 hover:text-brand-600 transition-all bg-white cursor-pointer flex-shrink-0 whitespace-nowrap"
          >
            <SlidersHorizontal size={13} /> {t.filtersBtn}
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
                <p className="text-xs font-semibold text-surface-700 mb-3">{t.filterByCat}</p>
                <div className="flex gap-2 flex-wrap">
                  <motion.button
                    onClick={() => setSelectedCat(null)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      !selectedCat ? "bg-brand-600 text-white border-brand-600" : "bg-white text-surface-600 border-surface-200"
                    }`}
                  >
                    {t.catAll}
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

        {/* ── Categories strip — same source as homepage ── */}
        {categories.length > 0 && (
          <section className="pt-8 pb-10">
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <p className="text-lg sm:text-xl font-bold text-surface-900">{t.categoriesLabel}</p>
              <Link
                href={`/${lang}/category`}
                className="text-sm font-medium text-brand-600 no-underline inline-flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap"
              >
                {t.viewAll} <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-1 px-1">
              {categories.map((cat, i) => {
                const Icon = catIcons[cat.icon] || catIcons[cat.emoji] || slugIcon(cat.slug);
                return (
                  <Link key={i} href={`/${lang}/category/${cat.slug}`} className="no-underline flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-[124px] h-[156px] rounded-xl overflow-hidden relative border border-surface-200 group cursor-pointer"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center">
                        <Icon size={16} className="text-brand-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute bottom-2.5 left-2 right-2 text-center">
                        <span className="text-xs font-semibold text-white line-clamp-2">{cat.name}</span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Filtered search results ── */}
        {hasActiveFilters && (
          <section className="pb-12">
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <p className="text-lg font-bold text-surface-900">
                {t.searchResults}
                <span className="text-surface-400 font-normal text-sm ml-2">
                  ({filtered.length} {t.items})
                </span>
              </p>
              <button
                onClick={() => { setSearch(""); setMinRating(0); setMaxPrice(PRICE_MAX); setSelectedCat(null); }}
                className="text-xs text-brand-600 font-medium inline-flex items-center gap-1 cursor-pointer bg-transparent border-none hover:underline whitespace-nowrap"
              >
                <X size={12} /> {t.clearFilters}
              </button>
            </div>
            {loading && rawProducts.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="bg-surface-100 rounded-xl animate-pulse" style={{ aspectRatio: "4 / 5" }} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.3 }}
                  >
                    <ProductCard product={p} lang={lang} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-surface-400 text-sm">{t.noResults}</p>
              </div>
            )}
          </section>
        )}

        {/* ── All Products ── */}
        {!hasActiveFilters && (
          <section className="pb-16">
            <div className="flex items-center justify-between mb-6">
              <p className="text-lg sm:text-xl font-bold text-surface-900">
                {t.allProducts}
                {totalCount > 0 && (
                  <span className="text-surface-400 font-normal text-sm ml-2">({totalCount} {t.items})</span>
                )}
              </p>
            </div>
            {loading && rawProducts.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="bg-surface-100 rounded-xl animate-pulse" style={{ aspectRatio: "4 / 5" }} />
                ))}
              </div>
            ) : rawProducts.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {rawProducts.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
                    >
                      <ProductCard product={p} lang={lang} />
                    </motion.div>
                  ))}
                </motion.div>
                <div ref={sentinelRef} className="h-10 mt-4" />
                {loadingMore && (
                  <div className="flex justify-center py-6">
                    <div className="inline-flex items-center gap-2 text-sm text-surface-400">
                      <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                      {t.loadingMore}
                    </div>
                  </div>
                )}
                {!hasMore && rawProducts.length > 0 && (
                  <p className="text-center text-xs text-surface-300 py-4">
                    {t.allLoaded} {totalCount} {t.productsLoaded}
                  </p>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-surface-400 text-sm">{t.noProductsYet}</p>
              </div>
            )}
          </section>
        )}

        {/* ── Promo banner ── */}
        <section className="pb-16">
          <motion.div
            className="rounded-2xl overflow-hidden relative min-h-[200px] flex items-center bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-100"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative z-10 p-8 md:p-14 max-w-[480px]">
              <p className="text-brand-600 text-xs font-bold uppercase tracking-widest mb-2">{t.promoEyebrow}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 leading-tight mb-2">{t.promoTitle}</h2>
              <p className="text-surface-600 text-base mb-6">{t.promoBody}</p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 10px 28px -4px rgba(225,29,92,0.36)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer"
              >
                {t.promoCta}
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
