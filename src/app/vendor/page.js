"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { SAMPLE_PRODUCTS, REVIEWS } from "@/lib/data";
import {
  Star, MapPin, Phone, MessageCircle, CheckCircle2,
  Heart, Share2, ArrowLeft, X, ThumbsUp, Package,
  Calendar, LayoutGrid, Clock, ChevronRight
} from "lucide-react";

/* ── Vendor data ── */
const vendor = {
  name: "Salooote",
  category: "Flowers & Cakes",
  rating: 4.88,
  reviewCount: 270,
  sales: "1.2K",
  location: "Yerevan, Armenia",
  address: "50/3, Arshakunyats Ave, Yerevan",
  phone: ["+374 60 72 77 17", "+374 60 72 77 10"],
  since: "2019",
  isOpen: true,
  openUntil: "10:00 PM",
  cover: "/images/party-balloons2.jpg",
  bio: "Salooote Flowers is the largest flower and gift delivery company in Armenia. Catalogia is a flower belonging to the orchid family — from the name of which the Catalogia Flowers Art Studio was opened in the heart of the city at Mashtots 45. It is very important for us that our customers are always satisfied, and we do our best to provide the highest quality across a wide range of gifts and services.",
};

const PRODUCT_CATS = ["All", "Cakes", "Flowers", "Balloons", "Decor", "Gifts"];

const SERVICES = [
  { name: "Custom Cakes",           image: "/images/wedding-cake.jpg" },
  { name: "Party Decor",            image: "/images/party-balloons.jpg" },
  { name: "Interactive Animators",  image: "/images/party-hats.jpg" },
  { name: "Custom Flowers",         image: "/images/flowers-roses.jpg" },
  { name: "Wedding Cakes",          image: "/images/wedding-cake2.jpg" },
  { name: "Stage Balloons",         image: "/images/balloons-blue.jpg" },
  { name: "Event Catering",         image: "/images/catering-setup.jpg" },
  { name: "Cupcake Towers",         image: "/images/cupcakes.jpg" },
];

const GALLERY_IMAGES = [
  "/images/wedding-cake.jpg", "/images/wedding-cake2.jpg", "/images/cupcakes.jpg", "/images/cookies-box.jpg",
  "/images/flowers-roses.jpg", "/images/wedding-cake.jpg", "/images/cupcakes.jpg", "/images/wedding-cake2.jpg",
  "/images/wedding-cake.jpg", "/images/cookies-box.jpg", "/images/cupcakes.jpg", "/images/wedding-cake2.jpg",
];

const HOURS = [
  { day: "Monday",    h: "8:00 AM – 10:00 PM", open: true  },
  { day: "Tuesday",   h: "8:00 AM – 10:00 PM", open: true  },
  { day: "Wednesday", h: "8:00 AM – 10:00 PM", open: true  },
  { day: "Thursday",  h: "8:00 AM – 10:00 PM", open: true  },
  { day: "Friday",    h: "8:00 AM – 10:00 PM", open: true  },
  { day: "Saturday",  h: "8:00 AM – 10:00 PM", open: true  },
  { day: "Sunday",    h: "Closed",              open: false },
];

const FILTER_COLORS = ["Multicolored", "Beige", "Yellow", "Green", "Blue", "Red"];
const FILTER_TYPES  = ["Bouquet", "Arrangement", "Sweet arrangement"];
const PRICE_RANGES  = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50–$100",  min: 50, max: 100 },
  { label: "$100+",     min: 100, max: Infinity },
];

