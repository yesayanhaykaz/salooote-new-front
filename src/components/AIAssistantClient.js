"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";

// ─── Welcome messages per language ───────────────────────────────────────────
const WELCOME = {
  en: "Hi! I'm **Sali**, your personal shopping assistant on Salooote 🎉\n\nTell me what you're looking for — cakes, flowers, balloons, gifts, event decoration, photographers... I'll find the best for you right here!",
  hy: "Բարև! Ես **Sali**-ն եմ՝ ձեր անձնական օգնականը Salooote-ում 🎉\n\nԱսեք ինձ, թե ինչ եք փնտրում՝ տորթ, ծաղիկ, փուչիկ, նվեր, ձևավորում, ֆոտոգրաֆ... Ես ձեզ կգտնեմ լավագույնը:",
  ru: "Привет! Я **Sali** — ваш личный помощник по покупкам на Salooote 🎉\n\nРасскажите, что ищете — торт, цветы, шары, подарки, декор, фотограф... Я найду для вас лучшее!",
};

const PLACEHOLDER = {
  en: "Tell me what you need...",
  hy: "Ասեք ինձ, թե ինչ է ձեզ պետք...",
  ru: "Расскажите, что вам нужно...",
};

const PLAN_BTN = {
  en: "Plan this event with AI →",
  hy: "Պլանավորել այս միջոցառումը AI-ով →",
  ru: "Планировать это мероприятие с AI →",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace("/api/v1", "");
  return `${base}${url}`;
}

function formatPrice(p) {
  if (!p && p !== 0) return "";
  const n = typeof p === "string" ? parseFloat(p) : p;
  if (isNaN(n)) return p;
  return n.toLocaleString("hy-AM") + " ֏";
}

// ─── Bold markdown parser (only **text**) ────────────────────────────────────
function BoldText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? <strong key={i}>{p}</strong> : p
      )}
    </>
  );
}

