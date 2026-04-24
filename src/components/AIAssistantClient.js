"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";
const DELAY = 1100; // ms between sequential bot messages

// ─── Static content ───────────────────────────────────────────────────────────
const WELCOME = {
  en: "Hi! I'm **Sali** ✨\nTell me what you're looking for — cakes, flowers, balloons, gifts, decorations, photographers... I'll find the best on Salooote right now!",
  hy: "Բարև! Ես **Sali**-ն եմ ✨\nԱսեք, թե ինչ եք փնտրում՝ տորթ, ծաղիկ, փուչիկ, նվեր, ձևավորում, ֆոտոգրաֆ... Ես հիմա կգտնեմ ձեզ համար:",
  ru: "Привет! Я **Sali** ✨\nРасскажите, что ищете — торт, цветы, шары, подарки, декор, фотограф... Найду лучшее прямо сейчас!",
};
const PLACEHOLDER = {
  en: "Ask me anything... (e.g. I need a birthday cake)",
  hy: "Հարցրեք ինձ...",
  ru: "Спросите меня...",
};
const CHIPS = {
  en: ["🎂 Cake", "🎈 Balloons", "💐 Flowers", "🎁 Gift", "📸 Photographer", "🎉 Birthday party"],
  hy: ["🎂 Տորթ", "🎈 Փուչիկ", "💐 Ծաղիկ", "🎁 Նվեր", "📸 Ֆոտոգրաֆ", "🎉 Ծննդյան"],
  ru: ["🎂 Торт", "🎈 Шары", "💐 Цветы", "🎁 Подарок", "📸 Фотограф", "🎉 День рождения"],
};
const ALSO_NEED = { en: "You may also need:", hy: "Կարող եք նաև կարիք ունենալ:", ru: "Вам также может понадобиться:" };
const MEANWHILE = { en: "Meanwhile, while you're viewing:", hy: "Մինչ դուք դիտում եք:", ru: "Пока вы просматриваете:" };
const PRODUCTS_LBL = { en: "Here are some options:", hy: "Ահա որոշ տարբերակներ.", ru: "Вот несколько вариантов:" };
const VENDORS_LBL = { en: "Also, you can find vendors here:", hy: "Կարող եք նաև գտնել մատակարարների:", ru: "Также можно найти поставщиков:" };
const PLAN_BTN = { en: "🎉 Plan this event with AI", hy: "🎉 Պլանավորել AI-ով", ru: "🎉 Планировать с AI" };

// Addon label map (English keyword → display label)
const ADDON_LABELS = {
  en: { balloon: "🎈 Balloons", cake: "🎂 Cake", flower: "💐 Flowers", candle: "🕯️ Candles",
        animator: "🤹 Animator", "candy table": "🍭 Candy Table", photographer: "📸 Photographer",
        "photo zone": "📷 Photo Zone", "gift box": "🎁 Gift Box", venue: "🏛️ Venue",
        decoration: "🎀 Decoration" },
  hy: { balloon: "🎈 Փուչիկ", cake: "🎂 Տորթ", flower: "💐 Ծաղիկ", candle: "🕯️ Մոմ",
        animator: "🤹 Անիmatор", "candy table": "🍭 Կոնֆetų Սedanak", photographer: "📸 Ֆotogrraf",
        "photo zone": "📷 Ֆotozana", "gift box": "🎁 Nver", venue: "🏛️ Vent", decoration: "🎀 Dzevavorumn" },
  ru: { balloon: "🎈 Шары", cake: "🎂 Торт", flower: "💐 Цветы", candle: "🕯️ Свечи",
        animator: "🤹 Аниmatор", "candy table": "🍭 Candy Bar", photographer: "📸 Фотограф",
        "photo zone": "📷 Фотозона", "gift box": "🎁 Подарок", venue: "🏛️ Место", decoration: "🎀 Декор" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace("/api/v1", "");
  return `${base}${url}`;
}
function fmt(p) {
  const n = parseFloat(p);
  return isNaN(n) ? "" : n.toLocaleString() + " ֏";
}
function BoldText({ text }) {
  return <>{text.split(/\*\*(.*?)\*\*/g).map((s, i) => i % 2 === 1 ? <strong key={i}>{s}</strong> : s)}</>;
}
function MsgText({ text }) {
  return (
    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.65 }}>
      {text.split("\n").map((line, i, arr) => (
        <span key={i}><BoldText text={line} />{i < arr.length - 1 && <br />}</span>
      ))}
    </span>
  );
}

