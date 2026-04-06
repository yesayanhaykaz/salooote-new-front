"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SAMPLE_PRODUCTS, REVIEWS } from "@/lib/data";
import { Star, Heart, ShoppingCart, Share2, ChevronRight, MessageCircle, Shield, Truck, RotateCcw, CheckCircle2, Plus, Minus } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const product = {
  id: 1,
  name: "Premium Wedding Cake — Three Tier Floral",
  vendor: "Royal Bakes",
  price: 250,
  originalPrice: 320,
  rating: 4.9,
  reviewCount: 128,
  tag: "POPULAR",
  description: "A stunning three-tier wedding cake adorned with fresh florals and elegant details. Handcrafted by our master pastry chefs using only the finest ingredients. Customizable flavors, colors, and decorations to match your perfect day.",
  images: ["/images/wedding-cake.jpg", "/images/wedding-cake2.jpg", "/images/cupcakes.jpg"],
  tags: ["3 Tier", "Custom", "Fresh Flowers", "Gluten-Free Option"],
};

export default function ProductPage() {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState("description");

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-surface-200 bg-white">
        <div className="max-w-container mx-auto px-6 md:px-8 py-3 flex items-center gap-2 text-xs text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors no-underline text-surface-400">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-brand-600 transition-colors no-underline text-surface-400">Products</Link>
          <ChevronRight size={12} />
          <span className="text-surface-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 md:px-8 py-10">
        <div className="flex gap-12 flex-wrap">

          {/* ── Images ── */}
          <div className="flex-1 min-w-[300px] max-w-[540px]">
            <div className="rounded-2xl overflow-hidden h-[400px] relative mb-4 bg-surface-100">
              <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover" />
              <button className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center border-none cursor-pointer hover:scale-105 transition-all">
                <Heart size={17} className="text-surface-400 hover:text-accent-500 transition-colors" />
              </button>
              {product.tag && (
                <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs px-3 py-1 rounded-full font-semibold">{product.tag}</span>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i} onClick={() => setActiveImg(i)}
                  className={`rounded-xl overflow-hidden h-[72px] w-[72px] relative border-2 transition-all cursor-pointer flex-shrink-0 ${activeImg === i ? "border-brand-600" : "border-surface-200 hover:border-surface-300"}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info ── */}
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-surface-500">by</span>
              <Link href="/vendor" className="text-sm text-brand-600 font-semibold no-underline hover:text-brand-700">{product.vendor}</Link>
              <span className="text-xs text-surface-300">·</span>
              <CheckCircle2 size={13} className="text-brand-500" />
              <span className="text-xs text-surface-500">Verified</span>
            </div>

            <h1 className="text-3xl font-bold text-surface-900 leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-warm-400 text-warm-400" : "text-surface-300 fill-surface-300"} />
                ))}
              </div>
              <span className="font-semibold text-surface-800 text-sm">{product.rating}</span>
              <span className="text-surface-400 text-sm">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-5">
              <span className="text-4xl font-bold text-surface-900">${product.price}</span>
              <span className="text-lg text-surface-400 line-through mb-1">${product.originalPrice}</span>
              <span className="text-sm font-bold text-sage-500 bg-sage-50 border border-sage-100 px-2 py-1 rounded-xl mb-1">
                -{discount}% OFF
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((t, i) => (
                <span key={i} className="bg-surface-100 text-surface-700 text-xs font-medium px-3 py-1.5 rounded-full border border-surface-200">{t}</span>
              ))}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-surface-100 transition-colors border-none bg-transparent cursor-pointer">
                  <Minus size={15} className="text-surface-600" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-surface-800">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-surface-100 transition-colors border-none bg-transparent cursor-pointer">
                  <Plus size={15} className="text-surface-600" />
                </button>
              </div>
              <button className="btn-primary flex-1 bg-brand-600 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2">
                <ShoppingCart size={16} /> Add to Cart — ${(product.price * qty).toFixed(2)}
              </button>
            </div>

            <div className="flex gap-3 mb-8">
              <button className="flex-1 border border-surface-200 rounded-xl py-3 text-sm font-semibold text-surface-700 cursor-pointer flex items-center justify-center gap-2 hover:border-accent-300 hover:text-accent-500 transition-all bg-transparent">
                <Heart size={15} /> Wishlist
              </button>
              <button className="flex-1 border border-surface-200 rounded-xl py-3 text-sm font-semibold text-surface-700 cursor-pointer flex items-center justify-center gap-2 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent">
                <Share2 size={15} /> Share
              </button>
            </div>

            {/* Trust signals */}
            <div className="bg-surface-50 rounded-xl p-5 border border-surface-200 space-y-3">
              {[
                { icon: Truck,          text: "Free delivery on orders over $50" },
                { icon: Shield,         text: "100% secure & verified vendors" },
                { icon: RotateCcw,      text: "Easy returns within 7 days" },
                { icon: MessageCircle,  text: "24/7 customer support" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon size={15} className="text-brand-500 flex-shrink-0" />
                  <span className="text-sm text-surface-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-16">
          <div className="flex border-b border-surface-200 mb-8 gap-1">
            {["description", "reviews", "vendor"].map(t => (
              <button
                key={t} onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-semibold border-none cursor-pointer transition-all capitalize ${
                  tab === t
                    ? "text-brand-600 border-b-2 border-brand-600 -mb-px bg-transparent"
                    : "text-surface-400 bg-transparent hover:text-surface-700"
                }`}
              >
                {t}{t === "reviews" && ` (${product.reviewCount})`}
              </button>
            ))}
          </div>

          {tab === "description" && (
            <div className="max-w-[680px]">
              <p className="text-surface-600 leading-relaxed text-base mb-6">{product.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[["Serves", "60–80 guests"], ["Flavors", "Customizable"], ["Lead time", "5–7 days"], ["Allergens", "Gluten, dairy"]].map(([k, v], i) => (
                  <div key={i} className="bg-surface-50 rounded-xl p-4 border border-surface-200">
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-1">{k}</p>
                    <p className="text-sm font-semibold text-surface-800">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-4 max-w-[720px]">
              {REVIEWS.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-surface-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-sm font-bold text-white`}>{r.initial}</div>
                      <div>
                        <p className="font-semibold text-sm text-surface-800">{r.name}</p>
                        <p className="text-xs text-surface-400">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} className={j < Math.floor(r.rating) ? "fill-warm-400 text-warm-400" : "text-surface-200 fill-surface-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-surface-600 leading-relaxed mb-3">{r.text}</p>
                  {r.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {r.tags.map((tag, j) => (
                        <span key={j} className="text-xs bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full border border-brand-100 font-medium">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "vendor" && (
            <div className="max-w-[520px]">
              <div className="bg-white rounded-xl p-6 border border-surface-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-xl font-bold text-white">R</div>
                  <div>
                    <p className="font-bold text-surface-900 text-base">{product.vendor}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star size={12} className="fill-warm-400 text-warm-400" />
                      <span className="text-sm font-semibold text-surface-700">4.9</span>
                      <span className="text-sm text-surface-400">· 320+ sales</span>
                    </div>
                  </div>
                  <Link href="/vendor" className="ml-auto no-underline">
                    <button className="bg-brand-50 text-brand-600 border border-brand-100 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-brand-100 transition-colors cursor-pointer">
                      View Shop
                    </button>
                  </Link>
                </div>
                {["Verified & trusted vendor", "5+ years on Salooote", "Same-day response"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-brand-500" />
                    <span className="text-sm text-surface-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Related ── */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-surface-900 mb-6">You might also like</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {SAMPLE_PRODUCTS.slice(0, 5).map((p, i) => (
              <div key={i} className="min-w-[210px] flex-shrink-0"><ProductCard product={p} /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
