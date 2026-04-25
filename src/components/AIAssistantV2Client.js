"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";
const PINK_DARK = "#9f1239";

const T = {
  hero: {
    en: ["Your event.", "Planned in minutes."],
    hy: ["Ձեր տոնը.", "Պլանավորված րոպեներում."],
    ru: ["Ваш праздник.", "Спланирован за минуты."],
  },
  sub: {
    en: "Balloons, cakes, venues, gifts, photographers — tell Salooote AI what you need and we'll plan it, find vendors, and estimate the budget.",
    hy: "Փուչիկներ, տորթեր, սրահներ, նվերներ, ֆոտոգրաֆներ — ասեք Salooote AI-ին ինչ է պետք, նա կպլանավորի, կգտնի մատակարարներ և կհաշվի բյուջեն։",
    ru: "Шары, торты, площадки, подарки, фотографы — расскажите Salooote AI что нужно, мы спланируем, найдём поставщиков и оценим бюджет.",
  },
  placeholder: {
    en: "Help me plan my daughter's 5th birthday tomorrow…",
    hy: "Օգնեք պլանավորել աղջկաս 5-ամյա ծնունդը վաղը…",
    ru: "Помогите спланировать день рождения дочки на 5 лет завтра…",
  },
  chips: {
    en: [
      { icon: "cake",     label: "Plan a birthday" },
      { icon: "balloon",  label: "Find balloons" },
      { icon: "gift",     label: "Send a gift" },
      { icon: "ring",     label: "Plan a wedding" },
      { icon: "bolt",     label: "Last-minute event" },
    ],
    hy: [
      { icon: "cake",     label: "Պլանավորել ծնունդ" },
      { icon: "balloon",  label: "Գտնել փուչիկներ" },
      { icon: "gift",     label: "Ուղարկել նվեր" },
      { icon: "ring",     label: "Պլանավորել հարսանիք" },
      { icon: "bolt",     label: "Վերջին պահի միջոցառում" },
    ],
    ru: [
      { icon: "cake",     label: "Спланировать день рождения" },
      { icon: "balloon",  label: "Найти шары" },
      { icon: "gift",     label: "Отправить подарок" },
      { icon: "ring",     label: "Спланировать свадьбу" },
      { icon: "bolt",     label: "Срочное мероприятие" },
    ],
  },
  scrollCue: {
    en: "See how Salooote can help you",
    hy: "Տեսեք ինչպես կարող է օգնել Salooote-ը",
    ru: "Узнать, как Salooote может помочь",
  },
  welcome: {
    en: "Hi, I'm **Sali**.\n\nTell me what you're looking for — an occasion, a gift, or something specific — and I'll find the right options for you.",
    hy: "Բարև, ես **Sali**-ն եմ։\n\nԱսեք ինչ եք փնտրում — առիթ, նվեր կամ ինչ-որ կոնկրետ բան — ես կընտրեմ լավագույն տարբերակները։",
    ru: "Привет, я **Sali**.\n\nРасскажите, что ищете — праздник, подарок или что-то конкретное — я подберу варианты.",
  },
  planBtn:  { en: "Plan this event",  hy: "Պլանավորել",   ru: "Планировать" },
  sendBtn:  { en: "Ask Sali",         hy: "Հարցնել",     ru: "Спросить" },
  saliKnows:{ en: "Sali knows",       hy: "Sali գիտի",   ru: "Sali помнит" },
  online:   { en: "Online",           hy: "Առցանց",      ru: "Онлайн" },
  viewProduct: { en: "View product", hy: "Տեսնել",     ru: "Открыть" },
  viewStore:   { en: "View store",   hy: "Տեսնել",     ru: "Открыть" },

  browseTitle: {
    en: "Browse by Category",
    hy: "Թերթեք ըստ կատեգորիայի",
    ru: "По категориям",
  },
  browseHeadline: {
    en: "Everything you need",
    hy: "Ամեն ինչ, ինչ պետք է",
    ru: "Всё, что нужно",
  },
  allCategories: {
    en: "All categories",
    hy: "Բոլոր կատեգորիաները",
    ru: "Все категории",
  },
  trendingTitle: {
    en: "Hand-picked for you",
    hy: "Ընտրված է հատուկ ձեզ համար",
    ru: "Подобрано для вас",
  },
  trendingHeadline: {
    en: "Trending Now",
    hy: "Հայտնի հիմա",
    ru: "Популярные сейчас",
  },
  trendingTabs: {
    en: [
      { key: "birthday", label: "Birthday" },
      { key: "wedding",  label: "Wedding" },
      { key: "party",    label: "Party" },
    ],
    hy: [
      { key: "birthday", label: "Ծնունդ" },
      { key: "wedding",  label: "Հարսանիք" },
      { key: "party",    label: "Միջոցառում" },
    ],
    ru: [
      { key: "birthday", label: "День рождения" },
      { key: "wedding",  label: "Свадьба" },
      { key: "party",    label: "Вечеринка" },
    ],
  },
};

const tx = (obj, lang) => obj[lang] || obj.en;

// ── Icon set (replaces all emoji) ─────────────────────────────────
const ICON_PATHS = {
  cake:     <><path d="M20 21V11a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10"/><path d="M4 16h16"/><path d="M12 9V6"/><path d="M12 4v0"/><path d="M2 21h20"/></>,
  balloon:  <><path d="M12 16c3.5 0 6-3.5 6-7a6 6 0 1 0-12 0c0 3.5 2.5 7 6 7Z"/><path d="M12 16v3"/><path d="M10.5 19h3"/></>,
  gift:     <><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 5 12 8c0-3 2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></>,
  ring:     <><circle cx="12" cy="14" r="6"/><path d="m9 8 1.5-4h3L15 8"/></>,
  bolt:     <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></>,
  sparkle:  <><path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/><path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/></>,
  search:   <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  check:    <><path d="m5 12 5 5 9-11"/></>,
  heart:    <><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"/></>,
  pin:      <><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></>,
  users:    <><circle cx="9" cy="8" r="3.5"/><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14.5a4.5 4.5 0 0 1 6 4.5"/></>,
  user:     <><circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/></>,
  dollar:   <><path d="M12 2v20"/><path d="M16 7h-5a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6H7"/></>,
  palette:  <><path d="M12 3a9 9 0 0 0 0 18c1.5 0 2.5-1 2.5-2.3 0-1.4-1-2.4-2.5-2.4-1 0-1.7-.5-1.7-1.4 0-1 .8-1.4 2-1.4H14a4 4 0 0 0 0-8 9 9 0 0 0-2-1.5Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="16" cy="9" r="1"/></>,
  attach:   <><path d="M21.4 11 12.2 20.2a6 6 0 1 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 1 1-2.8-2.8l8.5-8.5"/></>,
  mic:      <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11v1a7 7 0 0 0 14 0v-1"/><path d="M12 19v3"/><path d="M8 22h8"/></>,
  send:     <><path d="m3 11 18-8-8 18-2-8-8-2Z"/></>,
  arrowRight: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  arrowDown:  <><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></>,
  history:  <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>,
  clock:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  flower:   <><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C12 6 9.5 4 7 5s-2 4 0 5.5"/><path d="M14.5 12c3.5 0 5.5-2.5 4.5-5s-4-2-5.5 0"/><path d="M12 14.5c0 3.5 2.5 5.5 5 4.5s2-4 0-5.5"/><path d="M9.5 12c-3.5 0-5.5 2.5-4.5 5s4 2 5.5 0"/></>,
  glass:    <><path d="M5 4h14l-1.5 8a5 5 0 0 1-4.5 3.5h-2A5 5 0 0 1 6.5 12L5 4Z"/><path d="M12 15.5V21"/><path d="M9 21h6"/></>,
  party:    <><path d="m4 20 4-13 9 9-13 4Z"/><path d="M9 8c2-2 4-4 7-4"/><path d="M16 14c-1.5 1-2 2.5-2 4"/></>,
  business: <><rect x="3" y="6" width="18" height="14" rx="1.5"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M3 12h18"/></>,
  baby:     <><circle cx="12" cy="11" r="4.5"/><path d="M9 18a4 4 0 0 0 6 0"/><path d="M9.5 8.5h.01"/><path d="M14.5 8.5h.01"/></>,
  church:   <><path d="M12 2v6"/><path d="M9 5h6"/><path d="M5 21V11l7-4 7 4v10"/><path d="M9 21v-5h6v5"/></>,
  x:        <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
  grid:     <><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></>,
  flame:    <><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-5 0 2 1 3 2 3 0-3 0-5 2-8z"/></>,
  plus:     <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  cart:     <><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l3 12h12l2-8H6"/></>,
};
function Icon({ name, size = 18, className = "", style }) {
  const path = ICON_PATHS[name] || ICON_PATHS.sparkle;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden
    >{path}</svg>
  );
}

