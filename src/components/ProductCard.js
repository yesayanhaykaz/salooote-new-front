"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, ShoppingCart, Star, Check, Store } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useSaved } from "@/lib/saved-context";
import { isLoggedIn } from "@/lib/api";

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

const T = {
  addToCart: { en: "Add to cart",  hy: "Ավելացնել",  ru: "В корзину" },
  added:     { en: "Added",        hy: "Ավելացված",  ru: "Добавлено" },
  byVendor:  { en: "by",           hy: "—",          ru: "от" },
};

export default function ProductCard({ product, lang = "en" }) {
  const { addToCart } = useCart();
  const { isSaved, toggleSave } = useSaved();
  const router = useRouter();
  const imgSrc = product.image || productImages[product.id] || null;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const ref  = useRef(null);
  const saved = isSaved(product.id);
  const [savingHeart, setSavingHeart] = useState(false);
  const [added,       setAdded]       = useState(false);

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

  const productHref = product.vendor_slug && product.slug
    ? `/${lang}/${product.vendor_slug}/${product.slug}`
    : `/${lang}/product/${product.id}`;

  return (
    <Link href={productHref} className="no-underline group" style={{ perspective: "900px" }}>
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
        {/* Image — aspect-[4/5] = fixed width per column, height adapts */}
        <div className="relative overflow-hidden bg-surface-100" style={{ aspectRatio: "4 / 5" }}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-108"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient || "from-brand-50 to-brand-100"}`} />
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
            onClick={async (e) => {
              e.preventDefault();
              if (!isLoggedIn()) { router.push(`/${lang}/login`); return; }
              if (savingHeart) return;
              setSavingHeart(true);
              await toggleSave("product", product.id);
              setSavingHeart(false);
            }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.15 }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-10 shadow-sm"
          >
            <Heart
              size={14}
              className={`transition-all duration-200 ${saved ? "text-brand-500 fill-brand-500" : "text-surface-400"} ${savingHeart ? "opacity-50" : ""}`}
            />
          </motion.button>

        </div>

        {/* Info */}
        <div className="p-4">
          {/* Vendor row — clickable when vendor_slug present */}
          {(product.vendor || product.vendor_name) && (
            product.vendor_slug ? (
              <span
                role="link"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/${lang}/vendor/${product.vendor_slug}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/${lang}/vendor/${product.vendor_slug}`);
                  }
                }}
                className="inline-flex items-center gap-1 text-[11px] text-surface-500 mb-1.5 max-w-full truncate font-medium hover:text-brand-600 transition-colors cursor-pointer"
              >
                <Store size={10} className="text-surface-400 flex-shrink-0" />
                <span className="truncate">{product.vendor || product.vendor_name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-surface-500 mb-1.5 max-w-full truncate font-medium">
                <Store size={10} className="text-surface-400 flex-shrink-0" />
                <span className="truncate">{product.vendor || product.vendor_name}</span>
              </span>
            )
          )}

          <p className="text-sm font-semibold text-surface-800 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug min-h-[40px]">
            {product.name}
          </p>

          {/* Stars */}
          {product.rating != null && product.rating > 0 && (
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
          )}

          {/* Price */}
          <div className="flex items-end gap-1.5 mb-3">
            <span className="text-base font-bold text-surface-900">
              {product.price != null
                ? `${Number(product.price).toLocaleString()} ֏`
                : "—"}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-surface-400 line-through mb-0.5">
                {Number(product.originalPrice).toLocaleString()} ֏
              </span>
            )}
          </div>

          {/* Add to Cart — full width, prominent, multilingual */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                product_id:  product.id,
                vendor_id:   product.vendor_id,
                vendor_name: product.vendor || product.vendor_name || "",
                name:        product.name,
                price:       Number(product.price),
                image:       product.image || null,
                qty:         1,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            className={`w-full inline-flex items-center justify-center gap-1.5 border-none rounded-xl py-2.5 text-[13px] font-semibold cursor-pointer transition-all shadow-sm ${
              added
                ? "bg-green-500 text-white"
                : "bg-brand-600 hover:bg-brand-700 text-white"
            }`}
          >
            {added ? (
              <><Check size={14} /> {T.added[lang] || T.added.en}</>
            ) : (
              <><ShoppingCart size={14} /> {T.addToCart[lang] || T.addToCart.en}</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}
