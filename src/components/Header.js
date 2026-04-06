"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import {
  Search, Bell, Heart, ShoppingBag, Menu, ChevronDown,
  Globe, X, Cake, UtensilsCrossed, Flower2, PartyPopper,
  Gift, Music, Sparkles, MapPin
} from "lucide-react";

const NAV_CATEGORIES = [
  { label: "Cakes & Desserts", href: "/category", icon: Cake },
  { label: "Catering",         href: "/category", icon: UtensilsCrossed },
  { label: "Flowers",          href: "/category", icon: Flower2 },
  { label: "Party & Decor",    href: "/category", icon: PartyPopper },
  { label: "Gifts",            href: "/category", icon: Gift },
  { label: "DJ & Music",       href: "/category", icon: Music },
  { label: "Venues",           href: "/category", icon: MapPin },
  { label: "Premium",          href: "/products", icon: Sparkles },
];

export default function Header() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 h-16 flex items-center gap-4">

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors flex-shrink-0"
          >
            {menuOpen
              ? <X size={18} className="text-surface-700" />
              : <Menu size={18} className="text-surface-700" />
            }
          </button>

          {/* Logo */}
          <Link href="/" className="no-underline flex-shrink-0">
            <span className="text-[22px] font-bold text-surface-900 tracking-tight leading-none">
              Salooote
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[520px] mx-6 hidden md:block">
            <div className="flex items-center bg-surface-100 rounded-xl px-4 py-2.5 border border-surface-200 hover:border-surface-300 focus-within:border-brand-500 focus-within:bg-white focus-within:shadow-focus transition-all">
              <Search size={16} className="text-surface-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products, vendors…"
                className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700 placeholder:text-surface-400"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Language */}
            <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors">
              <Globe size={15} className="text-surface-400" />
              <span className="text-xs font-medium text-surface-500">EN</span>
              <ChevronDown size={12} className="text-surface-400" />
            </button>

            {/* Notifications */}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors relative">
              <Bell size={17} className="text-surface-500" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-500 rounded-full" />
            </button>

            {/* Wishlist */}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors">
              <Heart size={17} className="text-surface-500" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors relative">
              <ShoppingBag size={17} className="text-surface-500" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="w-px h-5 bg-surface-200 mx-2 hidden md:block" />

            {/* Auth */}
            <Link href="/login" className="no-underline hidden md:block">
              <span className="text-surface-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors">
                Log in
              </span>
            </Link>
            <Link href="/signup" className="no-underline">
              <button className="bg-brand-600 text-white border-none rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category nav ── */}
      <nav className="bg-brand-600">
        <div className="max-w-container mx-auto px-6 md:px-8 flex items-center overflow-x-auto hide-scrollbar">
          {NAV_CATEGORIES.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.href}
                className="nav-link flex items-center gap-1.5 text-white/80 no-underline py-3 px-4 text-[13px] font-medium hover:text-white whitespace-nowrap transition-colors flex-shrink-0"
              >
                <Icon size={13} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="modal-overlay fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="modal-content bg-white h-full w-[280px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-surface-900">Salooote</span>
              <button onClick={() => setMenuOpen(false)} className="border-none bg-transparent cursor-pointer">
                <X size={20} className="text-surface-600" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center bg-surface-100 rounded-xl px-4 py-3 border border-surface-200">
                <Search size={16} className="text-surface-400 mr-3" />
                <input placeholder="Search…" className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700" />
              </div>
            </div>
            {NAV_CATEGORIES.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i} href={item.href}
                  className="flex items-center gap-3 py-3 border-b border-surface-100 text-surface-700 no-underline text-sm font-medium hover:text-brand-600 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={16} className="text-brand-500" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/login" className="no-underline">
                <button className="w-full py-3 rounded-xl border border-surface-200 text-surface-700 font-semibold text-sm bg-transparent cursor-pointer hover:bg-surface-50 transition-colors">
                  Log in
                </button>
              </Link>
              <Link href="/signup" className="no-underline">
                <button className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm border-none cursor-pointer hover:bg-brand-700 transition-colors">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
