"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";

// ─── Static content ───────────────────────────────────────────────────────────
const WELCOME = {
  en: "Hi! I'm **Sali** ✨\nTell me what you're looking for — cakes, flowers, balloons, gifts, decorations, photographers... I'll find the best on Salooote right now!",
  hy: "Բարև! Ես **Sali**-ն եմ ✨\nԱսեք ինձ, թե ինչ եք փնտրում՝ տորթ, ծաղիկ, փուչիկ, նվեր, ձևավորում, ֆոտոգրաֆ... Ես անմիջապես կգտնեմ ձեզ համար Salooote-ում:",
  ru: "Привет! Я **Sali** ✨\nРасскажите, что ищете — торт, цветы, шары, подарки, декор, фотограф... Я найду лучшее на Salooote прямо сейчас!",
};
const PLACEHOLDER = {
  en: "Ask me anything... (e.g. I need a birthday cake)",
  hy: "Հարցրեք ինձ... (օր.՝ Ծննդյան տորթ եմ ուզում)",
  ru: "Спросите меня... (напр. Нужен торт на день рождения)",
};
const PLAN_BTN = {
  en: "🎉 Plan this event with AI",
  hy: "🎉 Պլանավորել AI-ով",
  ru: "🎉 Планировать с AI",
};
const CHIPS = {
  en: ["🎂 Cake", "🎈 Balloons", "💐 Flowers", "🎁 Gift", "📸 Photographer", "🎉 Birthday party"],
  hy: ["🎂 Տորթ", "🎈 Փուչիկ", "💐 Ծաղիկ", "🎁 Նվեր", "📸 Ֆոտոգրաֆ", "🎉 Ծննդյան"],
  ru: ["🎂 Торт", "🎈 Шары", "💐 Цветы", "🎁 Подарок", "📸 Фотограф", "🎉 День рождения"],
};
const LABELS = {
  en: { products: "Products", stores: "Stores", view: "See full details →" },
  hy: { products: "Ապրանքներ", stores: "Խանութներ", view: "Տեսնել ավելին →" },
  ru: { products: "Товары", stores: "Магазины", view: "Подробнее →" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace("/api/v1", "");
  return `${base}${url}`;
}
function fmt(p) {
  if (!p && p !== 0) return "";
  const n = parseFloat(p);
  return isNaN(n) ? String(p) : n.toLocaleString() + " ֏";
}
function BoldText({ text }) {
  return (
    <>
      {text.split(/\*\*(.*?)\*\*/g).map((s, i) =>
        i % 2 === 1 ? <strong key={i}>{s}</strong> : s
      )}
    </>
  );
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

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ p, lang, onOpen }) {
  const img = imgSrc(p.thumbnail_url || p.images?.[0]?.url);
  const name = (lang !== "en" && p[`name_${lang}`]) || p.name || "Product";
  return (
    <button onClick={() => onOpen(p, "product")} style={{
      flexShrink: 0, width: 140, borderRadius: 14,
      background: "#fff", border: "1px solid #f0f0f0",
      boxShadow: "0 1px 8px rgba(0,0,0,0.07)", cursor: "pointer",
      textAlign: "left", overflow: "hidden", transition: "box-shadow .18s, transform .18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(225,29,92,.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#f9f0f3", position: "relative", overflow: "hidden" }}>
        {img
          ? <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="140px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🎁</div>
        }
      </div>
      <div style={{ padding: "9px 10px 11px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#222", lineHeight: 1.3,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {name}
        </p>
        {p.price > 0 && (
          <p style={{ margin: "5px 0 0", fontSize: 12, fontWeight: 700, color: PINK }}>{fmt(p.price)}</p>
        )}
      </div>
    </button>
  );
}

// ─── Vendor card ──────────────────────────────────────────────────────────────
function VendorCard({ v, lang, onOpen }) {
  const banner = imgSrc(v.banner_url || v.logo_url);
  const logo = imgSrc(v.logo_url);
  return (
    <button onClick={() => onOpen(v, "vendor")} style={{
      flexShrink: 0, width: 160, borderRadius: 14,
      background: "#fff", border: "1px solid #f0f0f0",
      boxShadow: "0 1px 8px rgba(0,0,0,0.07)", cursor: "pointer",
      textAlign: "left", overflow: "hidden", transition: "box-shadow .18s, transform .18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(225,29,92,.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: "100%", height: 70, background: "linear-gradient(135deg,#fce7ef,#fff1f5)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="160px" />}
        {logo && banner !== logo && (
          <div style={{ position: "absolute", bottom: -12, left: 10, width: 30, height: 30,
            borderRadius: "50%", border: "2px solid #fff", overflow: "hidden", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.15)" }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="30px" />
          </div>
        )}
      </div>
      <div style={{ padding: "16px 10px 11px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#222" }}>{v.business_name || "Store"}</p>
        {v.city && <p style={{ margin: "3px 0 0", fontSize: 11, color: "#999" }}>📍 {v.city}</p>}
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
  const lbl = LABELS[lang] || LABELS.en;
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
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        maxWidth: 480, width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
      }}>
        {/* Image */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f3f4f6", flexShrink: 0 }}>
          {imgs[idx]
            ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="480px" />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>{type === "product" ? "🎁" : "🏪"}</div>
          }
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, width: 34, height: 34,
            borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none",
            color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
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
        {/* Info */}
        <div style={{ padding: "18px 22px 22px", overflowY: "auto" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}>{name}</h2>
          {type === "product" && item.price > 0 && (
            <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: PINK }}>{fmt(item.price)}</p>
          )}
          {type === "vendor" && item.city && (
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>📍 {item.city}</p>
          )}
          {desc && (
            <p style={{ margin: "12px 0 0", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
              {desc.slice(0, 220)}{desc.length > 220 ? "…" : ""}
            </p>
          )}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {item.tags.slice(0, 5).map((t, i) => (
                <span key={i} style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, background: "#fce7ef", color: PINK, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          )}
          <Link href={href} style={{
            display: "block", marginTop: 18, padding: "12px 18px", borderRadius: 12,
            background: PINK, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 14,
            textDecoration: "none",
          }}>
            {lbl.view}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function Dots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: PINK,
          display: "block", animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AIAssistantClient({ lang, dict }) {
  const router = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const scrollRef = useRef(null);   // scrollable messages container
  const inputRef = useRef(null);

  // Welcome
  useEffect(() => {
    setMsgs([{ id: "w", role: "bot", text: WELCOME[lang] || WELCOME.en, products: [], vendors: [], action: "" }]);
  }, [lang]);

  // Scroll inside chat container only — NOT the page
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { id: Date.now(), role: "user", text };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = [...msgs.filter(m => m.id !== "w"), userMsg]
      .slice(-8)
      .map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));

    try {
      const res = await fetch(`${API}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang }),
      });
      const json = await res.json();
      const d = json?.data || {};
      setMsgs(prev => [...prev, {
        id: Date.now() + 1, role: "bot",
        text: d.message || "Here's what I found!",
        products: d.products || [],
        vendors: d.vendors || [],
        action: d.action || "",
        event_type: d.event_type || "",
      }]);
    } catch {
      setMsgs(prev => [...prev, {
        id: Date.now() + 1, role: "bot", text: "Sorry, something went wrong. Please try again!",
        products: [], vendors: [], action: "",
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [input, loading, msgs, lang]);

  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const lbl = LABELS[lang] || LABELS.en;

  return (
    <>
      <style>{`
        @keyframes dot { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-7px);opacity:1} }
        @keyframes msgIn { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes popIn { from{transform:translateY(24px) scale(.97);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
        .cards-row { display:flex; gap:10px; overflow-x:auto; padding-bottom:6px; overscroll-behavior-x:contain; -webkit-overflow-scrolling:touch; }
        .cards-row::-webkit-scrollbar { height:3px }
        .cards-row::-webkit-scrollbar-thumb { background:#fce7ef; border-radius:3px }
        .chat-scroll::-webkit-scrollbar { width:3px }
        .chat-scroll::-webkit-scrollbar-thumb { background:#f0dde4; border-radius:3px }
        .chip-btn:hover { background:#fce7ef !important; border-color:${PINK} !important; color:${PINK} !important }
        .send-btn:hover:not(:disabled) { opacity:.88; transform:scale(1.06) }
      `}</style>

      {/* Full-height container (no extra header/footer — layout has them) */}
      <div style={{
        display: "flex", flexDirection: "column",
        height: "calc(100vh - 65px)",
        maxWidth: 740, margin: "0 auto",
        padding: "0",
      }}>

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px 10px",
          borderBottom: "1px solid #f5e6ec",
          background: "#fff", flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #fda4af 0%, #f43f5e 45%, #e11d5c 75%, #9f1239 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 3px 10px rgba(225,29,92,.3)", flexShrink: 0,
          }}>✨</div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#111" }}>Sali</p>
            <p style={{ margin: 0, fontSize: 11, color: "#999" }}>
              {lang === "hy" ? "AI Գնումների Օգնական" : lang === "ru" ? "AI Помощник" : "AI Shopping Assistant"}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 11, color: "#888" }}>
              {lang === "hy" ? "Առցանց" : lang === "ru" ? "Онлайн" : "Online"}
            </span>
          </div>
        </div>

        {/* ── Messages ────────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="chat-scroll"
          style={{
            flex: 1, overflowY: "auto",
            padding: "16px 16px 8px",
            display: "flex", flexDirection: "column", gap: 14,
            background: "#fafafa",
          }}
        >
          {msgs.map(msg => (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 6, animation: "msgIn .22s ease" }}>

              {/* ── text row ── */}
              <div style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end", gap: 8,
              }}>
                {/* Bot avatar */}
                {msg.role === "bot" && (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0, alignSelf: "flex-start", marginTop: 2,
                    background: "radial-gradient(circle at 35% 30%, #fda4af, #e11d5c 70%, #9f1239)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, boxShadow: "0 2px 6px rgba(225,29,92,.3)",
                  }}>✨</div>
                )}
                {/* Bubble */}
                <div style={{
                  maxWidth: "75%", padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  fontSize: 13, lineHeight: 1.6,
                  ...(msg.role === "user"
                    ? { background: PINK, color: "#fff", boxShadow: "0 2px 10px rgba(225,29,92,.22)" }
                    : { background: "#fff", color: "#1a1a1a", border: "1px solid #efefef", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }
                  ),
                }}>
                  <MsgText text={msg.text} />
                </div>
              </div>

              {/* ── cards — full width, indented past avatar ── */}
              {(msg.products?.length > 0 || msg.vendors?.length > 0 || msg.action === "plan_event") && (
                <div style={{ paddingLeft: 38, display: "flex", flexDirection: "column", gap: 10 }}>

                  {/* Plan event button */}
                  {msg.action === "plan_event" && (
                    <button onClick={() => router.push(`/${lang}/planner?event_type=${msg.event_type || "birthday"}`)}
                      style={{
                        alignSelf: "flex-start", padding: "9px 18px", borderRadius: 10,
                        background: `linear-gradient(135deg,${PINK},#f43f5e)`,
                        color: "#fff", fontWeight: 700, fontSize: 13,
                        border: "none", cursor: "pointer",
                        boxShadow: "0 3px 12px rgba(225,29,92,.3)",
                      }}>
                      {PLAN_BTN[lang] || PLAN_BTN.en}
                    </button>
                  )}

                  {/* Product cards */}
                  {msg.products?.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 7px", fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: .8 }}>
                        {lbl.products}
                      </p>
                      <div className="cards-row">
                        {msg.products.map((p, i) => (
                          <ProductCard key={p.id || i} p={p} lang={lang} onOpen={(item, t) => setPopup({ item, type: t })} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vendor cards */}
                  {msg.vendors?.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 7px", fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: .8 }}>
                        {lbl.stores}
                      </p>
                      <div className="cards-row">
                        {msg.vendors.map((v, i) => (
                          <VendorCard key={v.id || i} v={v} lang={lang} onOpen={(item, t) => setPopup({ item, type: t })} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, animation: "msgIn .2s ease" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #fda4af, #e11d5c 70%, #9f1239)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
              }}>✨</div>
              <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px 18px 18px 18px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                <Dots />
              </div>
            </div>
          )}
        </div>

        {/* ── Suggestion chips ─────────────────────────────────────── */}
        <div style={{
          padding: "8px 14px 6px", background: "#fff",
          borderTop: "1px solid #f5e6ec",
          display: "flex", gap: 6, overflowX: "auto", flexShrink: 0,
        }}>
          {(CHIPS[lang] || CHIPS.en).map((chip, i) => (
            <button key={i} className="chip-btn"
              onClick={() => { setInput(chip.replace(/^[^ ]+ /, "")); inputRef.current?.focus(); }}
              style={{
                flexShrink: 0, padding: "5px 12px", borderRadius: 20,
                border: "1.5px solid #f0e0e6", background: "#fff",
                fontSize: 12, color: "#555", fontWeight: 500, cursor: "pointer",
                transition: "all .15s",
              }}>
              {chip}
            </button>
          ))}
        </div>

        {/* ── Input bar ────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 8, alignItems: "flex-end",
          padding: "10px 14px 14px",
          background: "#fff", flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
            rows={1}
            disabled={loading}
            style={{
              flex: 1, resize: "none", border: `1.5px solid ${input ? PINK : "#e8d5dc"}`,
              borderRadius: 14, padding: "10px 14px", fontSize: 13,
              fontFamily: "inherit", color: "#111", background: "#fafafa",
              minHeight: 40, maxHeight: 100, overflowY: "auto",
              transition: "border-color .15s", lineHeight: 1.4,
            }}
          />
          <button className="send-btn"
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42, flexShrink: 0, borderRadius: 12,
              background: input.trim() && !loading ? PINK : "#f0e8eb",
              border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: input.trim() && !loading ? "#fff" : "#ccc",
              transition: "all .18s",
            }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Popup ────────────────────────────────────────────────── */}
      {popup && <Popup item={popup.item} type={popup.type} lang={lang} onClose={() => setPopup(null)} />}
    </>
  );
}
