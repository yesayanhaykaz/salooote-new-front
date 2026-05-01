"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { userAPI, vendorsAPI, inquiriesAPI } from "@/lib/api";
import {
  MessageSquare, Plus, X, Send, Search, Store,
  ChevronLeft, Loader2, AlertCircle, Clock,
} from "lucide-react";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    title: "Messages",
    subtitle: "Your conversations with vendors",
    newMessage: "New",
    searchConvs: "Search conversations…",
    selectConv: "Select a conversation",
    selectConvDesc: "Choose a vendor from the list to view the thread.",
    noMessages: "No messages yet",
    noMessagesDesc: "Send a message to a vendor to start a conversation.",
    startFirst: "Start a Conversation",
    noFiltered: "No conversations match this filter.",
    typeHere: "Type a message…",
    vendorWillReply: "No messages yet — the vendor will reply soon.",
    tabs: { All: "All", New: "New", Replied: "Replied", Confirmed: "Confirmed", Cancelled: "Cancelled", Closed: "Closed" },
    modal: {
      title: "New Message",
      subtitle: "Select a vendor",
      search: "Search vendors…",
      step2: "Compose Message",
      subject: "Subject *",
      subjectPh: "What is this about?",
      message: "Message *",
      messagePh: "Describe your needs, event date, any requirements…",
      eventType: "Event Type",
      eventTypePh: "Wedding, Birthday…",
      eventDate: "Event Date",
      guests: "Guest Count",
      budget: "Budget",
      cancel: "Cancel",
      back: "Back",
      send: "Send",
      sending: "Sending…",
      noVendors: "No vendors found",
      loadingVendors: "Loading vendors…",
    },
  },
  hy: {
    title: "Հաղորդագրություններ",
    subtitle: "Ձեր զրույցները վաճառողների հետ",
    newMessage: "Նոր",
    searchConvs: "Փնտրել…",
    selectConv: "Ընտրեք զրույց",
    selectConvDesc: "Ձախ ցուցակից ընտրեք վաճառողի հետ զրույցը",
    noMessages: "Հաղորդագրություններ չկան",
    noMessagesDesc: "Ուղարկեք հաղորդագրություն վաճառողին",
    startFirst: "Սկսել զրույց",
    noFiltered: "Ֆիլտրին համապատասխան զրույցներ չկան",
    typeHere: "Գրեք հաղորդագրություն…",
    vendorWillReply: "Հաղորդագրություններ չկան — վաճառողը շուտով կպատասխանի",
    tabs: { All: "Բոլորը", New: "Նոր", Replied: "Պատ.", Confirmed: "Հաստ.", Cancelled: "Չեղ.", Closed: "Փակ." },
    modal: {
      title: "Նոր հաղորդագրություն",
      subtitle: "Ընտրեք վաճառող",
      search: "Փնտրել վաճառողներ…",
      step2: "Հաղորդագրություն",
      subject: "Թեմա *",
      subjectPh: "Ինչի մասին է",
      message: "Հաղորդագրություն *",
      messagePh: "Նկարագրեք ձեր կարիքները…",
      eventType: "Միջոցառման տեսակ",
      eventTypePh: "Հարսանիք, ծննդյան օր…",
      eventDate: "Ամսաթիվ",
      guests: "Հյուրերի թիվ",
      budget: "Բյուջե",
      cancel: "Չեղարկել",
      back: "Հետ",
      send: "Ուղարկել",
      sending: "Ուղարկվում է…",
      noVendors: "Վաճառողներ չեն գտնվել",
      loadingVendors: "Բեռնվում է…",
    },
  },
  ru: {
    title: "Сообщения",
    subtitle: "Ваши диалоги с поставщиками",
    newMessage: "Новый",
    searchConvs: "Поиск диалогов…",
    selectConv: "Выберите диалог",
    selectConvDesc: "Выберите поставщика из списка слева.",
    noMessages: "Сообщений пока нет",
    noMessagesDesc: "Напишите поставщику, чтобы начать.",
    startFirst: "Начать диалог",
    noFiltered: "Диалоги не найдены.",
    typeHere: "Введите сообщение…",
    vendorWillReply: "Сообщений нет — поставщик ответит вам скоро.",
    tabs: { All: "Все", New: "Новые", Replied: "Ответ", Confirmed: "Подтв.", Cancelled: "Отмен.", Closed: "Закр." },
    modal: {
      title: "Новое сообщение",
      subtitle: "Выберите поставщика",
      search: "Поиск поставщиков…",
      step2: "Написать сообщение",
      subject: "Тема *",
      subjectPh: "О чём сообщение?",
      message: "Сообщение *",
      messagePh: "Опишите ваши требования…",
      eventType: "Тип события",
      eventTypePh: "Свадьба, День рождения…",
      eventDate: "Дата события",
      guests: "Кол-во гостей",
      budget: "Бюджет",
      cancel: "Отмена",
      back: "Назад",
      send: "Отправить",
      sending: "Отправка…",
      noVendors: "Поставщики не найдены",
      loadingVendors: "Загрузка…",
    },
  },
};

