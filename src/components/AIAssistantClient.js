"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";
const PINK_DARK = "#9f1239";
const DELAY = 950;

const T = {
  welcome: {
    en: "Hi, I'm **Sali** ✨\nTell me what you're looking for — a cake, a gift, a venue — and I'll find the right thing.",
    hy: "Բարև, ես **Sali**-ն եմ ✨\nԱսեք ի՞նչ եք փնտրում — տորթ, նվեր, սրահ — ես կօգնեմ:",
    ru: "Привет, я **Sali** ✨\nРасскажите, что ищете — торт, подарок, площадку — я подберу.",
  },
  placeholder: {
    en: "What are you looking for?",
    hy: "Ի՞նչ եք փնտրում:",
    ru: "Что вы ищете?",
  },
  chips: {
    en: ["🎂 Birthday cake", "🎈 Balloons", "💐 Flowers", "🎁 Gift", "📸 Photographer", "✨ Plan a birthday"],
    hy: ["🎂 Ծննդյան տորթ", "🎈 Փուչիկներ", "💐 Ծաղիկներ", "🎁 Նվեր", "📸 Ֆոտոգրաֆ", "✨ Պլանավորել"],
    ru: ["🎂 Торт", "🎈 Шары", "💐 Цветы", "🎁 Подарок", "📸 Фотограф", "✨ Планировать"],
  },
  planBtn: { en: "Plan this event →", hy: "Պլանավորել →", ru: "Планировать →" },
  online: { en: "Online · usually replies instantly", hy: "Առցանց · պատասխանում է անմիջապես", ru: "Онлайн · отвечает мгновенно" },
  subtitle: { en: "AI Concierge · Salooote", hy: "AI օգնական · Salooote", ru: "AI-консьерж · Salooote" },
  vendors: { en: "Vendors", hy: "Խանութներ", ru: "Магазины" },
  viewProduct: { en: "View product →", hy: "Տեսնել →", ru: "Открыть →" },
  viewStore: { en: "View store →", hy: "Տեսնել →", ru: "Открыть →" },
};
const tx = (o, l) => o[l] || o.en;

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
    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
      {text.split("\n").map((line, i, arr) => (
        <span key={i}><BoldText text={line} />{i < arr.length - 1 && <br />}</span>
      ))}
    </span>
  );
}

