"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  hero: {
    en: "What are you planning?",
    hy: "Ի՞նչ եք պlanavorel:",
    ru: "Что вы планируете?",
  },
  sub: {
    en: "Tell Sali what you need — she'll find the best options.",
    hy: "Asus Sali-in, nա kaogni dzez.",
    ru: "Расскажите Sali — она подберёт лучшее.",
  },
  placeholder: {
    en: "Type anything — flowers, cake, a birthday gift...",
    hy: "Цaghikner, tort, nver...",
    ru: "Цветы, торт, подарок на день рождения...",
  },
  chips: {
    en: ["Flowers for her birthday", "Birthday cake", "Balloons", "Gift for my wife", "Photographer", "Plan a birthday party"],
    hy: ["Ծaghikner tsnndin", "Tort tsnndinva", "Փuchikner", "Nver karinn", "Lragrechi", "Planavorel tsnndin"],
    ru: ["Цветы на день рождения", "Торт", "Шары", "Подарок жене", "Фотограф", "Планировать праздник"],
  },
  welcome: {
    en: "Hi, I'm **Sali**.\n\nTell me what you're looking for — an occasion, a gift, or just something specific — and I'll find the right options for you.",
    hy: "Barev, yes em **Sali**.\n\nAseq inch eq petq — knes, nver, tsaghik — yes kgnem hamaryal tarbernakner dzez hamар.",
    ru: "Привет, я **Sali**.\n\nРасскажите что нужно — праздник, подарок, что-то конкретное — я подберу лучшие варианты.",
  },
  planBtn: { en: "Plan this event →", hy: "Planavovel →", ru: "Планировать →" },
  sendBtn: { en: "Go →", hy: "Ugharkel", ru: "Найти" },
  saliKnows: { en: "Sali remembers:", hy: "Sali gitce:", ru: "Sali помнит:" },
};

