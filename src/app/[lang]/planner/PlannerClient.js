"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, ArrowLeft, Check,
  Circle, Search, X, Star, ChevronRight, ChevronDown, ChevronUp,
  Users, Calendar, MapPin, DollarSign, Loader2, Wand2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   EVENT TEMPLATES
═══════════════════════════════════════════════════════ */
const EVENT_TEMPLATES = {
  christening: {
    label: "Christening / Baptism", emoji: "⛪",
    accent: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)",
    services: [
      { service_type: "church",         title: "Church Booking",              category: "religious",    required: true },
      { service_type: "baptism_candle", title: "Baptism Candle (Knonki Mom)", category: "religious",    required: true },
      { service_type: "cross",          title: "Cross Necklace for Baby",     category: "religious",    required: true },
      { service_type: "kavor",          title: "Godfather (Kavor)",           category: "roles",        required: true },
      { service_type: "kavork",         title: "Godmother (Kavork)",          category: "roles",        required: true },
      { service_type: "baby_outfit",    title: "White Baby Outfit",           category: "clothing",     required: true },
      { service_type: "venue",          title: "Celebration Venue",           category: "celebration",  required: true,  canSearch: true },
      { service_type: "catering",       title: "Food & Catering",             category: "celebration",  required: true,  canSearch: true },
      { service_type: "cake",           title: "Christening Cake",            category: "celebration",  required: true,  canSearch: true },
      { service_type: "photographer",   title: "Photographer",                category: "media",        required: true,  canSearch: true },
      { service_type: "decoration",     title: "Decorations",                 category: "celebration",  required: false, canSearch: true },
    ],
  },
  wedding: {
    label: "Wedding", emoji: "💍",
    accent: "#e11d5c", gradient: "linear-gradient(135deg,#e11d5c 0%,#f97316 100%)",
    services: [
      { service_type: "ceremony_venue",  title: "Ceremony Venue",        category: "ceremony",      required: true },
      { service_type: "reception_venue", title: "Reception Hall",        category: "reception",     required: true,  canSearch: true },
      { service_type: "tamada",          title: "Tamada (MC)",           category: "entertainment", required: true },
      { service_type: "wedding_rings",   title: "Wedding Rings",         category: "ceremony",      required: true },
      { service_type: "bridal_dress",    title: "Bridal Gown",           category: "attire",        required: true },
      { service_type: "wedding_cake",    title: "Wedding Cake",          category: "food",          required: true,  canSearch: true },
      { service_type: "catering",        title: "Catering",              category: "food",          required: true,  canSearch: true },
      { service_type: "photographer",    title: "Photographer",          category: "media",         required: true,  canSearch: true },
      { service_type: "videographer",    title: "Videographer",          category: "media",         required: true,  canSearch: true },
      { service_type: "flowers",         title: "Bridal Flowers",        category: "decoration",    required: true,  canSearch: true },
      { service_type: "music",           title: "DJ / Live Music",       category: "entertainment", required: true,  canSearch: true },
    ],
  },
  birthday: {
    label: "Birthday Party", emoji: "🎂",
    accent: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6 0%,#06b6d4 100%)",
    services: [
      { service_type: "cake",               title: "Birthday Cake",       category: "food",        required: true,  canSearch: true },
      { service_type: "venue",              title: "Venue",               category: "celebration", required: true },
      { service_type: "catering",           title: "Catering",            category: "food",        required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations", category: "decoration",  required: true,  canSearch: true },
      { service_type: "music",              title: "Music / DJ",          category: "entertainment",required: false, canSearch: true },
      { service_type: "photographer",       title: "Photographer",        category: "media",       required: false, canSearch: true },
    ],
  },
  kids_party: {
    label: "Kids' Party", emoji: "🎠",
    accent: "#10b981", gradient: "linear-gradient(135deg,#10b981 0%,#059669 100%)",
    services: [
      { service_type: "cake",               title: "Themed Cake",           category: "food",         required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations",   category: "decoration",   required: true,  canSearch: true },
      { service_type: "animator",           title: "Kids Animator",         category: "entertainment", required: true,  canSearch: true },
      { service_type: "venue",              title: "Venue",                 category: "celebration",   required: true },
      { service_type: "catering",           title: "Kids-Friendly Catering",category: "food",          required: true,  canSearch: true },
      { service_type: "decoration",         title: "Theme Decorations",     category: "decoration",    required: true,  canSearch: true },
      { service_type: "photographer",       title: "Photographer",          category: "media",         required: false, canSearch: true },
    ],
  },
  corporate: {
    label: "Corporate Event", emoji: "🏢",
    accent: "#475569", gradient: "linear-gradient(135deg,#475569 0%,#1e293b 100%)",
    services: [
      { service_type: "venue",          title: "Conference / Event Venue", category: "venue",          required: true },
      { service_type: "catering",       title: "Catering & Coffee Breaks", category: "food",           required: true,  canSearch: true },
      { service_type: "av_tech",        title: "AV & Tech Setup",          category: "tech",           required: true },
      { service_type: "photographer",   title: "Event Photographer",       category: "media",          required: true,  canSearch: true },
      { service_type: "entertainment",  title: "Evening Entertainment",    category: "entertainment",  required: false, canSearch: true },
    ],
  },
  engagement: {
    label: "Engagement Party", emoji: "💍",
    accent: "#8b5cf6", gradient: "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
    services: [
      { service_type: "ring",         title: "Engagement Ring",   category: "ceremony",    required: true },
      { service_type: "flowers",      title: "Flowers",           category: "decoration",  required: true,  canSearch: true },
      { service_type: "photographer", title: "Photographer",      category: "media",       required: true,  canSearch: true },
      { service_type: "venue",        title: "Party Venue",       category: "celebration", required: true },
      { service_type: "cake",         title: "Engagement Cake",   category: "food",        required: true,  canSearch: true },
      { service_type: "catering",     title: "Food & Drinks",     category: "food",        required: true,  canSearch: true },
    ],
  },
  anniversary: {
    label: "Anniversary", emoji: "⭐",
    accent: "#d97706", gradient: "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)",
    services: [
      { service_type: "flowers",      title: "Flower Arrangement", category: "decoration",  required: true,  canSearch: true },
      { service_type: "venue",        title: "Restaurant / Venue", category: "celebration", required: true },
      { service_type: "cake",         title: "Anniversary Cake",   category: "food",        required: true,  canSearch: true },
      { service_type: "catering",     title: "Dinner / Catering",  category: "food",        required: true,  canSearch: true },
      { service_type: "photographer", title: "Photographer",       category: "media",       required: false, canSearch: true },
    ],
  },
  baby_shower: {
    label: "Baby Shower", emoji: "🍼",
    accent: "#0ea5e9", gradient: "linear-gradient(135deg,#38bdf8 0%,#0ea5e9 100%)",
    services: [
      { service_type: "balloon_decoration", title: "Balloon Decorations", category: "decoration",  required: true,  canSearch: true },
      { service_type: "cake",               title: "Baby Shower Cake",    category: "food",        required: true,  canSearch: true },
      { service_type: "catering",           title: "Finger Food / Catering",category: "food",      required: true,  canSearch: true },
      { service_type: "decoration",         title: "Theme Decorations",   category: "decoration",  required: true,  canSearch: true },
      { service_type: "photographer",       title: "Photographer",        category: "media",       required: false, canSearch: true },
    ],
  },
  graduation: {
    label: "Graduation Party", emoji: "🎓",
    accent: "#ea580c", gradient: "linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)",
    services: [
      { service_type: "venue",              title: "Venue",           category: "celebration",  required: true },
      { service_type: "cake",               title: "Graduation Cake", category: "food",         required: true,  canSearch: true },
      { service_type: "catering",           title: "Catering",        category: "food",         required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloons & Décor",category: "decoration",   required: false, canSearch: true },
      { service_type: "photographer",       title: "Photographer",    category: "media",        required: false, canSearch: true },
    ],
  },
};

const SERVICE_ICONS = {
  church:"⛪", baptism_candle:"🕯️", cross:"✝️", kavor:"🤵", kavork:"👗", baby_outfit:"👶",
  venue:"🏛️", catering:"🍽️", cake:"🎂", wedding_cake:"🎂", photographer:"📸", videographer:"🎥",
  decoration:"🎀", balloon_decoration:"🎈", flowers:"💐", music:"🎵", tamada:"🎤",
  wedding_rings:"💍", ring:"💍", bridal_dress:"👗", ceremony_venue:"💒", reception_venue:"🏛️",
  av_tech:"📽️", entertainment:"🎭", animator:"🤹",
};
const getIcon = (t) => SERVICE_ICONS[t] || "✦";

const CATEGORY_LABELS = {
  religious:"⛪ Religious", roles:"👥 Key Roles", clothing:"👗 Attire",
  ceremony:"💒 Ceremony", reception:"🥂 Reception", celebration:"🎉 Celebration",
  food:"🍽️ Food & Cake", decoration:"🎀 Decorations", media:"📸 Photo & Video",
  entertainment:"🎵 Entertainment", attire:"👗 Attire", venue:"🏛️ Venue",
  tech:"🎤 Tech & AV", other:"📋 Other",
};

/* ═══════════════════════════════════════════════════════
   ACTION PROCESSOR
═══════════════════════════════════════════════════════ */
function applyActions(actions, prev) {
  let state = { ...prev };
  const searches = [];

  for (const a of actions) {
    switch (a.type) {
      case "set_event_type": {
        if (state.event_type === a.event_type) break;
        const tpl = EVENT_TEMPLATES[a.event_type];
        state = {
          ...state,
          event_type: a.event_type,
          event_type_label: tpl?.label || a.event_type,
          event_type_emoji: tpl?.emoji || "🎉",
          accent:   tpl?.accent || "#e11d5c",
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
        if (!state.services?.find(s => s.service_type === a.service_type)) {
          state = { ...state, services: [...(state.services||[]), { service_type: a.service_type, title: a.title || a.service_type.replace(/_/g," "), category: a.category||"other", required: a.priority==="required", status:"pending", canSearch:true }] };
        }
        break;
      }
      case "remove_service":
        state = { ...state, services: (state.services||[]).filter(s => s.service_type !== a.service_type) }; break;

      case "mark_required_item":
      case "mark_optional_item": {
        if (!state.services?.find(s => s.service_type === a.item_type)) {
          state = { ...state, services: [...(state.services||[]), { service_type: a.item_type, title: a.title||a.item_type.replace(/_/g," "), category: a.category||"other", required: a.type==="mark_required_item", status:"pending" }] };
        }
        break;
      }
      case "search_vendors":
        searches.push(a);
        state = { ...state, services: (state.services||[]).map(s => s.service_type===a.service_type ? {...s, searching:true} : s) };
        break;
      case "select_vendor":
        state = { ...state, selected_vendors: {...state.selected_vendors, [a.service_type]:{id:a.vendor_id, name:a.vendor_name}}, services: (state.services||[]).map(s=>s.service_type===a.service_type?{...s,status:"selected",searching:false}:s) };
        break;
      case "unselect_vendor": {
        const sv = {...state.selected_vendors}; delete sv[a.service_type];
        state = { ...state, selected_vendors: sv, services: (state.services||[]).map(s=>s.service_type===a.service_type?{...s,status:"pending"}:s) };
        break;
      }
      default: break;
    }
  }
  return { state, searches };
}

/* ═══════════════════════════════════════════════════════
   BOT AVATAR
═══════════════════════════════════════════════════════ */
function BotAvatar({ size = 30 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,#7c3aed,#e11d5c)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 10px rgba(124,58,237,0.35)",
    }}>
      <Sparkles size={size * 0.42} color="#fff" strokeWidth={2.2} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TYPING INDICATOR
═══════════════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:10 }}>
      <BotAvatar />
      <div style={{ background:"#fff", border:"1px solid #ede9fe", borderRadius:"6px 20px 20px 20px", padding:"14px 18px", boxShadow:"0 2px 12px rgba(124,58,237,0.08)", display:"flex", gap:5, alignItems:"center" }}>
        {[0, 0.16, 0.32].map((d,i) => (
          <motion.span key={i}
            animate={{ y:[0,-6,0], opacity:[0.35,1,0.35] }}
            transition={{ duration:0.65, repeat:Infinity, delay:d, ease:"easeInOut" }}
            style={{ width:7, height:7, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#e11d5c)", display:"block" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MESSAGE BUBBLE
═══════════════════════════════════════════════════════ */
function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";
  const lines = msg.text.split("\n");

  const renderLine = (line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={li}>
        {parts.map((p,j) => p.startsWith("**")&&p.endsWith("**")
          ? <strong key={j} style={{ fontWeight:700 }}>{p.slice(2,-2)}</strong>
          : p
        )}
        {li < lines.length - 1 && <br />}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity:0, y:10, scale:0.97 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
      style={{ display:"flex", flexDirection:"column", alignItems:isBot?"flex-start":"flex-end", gap:6 }}
    >
      <div style={{ display:"flex", alignItems:"flex-end", gap:10, maxWidth:"86%" }}>
        {isBot && <BotAvatar />}
        <div style={{
          background: isBot ? "#fff" : "#e11d5c",
          color: isBot ? "#1e293b" : "#fff",
          borderRadius: isBot ? "6px 20px 20px 20px" : "20px 6px 20px 20px",
          padding: "13px 17px",
          fontSize: "0.875rem",
          lineHeight: 1.7,
          letterSpacing: "-0.005em",
          border: isBot ? "1px solid #ede9fe" : "none",
          boxShadow: isBot
            ? "0 2px 12px rgba(124,58,237,0.08), 0 1px 2px rgba(0,0,0,0.03)"
            : "0 4px 18px rgba(225,29,92,0.3)",
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
const VENDOR_PALETTES = [
  ["#7c3aed","#f5f3ff"], ["#e11d5c","#fff1f5"], ["#059669","#ecfdf5"],
  ["#d97706","#fffbeb"], ["#0891b2","#ecfeff"], ["#db2777","#fdf2f8"],
];

function VendorCard({ vendor, onSelect }) {
  const [hov, setHov] = useState(false);
  const name    = vendor.business_name || vendor.name || "Vendor";
  const rating  = parseFloat(vendor.rating) || 0;
  const city    = vendor.city || "";
  const initial = name[0]?.toUpperCase() || "V";
  const [fg, bg] = VENDOR_PALETTES[name.charCodeAt(0) % VENDOR_PALETTES.length];

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ opacity:0, scale:0.92, y:6 }}
      animate={{ opacity:1, scale:1, y:0 }}
      whileHover={{ y:-5, boxShadow:"0 16px 40px rgba(0,0,0,0.12)" }}
      transition={{ type:"spring", stiffness:320, damping:22 }}
      style={{
        background:"#fff", borderRadius:18, minWidth:170, maxWidth:190, flexShrink:0,
        border: `1.5px solid ${hov ? fg+"55" : "#f0eeff"}`,
        boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
        overflow:"hidden", cursor:"pointer",
        transition:"border-color 0.2s",
      }}
    >
      {/* Color bar */}
      <div style={{ height:4, background:`linear-gradient(90deg,${fg},${fg}88)` }} />

      <div style={{ padding:"14px 14px 14px" }}>
        {/* Avatar */}
        <div style={{
          width:42, height:42, borderRadius:12, background:bg,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"1.2rem", fontWeight:900, color:fg, marginBottom:10,
        }}>
          {initial}
        </div>

        <p style={{ margin:"0 0 3px", fontSize:"0.8rem", fontWeight:700, color:"#0f172a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {name}
        </p>

        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:12 }}>
          {rating > 0 && <>
            <Star size={10} style={{ color:"#f59e0b", fill:"#f59e0b" }} />
            <span style={{ fontSize:"0.72rem", color:"#64748b", fontWeight:600 }}>{rating.toFixed(1)}</span>
          </>}
          {city && <span style={{ fontSize:"0.68rem", color:"#94a3b8" }}>{rating>0?"· ":""}{city}</span>}
        </div>

        <motion.button
          whileTap={{ scale:0.95 }}
          onClick={() => onSelect(vendor)}
          style={{
            width:"100%",
            background: hov ? fg : "transparent",
            border: `1.5px solid ${fg}`,
            borderRadius:9,
            color: hov ? "#fff" : fg,
            fontSize:"0.75rem", fontWeight:700,
            padding:"7px 0", cursor:"pointer",
            transition:"background 0.15s, color 0.15s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:4,
          }}
        >
          Select <ChevronRight size={11} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   SERVICE ROW
═══════════════════════════════════════════════════════ */
function ServiceRow({ service, selectedVendor, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor, accent }) {
  const icon       = getIcon(service.service_type);
  const results    = vendorResults[service.service_type] || [];
  const isSelected = !!selectedVendor;
  const isSearching= service.searching;
  const hasResults = results.length > 0 && !isSelected;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 0" }}>
        {/* Status circle */}
        <div style={{ width:22, height:22, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {isSelected ? (
            <motion.div
              initial={{ scale:0 }} animate={{ scale:1 }}
              transition={{ type:"spring", stiffness:400, damping:20 }}
              style={{ width:22, height:22, borderRadius:"50%", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center" }}
            >
              <Check size={12} color="#16a34a" strokeWidth={3} />
            </motion.div>
          ) : isSearching ? (
            <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
              style={{ width:22, height:22, borderRadius:"50%", border:`2.5px solid ${accent||"#7c3aed"}`, borderTopColor:"transparent" }}
            />
          ) : (
            <div style={{ width:22, height:22, borderRadius:"50%", border:"2px solid #e2e8f0" }} />
          )}
        </div>

        {/* Icon */}
        <span style={{ fontSize:"1.05rem", flexShrink:0 }}>{icon}</span>

        {/* Title + selected vendor */}
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontSize:"0.82rem", fontWeight:600, color:isSelected?"#166534":"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {service.title}
          </p>
          {isSelected && selectedVendor && (
            <p style={{ margin:"1px 0 0", fontSize:"0.72rem", color:"#16a34a", fontWeight:500 }}>
              ✅ {selectedVendor.name}
            </p>
          )}
          {!service.required && !isSelected && (
            <span style={{ fontSize:"0.62rem", background:"#f1f5f9", color:"#94a3b8", borderRadius:100, padding:"1px 6px", fontWeight:600 }}>
              optional
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:6 }}>
          {isSelected ? (
            <button onClick={() => onUnselectVendor(service.service_type)}
              style={{ border:"none", background:"none", cursor:"pointer", padding:3, color:"#cbd5e1", display:"flex", borderRadius:6 }}
            >
              <X size={13} />
            </button>
          ) : hasResults ? (
            <span style={{ fontSize:"0.68rem", background:"#fef9c3", color:"#92400e", fontWeight:700, borderRadius:100, padding:"3px 8px" }}>
              {results.length} found
            </span>
          ) : service.canSearch && !isSearching ? (
            <motion.button
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={() => onSearchVendors(service.service_type, service.title)}
              style={{
                display:"inline-flex", alignItems:"center", gap:4,
                background:"#fdf2f8", border:"1px solid #fce7f3",
                color:"#e11d5c", borderRadius:100, padding:"5px 11px",
                fontSize:"0.7rem", fontWeight:700, cursor:"pointer",
              }}
            >
              <Search size={9} /> Find
            </motion.button>
          ) : null}
        </div>
      </div>

      {/* Vendor cards row */}
      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:"auto" }}
            exit={{ opacity:0, height:0 }}
            transition={{ duration:0.25 }}
            style={{ overflow:"hidden", paddingLeft:44, paddingBottom:12 }}
          >
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:2, scrollbarWidth:"none", msOverflowStyle:"none" }}>
              {results.slice(0,6).map((v,i) => (
                <VendorCard key={v.id||i} vendor={v} onSelect={(vendor) => onSelectVendor(service.service_type, vendor)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CATEGORY SECTION (collapsible)
═══════════════════════════════════════════════════════ */
function CategorySection({ label, services, selectedVendors, ...rowProps }) {
  const [open, setOpen] = useState(true);
  const doneCount = services.filter(s => selectedVendors?.[s.service_type]).length;

  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f0eeff", marginBottom:8, overflow:"hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"11px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:"0.7rem", fontWeight:700, color:"#64748b", letterSpacing:"0.08em", textTransform:"uppercase" }}>
            {label}
          </span>
          {doneCount > 0 && (
            <span style={{ fontSize:"0.65rem", background:"#dcfce7", color:"#16a34a", borderRadius:100, padding:"2px 7px", fontWeight:700 }}>
              {doneCount}/{services.length}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={13} style={{ color:"#94a3b8" }} />
          : <ChevronDown size={13} style={{ color:"#94a3b8" }} />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0 }} animate={{ height:"auto" }} exit={{ height:0 }} transition={{ duration:0.2 }} style={{ overflow:"hidden" }}>
            <div style={{ padding:"0 16px 10px" }}>
              {services.map((s, idx) => (
                <div key={s.service_type}>
                  {idx > 0 && <div style={{ height:1, background:"#faf9ff", margin:"0" }} />}
                  <ServiceRow
                    service={s}
                    selectedVendor={selectedVendors?.[s.service_type]}
                    {...rowProps}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EVENT PLAN PANEL
═══════════════════════════════════════════════════════ */
function EventPlanPanel({ eventState, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor }) {
  const { event_type_label, event_type_emoji, accent, gradient, date, city, guest_count, style, budget, services=[], selected_vendors={} } = eventState;

  const searchableServices = services.filter(s => s.canSearch);
  const selectedCount = Object.keys(selected_vendors).length;
  const pct = searchableServices.length > 0 ? Math.round((selectedCount / searchableServices.length) * 100) : 0;

  const grouped = {};
  for (const s of services) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }

  const missing = services.filter(s => s.required && s.canSearch && !selected_vendors[s.service_type]);

  return (
    <div style={{ maxWidth:680 }}>

      {/* ── Header card ── */}
      <div style={{ background:gradient||"linear-gradient(135deg,#7c3aed,#e11d5c)", borderRadius:24, padding:"22px 24px", marginBottom:16, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <span style={{ fontSize:"2.4rem", lineHeight:1 }}>{event_type_emoji}</span>
            <div>
              <h2 style={{ margin:0, fontSize:"1.2rem", fontWeight:900, letterSpacing:"-0.03em" }}>{event_type_label}</h2>
              <div style={{ display:"flex", gap:14, marginTop:4, flexWrap:"wrap" }}>
                {date && <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.75rem", opacity:0.8 }}><Calendar size={11}/>{date}</span>}
                {city && <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.75rem", opacity:0.8 }}><MapPin size={11}/>{city}</span>}
                {guest_count && <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.75rem", opacity:0.8 }}><Users size={11}/>{guest_count} guests</span>}
                {budget?.description && <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.75rem", opacity:0.8 }}><DollarSign size={11}/>{budget.description}</span>}
                {style && <span style={{ fontSize:"0.75rem", opacity:0.8 }}>✨ {style}</span>}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.22)", borderRadius:10, overflow:"hidden" }}>
              <motion.div animate={{ width:`${pct}%` }} transition={{ duration:0.6, ease:"easeOut" }}
                style={{ height:"100%", background:"#fff", borderRadius:10 }} />
            </div>
            <span style={{ fontSize:"0.78rem", fontWeight:800, opacity:0.9, flexShrink:0 }}>
              {selectedCount}/{searchableServices.length} vendors
            </span>
          </div>
        </div>
      </div>

      {/* ── Missing items alert ── */}
      {missing.length > 0 && selectedCount > 0 && (
        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
          style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:14, padding:"11px 14px", marginBottom:12, display:"flex", gap:10 }}
        >
          <span style={{ fontSize:"1.1rem", flexShrink:0 }}>⚠️</span>
          <div>
            <p style={{ margin:"0 0 2px", fontSize:"0.78rem", fontWeight:700, color:"#92400e" }}>Still needed:</p>
            <p style={{ margin:0, fontSize:"0.74rem", color:"#b45309", lineHeight:1.5 }}>
              {missing.map(s => s.title).join(" · ")}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Services grouped ── */}
      {Object.entries(grouped).map(([cat, items]) => (
        <CategorySection
          key={cat}
          label={CATEGORY_LABELS[cat] || cat}
          services={items}
          selectedVendors={selected_vendors}
          vendorResults={vendorResults}
          onSelectVendor={onSelectVendor}
          onSearchVendors={onSearchVendors}
          onUnselectVendor={onUnselectVendor}
          accent={accent}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EMPTY PLAN STATE
═══════════════════════════════════════════════════════ */
function EmptyPlan({ onPickType }) {
  const types = [
    { key:"christening", label:"Christening", emoji:"⛪", color:"#7c3aed" },
    { key:"wedding",     label:"Wedding",     emoji:"💍", color:"#e11d5c" },
    { key:"birthday",    label:"Birthday",    emoji:"🎂", color:"#3b82f6" },
    { key:"kids_party",  label:"Kids Party",  emoji:"🎠", color:"#10b981" },
    { key:"corporate",   label:"Corporate",   emoji:"🏢", color:"#475569" },
    { key:"baby_shower", label:"Baby Shower", emoji:"🍼", color:"#0ea5e9" },
    { key:"engagement",  label:"Engagement",  emoji:"💍", color:"#8b5cf6" },
    { key:"graduation",  label:"Graduation",  emoji:"🎓", color:"#ea580c" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 130px)", textAlign:"center", padding:"40px 24px" }}>
      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:"spring", stiffness:260, damping:20, delay:0.1 }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed22,#e11d5c22)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", border:"2px dashed #ede9fe" }}>
          <Wand2 size={32} style={{ color:"#7c3aed" }} strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        <h2 style={{ margin:"0 0 8px", fontSize:"1.5rem", fontWeight:900, color:"#0f172a", letterSpacing:"-0.04em" }}>
          Your event plan
        </h2>
        <p style={{ margin:"0 0 32px", fontSize:"0.875rem", color:"#94a3b8", maxWidth:260, lineHeight:1.65, marginLeft:"auto", marginRight:"auto" }}>
          Describe your event in the chat →<br/>I'll build your checklist instantly.
        </p>
      </motion.div>

      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, maxWidth:400 }}
      >
        {types.map((t, i) => (
          <motion.button
            key={t.key}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 + i*0.04 }}
            whileHover={{ scale:1.08, y:-4 }} whileTap={{ scale:0.95 }}
            onClick={() => onPickType(t.label)}
            style={{
              border:"none", borderRadius:16, padding:"16px 8px",
              background:`${t.color}12`, cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:6,
              transition:"background 0.15s",
            }}
          >
            <span style={{ fontSize:"1.65rem" }}>{t.emoji}</span>
            <span style={{ fontSize:"0.68rem", fontWeight:700, color:t.color }}>{t.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
const INITIAL_STATE = {
  event_type:null, event_type_label:null, event_type_emoji:null,
  accent:"#e11d5c", gradient:null, date:null, city:null,
  guest_count:null, style:null, budget:null, notes:null,
  services:[], selected_vendors:{},
};

export default function PlannerClient({ lang }) {
  const [messages,      setMessages]      = useState([]);
  const [eventState,    setEventState]    = useState(INITIAL_STATE);
  const [vendorResults, setVendorResults] = useState({});
  const [loading,       setLoading]       = useState(false);
  const [input,         setInput]         = useState("");
  const [focused,       setFocused]       = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (eventState.event_type) {
      localStorage.setItem("salooote_planner", JSON.stringify({ eventState, vendorResults }));
    }
  }, [eventState, vendorResults]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{ id:1, role:"bot", text:"Hi! I'm your Salooote event planner 🎉\n\nJust describe what you want to plan — tell me the event, guests, city, style. I'll build your complete checklist and find vendors instantly!" }]);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const pushBot = useCallback((text) => {
    setMessages(prev => [...prev, { id:Date.now()+Math.random(), role:"bot", text }]);
  }, []);

  const searchVendors = useCallback(async (service_type, search_term, filters={}) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const term = search_term || service_type.replace(/_/g," ");
      const params = new URLSearchParams({ search:term, limit:"8" });
      const city = filters.city || eventState.city;
      if (city) params.set("city", city);

      let data = null;
      try {
        const r = await fetch(`${base}/vendors?${params}`);
        if (r.ok) { const j = await r.json(); data = j.data||[]; }
      } catch {}

      if (!data?.length) {
        const r = await fetch(`${base}/products?${params}`);
        if (r.ok) {
          const j = await r.json();
          data = (j.data||[]).map(p => ({ id:p.id, business_name:p.vendor_name||p.name, name:p.vendor_name||p.name, rating:p.rating, city:p.vendor_city||city||"", slug:p.vendor_slug||"" }));
        }
      }

      if (data?.length) setVendorResults(prev => ({ ...prev, [service_type]:data }));
      setEventState(prev => ({ ...prev, services:prev.services.map(s => s.service_type===service_type?{...s,searching:false}:s) }));
    } catch {
      setEventState(prev => ({ ...prev, services:prev.services.map(s => s.service_type===service_type?{...s,searching:false}:s) }));
    }
  }, [eventState.city]);

  const sendMessage = useCallback(async (text) => {
    const t = text.trim();
    if (!t || loading) return;
    setInput("");
    setMessages(prev => [...prev, { id:Date.now(), role:"user", text:t }]);
    setLoading(true);

    try {
      const res = await fetch("/api/planner/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages:[...messages, { role:"user", text:t }], eventState }),
      });
      const data = await res.json();

      if (data.error) { pushBot(`⚠️ ${data.error}`); return; }

      const { state: newState, searches } = applyActions(data.actions||[], eventState);
      setEventState(newState);
      if (data.assistant_message) pushBot(data.assistant_message);
      for (const s of searches) searchVendors(s.service_type, s.search_term, s.filters||{});
    } catch { pushBot("Something went wrong. Please try again."); }
    finally { setLoading(false); inputRef.current?.focus(); }
  }, [messages, eventState, loading, searchVendors, pushBot]);

  const handleSelectVendor = useCallback((service_type, vendor) => {
    const name = vendor.business_name||vendor.name||"Vendor";
    setEventState(prev => ({
      ...prev,
      selected_vendors:{ ...prev.selected_vendors, [service_type]:{ id:vendor.id, name } },
      services: prev.services.map(s => s.service_type===service_type?{...s,status:"selected",searching:false}:s),
    }));
    setVendorResults(prev => { const n={...prev}; delete n[service_type]; return n; });
    pushBot(`✅ **${name}** added to your plan for **${service_type.replace(/_/g," ")}**! What's next?`);
  }, [pushBot]);

  const handleSearchVendors = useCallback((service_type, title) => {
    setEventState(prev => ({ ...prev, services:prev.services.map(s => s.service_type===service_type?{...s,searching:true}:s) }));
    searchVendors(service_type, title);
  }, [searchVendors]);

  const handleUnselectVendor = useCallback((service_type) => {
    setEventState(prev => {
      const sv={...prev.selected_vendors}; delete sv[service_type];
      return { ...prev, selected_vendors:sv, services:prev.services.map(s=>s.service_type===service_type?{...s,status:"pending"}:s) };
    });
  }, []);

  const hasEvent = !!eventState.event_type;
  const accent   = eventState.accent || "#e11d5c";

  return (
    <div style={{ minHeight:"100vh", background:"#f5f3ff", display:"flex", flexDirection:"column" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0d9f5; border-radius: 10px; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(237,233,254,0.8)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:1440, margin:"0 auto", padding:"0 28px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <Link href={`/${lang}`} style={{ textDecoration:"none" }}>
              <motion.button whileHover={{ scale:1.07, background:"#ede9fe" }} whileTap={{ scale:0.94 }}
                style={{ width:32, height:32, borderRadius:9, border:"1px solid #ede9fe", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"background 0.15s" }}
              >
                <ArrowLeft size={14} color="#475569" />
              </motion.button>
            </Link>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:30, height:30, borderRadius:9, background:"linear-gradient(135deg,#7c3aed,#e11d5c)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 10px rgba(124,58,237,0.35)" }}>
                <Sparkles size={14} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <p style={{ margin:0, fontSize:"0.875rem", fontWeight:800, color:"#0f172a", lineHeight:1, letterSpacing:"-0.02em" }}>Event Planner</p>
                <p style={{ margin:0, fontSize:"0.62rem", color:"#94a3b8", lineHeight:1, marginTop:1 }}>Powered by OpenAI · Salooote</p>
              </div>
            </div>
          </div>

          {hasEvent && (
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:"1.4rem" }}>{eventState.event_type_emoji}</span>
              <div>
                <p style={{ margin:0, fontSize:"0.8rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em", lineHeight:1 }}>{eventState.event_type_label}</p>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:3 }}>
                  <div style={{ width:60, height:3, background:"#ede9fe", borderRadius:10, overflow:"hidden" }}>
                    <motion.div
                      animate={{ width:`${eventState.services.filter(s=>s.canSearch).length > 0 ? Math.round((Object.keys(eventState.selected_vendors).length / eventState.services.filter(s=>s.canSearch).length)*100) : 0}%` }}
                      style={{ height:"100%", background:`linear-gradient(90deg,#7c3aed,#e11d5c)`, borderRadius:10 }}
                      transition={{ duration:0.5 }}
                    />
                  </div>
                  <span style={{ fontSize:"0.68rem", color:"#94a3b8", fontWeight:600 }}>
                    {Object.keys(eventState.selected_vendors).length}/{eventState.services.filter(s=>s.canSearch).length} vendors
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, maxWidth:1440, margin:"0 auto", width:"100%", padding:"0 28px", display:"flex", gap:28 }}>

        {/* ── Chat panel ── */}
        <div style={{ width:420, flexShrink:0, display:"flex", flexDirection:"column", position:"sticky", top:56, height:"calc(100vh - 56px)", paddingTop:24, paddingBottom:24 }}>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", paddingRight:4 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div style={{ paddingTop:16 }}>
            <motion.div
              animate={{ boxShadow: focused
                ? "0 0 0 3px rgba(124,58,237,0.15), 0 8px 32px rgba(124,58,237,0.14)"
                : "0 4px 20px rgba(124,58,237,0.10)" }}
              transition={{ duration:0.2 }}
              style={{
                background:"#fff", borderRadius:18,
                padding:"8px 8px 8px 18px",
                border:`1.5px solid ${focused ? "rgba(124,58,237,0.4)" : "rgba(237,233,254,0.9)"}`,
                display:"flex", alignItems:"center", gap:8,
                transition:"border-color 0.2s",
              }}
            >
              <form onSubmit={e=>{e.preventDefault();sendMessage(input);}} style={{ display:"flex", flex:1, alignItems:"center", gap:8 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onFocus={()=>setFocused(true)}
                  onBlur={()=>setFocused(false)}
                  disabled={loading}
                  placeholder="Describe your event…"
                  style={{
                    flex:1, border:"none", outline:"none",
                    fontSize:"0.9rem", background:"transparent",
                    color:"#0f172a", fontFamily:"inherit",
                    letterSpacing:"-0.01em",
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim()||loading}
                  whileHover={input.trim()&&!loading?{ scale:1.06 }:{}}
                  whileTap={input.trim()&&!loading?{ scale:0.94 }:{}}
                  style={{
                    width:40, height:40, borderRadius:12, flexShrink:0,
                    background: input.trim()&&!loading
                      ? "linear-gradient(135deg,#7c3aed,#e11d5c)"
                      : "#f1f5f9",
                    border:"none",
                    cursor: input.trim()&&!loading ? "pointer" : "default",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow: input.trim()&&!loading ? "0 4px 14px rgba(225,29,92,0.32)" : "none",
                    transition:"background 0.2s, box-shadow 0.2s",
                  }}
                >
                  {loading
                    ? <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}><Loader2 size={15} color="#94a3b8" /></motion.div>
                    : <Send size={15} color={input.trim()?"#fff":"#94a3b8"} />
                  }
                </motion.button>
              </form>
            </motion.div>

            <p style={{ margin:"8px 0 0", fontSize:"0.68rem", color:"#c4b5fd", textAlign:"center", letterSpacing:"0.01em" }}>
              AI may make mistakes · Always verify with vendors
            </p>
          </div>
        </div>

        {/* ── Plan panel ── */}
        <div style={{ flex:1, minWidth:0, paddingTop:24, paddingBottom:48, overflowY:"auto" }}>
          <AnimatePresence mode="wait">
            {!hasEvent ? (
              <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <EmptyPlan onPickType={(label) => { setMessages(prev=>[...prev,{id:Date.now(),role:"user",text:`I want to plan a ${label}`}]); sendMessage(`I want to plan a ${label}`); }} />
              </motion.div>
            ) : (
              <motion.div key="plan" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}>
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
