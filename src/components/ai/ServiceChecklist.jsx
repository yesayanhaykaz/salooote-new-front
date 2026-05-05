"use client";

/**
 * ServiceChecklist — renders the event services checklist for the planner panel.
 * Used in both PlannerClient.js and AIAssistantV2Client.js when plan mode is active.
 *
 * Props:
 *  services[]      — array of PlanService objects
 *  selectedVendors — { [service_type]: { id, name } }
 *  lang            — "en"|"hy"|"ru"
 *  onSearch        — (service_type) => void
 *  onRemove        — (service_type) => void
 *  onAdd           — (service_type, title) => void   [optional custom service]
 *  compact         — bool — show minimal version
 *  serviceTitles   — optional { [service_type]: string } translations
 */

const STATUS_COLORS = {
  selected: "#16a34a",
  searching: "#f59e0b",
  pending: "#94a3b8",
};

const STATUS_ICONS = {
  selected: "✓",
  searching: "⟳",
  pending: "○",
};

export default function ServiceChecklist({
  services = [],
  selectedVendors = {},
  lang = "en",
  onSearch,
  onRemove,
  onAdd,
  compact = false,
  serviceTitles = {},
}) {
  if (!services?.length) return null;

  // Group by required vs optional
  const required = services.filter((s) => s.required !== false);
  const optional = services.filter((s) => s.required === false);

  const renderService = (svc) => {
    const isSelected = svc.status === "selected" || !!selectedVendors[svc.service_type];
    const isSearching = svc.status === "searching";
    const status = isSelected ? "selected" : isSearching ? "searching" : "pending";
    const statusColor = STATUS_COLORS[status];
    const statusIcon = STATUS_ICONS[status];
    const title = serviceTitles[svc.service_type] || svc.title || svc.service_type;
    const selectedVendor = selectedVendors[svc.service_type];

    return (
      <div
        key={svc.service_type}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: compact ? "5px 0" : "7px 0",
          borderBottom: "1px solid rgba(15,23,42,0.05)",
        }}
      >
        {/* Status indicator */}
        <span style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 700,
          background: isSelected ? "#dcfce7" : "transparent",
          border: `2px solid ${statusColor}`,
          color: statusColor,
          flexShrink: 0,
        }}>
          {statusIcon}
        </span>

        {/* Title + vendor */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: compact ? "12px" : "13px",
            fontWeight: isSelected ? 600 : 500,
            color: isSelected ? "#16a34a" : "#0f172a",
            textDecoration: isSelected ? "none" : "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {title}
          </div>
          {selectedVendor?.name && (
            <div style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedVendor.name}
            </div>
          )}
        </div>

        {/* Actions */}
        {!compact && (
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {!isSelected && svc.can_search !== false && (
              <button
                onClick={() => onSearch?.(svc.service_type)}
                style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid #e11d5c",
                  background: "transparent",
                  color: "#e11d5c",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {isSearching ? "..." : { en: "Find", hy: "Gtel", ru: "Найти" }[lang] || "Find"}
              </button>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove?.(svc.service_type)}
                style={{
                  fontSize: "11px",
                  padding: "3px 6px",
                  borderRadius: "6px",
                  border: "1px solid rgba(15,23,42,0.12)",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
                title="Remove"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {required.length > 0 && (
        <div>
          {required.map(renderService)}
        </div>
      )}
      {optional.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            {{ en: "Optional", hy: "Kamekin", ru: "Опционально" }[lang] || "Optional"}
          </div>
          {optional.map(renderService)}
        </div>
      )}
    </div>
  );
}
