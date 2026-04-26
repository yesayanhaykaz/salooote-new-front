"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck, Truck, Clock,
  Heart, Cake, Flower2, PartyPopper, Camera, Music, UtensilsCrossed,
  Search, CheckCircle2, Quote,
} from "lucide-react";

/* ──────────────────────────────────────────────────
   Demo data — replaced by API in production
   ────────────────────────────────────────────────── */
const CATEGORIES = [
  { slug: "cakes",       name: "Cakes & Desserts", img: "/images/wedding-cake.jpg",   icon: Cake },
  { slug: "flowers",     name: "Flowers & Decor",  img: "/images/flowers-roses.jpg",  icon: Flower2 },
  { slug: "balloons",    name: "Balloons & Party", img: "/images/balloons-blue.jpg",  icon: PartyPopper },
  { slug: "photography", name: "Photography",      img: "/images/wedding-ceremony.jpg", icon: Camera },
  { slug: "music",       name: "DJ & Music",       img: "/images/hero-dj.jpg",        icon: Music },
  { slug: "catering",    name: "Catering",         img: "/images/catering-buffet.jpg", icon: UtensilsCrossed },
];

const FEATURED_VENDORS = [
  { slug: "salooote",        name: "Royal Bakes",      cat: "Cakes & Desserts", rating: 4.9, reviews: 312, city: "Yerevan",  img: "/images/wedding-cake2.jpg" },
  { slug: "yerevan-flowers", name: "Yerevan Flowers",  cat: "Flowers & Decor",  rating: 4.8, reviews: 198, city: "Yerevan",  img: "/images/flowers-roses.jpg" },
  { slug: "royal-bakes",     name: "Sunset Studio",    cat: "Photography",      rating: 5.0, reviews: 124, city: "Gyumri",   img: "/images/wedding-arch-beach.jpg" },
];

const TESTIMONIALS = [
  { quote: "Salooote took the chaos out of our wedding. Every vendor delivered exactly what they promised.", name: "Anush & Davit", role: "Wedding · 2025" },
  { quote: "Booked everything for my daughter's birthday in one evening. The photos were stunning.", name: "Mariam K.", role: "Birthday party · Yerevan" },
];

