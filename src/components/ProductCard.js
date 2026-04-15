"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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

  const ref = useRef(null);
  const [wished, setWished] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href="/product" className="no-underline group" style={{ perspective: "900px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.03, boxShadow: "0 24px 48px -12px rgba(225,29,92,0.22), 0 8px 16px rgba(0,0,0,0.08)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-xl border border-surface-200 overflow-hidden cursor-pointer will-change-transform"
      >
        {/* Image */}
        <div className="h-48 relative overflow-hidden bg-surface-100">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-108"
            />
          ) : (
            <div className={`h-full bg-gradient-to-br ${product.gradient || "from-brand-50 to-brand-100"}`} />
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />

          {/* Badges */}
          {product.tag && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="absolute top-3 left-3 bg-brand-600 text-white text-[11px] px-2.5 py-1 rounded-full font-semibold z-10 shadow-sm"
            >
              {product.tag}
            </motion.span>
          )}
          {discount && !product.tag && (
            <span className="absolute top-3 left-3 bg-green-600 text-white text-[11px] px-2.5 py-1 rounded-full font-semibold z-10">
              -{discount}%
            </span>
          )}

          {/* Wishlist */}
          <motion.button
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.15 }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-10 shadow-sm"
          >
            <Heart
              size={14}
              className={`transition-all duration-200 ${wished ? "text-brand-500 fill-brand-500" : "text-surface-400"}`}
            />
          </motion.button>

          {/* Quick view */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full bg-white/95 backdrop-blur-sm text-surface-800 border-none rounded-xl py-2 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
            >
              <Eye size={12} /> Quick View
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[11px] text-surface-400 mb-1 truncate font-medium">{product.vendor}</p>
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
            <span className="text-[11px] text-surface-400 ml-1">{product.rating}</span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-1.5">
              <span className="text-base font-bold text-surface-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-surface-400 line-through mb-0.5">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <motion.button
              onClick={(e) => e.preventDefault()}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.1, backgroundColor: "#be1850" }}
              className="bg-brand-600 text-white border-none rounded-xl w-8 h-8 flex items-center justify-center cursor-pointer flex-shrink-0"
            >
              <ShoppingCart size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
