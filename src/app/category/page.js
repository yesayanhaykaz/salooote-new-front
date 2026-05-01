"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { productsAPI, vendorsAPI, categoriesAPI, venuesAPI } from "@/lib/api";
import { Star, LayoutGrid, List, ChevronRight, MapPin, Package, X, Search, Filter, ChevronDown, Check, MessageCircle, Building2, Users, BadgeCheck } from "lucide-react";

const T = {
  en: {
    home: "Home",
    products: "Products", vendors: "Vendors",
    filters: "Filters", clearAll: "Clear all", clearFilters: "Clear filters",
    priceRange: "Price range", tags: "Tags",
    noFilters: "No additional filters for this category.",
    productsAvailable: "products available",
    vendorsCount: "vendors",
    noProducts: "No products found",
    noProductsDesc: "Try adjusting your filters or check back later.",
    noVendors: "No vendors yet",
    noVendorsDesc: "Be the first vendor in this category!",
    applyAsVendor: "Apply as Vendor",
    applyFilters: "Apply Filters",
    sortMostPopular: "Most Popular",
    sortNewest: "Newest",
    sortPriceLow: "Price: Low–High",
    sortPriceHigh: "Price: High–Low",
    sortRating: "Highest Rated",
    searchIn: (name) => `Search in ${name}…`,
    loadingMore: "Loading more…",
    allLoaded: (n) => `All ${n} products loaded`,
    allCategories: "All Categories",
    // venue mode
    venuesCount: "venues",
    noVenues: "No venues found",
    noVenuesDesc: "Check back soon for venue listings.",
    chatVenue: "Chat with Venue",
    quoteOnRequest: "Quote on request",
    upToGuests: (n) => `Up to ${n} guests`,
    // service mode
    serviceProviders: "service providers",
    noServiceProviders: "No providers found",
    noServiceProvidersDesc: "Check back soon.",
    getQuote: "Get Quote",
  },
  hy: {
    home: "Գլխավոր",
    products: "Ապրանքներ", vendors: "Վաճառողներ",
    filters: "Ֆիլտրեր", clearAll: "Մաքրել", clearFilters: "Մաքրել ֆիլտրերը",
    priceRange: "Գնի միջակայք", tags: "Թեգեր",
    noFilters: "Այս կատեգորիայի համար լրացուցիչ ֆիլտրեր չկան:",
    productsAvailable: "ապրանք",
    vendorsCount: "վաճառող",
    noProducts: "Ապրանքներ չեն գտնվել",
    noProductsDesc: "Փոխեք ֆիլտրերը կամ ստուգեք ավելի ուշ:",
    noVendors: "Վաճառողներ դեռ չկան",
    noVendorsDesc: "Դարձե՛ք առաջին վաճառողը:",
    applyAsVendor: "Դիմել որպես Վաճառող",
    applyFilters: "Կիրառել Ֆիլտրերը",
    sortMostPopular: "Ամենատարածված",
    sortNewest: "Ամենանոր",
    sortPriceLow: "Գին՝ ցածրից բարձր",
    sortPriceHigh: "Գին՝ բարձրից ցածր",
    sortRating: "Ամենաբարձր վարկանշով",
    searchIn: (name) => `Որոնել `,
    loadingMore: "Բեռնվում է…",
    allLoaded: (n) => `Բոլոր ${n} ապրանքները բեռնված են`,
    allCategories: "Բոլոր կատեգորիաները",
    venuesCount: "վայր",
    noVenues: "Վայրեր չեն գտնվել",
    noVenuesDesc: "Ստուգեք ավելի ուշ:",
    chatVenue: "Կապ հաստատել",
    quoteOnRequest: "Գնի հարցում",
    upToGuests: (n) => `Մինչև ${n} հյուր`,
    serviceProviders: "ծառայություն մատուցողներ",
    noServiceProviders: "Ծառայություններ չեն գտնվել",
    noServiceProvidersDesc: "Ստուգեք ավելի ուշ:",
    getQuote: "Ստանալ Գնացուցակ",
  },
  ru: {
    home: "Главная",
    products: "Товары", vendors: "Продавцы",
    filters: "Фильтры", clearAll: "Очистить", clearFilters: "Сбросить фильтры",
    priceRange: "Ценовой диапазон", tags: "Теги",
    noFilters: "Нет дополнительных фильтров для этой категории.",
    productsAvailable: "товаров",
    vendorsCount: "продавцов",
    noProducts: "Товары не найдены",
    noProductsDesc: "Измените фильтры или проверьте позже.",
    noVendors: "Продавцов пока нет",
    noVendorsDesc: "Станьте первым продавцом в этой категории!",
    applyAsVendor: "Стать Продавцом",
    applyFilters: "Применить Фильтры",
    sortMostPopular: "Популярные",
    sortNewest: "Новые",
    sortPriceLow: "Цена: по возрастанию",
    sortPriceHigh: "Цена: по убыванию",
    sortRating: "Высший рейтинг",
    searchIn: (name) => `Поиск в ${name}…`,
    loadingMore: "Загрузка…",
    allLoaded: (n) => `Все ${n} товаров загружены`,
    allCategories: "Все категории",
    venuesCount: "площадок",
    noVenues: "Площадки не найдены",
    noVenuesDesc: "Загляните позже.",
    chatVenue: "Написать",
    quoteOnRequest: "Цена по запросу",
    upToGuests: (n) => `До ${n} гостей`,
    serviceProviders: "исполнителей",
    noServiceProviders: "Исполнители не найдены",
    noServiceProvidersDesc: "Загляните позже.",
    getQuote: "Узнать стоимость",
  },
};

