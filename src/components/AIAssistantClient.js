"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";
const DELAY = 950; // ms between sequential sub-messages

const WELCOME = {
  en: "Hi, I'm **Sali**.\nTell me what you're looking for and I'll help you find it.",
  hy: "Բարև, ես **Sali**-ն եմ.\nԱсеk ի՞նչ եք փնտրում, ես կօգնեմ:",
  ru: "Привет, я **Sali**.\nРасскажите, что ищете — я помогу найти.",
};
const PLACEHOLDER = {
  en: "What are you looking for?",
  hy: "Ի՞նչ եք փնտրում:",
  ru: "Что вы ищете?",
};
const CHIPS = {
  en: ["Birthday cake", "Balloons", "Flowers", "Gift", "Photographer", "Plan a birthday"],
  hy: ["Ծննдyan tort", "Փучikner", "Ծaghikner", "Nver", "Fotograf", "Plan event"],
  ru: ["Торт", "Шары", "Цветы", "Подарок", "Фотограф", "Планировать"],
};
const PLAN_BTN = { en: "Plan this event →", hy: "Պlanavovel →", ru: "Планировать →" };

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
    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
      {text.split("\n").map((line, i, arr) => (
        <span key={i}><BoldText text={line} />{i < arr.length - 1 && <br />}</span>
      ))}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 35% 30%, #fda4af, #e11d5c 70%, #9f1239)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, boxShadow: "0 2px 6px rgba(225,29,92,.28)",
    }}>✨</div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function Dots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: PINK, display: "block",
          animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Bot row ──────────────────────────────────────────────────────────────────
