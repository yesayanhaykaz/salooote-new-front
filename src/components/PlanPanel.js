"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Check, Search, X, Star, ChevronDown, ChevronUp, ChevronRight,
  Users, Calendar, MapPin, DollarSign, Loader2, Plus,
  Building, Building2, Flame, User, Package, Cake, Camera, Video,
  Flower2, Music, Mic, Gem, Monitor, Smile, UtensilsCrossed, Briefcase,
  GraduationCap, Baby, AlertTriangle, Share2,
} from "lucide-react";

/* ─── Design tokens (matches PlannerClient) ─────────────────────────── */
export const PC = {
  bg: "#f8fafc", panel: "#ffffff",
  border: "rgba(15,23,42,0.07)", borderMd: "rgba(15,23,42,0.12)",
  text: "#0f172a", text2: "#64748b", text3: "#94a3b8",
  brand: "#e11d5c", green: "#16a34a",
  grad: "linear-gradient(135deg,#e11d5c,#f43f5e)",
};

/* ─── Plan T table (en / hy / ru) ───────────────────────────────────── */
const PLAN_T = {
  en: {
    planningInProgress: "Planning in progress",
    sendToVendors: "Send to Vendors", share: "Share",
    guests: "guests", stillNeeded: "Still needed:",
    optional: "optional", find: "Find", found: "found",
    confirmed: "confirmed", stillNeededShort: "still needed",
    searching: "Searching…", vendorsFound: "vendors found",
    searchForVendors: "Search for vendors", filterByName: "Filter by name…",
    findingVendors: "Finding vendors…", noVendorsFound: "No vendors found",
    searchAgain: "Search again", close: "Close",
    alreadySelected: "Already Selected — click to deselect",
    selectVendor: "Select this vendor", viewBizPage: "View Business Page",
    noPhotos: "No portfolio photos yet",
    requestsSent: "Requests Sent!", sentWithErrors: "Sent with some errors",
    sendInquiryAll: "Send Inquiry to All Vendors",
    vendorReplyNote: "Vendors will reply to your inquiries. Track them in messages.",
    viewInquiries: "View Inquiries", sending: "Sending…",
    cancel: "Cancel", sent: "Sent", failed: "Failed",
    addService: "Add a service", addServicePlaceholder: "e.g. Ice cream, Photo booth…",
    removeService: "Remove",
    catLabels: {
      religious: "Religious", roles: "Key Roles", clothing: "Attire",
      ceremony: "Ceremony", reception: "Reception", celebration: "Celebration",
      food: "Food & Cake", decoration: "Decorations", media: "Photo & Video",
      entertainment: "Entertainment", attire: "Attire", venue: "Venue",
      tech: "Tech & AV", other: "Other",
    },
    serviceTitles: {
      church: "Church Booking", baptism_candle: "Baptism Candle", cross: "Cross for Baby",
      kavor: "Godfather (Kavor)", kavork: "Godmother (Kavork)", baby_outfit: "White Baby Outfit",
      venue: "Venue", catering: "Catering", cake: "Cake", wedding_cake: "Wedding Cake",
      photographer: "Photographer", videographer: "Videographer",
      decoration: "Decorations", balloon_decoration: "Balloon Decorations",
      flowers: "Flowers", music: "Music / DJ", tamada: "Tamada (MC)",
      wedding_rings: "Wedding Rings", ring: "Engagement Ring", bridal_dress: "Bridal Gown",
      ceremony_venue: "Ceremony Venue", reception_venue: "Reception Hall",
      av_tech: "AV & Tech Setup", entertainment: "Entertainment", animator: "Kids Animator",
    },
  },
  hy: {
    planningInProgress: "Պլանավորումը ընթացքի մեջ է",
    sendToVendors: "Ուղարկել մատակարարներին", share: "Կիսվել",
    guests: "հյուր", stillNeeded: "Մնում է կազմակերպել՝",
    optional: "ըստ ցանկության", find: "Գտնել", found: "գտնվել է",
    confirmed: "հաստատված", stillNeededShort: "մնում է",
    searching: "Որոնում…", vendorsFound: "մատակարար գտնվեց",
    searchForVendors: "Որոնել մատակարարներ", filterByName: "Ֆիլտրել անունով…",
    findingVendors: "Մատակարարներ են որոնվում…", noVendorsFound: "Մատակարարներ չեն գտնվել",
    searchAgain: "Կրկին որոնել", close: "Փակել",
    alreadySelected: "Արդեն ընտրված է — սեղմիր՝ հանելու համար",
    selectVendor: "Ընտրել այս մատակարարին", viewBizPage: "Դիտել էջը",
    noPhotos: "Պորտֆոլիոյի լուսանկարներ դեռ չկան",
    requestsSent: "Հարցումները ուղարկված են!", sentWithErrors: "Ուղարկվել է՝ որոշ սխալներով",
    sendInquiryAll: "Ուղարկել հարցում բոլոր մատակարարներին",
    vendorReplyNote: "Մատակարարները կպատասխանեն քո հարցումներին։ Կարող ես հետևել հաղորդագրություններում։",
    viewInquiries: "Դիտել հարցումները", sending: "Ուղարկվում է…",
    cancel: "Չեղարկել", sent: "Ուղարկված", failed: "Չհաջողվեց",
    addService: "Ավելացնել ծառայություն", addServicePlaceholder: "օր.՝ Պաղպաղակ, Ֆոտո կրպակ…",
    removeService: "Հեռացնել",
    catLabels: {
      religious: "Կրոնական", roles: "Կարևոր դերեր", clothing: "Հագուստ",
      ceremony: "Արարողություն", reception: "Ընդունելություն", celebration: "Տոնակատարություն",
      food: "Սնունդ և տորթ", decoration: "Դեկոր", media: "Լուսանկար և տեսանյութ",
      entertainment: "Ժամանց", attire: "Հագուստ", venue: "Վայր",
      tech: "Տեխնիկա և AV", other: "Այլ",
    },
    serviceTitles: {
      church: "Եկեղեցու ամրագրում", baptism_candle: "Մկրտության մոմ", cross: "Խաչ երեխայի համար",
      kavor: "Կավոր (Կնքհայր)", kavork: "Կավորք (Կնքամայր)", baby_outfit: "Սպիտակ հագուստ",
      venue: "Վայր", catering: "Կերակրատեսակ", cake: "Տորթ", wedding_cake: "Հարսանեկան տորթ",
      photographer: "Լուսանկարիչ", videographer: "Վիդեո օպերատոր",
      decoration: "Դեկոր", balloon_decoration: "Փուչիկների դեկոր",
      flowers: "Ծաղիկներ", music: "Երաժշտություն / DJ", tamada: "Թամադա",
      wedding_rings: "Հարսանեկան մատանիներ", ring: "Նշանադրական մատանի", bridal_dress: "Հարսնազգեստ",
      ceremony_venue: "Արարողության վայր", reception_venue: "Ընդունելության սրահ",
      av_tech: "AV տեխնիկա", entertainment: "Ժամանց", animator: "Մանկական անիմատոր",
    },
  },
  ru: {
    planningInProgress: "Планирование в процессе",
    sendToVendors: "Отправить поставщикам", share: "Поделиться",
    guests: "гостей", stillNeeded: "Ещё нужно:",
    optional: "необязательно", find: "Найти", found: "найдено",
    confirmed: "подтверждено", stillNeededShort: "ещё нужно",
    searching: "Поиск…", vendorsFound: "поставщиков найдено",
    searchForVendors: "Поиск поставщиков", filterByName: "Фильтр по имени…",
    findingVendors: "Ищем поставщиков…", noVendorsFound: "Поставщики не найдены",
    searchAgain: "Искать снова", close: "Закрыть",
    alreadySelected: "Уже выбран — нажмите для отмены",
    selectVendor: "Выбрать этого поставщика", viewBizPage: "Смотреть страницу",
    noPhotos: "Фотографий портфолио пока нет",
    requestsSent: "Запросы отправлены!", sentWithErrors: "Отправлено с ошибками",
    sendInquiryAll: "Отправить запрос всем поставщикам",
    vendorReplyNote: "Поставщики ответят на твои запросы. Следи за ними в сообщениях.",
    viewInquiries: "Посмотреть запросы", sending: "Отправка…",
    cancel: "Отмена", sent: "Отправлено", failed: "Ошибка",
    addService: "Добавить услугу", addServicePlaceholder: "напр. Мороженое, Фотобудка…",
    removeService: "Удалить",
    catLabels: {
      religious: "Религиозное", roles: "Ключевые роли", clothing: "Одежда",
      ceremony: "Церемония", reception: "Приём", celebration: "Торжество",
      food: "Еда и торт", decoration: "Украшения", media: "Фото и видео",
      entertainment: "Развлечения", attire: "Наряды", venue: "Площадка",
      tech: "Техника и AV", other: "Прочее",
    },
    serviceTitles: {
      church: "Бронирование церкви", baptism_candle: "Крестильная свеча", cross: "Крестик для малыша",
      kavor: "Крёстный отец", kavork: "Крёстная мать", baby_outfit: "Белый наряд для малыша",
      venue: "Площадка", catering: "Кейтеринг", cake: "Торт", wedding_cake: "Свадебный торт",
      photographer: "Фотограф", videographer: "Видеограф",
      decoration: "Украшения", balloon_decoration: "Воздушные шары",
      flowers: "Цветы", music: "Музыка / DJ", tamada: "Тамада",
      wedding_rings: "Обручальные кольца", ring: "Помолвочное кольцо", bridal_dress: "Свадебное платье",
      ceremony_venue: "Место церемонии", reception_venue: "Банкетный зал",
      av_tech: "AV-техника", entertainment: "Развлечения", animator: "Детский аниматор",
    },
  },
};
export const txp = (lang) => PLAN_T[lang] || PLAN_T.en;

