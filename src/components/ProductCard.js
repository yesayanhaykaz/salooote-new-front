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
  addToCart: { en: "Add to cart", hy: "Ավելացնել", ru: "В корзину" },
  added:     { en: "Added!",      hy: "Ավելացված", ru: "Добавлено" },
};

export default function ProductCard({ product, lang = "en" }) {
  const { addToCart } = useCart();
  const { isSaved, toggleSave } = useSaved();
  const router = useRouter();

  const imgSrc = product.image || productImages[product.id] || null;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const saved = isSaved(product.id);
  const [savingHeart, setSavingHeart] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Subtle 3-D tilt
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 180, damping: 22 });
  const smy = useSpring(my, { stiffness: 180, damping: 22 });
  const rotX = useTransform(smy, [-0.5, 0.5], ["4.5deg", "-4.5deg"]);
  const rotY = useTransform(smx, [-0.5, 0.5], ["-4.5deg", "4.5deg"]);

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  const productHref = product.vendor_slug && product.slug
    ? `/${lang}/${product.vendor_slug}/${product.slug}`
    : `/${lang}/product/${product.id}`;

  const vendorName = product.vendor || product.vendor_name || null;

  return (
    <Link href={productHref} className="no-underline block" style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        whileHover={{
          y: -8,
          boxShadow: "0 32px 64px -16px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(225,29,92,0.12)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="bg-white rounded-2xl overflow-hidden cursor-pointer will-change-transform"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* ── Image zone ── */}
        <div className="relative overflow-hidden bg-surface-100" style={{ aspectRatio: "4 / 5" }}>

          {/* Photo */}
          {imgSrc ? (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient || "from-brand-50 to-brand-100"}`} />
          )}

          {/* Gradient vignette — always-on, deepens on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: hovered
                ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 40%, transparent 65%)"
                : "linear-gradient(to top, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.06) 36%, transparent 60%)",
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Discount / tag badge */}
          {(product.tag || discount) && (
            <div className="absolute top-3 left-3 z-10">
              {product.tag ? (
                <span className="bg-brand-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider uppercase shadow-sm">
                  {product.tag}
                </span>
              ) : (
                <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
                  −{discount}%
                </span>
              )}
            </div>
          )}

          {/* Heart */}
          <motion.button
            onClick={async (e) => {
              e.preventDefault();
              if (!isLoggedIn()) { router.push(`/${lang}/login`); return; }
              if (savingHeart) return;
              setSavingHeart(true);
              await toggleSave("product", product.id);
              setSavingHeart(false);
            }}
            whileTap={{ scale: 0.80 }}
            whileHover={{ scale: 1.12 }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }}
          >
            <Heart
              size={14}
              className={`transition-all duration-200 ${saved ? "fill-brand-500 text-brand-500" : "text-surface-500"} ${savingHeart ? "opacity-40" : ""}`}
            />
          </motion.button>

          {/* Vendor name — pinned to bottom of image, over vignette */}
          {vendorName && (
            <div className="absolute bottom-3 left-3 right-12 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 text-white/80 text-[10px] font-medium tracking-wide truncate max-w-full">
                <Store size={9} className="flex-shrink-0 opacity-70" />
                <span className="truncate">{vendorName}</span>
              </span>
            </div>
          )}
        </div>

        {/* ── Info zone ── */}
        <div className="px-4 pt-3.5 pb-4">

          {/* Product name */}
          <p className="text-[13.5px] font-semibold text-surface-800 leading-snug line-clamp-2 mb-3 min-h-[40px] group-hover:text-brand-600 transition-colors duration-200">
            {product.name}
          </p>

          {/* Stars */}
          {product.rating != null && product.rating > 0 && (
            <div className="flex items-center gap-0.5 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.round(product.rating)
                    ? "fill-warm-400 text-warm-400"
                    : "fill-surface-200 text-surface-200"}
                />
              ))}
              <span className="text-[10px] text-surface-400 ml-1 font-medium">{product.rating}</span>
            </div>
          )}

          {/* Price row + cart button */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[15px] font-bold text-surface-900 leading-none">
                {product.price != null
                  ? `${Number(product.price).toLocaleString()} ֏`
                  : "—"}
              </span>
              {product.originalPrice && (
                <span className="block text-[11px] text-surface-400 line-through mt-0.5">
                  {Number(product.originalPrice).toLocaleString()} ֏
                </span>
              )}
            </div>

            {/* Circular add-to-cart — morphs to check on success */}
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
              whileTap={{ scale: 0.85 }}
              animate={{
                backgroundColor: added ? "#22c55e" : "#e11d5c",
                boxShadow: added
                  ? "0 4px 14px rgba(34,197,94,0.35)"
                  : "0 4px 14px rgba(225,29,92,0.28)",
              }}
              transition={{ duration: 0.22 }}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer text-white"
            >
              <motion.div
                key={added ? "check" : "cart"}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.18 }}
              >
                {added
                  ? <Check size={17} strokeWidth={2.5} />
                  : <ShoppingCart size={15} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
