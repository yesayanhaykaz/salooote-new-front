"use client";

import Link from "next/link";
import CardActions from "./CardActions";

/**
 * VenueCard — displays a single venue result card.
 *
 * Props:
 *  venue       — { id, name, city, capacity, price_per_person, images, slug, actions? }
 *  lang        — "en"|"hy"|"ru"
 *  onAction    — (type, payload) => void
 */
export default function VenueCard({ venue, lang = "en", onAction }) {
  if (!venue) return null;

  const name = venue.name || venue.venue_name || "";
  const city = venue.city || "";
  const capacity = venue.capacity || venue.max_capacity || 0;
  const img = (Array.isArray(venue.images) && venue.images[0]) || venue.image || null;
  const venueId = String(venue.id);

  const capacityLabel = {
    en: `Up to ${capacity} guests`,
    hy: `Mvotakiutyan: ${capacity} hy`,
    ru: `До ${capacity} гостей`,
  };

  const actions = venue.actions || [
    { type: "contact_vendor", label: "Contact", vendor_id: venueId },
    { type: "add_to_plan", label: "Add to plan", item_id: venueId, service_type: "venue" },
    { type: "ask_question", label: "Ask", vendor_id: venueId },
    { type: "save", label: "Save", item_id: venueId },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      border: "1px solid rgba(15,23,42,0.07)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minWidth: "160px",
      maxWidth: "200px",
      flexShrink: 0,
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(225,29,92,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ width: "100%", aspectRatio: "16/9", background: "#f1f5f9", overflow: "hidden" }}>
        {img ? (
          <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "28px" }}>
            🏛️
          </div>
        )}
      </div>

      <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a" }}>{name}</div>
        {city && <div style={{ fontSize: "11px", color: "#64748b" }}>📍 {city}</div>}
        {capacity > 0 && (
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            👥 {capacityLabel[lang] || capacityLabel.en}
          </div>
        )}

        <CardActions actions={actions} onAction={onAction} compact lang={lang} />

        {venue.slug && (
          <Link
            href={`/${lang}/venues/${venue.slug}`}
            style={{ fontSize: "11px", color: "#e11d5c", textDecoration: "none", marginTop: "4px" }}
          >
            View venue →
          </Link>
        )}
      </div>
    </div>
  );
}