function tx(obj, lang) { return obj[lang] || obj.en; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace("/api/v1", "");
  return `${base}${url}`;
}
function fmt(p) { const n = parseFloat(p); return isNaN(n) ? "" : n.toLocaleString() + " ֏"; }
function BoldText({ text }) {
  return <>{text.split(/\*\*(.*?)\*\*/g).map((s, i) => i % 2 === 1 ? <strong key={i}>{s}</strong> : s)}</>;
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

// ─── State bar ────────────────────────────────────────────────────────────────
const EVENT_ICONS = {
  birthday: "🎂", kids_party: "🎈", wedding: "💍", corporate: "🏢",
  engagement: "💍", anniversary: "🥂", baby_shower: "🍼", christening: "⛪",
};
function StateBar({ state, lang }) {
  const pills = [];
  if (state.event_type) {
    pills.push({ icon: EVENT_ICONS[state.event_type] || "🎉", label: state.event_type.replace(/_/g, " ") });
  }
  if (state.recipient) {
    let label = state.recipient;
    if (state.age != null) label += ` (${state.age})`;
    pills.push({ icon: "👤", label });
  }
  if (state.deadline) pills.push({ icon: "⏰", label: state.deadline });
  if (state.city) pills.push({ icon: "📍", label: state.city });
  if (state.style) pills.push({ icon: "✨", label: state.style });
  if (!pills.length) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, padding: "7px 16px",
      borderBottom: "1px solid #f3e3ea", background: "#fdf5f8", flexWrap: "wrap",
      minHeight: 38,
    }}>
      <span style={{
        fontSize: 10, color: "#cca8b8", fontWeight: 700,
        letterSpacing: 0.6, textTransform: "uppercase", flexShrink: 0,
      }}>
        {tx(T.saliKnows, lang)}
      </span>
      {pills.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "3px 10px 3px 7px", borderRadius: 20,
          background: "#fff", border: "1px solid #f0dce6",
          fontSize: 11, color: "#5a1a2f", fontWeight: 500,
        }}>
          <span style={{ fontSize: 12 }}>{p.icon}</span>
          {p.label}
        </div>
      ))}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ size = 30 }) {
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #fda4af, #e11d5c 70%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.44), boxShadow: "0 2px 8px rgba(225,29,92,.25)",
    }}>✨</div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <Avatar />
      <div style={{
        display: "flex", gap: 5, padding: "11px 14px",
        background: "#fff", borderRadius: "4px 16px 16px 16px",
        border: "1px solid #efefef", boxShadow: "0 1px 5px rgba(0,0,0,.05)",
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: PINK,
            display: "block",
            animation: `v2dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
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
        flexShrink: 0, width: 148, borderRadius: 16, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left",
        overflow: "hidden",
        border: `1.5px solid ${hover ? "#fbc9d8" : "#f0f0f0"}`,
        boxShadow: hover ? "0 8px 24px rgba(225,29,92,.15)" : "0 2px 8px rgba(0,0,0,.06)",
        transform: hover ? "translateY(-3px)" : "none",
        transition: "all .2s ease",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#faf5f7", position: "relative", overflow: "hidden" }}>
        {img
          ? <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="148px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, opacity: .28 }}>🎁</div>}
      </div>
      <div style={{ padding: "9px 11px 11px" }}>
        <p style={{
          margin: 0, fontSize: 12, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{name}</p>
        {p.price > 0 && <p style={{ margin: "5px 0 0", fontSize: 13, fontWeight: 700, color: PINK }}>{fmt(p.price)}</p>}
      </div>
    </button>
  );
}

// ─── Vendor card ──────────────────────────────────────────────────────────────
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
        flexShrink: 0, width: 170, borderRadius: 16, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left",
        overflow: "hidden",
        border: `1.5px solid ${hover ? "#fbc9d8" : "#f0f0f0"}`,
        boxShadow: hover ? "0 8px 24px rgba(225,29,92,.15)" : "0 2px 8px rgba(0,0,0,.06)",
        transform: hover ? "translateY(-3px)" : "none",
        transition: "all .2s ease",
      }}
    >
      <div style={{ width: "100%", height: 72, background: "linear-gradient(135deg,#fce7ef,#fff1f5)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="170px" />}
        {logo && (
          <div style={{
            position: "absolute", bottom: -13, left: 10, width: 30, height: 30,
            borderRadius: "50%", border: "2.5px solid #fff", overflow: "hidden", background: "#fff",
          }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="30px" />
          </div>
        )}
      </div>
      <div style={{ padding: "18px 11px 12px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{v.business_name || "Store"}</p>
        {v.city && <p style={{ margin: "2px 0 0", fontSize: 10, color: "#b0b0b0" }}>📍 {v.city}</p>}
        {v.short_bio && (
          <p style={{
            margin: "5px 0 0", fontSize: 11, color: "#888", lineHeight: 1.35,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>{v.short_bio}</p>
        )}
      </div>
    </button>
  );
}

// ─── Block (product/vendor row with title) ────────────────────────────────────
function Block({ block, lang, onOpen }) {
  const items = block.data;
  if (!items || (Array.isArray(items) && !items.length)) return null;
  return (
    <div>
      {block.title && (
        <p style={{
          margin: "0 0 8px 39px", fontSize: 10.5, fontWeight: 700,
          color: "#c0a0b0", letterSpacing: 0.5, textTransform: "uppercase",
        }}>{block.title}</p>
      )}
      <div style={{
        display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4,
        paddingLeft: 39, paddingRight: 16,
        scrollbarWidth: "none", msOverflowStyle: "none",
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

// ─── Message bubble ───────────────────────────────────────────────────────────
function MsgBubble({ msg, lang, onPlanEvent }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "72%", padding: "11px 15px", fontSize: 13.5, lineHeight: 1.65,
          borderRadius: "18px 18px 4px 18px",
          background: PINK, color: "#fff",
          boxShadow: "0 3px 14px rgba(225,29,92,.25)",
        }}>
          <MsgText text={msg.text} />
        </div>
      </div>
    );
  }

  if (msg.role === "bot") {
    if (msg.type === "text") {
      return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 9 }}>
          <Avatar />
          <div style={{
            maxWidth: "84%", padding: "11px 15px", fontSize: 13.5, lineHeight: 1.75,
            borderRadius: "4px 18px 18px 18px",
            background: "#fff", color: "#1c1c1c",
            border: "1px solid #efefef", boxShadow: "0 1px 5px rgba(0,0,0,.05)",
          }}>
            <MsgText text={msg.text} />
          </div>
        </div>
      );
    }
    if (msg.type === "plan") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Avatar />
          <button
            onClick={() => onPlanEvent(msg.event_type)}
            style={{
              padding: "12px 24px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg,${PINK},#f43f5e)`,
              color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: "pointer", boxShadow: "0 4px 16px rgba(225,29,92,.3)",
            }}
          >
            {tx(T.planBtn, lang)}
          </button>
        </div>
      );
    }
  }
  return null;
}

