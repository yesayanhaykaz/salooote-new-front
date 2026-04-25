"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";
const PINK_DARK = "#9f1239";

const T = {
  eyebrow: {
    en: "AI CONCIERGE · SALOOOTE",
    hy: "AI ՕԳՆԱԿԱՆ · SALOOOTE",
    ru: "AI-КОНСЬЕРЖ · SALOOOTE",
  },
  hero: {
    en: ["Plan beautifully.", "Find effortlessly."],
    hy: ["Պլանավորեք", "Գտեք հեշտությամբ."],
    ru: ["Планируйте красиво.", "Находите легко."],
  },
  sub: {
    en: "Tell Sali what your moment needs — a cake, a venue, a photographer, or the whole celebration. She'll handpick the right options for you.",
    hy: "Ասեք Sali-ին ի՞նչ է պետք ձեր տոնին — տորթ, սրահ, ֆոտոգրաֆ կամ ամբողջ տոնակատարությունը: Նա ընտրած կլինի լավագույն տարբերակները:",
    ru: "Расскажите Sali, что нужно для вашего момента — торт, площадка, фотограф или вся вечеринка. Она подберёт лучшие варианты.",
  },
  placeholder: {
    en: "Cake for my daughter's 7th birthday in Yerevan…",
    hy: "Աղջկաս ծննդյան տորթ Երևանում…",
    ru: "Торт на день рождения дочки в Ереване…",
  },
  chips: {
    en: [
      { icon: "🎂", label: "Birthday cake" },
      { icon: "💐", label: "Flower bouquet" },
      { icon: "🎈", label: "Balloon decor" },
      { icon: "🎁", label: "Gift for my wife" },
      { icon: "📸", label: "Photographer" },
      { icon: "✨", label: "Plan a birthday party" },
    ],
    hy: [
      { icon: "🎂", label: "Ծննդյան տորթ" },
      { icon: "💐", label: "Ծաղկեփունջ" },
      { icon: "🎈", label: "Փուչիկներ" },
      { icon: "🎁", label: "Նվեր կնոջս" },
      { icon: "📸", label: "Ֆոտոգրաֆ" },
      { icon: "✨", label: "Պլանավորել ծնունդ" },
    ],
    ru: [
      { icon: "🎂", label: "Торт на день рождения" },
      { icon: "💐", label: "Букет цветов" },
      { icon: "🎈", label: "Шары и декор" },
      { icon: "🎁", label: "Подарок жене" },
      { icon: "📸", label: "Фотограф" },
      { icon: "✨", label: "Планировать праздник" },
    ],
  },
  trust: {
    en: [
      { num: "500+", label: "Local vendors" },
      { num: "2,000+", label: "Curated products" },
      { num: "24/7", label: "AI concierge" },
    ],
    hy: [
      { num: "500+", label: "Մատակարարներ" },
      { num: "2,000+", label: "Ընտրված ապրանք" },
      { num: "24/7", label: "AI օգնական" },
    ],
    ru: [
      { num: "500+", label: "Поставщиков" },
      { num: "2,000+", label: "Товаров" },
      { num: "24/7", label: "AI-помощь" },
    ],
  },
  examples: {
    en: "Try asking",
    hy: "Փորձեք հարցնել",
    ru: "Попробуйте спросить",
  },
  welcome: {
    en: "Hi, I'm **Sali** ✨\n\nTell me what you're looking for — an occasion, a gift, or something specific — and I'll find the right options for you.",
    hy: "Բարև, ես **Sali**-ն եմ ✨\n\nԱսեք ի՞նչ եք փնտրում — առիթ, նվեր կամ ինչ-որ կոնկրետ բան — ես ընտրած կլինեմ լավագույն տարբերակները:",
    ru: "Привет, я **Sali** ✨\n\nРасскажите, что ищете — праздник, подарок или что-то конкретное — я подберу варианты.",
  },
  planBtn: { en: "Plan this event →", hy: "Պլանավորել →", ru: "Планировать →" },
  sendBtn: { en: "Ask Sali", hy: "Հարցնել", ru: "Спросить" },
  saliKnows: { en: "Sali knows", hy: "Sali գիտի", ru: "Sali помнит" },
  online: { en: "Online", hy: "Առցանց", ru: "Онлайн" },
  viewProduct: { en: "View product →", hy: "Տեսնել →", ru: "Открыть →" },
  viewStore: { en: "View store →", hy: "Տեսնել →", ru: "Открыть →" },
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
      display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
      borderBottom: "1px solid rgba(240,220,230,.6)",
      background: "linear-gradient(90deg,rgba(255,241,245,.7) 0%,rgba(253,245,248,.5) 100%)",
      flexWrap: "wrap", minHeight: 44,
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}>
      <span style={{
        fontSize: 10, color: "#b88da0", fontWeight: 700,
        letterSpacing: 0.8, textTransform: "uppercase", flexShrink: 0,
      }}>
        {tx(T.saliKnows, lang)}
      </span>
      {pills.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 11px 4px 8px", borderRadius: 22,
          background: "#fff", border: "1px solid rgba(240,220,230,.8)",
          fontSize: 11.5, color: "#5a1a2f", fontWeight: 600,
          boxShadow: "0 1px 3px rgba(225,29,92,.06)",
        }}>
          <span style={{ fontSize: 12.5 }}>{p.icon}</span>
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
      fontSize: Math.round(size * 0.46), color: "#fff",
      boxShadow: "0 2px 8px rgba(225,29,92,.28)",
    }}>✨</div>
  );
}