/* ──────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────── */
export default function NewHomepageClient({ lang = "en", dict = {} }) {
  const h = dict?.hero || {};
  const t = dict?.trust || {};

  return (
    <div className="bg-white text-surface-900 selection:bg-rose-200/70">
      {/* ═════════════════ HERO ═════════════════ */}
      <section className="relative overflow-hidden">
        {/* soft ambient glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute top-40 -right-20 w-[420px] h-[420px] rounded-full bg-amber-100/50 blur-3xl" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1.5 text-xs font-semibold mb-5">
              <Sparkles size={14} />
              {h.badge || "Plan. Book. Celebrate."}
            </div>

            <h1 className="font-display text-[2.6rem] sm:text-[3.5rem] lg:text-[4.4rem] leading-[1.02] tracking-tight font-semibold text-surface-900">
              {h.title1 || "Plan your dream"}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-rose-500 via-rose-600 to-brand-600 bg-clip-text text-transparent">
                  {h.titleAccent || "events,"}
                </span>
                <span aria-hidden className="absolute left-0 right-0 bottom-1 h-3 bg-rose-100/80 -z-0 rounded-sm" />
              </span>{" "}
              <br className="hidden sm:block" />
              {h.title2 || "easily."}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-surface-600 max-w-[560px] leading-relaxed">
              {h.subtitle ||
                "Explore vendors, book services, and plan your event — all in one place."}
            </p>

            {/* Search-bar style entry */}
            <div className="mt-7 max-w-[560px]">
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-surface-200 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.12)] p-2 pl-4">
                <Search size={18} className="text-surface-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Try: birthday cake, wedding photographer…"
                  className="flex-1 bg-transparent outline-none text-sm text-surface-800 placeholder:text-surface-400"
                />
                <Link
                  href={`/${lang}/products`}
                  className="rounded-xl bg-surface-900 text-white text-sm font-semibold px-4 py-2.5 hover:bg-surface-800 transition-colors"
                >
                  {h.ctaSecondary || "Search"}
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {["Cakes", "Flowers", "Photographers", "Venues"].map((x) => (
                  <Link
                    key={x}
                    href={`/${lang}/products`}
                    className="text-xs font-medium text-surface-600 bg-surface-100 hover:bg-surface-200 transition px-3 py-1.5 rounded-full"
                  >
                    {x}
                  </Link>
                ))}
              </div>
            </div>

            {/* Dual CTA */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/planner`}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white px-6 py-3.5 font-semibold text-sm shadow-glow hover:shadow-[0_18px_40px_-12px_rgba(225,29,92,0.55)] transition-all"
              >
                <Sparkles size={16} />
                {h.ctaPrimary || "Plan an Event"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/${lang}/vendor`}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-surface-200 text-surface-800 px-6 py-3.5 font-semibold text-sm hover:bg-surface-50 transition-colors"
              >
                Browse vendors
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* mini trust row */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-surface-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> {t.verified || "Verified vendors"}</span>
              <span className="inline-flex items-center gap-1.5"><Truck size={14} className="text-brand-600" /> {t.delivery || "Same-day delivery"}</span>
              <span className="inline-flex items-center gap-1.5"><Star size={14} className="text-amber-500 fill-amber-500" /> {t.rating || "4.9 avg rating"}</span>
            </div>
          </motion.div>

          {/* Hero collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative h-[200px] sm:h-[260px] rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                <Image src="/images/wedding-cake.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="relative h-[200px] sm:h-[260px] rounded-2xl overflow-hidden mt-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                <Image src="/images/flowers-roses.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="relative h-[200px] sm:h-[260px] rounded-2xl overflow-hidden -mt-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                <Image src="/images/wedding-ceremony.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="relative h-[200px] sm:h-[260px] rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                <Image src="/images/party-balloons.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            </div>

            {/* floating rating chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="hidden sm:flex absolute -left-4 top-10 items-center gap-2 rounded-2xl bg-white border border-surface-100 shadow-xl px-3.5 py-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-brand-600 flex items-center justify-center text-white">
                <Star size={16} className="fill-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-surface-900">4.9 / 5</div>
                <div className="text-[11px] text-surface-500 -mt-0.5">15K+ events</div>
              </div>
            </motion.div>

            {/* floating verified chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="hidden sm:flex absolute -right-3 bottom-8 items-center gap-2 rounded-2xl bg-white border border-surface-100 shadow-xl px-3.5 py-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-surface-900">850+ vendors</div>
                <div className="text-[11px] text-surface-500 -mt-0.5">All verified</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════ TRUST STRIP ═════════════════ */}
      <section className="border-y border-surface-100 bg-surface-50/60">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { i: ShieldCheck, t: t.verified || "Verified vendors", s: "Vetted by our team" },
            { i: Truck,       t: t.delivery || "Same-day delivery", s: "Across Yerevan" },
            { i: Star,        t: t.rating   || "4.9 avg rating",    s: "From 6,400+ reviews" },
            { i: Clock,       t: t.events   || "15,000+ events",    s: "Planned with us" },
          ].map(({ i: Icon, t: title, s: sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-surface-200 flex items-center justify-center text-brand-600 flex-shrink-0">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-surface-900 truncate">{title}</div>
                <div className="text-xs text-surface-500 truncate">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════ CATEGORIES ═════════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-2">
              {dict?.categories?.sectionLabel || "Browse by Category"}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-surface-900">
              {dict?.categories?.title || "Everything you need"}
            </h2>
          </div>
          <Link
            href={`/${lang}/category`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-brand-600 transition"
          >
            {dict?.categories?.viewAll || "All categories"}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                href={`/${lang}/category/${c.slug}`}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/5] sm:aspect-[5/6] bg-surface-100"
              >
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
                  <div>
                    <div className="text-xs font-medium text-white/75 mb-0.5">Discover</div>
                    <div className="text-base sm:text-xl font-semibold text-white tracking-tight">{c.name}</div>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all group-hover:bg-white group-hover:text-rose-600">
                    <ArrowRight size={16} />
                  </div>
                </div>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-rose-600 shadow-md">
                  <Icon size={16} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link href={`/${lang}/category`} className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600">
            {dict?.categories?.viewAll || "All categories"} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═════════════════ FEATURED VENDORS ═════════════════ */}
      <section className="bg-surface-50 border-y border-surface-100">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-2">
                Editor's picks
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-surface-900">
                Featured vendors
              </h2>
              <p className="text-surface-600 mt-2 max-w-[560px]">
                Hand-picked businesses our team has worked with — every one of them has glowing reviews and reliable delivery.
              </p>
            </div>
            <Link
              href={`/${lang}/vendor`}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-brand-600 transition"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_VENDORS.map((v) => (
              <Link
                key={v.slug}
                href={`/${lang}/vendor/${v.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-surface-100 hover:border-surface-200 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={v.img}
                    alt={v.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-surface-800 shadow">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    {v.rating}
                  </div>
                  <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-surface-700 hover:text-rose-600 transition" aria-label="Save">
                    <Heart size={16} />
                  </button>
                </div>
                <div className="p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">{v.cat}</div>
                  <div className="mt-1 text-lg font-semibold text-surface-900 tracking-tight">{v.name}</div>
                  <div className="mt-1 text-sm text-surface-500 inline-flex items-center gap-1">
                    <MapPin size={13} /> {v.city} · {v.reviews} reviews
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-surface-900 group-hover:text-rose-600 transition">
                    View shop <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════ HOW IT WORKS ═════════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center max-w-[640px] mx-auto mb-10 sm:mb-14">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-2">
            How it works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-surface-900">
            Plan in three simple steps
          </h2>
          <p className="text-surface-600 mt-3">
            From idea to celebration — Salooote makes it effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: "01", t: "Tell us what you need", s: "Pick an event, set a budget. Or just chat with our AI planner.", i: Sparkles },
            { n: "02", t: "Browse curated vendors", s: "We surface the best matches based on your style and budget.", i: Search },
            { n: "03", t: "Book in one place",     s: "Confirm details, pay securely, and we'll handle the rest.", i: CheckCircle2 },
          ].map(({ n, t: title, s, i: Icon }) => (
            <div key={n} className="relative bg-white rounded-2xl border border-surface-100 p-6 hover:border-rose-200 hover:shadow-md transition">
              <div className="absolute top-6 right-6 text-5xl font-display font-bold text-surface-100 select-none">{n}</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-5">
                <Icon size={20} />
              </div>
              <div className="text-lg font-semibold text-surface-900 tracking-tight">{title}</div>
              <p className="text-sm text-surface-600 mt-1.5 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════ AI PLANNER BAND ═════════════════ */}
      <section className="px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 via-[#1a0f3d] to-[#2d1b5e] text-white p-8 sm:p-12 lg:p-16">
          {/* glows */}
          <div aria-hidden className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-rose-500/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-20 w-[360px] h-[360px] rounded-full bg-violet-500/30 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md px-3 py-1.5 text-xs font-semibold mb-5">
                <Sparkles size={14} /> {dict?.aiPlanner?.badge || "AI-Powered"}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05]">
                {dict?.aiPlanner?.title || "Take the guess-work out of"}{" "}
                <span className="bg-gradient-to-r from-rose-300 to-amber-200 bg-clip-text text-transparent">
                  {dict?.aiPlanner?.titleAccent || "event planning."}
                </span>
              </h2>
              <p className="mt-4 text-white/75 max-w-[520px] leading-relaxed">
                {dict?.aiPlanner?.subtitle ||
                  "Smart planning — pick the right vendors, stay on budget, bring your event to life."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/${lang}/planner`}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-surface-900 px-6 py-3.5 font-semibold text-sm hover:scale-[1.02] transition-transform"
                >
                  <Sparkles size={16} /> {dict?.aiPlanner?.ctaPrimary || "Start Planning"} <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/${lang}/about`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-6 py-3.5 font-semibold text-sm hover:bg-white/15 transition"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* AI chat preview */}
            <div className="lg:col-span-5">
              <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-brand-600 flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Sali — AI Planner</div>
                    <div className="text-[11px] text-white/60">Ready to help</div>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                  </span>
                </div>
                <div className="bg-white/[0.04] rounded-xl p-3 text-sm text-white/85">
                  I'm hosting a 50-guest birthday with a pink theme. Need cake, balloons, and a photographer.
                </div>
                <div className="bg-gradient-to-br from-rose-500/20 to-brand-600/20 border border-white/10 rounded-xl p-3 text-sm text-white/90">
                  ✨ I found 3 great matches in Yerevan — a tiered rose cake from Royal Bakes, a balloon arch by Glow Decor, and Sunset Studio for photos. Want me to book them?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════ TESTIMONIALS ═════════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="text-center max-w-[640px] mx-auto mb-10 sm:mb-14">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-2">
            {dict?.testimonials?.sectionLabel || "Happy Clients"}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-surface-900">
            {dict?.testimonials?.title || "Hear from our clients"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((q, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-white to-rose-50/40 border border-rose-100/60 rounded-3xl p-7 sm:p-9"
            >
              <Quote size={28} className="text-rose-300 mb-3" />
              <p className="font-display text-xl sm:text-2xl leading-relaxed text-surface-800 tracking-tight">
                "{q.quote}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-brand-600 text-white font-semibold flex items-center justify-center">
                  {q.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-surface-900">{q.name}</div>
                  <div className="text-xs text-surface-500">{q.role}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════ FINAL CTA ═════════════════ */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-[1100px] mx-auto rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-brand-600 text-white p-10 sm:p-16 text-center shadow-glow relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
              Ready to plan something unforgettable?
            </h2>
            <p className="mt-4 text-white/90 max-w-[560px] mx-auto text-base sm:text-lg">
              Join thousands of celebrations powered by Salooote's verified vendors.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${lang}/planner`}
                className="inline-flex items-center gap-2 rounded-full bg-white text-rose-600 px-7 py-4 font-semibold text-sm hover:scale-[1.03] transition-transform"
              >
                <Sparkles size={16} /> Start with AI <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/apply`}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/30 backdrop-blur text-white px-7 py-4 font-semibold text-sm hover:bg-white/20 transition"
              >
                Become a vendor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
