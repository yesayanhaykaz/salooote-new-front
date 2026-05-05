"use client";

import Link from "next/link";
import CardActions from "./CardActions";

const T = {
  en: { viewPage: "View page", reviews: "reviews", noPhoto: "No photo" },
  hy: { viewPage: "Tesnel", reviews: "karcahanutyun", noPhoto: "Lusankar che" },
  ru: { viewPage: "Открыть", reviews: "отзывов", noPhoto: "Нет фото" },
};

/**
 * VendorCard — displays a single vendor result card.
 *
 * Props:
 *  vendor      — { id, business_name, city, rating, review_count, logo, slug, actions? }
 *  lang        — "en"|"hy"|"ru"
 *  onAction    — (type, payload) => void
 *  isSelected  — bool (highlight if selected in planner)
 */
export default function VendorCard({ vendor, lang = "en", onAction, isSelected = false }) {
  if (!vendor) return null;

  const t = T[lang] || T.en;

  const name = vendor.business_name || vendor.businessName || vendor.name || "";
  const city = vendor.city || "";
  const rating = vendor.rating || vendor.avg_rating || 0;
  const reviewCount = vendor.review_count || vendor.reviewCount || 0;
  const logo = vendor.logo || vendor.photo || vendor.image || null;
  const slug = vendor.slug || "";
  const vendorId = String(vendor.id);

  const actions = vendor.actions || [
    { type: "contact_vendor", label: "Contact", vendor_id: vendorId },
    { type: "ask_question", label: "Ask", vendor_id: vendorId },
    { type: "add_to_plan", label: "Add to plan", item_id: vendorId },
    { type: "save", label: "Save", item_id: vendorId },
  ];

  return (
    <div style={{
      background: isSelected ? "linear-gradient(135deg,#fff0f4,#fff)" : "#fff",
      borderRadius: "12px",
      border: isSelected ? "2px solid #e11d5c" : "1px solid rgba(15,23,42,0.07)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.2s, border-color 0.2s",
      minWidth: "160px",
      maxWidth: "200px",
      flexShrink: 0,
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(225,29,92,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Logo / Photo */}
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#f8fafc", overflow: "hidden" }}>
        {logo ? (
          <img
            src={logo}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "28px" }}>
            🏪
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a", lineHeight: 1.3 }}>
          {name}
        </div>
        {city && (
          <div style={{ fontSize: "11px", color: "#64748b" }}>📍 {city}</div>
        )}
        {rating > 0 && (
          <div style={{ fontSize: "11px", color: "#64748b", display: "flex", gap: "4px", alignItems: "center" }}>
            <span style={{ color: "#f59e0b" }}>★</span>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>{rating.toFixed(1)}</span>
            {reviewCount > 0 && <span>({reviewCount} {t.reviews})</span>}
          </div>
        )}
        {isSelected && (
          <div style={{ fontSize: "11px", color: "#e11d5c", fontWeight: 600 }}>✓ Selected</div>
        )}

        <CardActions actions={actions} onAction={onAction} compact lang={lang} />

        {slug && (
          <Link
            href={`/${lang}/vendors/${slug}`}
            style={{ fontSize: "11px", color: "#e11d5c", textDecoration: "none", marginTop: "4px" }}
          >
            {t.viewPage} →
          </Link>
        )}
      </div>
    </div>
  );
}
