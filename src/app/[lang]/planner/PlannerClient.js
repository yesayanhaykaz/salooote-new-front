"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, ArrowLeft, Check, Search, X, Star,
  ChevronDown, ChevronUp, ChevronRight, Users, Calendar,
  MapPin, DollarSign, Loader2, Heart,
  Building, Building2, Flame, Plus, User, Package,
  Cake, Camera, Video, Flower2, Music, Mic, Gem,
  Monitor, Smile, UtensilsCrossed, Briefcase, GraduationCap,
  Baby, AlertTriangle, Settings, Paperclip, Zap, Share2, Bookmark,
} from "lucide-react";

/* ─────────────────────────────────────────
   DESIGN TOKENS  — Salooote white theme
───────────────────────────────────────── */
const C = {
  bg:       "#f1f5f9",
  panel:    "#ffffff",
  surface:  "rgba(255,255,255,0.85)",
  border:   "rgba(15,23,42,0.07)",
  borderMd: "rgba(15,23,42,0.12)",
  text:     "#0f172a",
  text2:    "#64748b",
  text3:    "#94a3b8",
  brand:    "#e11d5c",
  purple:   "#7c3aed",
  green:    "#16a34a",
  grad:     "linear-gradient(135deg,#e11d5c,#7c3aed)",
  gradFull: "linear-gradient(135deg,#f97316,#e11d5c,#7c3aed)",
  userBg:   "linear-gradient(135deg,#e11d5c 0%,#7c3aed 100%)",
  botBg:    "#f8fafc",
};

/* ─────────────────────────────────────────
   ICON MAPS
───────────────────────────────────────── */
const SERVICE_ICON_MAP = {
  church: Building, baptism_candle: Flame, cross: Plus,
  kavor: User, kavork: User, baby_outfit: Package,
  venue: Building2, catering: UtensilsCrossed, cake: Cake,
  wedding_cake: Cake, photographer: Camera, videographer: Video,
  decoration: Sparkles, balloon_decoration: Sparkles,
  flowers: Flower2, music: Music, tamada: Mic, wedding_rings: Gem,
  ring: Gem, bridal_dress: Gem, ceremony_venue: Building,
  reception_venue: Building2, av_tech: Monitor,
  entertainment: Music, animator: Smile,
};
const getServiceIcon = (type, props = {}) => {
  const Icon = SERVICE_ICON_MAP[type] || Star;
  return <Icon {...props} />;
};

const EVENT_ICON_MAP = {
  christening: Building, wedding: Gem, birthday: Cake,
  kids_party: Smile, corporate: Briefcase, engagement: Heart,
  anniversary: Star, baby_shower: Baby, graduation: GraduationCap,
};
const getEventIcon = (type, props = {}) => {
  const Icon = EVENT_ICON_MAP[type] || Star;
  return <Icon {...props} />;
};

const CATEGORY_LABELS = {
  religious: "Religious", roles: "Key Roles", clothing: "Attire",
  ceremony: "Ceremony", reception: "Reception", celebration: "Celebration",
  food: "Food & Cake", decoration: "Decorations", media: "Photo & Video",
  entertainment: "Entertainment", attire: "Attire", venue: "Venue",
  tech: "Tech & AV", other: "Other",
};