function MessageText({ text }) {
  return (
    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          <BoldText text={line} />
          {i < text.split("\n").length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, lang, onClick }) {
  const img = imgSrc(product.thumbnail_url || product.images?.[0]?.url);
  const name = (lang !== "en" && product[`name_${lang}`]) || product.name || "Product";
  const price = product.price;

  return (
    <button
      onClick={() => onClick(product, "product")}
      style={{
        flexShrink: 0,
        width: 160,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(225,29,92,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
      }}
    >
      {/* Image */}
      <div style={{ width: "100%", aspectRatio: "4/3", background: "#f3f4f6", position: "relative", overflow: "hidden" }}>
        {img ? (
          <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="160px" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
            🎁
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111", lineHeight: 1.3,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {name}
        </p>
        {price > 0 && (
          <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 700, color: PINK }}>
            {formatPrice(price)}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Vendor Card ─────────────────────────────────────────────────────────────
function VendorCard({ vendor, lang, onClick }) {
  const img = imgSrc(vendor.banner_url || vendor.logo_url);
  const logo = imgSrc(vendor.logo_url);
  const name = vendor.business_name || "Vendor";
  const city = vendor.city || "";
  const bio = vendor.short_bio || vendor.description?.replace(/<[^>]+>/g, "").slice(0, 60) || "";

  return (
    <button
      onClick={() => onClick(vendor, "vendor")}
      style={{
        flexShrink: 0,
        width: 180,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(225,29,92,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
      }}
    >
      {/* Banner */}
      <div style={{ width: "100%", height: 80, background: "linear-gradient(135deg,#fce7ef,#fff1f5)", position: "relative", overflow: "hidden" }}>
        {img ? (
          <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="180px" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
            🏪
          </div>
        )}
        {/* Logo overlay */}
        {logo && img !== logo && (
          <div style={{ position: "absolute", bottom: -16, left: 12, width: 34, height: 34, borderRadius: "50%",
            overflow: "hidden", border: "2px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", background: "#fff" }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="34px" />
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "20px 12px 12px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#111" }}>{name}</p>
        {city && (
          <p style={{ margin: "3px 0 0", fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 3 }}>
            📍 {city}
          </p>
        )}
        {bio && (
          <p style={{ margin: "5px 0 0", fontSize: 11, color: "#666", lineHeight: 1.35,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {bio}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Full-screen Popup ────────────────────────────────────────────────────────
function DetailPopup({ item, type, lang, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);

  // Collect images
  const images = [];
  if (type === "product") {
    if (item.images?.length) {
      item.images.forEach(img => { const s = imgSrc(img.url); if (s) images.push(s); });
    } else if (item.thumbnail_url) {
      const s = imgSrc(item.thumbnail_url); if (s) images.push(s);
    }
  } else {
    if (item.banner_url) { const s = imgSrc(item.banner_url); if (s) images.push(s); }
    if (item.logo_url) { const s = imgSrc(item.logo_url); if (s && s !== images[0]) images.push(s); }
  }

  const name = type === "product"
    ? ((lang !== "en" && item[`name_${lang}`]) || item.name || "Product")
    : (item.business_name || "Vendor");

  const desc = type === "product"
    ? ((lang !== "en" && item[`short_description_${lang}`]) || item.short_description || item.description?.replace(/<[^>]+>/g, "") || "")
    : (item.short_bio || item.description?.replace(/<[^>]+>/g, "") || "");

  const href = type === "product"
    ? `/${lang}/product/${item.slug || item.id}`
    : `/${lang}/vendor/${item.slug || item.id}`;

  const price = type === "product" && item.price > 0 ? formatPrice(item.price) : null;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 24,
          overflow: "hidden",
          maxWidth: 520,
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Image area */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f3f4f6", flexShrink: 0 }}>
          {images.length > 0 ? (
            <Image src={images[imgIdx]} alt={name} fill style={{ objectFit: "cover" }} sizes="520px" />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
              {type === "product" ? "🎁" : "🏪"}
            </div>
          )}
          {/* Close btn */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer",
              color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
          {/* Image dots */}
          {images.length > 1 && (
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: 6 }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  style={{
                    width: i === imgIdx ? 20 : 8, height: 8, borderRadius: 4,
                    background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.5)",
                    border: "none", cursor: "pointer", transition: "width 0.2s",
                  }} />
              ))}
            </div>
          )}
        </div>
        {/* Content */}
        <div style={{ padding: "20px 24px 24px", overflowY: "auto", flexGrow: 1 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>{name}</h2>
          {price && (
            <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 700, color: PINK }}>{price}</p>
          )}
          {type === "vendor" && item.city && (
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#888" }}>📍 {item.city}</p>
          )}
          {desc && (
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "#555", lineHeight: 1.6 }}>
              {desc.slice(0, 200)}{desc.length > 200 ? "..." : ""}
            </p>
          )}
          {/* Tags */}
          {type === "product" && item.tags?.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {item.tags.slice(0, 5).map((tag, i) => (
                <span key={i} style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 12,
                  background: "#fce7ef", color: PINK, fontWeight: 500,
                }}>{tag}</span>
              ))}
            </div>
          )}
          {/* CTA */}
          <Link href={href}
            style={{
              display: "block", marginTop: 20,
              background: PINK, color: "#fff",
              padding: "12px 20px", borderRadius: 12,
              textAlign: "center", fontWeight: 700, fontSize: 15,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {type === "product" ? "View Product →" : "View Store →"}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: PINK, display: "inline-block",
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Bot Avatar ───────────────────────────────────────────────────────────────
function BotAvatar() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 35% 30%, #fda4af 0%, #f43f5e 45%, #e11d5c 75%, #9f1239 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18, boxShadow: "0 2px 8px rgba(225,29,92,0.35)",
    }}>
      ✨
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIAssistantClient({ lang, dict }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null); // {item, type}
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message on mount
  useEffect(() => {
    setMessages([{
      id: "welcome",
      role: "bot",
      text: WELCOME[lang] || WELCOME.en,
      products: [],
      vendors: [],
      action: "",
    }]);
  }, [lang]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Build history for API (exclude welcome, last 6)
    const history = [...messages.filter(m => m.id !== "welcome"), userMsg]
      .slice(-6)
      .map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));

    try {
      const res = await fetch(`${API}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang }),
      });
      const json = await res.json();
      const data = json?.data || {};

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: data.message || "I found some options for you!",
        products: data.products || [],
        vendors: data.vendors || [],
        action: data.action || "",
        event_type: data.event_type || "",
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "bot",
        text: "Sorry, something went wrong. Please try again!",
        products: [], vendors: [], action: "",
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages, lang]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openPopup = (item, type) => setPopup({ item, type });
  const closePopup = () => setPopup(null);

  const goToPlanner = (eventType) => {
    const et = eventType || "birthday";
    router.push(`/${lang}/planner?event_type=${et}`);
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes msgIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #f0a0b5; border-radius: 4px; }
        .cards-scroll::-webkit-scrollbar { height: 3px; }
        .cards-scroll::-webkit-scrollbar-thumb { background: #fce7ef; }
      `}</style>

      <Header lang={lang} />

      {/* Page wrapper */}
      <div style={{
        minHeight: "calc(100vh - 140px)",
        background: "linear-gradient(160deg, #fff8fa 0%, #fff 50%, #fef6f9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px 0",
      }}>
        {/* Title bar */}
        <div style={{ width: "100%", maxWidth: 720, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #fda4af 0%, #f43f5e 45%, #e11d5c 75%, #9f1239 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 14px rgba(225,29,92,0.3)",
          }}>✨</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}>Sali</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
              {lang === "hy" ? "AI Գնումների Օգնական" : lang === "ru" ? "AI Помощник по покупкам" : "AI Shopping Assistant"}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 12, color: "#666" }}>
              {lang === "hy" ? "Առցանց" : lang === "ru" ? "Онлайн" : "Online"}
            </span>
          </div>
        </div>

        {/* Chat container */}
        <div style={{
          width: "100%", maxWidth: 720,
          height: "calc(100vh - 280px)",
          minHeight: 400,
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          border: "1px solid rgba(225,29,92,0.1)",
          borderBottom: "none",
          boxShadow: "0 -4px 24px rgba(225,29,92,0.06), 0 0 0 1px rgba(225,29,92,0.06)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Messages */}
          <div style={{ flexGrow: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 10,
                animation: "msgIn 0.25s ease",
              }}>
                {/* Avatar (bot only) */}
                {msg.role === "bot" && <BotAvatar />}

                <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: 8,
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {/* Bubble */}
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                    ...(msg.role === "user" ? {
                      background: PINK,
                      color: "#fff",
                      boxShadow: "0 2px 12px rgba(225,29,92,0.25)",
                    } : {
                      background: "#f8f8f8",
                      color: "#1a1a1a",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }),
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}>
                    <MessageText text={msg.text} />
                  </div>

                  {/* Plan Event CTA */}
                  {msg.action === "plan_event" && (
                    <button
                      onClick={() => goToPlanner(msg.event_type)}
                      style={{
                        padding: "10px 20px", borderRadius: 12,
                        background: `linear-gradient(135deg, ${PINK}, #f43f5e)`,
                        color: "#fff", fontWeight: 700, fontSize: 14,
                        border: "none", cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(225,29,92,0.3)",
                        transition: "transform 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "none"}
                    >
                      {PLAN_BTN[lang] || PLAN_BTN.en}
                    </button>
                  )}

                  {/* Product cards */}
                  {msg.products?.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 8px 2px", fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {lang === "hy" ? "Ապրանքներ" : lang === "ru" ? "Товары" : "Products"}
                      </p>
                      <div className="cards-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
                        {msg.products.map((p, i) => (
                          <ProductCard key={p.id || i} product={p} lang={lang} onClick={openPopup} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vendor cards */}
                  {msg.vendors?.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 8px 2px", fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {lang === "hy" ? "Խանութներ" : lang === "ru" ? "Магазины" : "Stores"}
                      </p>
                      <div className="cards-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
                        {msg.vendors.map((v, i) => (
                          <VendorCard key={v.id || i} vendor={v} lang={lang} onClick={openPopup} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, animation: "msgIn 0.2s ease" }}>
                <BotAvatar />
                <div style={{ background: "#f8f8f8", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "4px 18px 18px 18px" }}>
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            borderTop: "1px solid rgba(225,29,92,0.08)",
            padding: "14px 16px",
            display: "flex", gap: 10, alignItems: "flex-end",
            background: "#fff",
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
              rows={1}
              style={{
                flexGrow: 1,
                resize: "none",
                border: "1.5px solid rgba(225,29,92,0.2)",
                borderRadius: 14,
                padding: "10px 14px",
                fontSize: 14,
                fontFamily: "inherit",
                color: "#111",
                background: "#fafafa",
                transition: "border-color 0.15s",
                minHeight: 42,
                maxHeight: 120,
                overflowY: "auto",
              }}
              onFocus={e => e.target.style.borderColor = PINK}
              onBlur={e => e.target.style.borderColor = "rgba(225,29,92,0.2)"}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 44, height: 44, flexShrink: 0,
                borderRadius: 14,
                background: input.trim() && !loading ? PINK : "#f3f4f6",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s, transform 0.15s",
                color: input.trim() && !loading ? "#fff" : "#aaa",
              }}
              onMouseEnter={e => { if (input.trim() && !loading) e.currentTarget.style.transform = "scale(1.08)"; }}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick suggestion chips */}
        <div style={{
          width: "100%", maxWidth: 720,
          background: "#fff",
          borderTop: "none",
          padding: "12px 16px 16px",
          display: "flex", flexWrap: "wrap", gap: 8,
          borderRadius: "0 0 20px 20px",
          borderLeft: "1px solid rgba(225,29,92,0.1)",
          borderRight: "1px solid rgba(225,29,92,0.1)",
          borderBottom: "1px solid rgba(225,29,92,0.1)",
          boxShadow: "0 6px 24px rgba(225,29,92,0.06)",
          marginBottom: 32,
        }}>
          {(lang === "hy"
            ? ["🎂 Տորթ", "🎈 Փուչիկ", "💐 Ծաղիկ", "🎁 Նվեր", "📸 Ֆոտոգրաֆ", "🎉 Ծննդյան"]
            : lang === "ru"
            ? ["🎂 Торт", "🎈 Шары", "💐 Цветы", "🎁 Подарок", "📸 Фотограф", "🎉 День рождения"]
            : ["🎂 Cake", "🎈 Balloons", "💐 Flowers", "🎁 Gift", "📸 Photographer", "🎉 Birthday"]
          ).map((chip, i) => (
            <button
              key={i}
              onClick={() => { setInput(chip.replace(/^[^ ]+ /, "")); inputRef.current?.focus(); }}
              style={{
                padding: "7px 14px", borderRadius: 20,
                border: "1.5px solid rgba(225,29,92,0.2)",
                background: "#fff", cursor: "pointer",
                fontSize: 13, color: "#444", fontWeight: 500,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#fce7ef";
                e.currentTarget.style.borderColor = PINK;
                e.currentTarget.style.color = PINK;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "rgba(225,29,92,0.2)";
                e.currentTarget.style.color = "#444";
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <Footer lang={lang} />

      {/* Popup */}
      {popup && (
        <DetailPopup item={popup.item} type={popup.type} lang={lang} onClose={closePopup} />
      )}
    </>
  );
}
