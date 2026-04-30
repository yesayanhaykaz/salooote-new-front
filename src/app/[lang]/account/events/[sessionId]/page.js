"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Loader2, Calendar, MapPin, Users, DollarSign,
  CheckCircle2, Clock, XCircle, Send, MessageCircle, ChevronDown,
  ChevronUp, Building2, Camera, Cake, UtensilsCrossed, Flower2,
  Music, Gem, Star, Smile, Briefcase, GraduationCap, Baby,
  Monitor, Package, Flame, Plus, User, Mic, X,
} from "lucide-react";
import { plannerAPI, inquiriesAPI } from "@/lib/api";

// ─── Colours ──────────────────────────────────────────────────────────────────
const EVENT_COLORS = {
  christening: "#7c3aed", wedding: "#e11d5c", birthday: "#3b82f6",
  kids_party: "#10b981", corporate: "#475569", baby_shower: "#0ea5e9",
  engagement: "#8b5cf6", graduation: "#ea580c", anniversary: "#d97706",
};

const SERVICE_ICON_MAP = {
  church: Building2, baptism_candle: Flame, cross: Plus,
  kavor: User, kavork: User, baby_outfit: Package,
  venue: Building2, catering: UtensilsCrossed, cake: Cake,
  wedding_cake: Cake, photographer: Camera, videographer: Camera,
  decoration: Flower2, balloon_decoration: Flower2,
  flowers: Flower2, music: Music, tamada: Mic, wedding_rings: Gem,
  ring: Gem, bridal_dress: Gem, ceremony_venue: Building2,
  reception_venue: Building2, av_tech: Monitor,
  entertainment: Music, animator: Smile,
};
const getServiceIcon = (type) => SERVICE_ICON_MAP[type] || Star;

const STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "#d97706", bg: "#fef3c7", icon: Clock },
  accepted: { label: "Accepted", color: "#16a34a", bg: "#dcfce7", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2", icon: XCircle },
  closed:   { label: "Closed",   color: "#64748b", bg: "#f1f5f9", icon: XCircle },
};

