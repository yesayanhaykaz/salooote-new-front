"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";

const PINK = "#e11d5c";

function MascotIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <defs>
        <linearGradient id="fl-body" x1="16" y1="20" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff7fa" />
          <stop offset="1" stopColor="#ffe1ec" />
        </linearGradient>
        <linearGradient id="fl-hat" x1="36" y1="6" x2="50" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f43f5e" />
          <stop offset="1" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="fl-screen" x1="20" y1="28" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1a0a14" />
          <stop offset="1" stopColor="#3a1424" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="46" r="3.6" fill="#ffd5e2" opacity=".9" />
      <circle cx="44" cy="46" r="3.6" fill="#ffd5e2" opacity=".9" />
      <path
        d="M16 28c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v14c0 4.4-3.6 8-8 8H24c-4.4 0-8-3.6-8-8V28Z"
        fill="url(#fl-body)" stroke="#1a0a14" strokeWidth="2.2" strokeLinejoin="round"
      />
      <rect x="10" y="32" width="6" height="10" rx="3" fill="#fff7fa" stroke="#1a0a14" strokeWidth="2" />
      <rect x="48" y="32" width="6" height="10" rx="3" fill="#fff7fa" stroke="#1a0a14" strokeWidth="2" />
      <circle cx="32" cy="13" r="2.4" fill="#e11d5c" />
      <rect x="20" y="28" width="24" height="14" rx="6" fill="url(#fl-screen)" />
      <path d="M25 36c.8-1.6 2.2-2.4 3.6-2.4s2.8.8 3.6 2.4" stroke="#7be0a6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M32.8 36c.8-1.6 2.2-2.4 3.6-2.4s2.8.8 3.6 2.4" stroke="#7be0a6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M28 47c1.4 1.6 3 2.4 4 2.4s2.6-.8 4-2.4" stroke="#1a0a14" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 16 L40 16 L37 4 Z" fill="url(#fl-hat)" stroke="#1a0a14" strokeWidth="2" strokeLinejoin="round" />
      <path d="M31 12 L39 12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M37 3.5 L37.7 5.3 L39.6 5.3 L38.1 6.4 L38.7 8.3 L37 7.1 L35.3 8.3 L35.9 6.4 L34.4 5.3 L36.3 5.3 Z" fill="#ffd5e2" />
    </svg>
  );
}