function HeroOrb() {
  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      <div style={{
        position: "absolute", inset: -24, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(244,63,94,.35) 0%,transparent 65%)",
        animation: "orbPulse 3s ease-in-out infinite", filter: "blur(8px)",
      }} />
      <div style={{
        position: "absolute", inset: -12, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(225,29,92,.25) 0%,transparent 60%)",
        animation: "orbPulse 3s ease-in-out infinite .5s",
      }} />
      <div style={{
        position: "relative", width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle at 32% 28%, #ffd1dc 0%, #f43f5e 50%, #9f1239 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 52, color: "#fff",
        boxShadow: "0 24px 48px rgba(225,29,92,.4), inset 0 -8px 24px rgba(159,18,57,.4), inset 0 8px 24px rgba(255,255,255,.2)",
      }}>✨</div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar />
      <div style={{
        display: "flex", gap: 5, padding: "12px 16px",
        background: "#fff", borderRadius: "6px 18px 18px 18px",
        border: "1px solid #f0eaec", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.04)",
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: PINK, display: "block",
            animation: `v2dot 1.2s ease-in-out ${i * 0.18}s infinite`,
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
        border: `1px solid ${hover ? "#fbc9d8" : "#f0eaec"}`,
        boxShadow: hover
          ? "0 14px 30px rgba(225,29,92,.18), 0 2px 8px rgba(225,29,92,.08)"
          : "0 1px 3px rgba(0,0,0,.04), 0 4px 14px rgba(0,0,0,.05)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "all .25s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "linear-gradient(135deg,#fdf2f5,#fbe7ed)", position: "relative", overflow: "hidden" }}>
        {img
          ? <Image src={img} alt={name} fill style={{ objectFit: "cover", transform: hover ? "scale(1.06)" : "none", transition: "transform .35s" }} sizes="152px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, opacity: .3 }}>🎁</div>}
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{
          margin: 0, fontSize: 12.5, fontWeight: 600, color: "#1a0a14", lineHeight: 1.35,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{name}</p>
        {p.price > 0 && <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 800, color: PINK, letterSpacing: -0.2 }}>{fmt(p.price)}</p>}
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
        border: `1px solid ${hover ? "#fbc9d8" : "#f0eaec"}`,
        boxShadow: hover
          ? "0 14px 30px rgba(225,29,92,.18), 0 2px 8px rgba(225,29,92,.08)"
          : "0 1px 3px rgba(0,0,0,.04), 0 4px 14px rgba(0,0,0,.05)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "all .25s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", height: 78, background: "linear-gradient(135deg,#fce7ef 0%,#fde8ec 60%,#fff1f5 100%)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="176px" />}
        {logo && (
          <div style={{
            position: "absolute", bottom: -14, left: 12, width: 32, height: 32,
            borderRadius: "50%", border: "3px solid #fff", overflow: "hidden", background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,.12)",
          }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="32px" />
          </div>
        )}
      </div>
      <div style={{ padding: "20px 12px 12px" }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "#1a0a14", letterSpacing: -0.1 }}>
          {v.business_name || "Store"}
        </p>
        {v.city && <p style={{ margin: "3px 0 0", fontSize: 11, color: "#aa97a0" }}>📍 {v.city}</p>}
        {v.short_bio && (
          <p style={{
            margin: "5px 0 0", fontSize: 11, color: "#7c6571", lineHeight: 1.4,
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
          margin: "0 0 9px 40px", fontSize: 10.5, fontWeight: 700,
          color: "#c0a0b0", letterSpacing: 0.7, textTransform: "uppercase",
        }}>{block.title}</p>
      )}
      <div className="v2-cards" style={{
        display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4,
        paddingLeft: 40, paddingRight: 16,
        overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch",
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
          maxWidth: "72%", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.65,
          borderRadius: "20px 20px 6px 20px",
          background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
          color: "#fff",
          boxShadow: "0 4px 16px rgba(225,29,92,.28)",
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
            maxWidth: "84%", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.75,
            borderRadius: "6px 20px 20px 20px",
            background: "#fff", color: "#1a0a14",
            border: "1px solid #f0eaec", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.04)",
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
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 26px rgba(225,29,92,.42)"; }}
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
      background: "rgba(20,5,12,.65)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "v2fade .2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 24, overflow: "hidden",
        maxWidth: 480, width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.05)",
        animation: "v2pop .3s cubic-bezier(.2,.8,.2,1)",
      }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f3f4f6", flexShrink: 0 }}>
          {imgs[idx]
            ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="480px" />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, opacity: .25 }}>🎁</div>}
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: "50%",
            background: "rgba(0,0,0,.45)", backdropFilter: "blur(8px)", border: "none", color: "#fff", fontSize: 16,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} style={{
                  width: i === idx ? 20 : 7, height: 7, borderRadius: 4, border: "none",
                  cursor: "pointer", background: i === idx ? "#fff" : "rgba(255,255,255,.5)", transition: "width .2s",
                }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "22px 26px 26px", overflowY: "auto" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a0a14", letterSpacing: -0.5 }}>{name}</h2>
          {type === "product" && item.price > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 800, color: PINK, letterSpacing: -0.3 }}>{fmt(item.price)}</p>
          )}
          {type === "vendor" && item.city && (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9b8390" }}>📍 {item.city}</p>
          )}
          {desc && (
            <p style={{ margin: "14px 0 0", fontSize: 14, color: "#5a4452", lineHeight: 1.7 }}>
              {desc.slice(0, 280)}{desc.length > 280 ? "…" : ""}
            </p>
          )}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {item.tags.slice(0, 5).map((tag, i) => (
                <span key={i} style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11.5,
                  background: "#fce7ef", color: PINK, fontWeight: 600, letterSpacing: 0.1,
                }}>{tag}</span>
              ))}
            </div>
          )}
          <Link href={href} style={{
            display: "block", marginTop: 22, padding: "14px", borderRadius: 14,
            background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
            color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 14.5,
            textDecoration: "none", letterSpacing: 0.1,
            boxShadow: "0 8px 20px rgba(225,29,92,.32)",
          }}>
            {type === "product" ? tx(T.viewProduct, lang) : tx(T.viewStore, lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Landing({ lang, onSend, input, setInput, inputRef }) {
  const chips = tx(T.chips, lang);
  const [heroLine1, heroLine2] = tx(T.hero, lang);
  const trust = tx(T.trust, lang);
  return (
    <div style={{
      flex: 1, overflowY: "auto", overflowX: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 20px 48px",
      position: "relative",
    }}>
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: 40, right: -120, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,63,94,.18) 0%,transparent 70%)", pointerEvents: "none", filter: "blur(20px)" }} />
      <div style={{ position: "absolute", top: 200, left: -150, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,201,216,.45) 0%,transparent 70%)", pointerEvents: "none", filter: "blur(24px)" }} />
      <div style={{ position: "absolute", bottom: 100, right: 40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(253,164,175,.25) 0%,transparent 70%)", pointerEvents: "none", filter: "blur(16px)" }} />

      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 660,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 100,
          background: "rgba(255,255,255,.7)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(225,29,92,.15)",
          boxShadow: "0 2px 12px rgba(225,29,92,.06)",
          marginBottom: 28,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
            boxShadow: "0 0 0 3px rgba(34,197,94,.2)",
          }} />
          <span style={{
            fontSize: 10.5, fontWeight: 800, color: PINK_DARK,
            letterSpacing: 1.2, fontFamily: "system-ui",
          }}>
            {tx(T.eyebrow, lang)}
          </span>
        </div>

        {/* Hero orb */}
        <div style={{ marginBottom: 28 }}><HeroOrb /></div>

        {/* Hero text */}
        <h1 style={{
          margin: "0 0 18px",
          fontSize: "clamp(34px, 7vw, 60px)",
          fontWeight: 800, lineHeight: 1.04,
          letterSpacing: -1.5,
          textAlign: "center", maxWidth: 600,
          background: "linear-gradient(135deg,#1a0a14 0%,#5a1a2f 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {heroLine1}
          <br />
          <span style={{
            background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 60%,#fb7185 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{heroLine2}</span>
        </h1>

        <p style={{
          margin: "0 0 36px", fontSize: 16, color: "#6b4654",
          lineHeight: 1.6, maxWidth: 480, textAlign: "center", letterSpacing: 0.1,
        }}>
          {tx(T.sub, lang)}
        </p>

        {/* Input */}
        <div className="v2-input-wrap" style={{
          display: "flex", width: "100%", maxWidth: 580,
          background: "#fff", border: "1.5px solid rgba(240,220,230,.9)",
          borderRadius: 22, overflow: "hidden",
          boxShadow: "0 12px 40px rgba(225,29,92,.1), 0 2px 8px rgba(0,0,0,.04)",
          transition: "all .25s",
        }}>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: 18, color: PINK, fontSize: 18 }}>✨</div>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder={tx(T.placeholder, lang)}
            style={{
              flex: 1, border: "none", outline: "none",
              padding: "18px 14px", fontSize: 15,
              color: "#1a0a14", background: "transparent",
              fontFamily: "inherit", letterSpacing: 0.1,
            }}
          />
          <button
            onClick={() => onSend()}
            style={{
              margin: 7, padding: "12px 22px", borderRadius: 16,
              border: "none",
              background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
              color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: "pointer", letterSpacing: 0.1,
              boxShadow: "0 6px 18px rgba(225,29,92,.35)",
              whiteSpace: "nowrap", transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(225,29,92,.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(225,29,92,.35)"; }}
          >
            {tx(T.sendBtn, lang)} →
          </button>
        </div>

        {/* Examples */}
        <p style={{
          margin: "26px 0 12px", fontSize: 11, color: "#a08596",
          fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
        }}>
          {tx(T.examples, lang)}
        </p>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          justifyContent: "center", maxWidth: 600,
        }}>
          {chips.map((chip, i) => (
            <button
              key={i}
              className="v2-chip"
              onClick={() => onSend(chip.label)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "9px 16px", borderRadius: 24,
                border: "1px solid rgba(240,220,230,.9)",
                background: "rgba(255,255,255,.85)",
                backdropFilter: "blur(8px)",
                color: "#3a1825", fontSize: 13, fontWeight: 500,
                cursor: "pointer", letterSpacing: 0.1,
                boxShadow: "0 1px 3px rgba(225,29,92,.04)",
                transition: "all .18s ease",
              }}
            >
              <span style={{ fontSize: 14 }}>{chip.icon}</span>
              {chip.label}
            </button>
          ))}
        </div>

        {/* Trust strip */}
        <div style={{
          marginTop: 48, display: "flex", gap: 32,
          padding: "20px 28px", borderRadius: 20,
          background: "rgba(255,255,255,.65)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(240,220,230,.6)",
          boxShadow: "0 4px 24px rgba(225,29,92,.06)",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {trust.map((t, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 22, fontWeight: 800, letterSpacing: -0.5,
                background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{t.num}</div>
              <div style={{ fontSize: 11.5, color: "#6b4654", marginTop: 2, fontWeight: 500, letterSpacing: 0.2 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatInput({ lang, input, setInput, onSend, typing, inputRef }) {
  return (
    <div style={{
      padding: "12px 18px 18px",
      background: "rgba(255,255,255,.85)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(240,220,230,.5)",
      flexShrink: 0,
    }}>
      <div className="v2-input-bar" style={{
        display: "flex", alignItems: "flex-end", gap: 8,
        border: "1.5px solid #f0dce6", borderRadius: 18,
        padding: 5, background: "#fff",
        transition: "all .2s",
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
            padding: "10px 12px", fontSize: 14, color: "#1a0a14",
            resize: "none", lineHeight: 1.5, fontFamily: "inherit",
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
            fontSize: 18, cursor: input.trim() && !typing ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: input.trim() && !typing ? "0 4px 14px rgba(225,29,92,.32)" : "none",
            transition: "all .18s", flexShrink: 0,
          }}
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
        @keyframes v2dot{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-5px);opacity:1}}
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:.3}}
        @keyframes v2fade{from{opacity:0}to{opacity:1}}
        @keyframes v2pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:none}}
        @keyframes v2In{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .v2-scroll::-webkit-scrollbar{width:4px}
        .v2-scroll::-webkit-scrollbar-thumb{background:#f0dde4;border-radius:4px}
        .v2-cards::-webkit-scrollbar{height:3px}
        .v2-cards::-webkit-scrollbar-thumb{background:#f5dde4;border-radius:3px}
        .v2-input-wrap:focus-within{border-color:${PINK}!important;box-shadow:0 12px 40px rgba(225,29,92,.18),0 0 0 5px rgba(225,29,92,.08)!important}
        .v2-input-bar:focus-within{border-color:${PINK}!important;box-shadow:0 0 0 4px rgba(225,29,92,.08),0 4px 16px rgba(225,29,92,.1)!important}
        .v2-chip:hover{background:#fff!important;border-color:${PINK}!important;color:${PINK}!important;transform:translateY(-1px);box-shadow:0 6px 16px rgba(225,29,92,.18)!important}
        .v2-msg{animation:v2In .25s cubic-bezier(.2,.8,.2,1)}
      `}</style>

      <div style={{
        height: "calc(100vh - 65px)",
        display: "flex", flexDirection: "column",
        background: "linear-gradient(180deg,#fffaf8 0%,#fdf2f5 50%,#fbe7ed 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif",
        position: "relative", overflow: "hidden",
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
            {/* Refined chat header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 22px",
              background: "rgba(255,255,255,.85)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(240,220,230,.5)",
              flexShrink: 0,
            }}>
              <Avatar size={38} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#1a0a14", letterSpacing: -0.3 }}>Sali</p>
                <p style={{ margin: 0, fontSize: 11.5, color: "#a08596", fontWeight: 500 }}>
                  {lang === "ru" ? "AI-консьерж" : lang === "hy" ? "AI օգնական" : "AI Concierge"}
                </p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 11px", borderRadius: 20,
                background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)",
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,.2)" }} />
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
