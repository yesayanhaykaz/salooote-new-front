"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { vendorsAPI, productsAPI, categoriesAPI } from "@/lib/api";
import {
  Star, MapPin, Phone, MessageCircle,
  Heart, Share2, ArrowLeft, X, Package,
  Calendar, Clock, Globe, Instagram, Facebook, Images
} from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function parseHours(raw) {
  if (!raw) return { hours: [], isOpen: false, openUntil: "" };
  let wh = raw;
  if (typeof wh === "string") { try { wh = JSON.parse(wh); } catch { return { hours: [], isOpen: false, openUntil: "" }; } }
  const now = new Date();
  const todayName = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const hours = DAYS.map(day => {
    const d = wh[day];
    if (!d || !d.enabled) return { day, h: "Closed", open: false };
    return { day, h: `${d.open} – ${d.close}`, open: true, openTime: d.open, closeTime: d.close };
  });

  const todayEntry = hours.find(h => h.day === todayName);
  let isOpen = false, openUntil = "";
  if (todayEntry?.open && todayEntry.closeTime) {
    const [ch, cm] = todayEntry.closeTime.split(":").map(Number);
    const closeMins = ch * 60 + cm;
    const [oh, om] = todayEntry.openTime.split(":").map(Number);
    const openMins = oh * 60 + om;
    isOpen = nowMins >= openMins && nowMins < closeMins;
    openUntil = todayEntry.closeTime;
  }
  return { hours, isOpen, openUntil };
}