function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace("/api/v1", "");
  return `${base}${url}`;
}
const fmt = (p) => { const n = parseFloat(p); return isNaN(n) ? "" : n.toLocaleString() + " ֏"; };

function BoldText({ text }) {
  return <>{text.split(/\*\*(.*?)\*\*/g).map((s, i) => i % 2 === 1 ? <strong key={i} style={{ color: PINK_DARK }}>{s}</strong> : s)}</>;
}
function MsgText({ text }) {
  return (
    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
      {text.split("\n").map((line, i, a) => (
        <span key={i}><BoldText text={line} />{i < a.length - 1 && <br />}</span>
      ))}
    </span>
  );
}

const EVENT_ICONS = {
  birthday: "cake", kids_party: "balloon", wedding: "ring", corporate: "business",
  engagement: "ring", anniversary: "glass", baby_shower: "baby", christening: "church",
};

function StateBar({ state, lang }) {
  const pills = [];
  if (state.event_type) pills.push({ icon: EVENT_ICONS[state.event_type] || "party", label: state.event_type.replace(/_/g, " ") });
  if (state.recipient) {
    let label = state.recipient;
    if (state.age != null) label += ` · ${state.age}`;
    pills.push({ icon: "user", label });
  }
  if (state.deadline) pills.push({ icon: "clock", label: state.deadline });
  if (state.city) pills.push({ icon: "pin", label: state.city });
  if (state.style) pills.push({ icon: "sparkle", label: state.style });
  if (!pills.length) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
      borderBottom: "1px solid rgba(240,218,228,.5)",
      background: "rgba(255,248,251,.85)",
      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      flexWrap: "wrap", minHeight: 42,
    }}>
      <span style={{
        fontSize: 9.5, color: "#c0a0b0", fontWeight: 800,
        letterSpacing: 1, textTransform: "uppercase", flexShrink: 0,
      }}>
        {tx(T.saliKnows, lang)}
      </span>
      {pills.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 12px 4px 9px", borderRadius: 22,
          background: "#fff", border: "1px solid rgba(240,218,228,.9)",
          fontSize: 11.5, color: "#5a1a2f", fontWeight: 600,
          boxShadow: "0 1px 4px rgba(225,29,92,.07)",
        }}>
          <Icon name={p.icon} size={13} style={{ color: PINK }} />
          {p.label}
        </div>
      ))}
    </div>
  );
}

