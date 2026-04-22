"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion, AnimatePresence, useScroll, useTransform,
} from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import MagneticButton from "@/components/MagneticButton";
import { CATEGORIES as FALLBACK_CATEGORIES, SAMPLE_PRODUCTS as FALLBACK_PRODUCTS, TESTIMONIALS } from "@/lib/data";
import { categoriesAPI, productsAPI } from "@/lib/api";
import {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music,
  ArrowRight, Star, Quote, MapPin, Calendar, Sparkles,
  MessageCircle, ChevronRight, ChevronLeft, Heart, Send, Play,
  CheckCircle2, Users, Package, Smile, Shield, Truck, Zap,
  Search, Clock, Award, Camera, Mic2, Utensils,
  ShoppingBag as Bag,
} from "lucide-react";

const catIcons = {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music,
  Camera, Mic2, Utensils, MapPin, Sparkles, Heart, Star, Bag,
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
const PORTRAIT_GRADIENTS = [
  ["#FF6B9D", "#C84B8F"],
  ["#F7971E", "#FFD200"],
  ["#A18CD1", "#FBC2EB"],
  ["#43CEA2", "#185A9D"],
  ["#F953C6", "#B91D73"],
  ["#56CCF2", "#2F80ED"],
  ["#F2994A", "#F2C94C"],
  ["#6FCF97", "#219653"],
];

/* ── Ambient orb ── */
function Orb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ y: [0, -30, 0], scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ════════════════════════════════════════════
   HERO — split layout with scrolling mosaic
════════════════════════════════════════════ */
const COL1 = [
  { src: "/images/wedding-cake.jpg",    h: "short" },
  { src: "/images/flowers-roses.jpg",   h: "mid"   },
  { src: "/images/wedding-ceremony.jpg",h: "tall"  },
  { src: "/images/balloons-blue.jpg",   h: "short" },
  { src: "/images/catering-setup.jpg",  h: "mid"   },
];
const COL2 = [
  { src: null, label: "Event vendors near Yerevan", h: "label" },
  { src: "/images/party-balloons.jpg",  h: "mid"   },
  { src: "/images/wedding-dance.jpg",   h: "tall"  },
  { src: null, confetti: true,          h: "short" },
  { src: "/images/hero-dj.jpg",         h: "mid"   },
];
const COL3 = [
  { src: "/images/wedding-arch-beach.jpg", h: "tall"  },
  { src: "/images/cupcakes.jpg",           h: "mid"   },
  { src: "/images/vendor-woman.jpg",       h: "short" },
  { src: "/images/catering-buffet.jpg",    h: "mid"   },
];

const cardH = { short: "190px", mid: "280px", tall: "470px", label: "104px" };

function MosaicCard({ card }) {
  if (card.label) {
    return (
      <div style={{ minHeight: cardH.label, borderRadius: 28, background: "#ffc93f", color: "#671687", fontWeight: 900, display: "flex", alignItems: "center", padding: "22px", fontSize: "1.1rem", lineHeight: 1.3 }}>
        {card.label}
      </div>
    );
  }
  if (card.confetti) {
    return (
      <div style={{ minHeight: cardH.short, borderRadius: 28, background: "linear-gradient(180deg,#ffd72d,#ffca17)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 10% 18%, #fff 0 3px, transparent 4px), radial-gradient(circle at 28% 32%, #ff7bb4 0 4px, transparent 5px), radial-gradient(circle at 54% 22%, #8e3cff 0 3px, transparent 4px), radial-gradient(circle at 72% 44%, #fff 0 4px, transparent 5px), radial-gradient(circle at 82% 18%, #ff8d38 0 4px, transparent 5px), radial-gradient(circle at 38% 68%, #fff 0 3px, transparent 4px)", opacity: 0.75 }} />
      </div>
    );
  }
  return (
    <div style={{ minHeight: cardH[card.h] || 190, borderRadius: 28, overflow: "hidden", background: "#fff", boxShadow: "0 10px 18px rgba(36,22,29,0.06)" }}>
      <Image src={card.src} alt="" fill={false} width={400} height={parseInt(cardH[card.h]) || 190} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

function HeroSection({ dict, lang }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState("");
  const router = useRef(null);

  const CATS = [
    { icon: "🎈", name: "Decor & balloons", desc: "Balloon styling, themed backdrops, welcome zones, garlands and custom setups." },
    { icon: "🎂", name: "Cakes & desserts",  desc: "Birthday cakes, wedding cakes, dessert tables, cupcakes and cookies." },
    { icon: "📸", name: "Photo & video",      desc: "Photographers, videographers, reels creators and wedding storytelling." },
    { icon: "🎁", name: "Event services",     desc: "Gifts, flowers, rentals, entertainment, hosts and celebration extras." },
  ];

  return (
    <section style={{ paddingTop: 28, background: "#f6f3f6" }}>
      <style>{`
        @keyframes mosaic-down { from { transform: translateY(-28%); } to { transform: translateY(0%); } }
        @keyframes mosaic-up   { from { transform: translateY(0%);  } to { transform: translateY(-28%); } }
        .mosaic-track-down { animation: mosaic-down 22s linear infinite; }
        .mosaic-track-up   { animation: mosaic-up   22s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mosaic-track-down, .mosaic-track-up { animation: none !important; }
        }
      `}</style>

      {/* ── Hero shell ── */}
      <div className="mx-auto" style={{ maxWidth: 1460, display: "grid", gridTemplateColumns: "1.04fr 1fr", minHeight: 860, borderRadius: "0 0 34px 34px", overflow: "hidden" }}>

        {/* LEFT — pink gradient */}
        <div style={{ position: "relative", padding: "74px 64px 56px", background: "linear-gradient(135deg, #ff73b6 0%, #ec3b90 55%, #d92a7d 100%)", color: "#fff", overflow: "hidden", isolation: "isolate", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* burst shapes */}
          {[
            { w: 280, h: 260, l: -20, t: 0,   r: "rotate(-18deg)" },
            { w: 240, h: 300, r: -10, t: 12,  r2: "rotate(28deg)"  },
            { w: 360, h: 200, l: -40, b: 70,  r2: "rotate(-74deg)" },
            { w: 260, h: 220, r2: -10, b: 36, r3: "rotate(98deg)"  },
          ].map((b, i) => (
            <span key={i} style={{ position: "absolute", background: "rgba(255,255,255,.12)", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", transformOrigin: "center bottom", width: b.w, height: b.h, left: b.l, right: b.r, top: b.t, bottom: b.b, transform: b.r || b.r2 || b.r3, pointerEvents: "none" }} />
          ))}

          {/* Copy */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: 580 }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ margin: "0 0 20px", fontSize: "clamp(3.2rem, 5.5vw, 5.8rem)", lineHeight: 0.92, letterSpacing: "-0.07em", fontWeight: 900 }}
            >
              {dict.hero.title1} {dict.hero.titleAccent} {dict.hero.title2}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ margin: "0 0 36px", fontSize: "1.12rem", lineHeight: 1.7, color: "rgba(255,255,255,.88)", maxWidth: "30ch" }}
            >
              {dict.hero.subtitle}
            </motion.p>
          </div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ position: "relative", zIndex: 4, maxWidth: 640 }}
          >
            <div
              onClick={() => setSearchOpen(true)}
              style={{ width: "100%", minHeight: 82, borderRadius: 22, background: "rgba(255,255,255,.98)", border: "1px solid rgba(255,255,255,.55)", display: "flex", alignItems: "center", gap: 14, padding: "0 24px", color: "#958896", fontSize: "1.1rem", boxShadow: "0 16px 28px rgba(49,13,29,0.12)", cursor: "text" }}
            >
              <Search size={22} style={{ color: "#b1458f", flexShrink: 0 }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder={dict.hero.subtitle ? "Find event services, vendors, or categories…" : "Search…"}
                style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "1rem", color: "#38152a", fontFamily: "inherit" }}
              />
            </div>

            {/* Dropdown panel */}
            <AnimatePresence>
              {searchOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 3 }} onClick={() => setSearchOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "absolute", left: 0, top: "calc(100% + 8px)", width: "100%", background: "rgba(255,255,255,.98)", border: "1px solid rgba(236,215,227,.95)", borderRadius: 24, padding: "24px 28px 20px", boxShadow: "0 30px 55px rgba(46,14,29,.16)", zIndex: 50, color: "#38152a" }}
                  >
                    <p style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.05em", marginBottom: 18, color: "#5a136f" }}>Browse categories</p>
                    <div style={{ display: "grid", gap: 14 }}>
                      {CATS.map((cat, i) => (
                        <Link key={i} href={`/${lang}/products?search=${encodeURIComponent(cat.name)}`} onClick={() => setSearchOpen(false)} className="no-underline" style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 16, alignItems: "center", borderRadius: 18, padding: "2px 0", transition: "transform .2s", cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = ""}
                        >
                          <div style={{ minHeight: 96, borderRadius: 18, background: "#f7eef8", display: "grid", placeItems: "center", fontSize: "1.9rem" }}>{cat.icon}</div>
                          <div>
                            <p style={{ margin: "0 0 5px", fontSize: "1.15rem", fontWeight: 700, color: "#5a136f", letterSpacing: "-0.03em" }}>{cat.name}</p>
                            <p style={{ margin: 0, color: "#7d7480", lineHeight: 1.45, fontSize: "0.92rem" }}>{cat.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{ position: "relative", zIndex: 2, display: "flex", gap: 32, marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.22)" }}
          >
            {[
              { n: "15K+", l: dict.hero.stat1Label },
              { n: "850+", l: dict.hero.stat2Label },
              { n: "4.9/5", l: dict.hero.stat3Label },
            ].map((s, i) => (
              <div key={i}>
                <p style={{ margin: 0, fontWeight: 900, fontSize: "1.5rem", color: "#fff", letterSpacing: "-0.04em" }}>{s.n}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — animated image mosaic */}
        <div style={{ background: "#dcecf7", overflow: "hidden", padding: "28px 30px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, height: "100%" }}>
            {[
              { cards: COL1, dir: "down" },
              { cards: COL2, dir: "up"   },
              { cards: COL3, dir: "down" },
            ].map(({ cards, dir }, ci) => (
              <div key={ci} style={{ position: "relative", overflow: "hidden", borderRadius: 24 }}>
                <div className={`mosaic-track-${dir}`} style={{ display: "grid", gap: 22, willChange: "transform" }}>
                  {[...cards, ...cards].map((card, i) => <MosaicCard key={i} card={card} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   DARK STATEMENT — cinematic manifesto block
════════════════════════════════════════════ */
function StatementSection({ dict }) {
  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111116 50%, #0d0a0f 100%)" }}
    >
      {/* Subtle brand glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(225,29,92,0.08) 0%, transparent 70%)" }}
      />

      <div className="max-w-container mx-auto px-6 md:px-8 relative z-10">
        <ScrollReveal className="text-center max-w-[820px] mx-auto">
          <p className="text-brand-400 text-xs font-semibold uppercase tracking-[0.2em] mb-6">
            {dict.about?.sectionLabel || "The Platform"}
          </p>
          <h2
            className="font-black text-white leading-tight mb-8 tracking-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 62px)" }}
          >
            Armenia's first{" "}
            <span style={{
              background: "linear-gradient(90deg, #fda4c4, #e11d5c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}>
              event marketplace
            </span>{" "}
            — every vendor, every detail, one platform.
          </h2>
          <p className="text-white/40 text-lg leading-relaxed max-w-[560px] mx-auto font-light">
            {dict.about?.subtitle || "From wedding cakes to floral arrangements, from catering to DJ services — everything you need to create unforgettable moments."}
          </p>
        </ScrollReveal>

        {/* 4 pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-20 border border-white/5 rounded-2xl overflow-hidden">
          {[
            { icon: Search,   label: "Discover",  desc: "Browse verified vendors across every category" },
            { icon: Shield,   label: "Trust",      desc: "Every vendor vetted and quality-reviewed" },
            { icon: Zap,      label: "Book Fast",  desc: "Direct contact and instant quote requests" },
            { icon: Award,    label: "Celebrate",  desc: "Your perfect event, exactly as imagined" },
          ].map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ backgroundColor: "rgba(225,29,92,0.06)" }}
              className="p-8 text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                <Icon size={18} className="text-brand-400" />
              </div>
              <p className="text-white font-bold text-base mb-2">{label}</p>
              <p className="text-white/30 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TRUST BAR
════════════════════════════════════════════ */
function TrustBar({ dict }) {
  return (
    <ScrollReveal variant="fadeIn">
      <div className="bg-white border-y border-surface-100">
        <div className="max-w-container mx-auto px-6 md:px-8 py-4">
          <StaggerContainer className="flex items-center justify-center gap-8 flex-wrap" staggerDelay={0.08}>
            {[
              { icon: Shield, text: dict.trust.verified },
              { icon: Truck,  text: dict.trust.delivery },
              { icon: Star,   text: dict.trust.rating },
              { icon: Users,  text: dict.trust.events },
            ].map(({ icon: Icon, text }, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="flex items-center gap-2 text-surface-500 text-sm"
                  whileHover={{ color: "#e11d5c", scale: 1.04 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon size={14} className="text-brand-400" />
                  <span className="font-medium">{text}</span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ════════════════════════════════════════════
   CATEGORIES CAROUSEL
════════════════════════════════════════════ */
function CategoryPortraitCard({ cat, index, lang }) {
  const grad = PORTRAIT_GRADIENTS[index % PORTRAIT_GRADIENTS.length];
  const bgStyle = cat.color
    ? { background: `linear-gradient(160deg, ${cat.color}dd, ${cat.color}88)` }
    : { background: `linear-gradient(160deg, ${grad[0]}, ${grad[1]})` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="flex-shrink-0"
    >
      <Link href={`/${lang}/category/${cat.slug}`} className="no-underline block">
        <motion.div
          whileHover={{ scale: 1.06, y: -7, boxShadow: "0 24px 48px -10px rgba(0,0,0,0.28)" }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="relative w-[152px] h-[220px] rounded-2xl overflow-hidden cursor-pointer select-none"
          style={bgStyle}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 60%, transparent 100%)" }}
          />
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-8">
            <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center">
              {(() => {
                const Icon = (cat.iconName && catIcons[cat.iconName]) || slugIcon(cat.slug);
                return <Icon size={26} className="text-white" strokeWidth={1.5} />;
              })()}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-4">
            <div className="rounded-xl px-3 py-2.5 text-center"
              style={{ background: "rgba(0,0,0,0.30)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <span className="text-sm font-bold text-white tracking-wide">{cat.name}</span>
              {cat.count > 0 && <p className="text-[10px] text-white/70 mt-0.5">{cat.count} items</p>}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function CategoriesCarousel({ categories, lang, dict }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => { el.removeEventListener("scroll", checkScroll); window.removeEventListener("resize", checkScroll); };
  }, [checkScroll, categories]);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="py-24 overflow-hidden" style={{ background: "linear-gradient(160deg, #fdf2f8 0%, #f0f4ff 50%, #fdf2f8 100%)" }}>
      <div className="max-w-container mx-auto px-6 md:px-8">
        <ScrollReveal className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.15em] mb-3">{dict.categories.sectionLabel}</p>
            <h2 className="font-black text-surface-900 tracking-tight" style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}>
              {dict.categories.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {[{ dir: -1, can: canScrollLeft }, { dir: 1, can: canScrollRight }].map(({ dir, can }, i) => (
                <motion.button
                  key={i}
                  onClick={() => scroll(dir)}
                  disabled={!can}
                  whileHover={can ? { scale: 1.08 } : {}}
                  whileTap={can ? { scale: 0.92 } : {}}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer"
                  style={{
                    background: can ? "rgba(225,29,92,0.08)" : "rgba(0,0,0,0.04)",
                    borderColor: can ? "rgba(225,29,92,0.25)" : "rgba(0,0,0,0.08)",
                    color: can ? "#e11d5c" : "#ccc",
                  }}
                >
                  {i === 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </motion.button>
              ))}
            </div>
            <Link href={`/${lang}/products`} className="text-sm font-semibold text-brand-600 no-underline items-center gap-1 hover:gap-2 transition-all hidden md:flex">
              {dict.categories.viewAll} <ChevronRight size={15} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none transition-opacity duration-300"
            style={{ background: "linear-gradient(to right, #fdf2f8, transparent)", opacity: canScrollLeft ? 1 : 0 }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none transition-opacity duration-300"
            style={{ background: "linear-gradient(to left, #f0f4ff, transparent)", opacity: canScrollRight ? 1 : 0 }}
          />
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categories.length > 0 ? categories.map((cat, i) => (
              <CategoryPortraitCard key={cat.slug || i} cat={cat} index={i} lang={lang} />
            )) : (
              <div className="w-full py-16 text-center text-surface-400 text-sm">
                {dict.categories.comingSoon || "Categories coming soon"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FEATURED PRODUCTS — tabbed
════════════════════════════════════════════ */
function FeaturedProducts({ dict, lang, apiProducts }) {
  const [activeTab, setActiveTab] = useState("BIRTHDAY");
  const tabProducts = {
    BIRTHDAY: apiProducts.slice(0, 5),
    WEDDING:  apiProducts.slice(3, 8),
    PARTY:    [...apiProducts.slice(5), ...apiProducts.slice(0, 2)].slice(0, 5),
  };
  const tabLabels = {
    BIRTHDAY: dict.trending.tabBirthday,
    WEDDING:  dict.trending.tabWedding,
    PARTY:    dict.trending.tabParty,
  };

  return (
    <section className="bg-white py-24 border-y border-surface-100">
      <div className="max-w-container mx-auto px-6 md:px-8">
        <ScrollReveal className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.15em] mb-3">{dict.trending.sectionLabel}</p>
            <h2 className="font-black text-surface-900 tracking-tight" style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}>
              {dict.trending.title}
            </h2>
          </div>
          <div className="flex bg-surface-50 rounded-xl border border-surface-200 p-1">
            {["BIRTHDAY", "WEDDING", "PARTY"].map(tab => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileTap={{ scale: 0.95 }}
                className={`relative px-5 py-2 rounded-xl text-xs font-bold cursor-pointer border-none transition-colors z-10 ${
                  activeTab === tab ? "text-white" : "bg-transparent text-surface-500 hover:text-surface-800"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-brand-600 rounded-xl"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                {tabLabels[tab]}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="flex gap-4 w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
            >
              {tabProducts[activeTab].length > 0 ? tabProducts[activeTab].map((p, i) => (
                <motion.div
                  key={i}
                  className="min-w-[220px] flex-shrink-0"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <ProductCard product={p} lang={lang} />
                </motion.div>
              )) : (
                <div className="w-full py-16 text-center text-surface-400 text-sm">
                  {dict.trending.noProducts || "Products coming soon"}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <ScrollReveal className="text-center mt-10" variant="fadeIn">
          <Link href={`/${lang}/products`}>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: "#e11d5c", color: "#e11d5c" }}
              whileTap={{ scale: 0.97 }}
              className="border border-surface-200 rounded-xl px-7 py-3.5 text-sm font-bold text-surface-700 transition-all bg-transparent cursor-pointer inline-flex items-center gap-2"
            >
              {dict.trending.viewAll} <ArrowRight size={15} />
            </motion.button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   DARK STATS — cinematic numbers block
════════════════════════════════════════════ */
function StatsSection({ dict }) {
  const stats = [
    { num: "15",   suffix: "K+", label: "Happy customers",        sub: "events planned across Armenia" },
    { num: "850",  suffix: "+",  label: "Verified vendors",       sub: "curated and quality-tested" },
    { num: "2500", suffix: "+",  label: "Products & services",    sub: "in every event category" },
    { num: "4.9",  suffix: "/5", label: "Average rating",         sub: "from thousands of reviews" },
  ];

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(135deg, #0f0a10 0%, #120d14 50%, #0a0a0f 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(225,29,92,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,92,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(225,29,92,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-container mx-auto px-6 md:px-8 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <p className="text-brand-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">By the numbers</p>
          <h2 className="font-black text-white tracking-tight" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
            Built on trust. Proven by results.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
          {stats.map(({ num, suffix, label, sub }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="text-center px-8 py-10"
              style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
            >
              <p
                className="font-black text-white leading-none mb-2"
                style={{ fontSize: "clamp(40px, 5vw, 72px)",
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                <CountUp end={num} suffix={suffix} />
              </p>
              <p className="text-brand-400 font-semibold text-sm mb-1">{label}</p>
              <p className="text-white/25 text-xs">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   WHY CHOOSE US — benefits, alternating
════════════════════════════════════════════ */
function BenefitsSection({ dict }) {
  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="max-w-container mx-auto px-6 md:px-8">
        <ScrollReveal className="text-center mb-20">
          <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.15em] mb-3">{dict.about.sectionLabel}</p>
          <h2 className="font-black text-surface-900 tracking-tight" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
            {dict.about.title}
          </h2>
        </ScrollReveal>

        {/* Text left, image grid right */}
        <div className="flex items-center gap-16 flex-wrap mb-24">
          <ScrollReveal variant="slideRight" className="flex-1 min-w-[300px]">
            <p className="text-surface-500 text-lg leading-relaxed mb-10 max-w-[440px]">
              {dict.about.subtitle}
            </p>
            <div className="flex gap-10 mb-10">
              {[
                { num: "2500", suffix: "+", label: dict.about.stat1Label, icon: Package },
                { num: "850",  suffix: "+", label: dict.about.stat2Label, icon: Users },
                { num: "15",   suffix: "K+",label: dict.about.stat3Label, icon: Smile },
              ].map(({ num, suffix, label, icon: Icon }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <p className="text-3xl font-black text-brand-600 leading-none mb-2">
                    <CountUp end={num} suffix={suffix} />
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className="text-surface-400" />
                    <p className="text-xs text-surface-500 font-medium">{label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <StaggerContainer staggerDelay={0.1}>
              {[dict.about.feature1, dict.about.feature2, dict.about.feature3].map((f, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="flex items-center gap-3 mb-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} className="text-brand-500" />
                    </div>
                    <span className="text-sm text-surface-600 font-medium">{f}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ScrollReveal>

          <ScrollReveal variant="slideLeft" className="flex-1 min-w-[300px] max-w-[480px]">
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "/images/wedding-ceremony.jpg", alt: "Wedding",  h: "h-[220px]", mt: "" },
                { src: "/images/cupcakes.jpg",         alt: "Cupcakes", h: "h-[220px]", mt: "mt-8" },
                { src: "/images/flowers-roses.jpg",    alt: "Flowers",  h: "h-[156px]", mt: "-mt-4" },
                { src: "/images/balloons-blue.jpg",    alt: "Balloons", h: "h-[156px]", mt: "mt-4" },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className={`rounded-2xl overflow-hidden ${img.h} ${img.mt}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                >
                  <Image src={img.src} alt={img.alt} width={240} height={220} className="object-cover w-full h-full" />
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   HOW IT WORKS — numbered steps
════════════════════════════════════════════ */
function HowItWorksSection({ lang }) {
  const steps = [
    {
      num: "01",
      title: "Browse & Discover",
      desc: "Explore hundreds of verified vendors across every event category — from cakes and flowers to DJ services and full catering.",
      icon: Search,
    },
    {
      num: "02",
      title: "Compare & Choose",
      desc: "Read real reviews, compare portfolios and pricing, and find the perfect match for your event size and style.",
      icon: Star,
    },
    {
      num: "03",
      title: "Contact & Book",
      desc: "Reach vendors directly through the platform. Request quotes, confirm details, and lock in your booking with confidence.",
      icon: MessageCircle,
    },
    {
      num: "04",
      title: "Celebrate",
      desc: "Relax and enjoy your event knowing every detail is handled by trusted professionals who care about your celebration.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-28 overflow-hidden" style={{ background: "linear-gradient(160deg, #fdf2f8 0%, #f8f4ff 100%)" }}>
      <div className="max-w-container mx-auto px-6 md:px-8">
        <ScrollReveal className="text-center mb-20">
          <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.15em] mb-3">How it works</p>
          <h2 className="font-black text-surface-900 tracking-tight" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
            Your event, in four steps
          </h2>
          <p className="text-surface-400 mt-4 text-lg max-w-[440px] mx-auto">Simple, transparent, and designed around you.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ num, title, desc, icon: Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              whileHover={{ y: -6, boxShadow: "0 20px 48px -12px rgba(225,29,92,0.14)" }}
              className="bg-white rounded-2xl p-8 border border-surface-100 relative overflow-hidden"
            >
              {/* Big number background */}
              <div
                className="absolute top-4 right-4 font-black leading-none pointer-events-none select-none"
                style={{ fontSize: "80px", color: "rgba(225,29,92,0.04)" }}
              >
                {num}
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-6">
                <Icon size={20} className="text-brand-600" />
              </div>
              <p className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-2">{num}</p>
              <h3 className="text-surface-900 font-bold text-lg mb-3">{title}</h3>
              <p className="text-surface-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <ScrollReveal className="text-center mt-14" variant="fadeIn">
          <Link href={`/${lang}/products`}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 12px 32px -4px rgba(225,29,92,0.45)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-600 text-white border-none rounded-xl px-8 py-4 text-sm font-bold cursor-pointer inline-flex items-center gap-2.5"
            >
              Start Exploring <ArrowRight size={16} />
            </motion.button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS
════════════════════════════════════════════ */
function TestimonialCard({ t }) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 40, scale: 0.94 },
        visible: { opacity: 1, y: 0,  scale: 1 },
      }}
      whileHover={{ y: -8, boxShadow: "0 24px 48px -12px rgba(225,29,92,0.14), 0 4px 12px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-8 max-w-[340px] border border-surface-100"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-warm-400 text-warm-400" />)}
      </div>
      <Quote size={20} className="text-brand-200 mb-3" />
      <p className="text-sm text-surface-500 leading-relaxed mb-6 italic">{t.text}</p>
      <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
        <motion.div
          className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold text-white"
          whileHover={{ scale: 1.12 }}
        >
          {t.name.charAt(0)}
        </motion.div>
        <div>
          <p className="font-semibold text-sm text-surface-800">{t.name}</p>
          <p className="text-xs text-surface-400">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   AI PLANNER BANNER
════════════════════════════════════════════ */
function PlannerBanner({ dict, lang }) {
  return (
    <section className="max-w-container mx-auto px-6 md:px-8 pb-28">
      <ScrollReveal variant="scaleUp">
        <motion.div
          className="rounded-3xl overflow-hidden relative min-h-[300px] flex items-center bg-brand-600"
          whileHover={{ scale: 1.006 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Orb className="w-[500px] h-[500px] bg-white/8 -bottom-24 -right-24" delay={0.5} />
            <Orb className="w-[300px] h-[300px] bg-brand-400/25 top-0 left-1/3" delay={1.5} />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden md:block">
            <Image src="/images/wedding-ceremony.jpg" alt="" fill className="object-cover opacity-12" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-600" />
          </div>
          <div className="absolute inset-0 opacity-8"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="relative z-10 p-10 md:p-16 max-w-[560px]">
            <motion.div className="flex items-center gap-2 mb-5" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-white/70 text-xs font-bold uppercase tracking-[0.15em]">{dict.aiPlanner.badge}</span>
            </motion.div>
            <h2 className="font-black text-white leading-tight mb-4 tracking-tight" style={{ fontSize: "clamp(26px, 3.2vw, 46px)" }}>
              {dict.aiPlanner.title}<br />
              <span className="italic opacity-80">{dict.aiPlanner.titleAccent}</span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-8 max-w-[380px]">
              {dict.aiPlanner.subtitle}
            </p>
            <div className="flex gap-3 flex-wrap">
              <MagneticButton>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white text-brand-600 border-none rounded-xl px-7 py-3.5 text-sm font-black cursor-pointer flex items-center gap-2"
                >
                  <Play size={13} fill="currentColor" /> {dict.aiPlanner.ctaPrimary}
                </motion.button>
              </MagneticButton>
              <Link href={`/${lang}/products`}>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 text-white border border-white/20 rounded-xl px-7 py-3.5 text-sm font-semibold cursor-pointer flex items-center gap-2"
                >
                  {dict.aiPlanner.ctaSecondary} <ArrowRight size={14} />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </ScrollReveal>
    </section>
  );
}

/* ════════════════════════════════════════════
   DESTINATIONS
════════════════════════════════════════════ */
function DestinationsSection({ dict, lang }) {
  return (
    <section className="py-28 overflow-hidden bg-white border-t border-surface-100">
      <div className="max-w-container mx-auto px-6 md:px-8 flex items-center gap-16 flex-wrap-reverse">
        <ScrollReveal variant="slideRight" className="flex-1 min-w-[300px] max-w-[500px]">
          <div className="relative">
            <motion.div className="rounded-2xl overflow-hidden h-[380px]" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
              <Image src="/images/wedding-beach.jpg" alt="Destination Wedding" fill className="object-cover" />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -right-4 glass rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring" }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center">
                  <Heart size={16} className="text-accent-500 fill-accent-200" />
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-800">{dict.destinations.venueBadgeCount}</p>
                  <p className="text-xs text-surface-400">{dict.destinations.venueBadgeLabel}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideLeft" className="flex-1 min-w-[300px]">
          <p className="text-accent-500 text-xs font-bold uppercase tracking-[0.15em] mb-4">{dict.destinations.sectionLabel}</p>
          <h2 className="font-black text-surface-900 leading-tight mb-5 tracking-tight" style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
            {dict.destinations.title}{" "}
            <span className="italic text-accent-600">{dict.destinations.titleAccent}</span>{" "}
            {dict.destinations.title2}
          </h2>
          <p className="text-surface-400 text-lg leading-relaxed mb-8 max-w-[400px]">
            {dict.destinations.subtitle}
          </p>
          <div className="flex gap-4 flex-wrap">
            <MagneticButton>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 10px 28px -4px rgba(249,115,22,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-accent bg-accent-500 text-white border-none rounded-xl px-6 py-3.5 text-sm font-bold cursor-pointer flex items-center gap-2"
              >
                <MapPin size={15} /> {dict.destinations.ctaPrimary}
              </motion.button>
            </MagneticButton>
            <Link href={`/${lang}/products`}>
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "#e11d5c", color: "#e11d5c" }}
                whileTap={{ scale: 0.97 }}
                className="border border-surface-200 rounded-xl px-6 py-3.5 text-sm font-semibold text-surface-700 cursor-pointer flex items-center gap-2 bg-transparent"
              >
                {dict.destinations.ctaSecondary} <ChevronRight size={15} />
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS SECTION
════════════════════════════════════════════ */
function TestimonialsSection({ dict }) {
  return (
    <section
      className="py-28 border-y border-surface-100"
      style={{ background: "linear-gradient(160deg, #fdf2f8 0%, #f0f4ff 100%)" }}
    >
      <div className="max-w-container mx-auto px-6 md:px-8">
        <ScrollReveal className="text-center mb-16">
          <p className="text-brand-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">{dict.testimonials.sectionLabel}</p>
          <h2 className="font-black text-surface-900 tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 50px)" }}>
            {dict.testimonials.title}
          </h2>
          <p className="text-surface-400 text-lg mt-4">{dict.testimonials.subtitle}</p>
        </ScrollReveal>
        <StaggerContainer className="flex gap-6 justify-center flex-wrap" staggerDelay={0.1}>
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i}>
              <TestimonialCard t={t} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PARTNER FORM
════════════════════════════════════════════ */
function PartnerSection({ dict }) {
  return (
    <section className="bg-white py-28">
      <div className="max-w-[760px] mx-auto px-6 md:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-brand-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">{dict.partner.sectionLabel}</p>
          <h2 className="font-black text-surface-900 tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 50px)" }}>
            {dict.partner.title}
          </h2>
          <p className="text-surface-400 text-lg mt-4 max-w-[480px] mx-auto">{dict.partner.subtitle}</p>
        </ScrollReveal>

        <ScrollReveal variant="scaleUp" delay={0.1}>
          <motion.div
            className="bg-white rounded-3xl p-10 md:p-12 border border-surface-100"
            style={{ boxShadow: "0 4px 40px rgba(225,29,92,0.06), 0 1px 3px rgba(0,0,0,0.04)" }}
            whileHover={{ boxShadow: "0 12px 60px rgba(225,29,92,0.10), 0 4px 12px rgba(0,0,0,0.05)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[dict.partner.fieldName, dict.partner.fieldBusiness, dict.partner.fieldEmail, dict.partner.fieldPhone].map((ph, i) => (
                <motion.input
                  key={i}
                  placeholder={ph}
                  whileFocus={{ scale: 1.01, borderColor: "#e11d5c" }}
                  className="px-4 py-3.5 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-400 transition-all outline-none font-medium"
                />
              ))}
            </div>
            <select className="w-full px-4 py-3.5 border border-surface-200 rounded-xl text-sm bg-surface-50 text-surface-500 mb-4 outline-none cursor-pointer font-medium">
              <option value="">{dict.partner.categoryPlaceholder}</option>
              {dict.partner.categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <textarea
              placeholder={dict.partner.messagePlaceholder}
              className="w-full px-4 py-3.5 border border-surface-200 rounded-xl text-sm bg-surface-50 min-h-[110px] resize-none placeholder:text-surface-400 mb-6 outline-none font-medium"
            />
            <MagneticButton>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 32px -4px rgba(225,29,92,0.40)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary bg-brand-600 text-white border-none rounded-xl px-7 py-3.5 text-sm font-bold cursor-pointer flex items-center gap-2"
              >
                <Send size={15} /> {dict.partner.submitButton}
              </motion.button>
            </MagneticButton>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════════════ */
export default function HomePageClient({ dict, lang }) {
  const [apiProducts,   setApiProducts]   = useState([]);
  const [apiCategories, setApiCategories] = useState([]);

  useEffect(() => {
    productsAPI.list({ locale: lang, limit: 10 })
      .then(res => {
        setApiProducts((res?.data || []).map(p => ({
          id: p.id, name: p.name, slug: p.slug || "",
          price: parseFloat(p.price) || 0,
          originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
          rating: parseFloat(p.rating) || 0, reviews: p.review_count || 0,
          vendor: p.vendor_name || "", vendor_slug: p.vendor_slug || "",
          image: p.thumbnail_url || p.images?.[0]?.url || null,
          tags: p.tags || [], gradient: "from-brand-50 to-brand-100",
        })));
      }).catch(() => {});

    categoriesAPI.list(lang)
      .then(res => {
        const gradients = [
          "from-pink-400 via-rose-400 to-red-400",
          "from-orange-400 via-amber-400 to-yellow-300",
          "from-rose-400 via-pink-400 to-fuchsia-400",
          "from-blue-400 via-cyan-400 to-sky-300",
          "from-violet-500 via-purple-400 to-indigo-400",
          "from-green-400 via-emerald-400 to-teal-400",
        ];
        setApiCategories((res?.data || []).map((c, i) => ({
          name: c.name, slug: c.slug,
          iconName: catIcons[c.emoji] ? c.emoji : null,
          color: c.color || null,
          gradient: gradients[i % gradients.length],
          count: c.product_count || 0,
        })));
      }).catch(() => {});
  }, [lang]);

  return (
    <div className="bg-white">
      {/* 1. Hero — cinematic, full-screen */}
      <HeroSection dict={dict} lang={lang} />

      {/* 2. Trust bar */}
      <TrustBar dict={dict} />

      {/* 4. Categories carousel */}
      <CategoriesCarousel categories={apiCategories} lang={lang} dict={dict} />

      {/* ── Event Types Showcase ── */}
      <section className="py-24 bg-white">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.15em] mb-3">Plan Any Occasion</p>
            <h2 className="font-black text-surface-900 mb-4" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
              What are you<br className="hidden md:block" /> celebrating?
            </h2>
            <p className="text-surface-500 text-base max-w-[480px] mx-auto">
              Find trusted vendors for every event type — from intimate birthdays to grand weddings.
            </p>
          </ScrollReveal>

          {/* Bento grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
            {[
              {
                title: "Weddings",
                desc: "Make your big day unforgettable",
                icon: Heart,
                gradient: "from-pink-500 via-rose-500 to-red-400",
                span: "col-span-2 row-span-2",
                href: `/${lang}/events/wedding`,
                size: 48,
              },
              {
                title: "Birthdays",
                desc: "Celebrate every year in style",
                icon: PartyPopper,
                gradient: "from-blue-400 via-cyan-500 to-sky-400",
                span: "col-span-1 row-span-1",
                href: `/${lang}/events/birthday`,
                size: 28,
              },
              {
                title: "Corporate",
                desc: "Impress clients & teams",
                icon: Users,
                gradient: "from-slate-500 via-gray-600 to-zinc-500",
                span: "col-span-1 row-span-1",
                href: `/${lang}/events/corporate`,
                size: 28,
              },
              {
                title: "Engagements",
                desc: "Say yes to forever",
                icon: Sparkles,
                gradient: "from-violet-500 via-purple-500 to-indigo-500",
                span: "col-span-1 row-span-2",
                href: `/${lang}/events/engagement`,
                size: 36,
              },
              {
                title: "Anniversaries",
                desc: "Honor every milestone",
                icon: Star,
                gradient: "from-orange-400 via-amber-500 to-yellow-400",
                span: "col-span-1 row-span-1",
                href: `/${lang}/events/anniversary`,
                size: 28,
              },
              {
                title: "Kids' Parties",
                desc: "Magical moments for little ones",
                icon: Gift,
                gradient: "from-green-400 via-emerald-500 to-teal-500",
                span: "col-span-1 row-span-1",
                href: `/${lang}/events/kids-party`,
                size: 28,
              },
            ].map(({ title, desc, icon: Icon, gradient, span, href, size }, i) => (
              <motion.div
                key={i}
                className={`${span} rounded-2xl overflow-hidden relative cursor-pointer group`}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ transitionProperty: "transform" }}
              >
                <Link href={href} className="absolute inset-0 no-underline">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                  {/* Dot pattern overlay */}
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                  />
                  {/* Gloss */}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)" }}
                  />
                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="w-fit rounded-2xl bg-white/20 backdrop-blur-sm p-2.5">
                      <Icon size={size} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1" style={{ fontSize: size > 30 ? "1.35rem" : "1rem" }}>
                        {title}
                      </h3>
                      <p className="text-white/80 text-sm">{desc}</p>
                    </div>
                  </div>
                  {/* Hover arrow */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured products */}
      <FeaturedProducts dict={dict} lang={lang} apiProducts={apiProducts} />

      {/* 6. Benefits / About — alternating layout */}
      <BenefitsSection dict={dict} />

      {/* 8. How it works */}
      <HowItWorksSection lang={lang} />

      {/* 9. Testimonials */}
      <TestimonialsSection dict={dict} />

      {/* 10. Destinations */}
      <DestinationsSection dict={dict} lang={lang} />

      {/* 11. AI Planner CTA banner */}
      <PlannerBanner dict={dict} lang={lang} />

      {/* 12. Stacked story sections */}
      <div style={{ position: "relative", marginTop: -40, paddingBottom: 80 }}>
        <style>{`
          .story-sticky { position: sticky; top: 90px; borderRadius: 32px; overflow: hidden; boxShadow: "0 18px 50px rgba(58,21,42,0.08)"; border: "1px solid rgba(236,215,227,0.9)"; }
        `}</style>

        {[
          {
            zIndex: 10, bg: "#f1e8f5", color: "#57138d", mt: 0,
            title: "Browse & compare",
            desc: "Discover unique event professionals in one place. Compare style, presentation, and fit — without jumping through dozens of pages.",
            img: "/images/flowers-roses.jpg",
            card: { title: "Compare by style", desc: "Luxury, cute, playful, pastel, minimal, kids, wedding, or custom themed setups." },
            cardPos: { right: 22, top: 22 },
            href: `/${lang}/products`,
            cta: "Browse vendors",
          },
          {
            zIndex: 20, bg: "#ead8f4", color: "#58128c", mt: 56,
            title: "Book securely",
            desc: "Send requests with confidence, receive replies faster, and feel guided during the whole booking process.",
            img: "/images/wedding-dance.jpg",
            card: { title: "Fast inquiry flow", desc: "Message vendors, request a quote, and keep the event planning flow simple and premium." },
            cardPos: { left: 22, bottom: 22 },
            href: `/${lang}/account`,
            cta: "Start planning",
          },
          {
            zIndex: 30, bg: "#ffeef7", color: "#8c1f5f", mt: 56,
            title: "Celebrate beautifully",
            desc: "Birthdays, weddings, baby showers, anniversaries, family gatherings — every happy occasion deserves a perfect setup.",
            img: "/images/wedding-ceremony.jpg",
            card: { title: "Made for meaningful moments", desc: "Weddings, birthdays, anniversaries, kids parties, corporate events and more." },
            cardPos: { right: 22, bottom: 22 },
            href: `/${lang}/events/wedding`,
            cta: "Explore events",
          },
        ].map((s, i) => (
          <div key={i} style={{ position: "sticky", top: 90, zIndex: s.zIndex, marginTop: s.mt, marginLeft: "auto", marginRight: "auto", width: "min(1460px, calc(100% - 48px))", borderRadius: 32, overflow: "hidden", boxShadow: "0 18px 50px rgba(58,21,42,0.08)", border: "1px solid rgba(236,215,227,0.9)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "72vh", background: s.bg }}>
              {/* Copy */}
              <div style={{ padding: "72px", background: s.bg, color: s.color, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,.22), transparent 22%), radial-gradient(circle at 86% 24%, rgba(255,255,255,.16), transparent 16%)", pointerEvents: "none" }} />
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <h2 style={{ margin: "0 0 18px", fontSize: "clamp(2.4rem, 4vw, 4rem)", lineHeight: 0.95, letterSpacing: "-0.07em", fontWeight: 900 }}>{s.title}</h2>
                  <p style={{ margin: "0 0 32px", lineHeight: 1.7, fontSize: "1.1rem", maxWidth: "28ch", color: s.color, opacity: 0.8 }}>{s.desc}</p>
                  <Link href={s.href} className="no-underline" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: s.color, color: "#fff", borderRadius: 999, padding: "14px 26px", fontWeight: 800, fontSize: "0.95rem", transition: "transform .2s, opacity .2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    {s.cta} <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </div>
              {/* Visual */}
              <div style={{ padding: 34, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", minHeight: 480, borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,.6)", position: "relative", boxShadow: "0 14px 25px rgba(20,15,19,.06)" }}>
                  <Image src={s.img} alt={s.title} fill className="object-cover" />
                  {/* Floating card */}
                  <div style={{ position: "absolute", ...s.cardPos, background: "rgba(255,255,255,.94)", borderRadius: 22, border: "1px solid rgba(236,215,227,.96)", boxShadow: "0 16px 30px rgba(44,18,31,.09)", padding: "18px 20px", maxWidth: 300, color: "#38152a" }}>
                    <p style={{ margin: "0 0 7px", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.03em" }}>{s.card.title}</p>
                    <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.88rem", color: "#7f6676" }}>{s.card.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Vendor CTA banner */}
        <div style={{ marginTop: 40, marginLeft: "auto", marginRight: "auto", width: "min(1460px, calc(100% - 48px))", borderRadius: 32, background: "linear-gradient(135deg, #ff63ad, #ea3b91 58%, #d8257a)", color: "#fff", padding: "48px 52px", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 28, alignItems: "center", boxShadow: "0 26px 55px rgba(216,37,122,.22)" }}>
          <div>
            <h3 style={{ margin: "0 0 14px", fontSize: "clamp(2rem, 3.5vw, 3.6rem)", lineHeight: 0.96, letterSpacing: "-0.06em", fontWeight: 900 }}>Bring your event business to Salooote</h3>
            <p style={{ margin: "0 0 22px", lineHeight: 1.75, color: "rgba(255,255,255,.88)", maxWidth: "52ch" }}>Showcase your work to thousands of people planning events across Armenia. Verified profile, direct bookings, zero commission to start.</p>
            <Link href={`/${lang}/apply`} className="no-underline" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#d8257a", borderRadius: 999, padding: "16px 28px", fontWeight: 800, fontSize: "1rem", transition: "transform .2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}
            >
              List your services <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ borderRadius: 26, overflow: "hidden", minHeight: 280 }}>
            <Image src="/images/vendor-woman.jpg" alt="Become a vendor" fill={false} width={600} height={320} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", minHeight: 280 }} />
          </div>
        </div>
      </div>

      {/* 12. Become a partner form */}
      <PartnerSection dict={dict} />
    </div>
  );
}
