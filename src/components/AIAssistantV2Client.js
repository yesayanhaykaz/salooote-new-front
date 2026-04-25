"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";
const PINK_DARK = "#9f1239";

const T = {
  hero: {
    en: ["Your event.", "Planned in minutes."],
    hy: ["Dzеr tonе.", "Planavorvats rоpееrоm."],
    ru: ["Ваш праздник.", "Спланирован за минуты."],
  },
  sub: {
    en: "Balloons, cakes, venues, gifts, photographers — tell Salooote AI what you need and we'll plan it, find vendors, and estimate the budget.",
    hy: "Пучikner, torтеr, srаhner, nverner, fotоgraфner — аsеq Salooote AI-in inч е pеtq, nа klinе planе еv klgnе lavаguyin tаrbernaknеrе:",
    ru: "Шары, торты, площадки, подарки, фотографы — расскажите Salooote AI что нужно, мы спланируем, найдём поставщиков и оценим бюджет.",
  },
  placeholder: {
    en: "Help me plan my daughter's 5th birthday tomorrow…",
    hy: "Оgnеq planavоrеl аghkаs 5-аmyа tsnnund vаghе…",
    ru: "Помогите спланировать день рождения дочки на 5 лет завтра…",
  },
  chips: {
    en: [
      { icon: "🎂", label: "Plan a birthday" },
      { icon: "🎈", label: "Find balloons" },
      { icon: "🎁", label: "Send a gift" },
      { icon: "💍", label: "Plan a wedding" },
      { icon: "⚡", label: "Last-minute event" },
    ],
    hy: [
      { icon: "🎂", label: "Planavorel tsnnund" },
      { icon: "🎈", label: "Gtnel puchikner" },
      { icon: "🎁", label: "Ugharkel nver" },
      { icon: "💍", label: "Planavorel hаrsаniq" },
      { icon: "⚡", label: "Verjin pаhi miJоtsаrum" },
    ],
    ru: [
      { icon: "🎂", label: "Спланировать день рождения" },
      { icon: "🎈", label: "Найти шары" },
      { icon: "🎁", label: "Отправить подарок" },
      { icon: "💍", label: "Спланировать свадьбу" },
      { icon: "⚡", label: "Срочное мероприятие" },
    ],
  },
  scrollCue: {
    en: "See how Salooote can help you ↓",
    hy: "Tеsnеl inчpеs kаrоgh е оgnеl Salooote-е ↓",
    ru: "Узнать, как Salooote может помочь ↓",
  },
  welcome: {
    en: "Hi, I'm **Sali** ✨\n\nTell me what you're looking for — an occasion, a gift, or something specific — and I'll find the right options for you.",
    hy: "Bаrev, es **Sali**-n еm ✨\n\nАsеq inч еq pntrum — аṙit, nver kam inch-or konkrеt ban — еs yntrаd klinеm lavаguyin tаrbernaknеrе:",
    ru: "Привет, я **Sali** ✨\n\nРасскажите, что ищете — праздник, подарок или что-то конкретное — я подберу варианты.",
  },
  planBtn: { en: "Plan this event →", hy: "Planavorel →", ru: "Планировать →" },
  sendBtn: { en: "Ask Sali", hy: "Hаrtsnel", ru: "Спросить" },
  saliKnows: { en: "Sali knows", hy: "Sali giti", ru: "Sali помнит" },
  online: { en: "Online", hy: "Aṙcank", ru: "Онлайн" },
  viewProduct: { en: "View product →", hy: "Tesnel →", ru: "Открыть →" },
  viewStore: { en: "View store →", hy: "Tesnel →", ru: "Открыть →" },
};

const tx = (obj, lang) => obj[lang] || obj.en;

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
  birthday: "🎂", kids_party: "🎈", wedding: "💍", corporate: "🏢",
  engagement: "💍", anniversary: "🥂", baby_shower: "🍼", christening: "⛪",
};

function StateBar({ state, lang }) {
  const pills = [];
  if (state.event_type) pills.push({ icon: EVENT_ICONS[state.event_type] || "🎉", label: state.event_type.replace(/_/g, " ") });
  if (state.recipient) {
    let label = state.recipient;
    if (state.age != null) label += ` · ${state.age}`;
    pills.push({ icon: "👤", label });
  }
  if (state.deadline) pills.push({ icon: "⏰", label: state.deadline });
  if (state.city) pills.push({ icon: "📍", label: state.city });
  if (state.style) pills.push({ icon: "✨", label: state.style });
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
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 11px 4px 8px", borderRadius: 22,
          background: "#fff", border: "1px solid rgba(240,218,228,.9)",
          fontSize: 11.5, color: "#5a1a2f", fontWeight: 600,
          boxShadow: "0 1px 4px rgba(225,29,92,.07)",
        }}>
          <span style={{ fontSize: 12 }}>{p.icon}</span>
          {p.label}
        </div>
      ))}
    </div>
  );
}

