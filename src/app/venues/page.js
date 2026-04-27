"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { venuesAPI, inquiriesAPI } from "@/lib/api";
import { isLoggedIn } from "@/lib/api";
import {
  Star, LayoutGrid, List, ChevronRight, MapPin, Building2,
  X, Search, Filter, ChevronDown, Check, Users, UtensilsCrossed,
  Landmark, Trees, Send, MessageCircle,
} from "lucide-react";

const T = {
  en: {
    home: "Home",
    venues: "Venues",
    allVenues: "All Venues",
    filters: "Filters", clearAll: "Clear all",
    venueType: "Venue type",
    capacity: "Guest capacity",
    anyCapacity: "Any capacity",
    noVenues: "No venues found",
    noVenuesDesc: "Try adjusting your filters or check back later.",
    clearFilters: "Clear filters",
    applyFilters: "Apply Filters",
    sortMostPopular: "Most Popular",
    sortNewest: "Newest",
    sortPriceLow: "Price: Low–High",
    sortPriceHigh: "Price: High–Low",
    sortRating: "Highest Rated",
    searchPlaceholder: "Search venues…",
    loadingMore: "Loading more…",
    allLoaded: (n) => `All ${n} venues loaded`,
    inquire: "Send Inquiry",
    inquireSent: "Inquiry Sent!",
    viewVenue: "View details",
    guests: "guests",
    priceFrom: "from",
    loginToInquire: "Log in to send an inquiry",
    venueTypes: {
      all: "All types",
      wedding_hall: "Wedding Hall",
      restaurant: "Restaurant",
      cafe: "Café",
      church: "Church",
      outdoor: "Outdoor",
      rooftop: "Rooftop",
      conference: "Conference",
      other: "Other",
    },
    capacityRanges: [
      { label: "Any capacity", min: 0, max: 0 },
      { label: "Up to 50 guests", min: 0, max: 50 },
      { label: "50–100 guests", min: 50, max: 100 },
      { label: "100–200 guests", min: 100, max: 200 },
      { label: "200–500 guests", min: 200, max: 500 },
      { label: "500+ guests", min: 500, max: 0 },
    ],
  },
  hy: {
    home: "Գլխավոր",
    venues: "Վայրեր",
    allVenues: "Բոլոր վայրերը",
    filters: "Ֆիլտրեր", clearAll: "Մաքրել",
    venueType: "Վայրի տեսակ",
    capacity: "Հյուրերի քանակ",
    anyCapacity: "Ցանկացած",
    noVenues: "Վայրեր չեն գտնվել",
    noVenuesDesc: "Փոխեք ֆիլտրերը կամ ստուգեք ավելի ուշ:",
    clearFilters: "Մաքրել ֆիլտրերը",
    applyFilters: "Կիրառել",
    sortMostPopular: "Ամենատարածված",
    sortNewest: "Ամենանոր",
    sortPriceLow: "Գին՝ ցածրից բարձր",
    sortPriceHigh: "Գին՝ բարձրից ցածր",
    sortRating: "Ամենաբարձր վարկ.",
    searchPlaceholder: "Որոնել վայրեր…",
    loadingMore: "Բեռնվում է…",
    allLoaded: (n) => `Բոլոր ${n} վայրերը բեռնված են`,
    inquire: "Հարցում ուղարկել",
    inquireSent: "Ուղարկված է!",
    viewVenue: "Մանրամասներ",
    guests: "հյուր",
    priceFrom: "սկսած",
    loginToInquire: "Հարցում ուղարկելու համար մուտք գործեք",
    venueTypes: {
      all: "Բոլոր տեսակները",
      wedding_hall: "Հարսանյաց դահլիճ",
      restaurant: "Ռեստորան",
      cafe: "Սրճարան",
      church: "Եկեղեցի",
      outdoor: "Բաց վայր",
      rooftop: "Տանիք",
      conference: "Կոնֆերանս",
      other: "Այլ",
    },
    capacityRanges: [
      { label: "Ցանկացած", min: 0, max: 0 },
      { label: "Մինչև 50 հյուր", min: 0, max: 50 },
      { label: "50–100 հյուր", min: 50, max: 100 },
      { label: "100–200 հյուր", min: 100, max: 200 },
      { label: "200–500 հյուր", min: 200, max: 500 },
      { label: "500+ հյուր", min: 500, max: 0 },
    ],
  },
  ru: {
    home: "Главная",
    venues: "Площадки",
    allVenues: "Все площадки",
    filters: "Фильтры", clearAll: "Очистить",
    venueType: "Тип площадки",
    capacity: "Вместимость",
    anyCapacity: "Любая",
    noVenues: "Площадки не найдены",
    noVenuesDesc: "Измените фильтры или проверьте позже.",
    clearFilters: "Сбросить фильтры",
    applyFilters: "Применить",
    sortMostPopular: "Популярные",
    sortNewest: "Новые",
    sortPriceLow: "Цена: по возрастанию",
    sortPriceHigh: "Цена: по убыванию",
    sortRating: "Высший рейтинг",
    searchPlaceholder: "Поиск площадок…",
    loadingMore: "Загрузка…",
    allLoaded: (n) => `Все ${n} площадок загружены`,
    inquire: "Отправить запрос",
    inquireSent: "Отправлено!",
    viewVenue: "Подробнее",
    guests: "гостей",
    priceFrom: "от",
    loginToInquire: "Войдите чтобы отправить запрос",
    venueTypes: {
      all: "Все типы",
      wedding_hall: "Свадебный зал",
      restaurant: "Ресторан",
      cafe: "Кафе",
      church: "Церковь",
      outdoor: "На открытом воздухе",
      rooftop: "Крыша",
      conference: "Конференц-зал",
      other: "Другое",
    },
    capacityRanges: [
      { label: "Любая", min: 0, max: 0 },
      { label: "До 50 гостей", min: 0, max: 50 },
      { label: "50–100 гостей", min: 50, max: 100 },
      { label: "100–200 гостей", min: 100, max: 200 },
      { label: "200–500 гостей", min: 200, max: 500 },
      { label: "500+ гостей", min: 500, max: 0 },
    ],
  },
};