/* ─────────────────────────────────────────
   EVENT TEMPLATES
───────────────────────────────────────── */
const EVENT_TEMPLATES = {
  christening: {
    label: "Christening / Baptism", accent: "#7c3aed",
    gradient: "linear-gradient(135deg,#7c3aed,#a855f7)",
    services: [
      { service_type: "church",         title: "Church Booking",              category: "religious",   required: true },
      { service_type: "baptism_candle", title: "Baptism Candle (Knonki Mom)", category: "religious",   required: true },
      { service_type: "cross",          title: "Cross Necklace for Baby",     category: "religious",   required: true },
      { service_type: "kavor",          title: "Godfather (Kavor)",           category: "roles",       required: true },
      { service_type: "kavork",         title: "Godmother (Kavork)",          category: "roles",       required: true },
      { service_type: "baby_outfit",    title: "White Baby Outfit",           category: "clothing",    required: true },
      { service_type: "venue",          title: "Celebration Venue",           category: "celebration", required: true,  canSearch: true },
      { service_type: "catering",       title: "Food & Catering",             category: "celebration", required: true,  canSearch: true },
      { service_type: "cake",           title: "Christening Cake",            category: "celebration", required: true,  canSearch: true },
      { service_type: "photographer",   title: "Photographer",                category: "media",       required: true,  canSearch: true },
      { service_type: "decoration",     title: "Decorations",                 category: "celebration", required: false, canSearch: true },
    ],
  },
  wedding: {
    label: "Wedding", accent: "#e11d5c",
    gradient: "linear-gradient(135deg,#e11d5c,#f97316)",
    services: [
      { service_type: "ceremony_venue",  title: "Ceremony Venue",  category: "ceremony",      required: true },
      { service_type: "reception_venue", title: "Reception Hall",  category: "reception",     required: true, canSearch: true },
      { service_type: "tamada",          title: "Tamada (MC)",     category: "entertainment", required: true },
      { service_type: "wedding_rings",   title: "Wedding Rings",   category: "ceremony",      required: true },
      { service_type: "bridal_dress",    title: "Bridal Gown",     category: "attire",        required: true },
      { service_type: "wedding_cake",    title: "Wedding Cake",    category: "food",          required: true, canSearch: true },
      { service_type: "catering",        title: "Catering",        category: "food",          required: true, canSearch: true },
      { service_type: "photographer",    title: "Photographer",    category: "media",         required: true, canSearch: true },
      { service_type: "videographer",    title: "Videographer",    category: "media",         required: true, canSearch: true },
      { service_type: "flowers",         title: "Bridal Flowers",  category: "decoration",    required: true, canSearch: true },
      { service_type: "music",           title: "DJ / Live Music", category: "entertainment", required: true, canSearch: true },
    ],
  },
  birthday: {
    label: "Birthday Party", accent: "#3b82f6",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    services: [
      { service_type: "cake",               title: "Birthday Cake",       category: "food",          required: true,  canSearch: true },
      { service_type: "venue",              title: "Venue",               category: "celebration",   required: true },
      { service_type: "catering",           title: "Catering",            category: "food",          required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations", category: "decoration",    required: true,  canSearch: true },
      { service_type: "music",              title: "Music / DJ",          category: "entertainment", required: false, canSearch: true },
      { service_type: "photographer",       title: "Photographer",        category: "media",         required: false, canSearch: true },
    ],
  },
  kids_party: {
    label: "Kids' Party", accent: "#10b981",
    gradient: "linear-gradient(135deg,#10b981,#059669)",
    services: [
      { service_type: "cake",               title: "Themed Cake",            category: "food",          required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations",    category: "decoration",    required: true,  canSearch: true },
      { service_type: "animator",           title: "Kids Animator",          category: "entertainment", required: true,  canSearch: true },
      { service_type: "venue",              title: "Venue",                  category: "celebration",   required: true },
      { service_type: "catering",           title: "Kids-Friendly Catering", category: "food",          required: true,  canSearch: true },
      { service_type: "decoration",         title: "Theme Decorations",      category: "decoration",    required: true,  canSearch: true },
      { service_type: "photographer",       title: "Photographer",           category: "media",         required: false, canSearch: true },
    ],
  },
  corporate: {
    label: "Corporate Event", accent: "#475569",
    gradient: "linear-gradient(135deg,#475569,#1e293b)",
    services: [
      { service_type: "venue",         title: "Conference / Event Venue", category: "venue",         required: true },
      { service_type: "catering",      title: "Catering & Coffee Breaks", category: "food",          required: true,  canSearch: true },
      { service_type: "av_tech",       title: "AV & Tech Setup",          category: "tech",          required: true },
      { service_type: "photographer",  title: "Event Photographer",       category: "media",         required: true,  canSearch: true },
      { service_type: "entertainment", title: "Evening Entertainment",    category: "entertainment", required: false, canSearch: true },
    ],
  },
  engagement: {
    label: "Engagement Party", accent: "#8b5cf6",
    gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    services: [
      { service_type: "ring",         title: "Engagement Ring", category: "ceremony",    required: true },
      { service_type: "flowers",      title: "Flowers",         category: "decoration",  required: true, canSearch: true },
      { service_type: "photographer", title: "Photographer",    category: "media",       required: true, canSearch: true },
      { service_type: "venue",        title: "Party Venue",     category: "celebration", required: true },
      { service_type: "cake",         title: "Engagement Cake", category: "food",        required: true, canSearch: true },
      { service_type: "catering",     title: "Food & Drinks",   category: "food",        required: true, canSearch: true },
    ],
  },
  anniversary: {
    label: "Anniversary", accent: "#d97706",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    services: [
      { service_type: "flowers",      title: "Flower Arrangement", category: "decoration",  required: true, canSearch: true },
      { service_type: "venue",        title: "Restaurant / Venue", category: "celebration", required: true },
      { service_type: "cake",         title: "Anniversary Cake",   category: "food",        required: true, canSearch: true },
      { service_type: "catering",     title: "Dinner / Catering",  category: "food",        required: true, canSearch: true },
      { service_type: "photographer", title: "Photographer",       category: "media",       required: false, canSearch: true },
    ],
  },
  baby_shower: {
    label: "Baby Shower", accent: "#0ea5e9",
    gradient: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    services: [
      { service_type: "balloon_decoration", title: "Balloon Decorations",    category: "decoration", required: true,  canSearch: true },
      { service_type: "cake",               title: "Baby Shower Cake",       category: "food",       required: true,  canSearch: true },
      { service_type: "catering",           title: "Finger Food / Catering", category: "food",       required: true,  canSearch: true },
      { service_type: "decoration",         title: "Theme Decorations",      category: "decoration", required: true,  canSearch: true },
      { service_type: "photographer",       title: "Photographer",           category: "media",      required: false, canSearch: true },
    ],
  },
  graduation: {
    label: "Graduation Party", accent: "#ea580c",
    gradient: "linear-gradient(135deg,#f59e0b,#ea580c)",
    services: [
      { service_type: "venue",              title: "Venue",            category: "celebration", required: true },
      { service_type: "cake",               title: "Graduation Cake",  category: "food",        required: true,  canSearch: true },
      { service_type: "catering",           title: "Catering",         category: "food",        required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloons & Decor", category: "decoration",  required: false, canSearch: true },
      { service_type: "photographer",       title: "Photographer",     category: "media",       required: false, canSearch: true },
    ],
  },
};

/* ─────────────────────────────────────────
   ACTION PROCESSOR
───────────────────────────────────────── */
function applyActions(actions, prev) {
  let state = { ...prev };
  const searches = [];
  for (const a of actions) {
    switch (a.type) {
      case "set_event_type": {
        if (state.event_type === a.event_type) break;
        const tpl = EVENT_TEMPLATES[a.event_type];
        state = {
          ...state, event_type: a.event_type,
          event_type_label: tpl?.label || a.event_type,
          accent: tpl?.accent || C.brand,
          gradient: tpl?.gradient,
          services: state.services?.length ? state.services : (tpl?.services || []).map(s => ({ ...s, status: "pending" })),
        };
        break;
      }
      case "set_guest_count": state = { ...state, guest_count: a.guest_count }; break;
      case "set_location":    state = { ...state, city: a.city }; break;
      case "set_event_date":  state = { ...state, date: a.date }; break;
      case "set_budget":      state = { ...state, budget: { description: a.description, budget_level: a.budget_level } }; break;
      case "set_style":       state = { ...state, style: a.style }; break;
      case "set_notes":       state = { ...state, notes: a.notes }; break;
      case "add_service": {
        if (!state.services?.find(s => s.service_type === a.service_type))
          state = { ...state, services: [...(state.services || []), { service_type: a.service_type, title: a.title || a.service_type.replace(/_/g, " "), category: a.category || "other", required: a.priority === "required", status: "pending", canSearch: true }] };
        break;
      }
      case "remove_service":
        state = { ...state, services: (state.services || []).filter(s => s.service_type !== a.service_type) }; break;
      case "mark_required_item":
      case "mark_optional_item": {
        if (!state.services?.find(s => s.service_type === a.item_type))
          state = { ...state, services: [...(state.services || []), { service_type: a.item_type, title: a.title || a.item_type.replace(/_/g, " "), category: a.category || "other", required: a.type === "mark_required_item", status: "pending" }] };
        break;
      }
      case "search_vendors":
        searches.push(a);
        state = { ...state, services: (state.services || []).map(s => s.service_type === a.service_type ? { ...s, searching: true } : s) };
        break;
      case "select_vendor":
        state = {
          ...state,
          selected_vendors: { ...state.selected_vendors, [a.service_type]: { id: a.vendor_id, name: a.vendor_name } },
          services: (state.services || []).map(s => s.service_type === a.service_type ? { ...s, status: "selected", searching: false } : s),
        };
        break;
      case "unselect_vendor": {
        const sv = { ...state.selected_vendors }; delete sv[a.service_type];
        state = { ...state, selected_vendors: sv, services: (state.services || []).map(s => s.service_type === a.service_type ? { ...s, status: "pending" } : s) };
        break;
      }
      default: break;
    }
  }
  return { state, searches };
}

/* ─────────────────────────────────────────
   SUGGESTION GENERATOR
───────────────────────────────────────── */
function getContextSuggestions(eventState) {
  if (!eventState.event_type) {
    return ["Plan a wedding", "Plan a birthday", "Christening ideas", "Corporate event"];
  }
  if (!eventState.date && !eventState.city) {
    return ["Set date & city", "How many guests?", "What's my budget?"];
  }
  if (!eventState.city) return ["Event is in Yerevan", "Set location", "Show checklist"];
  if (!eventState.date) return ["Set a date", "Tell me the budget", "What do I need?"];
  const needed = (eventState.services || []).filter(
    s => s.canSearch && !eventState.selected_vendors?.[s.service_type] && !s.searching
  );
  if (needed.length > 0) {
    const chips = [`Find ${needed[0].title}`];
    if (needed[1]) chips.push(`Find ${needed[1].title}`);
    chips.push("What's left to book?");
    return chips;
  }
  return ["Add more services", "Budget breakdown?", "Share my plan"];
}

/* ─────────────────────────────────────────
   BOT AVATAR  (small orb for chat)
───────────────────────────────────────── */
function BotAvatar({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 32% 28%, #f0abfc 0%, #a855f7 30%, #7c3aed 58%, #1e1b4b 100%)",
      boxShadow: "0 2px 10px rgba(124,58,237,0.3)", overflow: "hidden", position: "relative",
    }}>
      <div style={{ position: "absolute", top: "12%", left: "16%", width: "36%", height: "30%", borderRadius: "50%", background: "rgba(255,255,255,0.35)", filter: "blur(2px)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   ORB LARGE  (welcome screen)
───────────────────────────────────────── */
function OrbLarge({ size = 68 }) {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size, borderRadius: "50%", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: -size * 0.25, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle at 35% 28%,#f0abfc 0%,#a855f7 30%,#7c3aed 58%,#1e1b4b 100%)", boxShadow: `0 0 ${size * 0.4}px rgba(168,85,247,0.4),0 ${size * 0.15}px ${size * 0.4}px rgba(0,0,0,0.1)`, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: "12%", left: "18%", width: "38%", height: "32%", borderRadius: "50%", background: "rgba(255,255,255,0.35)", filter: "blur(4px)", transform: "rotate(-25deg)" }} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   TYPING INDICATOR
───────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 18 }}>
      <BotAvatar />
      <div style={{ paddingBottom: 2 }}>
        <div style={{ fontSize: 11, color: C.text3, marginBottom: 5, fontWeight: 500 }}>Salooote AI</div>
        <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: C.botBg, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", width: "fit-content", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[0, 0.15, 0.3].map((d, i) => (
            <motion.span key={i}
              animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 0.65, repeat: Infinity, delay: d, ease: "easeInOut" }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: C.grad, display: "block" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUGGESTION CHIP
───────────────────────────────────────── */
function SuggestionChip({ text, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(text)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${C.brand}08` : "transparent",
        border: `1px solid ${hov ? C.brand + "44" : C.borderMd}`,
        borderRadius: 999, padding: "5px 12px",
        fontSize: 12, color: hov ? C.brand : C.text2,
        cursor: "pointer", transition: "all 0.18s",
        fontFamily: "inherit", whiteSpace: "nowrap",
      }}
    >{text}</button>
  );
}

/* ─────────────────────────────────────────
   MESSAGE BUBBLE
───────────────────────────────────────── */
function MessageBubble({ msg, onSuggestionClick }) {
  const isBot = msg.role === "bot";
  const lines = msg.text.split("\n");
  const renderLine = (line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={li}>
        {parts.map((p, j) => p.startsWith("**") && p.endsWith("**")
          ? <strong key={j} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : p)}
        {li < lines.length - 1 && <br />}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: isBot ? "flex-start" : "flex-end", marginBottom: 18 }}
    >
      {isBot && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "82%" }}>
          <BotAvatar />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.text3, marginBottom: 4, fontWeight: 500 }}>Salooote AI</div>
            <div style={{
              background: C.botBg, border: `1px solid ${C.border}`,
              borderRadius: "18px 18px 18px 4px", padding: "11px 15px",
              fontSize: "0.875rem", lineHeight: 1.65, color: C.text,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              {lines.map(renderLine)}
            </div>
            {msg.suggestions?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {msg.suggestions.map(s => (
                  <SuggestionChip key={s} text={s} onClick={onSuggestionClick} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {!isBot && (
        <div style={{ maxWidth: "76%" }}>
          <div style={{
            background: C.userBg, borderRadius: "18px 18px 4px 18px",
            padding: "11px 15px", fontSize: "0.875rem", lineHeight: 1.65, color: "#fff",
            boxShadow: "0 4px 16px rgba(225,29,92,0.22)",
          }}>
            {lines.map(renderLine)}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   CHAT PANEL HEADER
───────────────────────────────────────── */
function ChatPanelHeader({ onNewChat }) {
  return (
    <div style={{
      padding: "14px 20px 12px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: `1px solid ${C.border}`, flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <BotAvatar size={34} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>Salooote AI</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "inline-block" }} />
          </div>
          <div style={{ fontSize: 11, color: C.text3 }}>Event planning assistant · Online</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button onClick={onNewChat} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          borderRadius: 999, padding: "5px 12px", fontSize: 11.5,
          color: C.text2, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 5,
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "44"; e.currentTarget.style.color = C.brand; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text2; }}
        >
          <Plus size={11} /> New chat
        </button>
        <button style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.text3, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text2; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}
        >
          <Settings size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPOSER (input + pills)
───────────────────────────────────────── */
function Composer({ input, setInput, onSend, loading, onSuggestionClick }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const canSend = !!input.trim() && !loading;

  return (
    <div style={{ padding: "12px 18px 16px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
      {/* Input row */}
      <div style={{
        background: focused ? "transparent" : "transparent",
        borderRadius: 18,
        padding: focused ? "1.5px" : "1.5px",
        backgroundImage: focused ? C.gradFull : "none",
        boxShadow: focused ? "0 0 24px rgba(225,29,92,0.12),0 0 48px rgba(124,58,237,0.08)" : "none",
        transition: "box-shadow 0.25s",
      }}>
        <div style={{
          background: "#f8fafc", border: focused ? "none" : `1px solid ${C.borderMd}`,
          borderRadius: focused ? 16.5 : 18, padding: "9px 10px 9px 14px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Sparkles size={14} color={focused ? C.brand : C.text3} strokeWidth={2} style={{ flexShrink: 0, transition: "color 0.2s" }} />
          <form onSubmit={e => { e.preventDefault(); onSend(input); }} style={{ display: "flex", flex: 1, alignItems: "center", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={loading}
              placeholder="Ask anything about your event…"
              autoFocus
              style={{ flex: 1, border: "none", outline: "none", fontSize: "0.875rem", background: "transparent", color: C.text, fontFamily: "inherit" }}
            />
            {/* Mic */}
            <button type="button" style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: "transparent", border: `1px solid ${C.border}`,
              color: C.text3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text2; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}
            >
              <Mic size={12} />
            </button>
            {/* Send */}
            <motion.button type="submit" disabled={!canSend}
              whileHover={canSend ? { scale: 1.08 } : {}}
              whileTap={canSend ? { scale: 0.92 } : {}}
              style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0, border: "none",
                background: canSend ? C.grad : "rgba(15,23,42,0.07)",
                cursor: canSend ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: canSend ? "0 4px 14px rgba(225,29,92,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {loading
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}><Loader2 size={14} color={C.text3} /></motion.div>
                : <Send size={14} color={canSend ? "#fff" : C.text3} strokeWidth={2.2} />
              }
            </motion.button>
          </form>
        </div>
      </div>

      {/* Quick pills */}
      <div style={{ display: "flex", gap: 6, marginTop: 10, paddingLeft: 2 }}>
        {[
          { icon: <Paperclip size={11} />, label: "Attach" },
          { icon: <Bookmark size={11} />, label: "Add to plan" },
          { icon: <Zap size={11} />, label: "Inspire me" },
        ].map(({ icon, label }) => (
          <button key={label}
            onClick={() => label === "Inspire me" && onSuggestionClick("Give me event ideas and inspiration")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 999, padding: "5px 11px",
              fontSize: 11.5, color: C.text3, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "40"; e.currentTarget.style.color = C.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "0.62rem", color: C.text3, textAlign: "center" }}>
        AI may make mistakes · Always verify with vendors
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   CHAT WELCOME
───────────────────────────────────────── */
const FEATURES = [
  { icon: <Star size={17} color={C.brand} />, title: "Smart Checklist", desc: "Complete checklist built from your event type instantly" },
  { icon: <Search size={17} color={C.purple} />, title: "Find Vendors", desc: "Real vendors in your city, searched instantly" },
  { icon: <Heart size={17} color="#0ea5e9" />, title: "Cultural Tips", desc: "Armenian traditions & cultural guidance included" },
];

function ChatWelcome() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "28px 24px", textAlign: "center" }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }} style={{ marginBottom: 22 }}>
        <OrbLarge size={68} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: 24, maxWidth: 320 }}>
        <h2 style={{ margin: "0 0 10px", fontSize: "1.3rem", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.35 }}>
          Hi! I'm your{" "}
          <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 800 }}>
            AI event planner
          </span>
          {" "}ready to build the perfect celebration.
        </h2>
        <p style={{ margin: 0, fontSize: "0.84rem", color: C.text2, lineHeight: 1.6 }}>
          Tell me your event type, guests, city and style.<br />I'll handle everything else.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, width: "100%", maxWidth: 400 }}>
        {FEATURES.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 + i * 0.07 }}
            style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 12px", textAlign: "left", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ marginBottom: 8 }}>{f.icon}</div>
            <p style={{ margin: "0 0 4px", fontSize: "0.74rem", fontWeight: 700, color: C.text }}>{f.title}</p>
            <p style={{ margin: 0, fontSize: "0.66rem", color: C.text3, lineHeight: 1.5 }}>{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   VENDOR CARD  (in service results)
───────────────────────────────────────── */
const VENDOR_PALETTES = [
  ["#7c3aed", "rgba(124,58,237,0.07)"], ["#e11d5c", "rgba(225,29,92,0.07)"],
  ["#059669", "rgba(5,150,105,0.07)"],  ["#d97706", "rgba(217,119,6,0.07)"],
  ["#0891b2", "rgba(8,145,178,0.07)"],  ["#db2777", "rgba(219,39,119,0.07)"],
];

function VendorCard({ vendor, onSelect }) {
  const [hov, setHov] = useState(false);
  const name   = vendor.business_name || vendor.name || "Vendor";
  const rating = parseFloat(vendor.rating) || 0;
  const city   = vendor.city || "";
  const [fg, bg] = VENDOR_PALETTES[name.charCodeAt(0) % VENDOR_PALETTES.length];
  return (
    <motion.div
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      initial={{ opacity: 0, scale: 0.92, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 340, damping: 24 }}
      style={{
        background: "#fff", border: `1px solid ${hov ? fg + "44" : C.border}`,
        boxShadow: hov ? `0 10px 28px ${fg}18,0 2px 8px rgba(0,0,0,0.04)` : "0 2px 6px rgba(0,0,0,0.04)",
        borderRadius: 12, minWidth: 152, maxWidth: 172, flexShrink: 0,
        overflow: "hidden", cursor: "pointer", transition: "border-color 0.18s,box-shadow 0.18s",
      }}
    >
      {/* color top bar */}
      <div style={{ height: 3, background: hov ? `linear-gradient(90deg,${fg},${fg}88)` : C.border }} />
      <div style={{ padding: "11px 12px 12px" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800, color: fg, marginBottom: 8 }}>
          {name[0]?.toUpperCase() || "V"}
        </div>
        <p style={{ margin: "0 0 2px", fontSize: "0.75rem", fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 9, minHeight: 15 }}>
          {rating > 0 && <><Star size={9} style={{ color: "#f59e0b", fill: "#f59e0b", flexShrink: 0 }} /><span style={{ fontSize: "0.67rem", color: C.text2, fontWeight: 600 }}>{rating.toFixed(1)}</span></>}
          {city && <span style={{ fontSize: "0.65rem", color: C.text3, marginLeft: rating > 0 ? 2 : 0 }}>{rating > 0 ? "· " : ""}{city}</span>}
        </div>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => onSelect(vendor)}
          style={{
            width: "100%", background: hov ? `linear-gradient(135deg,${fg},${fg}cc)` : "transparent",
            border: `1px solid ${hov ? fg : C.borderMd}`, borderRadius: 7,
            color: hov ? "#fff" : C.text2, fontSize: "0.69rem", fontWeight: 600,
            padding: "5px 0", cursor: "pointer", transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
          }}>
          Select <ChevronRight size={10} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SERVICE ROW
───────────────────────────────────────── */
function ServiceRow({ service, selectedVendor, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor, accent }) {
  const results    = vendorResults[service.service_type] || [];
  const isSelected = !!selectedVendor;
  const isSearching = service.searching;
  const hasResults = results.length > 0 && !isSelected;
  const iconColor  = isSelected ? C.green : (accent || C.purple);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0" }}>
        <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isSelected ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 460, damping: 22 }}
              style={{ width: 20, height: 20, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={11} color={C.green} strokeWidth={2.5} />
            </motion.div>
          ) : isSearching ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${(accent || C.purple)}22`, borderTopColor: accent || C.purple }} />
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${C.borderMd}` }} />
          )}
        </div>
        <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.65 }}>
          {getServiceIcon(service.service_type, { size: 14, color: iconColor, strokeWidth: 1.8 })}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "0.79rem", fontWeight: 600, color: isSelected ? "#15803d" : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {service.title}
          </p>
          {isSelected && selectedVendor && <p style={{ margin: "1px 0 0", fontSize: "0.69rem", color: C.green, fontWeight: 500 }}>{selectedVendor.name}</p>}
          {!service.required && !isSelected && <span style={{ fontSize: "0.6rem", background: "rgba(15,23,42,0.04)", color: C.text3, border: `1px solid ${C.border}`, borderRadius: 100, padding: "1px 6px", fontWeight: 600 }}>optional</span>}
        </div>
        <div style={{ flexShrink: 0 }}>
          {isSelected ? (
            <button onClick={() => onUnselectVendor(service.service_type)}
              style={{ border: "none", background: "none", cursor: "pointer", padding: "3px 4px", color: C.text3, display: "flex", alignItems: "center", borderRadius: 6, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.text2} onMouseLeave={e => e.currentTarget.style.color = C.text3}>
              <X size={13} />
            </button>
          ) : hasResults ? (
            <span style={{ fontSize: "0.65rem", background: "#fefce8", color: "#854d0e", fontWeight: 700, borderRadius: 100, padding: "2px 8px", border: "1px solid #fef08a" }}>
              {results.length} found
            </span>
          ) : service.canSearch && !isSearching ? (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => onSearchVendors(service.service_type, service.title)}
              style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#f8fafc", border: `1px solid ${C.borderMd}`, color: C.text2, borderRadius: 8, padding: "5px 10px", fontSize: "0.69rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = C.text2; }}>
              <Search size={9} strokeWidth={2.5} /> Find
            </motion.button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {hasResults && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: "hidden", paddingLeft: 48, paddingBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
              {results.slice(0, 6).map((v, i) => <VendorCard key={v.id || i} vendor={v} onSelect={vendor => onSelectVendor(service.service_type, vendor)} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   CATEGORY SECTION
───────────────────────────────────────── */
function CategorySection({ label, services, selectedVendors, ...rowProps }) {
  const [open, setOpen] = useState(true);
  const done = services.filter(s => selectedVendors?.[s.service_type]).length;
  const all  = done === services.length;
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 6, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "9px 13px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: "0.66rem", fontWeight: 700, color: C.text2, letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</span>
          {done > 0 && (
            <span style={{ fontSize: "0.61rem", fontWeight: 700, borderRadius: 100, padding: "2px 7px", background: all ? "#f0fdf4" : "rgba(15,23,42,0.04)", color: all ? "#16a34a" : C.text3, border: `1px solid ${all ? "#bbf7d0" : C.border}` }}>
              {done}/{services.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={12} style={{ color: C.text3 }} /> : <ChevronDown size={12} style={{ color: C.text3 }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 13px 8px", borderTop: `1px solid ${C.border}` }}>
              {services.map((s, idx) => (
                <div key={s.service_type}>
                  {idx > 0 && <div style={{ height: 1, background: "rgba(15,23,42,0.04)" }} />}
                  <ServiceRow service={s} selectedVendor={selectedVendors?.[s.service_type]} {...rowProps} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   META CHIP  (right panel header)
───────────────────────────────────────── */
function MetaChip({ icon, children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(15,23,42,0.04)", border: `1px solid ${C.border}`,
      borderRadius: 999, padding: "5px 11px",
      fontSize: 12, color: C.text2, whiteSpace: "nowrap",
    }}>
      {icon}{children}
    </div>
  );
}

/* ─────────────────────────────────────────
   BUDGET BAR
───────────────────────────────────────── */
function BudgetBar({ sel, total }) {
  const pct = total > 0 ? Math.round((sel / total) * 100) : 0;
  return (
    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.07em", textTransform: "uppercase" }}>Vendor Progress</span>
        <span style={{ fontSize: 12, color: C.text2 }}>
          <span style={{ color: C.text, fontWeight: 700 }}>{sel}</span> / {total} confirmed
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: "rgba(15,23,42,0.06)", overflow: "hidden" }}>
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ height: "100%", background: C.grad, borderRadius: 999, boxShadow: "0 0 8px rgba(225,29,92,0.3)" }} />
      </div>
      <div style={{ fontSize: "0.65rem", color: C.text3, marginTop: 5, fontFamily: "monospace" }}>
        {pct}% allocated · {total - sel} still needed
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TIMELINE
───────────────────────────────────────── */
function PlanTimeline({ services, selectedVendors }) {
  const items = services.slice(0, 7);
  const firstActiveIdx = items.findIndex(s => !selectedVendors[s.service_type]);
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Timeline</div>
      <div style={{ position: "relative", paddingLeft: 22 }}>
        <div style={{ position: "absolute", left: 7, top: 6, bottom: 6, width: 1, background: C.border }} />
        {items.map((item, i) => {
          const isDone   = !!selectedVendors[item.service_type];
          const isActive = !isDone && i === firstActiveIdx;
          return (
            <div key={item.service_type} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", position: "relative" }}>
              <div style={{
                position: "absolute", left: -22,
                width: 15, height: 15, borderRadius: "50%",
                background: isDone ? "#f0fdf4" : isActive ? `${C.brand}12` : "#f8fafc",
                border: isDone ? "1.5px solid #86efac" : isActive ? `2px solid ${C.brand}` : `1.5px solid ${C.borderMd}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                animation: isActive ? "plannerGlow 1.8s infinite" : "none",
              }}>
                {isDone && <Check size={8} color={C.green} strokeWidth={2.5} />}
              </div>
              <span style={{
                fontSize: "0.78rem", lineHeight: 1.4,
                color: isDone ? C.text3 : isActive ? C.text : C.text2,
                fontWeight: isActive ? 600 : 400,
                textDecoration: isDone ? "line-through" : "none",
              }}>{item.title}</span>
              {isActive && (
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: C.brand, background: `${C.brand}10`, border: `1px solid ${C.brand}28`, borderRadius: 100, padding: "2px 7px", flexShrink: 0 }}>Now</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROGRESS BY CATEGORY
───────────────────────────────────────── */
function ProgressByCategory({ services, selectedVendors }) {
  const grouped = {};
  for (const s of services) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }
  const entries = Object.entries(grouped).slice(0, 5);
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Progress</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {entries.map(([cat, items]) => {
          const done = items.filter(s => selectedVendors[s.service_type]).length;
          const pct  = done / items.length;
          const complete = pct === 1;
          return (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "rgba(15,23,42,0.02)", border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <div style={{ flex: 1, fontSize: "0.76rem", color: C.text2 }}>{CATEGORY_LABELS[cat] || cat}</div>
              <div style={{ width: 72, height: 3, borderRadius: 999, background: C.border, overflow: "hidden" }}>
                <div style={{ width: `${pct * 100}%`, height: "100%", background: complete ? "#86efac" : C.brand, borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: "0.68rem", color: complete ? C.green : C.text3, fontWeight: 700, width: 26, textAlign: "right" }}>{done}/{items.length}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PLAN PANEL (right, when event active)
───────────────────────────────────────── */
function EventPlanPanel({ eventState, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor }) {
  const { event_type, event_type_label, accent, date, city, guest_count, budget, services = [], selected_vendors = {} } = eventState;
  const searchable = services.filter(s => s.canSearch);
  const sel = Object.keys(selected_vendors).length;
  const grouped = {};
  for (const s of services) { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); }
  const missing = services.filter(s => s.required && s.canSearch && !selected_vendors[s.service_type]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Event header */}
      <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: C.brand, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.brand, boxShadow: `0 0 8px ${C.brand}`, display: "inline-block", animation: "plannerGlow 2s infinite" }} />
              Planning in progress
            </div>
            <h2 style={{ margin: 0, fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 400, color: C.text, lineHeight: 1.2, letterSpacing: "-0.03em", fontFamily: "'Georgia', 'Playfair Display', serif" }}>
              {event_type_label}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 10px", fontSize: 11.5, color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
              <Bookmark size={11} /> Save
            </button>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 10px", fontSize: 11.5, color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
              <Share2 size={11} /> Share
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {date       && <MetaChip icon={<Calendar size={11} color={C.brand} />}>{date}</MetaChip>}
          {city       && <MetaChip icon={<MapPin    size={11} color={C.brand} />}>{city}</MetaChip>}
          {guest_count && <MetaChip icon={<Users    size={11} color={C.brand} />}>{guest_count} guests</MetaChip>}
          {budget?.description && <MetaChip icon={<DollarSign size={11} color={C.brand} />}>{budget.description}</MetaChip>}
        </div>
      </div>

      {/* Budget bar */}
      <BudgetBar sel={sel} total={searchable.length} />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>

        {/* Missing items warning */}
        {missing.length > 0 && sel > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fffbeb", border: "1px solid #fef08a", borderRadius: 10, padding: "9px 13px", marginBottom: 12, display: "flex", gap: 9, alignItems: "flex-start" }}>
            <AlertTriangle size={14} color="#92400e" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ margin: "0 0 2px", fontSize: "0.76rem", fontWeight: 700, color: "#92400e" }}>Still needed:</p>
              <p style={{ margin: 0, fontSize: "0.71rem", color: "#b45309", lineHeight: 1.5 }}>{missing.map(s => s.title).join(" · ")}</p>
            </div>
          </motion.div>
        )}

        {/* Category sections */}
        <div style={{ marginBottom: 16 }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <CategorySection key={cat} label={CATEGORY_LABELS[cat] || cat} services={items} selectedVendors={selected_vendors}
              vendorResults={vendorResults} onSelectVendor={onSelectVendor} onSearchVendors={onSearchVendors} onUnselectVendor={onUnselectVendor} accent={accent} />
          ))}
        </div>

        {/* Bottom: timeline + progress side by side */}
        {services.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 4 }}>
            <PlanTimeline services={services} selectedVendors={selected_vendors} />
            <ProgressByCategory services={services} selectedVendors={selected_vendors} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RIGHT EMPTY STATE  (event type picker)
