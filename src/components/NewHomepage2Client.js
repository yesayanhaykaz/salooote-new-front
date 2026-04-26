"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, Star, Search, Heart, Send, MapPin,
  Cake, Flower2, PartyPopper, Camera, Music, UtensilsCrossed,
  Gift, MessageCircle, Wand2, Zap, Calendar, Crown,
} from "lucide-react";

/* ──────────────────────────────────────────────────
   Static demo data
   ────────────────────────────────────────────────── */
const ROTATE_WORDS = ["birthdays", "weddings", "baby showers", "engagements", "anniversaries"];

const MOMENTS = [
  { slug: "wedding",  name: "Weddings",      img: "/images/wedding-arch-beach.jpg", grad: "from-rose-500/80 to-brand-600/80",   icon: Heart },
  { slug: "birthday", name: "Birthdays",     img: "/images/cupcakes.jpg",           grad: "from-amber-500/80 to-rose-500/80",   icon: Cake },
  { slug: "baby",     name: "Baby Showers",  img: "/images/balloons-blue.jpg",      grad: "from-sky-500/80 to-violet-500/80",   icon: PartyPopper },
  { slug: "corporate",name: "Corporate",     img: "/images/event-dinner.jpg",       grad: "from-slate-700/85 to-slate-900/85", icon: Crown },
  { slug: "engagement",name: "Engagements",  img: "/images/wedding-dance.jpg",      grad: "from-fuchsia-500/80 to-rose-500/80", icon: Sparkles },
  { slug: "kids",     name: "Kids Parties",  img: "/images/party-balloons.jpg",     grad: "from-emerald-500/80 to-cyan-500/80", icon: Gift },
];

const TRENDING = [
  { id: 1, name: "Three-tier Rose Cake",     vendor: "Royal Bakes",     price: 45000, original: 60000, img: "/images/wedding-cake.jpg",    rating: 4.9 },
  { id: 2, name: "Premium Balloon Arch",     vendor: "Glow Decor",      price: 28000, original: null,  img: "/images/party-balloons.jpg",  rating: 4.8 },
  { id: 3, name: "Bridal Bouquet — Roses",   vendor: "Yerevan Flowers", price: 18000, original: 22000, img: "/images/flowers-roses.jpg",   rating: 5.0 },
  { id: 4, name: "Cookie Box — 24 pcs",      vendor: "Sweet Avenue",    price: 9500,  original: null,  img: "/images/cookies-box.jpg",     rating: 4.9 },
];

const TOP_VENDORS = [
  { slug: "royal-bakes",     name: "Royal Bakes",     cat: "Cakes & Desserts", rating: 4.9, img: "/images/wedding-cake2.jpg" },
  { slug: "yerevan-flowers", name: "Yerevan Flowers", cat: "Flowers & Decor",  rating: 4.8, img: "/images/flowers-roses.jpg" },
  { slug: "salooote",        name: "Sunset Studio",   cat: "Photography",      rating: 5.0, img: "/images/wedding-arch-beach.jpg" },
];

const QUICK_CHIPS = [
  { name: "Cakes",       icon: Cake },
  { name: "Flowers",     icon: Flower2 },
  { name: "Balloons",    icon: PartyPopper },
  { name: "Photography", icon: Camera },
  { name: "DJ & Music",  icon: Music },
  { name: "Catering",    icon: UtensilsCrossed },
  { name: "Gifts",       icon: Gift },
];