/* ── Reviews Modal ── */
function ReviewsModal({ onClose }) {
  const [sort, setSort] = useState("recent");
  const [helpful, setHelpful] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const allReviews = [
    ...REVIEWS,
    { name: "Emily Clarke",    initial: "E", color: "bg-brand-500",  text: "Stunning! Everyone at the party was amazed. The detail work was exceptional.", rating: 5, date: "3 weeks ago", hasPhotos: true,  tags: ["Beautiful", "Delicious"], helpful: 31 },
    { name: "James Whitfield", initial: "J", color: "bg-accent-400", text: "Second time ordering and they never disappoint. Super professional.", rating: 5, date: "1 month ago",  hasPhotos: false, tags: ["Communication"],            helpful: 17 },
  ];

  const avgRating = 4.88;
  const dist = [67, 21, 8, 3, 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[560px] max-h-[88vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 flex-shrink-0">
          <h2 className="font-bold text-lg text-surface-900">{vendor.name} Reviews</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center border-none cursor-pointer hover:bg-surface-200 transition-colors">
            <X size={15} className="text-surface-600" />
          </button>
        </div>

        {/* Rating summary */}
        <div className="px-6 py-4 border-b border-surface-200 flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-surface-900">{avgRating}</p>
              <div className="flex gap-0.5 justify-center my-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-warm-400 text-warm-400" />)}
              </div>
              <p className="text-xs text-surface-400">{vendor.reviewCount} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {dist.map((pct, i) => (
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

        {/* Sort tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-surface-200 flex-shrink-0">
          {[["recent", "Recent"], ["highest", "Highest"], ["lowest", "Lowest"], ["oldest", "Oldest"]].map(([id, label]) => (
            <button
              key={id} onClick={() => setSort(id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border-none cursor-pointer transition-all ${sort === id ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-500 hover:bg-surface-200"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Reviews list */}
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

              {/* Sub-ratings */}
              <div className="flex gap-4 mb-3 flex-wrap">
                {["Timeliness", "Quality", "Professionalism"].map(attr => (
                  <div key={attr} className="flex items-center gap-1">
                    <span className="text-xs text-surface-400">{attr}</span>
                    <Star size={10} className="fill-warm-400 text-warm-400" />
                    <span className="text-xs font-semibold text-surface-600">5.0</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-surface-600 leading-relaxed mb-3">{r.text}</p>

              {r.hasPhotos && (
                <div className="flex gap-2 mb-3">
                  {["/images/cupcakes.jpg", "/images/wedding-cake.jpg", "/images/flowers-roses.jpg"].map((src, j) => (
                    <div key={j} className="w-14 h-14 rounded-xl overflow-hidden relative border border-surface-200">
                      <Image src={src} alt="" fill className="object-cover" />
                    </div>
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

/* ── Location Modal ── */
function LocationModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[440px] max-h-[88vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 flex-shrink-0">
          <h2 className="font-bold text-base text-surface-900">Location & Hours</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center border-none cursor-pointer hover:bg-surface-200 transition-colors">
            <X size={15} className="text-surface-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Map placeholder */}
          <div className="h-[180px] bg-blue-50 relative overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(0deg,#cbd5e1 0,#cbd5e1 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#cbd5e1 0,#cbd5e1 1px,transparent 0,transparent 40px)`,
              backgroundSize: "40px 40px", opacity: 0.4
            }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-5 h-5 bg-brand-600 rounded-full border-2 border-white shadow-md" />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 py-1.5 shadow-soft border border-surface-200 whitespace-nowrap">
                <p className="text-xs font-semibold text-surface-700">{vendor.name}</p>
              </div>
            </div>
          </div>

          {/* Address & phone */}
          <div className="p-5 border-b border-surface-100">
            <div className="flex items-start gap-3 mb-3">
              <MapPin size={15} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-surface-800">{vendor.address}</p>
                <p className="text-xs text-surface-400 mt-0.5">Yerevan, Armenia</p>
              </div>
            </div>
            {vendor.phone.map((p, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <Phone size={14} className="text-surface-400 flex-shrink-0" />
                <a href={`tel:${p}`} className="text-sm text-brand-600 font-medium no-underline hover:text-brand-700">{p}</a>
              </div>
            ))}
          </div>

          {/* Hours */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm text-surface-800">Business Hours</p>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Open Now</span>
            </div>
            <div className="space-y-0">
              {HOURS.map(({ day, h, open }) => (
                <div
                  key={day}
                  className={`flex justify-between py-2.5 border-b border-surface-100 last:border-none ${day === today ? "font-semibold" : ""}`}
                >
                  <span className={`text-sm ${day === today ? "text-brand-600" : "text-surface-600"}`}>{day}</span>
                  <span className={`text-sm ${open ? (day === today ? "text-brand-600" : "text-surface-800") : "text-surface-400"}`}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Gallery Modal ── */
function GalleryModal({ service, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[680px]">
        <button onClick={onClose} className="absolute -top-10 right-0 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-white/30 transition-colors z-10">
          <X size={16} className="text-white" />
        </button>
        <div className="rounded-2xl overflow-hidden relative">
          <div className="grid grid-cols-4 gap-0.5 bg-surface-900">
            {GALLERY_IMAGES.slice(0, 12).map((src, i) => (
              <div key={i} className={`relative overflow-hidden ${i < 4 ? "h-[148px]" : "h-[120px]"}`}>
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
          {/* Blur CTA overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-[220px] flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" style={{ backdropFilter: "blur(2px)" }} />
            <div className="relative z-10 p-8 w-full text-center">
              <h3 className="text-2xl font-bold text-white mb-1">Want to see more?</h3>
              <p className="text-white/60 text-sm mb-5">Sign up to view the full gallery.</p>
              <Link href="/signup" onClick={onClose}>
                <button className="bg-brand-600 text-white border-none rounded-xl px-7 py-3 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                  Sign up — it's free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function VendorPage() {
  const [mainTab, setMainTab]       = useState("products");
  const [productCat, setProductCat] = useState("All");
  const [showReviews, setShowReviews]   = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [gallery, setGallery]           = useState(null);
  const [priceIdx, setPriceIdx]         = useState(0);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTypes, setSelectedTypes]   = useState([]);

  const toggleColor = (c) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleType  = (t) => setSelectedTypes(prev  => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const products = [...SAMPLE_PRODUCTS, ...SAMPLE_PRODUCTS].slice(0, 12).map((p, i) => ({ ...p, id: i + 1 }));

  return (
    <div className="min-h-screen bg-surface-50">

      {/* ── Cover ── */}
      <div className="bg-white pt-5 pb-0">
        <div className="max-w-container mx-auto px-6 md:px-8">
          {/* Outer wrapper — relative, NO overflow-hidden so avatar can peek below */}
          <div className="relative h-[220px] md:h-[260px]">
            {/* Inner image — has overflow-hidden to clip the photo */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image src={vendor.cover} alt="Cover" fill className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            {/* Back */}
            <div className="absolute top-4 left-4 z-10">
              <Link href="/products" className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium no-underline hover:bg-white transition-all">
                <ArrowLeft size={15} /> Back
              </Link>
            </div>

            {/* Save / Share */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium border-none cursor-pointer hover:bg-white transition-all flex items-center gap-1.5">
                <Heart size={14} className="text-accent-400" /> Save
              </button>
              <button className="bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium border-none cursor-pointer hover:bg-white transition-all flex items-center gap-1.5">
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Avatar — straddles the bottom edge, overflow-hidden only on avatar itself */}
            <div className="absolute bottom-0 left-6 translate-y-1/2 z-20 w-[84px] h-[84px] rounded-2xl bg-white border-[3px] border-white flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>
              <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                <span className="text-xl font-bold italic text-brand-700">Salo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 pt-14 pb-0">
          <div className="flex items-start justify-between gap-6 flex-wrap mb-5">

            {/* Info */}
            <div className="flex-1 min-w-[260px]">

              {/* Name + badges */}
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-surface-900">{vendor.name}</h1>
                <span className="bg-brand-600 text-white text-xs rounded-full px-2.5 py-0.5 font-semibold">Top Rated</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${vendor.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {vendor.isOpen ? `Open · until ${vendor.openUntil}` : "Closed"}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(vendor.rating) ? "fill-warm-400 text-warm-400" : "fill-surface-200 text-surface-200"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-surface-800">{vendor.rating}</span>
                <button
                  onClick={() => setShowReviews(true)}
                  className="text-sm text-surface-400 border-none bg-transparent cursor-pointer hover:text-brand-600 transition-colors"
                >
                  ({vendor.reviewCount} reviews)
                </button>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-5 flex-wrap text-sm text-surface-500 mb-4">
                <button onClick={() => setShowLocation(true)} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer text-surface-500 hover:text-brand-600 transition-colors text-sm p-0">
                  <MapPin size={14} className="text-surface-400" /> {vendor.address}
                </button>
                <span className="flex items-center gap-1.5">
                  <Package size={14} className="text-surface-400" /> {vendor.sales} sales
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-surface-400" /> Since {vendor.since}
                </span>
              </div>

              {/* Bio */}
              <p className="text-sm text-surface-500 leading-relaxed max-w-[640px] mb-4">{vendor.bio}</p>

              {/* Phones */}
              <div className="flex items-center gap-4 flex-wrap">
                {vendor.phone.map((p, i) => (
                  <a key={i} href={`tel:${p}`} className="flex items-center gap-1.5 text-sm text-brand-600 no-underline font-medium hover:text-brand-700 transition-colors">
                    <Phone size={13} /> {p}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button className="bg-[#25D366] text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-[#1eb556] transition-colors">
                <MessageCircle size={15} /> Chat on WhatsApp
              </button>
              <button className="bg-brand-50 text-brand-600 border border-brand-100 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-brand-100 transition-colors">
                <CheckCircle2 size={15} /> Request a Quote
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-0 border-b border-surface-200 -mb-px">
            {[["products", "Products"], ["catalog", "Business Catalog"]].map(([id, label]) => (
              <button
                key={id} onClick={() => setMainTab(id)}
                className={`px-6 py-3.5 text-sm font-semibold border-none cursor-pointer transition-all ${
                  mainTab === id
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

        {/* ── PRODUCTS TAB ── */}
        {mainTab === "products" && (
          <div className="flex gap-8">

            {/* Sidebar */}
            <aside className="w-[210px] flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-xl border border-surface-200 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-semibold text-surface-900 text-sm">Filters</p>
                  {(priceIdx > 0 || selectedColors.length || selectedTypes.length) > 0 && (
                    <button
                      onClick={() => { setPriceIdx(0); setSelectedColors([]); setSelectedTypes([]); }}
                      className="text-xs text-brand-600 font-medium border-none bg-transparent cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Price */}
                <div className="mb-5 pb-5 border-b border-surface-100">
                  <p className="text-xs font-semibold text-surface-700 uppercase tracking-wide mb-3">Price</p>
                  {PRICE_RANGES.map((p, i) => (
                    <label key={p.label} className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={() => setPriceIdx(i)}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${priceIdx === i ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
                        {priceIdx === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-sm transition-colors ${priceIdx === i ? "text-surface-900 font-medium" : "text-surface-500"}`}>{p.label}</span>
                    </label>
                  ))}
                </div>

                {/* Color */}
                <div className="mb-5 pb-5 border-b border-surface-100">
                  <p className="text-xs font-semibold text-surface-700 uppercase tracking-wide mb-3">Color</p>
                  {FILTER_COLORS.map(c => (
                    <label key={c} className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={() => toggleColor(c)}>
                      <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedColors.includes(c) ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
                        {selectedColors.includes(c) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${selectedColors.includes(c) ? "text-surface-900 font-medium" : "text-surface-500"}`}>{c}</span>
                    </label>
                  ))}
                </div>

                {/* Type */}
                <div>
                  <p className="text-xs font-semibold text-surface-700 uppercase tracking-wide mb-3">Type</p>
                  {FILTER_TYPES.map(t => (
                    <label key={t} className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={() => toggleType(t)}>
                      <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedTypes.includes(t) ? "border-brand-600 bg-brand-600" : "border-surface-300 group-hover:border-brand-400"}`}>
                        {selectedTypes.includes(t) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${selectedTypes.includes(t) ? "text-surface-900 font-medium" : "text-surface-500"}`}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              {/* Category pills + sort */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {PRODUCT_CATS.map(cat => (
                    <button
                      key={cat} onClick={() => setProductCat(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border flex-shrink-0 cursor-pointer transition-all ${
                        productCat === cat
                          ? "bg-brand-600 text-white border-brand-600"
                          : "bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select className="border border-surface-200 rounded-xl px-4 py-2 text-sm text-surface-600 bg-white outline-none cursor-pointer">
                  {["Trending", "Newest", "Price: Low–High", "Price: High–Low", "Best Rated"].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {products.map((p, i) => <ProductCard key={i} product={p} />)}
              </div>

              <div className="text-center">
                <button className="border border-surface-200 rounded-xl px-8 py-3 text-sm font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent cursor-pointer">
                  Load more products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BUSINESS CATALOG TAB ── */}
        {mainTab === "catalog" && (
          <div>
            {/* About */}
            <div className="max-w-[760px] mb-12">
              <h2 className="text-xl font-bold text-surface-900 mb-4">About the Business</h2>
              <p className="text-sm text-surface-500 leading-relaxed">{vendor.bio}</p>

              {/* Stats */}
              <div className="flex gap-8 mt-6">
                {[
                  { label: "Total Sales",    value: vendor.sales,              icon: Package },
                  { label: "Avg Rating",     value: `${vendor.rating}★`,       icon: Star },
                  { label: "Member Since",   value: vendor.since,              icon: Calendar },
                  { label: "Response Time",  value: "< 30 min",               icon: Clock },
                ].map(({ label, value, icon: Icon }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-surface-900 text-base">{value}</p>
                      <p className="text-xs text-surface-400">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-surface-900">Services</h2>
              <p className="text-sm text-surface-400">{SERVICES.length} services</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {SERVICES.map((svc, i) => (
                <button
                  key={i} onClick={() => setGallery(svc)}
                  className="relative h-[164px] rounded-xl overflow-hidden group cursor-pointer border-none p-0 block"
                >
                  <Image src={svc.image} alt={svc.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <p className="text-sm font-semibold text-white leading-snug">{svc.name}</p>
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white/70 text-xs">View gallery</span>
                      <ChevronRight size={11} className="text-white/70" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showReviews  && <ReviewsModal  onClose={() => setShowReviews(false)} />}
      {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}
      {gallery      && <GalleryModal  service={gallery} onClose={() => setGallery(null)} />}
    </div>
  );
}