───────────────────────────────────────── */
const EVENT_TYPES_GRID = [
  { key: "christening", label: "Christening", color: "#7c3aed" },
  { key: "wedding",     label: "Wedding",     color: "#e11d5c" },
  { key: "birthday",    label: "Birthday",    color: "#3b82f6" },
  { key: "kids_party",  label: "Kids Party",  color: "#10b981" },
  { key: "corporate",   label: "Corporate",   color: "#475569" },
  { key: "baby_shower", label: "Baby Shower", color: "#0ea5e9" },
  { key: "engagement",  label: "Engagement",  color: "#8b5cf6" },
  { key: "graduation",  label: "Graduation",  color: "#ea580c" },
];

function RightEmptyState({ onPickType }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "32px 20px", textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 24 }}>
        <p style={{ margin: "0 0 5px", fontSize: "0.65rem", fontWeight: 700, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase" }}>Quick start</p>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>Pick an event type</h3>
        <p style={{ margin: 0, fontSize: "0.81rem", color: C.text2, lineHeight: 1.5, maxWidth: 240 }}>Or describe your event in chat and I'll build the plan automatically.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, width: "100%", maxWidth: 360 }}>
        {EVENT_TYPES_GRID.map((t, i) => (
          <motion.button key={t.key}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 + i * 0.04, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.96 }}
            onClick={() => onPickType(t.label)}
            style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${t.color}09`; e.currentTarget.style.borderColor = `${t.color}40`; e.currentTarget.style.boxShadow = `0 8px 20px ${t.color}14`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${t.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {getEventIcon(t.key, { size: 17, color: t.color, strokeWidth: 1.8 })}
            </div>
            <span style={{ fontSize: "0.61rem", fontWeight: 700, color: C.text2 }}>{t.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
const INITIAL_STATE = {
  event_type: null, event_type_label: null,
  accent: C.brand, gradient: null, date: null, city: null,
  guest_count: null, style: null, budget: null, notes: null,
  services: [], selected_vendors: {},
};

const SITE_HEADER_H = 64;

export default function PlannerClient({ lang }) {
  const [messages,      setMessages]      = useState([]);
  const [eventState,    setEventState]    = useState(INITIAL_STATE);
  const [vendorResults, setVendorResults] = useState({});
  const [loading,       setLoading]       = useState(false);
  const [input,         setInput]         = useState("");

  const msgsRef = useRef(null);

  const scrollToBottom = useCallback(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, []);
  useEffect(() => { scrollToBottom(); }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (eventState.event_type)
      localStorage.setItem("salooote_planner", JSON.stringify({ eventState, vendorResults }));
  }, [eventState, vendorResults]);

  // Welcome message
  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{
        id: 1, role: "bot",
        text: "Hi! I'm your Salooote event planner.\n\nDescribe what you want to plan — event type, guests, city, style. I'll build your complete checklist and find vendors instantly!",
        suggestions: ["Plan a wedding", "Plan a birthday", "Christening ideas", "Corporate event"],
      }]);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const pushBot = useCallback((text, currentState) => {
    const suggestions = getContextSuggestions(currentState || eventState);
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "bot", text, suggestions }]);
  }, [eventState]);

  const searchVendors = useCallback(async (service_type, search_term, filters = {}) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const term = search_term || service_type.replace(/_/g, " ");
      const params = new URLSearchParams({ search: term, limit: "8" });
      const city = filters.city || eventState.city;
      if (city) params.set("city", city);
      let data = null;
      try { const r = await fetch(`${base}/vendors?${params}`); if (r.ok) { const j = await r.json(); data = j.data || []; } } catch {}
      if (!data?.length) { const r = await fetch(`${base}/products?${params}`); if (r.ok) { const j = await r.json(); data = (j.data || []).map(p => ({ id: p.id, business_name: p.vendor_name || p.name, name: p.vendor_name || p.name, rating: p.rating, city: p.vendor_city || city || "", slug: p.vendor_slug || "" })); } }
      if (data?.length) setVendorResults(prev => ({ ...prev, [service_type]: data }));
      setEventState(prev => ({ ...prev, services: prev.services.map(s => s.service_type === service_type ? { ...s, searching: false } : s) }));
    } catch {
      setEventState(prev => ({ ...prev, services: prev.services.map(s => s.service_type === service_type ? { ...s, searching: false } : s) }));
    }
  }, [eventState.city]);

  const sendMessage = useCallback(async (text) => {
    const t = text.trim();
    if (!t || loading) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", text: t };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/planner/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.text })), event_state: eventState }),
      });
      const json = await res.json();
      const data = json.data || json;
      if (data.error) { pushBot(`${data.error}`, eventState); return; }
      const { state: newState, searches } = applyActions(data.actions || [], eventState);
      setEventState(newState);
      if (data.assistant_message) pushBot(data.assistant_message, newState);
      for (const s of searches) searchVendors(s.service_type, s.search_term, s.filters || {});
    } catch {
      pushBot("Something went wrong. Please try again.", eventState);
    } finally {
      setLoading(false);
    }
  }, [messages, eventState, loading, searchVendors, pushBot]);

  const handleSelectVendor = useCallback((service_type, vendor) => {
    const name = vendor.business_name || vendor.name || "Vendor";
    setEventState(prev => ({
      ...prev,
      selected_vendors: { ...prev.selected_vendors, [service_type]: { id: vendor.id, name } },
      services: prev.services.map(s => s.service_type === service_type ? { ...s, status: "selected", searching: false } : s),
    }));
    setVendorResults(prev => { const n = { ...prev }; delete n[service_type]; return n; });
    setMessages(prev => {
      const newState = { ...eventState, selected_vendors: { ...eventState.selected_vendors, [service_type]: { id: vendor.id, name } } };
      return [...prev, { id: Date.now() + Math.random(), role: "bot", text: `**${name}** added for **${service_type.replace(/_/g, " ")}**. What's next?`, suggestions: getContextSuggestions(newState) }];
    });
  }, [eventState]);

  const handleSearchVendors = useCallback((service_type, title) => {
    setEventState(prev => ({ ...prev, services: prev.services.map(s => s.service_type === service_type ? { ...s, searching: true } : s) }));
    searchVendors(service_type, title);
  }, [searchVendors]);

  const handleUnselectVendor = useCallback(service_type => {
    setEventState(prev => {
      const sv = { ...prev.selected_vendors }; delete sv[service_type];
      return { ...prev, selected_vendors: sv, services: prev.services.map(s => s.service_type === service_type ? { ...s, status: "pending" } : s) };
    });
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([{ id: 1, role: "bot", text: "Hi! I'm your Salooote event planner.\n\nDescribe what you want to plan — event type, guests, city, style. I'll build your complete checklist and find vendors instantly!", suggestions: ["Plan a wedding", "Plan a birthday", "Christening ideas", "Corporate event"] }]);
    setEventState(INITIAL_STATE);
    setVendorResults({});
  }, []);

  const hasEvent    = !!eventState.event_type;
  const showWelcome = messages.length <= 1 && !hasEvent;

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(15,23,42,0.1);border-radius:10px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(15,23,42,0.18);}
        .planner-hide-scroll::-webkit-scrollbar{display:none;}
        .planner-hide-scroll{scrollbar-width:none;-ms-overflow-style:none;}
        @keyframes plannerGlow{0%,100%{box-shadow:0 0 0 0 rgba(225,29,92,0.35);}50%{box-shadow:0 0 0 6px rgba(225,29,92,0);}}
        @keyframes plannerPulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
      `}</style>

      <div style={{ height: `calc(100vh - ${SITE_HEADER_H}px)`, display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden", position: "relative" }}>

        {/* Subtle bg orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "45%", height: "50%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(225,29,92,0.055) 0%,transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: "0", left: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(124,58,237,0.055) 0%,transparent 65%)" }} />
        </div>

        {/* Top bar */}
        <div style={{
          height: 52, flexShrink: 0, position: "relative", zIndex: 10,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href={`/${lang}`} style={{ textDecoration: "none" }}>
              <motion.button whileHover={{ background: "rgba(15,23,42,0.05)" }} whileTap={{ scale: 0.93 }}
                style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ArrowLeft size={13} color={C.text2} />
              </motion.button>
            </Link>
            <div style={{ width: 1, height: 18, background: C.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.grad, borderRadius: 100, padding: "5px 14px", boxShadow: "0 4px 14px rgba(225,29,92,0.22)" }}>
              <Sparkles size={11} color="#fff" strokeWidth={2.2} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>AI Planner</span>
            </div>
          </div>

          {hasEvent && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 100, padding: "5px 14px 5px 10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${eventState.accent || C.brand}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {getEventIcon(eventState.event_type, { size: 12, color: eventState.accent || C.brand, strokeWidth: 2 })}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: C.text, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{eventState.event_type_label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <div style={{ width: 44, height: 2.5, background: "rgba(15,23,42,0.08)", borderRadius: 10, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${eventState.services.filter(s => s.canSearch).length > 0 ? Math.round((Object.keys(eventState.selected_vendors).length / eventState.services.filter(s => s.canSearch).length) * 100) : 0}%` }}
                      style={{ height: "100%", background: C.grad, borderRadius: 10 }} transition={{ duration: 0.5 }} />
                  </div>
                  <span style={{ fontSize: "0.6rem", color: C.text3, fontWeight: 600 }}>
                    {Object.keys(eventState.selected_vendors).length}/{eventState.services.filter(s => s.canSearch).length}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main two-column layout */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", padding: "16px 28px 16px", gap: 16, position: "relative", zIndex: 1 }}>

          {/* ── LEFT: Chat panel ── */}
          <div style={{
            flex: "1.4", minWidth: 0, display: "flex", flexDirection: "column",
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}>
            <ChatPanelHeader onNewChat={handleNewChat} />

            {/* Messages */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <AnimatePresence mode="wait">
                {showWelcome ? (
                  <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.18 }} style={{ flex: 1, overflow: "hidden" }}>
                    <ChatWelcome />
                  </motion.div>
                ) : (
                  <motion.div key="chat" ref={msgsRef} className="planner-hide-scroll"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
                    {messages.map(msg => (
                      <MessageBubble key={msg.id} msg={msg} onSuggestionClick={sendMessage} />
                    ))}
                    {loading && <TypingIndicator />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Composer
              input={input}
              setInput={setInput}
              onSend={sendMessage}
              loading={loading}
              onSuggestionClick={sendMessage}
            />
          </div>

          {/* ── RIGHT: Plan panel ── */}
          <div style={{
            flex: "1", minWidth: 0, display: "flex", flexDirection: "column",
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}>
            <AnimatePresence mode="wait">
              {!hasEvent ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RightEmptyState onPickType={label => sendMessage(`I want to plan a ${label}`)} />
                </motion.div>
              ) : (
                <motion.div key="plan" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
    </>
  );
}