function Avatar({ size = 30 }) {
  return (
    <div className="v2-avatar" style={{ width: size, height: size, minWidth: size }}>
      <span className="v2-avatar-ring" />
      <span className="v2-avatar-core">
        <svg width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3.5c1.4 3.6 2.7 4.9 6.3 6.3-3.6 1.4-4.9 2.7-6.3 6.3-1.4-3.6-2.7-4.9-6.3-6.3 3.6-1.4 4.9-2.7 6.3-6.3z" fill="url(#sg)" />
          <circle cx="18" cy="18" r="1.6" fill="url(#sg)" opacity=".85" />
          <circle cx="5.4" cy="17.5" r="1.1" fill="url(#sg)" opacity=".7" />
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#ffe4ee" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar />
      <div style={{
        display: "flex", gap: 5, padding: "13px 18px",
        background: "#fff", borderRadius: "6px 20px 20px 20px",
        border: "1.5px solid rgba(240,228,232,.9)",
        boxShadow: "0 1px 2px rgba(0,0,0,.03), 0 6px 16px rgba(0,0,0,.05)",
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: PINK, display: "block",
            animation: `v2dot 1.3s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p, lang, onOpen }) {
  const img = imgSrc(p.thumbnail_url || p.images?.[0]?.url);
  const name = (lang !== "en" && p[`name_${lang}`]) || p.name || "Product";
  const [hover, setHover] = useState(false);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (added) return;
    addToCart({
      product_id: p.id,
      vendor_id: p.vendor_id,
      name,
      price: parseFloat(p.price) || 0,
      image: img,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onOpen(p, "product")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter") onOpen(p, "product"); }}
      style={{
        flexShrink: 0, width: 158, borderRadius: 18, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left",
        overflow: "hidden", position: "relative",
        border: `1.5px solid ${hover ? "#fbc9d8" : "rgba(240,228,232,.8)"}`,
        boxShadow: hover
          ? "0 16px 36px rgba(225,29,92,.16), 0 4px 12px rgba(225,29,92,.08)"
          : "0 1px 2px rgba(0,0,0,.03), 0 4px 14px rgba(0,0,0,.05)",
        transform: hover ? "translateY(-4px) scale(1.01)" : "none",
        transition: "all .28s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "linear-gradient(145deg,#fdf3f6,#fbe8ed)", position: "relative", overflow: "hidden" }}>
        {img
          ? <Image src={img} alt={name} fill style={{ objectFit: "cover", transform: hover ? "scale(1.07)" : "none", transition: "transform .4s ease" }} sizes="158px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#e0c0cb" }}><Icon name="gift" size={32} /></div>}
        {p.price > 0 && (
          <button
            type="button"
            onClick={handleAddCart}
            aria-label={lang === "ru" ? "В корзину" : lang === "hy" ? "Զամբյուղ" : "Add to cart"}
            className={`v2-mini-cart ${added ? "is-added" : ""}`}
          >
            <Icon name={added ? "check" : "plus"} size={14} />
          </button>
        )}
      </div>
      <div style={{ padding: "11px 13px 13px" }}>
        <p style={{
          margin: 0, fontSize: 12.5, fontWeight: 600, color: "#1a0a14", lineHeight: 1.4,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{name}</p>
        {p.price > 0 && <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 800, color: PINK, letterSpacing: -0.3 }}>{fmt(p.price)}</p>}
      </div>
    </div>
  );
}

function VendorCard({ v, onOpen }) {
  const banner = imgSrc(v.banner_url || v.logo_url);
  const logo = imgSrc(v.logo_url);
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onOpen(v, "vendor")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flexShrink: 0, width: 176, borderRadius: 18, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left", overflow: "hidden",
        border: `1.5px solid ${hover ? "#fbc9d8" : "rgba(240,228,232,.8)"}`,
        boxShadow: hover
          ? "0 16px 36px rgba(225,29,92,.16), 0 4px 12px rgba(225,29,92,.08)"
          : "0 1px 2px rgba(0,0,0,.03), 0 4px 14px rgba(0,0,0,.05)",
        transform: hover ? "translateY(-4px) scale(1.01)" : "none",
        transition: "all .28s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", height: 80, background: "linear-gradient(135deg,#fce7ef 0%,#fde8ec 60%,#fff1f5 100%)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="176px" />}
        {logo && (
          <div style={{
            position: "absolute", bottom: -15, left: 13, width: 34, height: 34,
            borderRadius: "50%", border: "3px solid #fff", overflow: "hidden", background: "#fff",
            boxShadow: "0 3px 10px rgba(0,0,0,.14)",
          }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="34px" />
          </div>
        )}
      </div>
      <div style={{ padding: "22px 13px 13px" }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "#1a0a14", letterSpacing: -0.1 }}>
          {v.business_name || "Store"}
        </p>
        {v.city && <p style={{ margin: "3px 0 0", fontSize: 11, color: "#b09aa6", display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="pin" size={11} />{v.city}</p>}
        {v.short_bio && (
          <p style={{
            margin: "5px 0 0", fontSize: 11, color: "#7c6571", lineHeight: 1.45,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>{v.short_bio}</p>
        )}
      </div>
    </button>
  );
}

function Block({ block, lang, onOpen }) {
  const items = block.data;
  if (!items || (Array.isArray(items) && !items.length)) return null;
  return (
    <div>
      {block.title && (
        <p style={{
          margin: "0 0 9px 40px", fontSize: 10, fontWeight: 800,
          color: "#c8adb8", letterSpacing: 1, textTransform: "uppercase",
        }}>{block.title}</p>
      )}
      <div className="v2-cards" style={{
        display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6,
        paddingLeft: 40, paddingRight: 16,
        overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch",
        scrollSnapType: "x mandatory",
      }}>
        {block.type === "products" && items.map((p, i) => (
          <ProductCard key={p.id || i} p={p} lang={lang} onOpen={onOpen} />
        ))}
        {block.type === "vendors" && items.map((v, i) => (
          <VendorCard key={v.id || i} v={v} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function MsgBubble({ msg, lang, onPlanEvent }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "72%", padding: "12px 17px", fontSize: 14, lineHeight: 1.65,
          borderRadius: "22px 22px 6px 22px",
          background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
          color: "#fff",
          boxShadow: "0 6px 18px rgba(225,29,92,.3)",
          letterSpacing: 0.1,
        }}>
          <MsgText text={msg.text} />
        </div>
      </div>
    );
  }

  if (msg.role === "bot") {
    if (msg.type === "text") {
      return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <Avatar />
          <div style={{
            maxWidth: "84%", padding: "13px 17px", fontSize: 14, lineHeight: 1.75,
            borderRadius: "6px 22px 22px 22px",
            background: "#fff", color: "#1a0a14",
            border: "1.5px solid rgba(240,228,232,.9)",
            boxShadow: "0 1px 2px rgba(0,0,0,.03), 0 6px 16px rgba(0,0,0,.05)",
            letterSpacing: 0.1,
          }}>
            <MsgText text={msg.text} />
          </div>
        </div>
      );
    }
    if (msg.type === "plan") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar />
          <button
            onClick={() => onPlanEvent(msg.event_type)}
            style={{
              padding: "13px 26px", borderRadius: 16, border: "none",
              background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
              color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: 0.1,
              cursor: "pointer", boxShadow: "0 8px 22px rgba(225,29,92,.34)",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(225,29,92,.44)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(225,29,92,.34)"; }}
          >
            {tx(T.planBtn, lang)}
          </button>
        </div>
      );
    }
  }
  return null;
}

function Popup({ item, type, lang, onClose }) {
  const [idx, setIdx] = useState(0);
  const imgs = [];
  if (type === "product") {
    (item.images || []).forEach(i => { const s = imgSrc(i.url); if (s) imgs.push(s); });
    if (!imgs.length && item.thumbnail_url) { const s = imgSrc(item.thumbnail_url); if (s) imgs.push(s); }
  } else {
    [item.banner_url, item.logo_url].forEach(u => { const s = imgSrc(u); if (s && !imgs.includes(s)) imgs.push(s); });
  }
  const name = type === "product"
    ? ((lang !== "en" && item[`name_${lang}`]) || item.name || "Product")
    : (item.business_name || "Store");
  const desc = type === "product"
    ? ((lang !== "en" && item[`short_description_${lang}`]) || item.short_description || item.description?.replace(/<[^>]+>/g, "") || "")
    : (item.short_bio || item.description?.replace(/<[^>]+>/g, "") || "");
  const href = type === "product"
    ? `/${lang}/product/${item.slug || item.id}`
    : `/${lang}/vendor/${item.slug || item.id}`;

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    if (added) return;
    addToCart({
      product_id: item.id,
      vendor_id: item.vendor_id,
      name,
      price: parseFloat(item.price) || 0,
      image: imgs[0] || null,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div onClick={onClose} className="v2-pop-back">
      <div onClick={e => e.stopPropagation()} className="v2-pop">
        <button onClick={onClose} className="v2-pop-close" aria-label="Close">
          <Icon name="x" size={16} />
        </button>

        {/* Image / gallery */}
        <div className="v2-pop-media">
          {imgs[idx]
            ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="(max-width:760px) 100vw, 420px" />
            : <div className="v2-pop-fallback"><Icon name="gift" size={60} /></div>}
          {imgs.length > 1 && (
            <div className="v2-pop-thumbs">
              {imgs.slice(0, 5).map((src, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`v2-pop-thumb ${i === idx ? "is-active" : ""}`} aria-label={`Image ${i+1}`}>
                  <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details column */}
        <div className="v2-pop-info">
          <h2 className="v2-pop-name">{name}</h2>

          {type === "product" && item.price > 0 && (
            <p className="v2-pop-price">{fmt(item.price)}</p>
          )}
          {type === "vendor" && item.city && (
            <p className="v2-pop-meta"><Icon name="pin" size={13} />{item.city}</p>
          )}

          {desc && (
            <p className="v2-pop-desc">
              {desc.slice(0, 220)}{desc.length > 220 ? "…" : ""}
            </p>
          )}

          {type === "product" && item.tags?.length > 0 && (
            <div className="v2-pop-tags">
              {item.tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="v2-pop-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="v2-pop-actions">
            {type === "product" && item.price > 0 && (
              <button onClick={handleAdd} className={`v2-pop-cart ${added ? "is-added" : ""}`}>
                <Icon name={added ? "check" : "gift"} size={16} />
                {added
                  ? (lang === "ru" ? "Добавлено" : lang === "hy" ? "Ավելացված է" : "Added")
                  : (lang === "ru" ? "В корзину" : lang === "hy" ? "Զամբյուղ" : "Add to cart")}
              </button>
            )}
            <Link href={href} className="v2-pop-view">
              {type === "product" ? tx(T.viewProduct, lang) : tx(T.viewStore, lang)}
              <Icon name="arrowRight" size={14} style={{ marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrbVisual() {
  // Glassy 3D iridescent orb hero — pure CSS / SVG, no emoji
  return (
    <div className="v2-orb-stage">
      {/* Soft ambient halo */}
      <div className="v2-orb-halo" />
      {/* Main orb */}
      <div className="v2-orb">
        <div className="v2-orb-core" />
        <div className="v2-orb-glow" />
        <div className="v2-orb-highlight" />
        <div className="v2-orb-rim" />
      </div>
      {/* Reflection */}
      <div className="v2-orb-reflection" />
      {/* Floating icon chips around the orb */}
      {[
        { icon: "cake",    style: { top: "8%",  left: "12%" }, delay: "0s"   },
        { icon: "balloon", style: { top: "14%", right: "10%" }, delay: ".5s" },
        { icon: "gift",    style: { top: "55%", left: "4%" },  delay: "1s"   },
        { icon: "ring",    style: { top: "52%", right: "2%" }, delay: "1.5s" },
        { icon: "flower",  style: { bottom: "8%", left: "26%" }, delay: "2s" },
        { icon: "glass",   style: { bottom: "12%", right: "22%" }, delay: "2.5s" },
      ].map((c, i) => (
        <div key={i} className="v2-orb-chip" style={{ ...c.style, animationDelay: c.delay }}>
          <Icon name={c.icon} size={18} />
        </div>
      ))}
    </div>
  );
}

function Landing({ lang, onSend, input, setInput, inputRef }) {
  const chips = tx(T.chips, lang);
  const [heroLine1, heroLine2] = tx(T.hero, lang);
  const canSend = input.trim().length > 0;

  return (
    <div className="v2-landing">
      <div className="v2-landing-grid">
        {/* LEFT: text + chat input + chips */}
        <div className="v2-left">
          <h1 className="v2-headline">
            <span className="v2-h-line1">{heroLine1}</span>
            <br />
            <span className="v2-h-line2">{heroLine2}</span>
          </h1>

          <p className="v2-sub">{tx(T.sub, lang)}</p>

          {/* Big chat card */}
          <div className="v2-chat-card">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder={tx(T.placeholder, lang)}
              rows={2}
              className="v2-chat-textarea"
            />
            <div className="v2-chat-actions">
              <button type="button" className="v2-icon-btn" aria-label="Attach">
                <Icon name="attach" size={18} />
              </button>
              <div style={{ flex: 1 }} />
              <button type="button" className="v2-icon-btn" aria-label="Voice input">
                <Icon name="mic" size={18} />
              </button>
              <button
                type="button"
                onClick={() => onSend()}
                disabled={!canSend}
                className="v2-send-btn"
                aria-label="Send"
              >
                <Icon name="send" size={17} />
              </button>
            </div>
          </div>

          {/* Prompt pills */}
          <div className="v2-pills">
            {chips.map((chip, i) => (
              <button
                key={i}
                className="v2-pill"
                onClick={() => onSend(chip.label)}
              >
                <Icon name={chip.icon} size={14} style={{ marginRight: 7, color: PINK }} />
                {chip.label}
              </button>
            ))}
          </div>

          {/* Scroll cue */}
          <button
            type="button"
            className="v2-scroll-cue"
            onClick={() => {
              const el = document.getElementById("v2-browse");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {tx(T.scrollCue, lang)}
            <Icon name="arrowDown" size={14} style={{ marginLeft: 6 }} />
          </button>
        </div>

        {/* RIGHT: 3D glassy orb visual */}
        <div className="v2-right">
          <OrbVisual />
        </div>
      </div>

      {/* Browse by Category */}
      <BrowseByCategory lang={lang} />

      {/* Trending Now */}
      <TrendingNow lang={lang} />

      {/* "How it works" anchor section below the fold */}
      <section id="v2-howitworks" className="v2-how">
        <h2 className="v2-how-title">
          {lang === "ru" ? "Как Salooote планирует ваш праздник"
            : lang === "hy" ? "Ինչպես Salooote-ը պլանավորում է ձեր տոնը"
            : "How Salooote plans your event"}
        </h2>
        <p className="v2-how-sub">
          {lang === "ru" ? "Скажите, что нужно — мы найдём поставщиков, цены и составим план."
            : lang === "hy" ? "Ասեք ինչ է պետք — մենք կգտնենք մատակարարներին, գները և կկազմենք պլանը։"
            : "Tell us what you need — we find vendors, prices, and build a plan."}
        </p>
        <div className="v2-how-grid">
          {[
            { icon: "sparkle", title: lang === "ru" ? "Расскажите" : lang === "hy" ? "Ասեք" : "Describe",
              desc: lang === "ru" ? "Тип события, дата, бюджет, гости." : lang === "hy" ? "Միջոցառման տեսակը, ամսաթիվ, բյուջե։" : "Event type, date, budget, guests." },
            { icon: "search", title: lang === "ru" ? "Найдём" : lang === "hy" ? "Կգտնենք" : "Find",
              desc: lang === "ru" ? "Подберём поставщиков и продукты." : lang === "hy" ? "Կգտնենք մատակարարների և ապրանքներ։" : "We match vendors and products." },
            { icon: "calendar", title: lang === "ru" ? "План" : lang === "hy" ? "Պլան" : "Plan",
              desc: lang === "ru" ? "Сравните цены, фото, отзывы." : lang === "hy" ? "Համեմատեք գները, լուսանկարները, գնահատականները։" : "Compare prices, photos, reviews." },
            { icon: "check", title: lang === "ru" ? "Бронь" : lang === "hy" ? "Ամրագրում" : "Book",
              desc: lang === "ru" ? "Запросите цитату или забронируйте." : lang === "hy" ? "Պատվերեք կամ ամրագրեք ուղիղ։" : "Request a quote or book directly." },
          ].map((card, i) => (
            <div key={i} className="v2-how-card">
              <div className="v2-how-icon"><Icon name={card.icon} size={22} /></div>
              <h3 className="v2-how-card-title">{card.title}</h3>
              <p className="v2-how-card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Browse by Category ─────────────────────────────────────────────
function BrowseByCategory({ lang }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/categories?locale=${lang}`)
      .then(r => r.json())
      .then(j => {
        if (!cancelled) {
          setCats(Array.isArray(j?.data) ? j.data.slice(0, 12) : []);
          setLoading(false);
        }
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [lang]);

  if (loading) return null;
  if (!cats.length) return null;

  return (
    <section id="v2-browse" className="v2-browse">
      <div className="v2-browse-head">
        <div>
          <p className="v2-browse-eyebrow">{tx(T.browseTitle, lang)}</p>
          <h2 className="v2-browse-headline">{tx(T.browseHeadline, lang)}</h2>
        </div>
        <Link href={`/${lang}/category`} className="v2-browse-all">
          {tx(T.allCategories, lang)}
          <Icon name="arrowRight" size={14} style={{ marginLeft: 6 }} />
        </Link>
      </div>
      <div className="v2-cat-grid">
        {cats.map(c => {
          const img = imgSrc(c.image_url);
          return (
            <Link
              key={c.id}
              href={`/${lang}/category/${c.slug}`}
              className="v2-cat-card"
            >
              <div className="v2-cat-thumb">
                {img ? (
                  <Image src={img} alt={c.name} fill style={{ objectFit: "cover" }} sizes="(max-width:520px) 50vw, 200px" />
                ) : (
                  <div className="v2-cat-fallback"><Icon name="grid" size={26} /></div>
                )}
              </div>
              <div className="v2-cat-meta">
                <p className="v2-cat-name">{c.name}</p>
                {typeof c.product_count === "number" && (
                  <p className="v2-cat-count">{c.product_count}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Trending Now ────────────────────────────────────────────────────
function TrendingNow({ lang }) {
  const tabs = tx(T.trendingTabs, lang);
  const [active, setActive] = useState(tabs[0].key);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const q = encodeURIComponent(active);
    fetch(`${API}/products?limit=8&search=${q}&locale=${lang}`)
      .then(r => r.json())
      .then(j => {
        if (!cancelled) {
          let arr = Array.isArray(j?.data) ? j.data : [];
          if (!arr.length) {
            // Fallback: any products
            return fetch(`${API}/products?limit=8&locale=${lang}`)
              .then(r2 => r2.json())
              .then(j2 => {
                if (!cancelled) setItems(Array.isArray(j2?.data) ? j2.data : []);
                setLoading(false);
              });
          }
          setItems(arr);
          setLoading(false);
        }
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [active, lang]);

  return (
    <section className="v2-trending">
      <div className="v2-trending-head">
        <p className="v2-browse-eyebrow">{tx(T.trendingTitle, lang)}</p>
        <h2 className="v2-browse-headline">
          <Icon name="flame" size={26} style={{ marginRight: 8, color: PINK, verticalAlign: -3 }} />
          {tx(T.trendingHeadline, lang)}
        </h2>
        <div className="v2-trend-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`v2-trend-tab ${active === t.key ? "is-active" : ""}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="v2-trend-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="v2-trend-card v2-skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="v2-trend-empty">
          {lang === "ru" ? "Скоро появится" : lang === "hy" ? "Շուտով" : "Coming soon"}
        </p>
      ) : (
        <div className="v2-trend-grid">
          {items.slice(0, 8).map(p => {
            const img = imgSrc(p.thumbnail_url || p.images?.[0]?.url);
            const name = (lang !== "en" && p[`name_${lang}`]) || p.name || "Product";
            return (
              <Link key={p.id} href={`/${lang}/product/${p.id}`} className="v2-trend-card">
                <div className="v2-trend-thumb">
                  {img ? (
                    <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="(max-width:920px) 50vw, 240px" />
                  ) : (
                    <div className="v2-trend-fallback"><Icon name="gift" size={32} /></div>
                  )}
                </div>
                <div className="v2-trend-meta">
                  <p className="v2-trend-name">{name}</p>
                  {p.price > 0 && <p className="v2-trend-price">{fmt(p.price)}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ── Chat header with step progress + Save + History ────────────────
function ChatHeader({ lang, chatState, messages, sessionId, setSessionId }) {
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);

  // Compute progress steps based on what we know about the event.
  const stepDefs = [
    { key: "event_type", label: lang === "ru" ? "Тип" : lang === "hy" ? "Տեսակ" : "Type" },
    { key: "deadline",   label: lang === "ru" ? "Дата" : lang === "hy" ? "Ամսաթիվ" : "Date" },
    { key: "city",       label: lang === "ru" ? "Город" : lang === "hy" ? "Քաղաք" : "City" },
    { key: "guest_count",label: lang === "ru" ? "Гости" : lang === "hy" ? "Հյուրեր" : "Guests" },
    { key: "budget",     label: lang === "ru" ? "Бюджет" : lang === "hy" ? "Բյուջե" : "Budget" },
    { key: "style",      label: lang === "ru" ? "Стиль" : lang === "hy" ? "Ոճ" : "Style" },
  ];

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("access_token");

  const onSave = async () => {
    if (!isLoggedIn) {
      window.location.href = `/${lang}/login?next=/${lang}/newhomepage2nd`;
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      const title = chatState.event_type
        ? `${chatState.event_type.replace(/_/g, " ")}${chatState.recipient ? ` — ${chatState.recipient}` : ""}`
        : (lang === "ru" ? "Новый план" : lang === "hy" ? "Նոր պլան" : "New plan");
      const body = {
        title,
        event_type: chatState.event_type || null,
        event_date: chatState.deadline || null,
        guest_count: chatState.guest_count || null,
        budget: chatState.budget || null,
        currency: "AMD",
        location: chatState.city || null,
        event_data: { ...chatState, _messages: messages.slice(-30) },
      };
      const url = sessionId
        ? `${API}/user/planner/sessions/${sessionId}`
        : `${API}/user/planner/sessions`;
      const method = sessionId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (j?.success && j?.data?.id && !sessionId) setSessionId(j.data.id);
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1800);
    } catch (e) {
      // silent fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 22px",
      background: "rgba(255,255,255,.92)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(240,218,228,.6)",
      flexShrink: 0, flexWrap: "wrap",
    }}>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(225,29,92,.26) 0%,transparent 70%)",
          animation: "halo 3s ease-in-out infinite",
        }} />
        <Avatar size={38} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{
          margin: 0, fontWeight: 800, fontSize: 17, color: "#1a0a14", letterSpacing: -0.4,
          lineHeight: 1.1,
        }}>Sali</p>
        <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#b09aa6", fontWeight: 500 }}>
          {lang === "ru" ? "AI-консьерж" : lang === "hy" ? "AI օգնական" : "AI Concierge"}
        </p>
      </div>

      {/* Step progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 14, flex: 1, minWidth: 240 }}>
        {stepDefs.map((s, i) => {
          const filled = !!chatState[s.key];
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: filled ? PINK : "#fff",
                border: `1.5px solid ${filled ? PINK : "#ebd5dd"}`,
                color: filled ? "#fff" : "#c4a5b3",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                transition: "all .25s",
              }}>{filled ? <Icon name="check" size={12} /> : i + 1}</div>
              {i < stepDefs.length - 1 && (
                <div style={{
                  flex: 1, height: 2, borderRadius: 2,
                  background: filled ? PINK : "#f0e2e8",
                  transition: "background .25s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* History link */}
      <Link
        href={`/${lang}/account/events`}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "7px 12px", borderRadius: 999,
          background: "#fff", border: "1px solid #ebd5dd",
          color: "#1a0a14", fontSize: 12.5, fontWeight: 600, textDecoration: "none",
        }}
        title={lang === "ru" ? "История" : lang === "hy" ? "Պատմություն" : "History"}
      >
        <Icon name="history" size={14} />
        <span>{lang === "ru" ? "История" : lang === "hy" ? "Պատմություն" : "History"}</span>
      </Link>

      {/* Save plan */}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "8px 14px", borderRadius: 999,
          background: savedTick ? "#16a34a" : `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
          color: "#fff", border: "none", cursor: saving ? "default" : "pointer",
          fontSize: 12.5, fontWeight: 700, letterSpacing: ".1px",
          boxShadow: "0 6px 18px rgba(225,29,92,.28)",
          opacity: saving ? .7 : 1, transition: "all .2s",
        }}
      >
        <Icon name={savedTick ? "check" : "heart"} size={14} />
        {savedTick
          ? (lang === "ru" ? "Сохранено" : lang === "hy" ? "Պահպանված է" : "Saved")
          : sessionId
            ? (lang === "ru" ? "Обновить" : lang === "hy" ? "Թարմացնել" : "Update")
            : (lang === "ru" ? "Сохранить" : lang === "hy" ? "Պահպանել" : "Save plan")}
      </button>
    </div>
  );
}

function ChatInput({ lang, input, setInput, onSend, typing, inputRef }) {
  return (
    <div style={{
      padding: "12px 18px 18px",
      background: "rgba(255,255,255,.9)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(240,218,228,.5)",
      flexShrink: 0,
    }}>
      <div className="v2-input-bar" style={{
        display: "flex", alignItems: "flex-end", gap: 8,
        border: "1.5px solid rgba(240,218,228,.9)", borderRadius: 20,
        padding: "5px 6px 5px 6px", background: "#fff",
        boxShadow: "0 2px 10px rgba(225,29,92,.06)",
        transition: "all .22s",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          placeholder={tx(T.placeholder, lang)}
          rows={1}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            padding: "11px 13px", fontSize: 14, color: "#1a0a14",
            resize: "none", lineHeight: 1.55, fontFamily: "inherit",
            maxHeight: 120, overflowY: "auto",
          }}
        />
        <button
          onClick={() => onSend()}
          disabled={!input.trim() || typing}
          style={{
            width: 42, height: 42, borderRadius: 14, border: "none",
            background: input.trim() && !typing
              ? `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`
              : "#f5e6ed",
            color: input.trim() && !typing ? "#fff" : "#cca8b8",
            cursor: input.trim() && !typing ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: input.trim() && !typing ? "0 6px 18px rgba(225,29,92,.34)" : "none",
            transition: "all .2s cubic-bezier(.2,.8,.2,1)", flexShrink: 0,
            fontSize: 16,
          }}
          onMouseEnter={e => { if (input.trim() && !typing) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(225,29,92,.44)"; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = input.trim() && !typing ? "0 6px 18px rgba(225,29,92,.34)" : "none"; }}
          aria-label="Send"
        ><Icon name="send" size={16} /></button>
      </div>
    </div>
  );
}

export default function AIAssistantV2Client({ lang }) {
  const router = useRouter();
  const [phase, setPhase] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatState, setChatState] = useState({});
  const [popup, setPopup] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const revealItems = useCallback((items) => {
    if (!items.length) return;
    const DELAY = 750;
    setMessages(prev => [...prev, items[0]]);
    items.slice(1).forEach((item, i) => {
      const t1 = setTimeout(() => setTyping(true), i * DELAY + 60);
      const t2 = setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, item]);
      }, (i + 1) * DELAY + 60);
      timersRef.current.push(t1, t2);
    });
  }, []);

  const send = useCallback(async (override) => {
    const text = (typeof override === "string" ? override : input).trim();
    if (!text || typing) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setTyping(false);

    const isFirstMessage = phase === "landing";
    if (isFirstMessage) setPhase("chat");

    const welcomeEntry = isFirstMessage
      ? [{ id: "w", role: "bot", type: "text", text: tx(T.welcome, lang) }]
      : [];

    const userEntry = { id: Date.now(), role: "user", type: "text", text };

    setMessages(prev => [...prev, ...welcomeEntry, userEntry]);
    setInput("");
    setTyping(true);

    const allMsgs = [...messages, ...welcomeEntry, userEntry];
    const history = allMsgs
      .filter(m => (m.role === "user" || (m.role === "bot" && m.type === "text")) && m.id !== "w")
      .slice(-10)
      .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch(`${API}/smart-assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, state: chatState, lang }),
      });
      const json = await res.json();
      const d = json?.data || {};
      setTyping(false);

      if (d.state) setChatState(d.state);

      const base = Date.now() + 1;
      const seq = [];

      if (d.action === "plan_event") {
        if (d.message) seq.push({ id: base, role: "bot", type: "text", text: d.message });
        seq.push({ id: base + 1, role: "bot", type: "plan", event_type: d.event_type });
      } else {
        (d.blocks || []).forEach((block, i) => {
          if (block.data?.length) {
            seq.push({ id: base + i, role: "bot", type: "block", block });
          }
        });
        if (d.message) {
          seq.push({ id: base + 100, role: "bot", type: "text", text: d.message });
        }
      }

      if (seq.length) revealItems(seq);

    } catch {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(), role: "bot", type: "text",
        text: "Something went wrong. Please try again!",
      }]);
    }
  }, [input, typing, phase, messages, chatState, lang, revealItems]);

  const handlePlanEvent = useCallback((eventType) => {
    router.push(`/${lang}/planner?event=${eventType}`);
  }, [lang, router]);

  const openPopup = useCallback((item, type) => setPopup({ item, type }), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes v2dot{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-6px);opacity:1}}
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.18);opacity:.25}}
        @keyframes orbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes v2fade{from{opacity:0}to{opacity:1}}
        @keyframes v2pop{from{opacity:0;transform:scale(.94) translateY(12px)}to{opacity:1;transform:none}}
        @keyframes v2In{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes halo{0%,100%{transform:scale(1);opacity:.42}50%{transform:scale(1.5);opacity:.12}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        .v2-scroll::-webkit-scrollbar{width:4px}
        .v2-scroll::-webkit-scrollbar-thumb{background:rgba(225,29,92,.12);border-radius:4px}
        .v2-cards::-webkit-scrollbar{height:3px}
        .v2-cards::-webkit-scrollbar-thumb{background:rgba(225,29,92,.15);border-radius:3px}
        .v2-cards>*{scroll-snap-align:start}
        .v2-input-wrap:focus-within{border-color:rgba(225,29,92,.5)!important;box-shadow:0 16px 48px rgba(225,29,92,.16),0 0 0 5px rgba(225,29,92,.07)!important}
        .v2-input-bar:focus-within{border-color:rgba(225,29,92,.5)!important;box-shadow:0 0 0 4px rgba(225,29,92,.07),0 4px 16px rgba(225,29,92,.1)!important}
        .v2-chip:hover{background:#fff!important;border-color:rgba(225,29,92,.4)!important;color:${PINK}!important;transform:translateY(-2px);box-shadow:0 6px 18px rgba(225,29,92,.16)!important}
        .v2-msg{animation:v2In .3s cubic-bezier(.2,.8,.2,1)}

        /* ── Layla-style landing ── */
        .v2-landing{flex:1;overflow-y:auto;overflow-x:hidden;background:#fff;-webkit-overflow-scrolling:touch}
        .v2-landing::-webkit-scrollbar{width:6px}
        .v2-landing::-webkit-scrollbar-thumb{background:#f0e0e6;border-radius:6px}

        .v2-landing-grid{
          min-height:calc(100vh - 65px);
          display:grid;grid-template-columns:1.1fr 1fr;gap:48px;
          align-items:center;padding:24px 64px;
          max-width:1280px;margin:0 auto;width:100%;
        }
        .v2-left{display:flex;flex-direction:column;gap:18px;animation:v2In .55s cubic-bezier(.2,.8,.2,1)}

        .v2-headline{
          margin:0;font-family:'Fraunces',Georgia,serif;
          font-size:clamp(40px,5vw,68px);font-weight:700;
          line-height:1.02;letter-spacing:-1.6px;color:#1a0a14;
        }
        .v2-h-line1{font-style:normal;font-variation-settings:"opsz" 144}
        .v2-h-line2{
          font-style:italic;font-variation-settings:"opsz" 144;
          background:linear-gradient(135deg,${PINK} 0%,#9f1239 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .v2-sub{
          margin:6px 0 8px;max-width:520px;
          font-size:16px;line-height:1.6;color:#6b4654;letter-spacing:.05px;
        }

        .v2-chat-card{
          background:#fff;border:1.5px solid #ece2e7;border-radius:22px;
          padding:14px 14px 10px;max-width:560px;
          box-shadow:0 16px 44px rgba(225,29,92,.08),0 2px 6px rgba(0,0,0,.03);
          transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-chat-card:focus-within{
          border-color:rgba(225,29,92,.4);
          box-shadow:0 18px 52px rgba(225,29,92,.18),0 0 0 5px rgba(225,29,92,.06);
        }
        .v2-chat-textarea{
          width:100%;border:none;outline:none;background:transparent;
          font-family:inherit;font-size:15.5px;line-height:1.55;color:#1a0a14;
          padding:8px 6px;resize:none;min-height:56px;max-height:140px;letter-spacing:.05px;
        }
        .v2-chat-actions{display:flex;align-items:center;gap:8px;padding:6px 4px 0}
        .v2-icon-btn{
          width:36px;height:36px;border:none;border-radius:50%;background:transparent;
          color:#9b8390;cursor:pointer;display:flex;align-items:center;justify-content:center;
          transition:all .15s;
        }
        .v2-icon-btn:hover{background:#fdf2f5;color:${PINK}}
        .v2-send-btn{
          width:42px;height:42px;border:none;border-radius:50%;
          background:#1a0a14;color:#fff;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 6px 16px rgba(26,10,20,.25);
          transition:all .18s cubic-bezier(.2,.8,.2,1);
        }
        .v2-send-btn:hover:not(:disabled){background:${PINK};transform:translateY(-1px) scale(1.04);box-shadow:0 8px 22px rgba(225,29,92,.4)}
        .v2-send-btn:disabled{background:#e5d8df;color:#fff;cursor:default;box-shadow:none}

        .v2-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
        .v2-pill{
          display:inline-flex;align-items:center;
          padding:9px 16px;border-radius:24px;
          background:#fdf2f5;border:1px solid transparent;
          color:#5a1a2f;font-size:13px;font-weight:500;letter-spacing:.05px;
          cursor:pointer;transition:all .18s cubic-bezier(.2,.8,.2,1);
          font-family:inherit;
        }
        .v2-pill:hover{background:#fff;border-color:${PINK};color:${PINK};transform:translateY(-1px);box-shadow:0 6px 16px rgba(225,29,92,.16)}

        .v2-scroll-cue{
          margin-top:18px;padding:6px 0;border:none;background:transparent;
          color:#a08596;font-size:13px;font-weight:500;cursor:pointer;
          align-self:flex-start;font-family:inherit;letter-spacing:.05px;
          transition:color .15s;
        }
        .v2-scroll-cue:hover{color:${PINK}}

        .v2-right{display:flex;align-items:center;justify-content:center}

        /* ── 3D glassy orb ── */
        .v2-orb-stage{
          position:relative;width:100%;max-width:480px;aspect-ratio:1/1;
        }
        .v2-orb-halo{
          position:absolute;inset:-10%;border-radius:50%;
          background:
            radial-gradient(circle at 30% 30%, rgba(255,228,236,.85) 0%, transparent 55%),
            radial-gradient(circle at 70% 70%, rgba(214,228,255,.6) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(255,213,229,.5) 0%, transparent 65%);
          filter:blur(36px);
          animation:v2-halo-spin 14s linear infinite;
        }
        .v2-orb{
          position:absolute;inset:18%;border-radius:50%;
          animation:v2-orb-float 6s ease-in-out infinite;
          filter:drop-shadow(0 30px 50px rgba(225,29,92,.22));
        }
        .v2-orb-core{
          position:absolute;inset:0;border-radius:50%;
          background:
            radial-gradient(circle at 32% 26%, #fff 0%, rgba(255,255,255,0) 22%),
            radial-gradient(circle at 30% 30%, #ffd9e6 0%, #f8a5c2 25%, #d56fa3 55%, #6b3a8a 100%),
            linear-gradient(135deg, #ffd1e0 0%, #c0e8ff 50%, #e0d5ff 100%);
          background-blend-mode:normal,screen,normal;
          box-shadow:
            inset 0 -22px 40px rgba(72,16,52,.45),
            inset 18px -10px 50px rgba(255,170,210,.45),
            inset -18px 8px 50px rgba(140,200,255,.5),
            inset 0 18px 32px rgba(255,255,255,.55);
        }
        .v2-orb-glow{
          position:absolute;inset:0;border-radius:50%;
          background:radial-gradient(circle at 70% 80%, rgba(125,200,255,.7) 0%, transparent 35%);
          mix-blend-mode:screen;opacity:.85;
        }
        .v2-orb-highlight{
          position:absolute;top:8%;left:18%;width:35%;height:25%;
          background:radial-gradient(ellipse, rgba(255,255,255,.95) 0%, rgba(255,255,255,0) 65%);
          border-radius:50%;filter:blur(2px);transform:rotate(-22deg);
        }
        .v2-orb-rim{
          position:absolute;inset:0;border-radius:50%;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);
          background:
            conic-gradient(from 200deg at 50% 50%,
              rgba(255,255,255,0) 0deg,
              rgba(255,180,210,.3) 60deg,
              rgba(160,210,255,.4) 180deg,
              rgba(220,180,255,.3) 270deg,
              rgba(255,255,255,0) 360deg);
          mix-blend-mode:screen;opacity:.75;animation:v2-orb-spin 18s linear infinite;
        }
        .v2-orb-reflection{
          position:absolute;left:10%;right:10%;bottom:-2%;height:28%;
          background:radial-gradient(ellipse at 50% 0%, rgba(225,150,190,.4) 0%, rgba(225,150,190,0) 60%);
          filter:blur(8px);transform:scaleY(.55);opacity:.55;
        }
        .v2-orb-chip{
          position:absolute;width:38px;height:38px;border-radius:14px;
          background:rgba(255,255,255,.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
          border:1px solid rgba(225,29,92,.15);
          display:flex;align-items:center;justify-content:center;
          color:${PINK};box-shadow:0 8px 18px rgba(225,29,92,.16);
          animation:v2-orb-chip-float 5s ease-in-out infinite;
          z-index:2;
        }
        @keyframes v2-orb-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes v2-orb-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes v2-halo-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes v2-orb-chip-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

        /* ── Browse by Category ── */
        .v2-browse{
          max-width:1180px;margin:0 auto;padding:88px 32px 16px;
        }
        .v2-browse-head{
          display:flex;align-items:flex-end;justify-content:space-between;
          gap:24px;margin-bottom:28px;flex-wrap:wrap;
        }
        .v2-browse-eyebrow{
          margin:0;font-size:12px;font-weight:700;letter-spacing:1.4px;
          text-transform:uppercase;color:${PINK};
        }
        .v2-browse-headline{
          margin:6px 0 0;font-family:'Fraunces',Georgia,serif;
          font-size:clamp(32px,4vw,46px);font-style:italic;font-weight:700;
          color:#1a0a14;letter-spacing:-1px;line-height:1.05;
        }
        .v2-browse-all{
          display:inline-flex;align-items:center;
          padding:10px 18px;border-radius:999px;
          background:#fff;border:1px solid #f0e2e8;
          color:#1a0a14;font-size:14px;font-weight:600;
          text-decoration:none;transition:all .2s;
        }
        .v2-browse-all:hover{border-color:${PINK};color:${PINK};transform:translateY(-1px);box-shadow:0 8px 20px rgba(225,29,92,.15)}
        .v2-cat-grid{
          display:grid;grid-template-columns:repeat(6,1fr);gap:14px;
        }
        .v2-cat-card{
          display:flex;flex-direction:column;text-decoration:none;
          background:#fff;border:1px solid #f3e8ee;border-radius:18px;
          overflow:hidden;transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-cat-card:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(225,29,92,.12);border-color:rgba(225,29,92,.25)}
        .v2-cat-thumb{position:relative;aspect-ratio:1/1;background:linear-gradient(145deg,#fdf3f6,#fbe8ed)}
        .v2-cat-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#d9bfca}
        .v2-cat-meta{padding:11px 12px 13px;display:flex;align-items:center;justify-content:space-between;gap:8px}
        .v2-cat-name{margin:0;font-size:13px;font-weight:600;color:#1a0a14;letter-spacing:-.1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .v2-cat-count{margin:0;font-size:11.5px;color:#a08596;font-weight:600}

        /* ── Trending Now ── */
        .v2-trending{
          max-width:1180px;margin:0 auto;padding:64px 32px 16px;
        }
        .v2-trending-head{margin-bottom:28px}
        .v2-trend-tabs{display:inline-flex;gap:6px;margin-top:18px;padding:5px;background:#f8edf1;border-radius:999px}
        .v2-trend-tab{
          padding:8px 18px;border:none;background:transparent;border-radius:999px;
          font-size:13.5px;font-weight:600;color:#7c5566;cursor:pointer;
          font-family:inherit;transition:all .18s;
        }
        .v2-trend-tab:hover{color:${PINK}}
        .v2-trend-tab.is-active{background:#fff;color:${PINK};box-shadow:0 2px 8px rgba(225,29,92,.18)}
        .v2-trend-grid{
          display:grid;grid-template-columns:repeat(4,1fr);gap:18px;
        }
        .v2-trend-card{
          display:flex;flex-direction:column;text-decoration:none;
          background:#fff;border:1px solid #f3e8ee;border-radius:18px;
          overflow:hidden;transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-trend-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(225,29,92,.14);border-color:rgba(225,29,92,.25)}
        .v2-trend-thumb{position:relative;aspect-ratio:4/5;background:linear-gradient(145deg,#fdf3f6,#fbe8ed)}
        .v2-trend-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#dabfca}
        .v2-trend-meta{padding:14px 14px 16px}
        .v2-trend-name{margin:0;font-size:14px;font-weight:600;color:#1a0a14;line-height:1.4;
          overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .v2-trend-price{margin:6px 0 0;font-size:14px;font-weight:800;color:${PINK};letter-spacing:-.2px}
        .v2-trend-empty{text-align:center;color:#9b8390;padding:48px 0}
        .v2-skeleton{aspect-ratio:4/5;background:linear-gradient(110deg,#fbeef3 30%,#fff5f8 50%,#fbeef3 70%);background-size:200% 100%;animation:v2-skel 1.4s ease-in-out infinite}
        @keyframes v2-skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* "How it works" section */
        .v2-how{
          padding:80px 32px;max-width:1180px;margin:0 auto;
          border-top:1px solid #f5e9ee;
        }
        .v2-how-title{
          margin:0 0 12px;font-family:'Fraunces',Georgia,serif;
          font-size:clamp(28px,3.6vw,42px);font-style:italic;font-weight:700;
          color:#1a0a14;letter-spacing:-.8px;text-align:center;
        }
        .v2-how-sub{
          margin:0 auto 48px;max-width:540px;text-align:center;
          font-size:15.5px;color:#7c5566;line-height:1.6;
        }
        .v2-how-grid{
          display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:18px;
        }
        .v2-how-card{
          padding:28px 22px 24px;border:1px solid #f0e2e8;border-radius:20px;
          background:linear-gradient(180deg,#fff 0%,#fff8fa 100%);
          transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-how-card:hover{border-color:rgba(225,29,92,.3);transform:translateY(-2px);box-shadow:0 14px 32px rgba(225,29,92,.1)}
        .v2-how-icon{
          width:48px;height:48px;border-radius:14px;
          background:linear-gradient(135deg,#fce7ef 0%,#fbcfe8 100%);
          display:flex;align-items:center;justify-content:center;
          color:${PINK_DARK};margin-bottom:14px;
        }
        .v2-how-card-title{
          margin:0 0 6px;font-size:17px;font-weight:700;color:#1a0a14;letter-spacing:-.2px;
        }
        .v2-how-card-desc{
          margin:0;font-size:13.5px;line-height:1.55;color:#7c5566;
        }

        /* ── Avatar ── */
        .v2-avatar{position:relative;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .v2-avatar-ring{
          position:absolute;inset:-2px;border-radius:50%;
          background:conic-gradient(from 0deg, ${PINK}, #f43f5e, #c026d3, #f0abfc, ${PINK});
          animation:v2-avatar-spin 6s linear infinite;
          filter:blur(.4px);
        }
        .v2-avatar-core{
          position:relative;width:100%;height:100%;border-radius:50%;
          background:radial-gradient(circle at 30% 28%,#ff8db4 0%,${PINK} 55%,#7c1d3f 100%);
          display:flex;align-items:center;justify-content:center;color:#fff;
          box-shadow:inset 0 -6px 12px rgba(124,29,63,.45),inset 0 6px 10px rgba(255,255,255,.35),0 4px 14px rgba(225,29,92,.3);
        }
        @keyframes v2-avatar-spin{to{transform:rotate(360deg)}}

        /* ── Textarea placeholder ── */
        .v2-chat-textarea::placeholder,
        .v2-chat-textarea::-webkit-input-placeholder{color:#a08596;opacity:1}
        .v2-chat-textarea:focus::placeholder{color:#bba3af}
        textarea::placeholder{color:#a08596;opacity:1}

        /* ── Mini cart button on product card ── */
        .v2-mini-cart{
          position:absolute;right:8px;bottom:8px;
          width:32px;height:32px;border-radius:50%;
          background:#fff;border:1.5px solid #f3d8e1;color:${PINK};
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;box-shadow:0 6px 14px rgba(225,29,92,.18);
          transition:all .18s cubic-bezier(.2,.8,.2,1);z-index:2;
        }
        .v2-mini-cart:hover{background:${PINK};color:#fff;border-color:${PINK};transform:scale(1.08)}
        .v2-mini-cart.is-added{background:#16a34a;color:#fff;border-color:#16a34a}

        /* ── Popup (gift / vendor detail) ── */
        .v2-pop-back{
          position:fixed;inset:0;z-index:1000;
          background:rgba(20,5,12,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          display:flex;align-items:center;justify-content:center;
          padding:16px;animation:v2fade .22s ease;
        }
        .v2-pop{
          position:relative;width:100%;max-width:880px;max-height:calc(100vh - 32px);
          background:#fff;border-radius:24px;overflow:hidden;
          display:grid;grid-template-columns:1.05fr 1fr;
          box-shadow:0 30px 80px rgba(20,5,12,.4),0 4px 16px rgba(225,29,92,.18);
          animation:v2pop .28s cubic-bezier(.2,.8,.2,1);
        }
        .v2-pop-close{
          position:absolute;top:14px;right:14px;z-index:5;
          width:34px;height:34px;border-radius:50%;
          background:rgba(255,255,255,.92);backdrop-filter:blur(8px);
          border:1px solid rgba(240,218,228,.7);color:#1a0a14;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          box-shadow:0 4px 12px rgba(0,0,0,.1);transition:all .18s;
        }
        .v2-pop-close:hover{background:#fff;color:${PINK};transform:scale(1.06)}
        .v2-pop-media{
          position:relative;background:linear-gradient(160deg,#fdf3f6,#fbe8ed);
          min-height:360px;display:flex;align-items:center;justify-content:center;
        }
        .v2-pop-media>img{width:100%!important;height:100%!important;object-fit:cover}
        .v2-pop-fallback{display:flex;align-items:center;justify-content:center;color:#e0bfca}
        .v2-pop-thumbs{
          position:absolute;left:14px;right:14px;bottom:14px;
          display:flex;gap:8px;justify-content:flex-start;
        }
        .v2-pop-thumb{
          position:relative;width:48px;height:48px;border-radius:12px;
          border:2px solid rgba(255,255,255,.8);overflow:hidden;cursor:pointer;
          padding:0;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.18);
          transition:all .18s;
        }
        .v2-pop-thumb:hover{transform:translateY(-2px)}
        .v2-pop-thumb.is-active{border-color:${PINK};box-shadow:0 0 0 3px rgba(225,29,92,.22)}
        .v2-pop-info{
          padding:30px 30px 26px;display:flex;flex-direction:column;gap:12px;
          overflow-y:auto;max-height:calc(100vh - 32px);
        }
        .v2-pop-name{
          margin:0;font-family:'Fraunces',Georgia,serif;
          font-size:26px;font-weight:600;color:#1a0a14;letter-spacing:-.6px;line-height:1.15;
          font-variation-settings:"opsz" 144;
        }
        .v2-pop-price{
          margin:0;font-size:22px;font-weight:800;color:${PINK};letter-spacing:-.3px;
        }
        .v2-pop-meta{
          margin:0;font-size:13.5px;color:#7c5566;font-weight:500;
          display:inline-flex;align-items:center;gap:6px;
        }
        .v2-pop-desc{
          margin:0;font-size:14px;line-height:1.65;color:#4a3540;
        }
        .v2-pop-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
        .v2-pop-tag{
          padding:4px 10px;border-radius:999px;
          background:#fdf2f5;color:#7c1d3f;font-size:11.5px;font-weight:600;
          border:1px solid #fbe1e9;
        }
        .v2-pop-actions{
          display:flex;gap:10px;margin-top:auto;padding-top:14px;flex-wrap:wrap;
        }
        .v2-pop-cart{
          flex:1;min-width:140px;display:inline-flex;align-items:center;justify-content:center;
          gap:8px;padding:13px 18px;border-radius:14px;border:none;cursor:pointer;
          background:linear-gradient(135deg,${PINK} 0%,#f43f5e 100%);color:#fff;
          font-size:14px;font-weight:700;letter-spacing:.1px;font-family:inherit;
          box-shadow:0 8px 22px rgba(225,29,92,.32);transition:all .18s;
        }
        .v2-pop-cart:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(225,29,92,.42)}
        .v2-pop-cart.is-added{background:#16a34a;box-shadow:0 8px 22px rgba(22,163,74,.32)}
        .v2-pop-view{
          display:inline-flex;align-items:center;justify-content:center;
          padding:13px 18px;border-radius:14px;
          background:#fff;border:1.5px solid #f0e2e8;color:#1a0a14;
          font-size:14px;font-weight:600;text-decoration:none;
          transition:all .18s;
        }
        .v2-pop-view:hover{border-color:${PINK};color:${PINK};transform:translateY(-1px)}
        @media (max-width:760px){
          .v2-pop{grid-template-columns:1fr;max-height:calc(100vh - 24px)}
          .v2-pop-media{min-height:240px;aspect-ratio:4/3}
          .v2-pop-info{padding:20px 22px 22px}
          .v2-pop-name{font-size:22px}
          .v2-pop-price{font-size:19px}
        }

        /* Mobile / tablet */
        @media (max-width:1100px){
          .v2-cat-grid{grid-template-columns:repeat(4,1fr)}
          .v2-trend-grid{grid-template-columns:repeat(3,1fr)}
        }
        @media (max-width:920px){
          .v2-landing-grid{grid-template-columns:1fr;gap:32px;padding:32px 22px;min-height:auto}
          .v2-right{order:-1}
          .v2-orb-stage{max-width:340px;margin:0 auto}
          .v2-headline{font-size:clamp(36px,9vw,52px)}
          .v2-browse,.v2-trending{padding-left:22px;padding-right:22px}
          .v2-cat-grid{grid-template-columns:repeat(3,1fr)}
          .v2-trend-grid{grid-template-columns:repeat(2,1fr)}
          .v2-how{padding:56px 22px}
        }
        @media (max-width:520px){
          .v2-landing-grid{padding:24px 18px;gap:24px}
          .v2-orb-stage{max-width:280px}
          .v2-chat-card{padding:12px 12px 8px}
          .v2-cat-grid{grid-template-columns:repeat(2,1fr);gap:10px}
          .v2-trend-grid{grid-template-columns:repeat(2,1fr);gap:12px}
          .v2-browse-headline{font-size:30px}
        }
      `}</style>

      <div style={{
        height: phase === "landing" ? "auto" : "calc(100vh - 65px)",
        minHeight: phase === "landing" ? "calc(100vh - 65px)" : undefined,
        display: "flex", flexDirection: "column",
        background: phase === "landing"
          ? "#fff"
          : "linear-gradient(180deg,#fffcfb 0%,#fdf6f8 40%,#fceaef 100%)",
        backgroundImage: phase === "landing"
          ? "none"
          : "radial-gradient(circle, rgba(225,29,92,.04) 1px, transparent 1px)",
        backgroundSize: phase === "landing" ? undefined : "28px 28px",
        position: "relative",
        overflow: phase === "landing" ? "visible" : "hidden",
      }}>

        {phase === "landing" && (
          <Landing
            lang={lang}
            onSend={send}
            input={input}
            setInput={setInput}
            inputRef={inputRef}
          />
        )}

        {phase === "chat" && (
          <>
            <ChatHeader
              lang={lang}
              chatState={chatState}
              messages={messages}
              sessionId={sessionId}
              setSessionId={setSessionId}
            />

            <StateBar state={chatState} lang={lang} />

            <div
              ref={scrollRef}
              className="v2-scroll"
              style={{
                flex: 1, overflowY: "auto",
                padding: "22px 16px",
                display: "flex", flexDirection: "column", gap: 14,
              }}
            >
              {messages.map(msg => {
                if (msg.type === "block") {
                  return (
                    <div key={msg.id} className="v2-msg">
                      <Block block={msg.block} lang={lang} onOpen={openPopup} />
                    </div>
                  );
                }
                return (
                  <div key={msg.id} className="v2-msg">
                    <MsgBubble msg={msg} lang={lang} onPlanEvent={handlePlanEvent} />
                  </div>
                );
              })}
              {typing && <div className="v2-msg"><TypingDots /></div>}
            </div>

            <ChatInput
              lang={lang}
              input={input}
              setInput={setInput}
              onSend={send}
              typing={typing}
              inputRef={inputRef}
            />
          </>
        )}
      </div>

      {popup && (
        <Popup
          item={popup.item}
          type={popup.type}
          lang={lang}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}
