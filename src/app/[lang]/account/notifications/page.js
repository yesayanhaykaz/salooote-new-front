"use client";
import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import {
  Bell, MessageSquare, CalendarCheck, Star, CheckCircle,
  Package, CreditCard, X, Check, CheckCheck,
} from "lucide-react";

const ICON_BG = {
  inquiry:  "bg-blue-50 text-blue-500",
  booking:  "bg-green-50 text-green-500",
  cancelled:"bg-red-50 text-red-500",
  review:   "bg-amber-50 text-amber-500",
  profile:  "bg-green-50 text-green-500",
  listing:  "bg-brand-50 text-brand-500",
  message:  "bg-blue-50 text-blue-500",
  payment:  "bg-green-50 text-green-500",
  system:   "bg-surface-100 text-surface-400",
  info:     "bg-blue-50 text-blue-500",
  success:  "bg-green-50 text-green-500",
  warning:  "bg-amber-50 text-amber-500",
};

const TYPE_ICON = {
  inquiry:  MessageSquare,
  booking:  CalendarCheck,
  review:   Star,
  profile:  CheckCircle,
  listing:  Package,
  payment:  CreditCard,
  message:  MessageSquare,
  success:  CheckCircle,
  cancelled:X,
  system:   Bell,
  info:     Bell,
  warning:  Bell,
};

const TYPE_FILTER_MAP = {
  messages: ["inquiry", "message"],
  bookings: ["booking", "cancelled"],
  reviews:  ["review"],
  system:   ["system", "profile", "listing", "payment", "info", "success", "warning"],
};

function getGroupKey(iso) {
  if (!iso) return "this_week";
  const h = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (h < 24) return "today";
  if (h < 48) return "yesterday";
  return "this_week";
}

const GROUP_LABELS = { today: "Today", yesterday: "Yesterday", this_week: "This Week" };
const GROUP_KEYS   = ["today", "yesterday", "this_week"];

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const FILTER_TABS = [
  { value: "all",      label: "All" },
  { value: "unread",   label: "Unread" },
  { value: "messages", label: "Messages" },
  { value: "bookings", label: "Bookings" },
  { value: "reviews",  label: "Reviews" },
  { value: "system",   label: "System" },
];

export default function AccountNotificationsPage() {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [readSet, setReadSet] = useState(new Set());

  useEffect(() => {
    userAPI.notifications({ limit: 50 })
      .then(res => {
        const list = res?.data || [];
        setNotifs(list);
        setReadSet(new Set(list.filter(n => n.is_read).map(n => n.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isRead = (id) => readSet.has(id);

  const markRead = async (id) => {
    if (isRead(id)) return;
    setReadSet(p => new Set([...p, id]));
    try { await userAPI.markNotifRead(id); } catch {}
  };

  const markAllRead = async () => {
    try {
      await userAPI.markAllNotifsRead();
      setReadSet(new Set(notifs.map(n => n.id)));
    } catch {}
  };

  const unreadCount = notifs.filter(n => !isRead(n.id)).length;

  const filtered = notifs.filter(n => {
    if (filter === "unread") return !isRead(n.id);
    if (filter === "all")    return true;
    return (TYPE_FILTER_MAP[filter] || []).includes(n.type);
  });

  const grouped = GROUP_KEYS.reduce((acc, key) => {
    const items = filtered.filter(n => getGroupKey(n.created_at) === key);
    if (items.length) acc[key] = items;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-surface-400 mt-0.5">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl hover:bg-brand-100 cursor-pointer border-none transition-colors">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTER_TABS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              filter === f.value
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"
            }`}
          >
            {f.label}
            {f.value === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && Object.keys(grouped).length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-green-500" />
          </div>
          <p className="font-semibold text-surface-700">All caught up!</p>
          <p className="text-sm text-surface-400 mt-1">No notifications to show here.</p>
        </div>
      )}

      {!loading && Object.entries(grouped).map(([groupKey, items]) => (
        <div key={groupKey}>
          <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2 px-1">
            {GROUP_LABELS[groupKey]}
          </h3>
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden divide-y divide-surface-50">
            {items.map(n => {
              const read      = isRead(n.id);
              const iconStyle = ICON_BG[n.type] || "bg-surface-100 text-surface-400";
              const Icon      = TYPE_ICON[n.type] || Bell;
              return (
                <div key={n.id} onClick={() => markRead(n.id)}
                  className={`flex items-start gap-4 px-5 py-4 hover:bg-surface-50 cursor-pointer transition-colors ${!read ? "bg-brand-50/30" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconStyle}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${read ? "font-medium text-surface-700" : "font-semibold text-surface-900"}`}>
                        {n.title}
                      </p>
                      <span className="text-[11px] text-surface-400 flex-shrink-0 mt-0.5">{timeAgo(n.created_at)}</span>
                    </div>
                    {n.body && <p className="text-xs text-surface-500 mt-0.5 leading-relaxed pr-4">{n.body}</p>}
                  </div>
                  <div className="flex-shrink-0 mt-2">
                    {!read
                      ? <span className="w-2 h-2 bg-brand-600 rounded-full block" />
                      : <span className="w-2 h-2 block" />
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