// ── Listing-type detection ─────────────────────────────────────────────────────
const VENUE_SLUGS = new Set(["venues-locations"]);
const SERVICE_SLUGS = new Set([
  "photography-videography", "catering-food",
  "music-djs", "event-planning", "beauty-styling", "transport-cars",
  "event-photography", "videography", "drone-shooting", "photo-booth",
  "buffet-catering", "full-service-catering", "drinks-bar", "kids-catering",
  "dj-services", "live-bands", "singers",
  "makeup-artists", "hair-styling", "bridal-styling",
  "luxury-cars", "limousines", "guest-transport",
]);
const VENUE_TYPE_LABEL = {
  wedding_hall: "Wedding Hall", restaurant: "Restaurant", cafe: "Café",
  church: "Church", outdoor: "Outdoor", rooftop: "Rooftop",
  conference: "Conference", other: "Venue",
};

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

// ── Venue card (used in venue listing mode) ────────────────────────────────────
function VenueCard({ venue, lang = "en", t }) {
  const vendorSlug = venue.vendor?.slug || venue.vendor_id;
  const imageUrl = venue.thumbnail_url || venue.vendor?.banner_url || venue.vendor?.logo_url;
  const typeLabel = VENUE_TYPE_LABEL[venue.venue_type] || "Venue";
  return (
    <Link href={`/${lang}/vendor/${vendorSlug}`} className="no-underline">
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:border-brand-200 hover:-translate-y-1 transition-all cursor-pointer group shadow-sm flex flex-col h-full">
        <div className="relative h-[180px] flex-shrink-0 overflow-hidden bg-surface-100">
          {imageUrl ? (
            <Image src={imageUrl} alt={venue.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
              <Building2 size={32} className="text-brand-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-surface-700">
            {typeLabel}
          </div>
          {venue.rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
              <Star size={10} className="fill-warm-400 text-warm-400" />
              <span className="text-xs font-bold text-surface-700">{venue.rating.toFixed(1)}</span>
            </div>
          )}
          {venue.capacity_max && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-0.5">
              <Users size={10} className="text-white/90" />
              <span className="text-[11px] text-white font-medium">{t.upToGuests(venue.capacity_max)}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="font-semibold text-surface-900 text-sm mb-1 truncate">{venue.name}</p>
          {venue.short_description && (
            <p className="text-xs text-surface-400 mb-3 line-clamp-2 leading-relaxed flex-1">{venue.short_description}</p>
          )}
          <div className="flex items-center justify-between mb-3">
            {venue.base_price ? (
              <span className="text-xs font-semibold text-brand-600">
                {t.quoteOnRequest === "Quote on request" ? `From ֏${Math.round(venue.base_price).toLocaleString()}` : `֏${Math.round(venue.base_price).toLocaleString()}-ից`}
              </span>
            ) : (
              <span className="text-xs text-surface-400">{t.quoteOnRequest}</span>
            )}
            <span className="flex items-center gap-1 text-xs text-surface-400">
              <MapPin size={10} />{venue.vendor?.city || "Yerevan"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-brand-50 text-brand-600 rounded-xl px-3 py-2 text-xs font-semibold justify-center">
            <MessageCircle size={12} />
            {t.chatVenue}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Service-provider card (used in service listing mode) ──────────────────────
function ServiceProviderCard({ vendor, lang = "en", t }) {
  const slug = vendor.slug || vendor.id;
  const imageUrl = vendor.cover_image || vendor.banner_url || vendor.logo_url;
  return (
    <Link href={`/${lang}/vendor/${slug}`} className="no-underline">
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:border-brand-200 hover:-translate-y-1 transition-all cursor-pointer group shadow-sm flex flex-col h-full">
        <div className="relative h-[160px] flex-shrink-0 overflow-hidden bg-surface-100">
          {imageUrl ? (
            <Image src={imageUrl} alt={vendor.business_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
              <BadgeCheck size={32} className="text-brand-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          {(vendor.avg_rating ?? vendor.rating ?? 0) > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
              <Star size={10} className="fill-warm-400 text-warm-400" />
              <span className="text-xs font-bold text-surface-700">
                {(vendor.avg_rating ?? vendor.rating).toFixed(1)}
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-semibold text-sm leading-tight truncate max-w-[180px]">
              {vendor.business_name || vendor.name}
            </p>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-xs text-surface-400 mb-3">
            <MapPin size={10} />{vendor.city || "Yerevan"}
          </div>
          <div className="mt-auto flex items-center gap-1.5 bg-brand-600 text-white rounded-xl px-3 py-2 text-xs font-semibold justify-center">
            <MessageCircle size={12} />
            {t.getQuote}
          </div>
        </div>
      </div>
    </Link>
  );
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
          <div className="flex items-center gap-3 text-xs text-surface-400">
            {vendor.product_count > 0 && (
              <span className="flex items-center gap-1"><Package size={10} />{vendor.product_count} products</span>
            )}
            <span className="flex items-center gap-1"><MapPin size={10} />{vendor.city || "Yerevan"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Custom sort dropdown
function SortDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 border border-surface-200 rounded-xl px-4 py-2 text-sm text-surface-700 bg-white cursor-pointer hover:border-surface-300 transition-colors"
      >
        <span className="font-medium">{current?.label || "Sort"}</span>
        <ChevronDown size={14} className={`text-surface-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-[180px] bg-white rounded-xl border border-surface-200 shadow-lg py-1.5 z-30">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-900 transition-colors text-left border-none bg-transparent cursor-pointer"
            >
              {opt.label}
              {value === opt.value && <Check size={13} className="text-brand-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
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

export default function CategoryPage({ lang = "en", slug, parentSlug = null }) {
  const t = T[lang] || T.en;
  const SORT_OPTIONS = [
    { label: t.sortMostPopular, value: "popular" },
    { label: t.sortNewest,      value: "newest" },
    { label: t.sortPriceLow,    value: "price_asc" },
    { label: t.sortPriceHigh,   value: "price_desc" },
    { label: t.sortRating,      value: "rating" },
  ];

  const [mainTab, setMainTab]           = useState("products");
  const [view, setView]                 = useState("grid");
  const [sort, setSort]                 = useState("popular");
  const [priceIdx, setPriceIdx]         = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [search, setSearch]             = useState("");

  // Derived: what kind of listing this category shows
  const listingType =
    VENUE_SLUGS.has(slug) || VENUE_SLUGS.has(parentSlug || "") ? "venue"
    : SERVICE_SLUGS.has(slug) || SERVICE_SLUGS.has(parentSlug || "") ? "service"
    : "product";

  const [products, setProducts]         = useState([]);
  const [vendors, setVendors]           = useState([]);
  const [venues, setVenues]             = useState([]);
  const [total, setTotal]               = useState(0);
  const [filters, setFilters]           = useState({ min_price: 0, max_price: 0, tags: [] });
  const [priceRanges, setPriceRanges]   = useState(buildPriceRanges(0, 0));
  const [categoryInfo, setCategoryInfo]   = useState(null);
  const [parentInfo, setParentInfo]       = useState(null);
  const [loading, setLoading]             = useState(true);
  const [categoryID, setCategoryID]       = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  // Infinite scroll
  const PAGE_SIZE = 24;
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef               = useRef(null);
  const fetchKeyRef               = useRef(0);

  const categoryName = categoryInfo?.name ||
    (slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : t.allCategories);
  const parentName = parentInfo?.name ||
    (parentSlug ? parentSlug.charAt(0).toUpperCase() + parentSlug.slice(1).replace(/-/g, " ") : "");

  // Step 1: resolve slug → category info + filters + subcategories (+ parent if subcat)
  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    Promise.all([
      categoriesAPI.getBySlug(slug, lang).catch(() => null),
      categoriesAPI.getFilters(slug, lang).catch(() => null),
      categoriesAPI.list(lang).catch(() => null),
      parentSlug ? categoriesAPI.getBySlug(parentSlug, lang).catch(() => null) : Promise.resolve(null),
    ]).then(([catRes, filterRes, listRes, parentRes]) => {
      if (catRes?.data) {
        setCategoryInfo(catRes.data);
        setCategoryID(catRes.data.id);
        // Subcategories only shown on parent-level pages
        if (!parentSlug) {
          const allCats = listRes?.data || [];
          const found = allCats.find(c => c.slug === slug);
          setSubcategories(found?.children || []);
        }
      }
      if (parentRes?.data) setParentInfo(parentRes.data);
      if (filterRes?.data) {
        const fd = filterRes.data;
        setFilters(fd);
        setPriceRanges(buildPriceRanges(fd.min_price, fd.max_price));
      }
    });
  }, [slug, parentSlug, lang]);

  // Step 2: fetch products — supports pagination (skipped for venue/service modes)
  const fetchProducts = useCallback(async (pageNum = 1) => {
    if (listingType !== "product") { setLoading(false); return; }
    if (slug && !categoryID) return;

    const myKey = ++fetchKeyRef.current;
    if (pageNum === 1) { setLoading(true); setProducts([]); }
    else setLoadingMore(true);

    const pr = priceRanges[priceIdx];
    const params = { limit: PAGE_SIZE, page: pageNum, locale: lang, sort };
    if (categoryID) params.category_id = categoryID;
    if (pr && priceIdx > 0) {
      if (pr.min > 0) params.min_price = pr.min;
      if (pr.max !== Infinity) params.max_price = pr.max;
    }
    if (search) params.search = search;

    try {
      const res = await productsAPI.list(params);
      if (fetchKeyRef.current !== myKey) return; // stale response
      const raw = res?.data || [];
      const pag = res?.pagination;
      setTotal(pag?.total || raw.length);
      setHasMore(pag?.has_next || false);
      const mapped = raw.map(p => ({
        id: p.id, name: p.name, slug: p.slug || "",
        vendor_slug: p.vendor_slug || "",
        price: parseFloat(p.price) || 0,
        originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
        rating: p.avg_rating ?? p.rating ?? 0,
        reviews: p.review_count || 0,
        vendor: p.vendor_name || p.business_name || "",
        image: p.thumbnail_url || p.images?.[0]?.url || null,
        tags: p.tags || [],
        gradient: "from-brand-50 to-brand-100",
      }));
      if (pageNum === 1) setProducts(mapped);
      else setProducts(prev => [...prev, ...mapped]);
    } catch {
      if (pageNum === 1) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug, categoryID, sort, priceIdx, priceRanges, search, lang, listingType]);

  // Reset + re-fetch when filters change
  useEffect(() => { setPage(1); fetchProducts(1); }, [fetchProducts]);

  // Load next page when page increments
  useEffect(() => { if (page > 1) fetchProducts(page); }, [page]);

  // IntersectionObserver — trigger next page when sentinel visible
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
        setPage(p => p + 1);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading]);

  // Step 3: fetch vendors for this category
  useEffect(() => {
    if (slug && !categoryID) return;
    const params = { limit: 40 };
    if (categoryID) params.category_id = categoryID;
    if (listingType === "venue") params.vendor_type = "venue";
    vendorsAPI.list(params).then(res => {
      setVendors(res?.data || []);
    }).catch(() => setVendors([]));
  }, [categoryID, slug, listingType]);

  // Step 4: fetch venues (venue listing mode only)
  useEffect(() => {
    if (listingType !== "venue") return;
    setLoading(true);
    venuesAPI.list({ limit: 60, locale: lang }).then(res => {
      setVenues(res?.data || []);
    }).catch(() => setVenues([])).finally(() => setLoading(false));
  }, [listingType, lang]);

  const toggleTag = (t) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  // Client-side tag filter (tags applied after fetch)
  const filtered = selectedTags.length > 0
    ? products.filter(p => selectedTags.some(t => p.tags?.includes(t)))
    : products;

  const activeFilterCount = (priceIdx > 0 ? 1 : 0) + selectedTags.length;

  const clearFilters = () => { setPriceIdx(0); setSelectedTags([]); };

  return (
    <div className="bg-white overflow-x-clip">

      {/* ── Hero ── */}
      <section className="border-b border-surface-200 bg-white overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-stretch gap-0 md:gap-8 py-8 md:py-10">

            {/* LEFT — image */}
            <div className="w-full md:w-[42%] flex-shrink-0 rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-[260px]">
              {categoryInfo?.image_url ? (
                <Image
                  src={categoryInfo.image_url}
                  alt={categoryName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full min-h-[200px] md:min-h-[260px] bg-gradient-to-br from-brand-50 via-rose-50 to-surface-100 flex items-center justify-center">
                  {categoryInfo?.emoji
                    ? <span className="text-7xl opacity-40">{categoryInfo.emoji}</span>
                    : <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center"><Search size={32} className="text-brand-300" /></div>
                  }
                </div>
              )}
              {/* subtle overlay so text below it stays readable */}
              {categoryInfo?.image_url && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />}
            </div>

            {/* RIGHT — text + search */}
            <div className="flex-1 flex flex-col justify-center pt-6 md:pt-0">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-surface-400 mb-4 flex-wrap leading-relaxed">
                <Link href={`/${lang}`} className="no-underline hover:text-brand-600 text-surface-400 transition-colors whitespace-nowrap">{t.home}</Link>
                <ChevronRight size={12} className="flex-shrink-0 opacity-50" />
                <Link href={`/${lang}/products`} className="no-underline hover:text-brand-600 text-surface-400 transition-colors whitespace-nowrap">{t.allCategories || "Categories"}</Link>
                <ChevronRight size={12} className="flex-shrink-0 opacity-50" />
                {parentSlug && (
                  <>
                    <Link href={`/${lang}/category/${parentSlug}`} className="no-underline hover:text-brand-600 text-surface-400 transition-colors break-words">{parentName}</Link>
                    <ChevronRight size={12} className="flex-shrink-0 opacity-50" />
                  </>
                )}
                <span className="text-surface-700 font-semibold break-words">{categoryName}</span>
              </nav>

              {/* Title */}
              <div className="flex items-center gap-3 mb-2">
                {categoryInfo?.emoji && <span className="text-3xl">{categoryInfo.emoji}</span>}
                <h1 className="text-3xl md:text-4xl font-bold text-surface-900 leading-tight">{categoryName}</h1>
              </div>

              {/* Description */}
              {categoryInfo?.description && (
                <p className="text-sm leading-relaxed text-surface-500 mt-2 mb-4 max-w-[480px]">
                  {categoryInfo.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-3 mb-5 text-surface-400">
                {listingType === "venue" && (
                  <span className="text-sm font-medium text-surface-600">{venues.length} {t.venuesCount}</span>
                )}
                {listingType === "service" && (
                  <span className="text-sm font-medium text-surface-600">{vendors.length} {t.serviceProviders}</span>
                )}
                {listingType === "product" && (
                  <>
                    <span className="text-sm font-medium text-surface-600">{total} {t.productsAvailable}</span>
                    {vendors.length > 0 && (
                      <span className="text-sm">· {vendors.length} {t.vendorsCount}</span>
                    )}
                  </>
                )}
              </div>

              {/* Search */}
              <div className="relative max-w-[440px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t.searchIn(categoryName)}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchProducts()}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 text-sm text-surface-900 bg-white outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-400"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Subcategory grid (replaces old violet pill strip) ── */}
      {subcategories.length > 0 && (
        <section className="border-b border-surface-100 bg-white">
          <div className="max-w-container mx-auto px-6 md:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {subcategories.map((sub) => {
                // Brand pink accent everywhere; only override when the
                // category record provides a non-violet, non-default color.
                const isDefaultViolet = !sub.color || /#?7c3aed/i.test(sub.color);
                const hue = isDefaultViolet ? "#e11d5c" : sub.color;
                return (
                  <Link
                    key={sub.id || sub.slug}
                    href={`/${lang}/category/${slug}/${sub.slug}`}
                    className="no-underline group"
                  >
                    <div
                      className="relative flex flex-col items-start gap-2 p-3.5 rounded-2xl border bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 h-full"
                      style={{ borderColor: `${hue}24` }}
                    >
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `${hue}14`, color: hue }}
                      >
                        {sub.emoji || sub.icon ? (
                          <span className="text-lg">{sub.emoji || ""}</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full" style={{ background: hue }} />
                        )}
                      </span>
                      <span
                        className="text-[13.5px] font-semibold leading-tight transition-colors group-hover:opacity-80"
                        style={{ color: "#1f2937" }}
                      >
                        {sub.name}
                      </span>
                      {sub.product_count > 0 && (
                        <span
                          className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${hue}14`, color: hue }}
                        >
                          {sub.product_count}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-container mx-auto px-6 md:px-8 py-8">

        {/* ── PRODUCT MODE: tabs + sidebar filters + product/vendor grid ── */}
        {listingType === "product" && (
          <>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex bg-surface-100 rounded-xl p-1 flex-shrink-0">
                <button
                  onClick={() => setMainTab("products")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${mainTab === "products" ? "bg-white text-surface-900 shadow-sm" : "bg-transparent text-surface-500 hover:text-surface-700"}`}
                >
                  {t.products}
                  {total > 0 && <span className="ml-1.5 text-xs text-surface-400">({total})</span>}
                </button>
                <button
                  onClick={() => setMainTab("vendors")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${mainTab === "vendors" ? "bg-white text-surface-900 shadow-sm" : "bg-transparent text-surface-500 hover:text-surface-700"}`}
                >
                  {t.vendors}
                  {vendors.length > 0 && <span className="ml-1.5 text-xs text-surface-400">({vendors.length})</span>}
                </button>
              </div>
              <div className="flex-1 hidden sm:block" />
              {mainTab === "products" && (
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden relative flex items-center gap-1.5 border border-surface-200 rounded-xl px-3 py-2 text-sm font-medium text-surface-600 bg-white cursor-pointer hover:border-brand-300 hover:text-brand-600 transition-colors flex-shrink-0"
                >
                  <Filter size={14} />
                  {t.filters}
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              )}
              {mainTab === "products" && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <SortDropdown value={sort} onChange={setSort} options={SORT_OPTIONS} />
                  <div className="flex border border-surface-200 rounded-xl overflow-hidden bg-white">
                    <button onClick={() => setView("grid")} className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "grid" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400"}`}><LayoutGrid size={15} /></button>
                    <button onClick={() => setView("list")} className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "list" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400"}`}><List size={15} /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-8">
              {mainTab === "products" && (
                <aside className="w-[220px] flex-shrink-0 hidden lg:block">
                  <div className="bg-white rounded-xl border border-surface-200 p-5 sticky top-24">
                    <div className="flex items-center justify-between mb-5">
                      <p className="font-semibold text-surface-900">{t.filters}</p>
                      {activeFilterCount > 0 && (
                        <button onClick={clearFilters} className="text-xs text-brand-600 font-medium border-none bg-transparent cursor-pointer hover:text-brand-700">{t.clearAll}</button>
                      )}
                    </div>
                    <div className="mb-5 pb-5 border-b border-surface-100">
                      <p className="text-sm font-semibold text-surface-800 mb-3">{t.priceRange}</p>
                      {priceRanges.map((p, i) => (
                        <label key={p.label} className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={() => setPriceIdx(i)}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${priceIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
                            {priceIdx === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className={`text-sm transition-colors ${priceIdx === i ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>{p.label}</span>
                        </label>
                      ))}
                    </div>
                    {filters.tags.length === 0 && !loading && priceRanges.length <= 1 && (
                      <p className="text-xs text-surface-400 italic">{t.noFilters}</p>
                    )}
                  </div>
                </aside>
              )}

              <div className="flex-1 min-w-0">
                {activeFilterCount > 0 && mainTab === "products" && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {priceIdx > 0 && (
                      <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                        {priceRanges[priceIdx].label}
                        <button onClick={() => setPriceIdx(0)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
                      </span>
                    )}
                    {selectedTags.map(tg => (
                      <span key={tg} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                        {tg}
                        <button onClick={() => toggleTag(tg)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}

                {mainTab === "products" && (
                  <>
                    {loading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-surface-100 rounded-xl h-[280px] animate-pulse" />)}
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="py-10 text-center">
                        <Search size={40} className="text-surface-300 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-surface-700 mb-2">{t.noProducts}</p>
                        <p className="text-sm text-surface-400">{t.noProductsDesc}</p>
                        {activeFilterCount > 0 && (
                          <button onClick={clearFilters} className="mt-4 text-sm text-brand-600 font-medium border-none bg-transparent cursor-pointer hover:text-brand-700">{t.clearFilters}</button>
                        )}
                      </div>
                    ) : view === "grid" ? (
                      <>
                        <div className={filtered.length === 1 ? "grid grid-cols-1 sm:grid-cols-[minmax(0,260px)] gap-4" : filtered.length === 2 ? "grid grid-cols-2 md:grid-cols-[repeat(2,minmax(0,260px))] gap-4" : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"}>
                          {filtered.map((p, i) => <ProductCard key={p.id || i} product={p} lang={lang} />)}
                        </div>
                        <div ref={sentinelRef} className="h-10 mt-4" />
                        {loadingMore && (
                          <div className="flex justify-center py-4">
                            <div className="flex items-center gap-2 text-sm text-surface-400">
                              <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                              {t.loadingMore}
                            </div>
                          </div>
                        )}
                        {!hasMore && filtered.length > 0 && (
                          <p className="text-center text-xs text-surface-300 py-4">{t.allLoaded(total)}</p>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {filtered.map((p, i) => {
                          const href = p.vendor_slug && p.slug ? `/${lang}/${p.vendor_slug}/${p.slug}` : `/${lang}/product/${p.id}`;
                          return (
                            <Link key={p.id || i} href={href} className="no-underline">
                              <div className="bg-white rounded-xl border border-surface-200 flex items-center gap-4 p-4 hover:border-brand-200 transition-all group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100 relative">
                                  {p.image ? <Image src={p.image} alt={p.name} fill className="object-cover" /> : <div className="h-full bg-gradient-to-br from-brand-50 to-brand-100" />}
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
                                  {p.originalPrice && <p className="text-xs text-surface-400 line-through">${p.originalPrice.toFixed(2)}</p>}
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
                      <div className="py-10 text-center">
                        <Package size={40} className="text-surface-300 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-surface-700 mb-2">{t.noVendors}</p>
                        <p className="text-sm text-surface-400">{t.noVendorsDesc}</p>
                        <Link href={`/${lang}/apply`} className="inline-block mt-4 bg-brand-600 text-white rounded-xl px-6 py-2.5 text-sm font-semibold no-underline hover:bg-brand-700 transition-colors">{t.applyAsVendor}</Link>
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
          </>
        )}

        {/* ── VENUE MODE: venue cards with chat CTA, no tabs/filters ── */}
        {listingType === "venue" && (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-surface-100 rounded-2xl h-[320px] animate-pulse" />)}
            </div>
          ) : venues.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 size={40} className="text-surface-300 mx-auto mb-4" />
              <p className="text-lg font-semibold text-surface-700 mb-2">{t.noVenues}</p>
              <p className="text-sm text-surface-400">{t.noVenuesDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {venues
                .filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()))
                .map(v => <VenueCard key={v.id} venue={v} lang={lang} t={t} />)}
            </div>
          )
        )}

        {/* ── SERVICE MODE: service-provider cards with Get Quote CTA, no tabs/filters ── */}
        {listingType === "service" && (
          loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-surface-100 rounded-2xl h-[280px] animate-pulse" />)}
            </div>
          ) : vendors.length === 0 ? (
            <div className="py-16 text-center">
              <BadgeCheck size={40} className="text-surface-300 mx-auto mb-4" />
              <p className="text-lg font-semibold text-surface-700 mb-2">{t.noServiceProviders}</p>
              <p className="text-sm text-surface-400">{t.noServiceProvidersDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {vendors
                .filter(v => !search || (v.business_name || v.name || "").toLowerCase().includes(search.toLowerCase()))
                .map(v => <ServiceProviderCard key={v.id} vendor={v} lang={lang} t={t} />)}
            </div>
          )
        )}

      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="absolute right-0 top-0 bottom-0 bg-white w-[300px] p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-surface-900 text-lg">{t.filters}</p>
              <button onClick={() => setShowMobileFilters(false)} className="border-none bg-transparent cursor-pointer">
                <X size={20} className="text-surface-500" />
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-surface-100">
              <p className="text-sm font-semibold text-surface-800 mb-3">{t.priceRange}</p>
              {priceRanges.map((p, i) => (
                <label key={p.label} className="flex items-center gap-2.5 py-2 cursor-pointer" onClick={() => setPriceIdx(i)}>
                  <div className={`w-4 h-4 rounded-full border-2 ${priceIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300"}`} />
                  <span className="text-sm text-surface-600">{p.label}</span>
                </label>
              ))}
            </div>

            {filters.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-surface-800 mb-3">{t.tags}</p>
                {filters.tags.map(tag => (
                  <CheckboxFilter
                    key={tag}
                    label={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-brand-600 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer"
            >
              {t.applyFilters}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
