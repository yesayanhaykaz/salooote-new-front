"use client";

/**
 * CardActions — renders contextual action buttons for product/vendor/venue cards.
 * Matches the Salooote brand palette (pink #e11d5c).
 *
 * Props:
 *  actions[]   — array of { type, label, vendor_id, item_id, product_id, service_type }
 *  onAction    — (type, payload) => void
 *  compact     — show icon-only buttons (default false)
 *  lang        — "en"|"hy"|"ru"
 */

const ICON_MAP = {
  buy_now:        "🛒",
  contact_vendor: "💬",
  ask_question:   "❓",
  add_to_plan:    "📋",
  save:           "🔖",
};

const LABEL_FALLBACKS = {
  en: { buy_now: "Buy", contact_vendor: "Contact", ask_question: "Ask", add_to_plan: "Add to plan", save: "Save" },
  hy: { buy_now: "Գनel", contact_vendor: "Kap", ask_question: "Harcnum", add_to_plan: "Avelatsnel", save: "Pahel" },
  ru: { buy_now: "Купить", contact_vendor: "Связаться", ask_question: "Спросить", add_to_plan: "В план", save: "Сохранить" },
};

export default function CardActions({ actions = [], onAction, compact = false, lang = "en" }) {
  if (!actions?.length) return null;

  const fallbacks = LABEL_FALLBACKS[lang] || LABEL_FALLBACKS.en;

  return (
    <div style={{
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
      marginTop: "8px",
    }}>
      {actions.map((action, i) => {
        const label = action.label || fallbacks[action.type] || action.type;
        const icon = ICON_MAP[action.type] || "•";
        const isPrimary = action.type === "buy_now" || action.type === "contact_vendor";

        return (
          <button
            key={i}
            onClick={() => onAction?.(action.type, action)}
            title={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: compact ? "4px 8px" : "5px 10px",
              fontSize: compact ? "11px" : "12px",
              fontWeight: 500,
              borderRadius: "8px",
              border: isPrimary
                ? "none"
                : "1px solid rgba(15,23,42,0.12)",
              background: isPrimary
                ? "linear-gradient(135deg,#e11d5c,#f43f5e)"
                : "rgba(255,255,255,0.9)",
              color: isPrimary ? "#fff" : "#0f172a",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {compact ? icon : <><span>{icon}</span> {label}</>}
          </button>
        );
      })}
    </div>
  );
}
