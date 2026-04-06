"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";

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

export default function ProductCard({ product }) {
  const imgSrc = product.image || productImages[product.id] || null;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link href="/product" className="no-underline group">
      <div className="product-card bg-white rounded-xl border border-surface-200 overflow-hidden">

        {/* Image */}
        <div className="h-48 relative overflow-hidden bg-surface-100">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`h-full bg-gradient-to-br ${product.gradient || "from-brand-50 to-brand-100"}`} />
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-all duration-300" />

          {/* Badges */}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold z-10">
              {product.tag}
            </span>
          )}
          {discount && !product.tag && (
            <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold z-10">
              -{discount}%
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 bg-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:scale-105 transition-all z-10 group/heart"
          >
            <Heart size={14} className="text-surface-400 group-hover/heart:text-accent-500 transition-colors" />
          </button>

          {/* Quick view — appears on hover */}
          <div className="quick-view-btn absolute bottom-3 left-3 right-3 z-10">
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full bg-white text-surface-800 border-none rounded-xl py-2 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-brand-600 hover:text-white transition-all"
            >
              <Eye size={12} /> Quick View
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-surface-400 mb-1 truncate">{product.vendor}</p>
          <p className="text-sm font-semibold text-surface-800 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug min-h-[40px]">
            {product.name}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating)
                  ? "fill-warm-400 text-warm-400"
                  : "fill-surface-200 text-surface-200"
                }
              />
            ))}
            <span className="text-xs text-surface-400 ml-1">{product.rating}</span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <span className="text-base font-bold text-surface-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-surface-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="bg-brand-600 text-white border-none rounded-xl w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-brand-700 transition-colors flex-shrink-0"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
