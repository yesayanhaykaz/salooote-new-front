"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { SAMPLE_PRODUCTS, REVIEWS } from "@/lib/data";
import {
  Star, MapPin, Phone, MessageCircle, CheckCircle2,
  Heart, Share2, ArrowLeft, X, ChevronDown, Filter,
  ThumbsUp, Clock
} from "lucide-react";

/* ─── Data ─── */
const vendor = {
  name: "Salooote",
  category: "Flowers & Cakes",
  rating: 4.88,
  reviewCount: 270,
  sales: "1.2K",
  location: "Yerevan, Armenia",
  address: "50/3, Arshakunyats Ave, Yerevan",
  phone: ["+37460727717", "+37460727710"],
  since: "2019",
  isOpen: true,
  openUntil: "10:00 PM",
  image: "/images/vendor-woman.jpg",
  cover: "/images/party-balloons2.jpg",
  bio: "Catalogia is a flower belonging to the orchid family, from the name of which the Catalogia Flowers Art Studio was opened in the heart of the city, at Mashtots 45. Salooote Flowers is the largest flower and gift delivery company in Armenia. It is very important for us that our customers are always satisfied. And you can be sure that we will do our best to provide the highest quality of a wide range of gifts and services.",
};

const PRODUCT_CATS = ["All", "Cakes", "Flowers", "Balloons", "Decor", "Gifts"];

const SERVICES = [
  { name: "Cakes", label: "Custom Cakes", image: "/images/wedding-cake.jpg" },
  { name: "Decor", label: "Decor", image: "/images/party-balloons.jpg" },
  { name: "Animators", label: "Interactive Animators", image: "/images/party-hats.jpg" },
  { name: "Flowers", label: "Custom Flowers", image: "/images/flowers-roses.jpg" },
  { name: "Cakes", label: "Custom Cakes", image: "/images/wedding-cake2.jpg" },
  { name: "Stage Balloons", label: "Stage Balloons", image: "/images/balloons-blue.jpg" },
  { name: "Animators", label: "Interactive Animators", image: "/images/party-hats.jpg" },
  { name: "Flowers", label: "Custom Flowers", image: "/images/flowers-roses.jpg" },
  { name: "Cakes", label: "Custom Cakes", image: "/images/cupcakes.jpg" },
  { name: "Stage Balloons", label: "Stage Balloons", image: "/images/party-balloons2.jpg" },
  { name: "Animators", label: "Interactive Animators", image: "/images/party-hats.jpg" },
  { name: "Flowers", label: "Custom Flowers", image: "/images/flowers-roses.jpg" },
];

const GALLERY_IMAGES = [
  "/images/wedding-cake.jpg", "/images/wedding-cake2.jpg", "/images/cupcakes.jpg", "/images/cookies-box.jpg",
  "/images/cookies-box2.jpg", "/images/wedding-cake.jpg", "/images/cupcakes.jpg", "/images/wedding-cake2.jpg",
  "/images/wedding-cake.jpg", "/images/cookies-box.jpg", "/images/cupcakes.jpg", "/images/wedding-cake2.jpg",
  "/images/cookies-box2.jpg", "/images/wedding-cake.jpg", "/images/wedding-cake2.jpg", "/images/cupcakes.jpg",
];

const HOURS = [
  { day: "Tuesday", h: "8:00AM – 10:00PM", open: true },
  { day: "Wednesday", h: "8:00AM – 10:00PM", open: true },
  { day: "Thursday", h: "8:00AM – 10:00PM", open: true },
  { day: "Friday", h: "8:00AM – 10:00PM", open: true },
  { day: "Saturday", h: "8:00AM – 10:00PM", open: true },
  { day: "Sunday", h: "Closed", open: false },
  { day: "Monday", h: "8:00AM – 10:00PM", open: true },
];

