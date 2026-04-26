"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { categoriesAPI, vendorsAPI, productsAPI, getUser, clearAuth, isLoggedIn } from "@/lib/api";
import {
  Search, Heart, ShoppingBag, Bell, Menu, X,
  Cake, UtensilsCrossed, Flower2, PartyPopper,
  Gift, Music, Sparkles, MapPin, Home, User, ChevronRight,
  LogOut, Package, Bookmark, Settings,
  Camera, Mic2, Utensils, Star,
  ShoppingBag as Bag,
} from "lucide-react";

const ICON_MAP = {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music, MapPin, Sparkles,
  Camera, Mic2, Utensils, Heart, Star, Bag,
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

const PILL_ALL_LABEL = { en: "All Products", hy: "Բոլոր Ապրանքներ", ru: "Все Товары" };

/* User-menu translations */
const USER_MENU_T = {
  myProfile:  { en: "My Profile",   hy: "Իմ պրոֆիլը",        ru: "Мой профиль" },
  myOrders:   { en: "My Orders",    hy: "Իմ պատվերները",     ru: "Мои заказы" },
  savedItems: { en: "Saved Items",  hy: "Պահպանված",         ru: "Избранное" },
  settings:   { en: "Settings",     hy: "Կարգավորումներ",    ru: "Настройки" },
  signOut:    { en: "Sign Out",     hy: "Դուրս գալ",         ru: "Выйти" },
  logIn:      { en: "Log in",       hy: "Մուտք",             ru: "Войти" },
  signUp:     { en: "Sign up",      hy: "Գրանցվել",          ru: "Регистрация" },
  browse:     { en: "Browse",       hy: "Կատեգորիաներ",       ru: "Категории" },
};

/* ─── Type badge colours ─── */
const TYPE_STYLES = {
  product:  { bg: "rgba(225,29,92,0.08)",  color: "#e11d5c",  label: "Product"  },
  vendor:   { bg: "rgba(234,88,12,0.08)",  color: "#ea580c",  label: "Vendor"   },
  category: { bg: "rgba(22,163,74,0.08)",  color: "#16a34a",  label: "Category" },
  event:    { bg: "rgba(59,130,246,0.08)", color: "#3b82f6",  label: "Event"    },
};

function TypeBadge({ type }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.product;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "1px 7px",
      borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: "0.02em",
      background: s.bg, color: s.color, flexShrink: 0,
    }}>{s.label}</span>
  );
}

/* ── Sparkle SVG decoration ── */
function SparkleIcon({ size = 13, color = "#e11d5c" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill={color} stroke="none" opacity="0.9" />
    </svg>
  );
}

