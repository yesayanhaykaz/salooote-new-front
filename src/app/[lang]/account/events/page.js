"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, MapPin, Calendar, Users, Trash2, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { plannerAPI, isLoggedIn } from "@/lib/api";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    title: "My Events",
    subtitle: "All your AI-planned events in one place",
    vendorsBooked: "Vendors booked",
    continuePlanning: "Continue Planning",
    viewDetails: "View Details",
    guests: "guests",
    emptyTitle: "No events planned yet",
    emptyDesc: "Start chatting with the AI planner. It will build your event checklist, find vendors, and save everything here.",
    startPlanning: "Start Planning with AI",
    deleteConfirm: "Delete this event plan?",
  },
  hy: {
    title: "Իմ միջոցառումները",
    subtitle: "Ձեր AI-ով պլանավորած բոլոր միջոցառումները",
    vendorsBooked: "Ամրագրված",
    continuePlanning: "Շարունակել պլանավորումը",
    viewDetails: "Դիտել",
    guests: "հյուր",
    emptyTitle: "Դեռ ոչ մի միջոցառում չկա",
    emptyDesc: "Սկսեք AI-ի հետ զրույցը — կստեղծի ցուցակ, կգտնի վաճառողներ",
    startPlanning: "Սկսել AI-ի հետ",
    deleteConfirm: "Ջնջե՞լ այս պլանը:",
  },
  ru: {
    title: "Мои события",
    subtitle: "Все ваши мероприятия, спланированные ИИ",
    vendorsBooked: "Подрядчики",
    continuePlanning: "Продолжить",
    viewDetails: "Подробнее",
    guests: "гостей",
    emptyTitle: "Событий пока нет",
    emptyDesc: "Начните чат с AI-планировщиком — он составит чеклист и найдёт поставщиков.",
    startPlanning: "Начать с AI",
    deleteConfirm: "Удалить этот план?",
  },
};

// ─── Event type config ────────────────────────────────────────────────────────
const EVENT_CONFIG = {
  wedding:     { color: "#e11d5c", emoji: "💍", gradient: "from-rose-400 to-pink-600" },
  birthday:    { color: "#3b82f6", emoji: "🎂", gradient: "from-blue-400 to-indigo-500" },
  engagement:  { color: "#8b5cf6", emoji: "💜", gradient: "from-violet-400 to-purple-600" },
  christening: { color: "#7c3aed", emoji: "✝️",  gradient: "from-purple-500 to-indigo-600" },
  kids_party:  { color: "#10b981", emoji: "🎈", gradient: "from-emerald-400 to-teal-500" },
  corporate:   { color: "#475569", emoji: "🏢", gradient: "from-slate-500 to-slate-700" },
  baby_shower: { color: "#0ea5e9", emoji: "🍼", gradient: "from-sky-400 to-cyan-500" },
  graduation:  { color: "#ea580c", emoji: "🎓", gradient: "from-orange-400 to-amber-500" },
  anniversary: { color: "#d97706", emoji: "🌹", gradient: "from-amber-400 to-orange-500" },
};

function getConfig(type) {
  return EVENT_CONFIG[type] || { color: "#e11d5c", emoji: "🎉", gradient: "from-brand-500 to-pink-600" };
}

// ─── Session Card ─────────────────────────────────────────────────────────────
function SessionCard({ session, lang, t, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const cfg = getConfig(session.event_type);

  let data = {};
  try { data = typeof session.event_data === "string" ? JSON.parse(session.event_data) : session.event_data || {}; } catch {}

  const selectedCount   = Object.keys(data.selected_vendors || {}).length;
  const totalSearchable = (data.services || []).filter(s => s.canSearch).length;
  const pct = totalSearchable > 0 ? Math.round((selectedCount / totalSearchable) * 100) : 0;

  const dateStr = session.event_date
    ? new Date(session.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(t.deleteConfirm)) return;
    setDeleting(true);
    try {
      await plannerAPI.delete(session.id);
      onDelete(session.id);
    } catch { setDeleting(false); }
  };

  const eventLabel = (session.title || session.event_type?.replace(/_/g, " ") || "").trim();

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">

      {/* Visual banner header */}
      <div className={`relative h-28 bg-gradient-to-br ${cfg.gradient} flex items-center justify-center overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

        <span className="text-5xl select-none relative z-10">{cfg.emoji}</span>

        {/* Delete button */}
        <button onClick={handleDelete} disabled={deleting}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/20 hover:bg-red-500/80 flex items-center justify-center transition-colors cursor-pointer border-none backdrop-blur-sm opacity-0 group-hover:opacity-100">
          {deleting
            ? <Loader2 size={12} className="animate-spin text-white" />
            : <Trash2 size={12} className="text-white" />
          }
        </button>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title & type */}
        <p className="text-sm font-bold text-surface-900 truncate capitalize leading-tight mb-0.5">{eventLabel}</p>
        <p className="text-xs text-surface-400 capitalize mb-3">{session.event_type?.replace(/_/g, " ")}</p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {dateStr && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500 bg-surface-50 border border-surface-200 rounded-full px-2.5 py-1">
              <Calendar size={9} style={{ color: cfg.color }} /> {dateStr}
            </span>
          )}
          {session.location && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500 bg-surface-50 border border-surface-200 rounded-full px-2.5 py-1">
              <MapPin size={9} style={{ color: cfg.color }} /> {session.location}
            </span>
          )}
          {session.guest_count && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500 bg-surface-50 border border-surface-200 rounded-full px-2.5 py-1">
              <Users size={9} style={{ color: cfg.color }} /> {session.guest_count} {t.guests}
            </span>
          )}
        </div>

        {/* Vendor progress */}
        {totalSearchable > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wide">{t.vendorsBooked}</span>
              <span className="text-[11px] font-bold" style={{ color: cfg.color }}>{selectedCount}/{totalSearchable}</span>
            </div>
            <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: pct === 100 ? "#16a34a" : `linear-gradient(90deg,${cfg.color},${cfg.color}88)` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/${lang}/planner?session=${session.id}`} className="no-underline flex-1">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-all"
              style={{ background: `${cfg.color}0e`, borderColor: `${cfg.color}28`, color: cfg.color }}>
              {t.continuePlanning} <ArrowRight size={11} />
            </button>
          </Link>
          <Link href={`/${lang}/account/events/${session.id}`} className="no-underline">
            <button className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold rounded-xl border border-surface-200 text-surface-500 hover:border-surface-300 cursor-pointer bg-transparent transition-all">
              <ExternalLink size={11} /> {t.viewDetails}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ lang, t }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center py-20 text-center px-8">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-200">
        <Sparkles size={34} className="text-white" />
      </div>
      <h2 className="text-lg font-bold text-surface-900 mb-2">{t.emptyTitle}</h2>
      <p className="text-sm text-surface-400 mb-8 max-w-xs leading-relaxed">{t.emptyDesc}</p>
      <Link href={`/${lang}/planner`} className="no-underline">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-200 hover:shadow-xl hover:scale-105 cursor-pointer border-none transition-all">
          <Sparkles size={16} /> {t.startPlanning}
        </button>
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccountEventsPage() {
  const { lang } = useParams();
  const t = T[lang] || T.en;

  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { setLoading(false); return; }
    plannerAPI.list({ limit: 50 })
      .then(r => setSessions(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => setSessions(prev => prev.filter(s => s.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">{t.title}</h1>
        <p className="text-sm text-surface-400 mt-0.5">{t.subtitle}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={26} className="animate-spin text-surface-300" />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState lang={lang} t={t} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map(s => (
            <SessionCard key={s.id} session={s} lang={lang} t={t} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
