"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, SAMPLE_PRODUCTS, TESTIMONIALS } from "@/lib/data";
import {
  Cake, UtensilsCrossed, Flower2, PartyPopper, Gift, Music,
  ArrowRight, Star, Quote, MapPin, Calendar, Sparkles,
  MessageCircle, ChevronRight, Heart, Send, Play,
  CheckCircle2, Users, Package, Smile, Shield, Truck
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
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: "90svh" }}>
        <div className="absolute inset-0">
          <Image src="/images/hero-dj.jpg" alt="Dream Event" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />
          {/* Extra bottom fade on mobile for readability */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
        </div>

        <div className="relative z-10 max-w-container mx-auto px-5 md:px-8 py-20 md:py-24 w-full">
          <div className="max-w-full md:max-w-[560px]">

            {/* Label */}
            <div className="opacity-0 animate-fade-up mb-5">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-[11px] font-semibold text-white/80 uppercase tracking-widest backdrop-blur-sm">
                <Sparkles size={11} className="text-brand-300" />
                Plan. Book. Celebrate.
              </span>
            </div>

            <h1 className="font-bold text-white leading-tight mb-5 opacity-0 animate-fade-up stagger-1"
                style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.1 }}>
              Plan your dream<br />
              <span className="text-brand-300 italic">events,</span> easily.
            </h1>

            <p className="text-white/60 leading-relaxed mb-8 opacity-0 animate-fade-up stagger-2 font-light"
               style={{ fontSize: "clamp(15px, 1.8vw, 18px)", maxWidth: "400px" }}>
              Explore vendors, book services, and plan your event — all in one place.
            </p>

            {/* CTA buttons — stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up stagger-3">
              <button className="btn-primary bg-brand-600 text-white border-none rounded-xl px-7 py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto">
                <Calendar size={16} /> Plan an Event
              </button>
              <Link href="/products" className="w-full sm:w-auto">
                <button className="bg-white/12 text-white border border-white/25 rounded-xl px-7 py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2.5 hover:bg-white/20 transition-all backdrop-blur-sm w-full">
                  Browse Products <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 md:gap-8 mt-8 opacity-0 animate-fade-up stagger-4">
              {[{ n: "15K+", l: "Events" }, { n: "850+", l: "Vendors" }, { n: "4.9★", l: "Rating" }].map((s, i) => (
                <div key={i}>
                  <p className="text-white font-bold text-lg md:text-xl leading-none">{s.n}</p>
                  <p className="text-white/40 text-xs mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat widget — desktop only */}
        <div className="absolute bottom-8 right-10 glass rounded-2xl p-5 max-w-[240px] z-10 hidden lg:block opacity-0 animate-fade-up stagger-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-800">Need help planning?</p>
              <p className="text-xs text-surface-400 mt-0.5">Reply in under 2 min</p>
            </div>
          </div>
          <button className="w-full bg-[#25D366] text-white border-none rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#1eb556] transition-colors">
            <MessageCircle size={12} /> Chat on WhatsApp
          </button>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="bg-surface-50 border-y border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 py-4 flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: Shield, text: "Verified vendors" },
            { icon: Truck,  text: "Same-day delivery" },
            { icon: Star,   text: "4.9 avg rating" },
            { icon: Users,  text: "15,000+ events planned" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-2 text-surface-500 text-sm">
              <Icon size={15} className="text-brand-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-2">Browse by Category</p>
            <h2 className="text-4xl font-bold text-surface-900">Everything you need</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-brand-600 no-underline flex items-center gap-1 hover:gap-2 transition-all hidden md:flex">
            All categories <ChevronRight size={15} />
          </Link>
        </div>

        {/* horizontal scroll on mobile, wrap on desktop */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto md:flex-wrap pb-2 hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
          {CATEGORIES.map((cat, i) => {
            const Icon = catIcons[cat.icon] || Gift;
            const imgSrc = catImages[cat.name];
            return (
              <Link key={i} href="/category" className="no-underline flex-shrink-0">
                <div className="category-card group w-[130px] md:w-[152px] cursor-pointer">
                  <div className="h-[172px] md:h-[192px] rounded-2xl overflow-hidden relative border border-surface-200">
                    {imgSrc
                      ? <Image src={imgSrc} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      : <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center">
                      <Icon size={16} className="text-brand-600" strokeWidth={1.5} />
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <span className="text-sm font-semibold text-white">{cat.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Trending Products ── */}
      <section className="bg-surface-50 py-20 border-y border-surface-100">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-2">Hand-picked for you</p>
              <h2 className="text-3xl font-bold text-surface-900">Trending Now</h2>
            </div>
            <div className="flex bg-white rounded-xl border border-surface-200 p-1">
              {["BIRTHDAY", "WEDDING", "PARTY"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer border-none transition-all ${
                    activeTab === tab
                      ? "bg-brand-600 text-white"
                      : "bg-transparent text-surface-500 hover:text-surface-800"
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {tabProducts[activeTab].map((p, i) => (
              <div key={i} className="min-w-[220px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/products">
              <button className="border border-surface-200 rounded-xl px-6 py-3 text-sm font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent cursor-pointer inline-flex items-center gap-2">
                View All Products <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── About section ── */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-8 flex items-center gap-16 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-4">The Salooote Experience</p>
            <h2 className="text-4xl font-bold text-surface-900 leading-tight mb-6">
              Makes your celebrations<br />an easy reality.
            </h2>
            <p className="text-surface-500 text-base leading-relaxed mb-8 max-w-[420px]">
              Your go-to destination for seamless event planning. Vendors, decor, gifts and more — at unbeatable prices.
            </p>

            <div className="flex gap-8 mb-8">
              {[
                { num: "2,500+", label: "Products", icon: Package },
                { num: "850+",   label: "Vendors",  icon: Users },
                { num: "15K+",   label: "Events",   icon: Smile },
              ].map(({ num, label, icon: Icon }, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-brand-600 mb-1">{num}</p>
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className="text-surface-400" />
                    <p className="text-xs text-surface-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {["Verified vendors & trusted reviews", "Same-day delivery available", "AI-powered event planner"].map((f, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0" />
                <span className="text-sm text-surface-600">{f}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-[300px] max-w-[480px]">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden h-[220px]">
                <Image src="/images/wedding-ceremony.jpg" alt="Wedding" width={240} height={220} className="object-cover w-full h-full" />
              </div>
              <div className="rounded-2xl overflow-hidden h-[220px] mt-8">
                <Image src="/images/cupcakes.jpg" alt="Cupcakes" width={240} height={220} className="object-cover w-full h-full" />
              </div>
              <div className="rounded-2xl overflow-hidden h-[156px] -mt-4">
                <Image src="/images/flowers-roses.jpg" alt="Flowers" width={240} height={156} className="object-cover w-full h-full" />
              </div>
              <div className="rounded-2xl overflow-hidden h-[156px] mt-4">
                <Image src="/images/balloons-blue.jpg" alt="Balloons" width={240} height={156} className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Planner Banner ── */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-24">
        <div className="rounded-2xl overflow-hidden relative min-h-[260px] flex items-center bg-brand-600">
          {/* Subtle image overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden md:block">
            <Image src="/images/wedding-ceremony.jpg" alt="AI Planner" fill className="object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-600" />
          </div>
          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }} />

          <div className="relative z-10 p-8 md:p-14 max-w-[520px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">AI-Powered</span>
            </div>
            <h2 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}>
              Take the guess-work out<br />of <span className="italic opacity-80">event planning.</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-[360px]">
              Smart planning — pick the right vendors, stay on budget, bring your event to life.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="bg-white text-brand-600 border-none rounded-xl px-6 py-3 text-sm font-bold cursor-pointer flex items-center gap-2 hover:bg-brand-50 transition-colors">
                <Play size={13} fill="currentColor" /> Start Planning
              </button>
              <button className="bg-white/10 text-white border border-white/20 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-white/20 transition-all">
                Watch Demo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-surface-50 py-24 border-y border-surface-100">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">Happy Clients</p>
            <h2 className="text-4xl font-bold text-surface-900 mb-3">Hear from our clients</h2>
            <p className="text-surface-400 text-base">Thousands of happy events, powered by Salooote</p>
          </div>

          <div className="flex gap-6 justify-center flex-wrap">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 max-w-[340px] border border-surface-200 hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} className="fill-warm-400 text-warm-400" />)}
                </div>
                <Quote size={20} className="text-brand-200 mb-3" />
                <p className="text-sm text-surface-500 leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                  <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-surface-800">{t.name}</p>
                    <p className="text-xs text-surface-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destination Weddings ── */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-8 flex items-center gap-16 flex-wrap-reverse">
          <div className="flex-1 min-w-[300px] max-w-[500px]">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-[360px]">
                <Image src="/images/wedding-beach.jpg" alt="Destination Wedding" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 glass rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center">
                    <Heart size={16} className="text-accent-500 fill-accent-200" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-surface-800">500+ Venues</p>
                    <p className="text-xs text-surface-400">Available to book</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[300px]">
            <p className="text-accent-500 text-xs font-semibold uppercase tracking-widest mb-4">Destination Weddings</p>
            <h2 className="text-4xl font-bold text-surface-900 leading-tight mb-5">
              Leave it to us.<br />Book <span className="italic text-accent-600">venues</span> on Salooote.
            </h2>
            <p className="text-surface-400 text-base leading-relaxed mb-8 max-w-[400px]">
              Whether celebrating life's most important day or an intimate gathering — we make every moment unforgettable.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button className="btn-accent bg-accent-500 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2">
                <MapPin size={15} /> Explore Venues
              </button>
              <Link href="/products">
                <button className="border border-surface-200 rounded-xl px-6 py-3 text-sm font-semibold text-surface-700 cursor-pointer flex items-center gap-2 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent">
                  Browse All <ChevronRight size={15} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Become a Partner ── */}
      <section className="bg-surface-50 py-24 border-t border-surface-100">
        <div className="max-w-[720px] mx-auto px-6 md:px-8">
          <div className="text-center mb-10">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">For Businesses</p>
            <h2 className="text-4xl font-bold text-surface-900 mb-3">Become a Partner</h2>
            <p className="text-surface-400 text-base">Join hundreds of vendors growing their business on Salooote</p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-10 border border-surface-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {["Full Name", "Business Name", "Email Address", "Phone Number"].map((ph, i) => (
                <input key={i} placeholder={ph}
                  className="px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-400 transition-all outline-none" />
              ))}
            </div>
            <select className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 text-surface-500 mb-4 outline-none">
              <option value="">Select your business category…</option>
              {["Cakes & Desserts", "Catering", "Flowers & Decor", "DJ & Music", "Photography", "Venues", "Other"].map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
            <textarea
              placeholder="Tell us about your products or services…"
              className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 min-h-[100px] resize-none placeholder:text-surface-400 mb-6 outline-none"
            />
            <button className="btn-primary bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2">
              <Send size={15} /> Submit Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
