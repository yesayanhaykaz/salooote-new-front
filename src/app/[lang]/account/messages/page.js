"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { userAPI, vendorsAPI } from "@/lib/api";
import { MessageSquare, Plus, X, Send, Clock, AlertCircle, Search, Store, ChevronLeft } from "lucide-react";

const T = {
  en: {
    title: "Messages",
    subtitle: "Your conversations with vendors",
    newMessage: "New Message",
    tabs: { All: "All", New: "New", Replied: "Replied", Confirmed: "Confirmed", Cancelled: "Cancelled", Closed: "Closed" },
    empty: "No messages yet",
    emptyDesc: "Send a message to a vendor to start a conversation.",
    sendFirst: "Send First Message",
    noFiltered: (s) => `No ${s.toLowerCase()} messages.`,
    awaiting: "Waiting for vendor reply…",
    responded: "Vendor responded — status:",
    modal: {
      title: "New Message",
      subtitle: "Select a vendor to start a conversation",
      searchPlaceholder: "Search vendors…",
      step2Title: "Message",
      subject: "Subject *",
      subjectPlaceholder: "What is this about?",
      message: "Message *",
      messagePlaceholder: "Describe what you need, when your event is, any special requirements…",
      eventType: "Event Type",
      eventTypePlaceholder: "Wedding, Birthday…",
      eventDate: "Event Date",
      guestCount: "Guest Count",
      budget: "Budget",
      cancel: "Cancel",
      back: "Back",
      send: "Send Message",
      sending: "Sending…",
      noVendors: "No vendors found",
      loadingVendors: "Loading vendors…",
    },
  },
  hy: {
    title: "Հաղորդագրություններ",
    subtitle: "Ձեր զրույցները վաճառողների հետ",
    newMessage: "Նոր հաղ.",
    tabs: { All: "Բոլոր", New: "Նոր", Replied: "Պատ.", Confirmed: "Հաստ.", Cancelled: "Չեղ.", Closed: "Փակ" },
    empty: "Հաղորդագրություններ չկան",
    emptyDesc: "Ուղարկեք հաղ. վաճառողին՝ զրույց սկսելու համար",
    sendFirst: "Ուղարկել առաջինը",
    noFiltered: (s) => `${s} հաղ. չկան`,
    awaiting: "Սպասում ենք վաճառողի պատասխանին…",
    responded: "Վաճառողը պատասխանեց — կարգ.:",
    modal: {
      title: "Նոր հաղ.",
      subtitle: "Ընտրեք վաճառողին",
      searchPlaceholder: "Փնտրել…",
      step2Title: "Հաղ.",
      subject: "Թեմա *",
      subjectPlaceholder: "Ինչի մասին է?",
      message: "Հաղ. *",
      messagePlaceholder: "Նկարագրեք ձեր կարիքները…",
      eventType: "Միջ. տեսակ",
      eventTypePlaceholder: "Հարսանիք, Ծննդ.…",
      eventDate: "Ամսաթիվ",
      guestCount: "Հյուրերի թիվ",
      budget: "Բյուջե",
      cancel: "Չեղ.",
      back: "Հետ",
      send: "Ուղ. հաղ.",
      sending: "Ուղ.…",
      noVendors: "Վաճ. չկան",
      loadingVendors: "Բեռ.…",
    },
  },
  ru: {
    title: "Сообщения",
    subtitle: "Ваши диалоги с поставщиками",
    newMessage: "Новое сообщение",
    tabs: { All: "Все", New: "Новые", Replied: "С ответом", Confirmed: "Подтв.", Cancelled: "Отмен.", Closed: "Закр." },
    empty: "Сообщений пока нет",
    emptyDesc: "Напишите поставщику, чтобы начать разговор.",
    sendFirst: "Написать первым",
    noFiltered: (s) => `Нет сообщений со статусом ${s.toLowerCase()}.`,
    awaiting: "Ожидаем ответа поставщика…",
    responded: "Поставщик ответил — статус:",
    modal: {
      title: "Новое сообщение",
      subtitle: "Выберите поставщика для начала диалога",
      searchPlaceholder: "Поиск поставщиков…",
      step2Title: "Сообщение",
      subject: "Тема *",
      subjectPlaceholder: "О чём сообщение?",
      message: "Сообщение *",
      messagePlaceholder: "Опишите ваши требования…",
      eventType: "Тип события",
      eventTypePlaceholder: "Свадьба, День рождения…",
      eventDate: "Дата события",
      guestCount: "Кол-во гостей",
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

function NewMessageModal({ lang, onClose, onCreated }) {
  const m = (T[lang] || T.en).modal;

  const [step,       setStep]       = useState(1); // 1 = choose vendor, 2 = write message
  const [vendors,    setVendors]    = useState([]);
  const [vendLoad,   setVendLoad]   = useState(true);
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);
  const [form,       setForm]       = useState({ subject: "", message: "", event_type: "", event_date: "", guest_count: "", budget: "", currency: "AMD" });
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    vendorsAPI.list({ limit: 50 })
      .then(res => setVendors(res?.data || []))
      .catch(() => {})
      .finally(() => setVendLoad(false));
    setTimeout(() => searchRef.current?.focus(), 100);
  }, []);

  const vendorList = vendors.filter(v => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (v.business_name || v.name || "").toLowerCase().includes(q) ||
      (v.description || "").toLowerCase().includes(q) ||
      (v.city || "").toLowerCase().includes(q)
    );
  });

  const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected)           { setError("Please select a vendor."); return; }
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
    } catch (err) { setError(err.message || "Failed to send message."); }
    finally { setSaving(false); }
  }

  const inputCls = "w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300";

  const vendorInitials = (v) =>
    ([v.first_name, v.last_name].filter(Boolean).map(s => s[0]).join("") ||
    (v.business_name || v.name || "V").slice(0, 2)).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-xl flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => { setStep(1); setError(""); }}
                className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent flex-shrink-0">
                <ChevronLeft size={16} className="text-surface-500" />
              </button>
            )}
            <div>
              <h2 className="text-sm font-bold text-surface-900">
                {step === 1 ? m.title : m.step2Title}
              </h2>
              <p className="text-xs text-surface-400 mt-0.5">
                {step === 1 ? m.subtitle : (selected?.business_name || selected?.name || "")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={15} className="text-surface-500" />
          </button>
        </div>

        {/* Step 1 — Vendor picker */}
        {step === 1 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search */}
            <div className="px-4 py-3 border-b border-surface-100">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={m.searchPlaceholder}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>

            {/* Vendor list */}
            <div className="overflow-y-auto flex-1 py-2">
              {vendLoad ? (
                <p className="text-center text-sm text-surface-400 py-8">{m.loadingVendors}</p>
              ) : vendorList.length === 0 ? (
                <p className="text-center text-sm text-surface-400 py-8">{m.noVendors}</p>
              ) : (
                vendorList.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setSelected(v); setStep(2); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-50 transition-colors text-left border-none bg-transparent cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0 overflow-hidden">
                      {v.cover_image_url || v.avatar_url
                        ? <img src={v.cover_image_url || v.avatar_url} alt="" className="w-full h-full object-cover" />
                        : vendorInitials(v)
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 truncate">
                        {v.business_name || v.name || "Vendor"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {v.city && (
                          <span className="text-xs text-surface-400 truncate">{v.city}</span>
                        )}
                        {v.category && (
                          <span className="text-xs text-brand-500 font-medium truncate">· {v.category}</span>
                        )}
                      </div>
                    </div>
                    <Store size={14} className="text-surface-300 flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2 — Write message */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.subject}</label>
              <input name="subject" value={form.subject} onChange={set} placeholder={m.subjectPlaceholder} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.message}</label>
              <textarea name="message" value={form.message} onChange={set} rows={4}
                placeholder={m.messagePlaceholder}
                className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.eventType}</label>
                <input name="event_type" value={form.event_type} onChange={set} placeholder={m.eventTypePlaceholder} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.eventDate}</label>
                <input type="date" name="event_date" value={form.event_date} onChange={set} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.guestCount}</label>
                <input type="number" name="guest_count" value={form.guest_count} onChange={set} placeholder="e.g. 100" className={inputCls} />
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

export default function AccountMessagesPage() {
  const { lang } = useParams();
  const t = T[lang] || T.en;

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

  const handleCreated = (inq) => {
    if (inq?.id) { setInquiries(p => [inq, ...p]); setSelected(inq); }
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">{t.title}</h1>
          <p className="text-sm text-surface-400 mt-0.5">{t.subtitle}</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
          <Plus size={15} /> {t.newMessage}
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
              {t.tabs[tab] || tab}
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
          <p className="font-semibold text-surface-700 text-base">{t.empty}</p>
          <p className="text-sm text-surface-400 mt-1 mb-5">
            {activeTab === "All" ? t.emptyDesc : t.noFiltered(activeTab)}
          </p>
          {activeTab === "All" && (
            <button onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
              <Plus size={14} /> {t.sendFirst}
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
                <div
                  onClick={() => setSelected(isSelected ? null : inq)}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer ${isSelected ? "border-brand-300 shadow-md" : "border-surface-200 shadow-sm hover:border-surface-300"}`}
                >
                  <div className="p-4 flex items-start gap-4">
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

                  {/* Expanded thread */}
                  {isSelected && (
                    <div className="border-t border-surface-100 px-5 py-4 bg-surface-50 rounded-b-2xl">
                      <div className="flex justify-end mb-3">
                        <div className="max-w-[80%]">
                          <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                            {inq.message}
                          </div>
                          <p className="text-[11px] text-surface-400 mt-1 text-right">{formatDate(inq.created_at)}</p>
                        </div>
                      </div>

                      {(inq.event_type || inq.event_date || inq.guest_count || inq.budget) && (
                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                          {inq.event_type  && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">📅 {inq.event_type}</span>}
                          {inq.event_date  && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">🗓 {inq.event_date?.slice(0, 10)}</span>}
                          {inq.guest_count && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">👥 {inq.guest_count} guests</span>}
                          {inq.budget      && <span className="text-xs bg-white border border-surface-200 rounded-full px-3 py-1 text-surface-600">💰 {inq.currency} {inq.budget}</span>}
                        </div>
                      )}

                      {inq.status === "new" ? (
                        <div className="flex items-center gap-2 text-xs text-surface-400 mt-2">
                          <div className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          {t.awaiting}
                        </div>
                      ) : (
                        <p className="text-xs text-center text-surface-400 mt-2">
                          {t.responded} <span className="font-semibold capitalize">{inq.status}</span>
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

      {showModal && <NewMessageModal lang={lang} onClose={() => setModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
