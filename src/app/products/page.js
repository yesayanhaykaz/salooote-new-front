"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { SAMPLE_PRODUCTS, CATEGORIES, EVENT_TYPES, PRODUCT_SECTIONS } from "@/lib/data";
import { Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music, Heart, ChevronRight } from "lucide-react";

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
  Birthdays:        "bg-blue-50 border-blue-100",
  Weddings:         "bg-pink-50 border-pink-100",
  "Flowers & Gifts":"bg-green-50 border-green-100",
  Parties:          "bg-amber-50 border-amber-100",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 py-12 flex items-center justify-between gap-8 flex-wrap">
          <div className="max-w-[500px]">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">Everything in one place</p>
            <h1 className="text-5xl font-bold text-surface-900 leading-tight mb-4">All Products</h1>
            <p className="text-surface-500 text-base leading-relaxed mb-8 max-w-[420px]">
              Thousands of products from verified vendors — cakes, catering, flowers, music, and more for every occasion.
            </p>
            <Link href="/category">
              <button className="btn-primary bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2">
                Shop Now <ChevronRight size={15} />
              </button>
            </Link>
          </div>
          <div className="relative w-[260px] h-[200px] flex-shrink-0 hidden md:block">
            <Image src="/images/cupcakes.jpg" alt="Products" fill className="object-cover rounded-2xl" />
          </div>
        </div>
      </section>

      {/* ── Event types ── */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-12">
        <p className="text-sm font-semibold text-surface-700 mb-5">Shop by occasion</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EVENT_TYPES.map((ev, i) => {
            const Icon = catIcons[ev.icon] || Gift;
            return (
              <Link key={i} href="/category" className="no-underline">
                <div className={`rounded-xl p-5 border ${eventColors[ev.title] || "bg-brand-50 border-brand-100"} hover:-translate-y-1 transition-all cursor-pointer`}>
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
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-12">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xl font-bold text-surface-900">Categories</p>
          <Link href="/category" className="text-sm font-medium text-brand-600 no-underline flex items-center gap-1 hover:gap-2 transition-all">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map((cat, i) => {
            const Icon = catIcons[cat.icon] || Gift;
            const imgSrc = catImages[cat.name];
            return (
              <Link key={i} href="/category" className="no-underline flex-shrink-0">
                <div className="w-[124px] h-[156px] rounded-xl overflow-hidden relative border border-surface-200 group cursor-pointer">
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
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Products by section ── */}
      {PRODUCT_SECTIONS.map((section, si) => {
        const Icon = catIcons[section.icon] || Gift;
        const imgs = sectionImages[section.title] || [];
        const sectionProducts = SAMPLE_PRODUCTS.slice(0, 5).map((p, i) => ({
          ...p, id: si * 10 + i + 1, image: imgs[i] || null,
        }));
        return (
          <section key={si} className="max-w-container mx-auto px-6 md:px-8 pb-16">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={18} className="text-brand-600" strokeWidth={1.5} />
                  <h2 className="text-2xl font-bold text-surface-900">{section.title}</h2>
                </div>
                <p className="text-surface-400 text-sm max-w-[340px]">{section.desc}</p>
              </div>
              <Link href="/category" className="text-sm font-medium text-brand-600 no-underline flex items-center gap-1 hover:gap-2 transition-all">
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {sectionProducts.map((p, i) => <ProductCard key={i} product={p} />)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sectionProducts.map((p, i) => <ProductCard key={i + 5} product={{ ...p, id: p.id + 5 }} />)}
            </div>
          </section>
        );
      })}

      {/* ── Promo banner ── */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-16">
        <div className="rounded-2xl overflow-hidden relative min-h-[200px] flex items-center bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-100">
          <div className="relative z-10 p-10 md:p-14 max-w-[480px]">
            <p className="text-brand-600 text-xs font-bold uppercase tracking-widest mb-2">Limited Time</p>
            <h2 className="text-4xl font-bold text-surface-900 leading-tight mb-2">Yearly Sale</h2>
            <p className="text-surface-600 text-base mb-6">On all birthday decoration items.</p>
            <button className="btn-primary bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer">
              Shop the Sale
            </button>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-[260px] overflow-hidden hidden md:block">
            <Image src="/images/party-balloons2.jpg" alt="Sale" fill className="object-cover object-left opacity-30" />
          </div>
        </div>
      </section>
    </div>
  );
}
