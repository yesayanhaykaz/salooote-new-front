"use client";
import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { MessageSquare, Plus, X, Send, Clock, AlertCircle } from "lucide-react";

const STATUS_STYLES = {
  new:       "bg-blue-50   text-blue-600   border-blue-200",
  replied:   "bg-violet-50 text-violet-600 border-violet-200",
  confirmed: "bg-green-50  text-green-600  border-green-200",
  cancelled: "bg-red-50    text-red-500    border-red-200",
  closed:    "bg-surface-100 text-surface-500 border-surface-200",
};

const TABS = ["All", "New", "Replied", "Confirmed", "Cancelled", "Closed"];

function Badge({ status }) {
  const cls = STATUS_STYLES[status?.toLowerCase()] || "bg-surface-100 text-surface-500 border-surface-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}>
      {status || "new"}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const h = diff / 3600000;
  if (h < 1)  return `${Math.floor(diff / 60000)}m ago`;
  if (h < 24) return `${Math.floor(h)}h ago`;
  if (h < 48) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function NewMessageModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    vendor_id: "", subject: "", message: "",
    event_type: "", event_date: "", guest_count: "", budget: "", currency: "AMD",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.vendor_id.trim()) { setError("Vendor ID is required."); return; }
    if (!form.subject.trim())   { setError("Subject is required."); return; }
    if (!form.message.trim())   { setError("Message is required."); return; }
    setSaving(true);
    try {
      const payload = { vendor_id: form.vendor_id.trim(), subject: form.subject.trim(), message: form.message.trim() };
      if (form.event_type)  payload.event_type  = form.event_type;
      if (form.event_date)  payload.event_date  = form.event_date;
      if (form.guest_count) payload.guest_count = parseInt(form.guest_count);
      if (form.budget)      { payload.budget = parseFloat(form.budget); payload.currency = form.currency; }
      const res = await userAPI.createInquiry(payload);
      onCreated(res?.data || res);
    } catch (err) { setError(err.message || "Failed to send message."); }
    finally { setSaving(false); }
  }

  const inputCls = "w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-sm font-bold text-surface-900">New Message to Vendor</h2>
            <p className="text-xs text-surface-400 mt-0.5">Send an inquiry to start a conversation</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={15} className="text-surface-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Vendor ID *</label>
            <input name="vendor_id" value={form.vendor_id} onChange={set} placeholder="Paste vendor UUID" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Subject *</label>
            <input name="subject" value={form.subject} onChange={set} placeholder="What is this about?" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Message *</label>
            <textarea name="message" value={form.message} onChange={set} rows={4}
              placeholder="Describe what you need, when your event is, any special requirements…"
              className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Type</label>
              <input name="event_type" value={form.event_type} onChange={set} placeholder="Wedding, Birthday…" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Date</label>
              <input type="date" name="event_date" value={form.event_date} onChange={set} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Guest Count</label>
              <input type="number" name="guest_count" value={form.guest_count} onChange={set} placeholder="e.g. 100" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Budget</label>
              <div className="flex gap-2">
                <input type="number" name="budget" value={form.budget} onChange={set} placeholder="50000"
                  className="flex-1 px-3 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all" />
                <select name="currency" value={form.currency} onChange={set}
                  className="px-2 py-2.5 text-sm border border-surface-200 rounded-xl outline-none bg-white focus:border-brand-400">
                  <option value="AMD">AMD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertCircle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
              <Send size={14} /> {saving ? "Sending…" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountMessagesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setTab]       = useState("All");
  const [showModal, setModal]     = useState(false);
  const [selected,  setSelected]  = useState(null);

  useEffect(() => {
    userAPI.inquiries({ limit: 50 })
      .then(res => setInquiries(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "All"
    ? inquiries
    : inquiries.filter(i => i.status?.toLowerCase() === activeTab.toLowerCase());

  const handleCreated = (inq) => { if (inq?.id) { setInquiries(p => [inq, ...p]); setSelected(inq); } setModal(false); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Messages</h1>
          <p className="text-sm text-surface-400 mt-0.5">Your conversations with vendors</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
          <Plus size={15} /> New Message
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-xl px-2 py-1.5 w-fit overflow-x-auto shadow-sm">
        {TABS.map(tab => {
          const count = tab === "All" ? inquiries.length : inquiries.filter(i => i.status?.toLowerCase() === tab.toLowerCase()).length;
          return (
            <button key={tab} onClick={() => setTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 cursor-pointer border-none transition-colors ${
                activeTab === tab ? "bg-brand-600 text-white" : "text-surface-500 hover:bg-surface-100 bg-transparent"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20 text-white" : "bg-surface-100 text-surface-500"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <MessageSquare size={28} className="text-blue-300" />
          </div>
          <p className="font-semibold text-surface-700 text-base">No messages yet</p>
          <p className="text-sm text-surface-400 mt-1 mb-5">
            {activeTab === "All" ? "Send a message to a vendor to start a conversation." : `No ${activeTab.toLowerCase()} messages.`}
          </p>
          {activeTab === "All" && (
            <button onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
              <Plus size={14} /> Send First Message
            </button>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(inq => {
            const isSelected = selected?.id === inq.id;
            return (
              <div key={inq.id}>
                {/* Thread row */}
                <div
                  onClick={() => setSelected(isSelected ? null : inq)}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer ${isSelected ? "border-brand-300 shadow-md" : "border-surface-200 shadow-sm hover:border-surface-300"}`}
                >
                  <div className="p-4 flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
                      {inq.vendor_id?.slice(-4).toUpperCase() || "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-surface-900 truncate">{inq.subject || "(No subject)"}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge status={inq.status} />
                        </div>
                      </div>
                      <p className="text-xs text-surface-500 mt-0.5 truncate">{inq.message}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-surface-400 flex items-center gap-1">
                          <Clock size={10} /> {formatDate(inq.created_at)}
                        </span>
                        {inq.event_type && (
                          <span className="text-[11px] text-brand-500 font-medium">{inq.event_type}</span>
                        )}
                        {inq.budget && (
                          <span className="text-[11px] text-surface-400">{inq.currency} {inq.budget}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded thread view */}
                  {isSelected && (
                    <div className="border-t border-surface-100 px-5 py-4 bg-surface-50 rounded-b-2xl">
                      <div className="flex justify-end mb-3">
                        {/* User's message bubble */}
                        <div className="max-w-[80%]">
                          <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                            {inq.message}
                          </div>
                          <p className="text-[11px] text-surface-400 mt-1 text-right">{formatDate(inq.created_at)}</p>
                        </div>
                      </div>

                      {/* Event details row */}
                      {(inq.event_type || inq.event_date || inq.guest_count || inq.budget) && (
                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                          {inq.event_type  && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">📅 {inq.event_type}</span>}
                          {inq.event_date  && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">🗓 {inq.event_date?.slice(0, 10)}</span>}
                          {inq.guest_count && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">👥 {inq.guest_count} guests</span>}
                          {inq.budget      && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">💰 {inq.currency} {inq.budget}</span>}
                        </div>
                      )}

                      {/* Awaiting reply */}
                      {inq.status === "new" && (
                        <div className="flex items-center gap-2 text-xs text-surface-400 mt-2">
                          <div className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          Waiting for vendor reply…
                        </div>
                      )}

                      {inq.status !== "new" && (
                        <p className="text-xs text-center text-surface-400 mt-2">
                          Vendor responded — status: <span className="font-semibold capitalize">{inq.status}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && <NewMessageModal onClose={() => setModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
