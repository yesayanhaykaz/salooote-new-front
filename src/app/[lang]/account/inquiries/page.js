"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { userAPI } from "@/lib/api";
import { MessageSquare, Plus, X, Clock, Send, AlertCircle } from "lucide-react";

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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${cls}`}>
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

function NewInquiryModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ vendor_id: "", subject: "", message: "", event_type: "", event_date: "", guest_count: "", budget: "", currency: "AMD" });
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
    } catch (err) { setError(err.message || "Failed to send inquiry."); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-sm font-bold text-surface-900">New Inquiry</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={15} className="text-surface-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Vendor ID *</label>
            <input name="vendor_id" value={form.vendor_id} onChange={set} placeholder="Paste vendor UUID"
              className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Subject *</label>
            <input name="subject" value={form.subject} onChange={set} placeholder="What is this about?"
              className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Message *</label>
            <textarea name="message" value={form.message} onChange={set} rows={3} placeholder="Describe what you need…"
              className="w-full resize-none px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Type</label>
              <input name="event_type" value={form.event_type} onChange={set} placeholder="Wedding, Birthday…"
                className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Date</label>
              <input type="date" name="event_date" value={form.event_date} onChange={set}
                className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Guest Count</label>
              <input type="number" name="guest_count" value={form.guest_count} onChange={set} placeholder="e.g. 100"
                className="w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all" />
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
              <Send size={14} /> {saving ? "Sending…" : "Send Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountInquiriesPage() {
  const { lang } = useParams();
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setTab]       = useState("All");
  const [showModal, setModal]     = useState(false);

  useEffect(() => {
    userAPI.inquiries({ limit: 50 })
      .then(res => setInquiries(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "All"
    ? inquiries
    : inquiries.filter(i => i.status?.toLowerCase() === activeTab.toLowerCase());

  const handleCreated = (inq) => { if (inq?.id) setInquiries(p => [inq, ...p]); setModal(false); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">My Inquiries</h1>
          <p className="text-sm text-surface-400 mt-0.5">Track your vendor conversations</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
          <Plus size={15} /> New Inquiry
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-xl px-2 py-1.5 w-fit overflow-x-auto">
        {TABS.map(tab => {
          const count = tab === "All" ? inquiries.length : inquiries.filter(i => i.status?.toLowerCase() === tab.toLowerCase()).length;
          return (
            <button key={tab} onClick={() => setTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer border-none ${
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
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <MessageSquare size={24} className="text-blue-300" />
          </div>
          <p className="font-semibold text-surface-700">No inquiries yet</p>
          <p className="text-sm text-surface-400 mt-1 mb-4">
            {activeTab === "All" ? "Send an inquiry to a vendor to get started." : `No ${activeTab.toLowerCase()} inquiries.`}
          </p>
          {activeTab === "All" && (
            <button onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
              <Plus size={14} /> Send First Inquiry
            </button>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 hover:border-surface-300 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
                    {inq.vendor_id?.slice(-4).toUpperCase() || "??"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{inq.subject || "(No subject)"}</p>
                    <p className="text-xs text-surface-400 mt-0.5">Vendor: ···{inq.vendor_id?.slice(-8) || "—"}</p>
                    {inq.message && <p className="text-xs text-surface-500 mt-1.5 line-clamp-2">{inq.message}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Badge status={inq.status} />
                  <div className="flex items-center gap-1 text-[11px] text-surface-400">
                    <Clock size={10} /> {formatDate(inq.created_at)}
                  </div>
                </div>
              </div>

              {(inq.event_type || inq.event_date || inq.budget) && (
                <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-surface-50">
                  {inq.event_type && <span className="text-xs text-surface-500"><span className="font-semibold text-surface-700">Event:</span> {inq.event_type}</span>}
                  {inq.event_date && <span className="text-xs text-surface-500"><span className="font-semibold text-surface-700">Date:</span> {inq.event_date?.slice(0, 10)}</span>}
                  {inq.budget    && <span className="text-xs text-surface-500"><span className="font-semibold text-surface-700">Budget:</span> {inq.currency || ""} {inq.budget}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && <NewInquiryModal onClose={() => setModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
