"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { vendorsAPI, productsAPI, userAPI, inquiriesAPI, isLoggedIn } from "@/lib/api";
import { categoriesAPI } from "@/lib/api";
import {
  Star, MapPin, Phone, MessageCircle,
  Heart, Share2, ArrowLeft, X, Package,
  Calendar, Clock, Globe, Instagram, Facebook,
  Send, Loader2, Check,
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
    if (!d || !d.enabled) return { day, h: null, open: false };
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

export default function VendorProfileClient({ lang = "en", slug, dict }) {
  const v = dict?.vendor || {};
  const days = dict?.days || {};

  const [vendorData, setVendorData]   = useState(null);
  const [products, setProducts]       = useState([]);
  const [vendorCats, setVendorCats]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [mainTab, setMainTab]         = useState("products");
  const [activeCat, setActiveCat]     = useState("all");
  const [lightbox, setLightbox]       = useState(null);

  const [savedId, setSavedId]         = useState(null);
  const [savingState, setSavingState] = useState("idle");
  const [shareCopied, setShareCopied] = useState(false);

  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgText, setMsgText]          = useState("");
  const [msgSending, setMsgSending]    = useState(false);
  const [msgSent, setMsgSent]          = useState(false);
  const [msgError, setMsgError]        = useState("");

  useEffect(() => {
    if (!isLoggedIn() || !vendorData?.id) return;
    userAPI.saved({ limit: 100 })
      .then(res => {
        const found = (res?.data || []).find(
          s => s.target_type === "vendor" && s.target_id === vendorData.id
        );
        if (found) setSavedId(found.id);
      })
      .catch(() => {});
  }, [vendorData?.id]);

  const handleSave = async () => {
    if (!isLoggedIn()) {
      window.location.href = `/${lang}/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setSavingState("saving");
    try {
      if (savedId) {
        await userAPI.unsaveItem(savedId);
        setSavedId(null);
      } else {
        const res = await userAPI.saveItem("vendor", vendorData.id);
        setSavedId(res?.data?.id || res?.id || "saved");
      }
      setSavingState("idle");
    } catch {
      setSavingState("idle");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: vendorData?.business_name || slug, url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }).catch(() => {});
    }
  };

  const handleSendMessage = async () => {
    if (!msgText.trim()) return;
    if (!isLoggedIn()) {
      window.location.href = `/${lang}/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setMsgSending(true);
    setMsgError("");
    try {
      await inquiriesAPI.create({
        vendor_id: vendorData.id,
        subject: `${v.inquirySubject || "Inquiry about"} ${vendorData.business_name || slug}`,
        message: msgText.trim(),
      });
      setMsgSent(true);
      setMsgText("");
    } catch (err) {
      setMsgError(err.message || v.msgError || "Failed to send. Please try again.");
    } finally {
      setMsgSending(false);
    }
  };

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    vendorsAPI.getBySlug(slug).catch(() => null).then(async vRes => {
      if (!vRes?.data) return;
      const vendor = vRes.data;
      setVendorData(vendor);

      const [pRes, cRes] = await Promise.all([
        productsAPI.list({ vendor_id: vendor.id, limit: 500, locale: lang }).catch(() => null),
        categoriesAPI.list(lang).catch(() => null),
      ]);

      const raw = pRes?.data || [];
      const allCats = cRes || [];

      const mapped = raw.map(prod => ({
        id: prod.id,
        name: prod.name,
        slug: prod.slug || "",
        vendor_id: vendor.id,
        vendor_slug: vendor.slug || "",
        category_id: prod.category_id || null,
        category_ids: prod.category_ids?.length > 0
          ? prod.category_ids
          : (prod.category_id ? [prod.category_id] : []),
        price: parseFloat(prod.price) || 0,
        originalPrice: prod.compare_price ? parseFloat(prod.compare_price) : null,
        rating: parseFloat(prod.rating) || 0,
        reviews: prod.review_count || 0,
        vendor: vendor.business_name || "",
        vendor_name: vendor.business_name || "",
        image: prod.thumbnail_url || prod.images?.[0]?.url || null,
        tags: prod.tags || [],
        gradient: "from-brand-50 to-brand-100",
      }));
      setProducts(mapped);

      const usedCatIds = [...new Set(mapped.flatMap(prod => prod.category_ids))].filter(Boolean);
      const flatCats = allCats.flatMap(c => [c, ...(c.children || [])]);
      const vendorCategories = usedCatIds
        .map(id => flatCats.find(c => c.id === id))
        .filter(Boolean);
      setVendorCats(vendorCategories);
    }).finally(() => setLoading(false));
  }, [slug, lang]);

  const galleryImages = (() => {
    if (!vendorData?.gallery_images) return [];
    try {
      const g = typeof vendorData.gallery_images === "string"
        ? JSON.parse(vendorData.gallery_images)
        : vendorData.gallery_images;
      return Array.isArray(g) ? g : [];
    } catch { return []; }
  })();

  const mainTabs = [
    products.length > 0 && "products",
    galleryImages.length > 0 && "gallery",
    "info",
  ].filter(Boolean);

  const parsedHours = vendorData ? parseHours(vendorData.working_hours) : { hours: [], isOpen: false, openUntil: "" };

  const vd = vendorData ? {
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

  const ratingNum = typeof vd.rating === "number" ? vd.rating : parseFloat(vd.rating) || 0;
  const openUntilLabel = (v.openUntil || "Open · until {time}").replace("{time}", vd.openUntil);

  if (loading) {
    return (
      <div className="py-24 bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-surface-400">{v.loading || "Loading vendor…"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50">

      {/* ── Cover ── */}
      <div className="bg-white pt-3 sm:pt-5 pb-0">
        <div className="max-w-container mx-auto px-3 sm:px-6 md:px-8">
          <div className="relative h-[200px] sm:h-[240px] md:h-[280px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image src={vd.cover} alt="Cover" fill className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
            </div>

            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
              <Link
                href={`/${lang}/products`}
                className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium no-underline hover:bg-white transition-all"
              >
                <ArrowLeft size={14} /> {v.back || "Back"}
              </Link>
            </div>

            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex gap-2">
              <button
                onClick={handleSave}
                aria-label={savedId ? (v.savedLabel || "Saved") : (v.save || "Save")}
                className={`backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-none cursor-pointer transition-all flex items-center gap-1.5 ${
                  savedId ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-white/90 text-surface-700 hover:bg-white"
                }`}
              >
                <Heart size={13} className={savedId ? "fill-white text-white" : "text-brand-500"} />
                <span className="hidden xs:inline">{savedId ? (v.savedLabel || "Saved") : (v.save || "Save")}</span>
              </button>
              <button
                onClick={handleShare}
                aria-label={v.share || "Share"}
                className="bg-white/90 backdrop-blur-sm text-surface-700 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-none cursor-pointer hover:bg-white transition-all flex items-center gap-1.5"
              >
                {shareCopied
                  ? <><Check size={13} className="text-emerald-600" /> <span className="hidden xs:inline">{v.copied || "Copied!"}</span></>
                  : <><Share2 size={13} /> <span className="hidden xs:inline">{v.share || "Share"}</span></>}
              </button>
            </div>

            <div className="absolute bottom-0 left-4 sm:left-6 translate-y-1/2 z-20 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-2xl bg-white border-[3px] border-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
              {vd.logo ? (
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <Image src={vd.logo} alt={vd.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <span className="text-base sm:text-xl font-bold italic text-brand-700">{vd.name.slice(0, 4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-container mx-auto px-3 sm:px-6 md:px-8 pt-12 sm:pt-14 pb-0">
          <div className="flex items-start justify-between gap-4 sm:gap-6 flex-wrap mb-5">
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-surface-900">{vd.name}</h1>
                {ratingNum >= 4.5 && (
                  <span className="bg-brand-600 text-white text-[11px] rounded-full px-2.5 py-0.5 font-semibold">{v.topRated || "Top Rated"}</span>
                )}
                {vd.isOpen !== null && (
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${vd.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {vd.isOpen ? openUntilLabel : (v.closed || "Closed")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(ratingNum) ? "fill-warm-400 text-warm-400" : "fill-surface-200 text-surface-200"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-surface-800">{ratingNum.toFixed(1)}</span>
                <span className="text-sm text-surface-400">({vd.reviewCount} {v.reviewsLabel?.toLowerCase() || "reviews"})</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-surface-500 flex-wrap mb-3">
                <span className="flex items-center gap-1.5"><Package size={13} className="text-surface-400" />{vd.category}</span>
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-surface-400" />{vd.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} className="text-surface-400" />{v.since || "Since"} {vd.since}</span>
              </div>

              {vd.bio ? (
                <div
                  className="text-sm text-surface-500 leading-relaxed max-w-[600px] prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: vd.bio }}
                />
              ) : null}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex flex-col items-center text-center px-4 sm:px-5 py-2.5 sm:py-3 bg-surface-50 rounded-xl">
                <p className="text-lg sm:text-xl font-bold text-surface-900">{ratingNum.toFixed(1)}</p>
                <p className="text-[11px] text-surface-400">{v.ratingLabel || "Rating"}</p>
              </div>
              <div className="flex flex-col items-center text-center px-4 sm:px-5 py-2.5 sm:py-3 bg-surface-50 rounded-xl">
                <p className="text-lg sm:text-xl font-bold text-surface-900">{vd.reviewCount}</p>
                <p className="text-[11px] text-surface-400">{v.reviewsLabel || "Reviews"}</p>
              </div>
              <div className="flex flex-col items-center text-center px-4 sm:px-5 py-2.5 sm:py-3 bg-surface-50 rounded-xl">
                <p className="text-lg sm:text-xl font-bold text-surface-900">{products.length}</p>
                <p className="text-[11px] text-surface-400">{v.productsLabel || "Products"}</p>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex items-center gap-3 sm:gap-4 pb-5 flex-wrap">
            {vd.phone.map((ph, i) => (
              <a key={i} href={`tel:${ph}`} className="flex items-center gap-1.5 text-sm text-surface-600 no-underline hover:text-brand-600 transition-colors">
                <Phone size={14} className="text-surface-400" />{ph}
              </a>
            ))}
            {(vd.facebook || vd.instagram || vd.website) && (
              <div className="flex items-center gap-3 flex-wrap">
                {vd.website && (
                  <a href={vd.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-brand-600 no-underline">
                    <Globe size={14} /> {v.website || "Website"}
                  </a>
                )}
                {vd.instagram && (
                  <a
                    href={`https://instagram.com/${vd.instagram.replace(/^@/, "").replace(/.*instagram\.com\//, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-brand-600 no-underline"
                  >
                    <Instagram size={14} /> {v.instagram || "Instagram"}
                  </a>
                )}
                {vd.facebook && (
                  <a href={vd.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-brand-600 no-underline">
                    <Facebook size={14} /> {v.facebook || "Facebook"}
                  </a>
                )}
              </div>
            )}
            <button
              onClick={() => { setShowMsgModal(true); setMsgSent(false); setMsgError(""); }}
              className="ml-auto flex items-center gap-2 bg-gradient-to-r from-brand-600 to-rose-500 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:from-brand-700 hover:to-rose-600 transition-all shadow-glow"
            >
              <MessageCircle size={15} /> {v.messageVendor || "Message Vendor"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-surface-100 overflow-x-auto hide-scrollbar -mx-3 sm:-mx-8 px-3 sm:px-8">
            {mainTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`px-4 py-3 text-sm font-semibold border-none bg-transparent cursor-pointer border-b-2 transition-colors flex-shrink-0 whitespace-nowrap ${
                  mainTab === tab ? "border-brand-600 text-brand-600" : "border-transparent text-surface-500 hover:text-surface-900"
                }`}
              >
                {tab === "products" ? `${v.tabProducts || "Products"} (${products.length})`
                  : tab === "gallery" ? `${v.tabGallery || "Gallery"} (${galleryImages.length})`
                  : (v.tabInfo || "Info")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-container mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-8">

        {mainTab === "products" && (() => {
          const filtered = activeCat === "all"
            ? products
            : products.filter(prod => (prod.category_ids || []).includes(activeCat) || prod.category_id === activeCat);
          return (
            <>
              {vendorCats.length > 1 && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <button
                    onClick={() => setActiveCat("all")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                      activeCat === "all" ? "bg-brand-600 text-white border-brand-600" : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"
                    }`}
                  >
                    {v.allCategories || "All"} ({products.length})
                  </button>
                  {vendorCats.map(cat => {
                    const count = products.filter(prod => (prod.category_ids || []).includes(cat.id) || prod.category_id === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCat(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                          activeCat === cat.id ? "bg-brand-600 text-white border-brand-600" : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"
                        }`}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
              {filtered.length === 0 ? (
                <p className="text-sm text-surface-400 text-center py-10">{v.noProductsCat || "No products in this category."}</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filtered.map((prod, i) => <ProductCard key={i} product={prod} lang={lang} />)}
                </div>
              )}
            </>
          );
        })()}

        {mainTab === "gallery" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px]">
            <div className="bg-white rounded-2xl border border-surface-200 p-5 sm:p-6">
              <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Clock size={15} className="text-brand-500" /> {v.businessHours || "Business Hours"}</h3>
              {vd.hours.length === 0 ? (
                <p className="text-sm text-surface-400">{v.noHours || "No hours set."}</p>
              ) : (
                vd.hours.map(h => (
                  <div key={h.day} className="flex items-center justify-between py-2.5 border-b border-surface-50 last:border-0">
                    <span className="text-sm font-medium text-surface-700">{days[h.day] || h.day}</span>
                    <span className={`text-sm ${h.open ? "text-surface-600" : "text-red-500"}`}>
                      {h.open ? h.h : (v.closedDay || "Closed")}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="bg-white rounded-2xl border border-surface-200 p-5 sm:p-6">
              <h3 className="font-semibold text-surface-900 mb-3 flex items-center gap-2"><MapPin size={15} className="text-brand-500" /> {v.location || "Location"}</h3>
              <p className="text-sm text-surface-600">{vd.address}</p>
              {vd.phone.map((ph, i) => (
                <a key={i} href={`tel:${ph}`} className="flex items-center gap-1.5 text-sm text-brand-600 no-underline mt-3 hover:text-brand-700 transition-colors font-medium">
                  <Phone size={13} />{ph}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 bg-white/20 border-none text-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="relative w-full max-w-[860px] h-[80vh] max-h-[560px]">
            <Image src={lightbox} alt="" fill className="object-contain" />
          </div>
        </div>
      )}

      {/* Message Vendor Modal */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowMsgModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] p-5 sm:p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-surface-900">{v.messageVendor || "Message Vendor"}</h3>
                <p className="text-xs text-surface-400 mt-0.5">{vd.name}</p>
              </div>
              <button
                onClick={() => setShowMsgModal(false)}
                aria-label={v.msgCancel || "Cancel"}
                className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center border-none cursor-pointer hover:bg-surface-200 transition-colors"
              >
                <X size={15} className="text-surface-500" />
              </button>
            </div>

            {msgSent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-surface-900 mb-2">{v.msgSent || "Message sent!"}</h4>
                <p className="text-sm text-surface-400 mb-5">{v.msgSentDesc || "The vendor will get back to you soon."}</p>
                <Link href={`/${lang}/account/inquiries`} className="no-underline text-sm font-semibold text-brand-600 hover:underline">
                  {v.msgViewInquiries || "View in My Inquiries →"}
                </Link>
              </div>
            ) : (
              <>
                {msgError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{msgError}</div>
                )}
                <textarea
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  placeholder={(v.msgPlaceholder || "Hi {name}, I'm interested in your services…").replace("{name}", vd.name)}
                  rows={5}
                  className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm text-surface-700 placeholder:text-surface-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 resize-none transition-all mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSendMessage}
                    disabled={!msgText.trim() || msgSending}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-rose-500 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer hover:from-brand-700 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow"
                  >
                    {msgSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    {msgSending ? (v.msgSending || "Sending…") : (v.msgSendButton || "Send Message")}
                  </button>
                  <button
                    onClick={() => setShowMsgModal(false)}
                    className="px-5 py-3 border border-surface-200 rounded-xl text-sm font-medium text-surface-600 bg-transparent cursor-pointer hover:bg-surface-50 transition-colors"
                  >
                    {v.msgCancel || "Cancel"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