/* ──────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────── */
export default function NewHomepage2Client({ lang = "en", dict = {} }) {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % ROTATE_WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#fdfaf7] text-surface-900 selection:bg-rose-300/60 overflow-hidden">
      {/* ════════════ HERO ════════════ */}
      <section className="relative">
        {/* Aurora background */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-[#fdfaf7] to-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute top-40 left-1/4 w-[480px] h-[480px] rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[420px] h-[420px] rounded-full bg-fuchsia-200/30 blur-3xl" />
        </div>

        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 pt-14 sm:pt-24 pb-14 sm:pb-20 text-center">
          {/* AI chip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-rose-200/70 text-surface-700 px-4 py-1.5 text-xs font-semibold mb-7 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            New — AI Planner is live in Armenian, Russian & English
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display font-semibold tracking-tight text-[2.7rem] sm:text-[4rem] lg:text-[5.5rem] leading-[1] text-surface-900"
          >
            Make every <br className="sm:hidden" />
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="inline-block bg-gradient-to-r from-rose-500 via-rose-600 to-brand-600 bg-clip-text text-transparent"
                >
                  {ROTATE_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            <br />
            unforgettable.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-base sm:text-xl text-surface-600 max-w-[620px] mx-auto leading-relaxed"
          >
            Armenia's most beautiful celebrations start here. Cakes, flowers, venues, photographers — all in one place, with an AI that plans alongside you.
          </motion.p>

          {/* Floating glass search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-9 max-w-[640px] mx-auto"
          >
            <div className="flex items-center gap-2 rounded-full bg-white border border-surface-200 shadow-[0_24px_60px_-20px_rgba(225,29,92,0.25)] p-1.5 pl-5">
              <Search size={18} className="text-surface-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="What are you celebrating?"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-surface-800 placeholder:text-surface-400 py-2"
              />
              <Link
                href={`/${lang}/planner`}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white text-sm font-semibold px-5 py-3 hover:scale-[1.02] transition-transform"
              >
                <Sparkles size={15} /> Ask AI
              </Link>
              <Link
                href={`/${lang}/planner`}
                className="sm:hidden inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white w-11 h-11"
                aria-label="Ask AI"
              >
                <Sparkles size={16} />
              </Link>
            </div>

            {/* quick chips */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {QUICK_CHIPS.map(({ name, icon: Icon }) => (
                <Link
                  key={name}
                  href={`/${lang}/products`}
                  className="group inline-flex items-center gap-1.5 bg-white/70 hover:bg-white border border-surface-200 hover:border-rose-200 backdrop-blur text-xs sm:text-sm font-medium text-surface-700 px-3.5 py-2 rounded-full transition"
                >
                  <Icon size={13} className="text-rose-500" />
                  {name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-surface-500"
          >
            <span className="inline-flex items-center gap-2"><Zap size={14} className="text-amber-500" /> 850+ verified vendors</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-surface-300" />
            <span className="inline-flex items-center gap-2"><Star size={14} className="text-rose-500 fill-rose-500" /> 4.9 from 6,400+ reviews</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-surface-300" />
            <span className="inline-flex items-center gap-2"><Calendar size={14} className="text-emerald-600" /> 15K+ events planned</span>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-surface-200/70 bg-white/60 backdrop-blur-sm py-4 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
            {[...Array(2)].flatMap((_, k) =>
              ["Birthday", "Wedding", "Baby Shower", "Anniversary", "Corporate", "Engagement", "Kids Party", "Christmas", "Baptism"].map((m, i) => (
                <span key={`${k}-${i}`} className="inline-flex items-center gap-3 text-sm sm:text-base font-display font-medium text-surface-400">
                  <Sparkles size={14} className="text-rose-400" />
                  {m}
                </span>
              ))
            )}
          </div>
          <style jsx>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </section>

      {/* ════════════ MOMENTS GRID ════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-2">Browse moments</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              Pick the moment.<br className="sm:hidden" /> We'll bring it to life.
            </h2>
          </div>
          <Link href={`/${lang}/events`} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-rose-600 transition">
            All events <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {MOMENTS.map((m, i) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.slug}
                href={`/${lang}/events/${m.slug}`}
                className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto lg:min-h-[520px]" : "aspect-[4/5]"} bg-surface-100`}
              >
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 50vw, 25vw"}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${m.grad}`} />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold px-2.5 py-1 mb-3">
                    <Icon size={12} /> Explore
                  </div>
                  <div className={`font-display font-semibold text-white tracking-tight ${i === 0 ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl"}`}>
                    {m.name}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-white/85 text-sm font-medium">
                    Plan it <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ════════════ TRENDING NOW ════════════ */}
      <section className="bg-white border-y border-surface-100">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
                <Zap size={13} className="fill-rose-500 text-rose-500" /> TRENDING NOW
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                What everyone's loving
              </h2>
            </div>
            <Link href={`/${lang}/products`} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-rose-600 transition">
              See all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {TRENDING.map((p) => {
              const off = p.original ? Math.round((1 - p.price / p.original) * 100) : 0;
              return (
                <Link
                  key={p.id}
                  href={`/${lang}/products`}
                  className="group bg-white rounded-2xl border border-surface-100 hover:border-rose-200 hover:shadow-[0_24px_50px_-20px_rgba(225,29,92,0.25)] transition-all overflow-hidden"
                >
                  <div className="relative aspect-square bg-surface-100 overflow-hidden">
                    <Image src={p.img} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                    {off > 0 && (
                      <span className="absolute top-3 left-3 rounded-full bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1">
                        -{off}%
                      </span>
                    )}
                    <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-surface-700 hover:text-rose-600 transition shadow" aria-label="Save">
                      <Heart size={15} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                      <Star size={11} className="fill-amber-500" /> {p.rating}
                    </div>
                    <div className="mt-1 text-[15px] font-semibold text-surface-900 leading-snug line-clamp-2">{p.name}</div>
                    <div className="mt-0.5 text-xs text-surface-500">{p.vendor}</div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-base font-bold text-surface-900">{p.price.toLocaleString()} ֏</span>
                      {p.original && <span className="text-xs text-surface-400 line-through">{p.original.toLocaleString()} ֏</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════ TOP VENDORS ════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center max-w-[640px] mx-auto mb-10 sm:mb-14">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-2">Trusted by thousands</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            The best of Armenia, in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOP_VENDORS.map((v, i) => (
            <motion.div
              key={v.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/${lang}/vendor/${v.slug}`}
                className="group block bg-white rounded-3xl overflow-hidden border border-surface-100 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.18)] transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image src={v.img} alt={v.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-surface-800 shadow">
                    <Star size={12} className="text-amber-500 fill-amber-500" /> {v.rating} top-rated
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">{v.cat}</div>
                  <div className="mt-1 text-xl font-display font-semibold text-surface-900 tracking-tight">{v.name}</div>
                  <div className="mt-2 text-sm text-surface-500 inline-flex items-center gap-1"><MapPin size={13} /> Yerevan, Armenia</div>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600">
                    Visit profile <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════ STATS BANNER ════════════ */}
      <section className="px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto rounded-3xl bg-gradient-to-br from-surface-900 via-[#1a0f3d] to-[#2d1b5e] text-white p-10 sm:p-14 relative overflow-hidden">
          <div aria-hidden className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-rose-500/20 blur-3xl" />
          <div aria-hidden className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { n: "15K+",   l: "Events celebrated" },
              { n: "850+",   l: "Verified vendors" },
              { n: "4.9★",   l: "Average rating" },
              { n: "24/7",   l: "AI assistant" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                  {s.n}
                </div>
                <div className="mt-2 text-sm text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ AI SPOTLIGHT ════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1.5 text-xs font-semibold mb-5">
              <Wand2 size={14} /> Meet Sali
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05] text-surface-900">
              Your AI event planner that <span className="bg-gradient-to-r from-rose-500 to-brand-600 bg-clip-text text-transparent">actually gets it.</span>
            </h2>
            <p className="mt-5 text-surface-600 text-base sm:text-lg max-w-[520px] leading-relaxed">
              Tell Sali what you're imagining. She'll suggest vendors, build your checklist, and stay on budget — in Armenian, English, or Russian.
            </p>

            <div className="mt-7 space-y-3">
              {[
                "Personalized vendor matches",
                "Auto-generated event checklist",
                "Real-time budget tracking",
                "Booking & reminders, all in chat",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-surface-700">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-brand-600 text-white flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/planner`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white px-6 py-3.5 font-semibold text-sm shadow-glow hover:scale-[1.02] transition-transform"
              >
                <Sparkles size={16} /> Try Sali for free <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Phone mockup with chat */}
          <div className="relative">
            <div className="relative mx-auto max-w-[440px]">
              {/* glow */}
              <div aria-hidden className="absolute -inset-8 bg-gradient-to-tr from-rose-300/40 to-amber-200/40 rounded-[3rem] blur-3xl -z-10" />

              <div className="relative bg-white rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(225,29,92,0.35)] border border-surface-100 p-5 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-surface-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-brand-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-surface-900">Sali · AI Planner</div>
                    <div className="text-[11px] text-emerald-600 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online — replies in seconds
                    </div>
                  </div>
                </div>

                <div className="bg-surface-50 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-surface-800 max-w-[85%]">
                  Hi! I'm planning my daughter's 5th birthday. Pink theme, 20 kids 🎀
                </div>
                <div className="bg-gradient-to-br from-rose-500 to-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm ml-auto max-w-[85%] shadow-md">
                  How fun! ✨ Here's my plan:
                  <div className="mt-2 space-y-1.5 text-white/95">
                    <div className="inline-flex items-center gap-1.5"><Cake size={12} /> Pink cloud cake — Royal Bakes</div>
                    <div className="inline-flex items-center gap-1.5"><PartyPopper size={12} /> Balloon arch — Glow Decor</div>
                    <div className="inline-flex items-center gap-1.5"><Camera size={12} /> Sunset Studio for photos</div>
                  </div>
                  <div className="mt-2 text-[11px] text-white/80">Total est. ~85,000 ֏ — within budget 💝</div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 bg-surface-50 rounded-full px-4 py-2.5 text-xs text-surface-400">Type a message…</div>
                  <button className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-brand-600 text-white flex items-center justify-center" aria-label="Send">
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {/* floating decoration cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-8 hidden sm:flex bg-white rounded-2xl border border-surface-100 shadow-xl px-3 py-2.5 items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center"><Cake size={14} /></div>
                <div>
                  <div className="text-xs font-semibold text-surface-900">3 cakes matched</div>
                  <div className="text-[10px] text-surface-500">in your budget</div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -right-6 hidden sm:flex bg-white rounded-2xl border border-surface-100 shadow-xl px-3 py-2.5 items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><Star size={14} className="fill-amber-500" /></div>
                <div>
                  <div className="text-xs font-semibold text-surface-900">Top-rated</div>
                  <div className="text-[10px] text-surface-500">verified vendors</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FINAL CTA ════════════ */}
      <section className="relative px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-[1180px] mx-auto relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-rose-500 via-rose-600 to-brand-600 text-white p-10 sm:p-16 text-center">
          <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-white/40 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-white/30 blur-3xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-semibold mb-6">
              <Heart size={13} className="fill-white" /> Made in Armenia, with love
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02]">
              Let's celebrate <br className="sm:hidden" /> something beautiful.
            </h2>
            <p className="mt-5 text-white/90 max-w-[560px] mx-auto text-base sm:text-lg">
              Whether it's a wedding for 200 or a birthday for 5 — we'll make it unforgettable.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${lang}/planner`}
                className="inline-flex items-center gap-2 rounded-full bg-white text-rose-600 px-7 py-4 font-semibold text-sm hover:scale-[1.03] transition-transform shadow-xl"
              >
                <Sparkles size={16} /> Plan with AI <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/vendor`}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 backdrop-blur text-white px-7 py-4 font-semibold text-sm hover:bg-white/25 transition"
              >
                <MessageCircle size={16} /> Browse vendors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
