"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, Phone, MessageCircle, CheckCircle2,
  Heart, Share2, ArrowLeft, X, ThumbsUp, Package,
  Calendar, Clock, ChevronRight, Camera, LayoutGrid,
  Play, Award
} from "lucide-react";
import { REVIEWS } from "@/lib/data";

/* ── Vendor data ── */
const vendor = {
  name: "Moment Studio",
  category: "Photography & Video",
  rating: 4.96,
  reviewCount: 184,
  projects: "320+",
  location: "Yerevan, Armenia",
  address: "12, Komitas Ave, Yerevan",
  phone: ["+374 55 12 34 56", "+374 77 98 76 54"],
  since: "2017",
  isOpen: true,
  responseTime: "< 1 hour",
  cover: "/images/wedding-ceremony.jpg",
  bio: "Moment Studio is a premium photography and video production team based in Yerevan. We specialize in weddings, corporate events, and personal celebrations. Our team of 8 professionals brings creativity and storytelling to every frame — turning your moments into timeless memories.",
};

const SERVICES = [
  { name: "Wedding Photography", price: "From $800", image: "/images/wedding-ceremony.jpg" },
  { name: "Event Coverage",      price: "From $400", image: "/images/wedding-dance.jpg" },
  { name: "Floral Arrangements", price: "From $150", image: "/images/flowers-roses.jpg" },
  { name: "Venue Decoration",    price: "From $300", image: "/images/wedding-arch-beach.jpg" },
  { name: "Video Production",    price: "From $600", image: "/images/hero-dj.jpg" },
  { name: "Couples Portrait",    price: "From $200", image: "/images/wedding-beach.jpg" },
];

const GALLERY = [
  { src: "/images/wedding-ceremony.jpg",  span: "col-span-2 row-span-2" },
  { src: "/images/flowers-roses.jpg",     span: "" },
  { src: "/images/wedding-arch-beach.jpg",span: "" },
  { src: "/images/wedding-dance.jpg",     span: "" },
  { src: "/images/wedding-beach.jpg",     span: "" },
  { src: "/images/catering-setup.jpg",    span: "" },
  { src: "/images/party-balloons2.jpg",   span: "" },
  { src: "/images/hero-dj.jpg",           span: "" },
  { src: "/images/balloons-blue.jpg",     span: "" },
];

const HOURS = [
  { day: "Monday",    h: "9:00 AM – 8:00 PM", open: true  },
  { day: "Tuesday",   h: "9:00 AM – 8:00 PM", open: true  },
  { day: "Wednesday", h: "9:00 AM – 8:00 PM", open: true  },
  { day: "Thursday",  h: "9:00 AM – 8:00 PM", open: true  },
  { day: "Friday",    h: "9:00 AM – 9:00 PM", open: true  },
  { day: "Saturday",  h: "10:00 AM – 9:00 PM",open: true  },
  { day: "Sunday",    h: "Closed",             open: false },
];