const VENUE_TYPE_ICONS = {
  wedding_hall: Building2,
  restaurant: UtensilsCrossed,
  cafe: UtensilsCrossed,
  church: Landmark,
  outdoor: Trees,
  rooftop: Building2,
  conference: Building2,
  other: Building2,
};

function SortDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find(o => o.value === value);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
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
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors text-left border-none bg-transparent cursor-pointer"
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

function VenueCard({ venue, lang, t, view }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const Icon = VENUE_TYPE_ICONS[venue.venue_type] || Building2;
  const image = venue.thumbnail_url || venue.images?.[0]?.url || null;
  const venueTypeName = t.venueTypes[venue.venue_type] || venue.venue_type;
  const vendorSlug = venue.vendor?.slug || "";
  const href = vendorSlug ? `/${lang}/vendor/${vendorSlug}` : `/${lang}/venues/${venue.id}`;

  async function handleInquire(e) {
    e.preventDefault();
    if (!isLoggedIn()) { window.location.href = `/${lang}/login`; return; }
    setSending(true);
    try {
      await inquiriesAPI.create({ vendor_id: venue.vendor_id, message: `I'm interested in "${venue.name}".` });
      setSent(true);
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  }

  if (view === "list") {
    return (
      <Link href={href} className="no-underline">
        <div className="bg-white rounded-xl border border-surface-200 flex items-center gap-4 p-4 hover:border-brand-200 transition-all group">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100 relative">
            {image ? (
              <Image src={image} alt={venue.name} fill className="object-cover" />
            ) : (
              <div className="h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                <Icon size={28} className="text-brand-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-800 mb-0.5 group-hover:text-brand-600 transition-colors truncate">{venue.name}</p>
            <p className="text-xs text-surface-400 mb-1.5">{venueTypeName}</p>
            <div className="flex items-center gap-3 text-xs text-surface-400">
              {venue.capacity_max && (
                <span className="flex items-center gap-1"><Users size={10} />{venue.capacity_max} {t.guests}</span>
              )}
              {venue.vendor?.city && (
                <span className="flex items-center gap-1"><MapPin size={10} />{venue.vendor.city}</span>
              )}
              <span className="flex items-center gap-1"><Star size={10} className="fill-warm-400 text-warm-400" />{(venue.rating || 0).toFixed(1)}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            {venue.base_price && (
              <p className="font-bold text-lg text-surface-900">{venue.base_price.toLocaleString()} {venue.currency}</p>
            )}
            <button
              onClick={handleInquire}
              disabled={sent || sending}
              className="mt-2 text-xs bg-brand-600 text-white rounded-lg px-3 py-1.5 font-semibold border-none cursor-pointer hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {sent ? t.inquireSent : t.inquire}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-surface-200 overflow-hidden hover:border-brand-200 hover:-translate-y-1 transition-all group flex flex-col">
      <Link href={href} className="no-underline flex-1 flex flex-col">
        {/* Image */}
        <div className="relative h-[180px] overflow-hidden bg-surface-100 flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={venue.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
              <Icon size={40} className="text-brand-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Rating badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star size={10} className="fill-warm-400 text-warm-400" />
            <span className="text-xs font-bold text-surface-700">{(venue.rating || 0).toFixed(1)}</span>
          </div>
          {/* Type badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
            <Icon size={11} className="text-brand-600" />
            <span className="text-[11px] font-semibold text-surface-700">{venueTypeName}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="font-semibold text-surface-900 text-sm leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">{venue.name}</p>
          <div className="flex items-center gap-3 text-xs text-surface-400 flex-wrap">
            {venue.capacity_max && (
              <span className="flex items-center gap-1">
                <Users size={10} />
                {venue.capacity_min && venue.capacity_min !== venue.capacity_max
                  ? `${venue.capacity_min}–${venue.capacity_max}`
                  : venue.capacity_max} {t.guests}
              </span>
            )}
            {venue.vendor?.city && (
              <span className="flex items-center gap-1"><MapPin size={10} />{venue.vendor.city}</span>
            )}
          </div>
          {venue.base_price && (
            <p className="text-sm font-bold text-surface-900 mt-auto pt-1">
              <span className="text-xs font-normal text-surface-400 mr-1">{t.priceFrom}</span>
              {venue.base_price.toLocaleString()} {venue.currency}
            </p>
          )}
        </div>
      </Link>

      {/* Inquire button — outside the link */}
      <div className="px-4 pb-4">
        <button
          onClick={handleInquire}
          disabled={sent || sending}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl py-2.5 border-none cursor-pointer transition-colors disabled:opacity-60"
        >
          {sent ? (
            <><Check size={14} />{t.inquireSent}</>
          ) : sending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><MessageCircle size={14} />{t.inquire}</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function VenuesPage({ lang = "en" }) {
  const t = T[lang] || T.en;
  const SORT_OPTIONS = [
    { label: t.sortMostPopular, value: "popular" },
    { label: t.sortNewest,      value: "newest" },
    { label: t.sortPriceLow,    value: "price_asc" },
    { label: t.sortPriceHigh,   value: "price_desc" },
    { label: t.sortRating,      value: "rating" },
  ];

  const [view, setView]                     = useState("grid");
  const [sort, setSort]                     = useState("popular");
  const [selectedType, setSelectedType]     = useState("all");
  const [capacityIdx, setCapacityIdx]       = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [search, setSearch]                 = useState("");

  const [venues, setVenues]                 = useState([]);
  const [total, setTotal]                   = useState(0);
  const [loading, setLoading]               = useState(true);
  const [page, setPage]                     = useState(1);
  const [hasMore, setHasMore]               = useState(false);
  const [loadingMore, setLoadingMore]       = useState(false);
  const sentinelRef                         = useRef(null);
  const fetchKeyRef                         = useRef(0);
  const PAGE_SIZE = 24;

  const VENUE_TYPES = ["all", "wedding_hall", "restaurant", "cafe", "church", "outdoor", "rooftop", "conference", "other"];

  const fetchVenues = useCallback(async (pageNum = 1) => {
    const myKey = ++fetchKeyRef.current;
    if (pageNum === 1) { setLoading(true); setVenues([]); }
    else setLoadingMore(true);

    const cap = t.capacityRanges[capacityIdx];
    const params = { limit: PAGE_SIZE, page: pageNum, locale: lang };
    if (selectedType !== "all") params.venue_type = selectedType;
    if (cap && cap.min > 0) params.capacity_min = cap.min;
    if (cap && cap.max > 0) params.capacity_max = cap.max;

    try {
      const res = await venuesAPI.list(params);
      if (fetchKeyRef.current !== myKey) return;
      const raw = res?.data || [];
      const pag = res?.pagination;
      setTotal(pag?.total || raw.length);
      setHasMore(pag?.has_next || false);
      if (pageNum === 1) setVenues(raw);
      else setVenues(prev => [...prev, ...raw]);
    } catch {
      if (pageNum === 1) setVenues([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedType, capacityIdx, lang, t]);

  useEffect(() => { setPage(1); fetchVenues(1); }, [fetchVenues]);
  useEffect(() => { if (page > 1) fetchVenues(page); }, [page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loadingMore && !loading) setPage(p => p + 1);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading]);

  const filtered = search
    ? venues.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
    : venues;

  const activeFilterCount = (selectedType !== "all" ? 1 : 0) + (capacityIdx > 0 ? 1 : 0);
  const clearFilters = () => { setSelectedType("all"); setCapacityIdx(0); };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="font-semibold text-surface-900">{t.filters}</p>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-brand-600 font-medium border-none bg-transparent cursor-pointer hover:text-brand-700">
            {t.clearAll}
          </button>
        )}
      </div>

      {/* Venue type */}
      <div className="mb-5 pb-5 border-b border-surface-100">
        <p className="text-sm font-semibold text-surface-800 mb-3">{t.venueType}</p>
        {VENUE_TYPES.map(type => (
          <label
            key={type}
            className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
            onClick={() => setSelectedType(type)}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedType === type ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
              {selectedType === type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className={`text-sm transition-colors ${selectedType === type ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>
              {t.venueTypes[type]}
            </span>
          </label>
        ))}
      </div>

      {/* Capacity */}
      <div>
        <p className="text-sm font-semibold text-surface-800 mb-3">{t.capacity}</p>
        {t.capacityRanges.map((range, i) => (
          <label key={range.label} className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={() => setCapacityIdx(i)}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${capacityIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
              {capacityIdx === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className={`text-sm transition-colors ${capacityIdx === i ? "text-surface-900 font-medium" : "text-surface-500 group-hover:text-surface-700"}`}>
              {range.label}
            </span>
          </label>
        ))}
      </div>
    </>
  );

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="border-b border-surface-200 bg-gradient-to-br from-surface-50 to-white">
        <div className="max-w-container mx-auto px-6 md:px-8 py-12 flex items-center justify-between gap-8 flex-wrap">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs mb-4 text-surface-500">
              <Link href={`/${lang}`} className="no-underline hover:text-brand-600 transition-colors">{t.home}</Link>
              <ChevronRight size={12} className="opacity-60" />
              <span className="text-surface-800 font-semibold">{t.venues}</span>
            </nav>
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={36} className="text-brand-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-surface-900">{t.allVenues}</h1>
            </div>
            <div className="flex items-center gap-3 mt-4 text-surface-500">
              <span className="text-sm font-medium">{total} {t.venues.toLowerCase()}</span>
            </div>
          </div>
          {/* Search */}
          <div className="w-full md:w-[360px]">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 text-sm bg-white outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container mx-auto px-6 md:px-8 py-8">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium text-surface-600 bg-white cursor-pointer hover:border-surface-300 transition-colors relative"
            >
              <Filter size={14} />
              {t.filters}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown value={sort} onChange={setSort} options={SORT_OPTIONS} />
            <div className="flex border border-surface-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => setView("grid")} className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "grid" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400"}`}>
                <LayoutGrid size={15} />
              </button>
              <button onClick={() => setView("list")} className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "list" ? "bg-brand-50 text-brand-600" : "bg-white text-surface-400"}`}>
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedType !== "all" && (
              <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                {t.venueTypes[selectedType]}
                <button onClick={() => setSelectedType("all")} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
              </span>
            )}
            {capacityIdx > 0 && (
              <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                {t.capacityRanges[capacityIdx].label}
                <button onClick={() => setCapacityIdx(0)} className="border-none bg-transparent cursor-pointer p-0"><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className="w-[220px] flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl border border-surface-200 p-5 sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* ── Grid / List ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-surface-100 rounded-xl h-[320px] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center">
                <Building2 size={40} className="text-surface-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-surface-700 mb-2">{t.noVenues}</p>
                <p className="text-sm text-surface-400">{t.noVenuesDesc}</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-4 text-sm text-brand-600 font-medium border-none bg-transparent cursor-pointer hover:text-brand-700">
                    {t.clearFilters}
                  </button>
                )}
              </div>
            ) : view === "grid" ? (
              <>
                <div className={
                  filtered.length === 1
                    ? "grid grid-cols-1 sm:grid-cols-[minmax(0,280px)] gap-4"
                    : filtered.length === 2
                    ? "grid grid-cols-2 md:grid-cols-[repeat(2,minmax(0,280px))] gap-4"
                    : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                }>
                  {filtered.map((v, i) => (
                    <VenueCard key={v.id || i} venue={v} lang={lang} t={t} view="grid" />
                  ))}
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
                {filtered.map((v, i) => (
                  <VenueCard key={v.id || i} venue={v} lang={lang} t={t} view="list" />
                ))}
                <div ref={sentinelRef} className="h-10" />
              </div>
            )}
          </div>
        </div>
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
            <SidebarContent />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 bg-brand-600 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer"
            >
              {t.applyFilters}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