const STATUS_STYLES = {
  new:       "bg-blue-50 text-blue-600 border-blue-200",
  replied:   "bg-violet-50 text-violet-600 border-violet-200",
  confirmed: "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  closed:    "bg-surface-100 text-surface-500 border-surface-200",
};

const TABS = ["All", "New", "Replied", "Confirmed", "Cancelled", "Closed"];

const AVATAR_PALETTE = ["#e11d5c","#7c3aed","#0891b2","#059669","#d97706","#6366f1","#0284c7","#16a34a"];

function vendorInitials(name) {
  if (!name) return "V";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function avatarColor(name) {
  if (!name) return AVATAR_PALETTE[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[Math.abs(h)];
}

function VendorAvatar({ name, image, size = 40 }) {
  const col = avatarColor(name);
  const initials = vendorInitials(name);
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, flexShrink: 0, overflow: "hidden",
      background: image ? "#f8fafc" : `${col}18`, border: "1px solid rgba(15,23,42,0.07)",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {image
        ? <img src={image} alt={name || "Vendor"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontWeight: 800, fontSize: size * 0.38, color: col, fontFamily: "inherit" }}>{initials}</span>
      }
    </div>
  );
}

function Badge({ status }) {
  const cls = STATUS_STYLES[status?.toLowerCase()] || "bg-surface-100 text-surface-500 border-surface-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${cls}`}>
      {status || "new"}
    </span>
  );
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const h = diff / 3600000;
  if (h < 1)  return `${Math.floor(diff / 60000)}m`;
  if (h < 24) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (h < 48) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── New Message Modal ────────────────────────────────────────────────────────
