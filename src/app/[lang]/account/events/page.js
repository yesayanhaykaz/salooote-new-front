"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Bot, ArrowRight, Loader2, MapPin, Calendar, Users,
  Trash2, Sparkles, ExternalLink,
} from "lucide-react";
import { plannerAPI, isLoggedIn } from "@/lib/api";

// ─── Colour map ───────────────────────────────────────────────────────────────
const EVENT_COLORS = {
  christening: "#7c3aed", wedding: "#e11d5c", birthday: "#3b82f6",
  kids_party: "#10b981", corporate: "#475569", baby_shower: "#0ea5e9",
  engagement: "#8b5cf6", graduation: "#ea580c", anniversary: "#d97706",
};

// ─── Session Card ─────────────────────────────────────────────────────────────
function SessionCard({ session, lang, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const color = EVENT_COLORS[session.event_type] || "#e11d5c";
  let data = {};
  try { data = typeof session.event_data === "string" ? JSON.parse(session.event_data) : session.event_data || {}; } catch {}

  const selectedCount  = Object.keys(data.selected_vendors || {}).length;
  const totalSearchable = (data.services || []).filter(s => s.canSearch).length;
  const pct = totalSearchable > 0 ? Math.round((selectedCount / totalSearchable) * 100) : 0;

  const dateStr = session.event_date
    ? new Date(session.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm("Delete this event plan?")) return;
    setDeleting(true);
    try {
      await plannerAPI.delete(session.id);
      onDelete(session.id);
    } catch { setDeleting(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      {/* colour bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg,${color},${color}77)` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}14` }}>
              <Bot size={16} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-surface-900 truncate leading-tight">
                {session.title || session.event_type?.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-surface-400 capitalize mt-0.5">
                {session.event_type?.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <button onClick={handleDelete} disabled={deleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-surface-300 hover:text-red-500 border-none bg-transparent cursor-pointer flex-shrink-0">
            {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          </button>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {dateStr && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500 bg-surface-50 border border-surface-200 rounded-full px-2.5 py-1">
              <Calendar size={9} /> {dateStr}
            </span>
          )}
          {session.location && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500 bg-surface-50 border border-surface-200 rounded-full px-2.5 py-1">
              <MapPin size={9} /> {session.location}
            </span>
          )}
          {session.guest_count && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500 bg-surface-50 border border-surface-200 rounded-full px-2.5 py-1">
              <Users size={9} /> {session.guest_count} guests
            </span>
          )}
        </div>

        {/* Vendor progress */}
        {totalSearchable > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wide">Vendors booked</span>
              <span className="text-[11px] font-bold text-surface-600">{selectedCount}/{totalSearchable}</span>
            </div>
            <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: pct === 100 ? "#16a34a" : `linear-gradient(90deg,${color},${color}88)` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/${lang}/planner?session=${session.id}`} className="no-underline flex-1">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-all"
              style={{ background: `${color}0e`, borderColor: `${color}28`, color }}>
              Continue Planning <ArrowRight size={11} />
            </button>
          </Link>
          <Link href={`/${lang}/account/events/${session.id}`} className="no-underline">
            <button className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold rounded-xl border border-surface-200 text-surface-500 hover:border-surface-300 cursor-pointer bg-transparent transition-all">
              <ExternalLink size={11} /> View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ lang }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-200">
        <Bot size={34} className="text-white" />
      </div>
      <h2 className="text-xl font-bold text-surface-900 mb-2">No events planned yet</h2>
      <p className="text-sm text-surface-400 mb-8 max-w-xs leading-relaxed">
        Start chatting with the AI planner. It will build your complete event checklist, find vendors, and save everything here.
      </p>
      <Link href={`/${lang}/planner`} className="no-underline">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-200 hover:shadow-xl hover:scale-105 cursor-pointer border-none transition-all">
          <Sparkles size={16} /> Start Planning with AI
        </button>
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccountEventsPage() {
  const params = useParams();
  const lang   = params?.lang || "en";

  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { setLoading(false); return; }
    plannerAPI.list({ limit: 50 })
      .then(res => setSessions(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => setSessions(prev => prev.filter(s => s.id !== id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 leading-tight">My Events</h1>
          <p className="text-sm text-surface-400 mt-1">All your AI-planned events in one place</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-surface-300" />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState lang={lang} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map(s => (
            <SessionCard key={s.id} session={s} lang={lang} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