// ─── Message Thread ───────────────────────────────────────────────────────────
function MessageThread({ inquiry, onClose }) {
  const [messages, setMessages]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [input,    setInput]      = useState("");
  const [sending,  setSending]    = useState(false);
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await inquiriesAPI.getMessages(inquiry.id);
      setMessages(res?.data || res || []);
    } catch {}
    setLoading(false);
  }, [inquiry.id]);

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    try {
      await inquiriesAPI.sendMessage(inquiry.id, text);
      await fetchMessages();
    } catch {}
    setSending(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 24, pointerEvents: "none" }}>
      <div style={{ pointerEvents: "all", width: "100%", maxWidth: 420, background: "#fff", borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", maxHeight: "70vh", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(15,23,42,0.08)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {inquiry.vendor_name || "Vendor"}
            </p>
            <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>{inquiry.subject}</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "#64748b" }}>
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 24 }}><Loader2 size={20} color="#94a3b8" className="animate-spin" /></div>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8rem", margin: "auto 0" }}>No messages yet. The vendor will reply soon.</p>
          ) : messages.map(msg => {
            const isUser = msg.sender_role === "user";
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "8px 12px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: isUser ? "linear-gradient(135deg,#e11d5c,#7c3aed)" : "#f1f5f9",
                  color: isUser ? "#fff" : "#0f172a", fontSize: "0.82rem", lineHeight: 1.5,
                }}>
                  {msg.body}
                  <p style={{ margin: "4px 0 0", fontSize: "0.65rem", opacity: 0.7, textAlign: "right" }}>
                    {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(15,23,42,0.08)", display: "flex", gap: 8, flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message…"
            style={{ flex: 1, border: "1px solid rgba(15,23,42,0.12)", borderRadius: 10, padding: "8px 12px", fontSize: "0.82rem", outline: "none", fontFamily: "inherit" }}
          />
          <button onClick={handleSend} disabled={sending || !input.trim()}
            style={{ background: input.trim() ? "linear-gradient(135deg,#e11d5c,#7c3aed)" : "rgba(15,23,42,0.07)", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default" }}>
            {sending ? <Loader2 size={14} color="#fff" /> : <Send size={14} color={input.trim() ? "#fff" : "#94a3b8"} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vendor Service Row ───────────────────────────────────────────────────────
function VendorRow({ service, vendor, inquiry, accent, onOpenThread }) {
  const Icon = getServiceIcon(service.service_type);
  const status = inquiry ? STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.pending : null;
  const StatusIcon = status?.icon || Clock;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#fff", borderRadius: 14, border: "1px solid rgba(15,23,42,0.07)", marginBottom: 8 }}>
      {/* Icon */}
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} color={accent} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem", color: "#0f172a" }}>{service.title}</p>
        {vendor ? (
          <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#64748b" }}>
            {vendor.name || vendor.business_name}
            {vendor.city ? ` · ${vendor.city}` : ""}
            {vendor.rating ? ` · ★ ${vendor.rating}` : ""}
          </p>
        ) : (
          <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#94a3b8" }}>No vendor selected</p>
        )}
      </div>

      {/* Status & action */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {status && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 700, color: status.color, background: status.bg, borderRadius: 999, padding: "3px 9px" }}>
            <StatusIcon size={10} /> {status.label}
          </span>
        )}
        {inquiry && (
          <button onClick={() => onOpenThread(inquiry)}
            style={{ background: "transparent", border: "1px solid rgba(15,23,42,0.12)", borderRadius: 8, padding: "5px 10px", fontSize: "0.72rem", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
            <MessageCircle size={11} /> Chat
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ selected, total, accent }) {
  const pct = total > 0 ? Math.round((selected / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>Vendors confirmed</span>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>{selected}/{total}</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 999, transition: "width 0.5s", width: `${pct}%`, background: pct === 100 ? "#16a34a" : `linear-gradient(90deg,${accent},${accent}88)` }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const params    = useParams();
  const lang      = params?.lang || "en";
  const sessionId = params?.sessionId;

  const [session,   setSession]   = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeThread, setActiveThread] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    plannerAPI.getById(sessionId)
      .then(res => setSession(res?.data || res))
      .catch(() => {})
      .finally(() => setLoading(false));
    plannerAPI.getInquiries(sessionId)
      .then(res => setInquiries(res?.data || res || []))
      .catch(() => setInquiries([]));
  }, [sessionId]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <Loader2 size={28} color="#94a3b8" className="animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <p style={{ color: "#64748b", marginBottom: 16 }}>Event not found.</p>
        <Link href={`/${lang}/account/events`} className="no-underline">
          <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl cursor-pointer border-none">
            Back to Events
          </button>
        </Link>
      </div>
    );
  }

  const data   = session.event_data || {};
  const accent = EVENT_COLORS[session.event_type] || "#e11d5c";
  const services = data.services || [];
  const selectedVendors = data.selected_vendors || {};
  const searchable = services.filter(s => s.canSearch);
  const selectedCount = Object.keys(selectedVendors).length;

  const dateStr = session.event_date
    ? new Date(session.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  // Build a lookup: vendor_id → inquiry
  const inquiryByVendorId = {};
  for (const inq of inquiries) {
    if (inq.vendor_id) inquiryByVendorId[inq.vendor_id] = inq;
  }

  // Group services by category
  const grouped = {};
  for (const s of services) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }
  const CATEGORY_LABELS = {
    religious: "Religious", roles: "Key Roles", clothing: "Attire",
    ceremony: "Ceremony", reception: "Reception", celebration: "Celebration",
    food: "Food & Cake", decoration: "Decorations", media: "Photo & Video",
    entertainment: "Entertainment", attire: "Attire", venue: "Venue",
    tech: "Tech & AV", other: "Other",
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px 64px" }}>
      {/* Back link */}
      <Link href={`/${lang}/account/events`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", marginBottom: 24 }}>
        <ArrowLeft size={14} /> My Events
      </Link>

      {/* Event header card */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(15,23,42,0.07)", overflow: "hidden", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ height: 6, background: `linear-gradient(90deg,${accent},${accent}77)` }} />
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ margin: "0 0 4px", fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
                {session.title || session.event_type?.replace(/_/g, " ")}
              </h1>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b", textTransform: "capitalize" }}>
                {session.event_type?.replace(/_/g, " ")}
              </p>
            </div>
            <Link href={`/${lang}/planner?session=${session.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
              <button style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, border: "none", borderRadius: 12, padding: "9px 16px", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Continue Planning
              </button>
            </Link>
          </div>

          {/* Meta chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {dateStr && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#475569", background: "#f8fafc", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 999, padding: "5px 12px" }}>
                <Calendar size={12} color={accent} /> {dateStr}
              </span>
            )}
            {session.location && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#475569", background: "#f8fafc", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 999, padding: "5px 12px" }}>
                <MapPin size={12} color={accent} /> {session.location}
              </span>
            )}
            {session.guest_count && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#475569", background: "#f8fafc", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 999, padding: "5px 12px" }}>
                <Users size={12} color={accent} /> {session.guest_count} guests
              </span>
            )}
            {data.budget?.description && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#475569", background: "#f8fafc", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 999, padding: "5px 12px" }}>
                <DollarSign size={12} color={accent} /> {data.budget.description}
              </span>
            )}
          </div>

          {/* Progress */}
          {searchable.length > 0 && (
            <ProgressBar selected={selectedCount} total={searchable.length} accent={accent} />
          )}
        </div>
      </div>

      {/* Services grid by category */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {CATEGORY_LABELS[cat] || cat}
          </h2>
          {items.map(service => {
            const vendor = selectedVendors[service.service_type] || null;
            const inquiry = vendor?.id ? inquiryByVendorId[vendor.id] : null;
            return (
              <VendorRow
                key={service.service_type}
                service={service}
                vendor={vendor}
                inquiry={inquiry}
                accent={accent}
                onOpenThread={setActiveThread}
              />
            );
          })}
        </div>
      ))}

      {/* Inquiry overview (if any exist but not matched to selected vendor) */}
      {inquiries.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            All Vendor Inquiries ({inquiries.length})
          </h2>
          {inquiries.map(inq => {
            const status = STATUS_CONFIG[inq.status] || STATUS_CONFIG.pending;
            const StatusIcon = status.icon;
            return (
              <div key={inq.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#fff", borderRadius: 14, border: "1px solid rgba(15,23,42,0.07)", marginBottom: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem", color: "#0f172a" }}>{inq.vendor_name || "Vendor"}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{inq.subject}</p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 700, color: status.color, background: status.bg, borderRadius: 999, padding: "3px 9px", flexShrink: 0 }}>
                  <StatusIcon size={10} /> {status.label}
                </span>
                <button onClick={() => setActiveThread(inq)}
                  style={{ background: "transparent", border: "1px solid rgba(15,23,42,0.12)", borderRadius: 8, padding: "5px 10px", fontSize: "0.72rem", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", flexShrink: 0 }}>
                  <MessageCircle size={11} /> Chat
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating message thread */}
      {activeThread && (
        <MessageThread inquiry={activeThread} onClose={() => setActiveThread(null)} />
      )}
    </div>
  );
}