function NewMessageModal({ lang, onClose, onCreated }) {
  const m = (T[lang] || T.en).modal;
  const [step,     setStep]   = useState(1);
  const [vendors,  setVends]  = useState([]);
  const [vLoad,    setVLoad]  = useState(true);
  const [search,   setSearch] = useState("");
  const [selected, setSel]    = useState(null);
  const [form,     setForm]   = useState({ subject: "", message: "", event_type: "", event_date: "", guest_count: "", budget: "", currency: "AMD" });
  const [saving,   setSaving] = useState(false);
  const [error,    setError]  = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    vendorsAPI.list({ limit: 50 })
      .then(r => setVends(r?.data || []))
      .catch(() => {})
      .finally(() => setVLoad(false));
    setTimeout(() => searchRef.current?.focus(), 80);
  }, []);

  const list = vendors.filter(v => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (v.business_name || v.name || "").toLowerCase().includes(q)
        || (v.city || "").toLowerCase().includes(q);
  });

  const set = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  async function submit(e) {
    e.preventDefault();
    if (!selected)            { setError("Please select a vendor."); return; }
    if (!form.subject.trim()) { setError("Subject is required."); return; }
    if (!form.message.trim()) { setError("Message is required."); return; }
    setSaving(true);
    try {
      const payload = { vendor_id: selected.id, subject: form.subject.trim(), message: form.message.trim() };
      if (form.event_type)  payload.event_type  = form.event_type;
      if (form.event_date)  payload.event_date  = form.event_date;
      if (form.guest_count) payload.guest_count = parseInt(form.guest_count);
      if (form.budget)      { payload.budget = parseFloat(form.budget); payload.currency = form.currency; }
      const res = await userAPI.createInquiry(payload);
      onCreated(res?.data || res);
    } catch (err) { setError(err.message || "Failed to send."); }
    finally { setSaving(false); }
  }

  const inp = "w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => { setStep(1); setError(""); }}
                className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
                <ChevronLeft size={16} className="text-surface-500" />
              </button>
            )}
            <div>
              <p className="text-sm font-bold text-surface-900">{step === 1 ? m.title : m.step2}</p>
              <p className="text-xs text-surface-400 mt-0.5">
                {step === 1 ? m.subtitle : (selected?.business_name || selected?.name || "")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={15} className="text-surface-500" />
          </button>
        </div>

        {/* Step 1 — vendor picker */}
        {step === 1 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-100">
              <div className="relative">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={m.search}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 py-1">
              {vLoad ? (
                <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-surface-300" /></div>
              ) : list.length === 0 ? (
                <p className="text-center text-sm text-surface-400 py-10">{m.noVendors}</p>
              ) : list.map(v => (
                <button key={v.id} onClick={() => { setSel(v); setStep(2); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-50 transition-colors text-left border-none bg-transparent cursor-pointer">
                  <VendorAvatar name={v.business_name || v.name} image={v.cover_image_url || v.avatar_url} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">{v.business_name || v.name || "Vendor"}</p>
                    <p className="text-xs text-surface-400 truncate">{[v.city, v.category].filter(Boolean).join(" · ")}</p>
                  </div>
                  <Store size={13} className="text-surface-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — compose */}
        {step === 2 && (
          <form onSubmit={submit} className="overflow-y-auto flex-1 p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.subject}</label>
              <input name="subject" value={form.subject} onChange={set} placeholder={m.subjectPh} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.message}</label>
              <textarea name="message" value={form.message} onChange={set} rows={4}
                placeholder={m.messagePh} className={`${inp} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.eventType}</label>
                <input name="event_type" value={form.event_type} onChange={set} placeholder={m.eventTypePh} className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.eventDate}</label>
                <input type="date" name="event_date" value={form.event_date} onChange={set} className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.guests}</label>
                <input type="number" name="guest_count" value={form.guest_count} onChange={set} placeholder="e.g. 100" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.budget}</label>
                <div className="flex gap-2">
                  <input type="number" name="budget" value={form.budget} onChange={set} placeholder="50000"
                    className="flex-1 px-3 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 transition-all" />
                  <select name="currency" value={form.currency} onChange={set}
                    className="px-2 py-2.5 text-sm border border-surface-200 rounded-xl outline-none bg-white focus:border-brand-400">
                    <option value="AMD">֏</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
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
                {m.cancel}
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
                <Send size={14} /> {saving ? m.sending : m.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Chat panel ───────────────────────────────────────────────────────────────
function ChatPanel({ inquiry, lang, onBack }) {
  const t = T[lang] || T.en;
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [input,    setInput]    = useState("");
  const [sending,  setSending]  = useState(false);
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
    setLoading(true);
    setMessages([]);
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

  const vendorName = inquiry.vendor_name || inquiry.subject?.split(" ")[0] || "Vendor";
  const vendorImage = inquiry.vendor_logo || inquiry.vendor_image || null;

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex-shrink-0 px-5 py-3.5 border-b border-surface-100 bg-white flex items-center gap-3">
        {/* Back button on mobile */}
        <button onClick={onBack}
          className="md:hidden w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent flex-shrink-0">
          <ChevronLeft size={18} className="text-surface-500" />
        </button>
        <VendorAvatar name={vendorName} image={vendorImage} size={38} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-surface-900 truncate">{vendorName}</p>
          {inquiry.subject && (
            <p className="text-xs text-surface-400 truncate">{inquiry.subject}</p>
          )}
        </div>
        <Badge status={inquiry.status} />
      </div>

      {/* Event chips (if any) */}
      {(inquiry.event_type || inquiry.event_date || inquiry.guest_count || inquiry.budget) && (
        <div className="flex-shrink-0 px-5 py-2.5 border-b border-surface-100 bg-surface-50 flex flex-wrap gap-2">
          {inquiry.event_type  && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">📅 {inquiry.event_type}</span>}
          {inquiry.event_date  && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">🗓 {inquiry.event_date?.slice(0, 10)}</span>}
          {inquiry.guest_count && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">👥 {inquiry.guest_count}</span>}
          {inquiry.budget      && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">💰 {inquiry.currency || "AMD"} {inquiry.budget}</span>}
        </div>
      )}

      {/* Message bubbles */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-surface-50">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={22} className="animate-spin text-surface-300" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-white border border-surface-200 flex items-center justify-center mb-3 shadow-sm">
              <MessageSquare size={20} className="text-surface-300" />
            </div>
            <p className="text-sm text-surface-400">{t.vendorWillReply}</p>
          </div>
        ) : (
          messages.map(msg => {
            const isUser = msg.sender_role === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="mr-2 flex-shrink-0 self-end mb-1">
                    <VendorAvatar name={vendorName} image={vendorImage} size={28} />
                  </div>
                )}
                <div className={`max-w-[72%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                    isUser
                      ? "bg-brand-600 text-white rounded-tr-sm"
                      : "bg-white text-surface-800 rounded-tl-sm border border-surface-200 shadow-sm"
                  }`}>
                    {msg.body}
                  </div>
                  <span className="text-[10px] text-surface-400 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-surface-100 bg-white flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={t.typeHere}
          className="flex-1 px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300"
        />
        <button onClick={handleSend} disabled={sending || !input.trim()}
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-none transition-colors ${
            input.trim() ? "bg-brand-600 hover:bg-brand-700 cursor-pointer" : "bg-surface-100 cursor-default"
          }`}>
          {sending
            ? <Loader2 size={15} className={`animate-spin ${input.trim() ? "text-white" : "text-surface-400"}`} />
            : <Send size={15} className={input.trim() ? "text-white" : "text-surface-400"} />
          }
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccountMessagesPage() {
  const { lang } = useParams();
  const t = T[lang] || T.en;

  const [inquiries,  setInquiries] = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [activeTab,  setTab]       = useState("All");
  const [search,     setSearch]    = useState("");
  const [selected,   setSelected]  = useState(null);
  const [showModal,  setModal]     = useState(false);

  useEffect(() => {
    userAPI.inquiries({ limit: 100 })
      .then(r => setInquiries(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = inquiries
    .filter(i => activeTab === "All" || i.status?.toLowerCase() === activeTab.toLowerCase())
    .filter(i => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (i.vendor_name || "").toLowerCase().includes(q) ||
             (i.subject || "").toLowerCase().includes(q);
    });

  const handleCreated = (inq) => {
    if (inq?.id) { setInquiries(p => [inq, ...p]); setSelected(inq); }
    setModal(false);
  };

  // Mobile: show list if no selection
  const mobileShowChat = !!selected;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 120px)", minHeight: 480 }}>
      {/* Page title (visible above the two-panel on desktop, hidden on mobile when chat is open) */}
      <div className={`flex items-center justify-between mb-4 flex-shrink-0 ${mobileShowChat ? "hidden md:flex" : "flex"}`}>
        <div>
          <h1 className="text-xl font-bold text-surface-900">{t.title}</h1>
          <p className="text-sm text-surface-400 mt-0.5">{t.subtitle}</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
          <Plus size={15} /> {t.newMessage}
        </button>
      </div>

      {/* Two-panel container */}
      <div className="flex flex-1 bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden min-h-0">

        {/* ── Left panel: conversation list ── */}
        <div className={`flex flex-col border-r border-surface-100 flex-shrink-0 ${
          mobileShowChat ? "hidden md:flex md:w-80" : "flex w-full md:w-80"
        }`}>
          {/* Search + tabs */}
          <div className="flex-shrink-0 p-3 border-b border-surface-100 space-y-2.5">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.searchConvs}
                className="w-full pl-8 pr-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300" />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
              {TABS.map(tab => {
                const cnt = tab === "All" ? inquiries.length : inquiries.filter(i => i.status?.toLowerCase() === tab.toLowerCase()).length;
                return (
                  <button key={tab} onClick={() => setTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 cursor-pointer border-none transition-colors flex-shrink-0 ${
                      activeTab === tab ? "bg-brand-600 text-white" : "text-surface-500 hover:bg-surface-100 bg-transparent"
                    }`}>
                    {t.tabs[tab] || tab}
                    {cnt > 0 && (
                      <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20" : "bg-surface-100 text-surface-400"}`}>
                        {cnt}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-surface-300" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-50 flex items-center justify-center mb-3">
                  <MessageSquare size={20} className="text-surface-300" />
                </div>
                <p className="text-sm font-semibold text-surface-700 mb-1">
                  {activeTab === "All" && !search ? t.noMessages : t.noFiltered}
                </p>
                {activeTab === "All" && !search && (
                  <p className="text-xs text-surface-400 mb-4">{t.noMessagesDesc}</p>
                )}
                {activeTab === "All" && !search && (
                  <button onClick={() => setModal(true)}
                    className="flex items-center gap-1.5 bg-brand-600 text-white border-none rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                    <Plus size={13} /> {t.startFirst}
                  </button>
                )}
              </div>
            ) : filtered.map(inq => {
              const isActive = selected?.id === inq.id;
              const vendorName = inq.vendor_name || inq.subject?.split(" ")[0] || "Vendor";
              return (
                <button key={inq.id} onClick={() => setSelected(inq)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-none cursor-pointer transition-colors border-b border-surface-50 ${
                    isActive ? "bg-brand-50 border-l-2 border-l-brand-600" : "bg-transparent hover:bg-surface-50"
                  }`}>
                  <VendorAvatar name={vendorName} image={inq.vendor_logo || inq.vendor_image} size={42} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={`text-sm font-semibold truncate ${isActive ? "text-brand-700" : "text-surface-900"}`}>
                        {vendorName}
                      </p>
                      <span className="text-[10px] text-surface-400 flex-shrink-0 flex items-center gap-0.5">
                        <Clock size={9} /> {formatTime(inq.updated_at || inq.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 truncate mb-1">{inq.subject || "—"}</p>
                    <Badge status={inq.status} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right panel: chat view ── */}
        <div className={`flex-1 min-w-0 ${mobileShowChat ? "flex" : "hidden md:flex"} flex-col`}>
          {selected ? (
            <ChatPanel key={selected.id} inquiry={selected} lang={lang} onBack={() => setSelected(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-surface-50 border border-surface-200 flex items-center justify-center mb-4 shadow-sm">
                <MessageSquare size={26} className="text-surface-300" />
              </div>
              <p className="text-base font-semibold text-surface-700 mb-1">{t.selectConv}</p>
              <p className="text-sm text-surface-400 max-w-xs">{t.selectConvDesc}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && <NewMessageModal lang={lang} onClose={() => setModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