// ─── Bot avatar ───────────────────────────────────────────────────────────────
function Avatar({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 35% 30%, #fda4af, #e11d5c 70%, #9f1239)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.46, boxShadow: "0 2px 6px rgba(225,29,92,.28)",
    }}>✨</div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function Dots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: PINK, display: "block",
          animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Bot row wrapper (avatar + content) ──────────────────────────────────────
function BotRow({ children, alignTop = false }) {
  return (
    <div style={{ display: "flex", alignItems: alignTop ? "flex-start" : "flex-end", gap: 8 }}>
      <Avatar />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ p, lang, onOpen }) {
  const img = imgSrc(p.thumbnail_url || p.images?.[0]?.url);
  const name = (lang !== "en" && p[`name_${lang}`]) || p.name || "Product";
  return (
    <button onClick={() => onOpen(p, "product")} style={{
      flexShrink: 0, width: 140, borderRadius: 14,
      background: "#fff", border: "1px solid #f0f0f0",
      boxShadow: "0 1px 8px rgba(0,0,0,0.07)", cursor: "pointer",
      textAlign: "left", overflow: "hidden", transition: "box-shadow .18s, transform .18s", padding: 0,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(225,29,92,.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#f9f0f3", position: "relative", overflow: "hidden" }}>
        {img ? <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="140px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🎁</div>}
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#222", lineHeight: 1.3,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{name}</p>
        {p.price > 0 && <p style={{ margin: "5px 0 0", fontSize: 12, fontWeight: 700, color: PINK }}>{fmt(p.price)}</p>}
      </div>
    </button>
  );
}

// ─── Vendor card ──────────────────────────────────────────────────────────────
function VendorCard({ v, onOpen }) {
  const banner = imgSrc(v.banner_url || v.logo_url);
  const logo = imgSrc(v.logo_url);
  return (
    <button onClick={() => onOpen(v, "vendor")} style={{
      flexShrink: 0, width: 160, borderRadius: 14,
      background: "#fff", border: "1px solid #f0f0f0",
      boxShadow: "0 1px 8px rgba(0,0,0,0.07)", cursor: "pointer",
      textAlign: "left", overflow: "hidden", transition: "box-shadow .18s, transform .18s", padding: 0,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(225,29,92,.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: "100%", height: 72, background: "linear-gradient(135deg,#fce7ef,#fff1f5)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="160px" />}
        {logo && banner !== logo && (
          <div style={{ position: "absolute", bottom: -12, left: 10, width: 28, height: 28,
            borderRadius: "50%", border: "2px solid #fff", overflow: "hidden", background: "#fff" }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="28px" />
          </div>
        )}
      </div>
      <div style={{ padding: "16px 10px 10px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#222" }}>{v.business_name || "Store"}</p>
        {v.city && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#999" }}>📍 {v.city}</p>}
        {v.short_bio && (
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#777", lineHeight: 1.3,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {v.short_bio}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Detail popup ─────────────────────────────────────────────────────────────
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
  const href = type === "product" ? `/${lang}/product/${item.slug || item.id}` : `/${lang}/vendor/${item.slug || item.id}`;
  const viewLbl = { en: "See full details →", hy: "Տեսնել ավելին →", ru: "Подробнее →" };

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        maxWidth: 460, width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
      }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f3f4f6", flexShrink: 0 }}>
          {imgs[idx] ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="460px" />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>{type === "product" ? "🎁" : "🏪"}</div>}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, width: 32, height: 32,
            borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none",
            color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} style={{
                  width: i === idx ? 18 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer",
                  background: i === idx ? "#fff" : "rgba(255,255,255,0.5)", transition: "width .2s",
                }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "18px 22px 22px", overflowY: "auto" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}>{name}</h2>
          {type === "product" && item.price > 0 && <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: PINK }}>{fmt(item.price)}</p>}
          {type === "vendor" && item.city && <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>📍 {item.city}</p>}
          {desc && <p style={{ margin: "12px 0 0", fontSize: 13, color: "#555", lineHeight: 1.6 }}>{desc.slice(0, 220)}{desc.length > 220 ? "…" : ""}</p>}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {item.tags.slice(0, 5).map((t, i) => <span key={i} style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, background: "#fce7ef", color: PINK, fontWeight: 500 }}>{t}</span>)}
            </div>
          )}
          <Link href={href} style={{
            display: "block", marginTop: 18, padding: "12px 18px", borderRadius: 12,
            background: PINK, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}>{viewLbl[lang] || viewLbl.en}</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Render a single "sub-message" ────────────────────────────────────────────
function SubMessage({ msg, lang, onOpen, onAddonClick, onPlan }) {
  const addonMap = ADDON_LABELS[lang] || ADDON_LABELS.en;

  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "72%", padding: "10px 14px", fontSize: 13, lineHeight: 1.6,
          borderRadius: "18px 18px 4px 18px",
          background: PINK, color: "#fff", boxShadow: "0 2px 10px rgba(225,29,92,.22)",
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
            display: "inline-block", maxWidth: "85%", padding: "10px 14px", fontSize: 13, lineHeight: 1.6,
            borderRadius: "4px 18px 18px 18px",
            background: "#fff", color: "#1a1a1a", border: "1px solid #efefef",
            boxShadow: "0 1px 4px rgba(0,0,0,.05)",
          }}>
            <MsgText text={msg.text} />
          </div>
        </BotRow>
      );

    case "plan":
      return (
        <BotRow>
          <button onClick={() => onPlan(msg.event_type)} style={{
            padding: "10px 20px", borderRadius: 12,
            background: `linear-gradient(135deg,${PINK},#f43f5e)`,
            color: "#fff", fontWeight: 700, fontSize: 13,
            border: "none", cursor: "pointer",
            boxShadow: "0 3px 12px rgba(225,29,92,.3)",
          }}>
            {PLAN_BTN[lang] || PLAN_BTN.en}
          </button>
        </BotRow>
      );

    case "products":
      return (
        <BotRow alignTop>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888", lineHeight: 1.4 }}>
              {PRODUCTS_LBL[lang] || PRODUCTS_LBL.en}
            </p>
            <div className="cards-row">
              {msg.products.map((p, i) => <ProductCard key={p.id || i} p={p} lang={lang} onOpen={onOpen} />)}
            </div>
          </div>
        </BotRow>
      );

    case "vendors":
      return (
        <BotRow alignTop>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888", lineHeight: 1.4 }}>
              {VENDORS_LBL[lang] || VENDORS_LBL.en}
            </p>
            <div className="cards-row">
              {msg.vendors.map((v, i) => <VendorCard key={v.id || i} v={v} onOpen={onOpen} />)}
            </div>
          </div>
        </BotRow>
      );

    case "question":
      return (
        <BotRow>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ margin: 0, fontSize: 11, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: .6 }}>
              {MEANWHILE[lang] || MEANWHILE.en}
            </p>
            <div style={{
              display: "inline-block", maxWidth: "85%", padding: "10px 14px", fontSize: 13, lineHeight: 1.6,
              borderRadius: "4px 18px 18px 18px",
              background: "#fff8fa", color: "#1a1a1a",
              border: `1.5px solid rgba(225,29,92,0.15)`,
              boxShadow: "0 1px 4px rgba(225,29,92,.06)",
            }}>
              {msg.text}
            </div>
          </div>
        </BotRow>
      );

    case "addons":
      return (
        <BotRow alignTop>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 11, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: .6 }}>
              {ALSO_NEED[lang] || ALSO_NEED.en}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {msg.addons.map((kw, i) => (
                <button key={i} onClick={() => onAddonClick(kw)} style={{
                  padding: "6px 14px", borderRadius: 20,
                  border: "1.5px solid rgba(225,29,92,0.2)",
                  background: "#fff", fontSize: 12, color: "#444", fontWeight: 500, cursor: "pointer",
                  transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fce7ef"; e.currentTarget.style.borderColor = PINK; e.currentTarget.style.color = PINK; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(225,29,92,0.2)"; e.currentTarget.style.color = "#444"; }}
                >
                  {addonMap[kw] || kw}
                </button>
              ))}
            </div>
          </div>
        </BotRow>
      );

    default:
      return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AIAssistantClient({ lang }) {
  const router = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false); // typing indicator visible
  const [popup, setPopup] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const timersRef = useRef([]);

  // Welcome message
  useEffect(() => {
    setMsgs([{ id: "w", role: "bot", subtype: "text", text: WELCOME[lang] || WELCOME.en }]);
  }, [lang]);

  // Scroll inside container only
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  // Cleanup timers on unmount
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Add sequential bot sub-messages with typing delays
  const revealSequence = useCallback((subMsgs) => {
    if (!subMsgs.length) return;

    // Add first immediately, no typing indicator before it
    setMsgs(prev => [...prev, subMsgs[0]]);

    subMsgs.slice(1).forEach((sub, i) => {
      // Show typing before this message
      const t1 = setTimeout(() => setTyping(true), i * DELAY + 200);
      // Show message, hide typing
      const t2 = setTimeout(() => {
        setTyping(false);
        setMsgs(prev => [...prev, sub]);
      }, (i + 1) * DELAY + 200);
      timersRef.current.push(t1, t2);
    });
  }, []);

  const send = useCallback(async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || typing) return;

    // Clear pending timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setTyping(false);

    const userMsg = { id: Date.now(), role: "user", text };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Build history (user-readable messages only, skip addons/products sub-messages)
    const history = [...msgs, userMsg]
      .filter(m => m.role === "user" || m.subtype === "text" || m.subtype === "question")
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

      // Build sequence of sub-messages
      const baseId = Date.now() + 1;
      const seq = [];

      if (d.message) seq.push({ id: baseId, role: "bot", subtype: "text", text: d.message });

      if (d.action === "plan_event") {
        seq.push({ id: baseId + 1, role: "bot", subtype: "plan", event_type: d.event_type });
      } else {
        if (d.products?.length) seq.push({ id: baseId + 2, role: "bot", subtype: "products", products: d.products });
        if (d.vendors?.length) seq.push({ id: baseId + 3, role: "bot", subtype: "vendors", vendors: d.vendors });
      }

      if (d.question) seq.push({ id: baseId + 4, role: "bot", subtype: "question", text: d.question });
      if (d.addons?.length) seq.push({ id: baseId + 5, role: "bot", subtype: "addons", addons: d.addons });

      revealSequence(seq);
    } catch {
      setTyping(false);
      setMsgs(prev => [...prev, { id: Date.now(), role: "bot", subtype: "text", text: "Sorry, something went wrong. Please try again!" }]);
    } finally {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, typing, msgs, lang, revealSequence]);

  const onKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const handleAddon = (kw) => {
    setInput(kw);
    setTimeout(() => send(kw), 50);
  };

  return (
    <>
      <style>{`
        @keyframes dot { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-7px);opacity:1} }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .cards-row { display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch; }
        .cards-row::-webkit-scrollbar{height:3px}
        .cards-row::-webkit-scrollbar-thumb{background:#fce7ef;border-radius:3px}
        .chat-scroll::-webkit-scrollbar{width:3px}
        .chat-scroll::-webkit-scrollbar-thumb{background:#f0dde4;border-radius:3px}
        .send-btn:hover:not(:disabled){opacity:.85;transform:scale(1.06)}
        .chip-btn:hover{background:#fce7ef!important;border-color:${PINK}!important;color:${PINK}!important}
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)", maxWidth: 740, margin: "0 auto" }}>

        {/* ── Top bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f5e6ec", background: "#fff", flexShrink: 0 }}>
          <Avatar size={40} />
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#111" }}>Sali</p>
            <p style={{ margin: 0, fontSize: 11, color: "#999" }}>
              {lang === "hy" ? "AI Գնումների Օգնական" : lang === "ru" ? "AI Помощник" : "AI Shopping Assistant"}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 11, color: "#888" }}>{lang === "hy" ? "Առցanc" : lang === "ru" ? "Онлайн" : "Online"}</span>
          </div>
        </div>

        {/* ── Messages ── */}
        <div ref={scrollRef} className="chat-scroll" style={{
          flex: 1, overflowY: "auto", padding: "16px 16px 8px",
          display: "flex", flexDirection: "column", gap: 12, background: "#fafafa",
        }}>
          {msgs.map(msg => (
            <div key={msg.id} style={{ animation: "msgIn .22s ease" }}>
              <SubMessage
                msg={msg} lang={lang}
                onOpen={(item, type) => setPopup({ item, type })}
                onAddonClick={handleAddon}
                onPlan={(et) => router.push(`/${lang}/planner?event_type=${et || "birthday"}`)}
              />
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ animation: "msgIn .2s ease" }}>
              <BotRow>
                <div style={{ display: "inline-block", background: "#fff", border: "1px solid #efefef", borderRadius: "4px 18px 18px 18px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                  <Dots />
                </div>
              </BotRow>
            </div>
          )}
        </div>

        {/* ── Chips ── */}
        <div style={{ padding: "8px 14px 6px", background: "#fff", borderTop: "1px solid #f5e6ec", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
          {(CHIPS[lang] || CHIPS.en).map((chip, i) => (
            <button key={i} className="chip-btn"
              onClick={() => { const kw = chip.replace(/^[^ ]+ /, ""); setInput(kw); inputRef.current?.focus(); }}
              style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: "1.5px solid #f0e0e6", background: "#fff", fontSize: 12, color: "#555", fontWeight: 500, cursor: "pointer", transition: "all .15s" }}>
              {chip}
            </button>
          ))}
        </div>

        {/* ── Input ── */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", padding: "10px 14px 14px", background: "#fff", flexShrink: 0 }}>
          <textarea
            ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
            rows={1} disabled={typing}
            style={{
              flex: 1, resize: "none", border: `1.5px solid ${input ? PINK : "#e8d5dc"}`,
              borderRadius: 14, padding: "10px 14px", fontSize: 13,
              fontFamily: "inherit", color: "#111", background: "#fafafa",
              minHeight: 40, maxHeight: 100, overflowY: "auto", transition: "border-color .15s", lineHeight: 1.4,
            }}
          />
          <button className="send-btn" onClick={() => send()}
            disabled={typing || !input.trim()}
            style={{
              width: 42, height: 42, flexShrink: 0, borderRadius: 12,
              background: input.trim() && !typing ? PINK : "#f0e8eb",
              border: "none", cursor: input.trim() && !typing ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: input.trim() && !typing ? "#fff" : "#ccc", transition: "all .18s",
            }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>

      {popup && <Popup item={popup.item} type={popup.type} lang={lang} onClose={() => setPopup(null)} />}
    </>
  );
}
