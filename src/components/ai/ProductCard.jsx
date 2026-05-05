"use client";

import Link from "next/link";
import CardActions from "./CardActions";

const T = {
  en: { viewProduct: "View", amd: "AMD", noImage: "No image" },
  hy: { viewProduct: "Tesnел", amd: "AMD", noImage: "Лusankar che" },
  ru: { viewProduct: "Открыть", amd: "AMD", noImage: "Нет фото" },
};

/**
 * ProductCard — displays a single product result card.
 *
 * Props:
 *  product     — { id, name, price, short_desc, description, images, rating, slug, vendor_id, actions? }
 *  lang        — "en"|"hy"|"ru"
 *  onAction    — (type, payload) => void — called for CardActions buttons
 *  lang        — locale string
 */
export default function ProductCard({ product, lang = "en", onAction }) {
  if (!product) return null;

  const t = T[lang] || T.en;

  // Resolve image URL
  const img =
    (Array.isArray(product.images) && product.images[0]) ||
    (typeof product.images === "string" && product.images) ||
    null;

  const price = product.price || product.price_amd;
  const desc = product.short_desc || product.shortDesc || product.description || "";
  const slug = product.slug;
  const vendorId = product.vendor_id || product.vendorId;

  const actions = product.actions || [
    { type: "buy_now", label: t.viewProduct, product_id: String(product.id) },
    { type: "add_to_plan", label: "Add to plan", item_id: String(product.id) },
    { type: "ask_question", label: "Ask", vendor_id: String(vendorId) },
    { type: "save", label: "Save", item_id: String(product.id) },
    { type: "contact_vendor", label: "Contact", vendor_id: String(vendorId) },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      border: "1px solid rgba(15,23,42,0.07)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.2s",
      cursor: "pointer",
      minWidth: "160px",
      maxWidth: "200px",
      flexShrink: 0,
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(225,29,92,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Image */}
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#f1f5f9", position: "relative", overflow: "hidden" }}>
        {img ? (
          <img
            src={img}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "11px" }}>
            {t.noImage}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.name}
        </div>
        {desc && (
          <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {desc}
          </div>
        )}
        {price > 0 && (
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#e11d5c", marginTop: "2px" }}>
            {price.toLocaleString()} {t.amd}
          </div>
        )}

        <CardActions actions={actions} onAction={onAction} compact lang={lang} />

        {slug && (
          <Link
            href={`/${lang}/products/${slug}?vendor=${vendorId}`}
            style={{ fontSize: "11px", color: "#e11d5c", textDecoration: "none", marginTop: "4px" }}
          >
            {t.viewProduct} →
          </Link>
        )}
      </div>
    </div>
  );
}