function BotRow({ children, top = false }) {
  return (
    <div style={{ display: "flex", alignItems: top ? "flex-start" : "flex-end", gap: 9 }}>
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
      flexShrink: 0, width: 136, borderRadius: 14, background: "#fff",
      border: "1px solid #efefef", boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      cursor: "pointer", textAlign: "left", overflow: "hidden", padding: 0,
      transition: "box-shadow .18s, transform .18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(225,29,92,.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#f8f4f5", position: "relative", overflow: "hidden" }}>
        {img ? <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="136px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, opacity: .4 }}>📦</div>}
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#222", lineHeight: 1.3,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{name}</p>
        {p.price > 0 && <p style={{ margin: "4px 0 0", fontSize: 12, fontWeight: 700, color: PINK }}>{fmt(p.price)}</p>}
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
      flexShrink: 0, width: 158, borderRadius: 14, background: "#fff",
      border: "1px solid #efefef", boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      cursor: "pointer", textAlign: "left", overflow: "hidden", padding: 0,
      transition: "box-shadow .18s, transform .18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(225,29,92,.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: "100%", height: 70, background: "linear-gradient(135deg,#fce7ef,#fff1f5)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="158px" />}
        {logo && banner !== logo && (
          <div style={{ position: "absolute", bottom: -12, left: 10, width: 28, height: 28,
            borderRadius: "50%", border: "2.5px solid #fff", overflow: "hidden", background: "#fff" }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="28px" />
          </div>
        )}
      </div>
      <div style={{ padding: "16px 10px 10px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#222" }}>{v.business_name || "Store"}</p>
        {v.city && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>📍 {v.city}</p>}
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

// ─── Cards row ────────────────────────────────────────────────────────────────
function CardsRow({ label, children }) {
  return (
    <div>
      {label && (
        <p style={{ margin: "0 0 7px", fontSize: 11, color: "#c0c0c0", fontWeight: 500, letterSpacing: .3 }}>{label}</p>
      )}
      <div className="cards-row">{children}</div>
    </div>
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
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.62)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        maxWidth: 460, width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f3f4f6", flexShrink: 0 }}>
          {imgs[idx] ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="460px" />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, opacity: .3 }}>📦</div>}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%",
            background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", fontSize: 15,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} style={{
                  width: i === idx ? 18 : 7, height: 7, borderRadius: 4, border: "none",
                  cursor: "pointer", background: i === idx ? "#fff" : "rgba(255,255,255,0.45)", transition: "width .2s",
                }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "18px 22px 22px", overflowY: "auto" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}>{name}</h2>
          {type === "product" && item.price > 0 && <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: PINK }}>{fmt(item.price)}</p>}
          {type === "vendor" && item.city && <p style={{ margin: "6px 0 0", fontSize: 13, color: "#999" }}>📍 {item.city}</p>}
          {desc && <p style={{ margin: "12px 0 0", fontSize: 13, color: "#555", lineHeight: 1.65 }}>{desc.slice(0, 240)}{desc.length > 240 ? "…" : ""}</p>}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {item.tags.slice(0, 5).map((t, i) => <span key={i} style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, background: "#fce7ef", color: PINK, fontWeight: 500 }}>{t}</span>)}
            </div>
          )}
          <Link href={href} style={{
            display: "block", marginTop: 18, padding: "12px", borderRadius: 12,
            background: PINK, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}>
            {type === "product" ? (lang === "hy" ? "Տесنել →" : lang === "ru" ? "Открыть →" : "View product →")
              : (lang === "hy" ? "Տеснел →" : lang === "ru" ? "Открыть →" : "View store →")}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Render one sub-message ───────────────────────────────────────────────────
function SubMsg({ msg, lang, onOpen, onPlan }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "72%", padding: "10px 14px", fontSize: 13, lineHeight: 1.65,
          borderRadius: "18px 18px 4px 18px",
          background: PINK, color: "#fff", boxShadow: "0 2px 10px rgba(225,29,92,.2)",
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
            display: "inline-block", maxWidth: "88%", padding: "10px 15px", fontSize: 13, lineHeight: 1.7,
            borderRadius: "4px 18px 18px 18px",
            background: "#fff", color: "#1c1c1c", border: "1px solid #efefef",
            boxShadow: "0 1px 5px rgba(0,0,0,.05)",
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
          <CardsRow label={lang === "hy" ? "Խанутner" : lang === "ru" ? "Магазины" : "Vendors"}>
            {msg.vendors.map((v, i) => <VendorCard key={v.id || i} v={v} onOpen={onOpen} />)}
          </CardsRow>
        </BotRow>
      );

    case "related":
      return (
        <BotRow top>
          <CardsRow label={msg.keyword}>
            {msg.products.map((p, i) => <ProductCard key={p.id || i} p={p} lang={lang} onOpen={onOpen} />)}
          </CardsRow>
        </BotRow>
      );

    case "plan":
      return (
        <BotRow>
          <button onClick={() => onPlan(msg.event_type)} style={{
            padding: "10px 20px", borderRadius: 12,
            background: `linear-gradient(135deg,${PINK},#f43f5e)`,
            color: "#fff", fontWeight: 600, fontSize: 13,
            border: "none", cursor: "pointer",
            boxShadow: "0 3px 12px rgba(225,29,92,.28)",
          }}>
            {PLAN_BTN[lang] || PLAN_BTN.en}
          </button>
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
  const [typing, setTyping] = useState(false);
  const [popup, setPopup] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    setMsgs([{ id: "w", role: "bot", subtype: "text", text: WELCOME[lang] || WELCOME.en }]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const revealSequence = useCallback((seq) => {
    if (!seq.length) return;
    // First item immediately
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
        // For plan_event: message first, then plan button
        if (d.message) seq.push({ id: base, role: "bot", subtype: "text", text: d.message });
        seq.push({ id: base + 1, role: "bot", subtype: "plan", event_type: d.event_type });
      } else {
        // Products first (user sees results while reading message)
        if (d.products?.length) seq.push({ id: base, role: "bot", subtype: "products", products: d.products });
        if (d.vendors?.length) seq.push({ id: base + 1, role: "bot", subtype: "vendors", vendors: d.vendors });

        // Related products (actual cards per keyword)
        const order = d.related_order || [];
        const related = d.related_products || {};
        order.forEach((kw, i) => {
          const prods = related[kw];
          if (prods?.length) {
            seq.push({ id: base + 2 + i, role: "bot", subtype: "related", keyword: kw, products: prods });
          }
        });

        // Bot's natural message comes LAST — feels like a human who showed you things and is now talking
        if (d.message) seq.push({ id: base + 10, role: "bot", subtype: "text", text: d.message });
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
        .cards-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}
        .cards-row::-webkit-scrollbar{height:3px}
        .cards-row::-webkit-scrollbar-thumb{background:#f5dde4;border-radius:3px}
        .chat-scroll::-webkit-scrollbar{width:3px}
        .chat-scroll::-webkit-scrollbar-thumb{background:#f0dde4;border-radius:3px}
        .send-btn:not(:disabled):hover{opacity:.85;transform:scale(1.05)}
        .chip:hover{background:#fce7ef!important;border-color:${PINK}!important;color:${PINK}!important}
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)", maxWidth: 740, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f2e8ec", background: "#fff", flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "radial-gradient(circle at 35% 30%, #fda4af, #e11d5c 70%, #9f1239)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 3px 10px rgba(225,29,92,.28)",
          }}>✨</div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#111" }}>Sali</p>
            <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>
              {lang === "hy" ? "AI Գнумного Помощник" : lang === "ru" ? "AI Помощник по покупкам" : "AI Shopping Assistant · Salooote.am"}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 11, color: "#bbb" }}>{lang === "ru" ? "Онлайн" : lang === "hy" ? "Առцanc" : "Online"}</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="chat-scroll" style={{
          flex: 1, overflowY: "auto", padding: "18px 16px 10px",
          display: "flex", flexDirection: "column", gap: 13, background: "#f9f9f9",
        }}>
          {msgs.map(msg => (
            <div key={msg.id} style={{ animation: "msgIn .22s ease" }}>
              <SubMsg msg={msg} lang={lang}
                onOpen={(item, type) => setPopup({ item, type })}
                onPlan={et => router.push(`/${lang}/planner?event_type=${et || "birthday"}`)}
              />
            </div>
          ))}

          {typing && (
            <div style={{ animation: "msgIn .18s ease" }}>
              <BotRow>
                <div style={{ display: "inline-block", background: "#fff", border: "1px solid #efefef", borderRadius: "4px 18px 18px 18px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                  <Dots />
                </div>
              </BotRow>
            </div>
          )}
        </div>

        {/* Quick chips */}
        <div style={{ padding: "7px 14px 5px", background: "#fff", borderTop: "1px solid #f2e8ec", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
          {(CHIPS[lang] || CHIPS.en).map((chip, i) => (
            <button key={i} className="chip" disabled={typing}
              onClick={() => { setInput(chip); setTimeout(() => send(chip), 30); }}
              style={{
                flexShrink: 0, padding: "5px 13px", borderRadius: 20, border: "1.5px solid #ece2e6",
                background: "#fff", fontSize: 12, color: "#666", fontWeight: 500, cursor: "pointer",
                transition: "all .15s", opacity: typing ? .4 : 1,
              }}>
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", padding: "10px 14px 16px", background: "#fff", flexShrink: 0 }}>
          <textarea ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
            rows={1} disabled={typing}
            style={{
              flex: 1, resize: "none", border: `1.5px solid ${input.trim() ? PINK : "#e4d4da"}`,
              borderRadius: 14, padding: "10px 14px", fontSize: 13, fontFamily: "inherit",
              color: "#111", background: "#fafafa", minHeight: 42, maxHeight: 110,
              overflowY: "auto", transition: "border-color .15s", lineHeight: 1.45,
            }}
          />
          <button className="send-btn" onClick={() => send()} disabled={typing || !input.trim()} style={{
            width: 42, height: 42, flexShrink: 0, borderRadius: 12,
            background: input.trim() && !typing ? PINK : "#f0e8eb", border: "none",
            cursor: input.trim() && !typing ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: input.trim() && !typing ? "#fff" : "#d0bac0", transition: "all .18s",
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>

      {popup && <Popup item={popup.item} type={popup.type} lang={lang} onClose={() => setPopup(null)} />}
    </>
  );
}