function Avatar({ size = 30 }) {
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      background: "radial-gradient(circle at 30% 25%, #ffd1dc 0%, #f43f5e 55%, #9f1239 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.44), color: "#fff",
      boxShadow: "0 3px 10px rgba(225,29,92,.3)",
    }}>✨</div>
  );
}

function HeroOrb() {
  return (
    <div style={{ position: "relative", width: 108, height: 108 }}>
      {/* Outermost ring */}
      <div style={{
        position: "absolute", inset: -32, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(244,63,94,.22) 0%,transparent 65%)",
        animation: "orbFloat 4s ease-in-out infinite", filter: "blur(10px)",
      }} />
      {/* Middle ring */}
      <div style={{
        position: "absolute", inset: -16, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(225,29,92,.18) 0%,transparent 60%)",
        animation: "orbFloat 4s ease-in-out infinite .6s", filter: "blur(5px)",
      }} />
      {/* Thin crisp ring */}
      <div style={{
        position: "absolute", inset: -3, borderRadius: "50%",
        border: "1px solid rgba(225,29,92,.2)",
        animation: "orbPulse 3.5s ease-in-out infinite",
      }} />
      {/* Core orb */}
      <div style={{
        position: "relative", width: 108, height: 108, borderRadius: "50%",
        background: "radial-gradient(circle at 32% 28%, #ffd1dc 0%, #f43f5e 48%, #9f1239 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 46, color: "#fff",
        boxShadow: "0 20px 50px rgba(225,29,92,.45), inset 0 -6px 20px rgba(159,18,57,.5), inset 0 6px 20px rgba(255,255,255,.25)",
        animation: "orbFloat 4s ease-in-out infinite .3s",
      }}>✨</div>
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
  return (
    <button
      onClick={() => onOpen(p, "product")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flexShrink: 0, width: 152, borderRadius: 18, padding: 0,
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
          ? <Image src={img} alt={name} fill style={{ objectFit: "cover", transform: hover ? "scale(1.07)" : "none", transition: "transform .4s ease" }} sizes="152px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, opacity: .3 }}>🎁</div>}
      </div>
      <div style={{ padding: "11px 13px 13px" }}>
        <p style={{
          margin: 0, fontSize: 12.5, fontWeight: 600, color: "#1a0a14", lineHeight: 1.4,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{name}</p>
        {p.price > 0 && <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 800, color: PINK, letterSpacing: -0.3 }}>{fmt(p.price)}</p>}
      </div>
    </button>
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
        {v.city && <p style={{ margin: "3px 0 0", fontSize: 11, color: "#b09aa6" }}>📍 {v.city}</p>}
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

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(16,4,9,.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "v2fade .22s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 26, overflow: "hidden",
        maxWidth: 480, width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 40px 90px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.06)",
        animation: "v2pop .32s cubic-bezier(.2,.8,.2,1)",
      }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f5eff2", flexShrink: 0 }}>
          {imgs[idx]
            ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="480px" />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, opacity: .2 }}>🎁</div>}
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14, width: 38, height: 38, borderRadius: "50%",
            background: "rgba(0,0,0,.48)", backdropFilter: "blur(10px)", border: "none", color: "#fff", fontSize: 15,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} style={{
                  width: i === idx ? 22 : 7, height: 7, borderRadius: 4, border: "none",
                  cursor: "pointer", background: i === idx ? "#fff" : "rgba(255,255,255,.45)", transition: "width .22s ease",
                }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "24px 28px 28px", overflowY: "auto" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a0a14", letterSpacing: -0.5, lineHeight: 1.2 }}>{name}</h2>
          {type === "product" && item.price > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: 21, fontWeight: 800, color: PINK, letterSpacing: -0.4 }}>{fmt(item.price)}</p>
          )}
          {type === "vendor" && item.city && (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9b8390" }}>📍 {item.city}</p>
          )}
          {desc && (
            <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "#5a4452", lineHeight: 1.75 }}>
              {desc.slice(0, 280)}{desc.length > 280 ? "…" : ""}
            </p>
          )}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {item.tags.slice(0, 5).map((tag, i) => (
                <span key={i} style={{
                  padding: "5px 13px", borderRadius: 20, fontSize: 11.5,
                  background: "#fce7ef", color: PINK, fontWeight: 600, letterSpacing: 0.1,
                }}>{tag}</span>
              ))}
            </div>
          )}
          <Link href={href} style={{
            display: "block", marginTop: 24, padding: "15px", borderRadius: 16,
            background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
            color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 15,
            textDecoration: "none", letterSpacing: 0.1,
            boxShadow: "0 10px 24px rgba(225,29,92,.34)",
          }}>
            {type === "product" ? tx(T.viewProduct, lang) : tx(T.viewStore, lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}

function FlowerVisual() {
  return (
    <div className="v2-visual">
      {/* SVG defs for flower clip-path */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="flowerClip" clipPathUnits="objectBoundingBox">
            <circle cx="0.5" cy="0.28" r="0.28" />
            <circle cx="0.72" cy="0.5" r="0.28" />
            <circle cx="0.5" cy="0.72" r="0.28" />
            <circle cx="0.28" cy="0.5" r="0.28" />
            <circle cx="0.5" cy="0.5" r="0.32" />
          </clipPath>
        </defs>
      </svg>

      <div className="v2-flower-shape">
        {/* Gradient image background */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(circle at 22% 28%, #fbcfe8 0%, transparent 45%),
            radial-gradient(circle at 78% 25%, #fde0ea 0%, transparent 50%),
            radial-gradient(circle at 70% 78%, #fda4af 0%, transparent 45%),
            radial-gradient(circle at 25% 75%, #fce7ef 0%, transparent 50%),
            linear-gradient(135deg, #fff1f5 0%, #fbe2e9 50%, #fbc9d8 100%)
          `,
        }} />

        {/* Floating decorative emoji */}
        <div className="float-emoji" style={{ top: "18%", left: "30%", fontSize: 48, animationDelay: "0s" }}>🎂</div>
        <div className="float-emoji" style={{ top: "22%", right: "20%", fontSize: 38, animationDelay: ".4s" }}>🎈</div>
        <div className="float-emoji" style={{ top: "48%", left: "16%", fontSize: 42, animationDelay: ".8s" }}>💐</div>
        <div className="float-emoji" style={{ top: "44%", right: "14%", fontSize: 44, animationDelay: "1.2s" }}>🎁</div>
        <div className="float-emoji" style={{ bottom: "20%", left: "32%", fontSize: 40, animationDelay: "1.6s" }}>🥂</div>
        <div className="float-emoji" style={{ bottom: "18%", right: "30%", fontSize: 36, animationDelay: "2s" }}>✨</div>
        <div className="float-emoji" style={{ top: "38%", left: "44%", fontSize: 30, animationDelay: "2.4s" }}>🎉</div>
      </div>
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
              <button type="button" className="v2-icon-btn" aria-label="attach" title="Attach inspiration">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
              </button>
              <div style={{ flex: 1 }} />
              <button type="button" className="v2-icon-btn" aria-label="mic" title="Voice input">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
              </button>
              <button
                type="button"
                onClick={() => onSend()}
                disabled={!canSend}
                className="v2-send-btn"
                aria-label="send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
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
                <span style={{ fontSize: 14, marginRight: 6 }}>{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>

          {/* Scroll cue */}
          <button
            type="button"
            className="v2-scroll-cue"
            onClick={() => {
              const el = document.getElementById("v2-howitworks");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {tx(T.scrollCue, lang)}
          </button>
        </div>

        {/* RIGHT: organic flower visual */}
        <div className="v2-right">
          <FlowerVisual />
        </div>
      </div>

      {/* "How it works" anchor section below the fold */}
      <section id="v2-howitworks" className="v2-how">
        <h2 className="v2-how-title">
          {lang === "ru" ? "Как Salooote планирует ваш праздник"
            : lang === "hy" ? "Inчpеs Salooote-е planavorum е dzеr tonе"
            : "How Salooote plans your event"}
        </h2>
        <p className="v2-how-sub">
          {lang === "ru" ? "Скажите, что нужно — мы найдём поставщиков, цены и составим план."
            : lang === "hy" ? "Аsеq inч е pеtq — mеnq klgnеnq matakararnerin, gnеrе еv klkazmеnq planе."
            : "Tell us what you need — we find vendors, prices, and build a plan."}
        </p>
        <div className="v2-how-grid">
          {[
            { icon: "✨", title: lang === "ru" ? "Расскажите" : lang === "hy" ? "Аsеq" : "Describe",
              desc: lang === "ru" ? "Тип события, дата, бюджет, гости." : lang === "hy" ? "Mijotsarman tеsаk, аmsаt'iv, byudje." : "Event type, date, budget, guests." },
            { icon: "🔍", title: lang === "ru" ? "Найдём" : lang === "hy" ? "Klgnеnq" : "Find",
              desc: lang === "ru" ? "Подберём поставщиков и продукты." : lang === "hy" ? "Klgnеnq matakararnerin еv apranqner." : "We match vendors and products." },
            { icon: "📋", title: lang === "ru" ? "План" : lang === "hy" ? "Plan" : "Plan",
              desc: lang === "ru" ? "Сравните цены, фото, отзывы." : lang === "hy" ? "Hаmеmаt'еq gnеrе, lusankarnerе." : "Compare prices, photos, reviews." },
            { icon: "✅", title: lang === "ru" ? "Бронь" : lang === "hy" ? "Аmrаgrum" : "Book",
              desc: lang === "ru" ? "Запросите цитату или забронируйте." : lang === "hy" ? "Patverеq kam аmrаgrеq." : "Request a quote or book directly." },
          ].map((card, i) => (
            <div key={i} className="v2-how-card">
              <div className="v2-how-icon">{card.icon}</div>
              <h3 className="v2-how-card-title">{card.title}</h3>
              <p className="v2-how-card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
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
        >↑</button>
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600;1,700&display=swap');
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
          margin:0;font-family:'Cormorant Garamond',Georgia,serif;
          font-size:clamp(40px,5vw,68px);font-weight:700;
          line-height:1.02;letter-spacing:-1.6px;color:#1a0a14;
        }
        .v2-h-line1{font-style:italic}
        .v2-h-line2{
          font-style:italic;
          background:linear-gradient(135deg,#1a0a14 0%,#5a1a2f 100%);
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
        .v2-visual{position:relative;width:100%;max-width:520px;aspect-ratio:1/1}
        .v2-flower-shape{
          position:absolute;inset:0;
          clip-path:url(#flowerClip);
          -webkit-clip-path:url(#flowerClip);
          overflow:hidden;
          filter:drop-shadow(0 30px 60px rgba(225,29,92,.18));
        }
        .float-emoji{
          position:absolute;
          animation:floatY 5s ease-in-out infinite;
          filter:drop-shadow(0 4px 10px rgba(159,18,57,.2));
        }
        @keyframes floatY{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(3deg)}}

        /* "How it works" section */
        .v2-how{
          padding:80px 32px;max-width:1180px;margin:0 auto;
          border-top:1px solid #f5e9ee;
        }
        .v2-how-title{
          margin:0 0 12px;font-family:'Cormorant Garamond',Georgia,serif;
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
          width:44px;height:44px;border-radius:14px;
          background:linear-gradient(135deg,#fce7ef 0%,#fbcfe8 100%);
          display:flex;align-items:center;justify-content:center;
          font-size:22px;margin-bottom:14px;
        }
        .v2-how-card-title{
          margin:0 0 6px;font-size:17px;font-weight:700;color:#1a0a14;letter-spacing:-.2px;
        }
        .v2-how-card-desc{
          margin:0;font-size:13.5px;line-height:1.55;color:#7c5566;
        }

        /* Mobile / tablet */
        @media (max-width:920px){
          .v2-landing-grid{grid-template-columns:1fr;gap:32px;padding:32px 22px;min-height:auto}
          .v2-right{order:-1}
          .v2-visual{max-width:340px;margin:0 auto}
          .v2-headline{font-size:clamp(36px,9vw,52px)}
          .v2-how{padding:56px 22px}
        }
        @media (max-width:520px){
          .v2-landing-grid{padding:24px 18px;gap:24px}
          .v2-visual{max-width:280px}
          .v2-chat-card{padding:12px 12px 8px}
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
            {/* Chat header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 22px",
              background: "rgba(255,255,255,.88)",
              backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(240,218,228,.6)",
              flexShrink: 0,
            }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", inset: -6, borderRadius: "50%",
                  background: "radial-gradient(circle,rgba(225,29,92,.26) 0%,transparent 70%)",
                  animation: "halo 3s ease-in-out infinite",
                }} />
                <Avatar size={40} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  margin: 0, fontWeight: 700, fontSize: 20, color: "#1a0a14", letterSpacing: -0.2,
                  fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", lineHeight: 1,
                }}>Sali</p>
                <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#b09aa6", fontWeight: 500 }}>
                  {lang === "ru" ? "AI-консьерж" : lang === "hy" ? "AI ogнakan" : "AI Concierge"}
                </p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 20,
                background: "rgba(34,197,94,.07)", border: "1px solid rgba(34,197,94,.18)",
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                  boxShadow: "0 0 0 3px rgba(34,197,94,.18)",
                  animation: "breathe 2.5s ease-in-out infinite",
                }} />
                <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>
                  {tx(T.online, lang)}
                </span>
              </div>
            </div>

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
