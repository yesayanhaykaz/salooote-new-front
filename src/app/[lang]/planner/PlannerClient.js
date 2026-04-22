"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, ArrowLeft, CheckCircle2,
  Circle, Search, X, Star, ChevronRight,
  Users, Calendar, MapPin, DollarSign,
  Building2, Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   EVENT TEMPLATES — canonical checklists loaded on detection
═══════════════════════════════════════════════════════ */
const EVENT_TEMPLATES = {
  christening: {
    label: "Christening / Baptism", emoji: "⛪",
    accent: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#a855f7)",
    services: [
      { service_type: "church",          title: "Church Booking",                category: "religious",   required: true },
      { service_type: "baptism_candle",  title: "Baptism Candle (Կnunqi Mom)",   category: "religious",   required: true },
      { service_type: "cross",           title: "Cross Necklace for Baby",       category: "religious",   required: true },
      { service_type: "kavor",           title: "Godfather (Կavor)",             category: "roles",       required: true },
      { service_type: "kavork",          title: "Godmother (Կavork)",            category: "roles",       required: true },
      { service_type: "baby_outfit",     title: "White Baby Outfit",             category: "clothing",    required: true },
      { service_type: "venue",           title: "Celebration Venue",             category: "celebration", required: true,  canSearch: true },
      { service_type: "catering",        title: "Food & Catering",               category: "celebration", required: true,  canSearch: true },
      { service_type: "cake",            title: "Christening Cake",              category: "celebration", required: true,  canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: true,  canSearch: true },
      { service_type: "decoration",      title: "Decorations",                   category: "decoration",  required: false, canSearch: true },
    ],
  },
  wedding: {
    label: "Wedding", emoji: "💍",
    accent: "#e11d5c", gradient: "linear-gradient(135deg,#e11d5c,#f43f5e)",
    services: [
      { service_type: "ceremony_venue",  title: "Ceremony Venue",                category: "ceremony",    required: true },
      { service_type: "reception_venue", title: "Reception Hall",                category: "reception",   required: true,  canSearch: true },
      { service_type: "tamada",          title: "Tamada (MC / Toastmaster)",     category: "entertainment",required: true },
      { service_type: "wedding_rings",   title: "Wedding Rings",                 category: "ceremony",    required: true },
      { service_type: "bridal_dress",    title: "Bridal Gown",                   category: "attire",      required: true },
      { service_type: "wedding_cake",    title: "Wedding Cake",                  category: "food",        required: true,  canSearch: true },
      { service_type: "catering",        title: "Catering",                      category: "food",        required: true,  canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: true,  canSearch: true },
      { service_type: "videographer",    title: "Videographer",                  category: "media",       required: true,  canSearch: true },
      { service_type: "flowers",         title: "Bridal Flowers",                category: "decoration",  required: true,  canSearch: true },
      { service_type: "music",           title: "DJ / Live Music",               category: "entertainment",required: true,  canSearch: true },
    ],
  },
  birthday: {
    label: "Birthday Party", emoji: "🎂",
    accent: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    services: [
      { service_type: "cake",            title: "Birthday Cake",                 category: "food",        required: true,  canSearch: true },
      { service_type: "venue",           title: "Venue",                         category: "celebration", required: true },
      { service_type: "catering",        title: "Food & Catering",               category: "food",        required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations",        category: "decoration",  required: true,  canSearch: true },
      { service_type: "music",           title: "Music / DJ",                    category: "entertainment",required: false, canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: false, canSearch: true },
    ],
  },
  kids_party: {
    label: "Kids' Party", emoji: "🎠",
    accent: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)",
    services: [
      { service_type: "cake",            title: "Themed Birthday Cake",          category: "food",        required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations",        category: "decoration",  required: true,  canSearch: true },
      { service_type: "animator",        title: "Kids Animator / Entertainer",   category: "entertainment",required: true,  canSearch: true },
      { service_type: "venue",           title: "Venue",                         category: "celebration", required: true },
      { service_type: "catering",        title: "Kids-Friendly Catering",        category: "food",        required: true,  canSearch: true },
      { service_type: "decoration",      title: "Theme Decorations",             category: "decoration",  required: true,  canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: false, canSearch: true },
    ],
  },
  corporate: {
    label: "Corporate Event", emoji: "🏢",
    accent: "#475569", gradient: "linear-gradient(135deg,#475569,#334155)",
    services: [
      { service_type: "venue",           title: "Conference / Event Venue",      category: "venue",       required: true },
      { service_type: "catering",        title: "Catering & Coffee Breaks",      category: "food",        required: true,  canSearch: true },
      { service_type: "av_tech",         title: "AV & Tech Setup",               category: "tech",        required: true },
      { service_type: "photographer",    title: "Event Photographer",            category: "media",       required: true,  canSearch: true },
      { service_type: "entertainment",   title: "Evening Entertainment",         category: "entertainment",required: false, canSearch: true },
    ],
  },
  engagement: {
    label: "Engagement Party", emoji: "💍",
    accent: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)",
    services: [
      { service_type: "ring",            title: "Engagement Ring",               category: "ceremony",    required: true },
      { service_type: "flowers",         title: "Flowers",                       category: "decoration",  required: true,  canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: true,  canSearch: true },
      { service_type: "venue",           title: "Party Venue",                   category: "celebration", required: true },
      { service_type: "cake",            title: "Engagement Cake",               category: "food",        required: true,  canSearch: true },
      { service_type: "catering",        title: "Food & Drinks",                 category: "food",        required: true,  canSearch: true },
    ],
  },
  anniversary: {
    label: "Anniversary", emoji: "⭐",
    accent: "#d97706", gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    services: [
      { service_type: "flowers",         title: "Flower Arrangement",            category: "decoration",  required: true,  canSearch: true },
      { service_type: "venue",           title: "Restaurant / Venue",            category: "celebration", required: true },
      { service_type: "cake",            title: "Anniversary Cake",              category: "food",        required: true,  canSearch: true },
      { service_type: "catering",        title: "Dinner / Catering",             category: "food",        required: true,  canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: false, canSearch: true },
    ],
  },
  baby_shower: {
    label: "Baby Shower", emoji: "🍼",
    accent: "#0ea5e9", gradient: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    services: [
      { service_type: "balloon_decoration", title: "Balloon Decorations",        category: "decoration",  required: true,  canSearch: true },
      { service_type: "cake",            title: "Baby Shower Cake",              category: "food",        required: true,  canSearch: true },
      { service_type: "catering",        title: "Catering / Finger Food",        category: "food",        required: true,  canSearch: true },
      { service_type: "decoration",      title: "Theme Decorations",             category: "decoration",  required: true,  canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: false, canSearch: true },
    ],
  },
  graduation: {
    label: "Graduation Party", emoji: "🎓",
    accent: "#ea580c", gradient: "linear-gradient(135deg,#f59e0b,#ea580c)",
    services: [
      { service_type: "venue",           title: "Venue",                         category: "celebration", required: true },
      { service_type: "cake",            title: "Graduation Cake",               category: "food",        required: true,  canSearch: true },
      { service_type: "catering",        title: "Food & Catering",               category: "food",        required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloons & Décor",           category: "decoration",  required: false, canSearch: true },
      { service_type: "photographer",    title: "Photographer",                  category: "media",       required: false, canSearch: true },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   SERVICE ICON MAP
═══════════════════════════════════════════════════════ */
const SERVICE_ICONS = {
  church: "⛪", baptism_candle: "🕯️", cross: "✝️", kavor: "🤵", kavork: "👗",
  baby_outfit: "👶", venue: "🏛️", catering: "🍽️", cake: "🎂", wedding_cake: "🎂",
  photographer: "📸", videographer: "🎥", decoration: "🎀", balloon_decoration: "🎈",
  flowers: "💐", music: "🎵", tamada: "🎤", wedding_rings: "💍", ring: "💍",
  bridal_dress: "👗", ceremony_venue: "💒", reception_venue: "🏛️", av_tech: "📽️",
  entertainment: "🎭", animator: "🤹", default: "✦",
};

const getIcon = (type) => SERVICE_ICONS[type] || SERVICE_ICONS.default;

/* ═══════════════════════════════════════════════════════
   APPLY ACTIONS from OpenAI response
═══════════════════════════════════════════════════════ */
function applyActions(actions, prevState) {
  let state = { ...prevState };
  const searches = [];

  for (const a of actions) {
    switch (a.type) {

      case "set_event_type": {
        if (state.event_type === a.event_type) break; // already set
        const tpl = EVENT_TEMPLATES[a.event_type];
        state = {
          ...state,
          event_type: a.event_type,
          event_type_label: tpl?.label || a.event_type,
          event_type_emoji: tpl?.emoji || "🎉",
          accent: tpl?.accent || "#e11d5c",
          gradient: tpl?.gradient,
          // Load template services only if none set yet
          services: state.services?.length
            ? state.services
            : (tpl?.services || []).map(s => ({ ...s, status: "pending" })),
        };
        break;
      }

      case "set_guest_count":
        state = { ...state, guest_count: a.guest_count };
        break;

      case "set_location":
        state = { ...state, city: a.city };
        break;

      case "set_event_date":
        state = { ...state, date: a.date };
        break;

      case "set_budget":
        state = { ...state, budget: { description: a.description, budget_level: a.budget_level } };
        break;

      case "set_style":
        state = { ...state, style: a.style };
        break;

      case "set_notes":
        state = { ...state, notes: a.notes };
        break;

      case "add_service": {
        const exists = state.services?.find(s => s.service_type === a.service_type);
        if (!exists) {
          state = {
            ...state,
            services: [
              ...(state.services || []),
              {
                service_type: a.service_type,
                title: a.title || a.service_type.replace(/_/g, " "),
                category: a.category || "other",
                required: a.priority === "required",
                status: "pending",
                canSearch: true,
              },
            ],
          };
        }
        break;
      }

      case "remove_service":
        state = { ...state, services: (state.services || []).filter(s => s.service_type !== a.service_type) };
        break;

      case "mark_required_item":
      case "mark_optional_item": {
        const key = a.item_type;
        const exists = state.services?.find(s => s.service_type === key);
        if (!exists) {
          state = {
            ...state,
            services: [
              ...(state.services || []),
              {
                service_type: key,
                title: a.title || key.replace(/_/g, " "),
                category: a.category || "other",
                required: a.type === "mark_required_item",
                status: "pending",
                canSearch: false,
              },
            ],
          };
        }
        break;
      }

      case "search_vendors":
        searches.push(a);
        // Mark that service as "searching"
        state = {
          ...state,
          services: (state.services || []).map(s =>
            s.service_type === a.service_type ? { ...s, searching: true } : s
          ),
        };
        break;

      case "select_vendor":
        state = {
          ...state,
          selected_vendors: {
            ...state.selected_vendors,
            [a.service_type]: { id: a.vendor_id, name: a.vendor_name },
          },
          services: (state.services || []).map(s =>
            s.service_type === a.service_type
              ? { ...s, status: "selected", searching: false }
              : s
          ),
        };
        break;

      case "unselect_vendor": {
        const sv = { ...state.selected_vendors };
        delete sv[a.service_type];
        state = {
          ...state,
          selected_vendors: sv,
          services: (state.services || []).map(s =>
            s.service_type === a.service_type ? { ...s, status: "pending" } : s
          ),
        };
        break;
      }

      default:
        break;
    }
  }

  return { state, searches };
}

/* ═══════════════════════════════════════════════════════
   SMALL UI ATOMS
═══════════════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
      <BotAvatar />
      <div style={{ background: "#fff", borderRadius: "14px 14px 14px 4px", padding: "12px 16px", border: "1px solid #f1f5f9", display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 0.15, 0.3].map((d, i) => (
          <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: d }}
            style={{ width: 7, height: 7, borderRadius: "50%", background: "#c4b5fd", display: "block" }} />
        ))}
      </div>
    </div>
  );
}

function BotAvatar() {
  return (
    <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#7c3aed,#e11d5c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Sparkles size={13} style={{ color: "#fff" }} />
    </div>
  );
}

function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";
  const lines = msg.text.split("\n");

  const renderLine = (line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : p
        )}
        {i < lines.length - 1 && <br />}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      style={{ display: "flex", flexDirection: "column", alignItems: isBot ? "flex-start" : "flex-end", gap: 4 }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "90%" }}>
        {isBot && <BotAvatar />}
        <div style={{
          background: isBot ? "#fff" : "#e11d5c",
          color: isBot ? "#1e293b" : "#fff",
          borderRadius: isBot ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
          padding: "11px 15px",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          border: isBot ? "1px solid #f1f5f9" : "none",
          boxShadow: isBot ? "0 1px 4px rgba(0,0,0,0.04)" : "0 4px 16px rgba(225,29,92,0.22)",
        }}>
          {lines.map(renderLine)}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR CARD
═══════════════════════════════════════════════════════ */
function VendorCard({ vendor, onSelect, lang }) {
  const name    = vendor.business_name || vendor.name || "Vendor";
  const rating  = parseFloat(vendor.rating) || 0;
  const city    = vendor.city || "";
  const initial = name[0]?.toUpperCase() || "V";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      style={{
        background: "#fff",
        border: "1px solid #f1f5f9",
        borderRadius: 14,
        padding: "14px",
        minWidth: 160,
        maxWidth: 180,
        flexShrink: 0,
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "linear-gradient(135deg,#7c3aed22,#e11d5c22)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.2rem", fontWeight: 800, color: "#7c3aed",
        marginBottom: 10,
      }}>
        {initial}
      </div>

      {/* Name */}
      <p style={{ margin: "0 0 3px", fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </p>

      {/* Rating + city */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
        {rating > 0 && (
          <>
            <Star size={10} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{rating.toFixed(1)}</span>
          </>
        )}
        {city && <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>· {city}</span>}
      </div>

      {/* Select button */}
      <motion.button
        whileHover={{ background: "#e11d5c", color: "#fff" }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onSelect(vendor)}
        style={{
          width: "100%", border: "1.5px solid #e11d5c", borderRadius: 8,
          background: "transparent", color: "#e11d5c",
          fontSize: "0.76rem", fontWeight: 700,
          padding: "7px 0", cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
        }}
      >
        Select
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   SERVICE ROW
═══════════════════════════════════════════════════════ */
function ServiceRow({ service, selectedVendor, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor, accentColor }) {
  const icon        = getIcon(service.service_type);
  const results     = vendorResults[service.service_type] || [];
  const hasResults  = results.length > 0;
  const isSelected  = !!selectedVendor;
  const isSearching = service.searching;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
        {/* Status icon */}
        <div style={{ flexShrink: 0 }}>
          {isSelected ? (
            <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
          ) : isSearching ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={18} style={{ color: accentColor || "#7c3aed" }} />
            </motion.div>
          ) : (
            <Circle size={18} style={{ color: "#d1d5db" }} />
          )}
        </div>

        {/* Icon + title */}
        <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: "0.82rem", fontWeight: 600,
            color: isSelected ? "#15803d" : "#334155",
            textDecoration: isSelected ? "none" : "none",
          }}>
            {service.title}
          </span>
          {!service.required && (
            <span style={{ marginLeft: 6, fontSize: "0.65rem", background: "#f1f5f9", color: "#94a3b8", borderRadius: 100, padding: "2px 7px", fontWeight: 600 }}>
              optional
            </span>
          )}
        </div>

        {/* Action area */}
        <div style={{ flexShrink: 0 }}>
          {isSelected ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803d", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedVendor.name}
              </span>
              <button
                onClick={() => onUnselectVendor(service.service_type)}
                style={{ border: "none", background: "none", cursor: "pointer", padding: 2, color: "#94a3b8" }}
              >
                <X size={12} />
              </button>
            </div>
          ) : service.canSearch && !isSearching ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSearchVendors(service.service_type, service.title)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(225,29,92,0.06)", border: "1px solid rgba(225,29,92,0.2)",
                color: "#e11d5c", borderRadius: 100, padding: "5px 12px",
                fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              <Search size={10} /> Find vendor
            </motion.button>
          ) : hasResults && !isSelected ? (
            <span style={{ fontSize: "0.72rem", color: "#f59e0b", fontWeight: 600 }}>
              {results.length} options ↓
            </span>
          ) : null}
        </div>
      </div>

      {/* Vendor results row (horizontal scroll) */}
      {hasResults && !isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          style={{ paddingLeft: 56, paddingBottom: 12, overflow: "hidden" }}
        >
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {results.slice(0, 6).map((v, i) => (
              <VendorCard
                key={v.id || i}
                vendor={v}
                onSelect={(vendor) => onSelectVendor(service.service_type, vendor)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RIGHT PANEL — LIVE EVENT PLAN
═══════════════════════════════════════════════════════ */
function EventPlanPanel({ eventState, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor }) {
  const { event_type, event_type_label, event_type_emoji, accent, gradient,
          date, city, guest_count, style, budget, services = [], selected_vendors = {} } = eventState;

  const total    = services.length;
  const done     = Object.keys(selected_vendors).length +
                   services.filter(s => !s.required && !s.canSearch).length; // count non-vendor items as done
  const pct      = total > 0 ? Math.round((Object.keys(selected_vendors).length / services.filter(s => s.canSearch).length || 1) * 100) : 0;
  const missing  = services.filter(s => s.required && !selected_vendors[s.service_type] && s.canSearch);

  // Group services by category
  const grouped = {};
  for (const s of services) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }

  const categoryLabels = {
    religious: "⛪ Religious", roles: "👥 Key Roles", clothing: "👗 Attire",
    ceremony: "💒 Ceremony", reception: "🥂 Reception", celebration: "🎉 Celebration",
    food: "🍽️ Food & Cake", decoration: "🎀 Decorations", media: "📸 Photography & Video",
    entertainment: "🎵 Entertainment", attire: "👗 Attire", venue: "🏛️ Venue",
    tech: "🎤 Tech & AV", other: "📋 Other",
  };

  return (
    <div>
      {/* Event header card */}
      <div style={{
        background: gradient || "linear-gradient(135deg,#7c3aed,#e11d5c)",
        borderRadius: 20, padding: "18px 20px", marginBottom: 16,
        color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: "2.2rem" }}>{event_type_emoji}</span>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>{event_type_label}</h2>
          </div>

          {/* Details row */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
            {date && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", opacity: 0.85 }}>
                <Calendar size={12} /> {date}
              </span>
            )}
            {city && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", opacity: 0.85 }}>
                <MapPin size={12} /> {city}
              </span>
            )}
            {guest_count && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", opacity: 0.85 }}>
                <Users size={12} /> {guest_count} guests
              </span>
            )}
            {budget?.description && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", opacity: 0.85 }}>
                <DollarSign size={12} /> {budget.description}
              </span>
            )}
            {style && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", opacity: 0.85 }}>
                ✨ {style}
              </span>
            )}
          </div>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 10, overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: "#fff", borderRadius: 10 }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.9 }}>
              {Object.keys(selected_vendors).length}/{services.filter(s => s.canSearch).length} vendors
            </span>
          </div>
        </div>
      </div>

      {/* Missing items alert */}
      {missing.length > 0 && Object.keys(selected_vendors).length > 0 && (
        <div style={{
          background: "#fef9c3", border: "1px solid #fde047",
          borderRadius: 12, padding: "10px 14px", marginBottom: 12,
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#854d0e" }}>Still need vendors for:</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#713f12" }}>
              {missing.map(s => s.title).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Services grouped */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", marginBottom: 10, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px 0", borderBottom: "1px solid #f8fafc" }}>
            <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {categoryLabels[cat] || cat}
            </p>
          </div>
          <div style={{ padding: "0 14px" }}>
            {items.map((service, idx) => (
              <div key={service.service_type}>
                {idx > 0 && <div style={{ height: 1, background: "#f8fafc" }} />}
                <ServiceRow
                  service={service}
                  selectedVendor={selected_vendors[service.service_type]}
                  vendorResults={vendorResults}
                  onSelectVendor={onSelectVendor}
                  onSearchVendors={onSearchVendors}
                  onUnselectVendor={onUnselectVendor}
                  accentColor={accent}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EMPTY PLAN STATE (before event detected)
═══════════════════════════════════════════════════════ */
function EmptyPlan({ onPickType }) {
  const types = [
    { key: "christening", label: "Christening", emoji: "⛪" },
    { key: "wedding",     label: "Wedding",      emoji: "💍" },
    { key: "birthday",    label: "Birthday",     emoji: "🎂" },
    { key: "kids_party",  label: "Kids Party",   emoji: "🎠" },
    { key: "corporate",   label: "Corporate",    emoji: "🏢" },
    { key: "baby_shower", label: "Baby Shower",  emoji: "🍼" },
    { key: "engagement",  label: "Engagement",   emoji: "💍" },
    { key: "graduation",  label: "Graduation",   emoji: "🎓" },
  ];

  return (
    <div style={{ paddingTop: 48, textAlign: "center" }}>
      <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
      <h2 style={{ margin: "0 0 8px", fontSize: "1.3rem", fontWeight: 800, color: "#1e293b" }}>
        Your event plan appears here
      </h2>
      <p style={{ margin: "0 0 28px", fontSize: "0.9rem", color: "#94a3b8", maxWidth: 320, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
        Tell the AI what you're planning — it'll build your checklist and help you find vendors instantly.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {types.map(t => (
          <motion.button
            key={t.key}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onPickType(t.label)}
            style={{
              border: "1.5px solid #f1f5f9",
              borderRadius: 14, padding: "16px 8px",
              background: "#fff", cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              transition: "border-color 0.15s",
            }}
          >
            <span style={{ fontSize: "1.6rem" }}>{t.emoji}</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569" }}>{t.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN CLIENT COMPONENT
═══════════════════════════════════════════════════════ */
const INITIAL_EVENT_STATE = {
  event_type: null, event_type_label: null, event_type_emoji: null,
  accent: "#e11d5c", gradient: null,
  date: null, city: null, guest_count: null, style: null, budget: null, notes: null,
  services: [], selected_vendors: {},
};

export default function PlannerClient({ lang }) {
  const [messages,       setMessages]       = useState([]);
  const [eventState,     setEventState]     = useState(INITIAL_EVENT_STATE);
  const [vendorResults,  setVendorResults]  = useState({});
  const [loading,        setLoading]        = useState(false);
  const [input,          setInput]          = useState("");

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Save plan to localStorage
  useEffect(() => {
    if (eventState.event_type) {
      localStorage.setItem("salooote_planner", JSON.stringify({ eventState, vendorResults }));
    }
  }, [eventState, vendorResults]);

  // Greeting on mount
  useEffect(() => {
    setTimeout(() => {
      pushBot("Hi! I'm your Salooote event planner 🎉\n\nJust describe what you're planning — tell me the event type, how many guests, city, style, anything you have in mind. I'll build your complete plan instantly!");
    }, 300);
  }, []);

  const pushBot = (text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "bot", text }]);
  };

  const pushUser = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text }]);
  };

  // Search vendors from backend
  const searchVendors = useCallback(async (service_type, search_term, filters = {}) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const term = search_term || service_type.replace(/_/g, " ");
      const params = new URLSearchParams({ search: term, limit: "8" });
      if (filters.city) params.set("city", filters.city);
      if (eventState.city && !filters.city) params.set("city", eventState.city);

      // Try vendors endpoint first, fall back to products
      let data = null;
      try {
        const res = await fetch(`${apiBase}/vendors?${params}`);
        if (res.ok) {
          const j = await res.json();
          data = j.data || [];
        }
      } catch { /* ignore */ }

      if (!data?.length) {
        const res = await fetch(`${apiBase}/products?${params}`);
        if (res.ok) {
          const j = await res.json();
          data = (j.data || []).map(p => ({
            id: p.id,
            business_name: p.vendor_name || p.name,
            name: p.vendor_name || p.name,
            rating: p.rating,
            city: p.vendor_city || eventState.city || "",
            slug: p.vendor_slug || "",
          }));
        }
      }

      if (data?.length) {
        setVendorResults(prev => ({ ...prev, [service_type]: data }));
      }

      // Clear "searching" flag
      setEventState(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.service_type === service_type ? { ...s, searching: false } : s
        ),
      }));
    } catch (err) {
      console.error("Vendor search error:", err);
      setEventState(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.service_type === service_type ? { ...s, searching: false } : s
        ),
      }));
    }
  }, [eventState.city]);

  // Send message to OpenAI
  const sendMessage = useCallback(async (text) => {
    const userText = text.trim();
    if (!userText || loading) return;

    setInput("");
    pushUser(userText);
    setLoading(true);

    try {
      const res = await fetch("/api/planner/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", text: userText }],
          eventState,
        }),
      });

      const data = await res.json();

      if (data.error) {
        pushBot(`⚠️ ${data.error}`);
        return;
      }

      // Apply actions
      const { state: newState, searches } = applyActions(data.actions || [], eventState);
      setEventState(newState);

      // Show bot reply
      if (data.assistant_message) {
        pushBot(data.assistant_message);
      }

      // Trigger vendor searches
      for (const search of searches) {
        searchVendors(search.service_type, search.search_term, search.filters || {});
      }

    } catch (err) {
      pushBot("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [messages, eventState, loading, searchVendors]);

  // User clicks a vendor → select it
  const handleSelectVendor = useCallback((service_type, vendor) => {
    const name = vendor.business_name || vendor.name || "Vendor";
    setEventState(prev => ({
      ...prev,
      selected_vendors: { ...prev.selected_vendors, [service_type]: { id: vendor.id, name } },
      services: prev.services.map(s =>
        s.service_type === service_type ? { ...s, status: "selected", searching: false } : s
      ),
    }));
    // Clear vendor results for this service (clean up)
    setVendorResults(prev => { const n = { ...prev }; delete n[service_type]; return n; });
    pushBot(`✅ **${name}** selected for ${service_type.replace(/_/g, " ")}! Great choice. What's next?`);
  }, []);

  // Manual "Find vendor" click from the right panel
  const handleSearchVendors = useCallback((service_type, title) => {
    setEventState(prev => ({
      ...prev,
      services: prev.services.map(s =>
        s.service_type === service_type ? { ...s, searching: true } : s
      ),
    }));
    searchVendors(service_type, title);
  }, [searchVendors]);

  // Unselect vendor
  const handleUnselectVendor = useCallback((service_type) => {
    setEventState(prev => {
      const sv = { ...prev.selected_vendors };
      delete sv[service_type];
      return {
        ...prev,
        selected_vendors: sv,
        services: prev.services.map(s =>
          s.service_type === service_type ? { ...s, status: "pending" } : s
        ),
      };
    });
  }, []);

  // Quick type pick from empty panel
  const handlePickType = useCallback((label) => {
    sendMessage(`I want to plan a ${label}`);
  }, [sendMessage]);

  const hasEvent = !!eventState.event_type;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href={`/${lang}`} style={{ textDecoration: "none" }}>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ArrowLeft size={14} style={{ color: "#475569" }} />
              </motion.button>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#e11d5c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={13} style={{ color: "#fff" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>Event Planner</p>
                <p style={{ margin: 0, fontSize: "0.65rem", color: "#94a3b8", lineHeight: 1, marginTop: 1 }}>Powered by OpenAI · Salooote</p>
              </div>
            </div>
          </div>

          {hasEvent && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.3rem" }}>{eventState.event_type_emoji}</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{eventState.event_type_label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#94a3b8" }}>
                  {Object.keys(eventState.selected_vendors).length}/{eventState.services.filter(s => s.canSearch).length} vendors selected
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, maxWidth: 1400, margin: "0 auto", width: "100%", padding: "0 24px", display: "flex", gap: 24 }}>

        {/* LEFT — Chat panel (sticky) */}
        <div style={{ width: 400, flexShrink: 0, display: "flex", flexDirection: "column", position: "sticky", top: 58, height: "calc(100vh - 58px)", paddingTop: 20, paddingBottom: 20 }}>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 6, scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent", paddingBottom: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input); }}
            style={{ paddingTop: 12 }}
          >
            <div style={{
              display: "flex", gap: 8, background: "#fff",
              borderRadius: 16, padding: "6px 6px 6px 14px",
              border: "1.5px solid rgba(124,58,237,0.15)",
              boxShadow: "0 2px 16px rgba(124,58,237,0.07)",
              alignItems: "center",
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                placeholder="Describe your event..."
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: "0.875rem", background: "transparent",
                  color: "#0f172a", fontFamily: "inherit",
                }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || loading}
                whileHover={input.trim() && !loading ? { scale: 1.06 } : {}}
                whileTap={input.trim() && !loading ? { scale: 0.94 } : {}}
                style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: input.trim() && !loading ? "#e11d5c" : "#f1f5f9",
                  border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
              >
                {loading
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Loader2 size={15} style={{ color: "#94a3b8" }} /></motion.div>
                  : <Send size={15} style={{ color: input.trim() ? "#fff" : "#94a3b8" }} />
                }
              </motion.button>
            </div>
          </form>
        </div>

        {/* RIGHT — Live event plan */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 20, paddingBottom: 40 }}>
          <AnimatePresence mode="wait">
            {!hasEvent ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyPlan onPickType={handlePickType} />
              </motion.div>
            ) : (
              <motion.div key="plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <EventPlanPanel
                  eventState={eventState}
                  vendorResults={vendorResults}
                  onSelectVendor={handleSelectVendor}
                  onSearchVendors={handleSearchVendors}
                  onUnselectVendor={handleUnselectVendor}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
