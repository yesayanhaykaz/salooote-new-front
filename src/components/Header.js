"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { categoriesAPI, getUser, clearAuth, isLoggedIn } from "@/lib/api";
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

export default function Header({ lang = "en" }) {
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

  useEffect(() => {
    categoriesAPI.list(lang)
      .then(res => {
        setNavCategories((res?.data || []).slice(0, 8).map(c => ({
          label: c.name,
          slug: c.slug,
          icon: ICON_MAP[c.icon] || ICON_MAP[c.emoji] || slugIcon(c.slug),
        })));
      })
      .catch(() => {});
  }, [lang]);

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
          <div className="flex-1 max-w-[480px] mx-4 hidden md:block">
            <div className="flex items-center bg-surface-50 rounded-xl px-4 py-2.5 border border-surface-200 hover:border-surface-300 focus-within:border-brand-500 focus-within:bg-white focus-within:shadow-focus transition-all">
              <Search size={15} className="text-surface-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search products, vendors…"
                className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700 placeholder:text-surface-400"
              />
            </div>
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
                      { icon: User,     label: "My Profile",    href: `/${lang}/account` },
                      { icon: Package,  label: "My Orders",     href: `/${lang}/account/orders` },
                      { icon: Bookmark, label: "Saved Items",   href: `/${lang}/account/saved` },
                      { icon: Settings, label: "Settings",      href: `/${lang}/account/settings` },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-brand-600 no-underline transition-colors"
                      >
                        <Icon size={15} className="text-surface-400" />
                        {label}
                      </Link>
                    ))}

                    <div className="border-t border-surface-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left border-none bg-transparent cursor-pointer transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
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
                    Log in
                  </span>
                </Link>
                <Link href={`/${lang}/signup`} className="no-underline">
                  <button className="bg-brand-600 text-white border-none rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                    Sign up
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
          <div className="md:hidden px-4 pb-3 animate-fade-up">
            <div className="flex items-center bg-surface-50 rounded-xl px-4 py-3 border border-surface-200 focus-within:border-brand-500 focus-within:bg-white transition-all">
              <Search size={15} className="text-surface-400 mr-3 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search products, vendors…"
                className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700 placeholder:text-surface-400"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X size={15} className="text-surface-400" />
              </button>
            </div>
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
              animation: headerPillsTicker 40s linear infinite;
              will-change: transform;
            }
          `}</style>
          <div className="py-1.5">
            {(() => {
              const allProductsItem = { label: "All Products", slug: "products", icon: Sparkles, isAll: true };
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
                  { icon: User,     label: "My Profile",  href: `/${lang}/account` },
                  { icon: Package,  label: "My Orders",   href: `/${lang}/account/orders` },
                  { icon: Bookmark, label: "Saved Items", href: `/${lang}/account/saved` },
                ].map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-sm text-surface-700 hover:text-brand-600 no-underline transition-colors"
                  >
                    <Icon size={15} className="text-surface-400" />
                    {label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 mt-2 text-sm text-red-500 border-none bg-transparent cursor-pointer p-0 hover:text-red-600 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 border-b border-surface-100 flex gap-2">
                <Link href={`/${lang}/login`} className="no-underline flex-1" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl border border-surface-200 text-surface-700 font-semibold text-sm bg-transparent cursor-pointer hover:bg-surface-50 transition-colors">
                    Log in
                  </button>
                </Link>
                <Link href={`/${lang}/signup`} className="no-underline flex-1" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-700 transition-colors">
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            {/* Categories */}
            <div className="px-5 pt-4 pb-2">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-3">Browse</p>
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