/* ─── Initial state ──────────────────────────────────────────────────── */
export const INITIAL_EVENT_STATE = {
  event_type: null, event_type_label: null,
  accent: PC.brand, gradient: null, date: null, city: null,
  guest_count: null, style: null, budget: null, notes: null,
  services: [], selected_vendors: {},
};

/* ─── Event templates ────────────────────────────────────────────────── */
export const EVENT_TEMPLATES = {
  christening: {
    label: "Christening / Baptism", accent: "#e11d5c",
    gradient: "linear-gradient(135deg,#e11d5c,#f43f5e)",
    services: [
      { service_type: "church",         title: "Church Booking",          category: "religious",   required: true },
      { service_type: "baptism_candle", title: "Baptism Candle",          category: "religious",   required: true },
      { service_type: "cross",          title: "Cross for Baby",          category: "religious",   required: true },
      { service_type: "kavor",          title: "Godfather (Kavor)",       category: "roles",       required: true },
      { service_type: "kavork",         title: "Godmother (Kavork)",      category: "roles",       required: true },
      { service_type: "baby_outfit",    title: "White Baby Outfit",       category: "clothing",    required: true },
      { service_type: "venue",          title: "Celebration Venue",       category: "celebration", required: true,  canSearch: true },
      { service_type: "catering",       title: "Catering",                category: "celebration", required: true,  canSearch: true },
      { service_type: "cake",           title: "Christening Cake",        category: "celebration", required: true,  canSearch: true },
      { service_type: "photographer",   title: "Photographer",            category: "media",       required: true,  canSearch: true },
      { service_type: "decoration",     title: "Decorations",             category: "celebration", required: false, canSearch: true },
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
      { service_type: "catering",      title: "Catering & Coffee Breaks", category: "food",          required: true, canSearch: true },
      { service_type: "av_tech",       title: "AV & Tech Setup",          category: "tech",          required: true },
      { service_type: "photographer",  title: "Event Photographer",       category: "media",         required: true, canSearch: true },
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

/* ─── applyActions ───────────────────────────────────────────────────── */
export function applyActions(actions, prev) {
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
          accent: tpl?.accent || PC.brand,
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
        state = { ...state, services: (state.services || []).filter(s => s.service_type !== a.service_type) };
        break;
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

/* ─── Icon maps ──────────────────────────────────────────────────────── */
const SERVICE_ICON_MAP = {
  church: Building, baptism_candle: Flame, cross: Plus,
  kavor: User, kavork: User, baby_outfit: Package,
  venue: Building2, catering: UtensilsCrossed, cake: Cake,
  wedding_cake: Cake, photographer: Camera, videographer: Video,
  decoration: Star, balloon_decoration: Star,
  flowers: Flower2, music: Music, tamada: Mic, wedding_rings: Gem,
  ring: Gem, bridal_dress: Gem, ceremony_venue: Building,
  reception_venue: Building2, av_tech: Monitor,
  entertainment: Music, animator: Smile,
};
export const getServiceIcon = (type, props = {}) => {
  const Icon = SERVICE_ICON_MAP[type] || Star;
  return <Icon {...props} />;
};

const CATEGORY_LABELS = {
  religious: "Religious", roles: "Key Roles", clothing: "Attire",
  ceremony: "Ceremony", reception: "Reception", celebration: "Celebration",
  food: "Food & Cake", decoration: "Decorations", media: "Photo & Video",
  entertainment: "Entertainment", attire: "Attire", venue: "Venue",
  tech: "Tech & AV", other: "Other",
};

/* ─── MetaChip ───────────────────────────────────────────────────────── */
function MetaChip({ icon, children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(15,23,42,0.04)", border: `1px solid ${PC.border}`, borderRadius: 999, padding: "4px 10px", fontSize: 11, color: PC.text2, whiteSpace: "nowrap" }}>
      {icon}{children}
    </div>
  );
}

/* ─── ServiceRow ─────────────────────────────────────────────────────── */
function ServiceRow({ service, selectedVendor, vendorResults, onSearchVendors, onUnselectVendor, onOpenSearch, onRemoveService, accent, lang = "en" }) {
  const t = txp(lang);
  const results     = vendorResults[service.service_type] || [];
  const isSelected  = !!selectedVendor;
  const isSearching = service.searching;
  const hasResults  = results.length > 0 && !isSelected;
  const iconColor   = isSelected ? PC.green : (accent || PC.brand);
  const displayTitle = t.serviceTitles?.[service.service_type] || service.title;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0" }}>
      <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isSelected ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 460, damping: 22 }}
            style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={10} color={PC.green} strokeWidth={2.5} />
          </motion.div>
        ) : isSearching ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${(accent || PC.brand)}22`, borderTopColor: accent || PC.brand }} />
        ) : (
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${PC.border}` }} />
        )}
      </div>
      <div style={{ width: 16, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: isSelected ? 0.4 : 0.6 }}>
        {getServiceIcon(service.service_type, { size: 13, color: iconColor, strokeWidth: 1.8 })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.77rem", fontWeight: isSelected ? 500 : 600, color: isSelected ? PC.text3 : PC.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isSelected ? "line-through" : "none" }}>
          {displayTitle}
        </p>
        {isSelected && selectedVendor && <p style={{ margin: "1px 0 0", fontSize: "0.67rem", color: PC.green, fontWeight: 600 }}>{selectedVendor.name}</p>}
        {!service.required && !isSelected && <span style={{ fontSize: "0.58rem", color: PC.text3 }}>{t.optional}</span>}
      </div>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
        {isSelected ? (
          <button onClick={() => onUnselectVendor(service.service_type)}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "2px", color: PC.text3, display: "flex" }}
            onMouseEnter={e => e.currentTarget.style.color = PC.text2} onMouseLeave={e => e.currentTarget.style.color = PC.text3}>
            <X size={12} />
          </button>
        ) : hasResults ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => onOpenSearch(service.service_type)}
            style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#fefce8", border: "1px solid #fde68a", color: "#92400e", borderRadius: 6, padding: "4px 9px", fontSize: "0.66rem", fontWeight: 700, cursor: "pointer" }}>
            {results.length} {t.found} <ChevronRight size={9} strokeWidth={2.5} />
          </motion.button>
        ) : service.canSearch && !isSearching ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => { onSearchVendors(service.service_type, displayTitle); onOpenSearch(service.service_type); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "transparent", border: `1px solid ${PC.border}`, color: PC.text3, borderRadius: 6, padding: "4px 9px", fontSize: "0.66rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = PC.brand + "44"; e.currentTarget.style.color = PC.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = PC.border; e.currentTarget.style.color = PC.text3; }}>
            <Search size={9} strokeWidth={2.5} /> {t.find}
          </motion.button>
        ) : null}
        {onRemoveService && (
          <button onClick={() => onRemoveService(service.service_type)} title={t.removeService}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "2px 3px", color: "transparent", display: "flex", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fca5a5"} onMouseLeave={e => e.currentTarget.style.color = "transparent"}>
            <X size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── CategorySection ────────────────────────────────────────────────── */
function CategorySection({ label, services, selectedVendors, onOpenSearch, lang = "en", ...rowProps }) {
  const [open, setOpen] = useState(true);
  const done = services.filter(s => selectedVendors?.[s.service_type]).length;
  const all  = done === services.length;
  return (
    <div style={{ marginBottom: 2 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "6px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: PC.text3, letterSpacing: "0.09em", textTransform: "uppercase" }}>{label}</span>
          {done > 0 && (
            <span style={{ fontSize: "0.58rem", fontWeight: 700, borderRadius: 100, padding: "1px 6px", background: all ? "#f0fdf4" : "transparent", color: all ? "#16a34a" : PC.text3, border: `1px solid ${all ? "#bbf7d0" : PC.border}` }}>
              {done}/{services.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={10} style={{ color: PC.text3 }} /> : <ChevronDown size={10} style={{ color: PC.text3 }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} style={{ overflow: "hidden" }}>
            {services.map((s, idx) => (
              <div key={s.service_type}>
                {idx > 0 && <div style={{ height: 1, background: PC.border, marginLeft: 27 }} />}
                <ServiceRow service={s} selectedVendor={selectedVendors?.[s.service_type]} onOpenSearch={onOpenSearch} lang={lang} {...rowProps} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── AddServiceRow ──────────────────────────────────────────────────── */
function AddServiceRow({ onAdd, lang = "en" }) {
  const t = txp(lang);
  const [open, setOpen]   = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleOpen = () => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 60); };
  const handleSubmit = () => {
    const v = value.trim();
    if (!v) { setOpen(false); return; }
    onAdd(v);
    setValue(""); setOpen(false);
  };

  return (
    <div style={{ marginTop: 10 }}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: `1px dashed ${PC.border}`, borderRadius: 8, padding: "6px 12px", fontSize: "0.72rem", color: PC.text3, cursor: "pointer", fontFamily: "inherit", width: "100%", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = PC.brand + "50"; e.currentTarget.style.color = PC.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = PC.border; e.currentTarget.style.color = PC.text3; }}>
            <Plus size={12} strokeWidth={2} /> {t.addService}
          </motion.button>
        ) : (
          <motion.div key="input" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, background: "#f8fafc", border: `1px solid ${PC.brand}44`, borderRadius: 8, padding: "6px 10px" }}>
              <Plus size={12} color={PC.brand} strokeWidth={2} />
              <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { setOpen(false); setValue(""); } }}
                placeholder={t.addServicePlaceholder}
                style={{ flex: 1, border: "none", outline: "none", fontSize: "0.78rem", background: "transparent", color: PC.text, fontFamily: "inherit" }} />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit}
              style={{ background: PC.grad, border: "none", borderRadius: 7, padding: "6px 12px", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, display: "flex" }}>
              <Check size={13} />
            </motion.button>
            <button onClick={() => { setOpen(false); setValue(""); }}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", color: PC.text3, display: "flex" }}>
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── VendorCard ─────────────────────────────────────────────────────── */
const VENDOR_COLORS = [["#7c3aed","#a855f7"],["#e11d5c","#f43f5e"],["#059669","#10b981"],["#d97706","#f59e0b"],["#0891b2","#06b6d4"]];
function VendorCard({ vendor, isSelected, onPreview }) {
  const name  = vendor.business_name || vendor.name || "Vendor";
  const image = vendor.cover_image || vendor.logo_url || null;
  const rating = parseFloat(vendor.rating) || 0;
  const city   = vendor.city || "";
  const [c1, c2] = VENDOR_COLORS[name.charCodeAt(0) % VENDOR_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onClick={() => onPreview(vendor)}
      style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "#fff", border: isSelected ? `2.5px solid ${PC.brand}` : `1.5px solid ${PC.border}`, boxShadow: isSelected ? `0 0 0 4px ${PC.brand}18, 0 4px 16px rgba(0,0,0,0.08)` : "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s, box-shadow 0.15s" }}
    >
      <div style={{ height: 110, position: "relative", overflow: "hidden" }}>
        {image ? (
          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${c1}33, ${c2}55)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "2rem", fontWeight: 900, color: c1, opacity: 0.5 }}>{name[0]?.toUpperCase()}</span>
          </div>
        )}
        <AnimatePresence>
          {isSelected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, background: "rgba(225,29,92,0.52)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#fff", borderRadius: 100, padding: "4px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                <Check size={11} color={PC.brand} strokeWidth={3} />
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: PC.brand }}>Selected</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ padding: "8px 10px 9px" }}>
        <p style={{ margin: "0 0 2px", fontSize: "0.76rem", fontWeight: 700, color: PC.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {rating > 0 && <><Star size={9} style={{ color: "#f59e0b", fill: "#f59e0b", flexShrink: 0 }} /><span style={{ fontSize: "0.64rem", color: PC.text2, fontWeight: 600, flexShrink: 0 }}>{rating.toFixed(1)}</span></>}
          {city && <span style={{ fontSize: "0.62rem", color: PC.text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rating > 0 ? " · " : ""}{city}</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── VendorDetailPopup ──────────────────────────────────────────────── */
function VendorDetailPopup({ vendor, isSelected, onSelect, onClose, lang }) {
  const t = txp(lang);
  const [photos, setPhotos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const name = vendor.business_name || vendor.name || "Vendor";
  const slug = vendor.slug || "";

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const params = new URLSearchParams({ limit: "16" });
    if (vendor.id) params.set("vendor_id", vendor.id);
    fetch(`${base}/products?${params}`).then(r => r.json()).then(d => setPhotos((d.data || []).filter(p => p.thumbnail_url || p.images?.[0]?.url))).catch(() => setPhotos([])).finally(() => setLoading(false));
  }, [vendor.id]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }} onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: "90%", maxWidth: 640, maxHeight: "86vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}>
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${PC.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${PC.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: PC.text2 }}>
              <X size={13} />
            </button>
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: PC.text }}>{name}</span>
          </div>
          {slug && (
            <a href={`/${lang}/vendor/${slug}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: PC.grad, border: "none", borderRadius: 8, padding: "7px 14px", color: "#fff", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {t.viewBizPage}
              </motion.button>
            </a>
          )}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}><Loader2 size={26} color={PC.text3} /></motion.div>
            </div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: PC.text3, fontSize: "0.84rem" }}>{t.noPhotos}</div>
          ) : (
            <div style={{ columns: "4 140px", columnGap: 8 }}>
              {photos.map((p, i) => {
                const img = p.thumbnail_url || p.images?.[0]?.url;
                return <div key={p.id || i} style={{ breakInside: "avoid", marginBottom: 8, borderRadius: 8, overflow: "hidden" }}><img src={img} alt={p.name || ""} style={{ width: "100%", display: "block", borderRadius: 8 }} loading="lazy" /></div>;
              })}
            </div>
          )}
        </div>
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${PC.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { onSelect(vendor); onClose(); }}
            style={{ flex: 1, padding: "11px 0", background: isSelected ? "#f0fdf4" : PC.grad, border: isSelected ? "1.5px solid #86efac" : "none", borderRadius: 12, color: isSelected ? "#16a34a" : "#fff", fontSize: "0.87rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit", boxShadow: isSelected ? "none" : "0 6px 20px rgba(225,29,92,0.28)" }}>
            <Check size={14} strokeWidth={2.5} />
            {isSelected ? t.alreadySelected : t.selectVendor}
          </motion.button>
          <button onClick={onClose} style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${PC.borderMd}`, borderRadius: 12, color: PC.text2, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {t.close}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── VendorSearchModal ──────────────────────────────────────────────── */
function VendorSearchModal({ service, vendorResults, onSelect, onClose, onSearch, accent, selectedVendors = {}, lang = "en" }) {
  const t = txp(lang);
  const [query, setQuery]         = useState("");
  const [detailVendor, setDetail] = useState(null);
  const results    = vendorResults[service.service_type] || [];
  const isSearching = service.searching;
  const filtered = query.trim() ? results.filter(v => (v.business_name || v.name || "").toLowerCase().includes(query.toLowerCase())) : results;

  useEffect(() => { if (!results.length && !isSearching) onSearch(service.service_type, service.title); }, []);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { if (!detailVendor) onClose(); }}
        style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.40)", backdropFilter: "blur(6px)" }}>
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }} onClick={e => e.stopPropagation()}
          style={{ background: "#fff", borderRadius: 20, width: "90%", maxWidth: 540, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${PC.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${accent || PC.brand}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {getServiceIcon(service.service_type, { size: 15, color: accent || PC.brand, strokeWidth: 1.8 })}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: PC.text }}>{txp(lang).serviceTitles?.[service.service_type] || service.title}</h3>
                <p style={{ margin: 0, fontSize: "0.7rem", color: PC.text3 }}>
                  {isSearching ? t.searching : results.length > 0 ? `${results.length} ${t.vendorsFound}` : t.searchForVendors}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${PC.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: PC.text3 }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ padding: "10px 20px", borderBottom: `1px solid ${PC.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: `1px solid ${PC.borderMd}`, borderRadius: 10, padding: "8px 12px" }}>
              <Search size={13} color={PC.text3} />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder={t.filterByName}
                style={{ flex: 1, border: "none", outline: "none", fontSize: "0.84rem", background: "transparent", color: PC.text, fontFamily: "inherit" }} />
              {query && <button onClick={() => setQuery("")} style={{ border: "none", background: "none", cursor: "pointer", color: PC.text3, padding: 0, display: "flex" }}><X size={12} /></button>}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px 20px" }}>
            {isSearching && !results.length ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 12 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}><Loader2 size={24} color={PC.text3} /></motion.div>
                <p style={{ margin: 0, fontSize: "0.84rem", color: PC.text3 }}>{t.findingVendors}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ margin: "0 0 12px", fontSize: "0.88rem", color: PC.text2, fontWeight: 600 }}>{t.noVendorsFound}</p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setQuery(""); onSearch(service.service_type, service.title); }}
                  style={{ background: PC.grad, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: "0.8rem", color: "#fff", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                  <Search size={12} /> {t.searchAgain}
                </motion.button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 10 }}>
                {filtered.map((v, i) => (
                  <VendorCard key={v.id || i} vendor={v} isSelected={selectedVendors[service.service_type]?.id === v.id} onPreview={setDetail} />
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: "10px 20px", borderTop: `1px solid ${PC.border}`, display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
            <button onClick={onClose} style={{ padding: "8px 18px", background: "transparent", border: `1px solid ${PC.borderMd}`, borderRadius: 8, color: PC.text2, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {t.close}
            </button>
          </div>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {detailVendor && (
          <VendorDetailPopup vendor={detailVendor} isSelected={selectedVendors[service.service_type]?.id === detailVendor.id}
            onSelect={vendor => { onSelect(service.service_type, vendor); setDetail(null); onClose(); }}
            onClose={() => setDetail(null)} lang={lang} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── BulkInquiryModal ───────────────────────────────────────────────── */
export function BulkInquiryModal({ eventState, sessionId, onClose, lang }) {
  const t = txp(lang);
  const vendors = Object.entries(eventState.selected_vendors || {});
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState({});
  const [done,    setDone]    = useState(false);
  const allSent = Object.keys(results).length === vendors.length && Object.values(results).every(v => v === "ok");

  const handleSend = async () => {
    if (!vendors.length) return;
    setSending(true);
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const eventTypeLine = eventState.event_type_label || eventState.event_type?.replace(/_/g, " ") || "event";
    const guestLine  = eventState.guest_count ? `Guests: ${eventState.guest_count}` : "";
    const dateLine   = eventState.date ? `Date: ${eventState.date}` : "";
    const cityLine   = eventState.city ? `Location: ${eventState.city}` : "";
    const budgetLine = eventState.budget?.description ? `Budget: ${eventState.budget.description}` : "";
    const newResults = {};
    await Promise.all(vendors.map(async ([serviceType, vendor]) => {
      const svc = (eventState.services || []).find(s => s.service_type === serviceType);
      const svcTitle = txp(lang).serviceTitles?.[serviceType] || svc?.title || serviceType.replace(/_/g, " ");
      const body = {
        vendor_id: vendor.id,
        subject: `Inquiry for ${svcTitle} — ${eventTypeLine}`,
        message: [`Hello! I'm planning a ${eventTypeLine} and I'd love to work with you for ${svcTitle}.`, "", [dateLine, cityLine, guestLine, budgetLine].filter(Boolean).join("\n"), "", "Please let me know your availability and pricing. Looking forward to hearing from you!"].join("\n"),
        event_type: eventState.event_type,
        guest_count: eventState.guest_count ? parseInt(eventState.guest_count) : undefined,
        ...(sessionId ? { planner_session_id: sessionId } : {}),
      };
      try {
        const res = await fetch(`${base}/user/inquiries`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
        newResults[serviceType] = res.ok ? "ok" : "err";
      } catch { newResults[serviceType] = "err"; }
    }));
    setResults(newResults); setSending(false); setDone(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.35)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, padding: "28px 28px 24px", width: "90%", maxWidth: 460, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: "1.02rem", fontWeight: 800, color: PC.text }}>
            {done ? (allSent ? "✓ " + t.requestsSent : t.sentWithErrors) : t.sendInquiryAll}
          </h3>
          <p style={{ margin: 0, fontSize: "0.82rem", color: PC.text2, lineHeight: 1.5 }}>
            {done ? t.vendorReplyNote : `${t.sendInquiryAll} (${vendors.length})`}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {vendors.map(([serviceType, vendor]) => {
            const result = results[serviceType];
            return (
              <div key={serviceType} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: result === "ok" ? "#f0fdf4" : result === "err" ? "#fef2f2" : "#f8fafc", border: `1px solid ${result === "ok" ? "#bbf7d0" : result === "err" ? "#fecaca" : PC.border}`, borderRadius: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: result === "ok" ? "#dcfce7" : result === "err" ? "#fee2e2" : "rgba(15,23,42,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {sending && !result ? <Loader2 size={14} color={PC.text3} style={{ animation: "spin 0.8s linear infinite" }} /> : result === "ok" ? <Check size={14} color="#16a34a" /> : result === "err" ? <X size={14} color="#dc2626" /> : <Send size={14} color={PC.text3} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.79rem", fontWeight: 600, color: PC.text }}>{vendor.name}</p>
                  <p style={{ margin: 0, fontSize: "0.68rem", color: PC.text3, textTransform: "capitalize" }}>{txp(lang).serviceTitles?.[serviceType] || serviceType.replace(/_/g, " ")}</p>
                </div>
                {result === "ok" && <span style={{ fontSize: "0.67rem", color: "#16a34a", fontWeight: 700 }}>{t.sent}</span>}
                {result === "err" && <span style={{ fontSize: "0.67rem", color: "#dc2626", fontWeight: 700 }}>{t.failed}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {done ? (
            <>
              <Link href={`/${lang}/account/inquiries`} style={{ textDecoration: "none", flex: 1 }}>
                <button style={{ width: "100%", padding: "11px 0", background: PC.grad, border: "none", borderRadius: 12, color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.viewInquiries}</button>
              </Link>
              <button onClick={onClose} style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${PC.border}`, borderRadius: 12, color: PC.text2, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.close}</button>
            </>
          ) : (
            <>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSend} disabled={sending || !vendors.length}
                style={{ flex: 1, padding: "11px 0", background: vendors.length ? PC.grad : "rgba(15,23,42,0.07)", border: "none", borderRadius: 12, color: vendors.length ? "#fff" : PC.text3, fontSize: "0.87rem", fontWeight: 700, cursor: vendors.length ? "pointer" : "default", boxShadow: vendors.length ? "0 6px 20px rgba(225,29,92,0.25)" : "none", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {sending ? <><Loader2 size={14} /> {t.sending}</> : <><Send size={14} /> Send to {vendors.length} Vendors</>}
              </motion.button>
              <button onClick={onClose} style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${PC.border}`, borderRadius: 12, color: PC.text2, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.cancel}</button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── EventPlanPanel (main export) ──────────────────────────────────── */
export default function EventPlanPanel({ eventState, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor, onAddService, onRemoveService, sessionId, lang, onOpenBulkModal }) {
  const t = txp(lang);
  const { event_type_label, accent, date, city, guest_count, budget, services = [], selected_vendors = {} } = eventState;
  const searchable = services.filter(s => s.canSearch);
  const sel = Object.keys(selected_vendors).length;
  const grouped = {};
  for (const s of services) { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); }
  const missing = services.filter(s => s.required && s.canSearch && !selected_vendors[s.service_type]);
  const pct = searchable.length > 0 ? Math.round((sel / searchable.length) * 100) : 0;

  const [searchModalSvc, setSearchModalSvc] = useState(null);
  const modalService = searchModalSvc ? services.find(s => s.service_type === searchModalSvc) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid ${PC.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: PC.brand, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: PC.brand, display: "inline-block" }} />
              {t.planningInProgress}
            </div>
            <h2 style={{ margin: 0, fontSize: "1.18rem", fontWeight: 400, color: PC.text, lineHeight: 1.2, letterSpacing: "-0.03em", fontFamily: "'Georgia', serif" }}>
              {event_type_label}
            </h2>
          </div>
          {sel > 0 && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onOpenBulkModal}
              style={{ background: PC.grad, border: "none", borderRadius: 999, padding: "5px 11px", fontSize: 11, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 12px rgba(225,29,92,0.22)", flexShrink: 0 }}>
              <Send size={10} /> {t.sendToVendors}
            </motion.button>
          )}
        </div>

        {/* Meta chips */}
        {(date || city || guest_count || budget?.description) && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            {date        && <MetaChip icon={<Calendar   size={10} color={PC.brand} />}>{date}</MetaChip>}
            {city        && <MetaChip icon={<MapPin      size={10} color={PC.brand} />}>{city}</MetaChip>}
            {guest_count && <MetaChip icon={<Users       size={10} color={PC.brand} />}>{guest_count} {t.guests}</MetaChip>}
            {budget?.description && <MetaChip icon={<DollarSign size={10} color={PC.brand} />}>{budget.description}</MetaChip>}
          </div>
        )}

        {/* Progress bar */}
        {searchable.length > 0 && (
          <div>
            <div style={{ height: 3, borderRadius: 999, background: "rgba(15,23,42,0.06)", overflow: "hidden" }}>
              <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: pct === 100 ? "#86efac" : PC.grad, borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.61rem", color: PC.text3 }}>
              <span>{sel} / {searchable.length} {t.confirmed}</span>
              <span>{pct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 24px" }}>
        {/* Missing warning */}
        {missing.length > 0 && sel > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertTriangle size={13} color="#92400e" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: "0.71rem", color: "#92400e", lineHeight: 1.5 }}>
              <strong>{t.stillNeeded}</strong> {missing.map(s => t.serviceTitles?.[s.service_type] || s.title).join(", ")}
            </p>
          </motion.div>
        )}

        {/* Category sections */}
        <div>
          {Object.entries(grouped).map(([cat, items], idx) => (
            <div key={cat}>
              {idx > 0 && <div style={{ height: 1, background: PC.border, margin: "6px 0" }} />}
              <CategorySection
                label={t.catLabels?.[cat] || CATEGORY_LABELS[cat] || cat}
                services={items} selectedVendors={selected_vendors}
                vendorResults={vendorResults} onSearchVendors={onSearchVendors}
                onUnselectVendor={onUnselectVendor} onRemoveService={onRemoveService}
                accent={accent} lang={lang}
                onOpenSearch={svc => setSearchModalSvc(svc)}
              />
            </div>
          ))}
        </div>

        {onAddService && <AddServiceRow onAdd={onAddService} lang={lang} />}
      </div>

      {/* Vendor search modal */}
      <AnimatePresence>
        {searchModalSvc && modalService && (
          <VendorSearchModal
            service={modalService} vendorResults={vendorResults}
            onSelect={onSelectVendor} onClose={() => setSearchModalSvc(null)}
            onSearch={onSearchVendors} accent={accent}
            selectedVendors={selected_vendors} lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
