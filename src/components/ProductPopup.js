"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, Heart, ShoppingCart, ChevronRight, Shield, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const productImages = {
  1: "/images/wedding-cake.jpg",
  2: "/images/party-balloons.jpg",
  3: "/images/flowers-roses.jpg",
  4: "/images/cupcakes.jpg",
  5: "/images/catering-setup.jpg",
  6: "/images/wedding-cake2.jpg",
  7: "/images/flowers-roses.jpg",
  8: "/images/party-hats.jpg",
};

export default function ProductPopup({ product, onClose }) {
  const { addToCart } = useCart();
  const imgSrc = productImages[product.id] || null;

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-[820px] w-full overflow-hidden flex flex-col md:flex-row animate-fade-up">
        {/* Image side */}
        <div className="relative w-full md:w-[360px] h-[240px] md:h-auto flex-shrink-0">
          {imgSrc ? (
            <Image src={imgSrc} alt={product.name} fill className="object-cover" />
          ) : (
            <div className={`h-full bg-gradient-to-br ${product.gradient || "from-brand-50 to-brand-100"}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {product.tag && (
            <span className="absolute top-4 left-4 badge-glow text-white text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide">
              {product.tag}
            </span>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center border-none cursor-pointer shadow-sm hover:bg-white transition-all group"
          >
            <Heart size={15} className="text-surface-400 group-hover:text-accent-500 group-hover:fill-accent-100 transition-all" />
          </button>
        </div>

        {/* Content side */}
        <div className="flex-1 p-7 flex flex-col overflow-y-auto max-h-[90vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-surface-100 rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer hover:bg-surface-200 transition-colors z-10 md:top-5 md:right-5"
          >
            <X size={15} className="text-surface-600" />
          </button>

          {/* Vendor */}
          <p className="text-xs text-surface-400 font-medium mb-2">
            by{" "}
            <Link href="/vendor" className="text-brand-600 font-semibold no-underline hover:underline">
              {product.vendor}
            </Link>
          </p>

          {/* Name */}
          <h2 className="font-display text-[24px] font-bold text-surface-900 leading-snug mb-3 pr-6">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-warm-500 text-warm-500"
                      : "text-surface-200"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-surface-700">{product.rating}</span>
            <span className="text-xs text-surface-400">(48 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-5">
            <span className="text-[34px] font-bold text-surface-900 leading-none">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-surface-400 line-through mb-0.5">
                  ${product.originalPrice}
                </span>
                <span className="text-sm font-bold text-sage-500 bg-sage-50 px-2 py-1 rounded-lg mb-0.5">
                  {discountPct}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-surface-500 text-[13.5px] leading-relaxed mb-6">
            Handcrafted with care by {product.vendor}. Perfect for any event — fully customizable and delivered fresh right to your door.
          </p>

          {/* Trust signals */}
          <div className="flex flex-col gap-2 mb-6">
            {[
              { icon: Truck, text: "Free delivery on orders over $50" },
              { icon: Shield, text: "100% secure & verified vendor" },
              { icon: CheckCircle2, text: "Easy returns within 7 days" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={13} className="text-brand-500 flex-shrink-0" />
                <span className="text-[12px] text-surface-500">{text}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={() => {
                addToCart({ ...product, variant: "Standard", qty: 1 });
                onClose();
              }}
              className="btn-primary bg-brand-600 text-white border-none rounded-2xl py-3.5 text-[14px] font-semibold cursor-pointer flex items-center justify-center gap-2.5 shadow-glow"
            >
              <ShoppingCart size={16} />
              Add to Cart — ${product.price.toFixed(2)}
            </button>
            <Link href="/product" className="no-underline" onClick={onClose}>
              <button className="w-full border border-surface-200 rounded-2xl py-3 text-[13px] font-semibold text-surface-700 cursor-pointer flex items-center justify-center gap-2 hover:border-brand-300 hover:text-brand-600 transition-all bg-transparent">
                View Full Details <ChevronRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