export default function VendorProfileClient({ lang = "en", slug }) {
  const [vendorData, setVendorData]   = useState(null);
  const [products, setProducts]       = useState([]);
  const [vendorCats, setVendorCats]   = useState([]); // vendor's assigned categories
  const [loading, setLoading]         = useState(true);
  const [mainTab, setMainTab]         = useState("products");
  const [activeCat, setActiveCat]     = useState("all");
  const [lightbox, setLightbox]       = useState(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    vendorsAPI.getBySlug(slug).catch(() => null).then(async vRes => {
      if (!vRes?.data) return;
      const vendor = vRes.data;
      setVendorData(vendor);

      // Fetch products + vendor categories in parallel
      const [pRes, cRes] = await Promise.all([
        productsAPI.list({ vendor_id: vendor.id, limit: 50, locale: lang }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendor.id}/categories`).then(r => r.json()).catch(() => null),
      ]);

      const raw = pRes?.data || [];
      setProducts(raw.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug || "",
        vendor_id: vendor.id,
        vendor_slug: vendor.slug || "",
        price: parseFloat(p.price) || 0,
        originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
        rating: parseFloat(p.rating) || 0,
        reviews: p.review_count || 0,
        vendor: vendor.business_name || "",
        vendor_name: vendor.business_name || "",
        image: p.thumbnail_url || p.images?.[0]?.url || null,
        tags: p.tags || [],
        gradient: "from-brand-50 to-brand-100",
      })));

      // Only show categories the vendor is registered in (no product-level filtering needed)
      const cats = cRes?.data || cRes || [];
      setVendorCats(Array.isArray(cats) ? cats : []);
    }).finally(() => setLoading(false));
  }, [slug, lang]);

  // Gallery images
  const galleryImages = (() => {
    if (!vendorData?.gallery_images) return [];
    try {
      const g = typeof vendorData.gallery_images === "string"
        ? JSON.parse(vendorData.gallery_images)
        : vendorData.gallery_images;
      return Array.isArray(g) ? g : [];
    } catch { return []; }
  })();

  // Tabs: products (if any) + gallery (if any)
  const mainTabs = [
    products.length > 0 && "products",
    galleryImages.length > 0 && "gallery",
    "info",
  ].filter(Boolean);

  const parsedHours = vendorData ? parseHours(vendorData.working_hours) : { hours: [], isOpen: false, openUntil: "" };

  const v = vendorData ? {
    name: vendorData.business_name || vendorData.first_name || "Vendor",
    category: vendorData.category_name || "Events",
    rating: vendorData.avg_rating || 4.8,
    reviewCount: vendorData.total_reviews || 0,
    sales: vendorData.total_orders ? `${vendorData.total_orders}` : "—",
    location: vendorData.city ? `${vendorData.city}, Armenia` : "Yerevan, Armenia",
    address: vendorData.address || "Yerevan",
    phone: vendorData.phone ? [vendorData.phone] : [],
    since: vendorData.created_at ? new Date(vendorData.created_at).getFullYear().toString() : "2020",
    isOpen: parsedHours.isOpen,
    openUntil: parsedHours.openUntil,
    hours: parsedHours.hours,
    cover: vendorData.banner_url || "/images/party-balloons2.jpg",
    logo: vendorData.logo_url || null,
    bio: vendorData.description || "",
    facebook: vendorData.facebook_url || "",
    instagram: vendorData.instagram_url || "",
    website: vendorData.website || "",
  } : {
    name: slug ? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Vendor",
    category: "Events",
    rating: 4.8,
    reviewCount: 0,
    sales: "—",
    location: "Yerevan, Armenia",
    address: "Yerevan",
    phone: [],
    since: "2020",
    isOpen: false,
    openUntil: "",
    hours: [],
    cover: "/images/party-balloons2.jpg",
    logo: null,
    bio: "",
    facebook: "",
    instagram: "",
    website: "",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <p className="text-sm text-surface-400">Loading vendor…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">

      {/* ── Cover ── */}
      <div className="bg-white pt-5 pb-0">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <div className="relative h-[220px] md:h-[260px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image src={v.cover} alt="Cover" fill className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            <div className="absolute top-4 left-4 z-10">
              <Link href={`/${lang}/products`} className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium no-underline hover:bg-white transition-all">
                <ArrowLeft size={15} /> Back
              </Link>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium border-none cursor-pointer hover:bg-white transition-all flex items-center gap-1.5">
                <Heart size={14} className="text-accent-400" /> Save
              </button>
              <button className="bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-4 py-2 text-sm font-medium border-none cursor-pointer hover:bg-white transition-all flex items-center gap-1.5">
                <Share2 size={14} /> Share
              </button>
            </div>

            <div className="absolute bottom-0 left-6 translate-y-1/2 z-20 w-[84px] h-[84px] rounded-2xl bg-white border-[3px] border-white flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>
              {v.logo ? (
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <Image src={v.logo} alt={v.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <span className="text-xl font-bold italic text-brand-700">{v.name.slice(0, 4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-container mx-auto px-6 md:px-8 pt-14 pb-0">
          <div className="flex items-start justify-between gap-6 flex-wrap mb-5">
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-surface-900">{v.name}</h1>
                {v.rating >= 4.5 && <span className="bg-brand-600 text-white text-xs rounded-full px-2.5 py-0.5 font-semibold">Top Rated</span>}
                {v.isOpen !== null && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${v.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {v.isOpen ? `Open · until ${v.openUntil}` : "Closed"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(v.rating) ? "fill-warm-400 text-warm-400" : "fill-surface-200 text-surface-200"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-surface-800">{v.rating.toFixed ? v.rating.toFixed(1) : v.rating}</span>
                <span className="text-sm text-surface-400">({v.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-surface-500 flex-wrap mb-3">
                <span className="flex items-center gap-1.5"><Package size={13} className="text-surface-400" />{v.category}</span>
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-surface-400" />{v.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} className="text-surface-400" />Since {v.since}</span>
              </div>

              {v.bio ? (
                <div
                  className="text-sm text-surface-500 leading-relaxed max-w-[600px] prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: v.bio }}
                />
              ) : null}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-col items-center text-center px-5 py-3 bg-surface-50 rounded-xl">
                <p className="text-xl font-bold text-surface-900">{v.rating.toFixed ? v.rating.toFixed(1) : v.rating}</p>
                <p className="text-xs text-surface-400">Rating</p>
              </div>
              <div className="flex flex-col items-center text-center px-5 py-3 bg-surface-50 rounded-xl">
                <p className="text-xl font-bold text-surface-900">{v.reviewCount}</p>
                <p className="text-xs text-surface-400">Reviews</p>
              </div>
              <div className="flex flex-col items-center text-center px-5 py-3 bg-surface-50 rounded-xl">
                <p className="text-xl font-bold text-surface-900">{products.length}</p>
                <p className="text-xs text-surface-400">Products</p>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex items-center gap-4 pb-5 flex-wrap">
            {v.phone.map((p, i) => (
              <a key={i} href={`tel:${p}`} className="flex items-center gap-1.5 text-sm text-surface-600 no-underline hover:text-brand-600 transition-colors">
                <Phone size={14} className="text-surface-400" />{p}
              </a>
            ))}
            {(v.facebook || v.instagram || v.website) && (
              <div className="flex items-center gap-3">
                {v.website && (
                  <a href={v.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-brand-600 no-underline">
                    <Globe size={14} /> Website
                  </a>
                )}
                {v.instagram && (
                  <a href={`https://instagram.com/${v.instagram.replace(/^@/, '').replace(/.*instagram\.com\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-brand-600 no-underline">
                    <Instagram size={14} /> Instagram
                  </a>
                )}
                {v.facebook && (
                  <a href={v.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-brand-600 no-underline">
                    <Facebook size={14} /> Facebook
                  </a>
                )}
              </div>
            )}
            <button className="ml-auto flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
              <MessageCircle size={15} /> Message Vendor
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-surface-100 -mx-8 px-8">
            {mainTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`px-4 py-3 text-sm font-semibold border-none bg-transparent cursor-pointer capitalize border-b-2 transition-colors ${mainTab === tab ? "border-brand-600 text-brand-600" : "border-transparent text-surface-500 hover:text-surface-900"}`}
              >
                {tab === "products" ? `Products (${products.length})`
                  : tab === "gallery" ? `Gallery (${galleryImages.length})`
                  : "Info"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-container mx-auto px-6 md:px-8 py-8">

        {mainTab === "products" && (
          <>
            {/* Category filter tabs — only shown when vendor has multiple categories */}
            {vendorCats.length > 1 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <button
                  onClick={() => setActiveCat("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${activeCat === "all" ? "bg-brand-600 text-white border-brand-600" : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"}`}
                >
                  All
                </button>
                {vendorCats.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${activeCat === cat.id ? "bg-brand-600 text-white border-brand-600" : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
            {products.length === 0 ? (
              <p className="text-sm text-surface-400 text-center py-16">No products yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p, i) => <ProductCard key={i} product={p} lang={lang} />)}
              </div>
            )}
          </>
        )}

        {mainTab === "gallery" && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {galleryImages.map((img, i) => {
              const src = img?.url || img?.image_url || (typeof img === "string" ? img : null);
              if (!src) return null;
              return (
                <button
                  key={i}
                  onClick={() => setLightbox(src)}
                  className="relative aspect-square rounded-2xl overflow-hidden border-none cursor-pointer group bg-surface-100"
                >
                  <Image src={src} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </button>
              );
            })}
          </div>
        )}

        {mainTab === "info" && (
          <div className="max-w-[600px] space-y-6">
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Clock size={15} /> Business Hours</h3>
              {v.hours.length === 0 ? (
                <p className="text-sm text-surface-400">No hours set.</p>
              ) : (
                v.hours.map(h => (
                  <div key={h.day} className="flex items-center justify-between py-2.5 border-b border-surface-50 last:border-0">
                    <span className="text-sm font-medium text-surface-700">{h.day}</span>
                    <span className={`text-sm ${h.open ? "text-surface-600" : "text-red-500"}`}>{h.h}</span>
                  </div>
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h3 className="font-semibold text-surface-900 mb-3 flex items-center gap-2"><MapPin size={15} /> Location</h3>
              <p className="text-sm text-surface-600">{v.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 bg-white/20 border-none text-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/30 transition-colors">
            <X size={18} />
          </button>
          <div className="relative w-full max-w-[860px] h-[560px]">
            <Image src={lightbox} alt="" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