function Avatar({ size = 32, glow = false }) {
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      background: "radial-gradient(circle at 30% 25%, #ffd1dc 0%, #f43f5e 55%, #9f1239 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.46), color: "#fff",
      boxShadow: glow
        ? "0 0 0 4px rgba(225,29,92,.12), 0 8px 24px rgba(225,29,92,.32)"
        : "0 2px 8px rgba(225,29,92,.28)",
      flexShrink: 0,
    }}>✨</div>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: PINK, display: "block",
          animation: `dot 1.2s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
  );
}

function BotRow({ children, top = false }) {
  return (
    <div style={{ display: "flex", alignItems: top ? "flex-start" : "flex-end", gap: 10 }}>
      <Avatar size={30} />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function ProductCard({ p, lang, onOpen }) {
  const [hover, setHover] = useState(false);
  const img = imgSrc(p.thumbnail_url || p.images?.[0]?.url);
  const name = (lang !== "en" && p[`name_${lang}`]) || p.name || "Product";
  return (
    <button
      onClick={() => onOpen(p, "product")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flexShrink: 0, width: 144, borderRadius: 16, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left",
        overflow: "hidden", position: "relative",
        border: `1px solid ${hover ? "#fbc9d8" : "#f0eaec"}`,
        boxShadow: hover
          ? "0 12px 28px rgba(225,29,92,.18), 0 2px 8px rgba(225,29,92,.08)"
          : "0 1px 3px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.04)",
        transform: hover ? "translateY(-3px)" : "none",
        transition: "all .25s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "linear-gradient(135deg,#fdf2f5 0%,#fbe7ed 100%)", position: "relative", overflow: "hidden" }}>
        {img
          ? <Image src={img} alt={name} fill style={{ objectFit: "cover", transform: hover ? "scale(1.06)" : "none", transition: "transform .35s" }} sizes="144px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, opacity: .35 }}>🎁</div>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,.04))" }} />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{
          margin: 0, fontSize: 12.5, fontWeight: 600, color: "#1a0a14", lineHeight: 1.35,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{name}</p>
        {p.price > 0 && (
          <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 700, color: PINK, letterSpacing: -0.2 }}>
            {fmt(p.price)}
          </p>
        )}
      </div>
    </button>
  );
}

function VendorCard({ v, onOpen }) {
  const [hover, setHover] = useState(false);
  const banner = imgSrc(v.banner_url || v.logo_url);
  const logo = imgSrc(v.logo_url);
  return (
    <button
      onClick={() => onOpen(v, "vendor")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flexShrink: 0, width: 168, borderRadius: 16, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left",
        overflow: "hidden",
        border: `1px solid ${hover ? "#fbc9d8" : "#f0eaec"}`,
        boxShadow: hover
          ? "0 12px 28px rgba(225,29,92,.18), 0 2px 8px rgba(225,29,92,.08)"
          : "0 1px 3px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.04)",
        transform: hover ? "translateY(-3px)" : "none",
        transition: "all .25s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", height: 76, background: "linear-gradient(135deg,#fce7ef 0%,#fde8ec 60%,#fff1f5 100%)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="168px" />}
        {logo && banner !== logo && (
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

function CardsRow({ label, children }) {
  return (
    <div>
      {label && (
        <p style={{
          margin: "0 0 8px", fontSize: 10.5, color: "#c0a8b3", fontWeight: 700,
          letterSpacing: 0.8, textTransform: "uppercase",
        }}>{label}</p>
      )}
      <div className="cards-row">{children}</div>
    </div>
  );
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
  const name = type === "product" ? ((lang !== "en" && item[`name_${lang}`]) || item.name || "Product") : (item.business_name || "Store");
  const desc = type === "product"
    ? ((lang !== "en" && item[`short_description_${lang}`]) || item.short_description || item.description?.replace(/<[^>]+>/g, "") || "")
    : (item.short_bio || item.description?.replace(/<[^>]+>/g, "") || "");
  const href = type === "product" ? `/${lang}/product/${item.slug || item.id}` : `/${lang}/vendor/${item.slug || item.id}`;

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(20,5,12,.65)",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "fadeIn .2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 24, overflow: "hidden",
        maxWidth: 480, width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.05)",
        animation: "popIn .3s cubic-bezier(.2,.8,.2,1)",
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
          {type === "vendor" && item.city && <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9b8390" }}>📍 {item.city}</p>}
          {desc && <p style={{ margin: "14px 0 0", fontSize: 14, color: "#5a4452", lineHeight: 1.7 }}>{desc.slice(0, 280)}{desc.length > 280 ? "…" : ""}</p>}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {item.tags.slice(0, 5).map((t, i) => (
                <span key={i} style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11.5,
                  background: "#fce7ef", color: PINK, fontWeight: 600, letterSpacing: 0.1,
                }}>{t}</span>
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

function SubMsg({ msg, lang, onOpen, onPlan }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "72%", padding: "11px 16px", fontSize: 13.5, lineHeight: 1.6,
          borderRadius: "20px 20px 6px 20px",
          background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
          color: "#fff", boxShadow: "0 4px 16px rgba(225,29,92,.28)",
          letterSpacing: 0.1,
        }}>
          <MsgText text={msg.text} />
        </div>
      </div>
    );
  }

  switch (msg.subtype) {
    case "text":
      return (
        <BotRow>
          <div style={{
            display: "inline-block", maxWidth: "88%", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.7,
            borderRadius: "6px 20px 20px 20px",
            background: "#fff", color: "#1a0a14",
            border: "1px solid #f0eaec", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.04)",
            letterSpacing: 0.1,
          }}>
            <MsgText text={msg.text} />
          </div>
        </BotRow>
      );

    case "products":
      return (
        <BotRow top>
          <CardsRow>
            {msg.products.map((p, i) => <ProductCard key={p.id || i} p={p} lang={lang} onOpen={onOpen} />)}
          </CardsRow>
        </BotRow>
      );

    case "vendors":
      return (
        <BotRow top>
          <CardsRow label={tx(T.vendors, lang)}>
            {msg.vendors.map((v, i) => <VendorCard key={v.id || i} v={v} onOpen={onOpen} />)}
          </CardsRow>
        </BotRow>
      );

    case "plan":
      return (
        <BotRow>
          <button onClick={() => onPlan(msg.event_type)} style={{
            padding: "12px 22px", borderRadius: 14,
            background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
            color: "#fff", fontWeight: 700, fontSize: 13.5,
            border: "none", cursor: "pointer", letterSpacing: 0.1,
            boxShadow: "0 6px 18px rgba(225,29,92,.32)",
            transition: "transform .15s, box-shadow .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(225,29,92,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(225,29,92,.32)"; }}
          >
            {tx(T.planBtn, lang)}
          </button>
        </BotRow>
      );

    default:
      return null;
  }
}

export default function AIAssistantClient({ lang }) {
  const router = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [popup, setPopup] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    setMsgs([{ id: "w", role: "bot", subtype: "text", text: tx(T.welcome, lang) }]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const revealSequence = useCallback((seq) => {
    if (!seq.length) return;
    setMsgs(prev => [...prev, seq[0]]);
    seq.slice(1).forEach((sub, i) => {
      const t1 = setTimeout(() => setTyping(true), i * DELAY + 80);
      const t2 = setTimeout(() => {
        setTyping(false);
        setMsgs(prev => [...prev, sub]);
      }, (i + 1) * DELAY + 80);
      timersRef.current.push(t1, t2);
    });
  }, []);

  const send = useCallback(async (override) => {
    const text = (override || input).trim();
    if (!text || typing) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setTyping(false);

    const userMsg = { id: Date.now(), role: "user", text };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const history = [...msgs, userMsg]
      .filter(m => m.role === "user" || m.subtype === "text")
      .filter(m => m.id !== "w")
      .slice(-8)
      .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch(`${API}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang }),
      });
      const json = await res.json();
      const d = json?.data || {};
      setTyping(false);

      const base = Date.now() + 1;
      const seq = [];

      if (d.action === "plan_event") {
        if (d.message) seq.push({ id: base, role: "bot", subtype: "text", text: d.message });
        seq.push({ id: base + 1, role: "bot", subtype: "plan", event_type: d.event_type });
      } else {
        if (d.products?.length) seq.push({ id: base, role: "bot", subtype: "products", products: d.products });
        if (d.vendors?.length) seq.push({ id: base + 1, role: "bot", subtype: "vendors", vendors: d.vendors });
        if (d.message) seq.push({ id: base + 2, role: "bot", subtype: "text", text: d.message });
      }

      if (seq.length) revealSequence(seq);
    } catch {
      setTyping(false);
      setMsgs(prev => [...prev, { id: Date.now(), role: "bot", subtype: "text", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, typing, msgs, lang, revealSequence]);

  const onKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      <style>{`
        @keyframes dot{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-7px);opacity:1}}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.4);opacity:.15}}
        .cards-row{display:flex;gap:12px;overflow-x:auto;padding:2px 2px 6px;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}
        .cards-row::-webkit-scrollbar{height:3px}
        .cards-row::-webkit-scrollbar-thumb{background:#f5dde4;border-radius:3px}
        .chat-scroll::-webkit-scrollbar{width:4px}
        .chat-scroll::-webkit-scrollbar-thumb{background:#f0dde4;border-radius:4px}
        .send-btn:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(225,29,92,.4)}
        .chip{transition:all .15s ease}
        .chip:hover:not(:disabled){background:#fff!important;border-color:${PINK}!important;color:${PINK}!important;transform:translateY(-1px);box-shadow:0 4px 12px rgba(225,29,92,.15)}
        .input-wrap:focus-within{border-color:${PINK}!important;box-shadow:0 0 0 4px rgba(225,29,92,.08),0 4px 16px rgba(225,29,92,.1)!important}
      `}</style>

      <div style={{
        display: "flex", flexDirection: "column",
        height: "calc(100vh - 65px)", maxWidth: 760, margin: "0 auto",
        background: "linear-gradient(180deg,#fffaf8 0%,#fdf2f5 100%)",
        position: "relative",
      }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,#fbc9d8 0%,transparent 70%)", opacity: .35, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: 60, left: -100, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,#fde0ea 0%,transparent 70%)", opacity: .4, pointerEvents: "none", zIndex: 0 }} />

        {/* Header */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 22px", background: "rgba(255,255,255,.85)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(240,234,236,.6)", flexShrink: 0,
        }}>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(225,29,92,.3) 0%,transparent 70%)",
              animation: "pulse 2.5s ease-in-out infinite",
            }} />
            <Avatar size={42} glow />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: "#1a0a14", letterSpacing: -0.3 }}>
              Sali
            </p>
            <p style={{ margin: 0, fontSize: 11.5, color: "#a08596", fontWeight: 500 }}>
              {tx(T.subtitle, lang)}
            </p>
          </div>
          <div style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            padding: "5px 11px", borderRadius: 20,
            background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,.2)" }} />
            <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>
              {lang === "ru" ? "Онлайн" : lang === "hy" ? "Առցանց" : "Online"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="chat-scroll" style={{
          flex: 1, overflowY: "auto", padding: "22px 18px 14px",
          display: "flex", flexDirection: "column", gap: 14,
          position: "relative", zIndex: 1,
        }}>
          {msgs.map(msg => (
            <div key={msg.id} style={{ animation: "msgIn .25s cubic-bezier(.2,.8,.2,1)" }}>
              <SubMsg msg={msg} lang={lang}
                onOpen={(item, type) => setPopup({ item, type })}
                onPlan={et => router.push(`/${lang}/planner?event_type=${et || "birthday"}`)}
              />
            </div>
          ))}

          {typing && (
            <div style={{ animation: "msgIn .18s ease" }}>
              <BotRow>
                <div style={{ display: "inline-block", background: "#fff", border: "1px solid #f0eaec", borderRadius: "6px 20px 20px 20px", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.04)" }}>
                  <Dots />
                </div>
              </BotRow>
            </div>
          )}
        </div>

        {/* Quick chips */}
        <div style={{
          padding: "10px 16px 6px", background: "rgba(255,255,255,.6)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(240,234,236,.5)",
          display: "flex", gap: 8, overflowX: "auto", flexShrink: 0,
          position: "relative", zIndex: 1,
        }}>
          {tx(T.chips, lang).map((chip, i) => (
            <button key={i} className="chip" disabled={typing}
              onClick={() => { setInput(chip); setTimeout(() => send(chip), 30); }}
              style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 22,
                border: "1px solid #ece2e6", background: "#fff",
                fontSize: 12.5, color: "#5a4452", fontWeight: 500, cursor: "pointer",
                opacity: typing ? .4 : 1, letterSpacing: 0.1,
              }}>
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: "10px 16px 18px", background: "rgba(255,255,255,.85)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          flexShrink: 0, position: "relative", zIndex: 1,
        }}>
          <div className="input-wrap" style={{
            display: "flex", alignItems: "flex-end", gap: 8,
            border: "1.5px solid #f0dce6", borderRadius: 18,
            padding: 5, background: "#fff",
            transition: "all .2s",
          }}>
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={onKey}
              placeholder={tx(T.placeholder, lang)}
              rows={1} disabled={typing}
              style={{
                flex: 1, resize: "none", border: "none", outline: "none",
                padding: "10px 12px", fontSize: 14, fontFamily: "inherit",
                color: "#1a0a14", background: "transparent", minHeight: 36, maxHeight: 110,
                overflowY: "auto", lineHeight: 1.5,
              }}
            />
            <button className="send-btn" onClick={() => send()} disabled={typing || !input.trim()} style={{
              width: 40, height: 40, flexShrink: 0, borderRadius: 13,
              background: input.trim() && !typing
                ? `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`
                : "#f5e6ed", border: "none",
              cursor: input.trim() && !typing ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: input.trim() && !typing ? "#fff" : "#cca8b8",
              boxShadow: input.trim() && !typing ? "0 4px 14px rgba(225,29,92,.32)" : "none",
              transition: "all .2s",
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {popup && <Popup item={popup.item} type={popup.type} lang={lang} onClose={() => setPopup(null)} />}
    </>
  );
}