/* ── Reviews Modal ── */
function ReviewsModal({ onClose }) {
  const [helpful, setHelpful] = useState({});
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const allReviews = [
    ...REVIEWS,
    { name: "Nare Petrosyan",  initial: "N", color: "bg-brand-500",  text: "Absolutely magical photos from our wedding. Every shot was perfect.", rating: 5, date: "2 weeks ago",  hasPhotos: true,  tags: ["Wedding", "Amazing quality"], helpful: 42 },
    { name: "David Hakobyan",  initial: "D", color: "bg-accent-400", text: "Professional team, very responsive. Our event photos turned out stunning.", rating: 5, date: "1 month ago", hasPhotos: false, tags: ["Professional", "Fast delivery"], helpful: 28 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[560px] max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 flex-shrink-0">
          <h2 className="font-bold text-lg text-surface-900">{vendor.name} Reviews</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center border-none cursor-pointer hover:bg-surface-200 transition-colors">
            <X size={15} className="text-surface-600" />
          </button>
        </div>

        {/* Rating bar */}
        <div className="px-6 py-4 border-b border-surface-200 flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-surface-900">{vendor.rating}</p>
              <div className="flex gap-0.5 justify-center my-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-warm-400 text-warm-400" />)}
              </div>
              <p className="text-xs text-surface-400">{vendor.reviewCount} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[72, 20, 6, 2, 0].map((pct, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-surface-500 w-3">{5 - i}</span>
                  <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div className="h-full bg-warm-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-surface-400 w-7 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {allReviews.map((r, i) => (
            <div key={i} className="bg-surface-50 rounded-xl p-5 border border-surface-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>{r.initial}</div>
                  <div>
                    <p className="font-semibold text-sm text-surface-800">{r.name}</p>
                    <p className="text-xs text-surface-400">{r.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} className={j < Math.floor(r.rating) ? "fill-warm-400 text-warm-400" : "fill-surface-200 text-surface-200"} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-surface-600 leading-relaxed mb-3">{r.text}</p>
              {r.hasPhotos && (
                <div className="flex gap-2 mb-3">
                  {["/images/wedding-ceremony.jpg", "/images/flowers-roses.jpg"].map((src, j) => (
                    <div key={j} className="w-14 h-14 rounded-xl overflow-hidden relative border border-surface-200">
                      <Image src={src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {r.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {r.tags.map((tag, j) => (
                    <span key={j} className="text-xs bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full border border-brand-100">{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => setHelpful(p => ({ ...p, [i]: !p[i] }))}
                  className={`flex items-center gap-1.5 text-xs font-medium border rounded-xl px-3 py-1.5 cursor-pointer transition-all ${helpful[i] ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-transparent text-surface-400 border-surface-200 hover:border-surface-300"}`}
                >
                  <ThumbsUp size={11} /> Helpful ({(r.helpful || 0) + (helpful[i] ? 1 : 0)})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Gallery Lightbox ── */
function Lightbox({ src, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-none cursor-pointer hover:bg-white/20 transition-colors">
        <X size={18} className="text-white" />
      </button>
      <div className="relative max-w-[900px] max-h-[80vh] w-full h-full" onClick={e => e.stopPropagation()}>
        <Image src={src} alt="" fill className="object-contain rounded-xl" />
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function VendorServicePage() {
  const [tab, setTab]                   = useState("gallery");
  const [showReviews, setShowReviews]   = useState(false);
  const [lightbox, setLightbox]         = useState(null);

  return (
    <div className="min-h-screen bg-surface-50">

      {/* ── Cover ── */}
      {/* No overflow-hidden on outer wrapper — lets avatar straddle the edge */}
      <div className="relative h-[240px] md:h-[300px]">
        {/* Image layer with its own overflow-hidden */}
        <div className="absolute inset-0 overflow-hidden">
          <Image src={vendor.cover} alt="Cover" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>

        <div className="absolute top-4 left-5 z-10">
          <Link href="/products" className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium no-underline hover:bg-white transition-all">
            <ArrowLeft size={15} /> Back
          </Link>
        </div>

        <div className="absolute top-4 right-5 z-10 flex gap-2">
          <button className="bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium border-none cursor-pointer hover:bg-white transition-all flex items-center gap-1.5">
            <Heart size={14} className="text-accent-400" /> Save
          </button>
          <button className="bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium border-none cursor-pointer hover:bg-white transition-all flex items-center gap-1.5">
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Avatar — bottom:0 + translate-y-1/2 straddles the cover edge cleanly */}
        <div className="absolute bottom-0 left-6 md:left-8 translate-y-1/2 w-[88px] h-[88px] rounded-2xl bg-white border-4 border-white overflow-hidden z-20 flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>
          <div className="w-full h-full bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center">
            <Camera size={28} className="text-white/70" />
          </div>
        </div>
      </div>

      {/* ── Profile ── */}
      <div className="bg-white border-b border-surface-200">
        {/* pt-14 (56px) clears the 44px avatar overhang */}
        <div className="max-w-container mx-auto px-6 md:px-8 pt-14 pb-0">
          <div className="flex items-start justify-between gap-6 flex-wrap mb-5">

            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-surface-900">{vendor.name}</h1>
                <span className="bg-brand-600 text-white text-xs rounded-full px-2.5 py-0.5 font-semibold">Top Rated</span>
                <span className="bg-surface-100 text-surface-600 text-xs rounded-full px-2.5 py-0.5 font-medium">{vendor.category}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${vendor.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {vendor.isOpen ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(vendor.rating) ? "fill-warm-400 text-warm-400" : "fill-surface-200 text-surface-200"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-surface-800">{vendor.rating}</span>
                <button onClick={() => setShowReviews(true)} className="text-sm text-surface-400 border-none bg-transparent cursor-pointer hover:text-brand-600 transition-colors p-0">
                  ({vendor.reviewCount} reviews)
                </button>
              </div>

              <div className="flex items-center gap-5 flex-wrap text-sm text-surface-500 mb-4">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-surface-400" />{vendor.location}</span>
                <span className="flex items-center gap-1.5"><Award size={14} className="text-surface-400" />{vendor.projects} projects</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-surface-400" />Since {vendor.since}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-surface-400" />Replies {vendor.responseTime}</span>
              </div>

              <p className="text-sm text-surface-500 leading-relaxed max-w-[620px] mb-4">{vendor.bio}</p>

              <div className="flex items-center gap-4 flex-wrap">
                {vendor.phone.map((p, i) => (
                  <a key={i} href={`tel:${p}`} className="flex items-center gap-1.5 text-sm text-brand-600 no-underline font-medium hover:text-brand-700">
                    <Phone size={13} /> {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <button className="bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-brand-700 transition-colors">
                <CheckCircle2 size={15} /> Book a Service
              </button>
              <button className="bg-[#25D366] text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-[#1eb556] transition-colors">
                <MessageCircle size={15} /> Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-surface-200 -mb-px">
            {[["gallery", "Gallery"], ["services", "Services"], ["about", "About"]].map(([id, label]) => (
              <button
                key={id} onClick={() => setTab(id)}
                className={`px-6 py-3.5 text-sm font-semibold border-none cursor-pointer transition-all ${
                  tab === id
                    ? "text-brand-600 border-b-2 border-brand-600 bg-transparent"
                    : "text-surface-400 bg-transparent hover:text-surface-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-container mx-auto px-6 md:px-8 py-8">

        {/* ── GALLERY TAB ── */}
        {tab === "gallery" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-surface-900">Portfolio</h2>
                <p className="text-sm text-surface-400 mt-0.5">{GALLERY.length} selected works</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium text-surface-600 bg-white cursor-pointer hover:border-surface-300 transition-colors">
                  <LayoutGrid size={14} /> All
                </button>
              </div>
            </div>

            {/* Masonry-style grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px]">
              {GALLERY.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(item.src)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer group ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  <Image src={item.src} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play size={16} className="text-surface-800 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign-up CTA */}
            <div className="mt-8 bg-gradient-to-r from-brand-50 to-accent-50 rounded-2xl p-8 border border-brand-100 text-center">
              <Camera size={28} className="text-brand-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-surface-900 mb-2">View the full portfolio</h3>
              <p className="text-sm text-surface-500 mb-5 max-w-[360px] mx-auto">
                Sign up to access 200+ photos and videos from this vendor's work.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/signup">
                  <button className="bg-brand-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                    Sign up — it's free
                  </button>
                </Link>
                <Link href="/login">
                  <button className="border border-surface-200 bg-white text-surface-700 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer hover:border-surface-300 transition-colors">
                    Log in
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {tab === "services" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-surface-900">Services & Pricing</h2>
              <p className="text-sm text-surface-400 mt-0.5">All packages can be customized to your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((svc, i) => (
                <div key={i} className="bg-white rounded-xl border border-surface-200 overflow-hidden hover:border-brand-200 hover:-translate-y-1 transition-all group cursor-pointer">
                  <div className="relative h-[180px] overflow-hidden">
                    <Image src={svc.image} alt={svc.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <p className="text-white font-semibold text-sm">{svc.name}</p>
                      <span className="bg-white/90 text-surface-800 text-xs font-bold px-2.5 py-1 rounded-full">{svc.price}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-brand-500" />
                        <span className="text-xs text-surface-500">Custom packages available</span>
                      </div>
                      <button className="text-brand-600 text-xs font-semibold flex items-center gap-1 border-none bg-transparent cursor-pointer hover:gap-1.5 transition-all">
                        Book <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ABOUT TAB ── */}
        {tab === "about" && (
          <div className="max-w-[720px]">
            <h2 className="text-xl font-bold text-surface-900 mb-4">About {vendor.name}</h2>
            <p className="text-sm text-surface-500 leading-relaxed mb-8">{vendor.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Projects",      value: vendor.projects, icon: Camera },
                { label: "Avg Rating",    value: `${vendor.rating}★`, icon: Star },
                { label: "Member Since",  value: vendor.since,    icon: Calendar },
                { label: "Response",      value: vendor.responseTime, icon: Clock },
              ].map(({ label, value, icon: Icon }, i) => (
                <div key={i} className="bg-white rounded-xl border border-surface-200 p-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-2">
                    <Icon size={16} className="text-brand-600" />
                  </div>
                  <p className="font-bold text-surface-900 text-lg">{value}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-white rounded-xl border border-surface-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-surface-900">Business Hours</p>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Open Now</span>
              </div>
              <div className="space-y-0">
                {HOURS.map(({ day, h, open }) => (
                  <div key={day} className="flex justify-between py-2.5 border-b border-surface-100 last:border-none">
                    <span className="text-sm text-surface-600">{day}</span>
                    <span className={`text-sm font-medium ${open ? "text-surface-800" : "text-surface-400"}`}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showReviews && <ReviewsModal onClose={() => setShowReviews(false)} />}
      {lightbox    && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