/* ── Live Search Dropdown ── */
function LiveSearchDropdown({ query, results, loading, lang, navCategories, eventTypes, onClose }) {
  const { products, vendors } = results;

  const matchingCats = navCategories.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchingEvents = eventTypes.filter(e =>
    e.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const hasAny = products.length > 0 || vendors.length > 0 || matchingCats.length > 0 || matchingEvents.length > 0;

  const rowStyle = {
    display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
    cursor: "pointer", textDecoration: "none", color: "inherit",
    transition: "background 0.12s",
    borderRadius: 10,
  };

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
      background: "#fff",
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
      overflow: "hidden",
      maxHeight: "72vh",
      overflowY: "auto",
    }}>
      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "11px 14px 9px",
        borderBottom: "1px solid rgba(15,23,42,0.05)",
        background: "linear-gradient(135deg, rgba(225,29,92,0.03) 0%, rgba(255,255,255,0) 100%)",
      }}>
        <SparkleIcon size={12} color="#e11d5c" />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Results for
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          &ldquo;{query}&rdquo;
        </span>
        {loading && (
          <span style={{ marginLeft: "auto", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(225,29,92,0.2)", borderTopColor: "#e11d5c", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
        )}
      </div>

      {!loading && !hasAny && (
        <div style={{ padding: "28px 14px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          No results found for &ldquo;{query}&rdquo;
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <div style={{ padding: "8px 6px 4px" }}>
          <div style={{ padding: "4px 10px 6px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Products</div>
          {products.map(p => (
            <Link key={p.id} href={`/${lang}/product/${p.id}`} onClick={onClose}
              style={rowStyle}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(225,29,92,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f1f5f9" }}>
                {p.thumbnail_url
                  ? <img src={p.thumbnail_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><SparkleIcon size={14} color="#cbd5e1" /></div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                  {p.vendor_name && <span>{p.vendor_name} · </span>}
                  {p.price > 0 && <span style={{ color: "#e11d5c", fontWeight: 600 }}>{p.price.toLocaleString()} {p.currency || "AMD"}</span>}
                </div>
              </div>
              <TypeBadge type="product" />
            </Link>
          ))}
          <Link href={`/${lang}/products?search=${encodeURIComponent(query)}`} onClick={onClose}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px 8px", fontSize: 11.5, color: "#e11d5c", fontWeight: 600, textDecoration: "none" }}>
            See all products →
          </Link>
        </div>
      )}

      {/* Vendors */}
      {vendors.length > 0 && (
        <div style={{ padding: "4px 6px", borderTop: products.length > 0 ? "1px solid rgba(15,23,42,0.05)" : "none" }}>
          <div style={{ padding: "4px 10px 6px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Vendors</div>
          {vendors.map(v => (
            <Link key={v.id} href={`/${lang}/vendor/${v.slug}`} onClick={onClose}
              style={rowStyle}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(234,88,12,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#f1f5f9", border: "1px solid rgba(0,0,0,0.06)" }}>
                {v.logo_url
                  ? <img src={v.logo_url} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#ea580c" }}>{(v.name || "V")[0].toUpperCase()}</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.name}</div>
                {v.city && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{v.city}</div>}
              </div>
              <TypeBadge type="vendor" />
            </Link>
          ))}
        </div>
      )}

      {/* Categories */}
      {matchingCats.length > 0 && (
        <div style={{ padding: "4px 6px", borderTop: "1px solid rgba(15,23,42,0.05)" }}>
          <div style={{ padding: "4px 10px 6px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Categories</div>
          {matchingCats.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link key={i} href={`/${lang}/category/${cat.slug}`} onClick={onClose}
                style={rowStyle}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(22,163,74,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(22,163,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {Icon && <Icon size={16} color="#16a34a" strokeWidth={1.8} />}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{cat.label}</div>
                <TypeBadge type="category" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Events */}
      {matchingEvents.length > 0 && (
        <div style={{ padding: "4px 6px", borderTop: "1px solid rgba(15,23,42,0.05)" }}>
          <div style={{ padding: "4px 10px 6px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Events</div>
          {matchingEvents.map(ev => (
            <Link key={ev.key} href={`/${lang}/${ev.href}`} onClick={onClose}
              style={rowStyle}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <SparkleIcon size={15} color="#3b82f6" />
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{ev.label}</div>
              <TypeBadge type="event" />
            </Link>
          ))}
        </div>
      )}

      {/* Footer — see all */}
      {hasAny && (
        <div style={{ borderTop: "1px solid rgba(15,23,42,0.05)", padding: "10px 14px", background: "rgba(248,250,252,0.6)" }}>
          <Link href={`/${lang}/products?search=${encodeURIComponent(query)}`} onClick={onClose}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#e11d5c", textDecoration: "none" }}>
            <SparkleIcon size={11} color="#e11d5c" />
            See all results for &ldquo;{query}&rdquo;
          </Link>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const FALLBACK_NAV = [
  { label: "Cakes & Desserts",     slug: "cakes-desserts",           icon: Cake },
  { label: "Catering & Food",      slug: "catering-food",            icon: UtensilsCrossed },
  { label: "Flowers & Decor",      slug: "flowers-decor",            icon: Flower2 },
  { label: "Photography",          slug: "photography-videography",  icon: Camera },
  { label: "Music & Entertainment",slug: "music-entertainment",      icon: Music },
  { label: "Venues & Halls",       slug: "venues-halls",             icon: MapPin },
  { label: "Beauty & Makeup",      slug: "beauty-makeup",            icon: Sparkles },
  { label: "Gifts & Souvenirs",    slug: "gifts-souvenirs",          icon: Gift },
];

export default function Header({ lang: langProp = "en", dict }) {
  const searchPlaceholder = dict?.search?.placeholder || "Search products, vendors, events…";
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navCategories, setNavCategories] = useState(FALLBACK_NAV);
  const [user, setUser]                 = useState(null);
  const [loggedIn, setLoggedIn]         = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  const debounceRef = useRef(null);
  const [liveResults, setLiveResults] = useState({ products: [], vendors: [] });
  const [liveLoading, setLiveLoading] = useState(false);
  const [showLive, setShowLive] = useState(false);

  const EVENT_TYPES = [
    { key: "wedding",     label: "Wedding",        href: "events/wedding" },
    { key: "christening", label: "Christening",    href: "events/christening" },
    { key: "birthday",    label: "Birthday Party", href: "events/birthday" },
    { key: "corporate",   label: "Corporate",      href: "events/corporate" },
    { key: "kids_party",  label: "Kids Party",     href: "events/kids_party" },
    { key: "engagement",  label: "Engagement",     href: "events/engagement" },
    { key: "graduation",  label: "Graduation",     href: "events/graduation" },
  ];

  // Debounced live search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setShowLive(false);
      setLiveResults({ products: [], vendors: [] });
      setLiveLoading(false);
      return;
    }
    clearTimeout(debounceRef.current);
    setLiveLoading(true);
    setShowLive(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const [prodRes, vendRes] = await Promise.allSettled([
          productsAPI.list({ search: searchQuery, limit: 5, page: 1 }),
          vendorsAPI.list({ search: searchQuery, limit: 4 }),
        ]);
        setLiveResults({
          products: prodRes.status === "fulfilled" ? (prodRes.value?.data || []) : [],
          vendors:  vendRes.status === "fulfilled"  ? (vendRes.value?.data  || []) : [],
        });
      } catch {}
      setLiveLoading(false);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Close live dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        searchContainerRef.current && !searchContainerRef.current.contains(e.target) &&
        mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(e.target)
      ) setShowLive(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ESC closes live dropdown
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowLive(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const closeSearch = () => { setShowLive(false); setSearchOpen(false); setSearchQuery(""); };

  // Always derive lang from the URL — more reliable than relying on the server prop
  // which may not update when Next.js preserves the client component across navigations
  const VALID_LANGS = ["en", "hy", "ru"];
  const pathLang = pathname.split("/")[1];
  const lang = VALID_LANGS.includes(pathLang) ? pathLang : (langProp || "en");

  // Re-read auth state on every route change (fixes stale header after login)
  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getUser());
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchQuery.trim()) {
      router.push(`/${lang}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Poll for unread notifications every 30 seconds
  useEffect(() => {
    if (!loggedIn) return;

    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/user/notifications?limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data?.data) {
          setUnreadCount(data.data.filter(n => !n.is_read).length);
        }
      } catch {}
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Re-fetch categories whenever the active language changes (derived from pathname)
  const lastFetchedLang = useRef(null);
  useEffect(() => {
    if (lastFetchedLang.current === lang) return; // skip if lang hasn't actually changed
    lastFetchedLang.current = lang;
    categoriesAPI.list(lang)
      .then(res => {
        const cats = res?.data || [];
        if (!cats.length) return;
        setNavCategories(cats.slice(0, 8).map(c => ({
          label: c.name,
          slug: c.slug,
          icon: ICON_MAP[c.icon] || ICON_MAP[c.emoji] || slugIcon(c.slug),
        })));
      })
      .catch(() => {});
  }, [pathname]); // pathname changes on every navigation, lang is derived from it

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push(`/${lang}/login`);
  };

  // User initials avatar
  const initials = user
    ? ((user.first_name?.[0] || "") + (user.last_name?.[0] || "")).toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
    : "U";
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email
    : "";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-surface-200">

        {/* ── Top bar ── */}
        <div className="max-w-container mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center gap-3">

          {/* Logo */}
          <Link href={`/${lang}`} className="no-underline flex-shrink-0 mr-2">
            <Image
              src="/images/logo.png"
              alt="Salooote"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search — desktop */}
          <div className="flex-1 max-w-[480px] mx-4 hidden md:block relative" ref={searchContainerRef}>
            <div className="flex items-center bg-surface-50 rounded-xl px-4 py-2.5 border border-surface-200 hover:border-surface-300 focus-within:border-brand-500 focus-within:bg-white transition-all">
              {liveLoading
                ? <span className="mr-3 flex-shrink-0 w-[15px] h-[15px] rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin" />
                : <Search size={15} className="text-surface-400 mr-3 flex-shrink-0" />
              }
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onFocus={() => searchQuery.length >= 2 && setShowLive(true)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700 placeholder:text-surface-400"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setShowLive(false); }} className="ml-2 text-surface-300 hover:text-surface-500 border-none bg-transparent cursor-pointer p-0">
                  <X size={13} />
                </button>
              )}
            </div>
            {showLive && (
              <LiveSearchDropdown
                query={searchQuery}
                results={liveResults}
                loading={liveLoading}
                lang={lang}
                navCategories={navCategories}
                eventTypes={EVENT_TYPES}
                onClose={closeSearch}
              />
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Search icon — mobile only */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors md:hidden"
            >
              <Search size={18} className="text-surface-600" />
            </button>

            {/* Wishlist — desktop */}
            <Link href={`/${lang}/account/saved`} className="no-underline w-9 h-9 rounded-xl items-center justify-center hover:bg-surface-100 transition-colors hidden md:flex">
              <Heart size={17} className="text-surface-500" />
            </Link>

            {/* Notifications bell — desktop, logged-in only */}
            {loggedIn && (
              <Link
                href={`/${lang}/account/notifications`}
                className="w-9 h-9 rounded-xl items-center justify-center hover:bg-surface-100 transition-colors relative hidden md:flex"
              >
                <Bell size={17} className="text-surface-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link href={`/${lang}/cart`} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors relative">
              <ShoppingBag size={17} className="text-surface-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="w-px h-5 bg-surface-200 mx-1.5 hidden md:block" />

            {/* Language Switcher — desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher currentLang={lang} />
            </div>

            {/* ── Auth section — desktop ── */}
            {loggedIn ? (
              /* User avatar + dropdown */
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-surface-100 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user?.avatar_url
                      ? <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      : initials
                    }
                  </div>
                  <span className="text-sm font-medium text-surface-700 max-w-[100px] truncate">
                    {user?.first_name || "Account"}
                  </span>
                  <ChevronRight
                    size={13}
                    className={`text-surface-400 transition-transform ${dropdownOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-surface-200 shadow-lg py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-surface-100">
                      <p className="text-sm font-semibold text-surface-900 truncate">{displayName}</p>
                      <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                    </div>

                    {/* Menu items */}
                    {[
                      { icon: User,     key: "myProfile",  href: `/${lang}/account` },
                      { icon: Package,  key: "myOrders",   href: `/${lang}/account/orders` },
                      { icon: Bookmark, key: "savedItems", href: `/${lang}/account/saved` },
                      { icon: Settings, key: "settings",   href: `/${lang}/account/settings` },
                    ].map(({ icon: Icon, key, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-brand-600 no-underline transition-colors"
                      >
                        <Icon size={15} className="text-surface-400" />
                        {USER_MENU_T[key]?.[lang] || USER_MENU_T[key]?.en}
                      </Link>
                    ))}

                    <div className="border-t border-surface-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left border-none bg-transparent cursor-pointer transition-colors"
                      >
                        <LogOut size={15} />
                        {USER_MENU_T.signOut[lang] || USER_MENU_T.signOut.en}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login / Sign up buttons */
              <div className="hidden md:flex items-center gap-1">
                <Link href={`/${lang}/login`} className="no-underline">
                  <span className="text-surface-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors">
                    {USER_MENU_T.logIn[lang] || USER_MENU_T.logIn.en}
                  </span>
                </Link>
                <Link href={`/${lang}/signup`} className="no-underline">
                  <button className="bg-brand-600 text-white border-none rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                    {USER_MENU_T.signUp[lang] || USER_MENU_T.signUp.en}
                  </button>
                </Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors md:hidden ml-1"
            >
              <Menu size={20} className="text-surface-700" />
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (expands on tap) ── */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 animate-fade-up relative" ref={mobileSearchContainerRef}>
            <div className="flex items-center bg-surface-50 rounded-xl px-4 py-3 border border-surface-200 focus-within:border-brand-500 focus-within:bg-white transition-all">
              {liveLoading
                ? <span className="mr-3 flex-shrink-0 w-[15px] h-[15px] rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin" />
                : <Search size={15} className="text-surface-400 mr-3 flex-shrink-0" />
              }
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700 placeholder:text-surface-400"
              />
              <button onClick={closeSearch} className="border-none bg-transparent cursor-pointer p-0">
                <X size={15} className="text-surface-400" />
              </button>
            </div>
            {showLive && (
              <LiveSearchDropdown
                query={searchQuery}
                results={liveResults}
                loading={liveLoading}
                lang={lang}
                navCategories={navCategories}
                eventTypes={EVENT_TYPES}
                onClose={closeSearch}
              />
            )}
          </div>
        )}

        {/* ── Category pills nav — full-width auto-scrolling ticker ── */}
        <div className="border-t border-surface-100 bg-white overflow-hidden">
          <style>{`
            @keyframes headerPillsTicker {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .header-pills-track {
              display: flex;
              align-items: center;
              gap: 0px;
              width: max-content;
              animation: headerPillsTicker 70s linear infinite;
              will-change: transform;
            }
          `}</style>
          <div className="py-1.5">
            {(() => {
              const allProductsItem = { label: PILL_ALL_LABEL[lang] || PILL_ALL_LABEL.en, slug: "products", icon: Sparkles, isAll: true };
              const base = [...navCategories, allProductsItem];
              // Repeat enough times so one "half" (the copy we animate through) is always wider than any screen
              const minItems = 20;
              const repsNeeded = Math.max(1, Math.ceil(minItems / base.length));
              const oneHalf = Array.from({ length: repsNeeded }, () => base).flat();
              // Double it for seamless loop: animation moves exactly -50% (= one half)
              const pills = [...oneHalf, ...oneHalf];
              return (
                <div className="header-pills-track">
                  {pills.map((item, i) => {
                    const Icon = item.icon;
                    const href = item.isAll ? `/${lang}/products` : `/${lang}/category/${item.slug}`;
                    return (
                      <Link
                        key={i}
                        href={href}
                        className="flex items-center gap-1.5 text-surface-500 no-underline py-1.5 px-3 rounded-full text-xs font-medium hover:bg-surface-100 hover:text-surface-900 whitespace-nowrap transition-colors flex-shrink-0"
                      >
                        <Icon size={12} strokeWidth={2} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </header>

      {/* ── Mobile slide-in drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="modal-content absolute right-0 top-0 bottom-0 w-[300px] bg-white flex flex-col overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
              <Image src="/images/logo.png" alt="Salooote" width={100} height={30} className="h-7 w-auto object-contain" />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={18} className="text-surface-600" />
              </button>
            </div>

            {/* Language Switcher — mobile drawer */}
            <div className="px-5 py-3 border-b border-surface-100 flex items-center justify-between">
              <span className="text-sm text-surface-500 font-medium">Language</span>
              <LanguageSwitcher currentLang={lang} />
            </div>

            {/* Auth — mobile */}
            {loggedIn ? (
              <div className="px-5 py-4 border-b border-surface-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user?.avatar_url
                      ? <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      : initials
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">{displayName}</p>
                    <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                  </div>
                </div>
                {[
                  { icon: User,     key: "myProfile",  href: `/${lang}/account` },
                  { icon: Package,  key: "myOrders",   href: `/${lang}/account/orders` },
                  { icon: Bookmark, key: "savedItems", href: `/${lang}/account/saved` },
                ].map(({ icon: Icon, key, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-sm text-surface-700 hover:text-brand-600 no-underline transition-colors"
                  >
                    <Icon size={15} className="text-surface-400" />
                    {USER_MENU_T[key]?.[lang] || USER_MENU_T[key]?.en}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 mt-2 text-sm text-red-500 border-none bg-transparent cursor-pointer p-0 hover:text-red-600 transition-colors"
                >
                  <LogOut size={15} />
                  {USER_MENU_T.signOut[lang] || USER_MENU_T.signOut.en}
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 border-b border-surface-100 flex gap-2">
                <Link href={`/${lang}/login`} className="no-underline flex-1" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl border border-surface-200 text-surface-700 font-semibold text-sm bg-transparent cursor-pointer hover:bg-surface-50 transition-colors">
                    {USER_MENU_T.logIn[lang] || USER_MENU_T.logIn.en}
                  </button>
                </Link>
                <Link href={`/${lang}/signup`} className="no-underline flex-1" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-700 transition-colors">
                    {USER_MENU_T.signUp[lang] || USER_MENU_T.signUp.en}
                  </button>
                </Link>
              </div>
            )}

            {/* Categories */}
            <div className="px-5 pt-4 pb-2">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-3">
                {USER_MENU_T.browse[lang] || USER_MENU_T.browse.en}
              </p>
              {navCategories.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={i}
                    href={`/${lang}/category/${item.slug}`}
                    className="flex items-center justify-between py-3 border-b border-surface-50 text-surface-700 no-underline text-sm font-medium hover:text-brand-600 transition-colors group"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                        <Icon size={15} className="text-surface-500 group-hover:text-brand-500" />
                      </div>
                      {item.label}
                    </div>
                    <ChevronRight size={14} className="text-surface-300 group-hover:text-brand-400" />
                  </Link>
                );
              })}
            </div>

            {/* Links */}
            <div className="px-5 py-4 mt-auto border-t border-surface-100">
              {["Track Order", "Help Center", "Become a Vendor"].map((l, i) => (
                <a key={i} href="#" className="block py-2.5 text-sm text-surface-500 hover:text-surface-900 transition-colors no-underline">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-50 flex md:hidden mobile-bottom-nav">
        {[
          { icon: Home,        label: "Home",    href: `/${lang}` },
          { icon: Search,      label: "Browse",  href: `/${lang}/products` },
          { icon: Heart,       label: "Saved",   href: loggedIn ? `/${lang}/account/saved` : `/${lang}/login` },
          { icon: ShoppingBag, label: "Cart",    href: `/${lang}/cart`, badge: cartCount },
          { icon: User,        label: loggedIn ? (user?.first_name || "Account") : "Account",
            href: loggedIn ? `/${lang}/account` : `/${lang}/login` },
        ].map(({ icon: Icon, label, href, badge }, i) => (
          <Link
            key={i}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 no-underline text-surface-400 hover:text-brand-600 transition-colors"
          >
            <div className="relative">
              {i === 4 && loggedIn ? (
                <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-white text-[9px] font-bold">
                  {initials[0]}
                </div>
              ) : (
                <Icon size={20} strokeWidth={1.8} />
              )}
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