/* ─── Reviews Modal ─── */
function ReviewsModal({ onClose }) {
  const [sort, setSort] = useState("recent");
  const [helpful, setHelpful] = useState({});
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  const allReviews = [
    ...REVIEWS,
    { name: "Emily Clarke", initial: "E", color: "bg-brand-500", text: "Stunning! Everyone at the party was amazed. The detail work was exceptional.", rating: 5, date: "3 weeks ago", hasPhotos: true, tags: ["Beautiful", "Delicious"], helpful: 31 },
    { name: "James Whitfield", initial: "J", color: "bg-accent-400", text: "Second time ordering and they never disappoint. Super professional.", rating: 5, date: "1 month ago", hasPhotos: false, tags: ["Communication"], helpful: 17 },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[540px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100 flex-shrink-0">
          <h2 className="font-display text-[20px] font-bold text-surface-900">Salooote Reviews</h2>
          <button onClick={onClose} className="bg-surface-100 rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer hover:bg-surface-200 transition-colors"><X size={15} className="text-surface-600" /></button>
        </div>
        <div className="flex gap-1 px-5 py-3 border-b border-surface-100 flex-shrink-0">
          {[["recent","RECENT"],["highest","HIGHEST"],["lowest","LOWEST"],["oldest","OLDEST"]].map(([id,label])=>(
            <button key={id} onClick={()=>setSort(id)} className={`px-4 py-2 rounded-xl text-[11px] font-bold tracking-wide border-none cursor-pointer transition-all ${sort===id?"bg-brand-600 text-white":"bg-surface-100 text-surface-500 hover:bg-surface-200"}`}>{label}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allReviews.map((r, i) => (
            <div key={i} className="bg-surface-50 rounded-2xl p-5 border border-surface-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>{r.initial}</div>
                  <div>
                    <p className="font-semibold text-[13px] text-surface-800">{r.name}</p>
                    <p className="text-[10px] text-surface-400">{r.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-brand-500 font-semibold mb-1">{vendor.category}</p>
                  <div className="flex gap-0.5 justify-end">{[...Array(5)].map((_,j)=><Star key={j} size={11} className={j<Math.floor(r.rating)?"fill-warm-500 text-warm-500":"text-surface-200"}/>)}</div>
                </div>
              </div>
              <div className="flex gap-4 mb-3 flex-wrap">
                {["Timeliness","Quality","Professionalism"].map(attr=>(
                  <div key={attr} className="flex items-center gap-1">
                    <span className="text-[10px] text-surface-400">{attr}</span>
                    <Star size={9} className="fill-warm-500 text-warm-500"/><span className="text-[10px] font-bold text-surface-600">5.0</span>
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-surface-600 leading-relaxed mb-3">{r.text}</p>
              {r.hasPhotos && (
                <div className="flex gap-2">
                  {["/images/cupcakes.jpg","/images/wedding-cake.jpg","/images/flowers-roses.jpg","/images/balloons-blue.jpg"].map((src,j)=>(
                    <div key={j} className="w-14 h-14 rounded-xl overflow-hidden relative border border-surface-200">
                      <Image src={src} alt="" fill className="object-cover"/>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-3">
                <button onClick={()=>setHelpful(p=>({...p,[i]:!p[i]}))} className={`flex items-center gap-1.5 text-[11px] font-medium border rounded-xl px-3 py-1.5 cursor-pointer transition-all ${helpful[i]?"bg-brand-50 text-brand-600 border-brand-200":"bg-transparent text-surface-400 border-surface-200 hover:border-brand-200"}`}>
                  <ThumbsUp size={11}/> Helpful ({(r.helpful||0)+(helpful[i]?1:0)})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Location Modal ─── */
function LocationModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[460px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 flex-shrink-0">
          <h2 className="font-semibold text-[15px] text-surface-900">Salooote Location & Business details</h2>
          <button onClick={onClose} className="bg-surface-100 rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer hover:bg-surface-200"><X size={15} className="text-surface-600"/></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Map placeholder */}
          <div className="h-[200px] relative overflow-hidden bg-blue-50">
            <div className="absolute inset-0" style={{backgroundImage:`repeating-linear-gradient(0deg,#cbd5e1 0,#cbd5e1 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#cbd5e1 0,#cbd5e1 1px,transparent 0,transparent 40px)`,backgroundSize:"40px 40px",opacity:0.4}}/>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-elevated border border-surface-100 max-w-[240px]">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-accent-500 flex-shrink-0 mt-0.5"/>
                  <p className="text-[11px] text-surface-600 font-medium leading-snug">{vendor.address}<br/>Yerevan | ~2,629.26 km</p>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full -mt-6">
              <div className="w-5 h-5 bg-accent-500 rounded-full border-2 border-white shadow-md"/>
            </div>
          </div>
          <div className="p-5 border-b border-surface-100">
            <div className="flex items-start gap-2 mb-3"><MapPin size={14} className="text-surface-400 flex-shrink-0 mt-0.5"/><p className="text-[13px] text-surface-600">{vendor.address}, Yerevan | ~2,629.26 km</p></div>
            {vendor.phone.map((p,i)=>(
              <div key={i} className="flex items-center gap-2 mb-1.5"><Phone size={13} className="text-surface-400 flex-shrink-0"/><a href={`tel:${p}`} className="text-[13px] text-brand-600 font-medium no-underline hover:underline">{p}</a></div>
            ))}
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">Open Now</span>
            </div>
            <div className="space-y-0">
              {HOURS.map(({day,h,open})=>(
                <div key={day} className="flex justify-between py-2.5 border-b border-surface-50 last:border-none">
                  <span className="text-[13px] text-surface-600 font-medium">{day}</span>
                  <span className={`text-[13px] font-semibold ${open?"text-surface-800":"text-surface-400"}`}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Modal ─── */
function GalleryModal({ service, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  const visibleCount = 8;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-transparent w-full max-w-[700px]">
        <button onClick={onClose} className="absolute -top-10 right-0 bg-white/20 rounded-full w-9 h-9 flex items-center justify-center border-none cursor-pointer hover:bg-white/30 z-10"><X size={16} className="text-white"/></button>
        <div className="relative rounded-3xl overflow-hidden">
          <div className="grid grid-cols-4 gap-1 bg-surface-900">
            {GALLERY_IMAGES.slice(0, 16).map((src, i) => (
              <div key={i} className={`relative ${i < 4 ? "h-[140px]" : "h-[120px]"} overflow-hidden`}>
                <Image src={src} alt="" fill className="object-cover"/>
              </div>
            ))}
          </div>
          {/* Blur overlay with CTA */}
          <div className="absolute bottom-0 left-0 right-0 h-[240px] flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/95 via-surface-900/70 to-transparent backdrop-blur-[2px]"/>
            <div className="relative z-10 p-8 w-full">
              <h3 className="font-display text-[26px] font-bold text-white mb-1">Wanna See More?</h3>
              <p className="text-white/70 text-[13px] mb-5">Sign Up today to view more photos.</p>
              <Link href="/signup" onClick={onClose}>
                <button className="bg-brand-600 text-white border-none rounded-2xl px-7 py-3 text-[13px] font-semibold cursor-pointer hover:bg-brand-700 transition-all shadow-glow">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function VendorPage() {
  const [mainTab, setMainTab] = useState("products");
  const [productCat, setProductCat] = useState("All");
  const [showReviews, setShowReviews] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [gallery, setGallery] = useState(null);

  const products = [...SAMPLE_PRODUCTS, ...SAMPLE_PRODUCTS].slice(0, 12).map((p, i) => ({ ...p, id: i + 1 }));

  return (
    <div className="min-h-screen bg-surface-50">

      {/* ── Cover ── */}
      <div className="relative h-[210px] overflow-hidden">
        <Image src={vendor.cover} alt="Cover" fill className="object-cover object-center" priority/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"/>
        <div className="absolute top-4 left-5">
          <Link href="/products" className="flex items-center gap-1.5 bg-white text-surface-700 rounded-xl px-3.5 py-2 text-[12px] font-semibold no-underline shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={13}/> Back
          </Link>
        </div>
        <div className="absolute top-4 right-5 flex gap-2">
          <button className="bg-white text-surface-700 rounded-xl px-3.5 py-2 text-[12px] font-semibold border-none cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-1.5">
            <Heart size={13} className="text-accent-400"/> Save
          </button>
          <button className="bg-white text-surface-700 rounded-xl px-3.5 py-2 text-[12px] font-semibold border-none cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-1.5">
            <Share2 size={13}/> Share
          </button>
        </div>
        {/* Avatar anchored to bottom of cover */}
        <div className="absolute bottom-[-40px] left-6 md:left-10 w-[82px] h-[82px] rounded-2xl overflow-hidden border-4 border-white shadow-elevated z-10 bg-white">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50">
            <span className="font-display text-[18px] font-bold italic text-brand-700">Salo</span>
          </div>
        </div>
      </div>

      {/* ── Profile section ── */}
      <div className="bg-white border-b border-surface-200 shadow-soft">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 pt-14 pb-5">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="font-display text-[26px] font-bold text-surface-900">{vendor.name}</h1>
                <span className="bg-brand-600 text-white text-[10px] rounded-full px-2.5 py-0.5 font-bold">Top rated</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${vendor.isOpen?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>
                  {vendor.isOpen ? "Open Now" : "Closed"}
                  {vendor.isOpen && ` (Opens at 8:00AM)`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex gap-0.5">{[...Array(5)].map((_,i)=><Star key={i} size={12} className={i<Math.floor(vendor.rating)?"fill-warm-500 text-warm-500":"text-surface-200"}/>)}</div>
                <span className="text-[12px] font-bold text-surface-700">{vendor.rating}</span>
                <button onClick={()=>setShowReviews(true)} className="text-[12px] text-surface-400 border-none bg-transparent cursor-pointer hover:text-brand-600 transition-colors">({vendor.reviewCount})</button>
              </div>
              <p className="text-surface-500 text-[12.5px] leading-relaxed mb-3 max-w-[640px]">{vendor.bio}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <button onClick={()=>setShowLocation(true)} className="flex items-center gap-1.5 text-[12px] text-surface-500 border-none bg-transparent cursor-pointer hover:text-brand-600 transition-colors">
                  <MapPin size={13} className="text-surface-400"/>{vendor.address}
                </button>
                <div className="flex items-center gap-3">
                  {vendor.phone.map((p,i)=>(
                    <a key={i} href={`tel:${p}`} className="flex items-center gap-1 text-[12px] text-brand-600 no-underline font-medium"><Phone size={12}/>{p}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 flex-shrink-0 mt-1">
              <button className="bg-[#25D366] text-white border-none rounded-2xl px-5 py-3 text-[13px] font-semibold cursor-pointer flex items-center gap-2 hover:bg-[#20bd5a] transition-all shadow-sm">
                <MessageCircle size={15}/> Chat now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="flex gap-0">
            {[["products","PRODUCTS"],["catalog","BUSINESS CATALOG"]].map(([id,label])=>(
              <button key={id} onClick={()=>setMainTab(id)}
                className={`px-6 py-3.5 text-[12.5px] font-bold border-none cursor-pointer tracking-wide transition-all ${mainTab===id?"text-brand-600 border-b-2 border-brand-600 -mb-px bg-transparent":"text-surface-400 bg-transparent hover:text-surface-700"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-8">

        {/* PRODUCTS TAB */}
        {mainTab === "products" && (
          <div className="flex gap-7">
            {/* Sidebar */}
            <aside className="w-[190px] flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-2xl p-5 border border-surface-100 shadow-soft sticky top-24 space-y-5">
                {/* Price */}
                <div>
                  <div className="flex items-center justify-between mb-3"><p className="text-[13px] font-semibold text-surface-700">Price</p><ChevronDown size={13} className="text-surface-400"/></div>
                  <div className="flex gap-2 mb-3">
                    <input placeholder="Min" className="w-full border border-surface-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-brand-400"/>
                    <input placeholder="Max" className="w-full border border-surface-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-brand-400"/>
                  </div>
                  <div className="h-1 bg-surface-100 rounded-full relative">
                    <div className="absolute left-[15%] right-[25%] top-0 h-full bg-brand-500 rounded-full"/>
                    <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full cursor-pointer shadow-sm"/>
                    <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full cursor-pointer shadow-sm"/>
                  </div>
                </div>
                {/* Container */}
                <div>
                  <div className="flex items-center justify-between mb-2"><p className="text-[13px] font-semibold text-surface-700">Container</p><ChevronDown size={13} className="text-surface-400"/></div>
                  {["Clay vase","Basket","Box"].map(c=>(
                    <label key={c} className="flex items-center gap-2 py-1 cursor-pointer"><input type="checkbox" className="accent-brand-600 w-3.5 h-3.5"/><span className="text-[12px] text-surface-600">{c}</span></label>
                  ))}
                </div>
                {/* Color */}
                <div>
                  <div className="flex items-center justify-between mb-2"><p className="text-[13px] font-semibold text-surface-700">Color</p><ChevronDown size={13} className="text-surface-400"/></div>
                  {["Multicolored","Beige","Yellow","Green","Blue","Red"].map(c=>(
                    <label key={c} className="flex items-center gap-2 py-1 cursor-pointer"><input type="checkbox" className="accent-brand-600 w-3.5 h-3.5"/><span className="text-[12px] text-surface-600">{c}</span></label>
                  ))}
                  <button className="text-[11px] text-brand-600 font-semibold mt-1 border-none bg-transparent cursor-pointer">show more</button>
                </div>
                {/* Type */}
                <div>
                  <div className="flex items-center justify-between mb-2"><p className="text-[13px] font-semibold text-surface-700">Type</p><ChevronDown size={13} className="text-surface-400"/></div>
                  {["Bouquet","Arrangement","Sweet arrangement"].map(c=>(
                    <label key={c} className="flex items-center gap-2 py-1 cursor-pointer"><input type="checkbox" className="accent-brand-600 w-3.5 h-3.5"/><span className="text-[12px] text-surface-600">{c}</span></label>
                  ))}
                </div>
                {/* Sort */}
                <div>
                  <div className="flex items-center justify-between mb-2"><p className="text-[13px] font-semibold text-surface-700">Sort</p><ChevronDown size={13} className="text-surface-400"/></div>
                  {["Armenian","Antimuryam","Sunflower","Lavender","Gypsophila"].map((s,i)=>(
                    <label key={s} className="flex items-center gap-2 py-1 cursor-pointer"><input type="radio" name="vsort" defaultChecked={i===0} className="accent-brand-600 w-3.5 h-3.5"/><span className="text-[12px] text-surface-600">{s}</span></label>
                  ))}
                  <button className="text-[11px] text-brand-600 font-semibold mt-1 border-none bg-transparent cursor-pointer">show more</button>
                </div>
              </div>
            </aside>

            {/* Product area */}
            <div className="flex-1 min-w-0">
              {/* Category tabs + sort */}
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {PRODUCT_CATS.map(cat=>(
                    <button key={cat} onClick={()=>setProductCat(cat)}
                      className={`px-4 py-2 rounded-full text-[11.5px] font-semibold border flex-shrink-0 cursor-pointer transition-all ${productCat===cat?"bg-brand-600 text-white border-brand-600":"bg-white text-surface-600 border-surface-200 hover:border-brand-300"}`}>
                      {cat==="All"?"ALL CAKES":cat.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-surface-600 border border-surface-200 rounded-xl px-3.5 py-2 bg-white hover:border-brand-300 transition-all cursor-pointer">
                  ↕ TRENDING
                </button>
              </div>

              <h2 className="font-display text-[18px] font-bold text-surface-800 mb-5">
                {productCat === "All" ? "All Products" : productCat}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {products.map((p,i)=><ProductCard key={i} product={p}/>)}
              </div>

              <div className="text-center">
                <button className="bg-white border border-surface-200 rounded-2xl px-8 py-3 text-[13px] font-semibold text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all cursor-pointer">
                  Load more
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS CATALOG TAB */}
        {mainTab === "catalog" && (
          <div className="max-w-[900px]">
            <h2 className="font-display text-[22px] font-bold text-surface-900 mb-4">About Business</h2>
            <p className="text-surface-500 text-[14px] leading-relaxed mb-10 max-w-[700px]">{vendor.bio}</p>

            <h2 className="font-display text-[22px] font-bold text-surface-900 mb-6">Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {SERVICES.map((svc, i) => (
                <button key={i} onClick={()=>setGallery(svc)} className="relative h-[160px] rounded-2xl overflow-hidden group cursor-pointer border-none p-0">
                  <Image src={svc.image} alt={svc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <p className="text-[10px] text-white/70 font-medium">{svc.label}</p>
                    <p className="text-[13px] font-bold text-white">{svc.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popups */}
      {showReviews && <ReviewsModal onClose={()=>setShowReviews(false)}/>}
      {showLocation && <LocationModal onClose={()=>setShowLocation(false)}/>}
      {gallery && <GalleryModal service={gallery} onClose={()=>setGallery(null)}/>}
    </div>
  );
}