export default function FloatingAILauncher() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const params = useParams();
  const lang = params?.lang || "en";

  const [mounted, setMounted] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("salooote_v2_history");
      if (raw) {
        const arr = JSON.parse(raw);
        setHasHistory(Array.isArray(arr) && arr.length > 0);
      }
    } catch {}

    // Refresh on storage events (other tabs) and on focus (same tab updates)
    const refresh = () => {
      try {
        const raw = localStorage.getItem("salooote_v2_history");
        const arr = raw ? JSON.parse(raw) : [];
        setHasHistory(Array.isArray(arr) && arr.length > 0);
      } catch {}
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    const i = setInterval(refresh, 4000);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      clearInterval(i);
    };
  }, []);

  if (!mounted) return null;

  // Hide entirely on auth/checkout pages where it would be intrusive
  const HIDE_ON = ["/login", "/signup", "/forgot-password", "/checkout", "/payment"];
  if (HIDE_ON.some(p => pathname.includes(p))) return null;

  // On the AI page itself, the in-page pill handles things — don't double-render
  const onAIPage = pathname.includes("/newhomepage2nd");

  const open2nd = () => {
    if (onAIPage) {
      window.dispatchEvent(new Event("salooote:openChat"));
    } else {
      router.push(`/${lang}/newhomepage2nd${hasHistory ? "?continue=1" : ""}`);
    }
  };

  if (onAIPage) return null; // The page itself manages its own pill

  return (
    <>
      <style>{`
        .fal-launcher{
          position:fixed;right:22px;bottom:22px;z-index:90;
          display:inline-flex;align-items:center;gap:10px;
          padding:8px 18px 8px 8px;border-radius:999px;border:none;
          background:#fff;cursor:pointer;
          box-shadow:0 12px 32px rgba(225,29,92,.28),0 4px 12px rgba(225,29,92,.16);
          color:#1a0a14;font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.1px;
          transition:all .22s cubic-bezier(.2,.8,.2,1);
          animation:fal-in .35s cubic-bezier(.2,.8,.2,1);
        }
        .fal-launcher:hover{transform:translateY(-2px);box-shadow:0 16px 38px rgba(225,29,92,.36)}
        .fal-pulse{
          position:absolute;inset:-4px;border-radius:999px;
          background:radial-gradient(circle,rgba(225,29,92,.22) 0%,transparent 70%);
          animation:fal-pulse 2.4s ease-in-out infinite;pointer-events:none;
        }
        .fal-mascot{
          position:relative;width:40px;height:40px;border-radius:50%;
          background:linear-gradient(135deg,#fff 0%,#ffeef4 100%);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          box-shadow:inset 0 0 0 1px rgba(225,29,92,.18);
        }
        .fal-label{position:relative;display:inline-flex;flex-direction:column;line-height:1.1;text-align:left}
        .fal-label-main{font-size:13.5px;font-weight:800;color:#1a0a14;letter-spacing:-.2px}
        .fal-label-sub{font-size:10.5px;font-weight:700;color:${PINK};letter-spacing:.4px;text-transform:uppercase;margin-top:2px}
        .fal-dot{
          position:absolute;top:6px;right:6px;width:9px;height:9px;border-radius:50%;
          background:#22c55e;border:2px solid #fff;
          animation:fal-dot 1.8s ease-in-out infinite;
        }
        @keyframes fal-in{from{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:none}}
        @keyframes fal-pulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:0;transform:scale(1.25)}}
        @keyframes fal-dot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.25);opacity:.7}}

        .fal-mini{
          position:fixed;right:22px;bottom:22px;z-index:90;
          width:60px;height:60px;border-radius:50%;border:none;
          background:linear-gradient(135deg,#fff 0%,#ffeef4 100%);
          cursor:pointer;display:flex;align-items:center;justify-content:center;
          box-shadow:0 12px 32px rgba(225,29,92,.32),0 4px 12px rgba(225,29,92,.18);
          transition:all .22s cubic-bezier(.2,.8,.2,1);
          animation:fal-in .35s cubic-bezier(.2,.8,.2,1);
        }
        .fal-mini:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 16px 40px rgba(225,29,92,.4)}

        @media (max-width:520px){
          .fal-launcher{right:14px;bottom:78px;padding:6px 14px 6px 6px}
          .fal-launcher .fal-label{display:none}
          .fal-launcher{padding:6px}
          .fal-mini{right:14px;bottom:78px;width:54px;height:54px}
        }
      `}</style>
      {hasHistory ? (
        <button
          type="button"
          onClick={open2nd}
          className="fal-launcher"
          aria-label={lang === "ru" ? "Открыть чат" : lang === "hy" ? "Բացել չատը" : "Open chat"}
        >
          <span className="fal-pulse" />
          <span className="fal-mascot">
            <MascotIcon size={32} />
            <span className="fal-dot" />
          </span>
          <span className="fal-label">
            <span className="fal-label-main">
              {lang === "ru" ? "Продолжить" : lang === "hy" ? "Շարունակել" : "Continue"}
            </span>
            <span className="fal-label-sub">Sali AI</span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={open2nd}
          className="fal-mini"
          aria-label={lang === "ru" ? "Открыть Sali AI" : lang === "hy" ? "Բացել Sali AI" : "Open Sali AI"}
          title={lang === "ru" ? "Sali AI помощник" : lang === "hy" ? "Sali AI օգնական" : "Sali AI assistant"}
        >
          <MascotIcon size={36} />
        </button>
      )}
    </>
  );
}
