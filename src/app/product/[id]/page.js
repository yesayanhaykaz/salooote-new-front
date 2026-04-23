"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { REVIEWS } from "@/lib/data";
import { productsAPI, isLoggedIn } from "@/lib/api";
import { Star, Heart, ShoppingCart, Share2, ChevronRight, MessageCircle, Shield, Truck, RotateCcw, CheckCircle2, Plus, Minus, Zap, Check } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/lib/cart-context";
import { useSaved } from "@/lib/saved-context";

export default function ProductDetailPage({ productId, lang = "en" }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isSaved, toggleSave } = useSaved();
  const [product, setProduct] = useState(null);
  const [savingHeart, setSavingHeart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab]         = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!productId) return;
    productsAPI.getById(productId, lang)
      .then(res => {
        const p = res?.data;
        if (p) {
          const imageUrls = p.images?.length
            ? p.images.map(img => img.url || img).filter(Boolean)
            : p.thumbnail_url
            ? [p.thumbnail_url]
            : ["/images/wedding-cake.jpg"];
          setProduct({
            id: p.id,
            name: p.name,
            vendor: p.vendor_name || "",
            vendor_id: p.vendor_id || "",
            vendor_slug: p.vendor_slug || "",
            price: parseFloat(p.price) || 0,
            originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
            rating: parseFloat(p.rating) || 0,
            reviewCount: p.review_count || 0,
            tag: null,
            description: (p.description || p.short_description || "")
              .replace(/\\n/g, "\n")   // turn literal \n into real newline
              .replace(/\n/g, "<br>"), // then convert to <br> for HTML rendering
            images: imageUrls,
            tags: p.tags || [],
            thumbnail: imageUrls[0] || null,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-surface-400">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-xl font-bold text-surface-700">Product not found</p>
        <p className="text-sm text-surface-400">This product may have been removed or doesn't exist.</p>
        <Link href={`/${lang}/products`} className="text-brand-600 font-semibold no-underline hover:underline">Browse all products</Link>
      </div>
    );
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-surface-200 bg-white">
        <div className="max-w-container mx-auto px-6 md:px-8 py-3 flex items-center gap-2 text-xs text-surface-400">
          <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors no-underline text-surface-400">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/${lang}/products`} className="hover:text-brand-600 transition-colors no-underline text-surface-400">Products</Link>
          <ChevronRight size={12} />
          <span className="text-surface-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 md:px-8 py-10">
        <div className="flex gap-12 flex-wrap">

          {/* Images */}
          <div className="flex-1 min-w-[300px] max-w-[540px]">
            <div className="rounded-2xl overflow-hidden h-[400px] relative mb-4 bg-surface-100">
              <Image src={product.images[activeImg] || "/images/wedding-cake.jpg"} alt={product.name} fill className="object-cover" />
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

          {/* Info */}
          <div className="flex-1 min-w-[280px]">
            {product.vendor && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-surface-500">by</span>
                <Link href={product.vendor_slug ? `/${lang}/vendor/${product.vendor_slug}` : `/${lang}/products`} className="text-sm text-brand-600 font-semibold no-underline hover:text-brand-700">
                  {product.vendor}
                </Link>
                <span className="text-xs text-surface-300">·</span>
                <CheckCircle2 size={13} className="text-brand-500" />
                <span className="text-xs text-surface-500">Verified</span>
              </div>
            )}

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

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((t, i) => (
                  <span key={i} className="bg-surface-100 text-surface-700 text-xs font-medium px-3 py-1.5 rounded-full border border-surface-200">{t}</span>
                ))}
              </div>
            )}

            {/* Price display in AMD */}
            <div className="flex items-end gap-3 mb-5">
              <span className="text-4xl font-bold text-surface-900">
                {(product.price * qty).toLocaleString()} ֏
              </span>
              {product.originalPrice && qty === 1 && (
                <>
                  <span className="text-lg text-surface-400 line-through mb-1">{Number(product.originalPrice).toLocaleString()} ֏</span>
                  {discount && (
                    <span className="text-sm font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-xl mb-1">
                      -{discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

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
              <button
                onClick={() => {
                  addToCart({
                    product_id:  product.id,
                    vendor_id:   product.vendor_id,
                    vendor_name: product.vendor,
                    name:        product.name,
                    price:       product.price,
                    image:       product.thumbnail || null,
                    qty,
                  });
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className={`flex-1 border-none rounded-xl py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors ${addedToCart ? "bg-green-500 text-white" : "bg-brand-600 text-white hover:bg-brand-700"}`}
              >
                {addedToCart ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={() => {
                addToCart({
                  product_id:  product.id,
                  vendor_id:   product.vendor_id,
                  vendor_name: product.vendor,
                  name:        product.name,
                  price:       product.price,
                  image:       product.thumbnail || null,
                  qty,
                });
                router.push(`/${lang}/checkout`);
              }}
              className="w-full mb-4 bg-surface-900 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-surface-800 transition-colors"
            >
              <Zap size={15} /> Buy Now
            </button>

            <div className="flex gap-3 mb-8">
              <button
                onClick={async () => {
                  if (!isLoggedIn()) { router.push(`/${lang}/login`); return; }
                  if (savingHeart) return;
                  setSavingHeart(true);
                  await toggleSave("product", product.id);
                  setSavingHeart(false);
                }}
                className={`flex-1 border rounded-xl py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all bg-transparent ${
                  isSaved(product.id)
                    ? "border-brand-300 text-brand-600 bg-brand-50"
                    : "border-surface-200 text-surface-700 hover:border-brand-300 hover:text-brand-600"
                } ${savingHeart ? "opacity-60" : ""}`}
              >
                <Heart size={15} className={isSaved(product.id) ? "fill-brand-500 text-brand-500" : ""} />
                {isSaved(product.id) ? "Saved" : "Wishlist"}
              </button>
              <button className="flex-1 border border-surface-200 rounded-xl py-3 text-sm font-semibold text-surface-700 cursor-pointer flex items-center justify-center gap-2 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent">
                <Share2 size={15} /> Share
              </button>
            </div>

            <div className="bg-surface-50 rounded-xl p-5 border border-surface-200 space-y-3">
              {[
                { icon: Truck,         text: "Free delivery on orders over $50" },
                { icon: Shield,        text: "100% secure & verified vendors" },
                { icon: RotateCcw,     text: "Easy returns within 7 days" },
                { icon: MessageCircle, text: "24/7 customer support" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon size={15} className="text-brand-500 flex-shrink-0" />
                  <span className="text-sm text-surface-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-surface-200 mb-8 gap-1">
            {["description", "reviews", "vendor"].map(t => (
              <button
                key={t} onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-semibold border-none cursor-pointer transition-all capitalize ${
                  tab === t ? "text-brand-600 border-b-2 border-brand-600 -mb-px bg-transparent" : "text-surface-400 bg-transparent hover:text-surface-700"
                }`}
              >
                {t}{t === "reviews" && ` (${product.reviewCount})`}
              </button>
            ))}
          </div>

          {tab === "description" && (
            <div className="max-w-[680px]">
              <div
                className="text-surface-600 leading-relaxed text-base prose prose-sm max-w-none [&_div]:min-h-[1em]"
                dangerouslySetInnerHTML={{ __html: product.description || "No description available." }}
              />
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
                  <p className="text-sm text-surface-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "vendor" && product.vendor && (
            <div className="max-w-[520px]">
              <div className="bg-white rounded-xl p-6 border border-surface-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-xl font-bold text-white">
                    {product.vendor[0]}
                  </div>
                  <div>
                    <p className="font-bold text-surface-900 text-base">{product.vendor}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star size={12} className="fill-warm-400 text-warm-400" />
                      <span className="text-sm font-semibold text-surface-700">4.9</span>
                    </div>
                  </div>
                  {product.vendor_slug && (
                    <Link href={`/${lang}/vendor/${product.vendor_slug}`} className="ml-auto no-underline">
                      <button className="bg-brand-50 text-brand-600 border border-brand-100 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-brand-100 transition-colors cursor-pointer">
                        View Shop
                      </button>
                    </Link>
                  )}
                </div>
                {["Verified & trusted vendor", "Responsive & reliable"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-brand-500" />
                    <span className="text-sm text-surface-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related — removed static sample products, will be populated from API later */}
      </div>
    </div>
  );
}
