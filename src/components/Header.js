"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Search, Heart, ShoppingBag, Menu, X,
  Cake, UtensilsCrossed, Flower2, PartyPopper,
  Gift, Music, Sparkles, MapPin, Home, User, ChevronRight
} from "lucide-react";

function getNavCategories(lang) {
  return [
    { label: "Cakes",      href: `/${lang}/category`, icon: Cake },
    { label: "Catering",   href: `/${lang}/category`, icon: UtensilsCrossed },
    { label: "Flowers",    href: `/${lang}/category`, icon: Flower2 },
    { label: "Party",      href: `/${lang}/category`, icon: PartyPopper },
    { label: "Gifts",      href: `/${lang}/category`, icon: Gift },
    { label: "DJ & Music", href: `/${lang}/category`, icon: Music },
    { label: "Venues",     href: `/${lang}/category`, icon: MapPin },
    { label: "Premium",    href: `/${lang}/products`, icon: Sparkles },
  ];
}

export default function Header({ lang = "en" }) {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const NAV_CATEGORIES = getNavCategories(lang);

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
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search — desktop */}
          <div className="flex-1 max-w-[480px] mx-4 hidden md:block">
            <div className="flex items-center bg-surface-50 rounded-xl px-4 py-2.5 border border-surface-200 hover:border-surface-300 focus-within:border-brand-500 focus-within:bg-white focus-within:shadow-focus transition-all">
              <Search size={15} className="text-surface-400 mr-3 flex-shrink-0" />
              <input
                type="text"
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
            <button className="w-9 h-9 rounded-xl items-center justify-center hover:bg-surface-100 transition-colors hidden md:flex">
              <Heart size={17} className="text-surface-500" />
            </button>

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

            {/* Auth — desktop */}
            <Link href={`/${lang}/login`} className="no-underline hidden md:block">
              <span className="text-surface-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors">
                Log in
              </span>
            </Link>
            <Link href={`/${lang}/signup`} className="no-underline hidden md:block">
              <button className="bg-brand-600 text-white border-none rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                Sign up
              </button>
            </Link>

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
                placeholder="Search products, vendors…"
                className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700 placeholder:text-surface-400"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X size={15} className="text-surface-400" />
              </button>
            </div>
          </div>
        )}

        {/* ── Category pills nav ── */}
        <div className="border-t border-surface-100 bg-white">
          <div className="max-w-container mx-auto px-4 md:px-8 flex items-center gap-0.5 overflow-x-auto hide-scrollbar py-2">
            {NAV_CATEGORIES.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center gap-1.5 text-surface-500 no-underline py-1.5 px-3 rounded-full text-xs font-medium hover:bg-surface-100 hover:text-surface-900 whitespace-nowrap transition-colors flex-shrink-0"
                >
                  <Icon size={12} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
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

            {/* Auth */}
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

            {/* Categories */}
            <div className="px-5 pt-4 pb-2">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-3">Browse</p>
              {NAV_CATEGORIES.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={i}
                    href={item.href}
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
          { icon: Heart,       label: "Saved",   href: "#" },
          { icon: ShoppingBag, label: "Cart",    href: `/${lang}/cart`, badge: cartCount },
          { icon: User,        label: "Account", href: `/${lang}/login` },
        ].map(({ icon: Icon, label, href, badge }, i) => (
          <Link
            key={i}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 no-underline text-surface-400 hover:text-brand-600 transition-colors"
          >
            <div className="relative">
              <Icon size={20} strokeWidth={1.8} />
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