// ─── Popup ────────────────────────────────────────────────────────────────────
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
      background: "rgba(0,0,0,.65)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 22, overflow: "hidden",
        maxWidth: 460, width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(0,0,0,.3)",
      }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f3f4f6", flexShrink: 0 }}>
          {imgs[idx]
            ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="460px" />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, opacity: .2 }}>🎁</div>}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%",
            background: "rgba(0,0,0,.4)", border: "none", color: "#fff", fontSize: 15,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} style={{
                  width: i === idx ? 18 : 7, height: 7, borderRadius: 4, border: "none",
                  cursor: "pointer",
                  background: i === idx ? "#fff" : "rgba(255,255,255,.45)",
                  transition: "width .2s",
                }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "20px 24px 24px", overflowY: "auto" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}>{name}</h2>
          {type === "product" && item.price > 0 && (
            <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: PINK }}>{fmt(item.price)}</p>
          )}
          {type === "vendor" && item.city && (
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#aaa" }}>📍 {item.city}</p>
          )}
          {desc && (
            <p style={{ margin: "14px 0 0", fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              {desc.slice(0, 280)}{desc.length > 280 ? "…" : ""}
            </p>
          )}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {item.tags.slice(0, 5).map((tag, i) => (
                <span key={i} style={{
                  padding: "3px 11px", borderRadius: 20, fontSize: 11,
                  background: "#fce7ef", color: PINK, fontWeight: 500,
                }}>{tag}</span>
              ))}
            </div>
          )}
          <Link href={href} style={{
            display: "block", marginTop: 20, padding: "13px", borderRadius: 14,
            background: PINK, color: "#fff", textAlign: "center",
            fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}>
            {type === "product"
              ? (lang === "hy" ? "Бacal" : lang === "ru" ? "Открыть →" : "View product →")
              : (lang === "hy" ? "Бacal" : lang === "ru" ? "Открыть →" : "View store →")}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Landing phase ────────────────────────────────────────────────────────────
function Landing({ lang, onSend, input, setInput, inputRef }) {
  const chips = tx(T.chips, lang);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", flex: 1,
      padding: "40px 24px 100px", textAlign: "center",
    }}>
      {/* Sali identity */}
      <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 76, height: 76, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #fda4af, #e11d5c 70%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34, boxShadow: "0 10px 32px rgba(225,29,92,.28)",
        }}>✨</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: PINK, letterSpacing: 2, textTransform: "uppercase" }}>SALI</div>
          <div style={{ fontSize: 11, color: "#c0a8b5", marginTop: 2 }}>Salooote.am</div>
        </div>
      </div>

      {/* Hero text */}
      <h1 style={{
        margin: "0 0 12px",
        fontSize: "clamp(26px, 5.5vw, 44px)",
        fontWeight: 800, color: "#1a0a0f", lineHeight: 1.12,
        letterSpacing: -0.8, maxWidth: 500,
      }}>
        {tx(T.hero, lang)}
      </h1>
      <p style={{ margin: "0 0 36px", fontSize: 15, color: "#9e7080", maxWidth: 380 }}>
        {tx(T.sub, lang)}
      </p>

      {/* Input */}
      <div style={{
        display: "flex", width: "100%", maxWidth: 560,
        background: "#fff", border: "2px solid #f0dce6",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 6px 28px rgba(225,29,92,.1)",
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder={tx(T.placeholder, lang)}
          style={{
            flex: 1, border: "none", outline: "none",
            padding: "16px 18px", fontSize: 14,
            color: "#1a0a0f", background: "transparent",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={() => onSend()}
          style={{
            margin: 7, padding: "10px 22px", borderRadius: 14,
            border: "none", background: PINK, color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: "0 2px 10px rgba(225,29,92,.3)", whiteSpace: "nowrap",
          }}
        >
          {tx(T.sendBtn, lang)}
        </button>
      </div>

      {/* Quick chips */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8,
        justifyContent: "center", marginTop: 22, maxWidth: 580,
      }}>
        {chips.map((chip, i) => (
          <button
            key={i}
            onClick={() => onSend(chip)}
            style={{
              padding: "8px 16px", borderRadius: 20,
              border: "1.5px solid #f0dce6", background: "#fdf5f8",
              color: "#7a2540", fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = PINK;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = PINK;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#fdf5f8";
              e.currentTarget.style.color = "#7a2540";
              e.currentTarget.style.borderColor = "#f0dce6";
            }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Chat input bar ───────────────────────────────────────────────────────────
function ChatInput({ lang, input, setInput, onSend, typing, inputRef }) {
  return (
    <div style={{
      padding: "12px 16px", borderTop: "1px solid #f3e3ea",
      background: "#fff", display: "flex", gap: 10, alignItems: "flex-end",
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
          flex: 1, border: "1.5px solid #f0dce6", borderRadius: 14,
          padding: "10px 14px", fontSize: 13.5, color: "#1a0a0f",
          outline: "none", resize: "none", lineHeight: 1.5,
          fontFamily: "inherit", background: "#fdf8fa",
          maxHeight: 120, overflowY: "auto",
        }}
      />
      <button
        onClick={() => onSend()}
        disabled={!input.trim() || typing}
        style={{
          width: 44, height: 44, borderRadius: 13, border: "none",
          background: input.trim() && !typing ? PINK : "#f0dce6",
          color: input.trim() && !typing ? "#fff" : "#cca8b8",
          fontSize: 20, cursor: input.trim() && !typing ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s", flexShrink: 0,
        }}
      >↑</button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AIAssistantV2Client({ lang }) {
  const router = useRouter();
  const [phase, setPhase] = useState("landing"); // "landing" | "chat"
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

  // Sequential reveal with typing dots between items
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

    // Transition to chat on first send
    const isFirstMessage = phase === "landing";
    if (isFirstMessage) setPhase("chat");

    // Welcome message on first turn
    const welcomeEntry = isFirstMessage
      ? [{ id: "w", role: "bot", type: "text", text: tx(T.welcome, lang) }]
      : [];

    const userEntry = { id: Date.now(), role: "user", type: "text", text };

    setMessages(prev => [...prev, ...welcomeEntry, userEntry]);
    setInput("");
    setTyping(true);

    // History for API: only text messages
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

      // Update conversation state
      if (d.state) setChatState(d.state);

      const base = Date.now() + 1;
      const seq = [];

      if (d.action === "plan_event") {
        if (d.message) seq.push({ id: base, role: "bot", type: "text", text: d.message });
        seq.push({ id: base + 1, role: "bot", type: "plan", event_type: d.event_type });
      } else {
        // Show blocks first (products/vendors appear while user reads context)
        (d.blocks || []).forEach((block, i) => {
          if (block.data?.length) {
            seq.push({ id: base + i, role: "bot", type: "block", block });
          }
        });
        // Message comes after blocks
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
        @keyframes v2dot {
          0%, 80%, 100% { transform: translateY(0); opacity: .35; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .v2-scroll::-webkit-scrollbar { display: none; }
        .v2-cards::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{
        height: "calc(100vh - 65px)",
        display: "flex", flexDirection: "column",
        background: "#fdf8fa",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif",
        position: "relative",
      }}>

        {/* ── LANDING ── */}
        {phase === "landing" && (
          <Landing
            lang={lang}
            onSend={send}
            input={input}
            setInput={setInput}
            inputRef={inputRef}
          />
        )}

        {/* ── CHAT ── */}
        {phase === "chat" && (
          <>
            {/* State context bar */}
            <StateBar state={chatState} lang={lang} />

            {/* Messages scroll area */}
            <div
              ref={scrollRef}
              className="v2-scroll"
              style={{
                flex: 1, overflowY: "auto",
                padding: "20px 16px",
                display: "flex", flexDirection: "column", gap: 14,
              }}
            >
              {messages.map(msg => {
                if (msg.type === "block") {
                  return (
                    <Block key={msg.id} block={msg.block} lang={lang} onOpen={openPopup} />
                  );
                }
                return (
                  <MsgBubble
                    key={msg.id}
                    msg={msg}
                    lang={lang}
                    onPlanEvent={handlePlanEvent}
                  />
                );
              })}
              {typing && <TypingDots />}
            </div>

            {/* Input */}
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

      {/* Detail popup */}
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
