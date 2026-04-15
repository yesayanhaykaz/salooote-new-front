"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion, AnimatePresence, useScroll, useTransform,
  useSpring, useMotionValue,
} from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import MagneticButton from "@/components/MagneticButton";
import { CATEGORIES, SAMPLE_PRODUCTS, TESTIMONIALS } from "@/lib/data";
import {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music,
  ArrowRight, Star, Quote, MapPin, Calendar, Sparkles,
  MessageCircle, ChevronRight, Heart, Send, Play,
  CheckCircle2, Users, Package, Smile, Shield, Truck,
} from "lucide-react";

const catIcons  = { Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music };
const catImages = {
  Cakes:         "/images/cupcakes.jpg",
  Catering:      "/images/catering-setup.jpg",
  Flowers:       "/images/flowers-roses.jpg",
  Balloons:      "/images/balloons-blue.jpg",
  "Party Props": "/images/party-balloons.jpg",
  "DJ & Music":  "/images/hero-dj.jpg",
};

/* ── Floating orb ── */
function Orb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ y: [0, -30, 0], scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ── Hero scroll parallax ── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY   = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity= useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden flex items-center" style={{ minHeight: "95svh" }}>
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <Image src="/images/hero-dj.jpg" alt="Dream Event" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/65 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
      </motion.div>

      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Orb className="w-[500px] h-[500px] bg-brand-600/20 -top-32 -left-32" delay={0} />
        <Orb className="w-[400px] h-[400px] bg-brand-400/15 top-1/2 right-0" delay={2} />
      </div>

      <motion.div
        className="relative z-10 max-w-container mx-auto px-5 md:px-8 py-20 md:py-24 w-full"
        style={{ y: textY, opacity }}
      >
        <div className="max-w-full md:max-w-[580px]">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-[11px] font-semibold text-white/80 uppercase tracking-widest backdrop-blur-sm">
              <motion.span
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles size={11} className="text-brand-300" />
              </motion.span>
              Plan. Book. Celebrate.
            </span>
          </motion.div>

          <motion.h1
            className="font-bold text-white leading-tight mb-5"
            style={{ fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.08 }}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Plan your dream<br />
            <motion.span
              className="text-brand-300 italic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              events,
            </motion.span>{" "}easily.
          </motion.h1>

          <motion.p
            className="text-white/60 leading-relaxed mb-8 font-light"
            style={{ fontSize: "clamp(15px, 1.8vw, 18px)", maxWidth: "420px" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Explore vendors, book services, and plan your event — all in one place.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <MagneticButton>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 12px 32px -4px rgba(225,29,92,0.5)" }}
                whileTap={{ scale: 0.96 }}
                className="btn-primary bg-brand-600 text-white border-none rounded-xl px-8 py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto"
              >
                <Calendar size={16} /> Plan an Event
              </motion.button>
            </MagneticButton>
            <Link href="/products" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.22)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/12 text-white border border-white/25 rounded-xl px-8 py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-sm w-full"
              >
                Browse Products <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center gap-6 md:gap-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
          >
            {[{ n: "15", suffix: "K+", l: "Events" }, { n: "850", suffix: "+", l: "Vendors" }, { n: "4.9", l: "★ Rating" }].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1, type: "spring" }}
              >
                <p className="text-white font-bold text-xl leading-none">
                  <CountUp end={s.n} suffix={s.suffix || ""} />
                  {s.l === "★ Rating" ? "★" : ""}
                </p>
                <p className="text-white/40 text-xs mt-1">{s.l === "★ Rating" ? "Rating" : s.l}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Chat widget */}
      <motion.div
        className="absolute bottom-8 right-10 glass rounded-2xl p-5 max-w-[240px] z-10 hidden lg:block"
        initial={{ opacity: 0, x: 30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9, type: "spring" }}
        whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          >
            <MessageCircle size={16} className="text-white" />
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-surface-800">Need help planning?</p>
            <p className="text-xs text-surface-400 mt-0.5">Reply in under 2 min</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#25D366] text-white border-none rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
        >
          <MessageCircle size={12} /> Chat on WhatsApp
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-white/30 text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          animate={{ borderColor: ["rgba(255,255,255,0.2)", "rgba(225,29,92,0.5)", "rgba(255,255,255,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-white/60 rounded-full"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Category card with tilt ── */
function CategoryCard({ cat, index }) {
  const Icon = catIcons[cat.icon] || Gift;
  const imgSrc = catImages[cat.name];
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      style={{ perspective: "700px" }}
      variants={{ hidden: { opacity: 0, y: 30, scale: 0.92 }, visible: { opacity: 1, y: 0, scale: 1 } }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href="/category" className="no-underline flex-shrink-0">
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.05, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="category-card group w-[130px] md:w-[152px] cursor-pointer"
        >
          <div className="h-[172px] md:h-[192px] rounded-2xl overflow-hidden relative border border-surface-200">
            {imgSrc
              ? <Image src={imgSrc} alt={cat.name} fill className="object-cover transition-transform duration-600 group-hover:scale-112" />
              : <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <motion.div
              className="absolute top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center"
              whileHover={{ backgroundColor: "rgba(225,29,92,1)", scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={16} className="text-brand-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
            </motion.div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="text-sm font-semibold text-white">{cat.name}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── Testimonial card ── */
function TestimonialCard({ t, index }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.94 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      whileHover={{ y: -8, boxShadow: "0 24px 48px -12px rgba(225,29,92,0.14), 0 4px 12px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white rounded-2xl p-8 max-w-[340px] border border-surface-200 group cursor-default"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, j) => (
          <motion.div key={j} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.05 * j }}>
            <Star size={13} className="fill-warm-400 text-warm-400" />
          </motion.div>
        ))}
      </div>
      <Quote size={20} className="text-brand-200 mb-3" />
      <p className="text-sm text-surface-500 leading-relaxed mb-6 italic">{t.text}</p>
      <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
        <motion.div
          className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold text-white"
          whileHover={{ scale: 1.12, backgroundColor: "#be1850" }}
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

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("BIRTHDAY");
  const tabProducts = {
    BIRTHDAY: SAMPLE_PRODUCTS.slice(0, 5),
    WEDDING:  SAMPLE_PRODUCTS.slice(3, 8),
    PARTY:    [...SAMPLE_PRODUCTS.slice(5), ...SAMPLE_PRODUCTS.slice(0, 2)].slice(0, 5),
  };

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Trust bar ── */}
      <ScrollReveal variant="fadeIn">
        <div className="bg-surface-50 border-y border-surface-200">
          <div className="max-w-container mx-auto px-6 md:px-8 py-4">
            <StaggerContainer className="flex items-center justify-center gap-8 flex-wrap" staggerDelay={0.08}>
              {[
                { icon: Shield, text: "Verified vendors" },
                { icon: Truck,  text: "Same-day delivery" },
                { icon: Star,   text: "4.9 avg rating" },
                { icon: Users,  text: "15,000+ events planned" },
              ].map(({ icon: Icon, text }, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="flex items-center gap-2 text-surface-500 text-sm"
                    whileHover={{ color: "#e11d5c", scale: 1.04 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Icon size={15} className="text-brand-500" />
                    <span>{text}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Categories ── */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-20">
        <ScrollReveal className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-2">Browse by Category</p>
            <h2 className="text-4xl font-bold text-surface-900">Everything you need</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-brand-600 no-underline items-center gap-1 hover:gap-2 transition-all hidden md:flex group">
            All categories
            <motion.span animate={{ x: 0 }} whileHover={{ x: 4 }}>
              <ChevronRight size={15} />
            </motion.span>
          </Link>
        </ScrollReveal>

        <StaggerContainer
          className="flex gap-3 md:gap-4 overflow-x-auto md:flex-wrap pb-2 hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0"
          staggerDelay={0.07}
          delayStart={0.1}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={i} cat={cat} index={i} />
          ))}
        </StaggerContainer>
      </section>

      {/* ── Trending Products ── */}
      <section className="bg-surface-50 py-20 border-y border-surface-100">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <ScrollReveal className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-2">Hand-picked for you</p>
              <h2 className="text-3xl font-bold text-surface-900">Trending Now</h2>
            </div>
            <div className="flex bg-white rounded-xl border border-surface-200 p-1">
              {["BIRTHDAY", "WEDDING", "PARTY"].map(tab => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer border-none transition-colors z-10 ${
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
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="flex gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {tabProducts[activeTab].map((p, i) => (
                  <motion.div
                    key={i}
                    className="min-w-[220px] flex-shrink-0"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <ScrollReveal className="text-center mt-8" variant="fadeIn">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.03, borderColor: "#e11d5c", color: "#e11d5c" }}
                whileTap={{ scale: 0.97 }}
                className="border border-surface-200 rounded-xl px-6 py-3 text-sm font-semibold text-surface-700 transition-all bg-transparent cursor-pointer inline-flex items-center gap-2"
              >
                View All Products <ArrowRight size={15} />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── About section ── */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-8 flex items-center gap-16 flex-wrap">
          <ScrollReveal variant="slideRight" className="flex-1 min-w-[300px]">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-4">The Salooote Experience</p>
            <h2 className="text-4xl font-bold text-surface-900 leading-tight mb-6">
              Makes your celebrations<br />an easy reality.
            </h2>
            <p className="text-surface-500 text-base leading-relaxed mb-8 max-w-[420px]">
              Your go-to destination for seamless event planning. Vendors, decor, gifts and more — at unbeatable prices.
            </p>

            <div className="flex gap-8 mb-8">
              {[
                { num: "2500", suffix: "+", label: "Products", icon: Package },
                { num: "850",  suffix: "+", label: "Vendors",  icon: Users },
                { num: "15",   suffix: "K+",label: "Events",   icon: Smile },
              ].map(({ num, suffix, label, icon: Icon }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <p className="text-2xl font-bold text-brand-600 mb-1">
                    <CountUp end={num} suffix={suffix} />
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className="text-surface-400" />
                    <p className="text-xs text-surface-500">{label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <StaggerContainer staggerDelay={0.1}>
              {["Verified vendors & trusted reviews", "Same-day delivery available", "AI-powered event planner"].map((f, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="flex items-center gap-3 mb-3"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0" />
                    <span className="text-sm text-surface-600">{f}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ScrollReveal>

          <ScrollReveal variant="slideLeft" className="flex-1 min-w-[300px] max-w-[480px]">
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "/images/wedding-ceremony.jpg", alt: "Wedding", h: "h-[220px]", mt: "" },
                { src: "/images/cupcakes.jpg",         alt: "Cupcakes",h: "h-[220px]", mt: "mt-8" },
                { src: "/images/flowers-roses.jpg",    alt: "Flowers", h: "h-[156px]", mt: "-mt-4" },
                { src: "/images/balloons-blue.jpg",    alt: "Balloons",h: "h-[156px]", mt: "mt-4" },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className={`rounded-2xl overflow-hidden ${img.h} ${img.mt} img-zoom`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                >
                  <Image src={img.src} alt={img.alt} width={240} height={220} className="object-cover w-full h-full" />
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── AI Planner Banner ── */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-24">
        <ScrollReveal variant="scaleUp">
          <motion.div
            className="rounded-2xl overflow-hidden relative min-h-[280px] flex items-center bg-brand-600"
            whileHover={{ scale: 1.008 }}
            transition={{ duration: 0.3 }}
          >
            {/* Ambient orb inside */}
            <div className="absolute inset-0 overflow-hidden">
              <Orb className="w-[400px] h-[400px] bg-white/10 -bottom-20 -right-20" delay={0.5} />
              <Orb className="w-[280px] h-[280px] bg-brand-400/30 top-0 left-1/3" delay={1.5} />
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden md:block">
              <Image src="/images/wedding-ceremony.jpg" alt="AI Planner" fill className="object-cover opacity-15" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-600" />
            </div>

            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "28px 28px"
            }} />

            <div className="relative z-10 p-8 md:p-14 max-w-[540px]">
              <motion.div
                className="flex items-center gap-2 mb-4"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">AI-Powered</span>
              </motion.div>

              <h2 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(26px, 3.2vw, 40px)" }}>
                Take the guess-work out<br />of <span className="italic opacity-80">event planning.</span>
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-[360px]">
                Smart planning — pick the right vendors, stay on budget, bring your event to life.
              </p>
              <div className="flex gap-3 flex-wrap">
                <MagneticButton>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.96 }}
                    className="bg-white text-brand-600 border-none rounded-xl px-6 py-3 text-sm font-bold cursor-pointer flex items-center gap-2"
                  >
                    <Play size={13} fill="currentColor" /> Start Planning
                  </motion.button>
                </MagneticButton>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.22)" }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 text-white border border-white/20 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2"
                >
                  Watch Demo <ArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-surface-50 py-24 border-y border-surface-100">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">Happy Clients</p>
            <h2 className="text-4xl font-bold text-surface-900 mb-3">Hear from our clients</h2>
            <p className="text-surface-400 text-base">Thousands of happy events, powered by Salooote</p>
          </ScrollReveal>

          <StaggerContainer className="flex gap-6 justify-center flex-wrap" staggerDelay={0.1}>
            {TESTIMONIALS.map((t, i) => (
              <StaggerItem key={i}>
                <TestimonialCard t={t} index={i} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Destination Weddings ── */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-8 flex items-center gap-16 flex-wrap-reverse">
          <ScrollReveal variant="slideRight" className="flex-1 min-w-[300px] max-w-[500px]">
            <div className="relative">
              <motion.div
                className="rounded-2xl overflow-hidden h-[360px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <Image src="/images/wedding-beach.jpg" alt="Destination Wedding" fill className="object-cover" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -right-4 glass rounded-xl p-4"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center">
                    <Heart size={16} className="text-accent-500 fill-accent-200" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-surface-800">500+ Venues</p>
                    <p className="text-xs text-surface-400">Available to book</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slideLeft" className="flex-1 min-w-[300px]">
            <p className="text-accent-500 text-xs font-semibold uppercase tracking-widest mb-4">Destination Weddings</p>
            <h2 className="text-4xl font-bold text-surface-900 leading-tight mb-5">
              Leave it to us.<br />Book <span className="italic text-accent-600">venues</span> on Salooote.
            </h2>
            <p className="text-surface-400 text-base leading-relaxed mb-8 max-w-[400px]">
              Whether celebrating life's most important day or an intimate gathering — we make every moment unforgettable.
            </p>
            <div className="flex gap-4 flex-wrap">
              <MagneticButton>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 10px 28px -4px rgba(249,115,22,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-accent bg-accent-500 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2"
                >
                  <MapPin size={15} /> Explore Venues
                </motion.button>
              </MagneticButton>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: "#e11d5c", color: "#e11d5c" }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-surface-200 rounded-xl px-6 py-3 text-sm font-semibold text-surface-700 cursor-pointer flex items-center gap-2 bg-transparent"
                >
                  Browse All <ChevronRight size={15} />
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Become a Partner ── */}
      <section className="bg-surface-50 py-24 border-t border-surface-100">
        <div className="max-w-[720px] mx-auto px-6 md:px-8">
          <ScrollReveal className="text-center mb-10">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">For Businesses</p>
            <h2 className="text-4xl font-bold text-surface-900 mb-3">Become a Partner</h2>
            <p className="text-surface-400 text-base">Join hundreds of vendors growing their business on Salooote</p>
          </ScrollReveal>

          <ScrollReveal variant="scaleUp" delay={0.1}>
            <motion.div
              className="bg-white rounded-2xl p-8 md:p-10 border border-surface-200"
              whileHover={{ boxShadow: "0 16px 48px -12px rgba(225,29,92,0.10), 0 4px 12px rgba(0,0,0,0.05)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {["Full Name", "Business Name", "Email Address", "Phone Number"].map((ph, i) => (
                  <motion.input
                    key={i}
                    placeholder={ph}
                    whileFocus={{ scale: 1.01, borderColor: "#e11d5c" }}
                    className="px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-400 transition-all outline-none"
                  />
                ))}
              </div>
              <select className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 text-surface-500 mb-4 outline-none cursor-pointer">
                <option value="">Select your business category…</option>
                {["Cakes & Desserts", "Catering", "Flowers & Decor", "DJ & Music", "Photography", "Venues", "Other"].map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
              <textarea
                placeholder="Tell us about your products or services…"
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 min-h-[100px] resize-none placeholder:text-surface-400 mb-6 outline-none"
              />
              <MagneticButton>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 28px -4px rgba(225,29,92,0.36)" }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2"
                >
                  <Send size={15} /> Submit Application
                </motion.button>
              </MagneticButton>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
