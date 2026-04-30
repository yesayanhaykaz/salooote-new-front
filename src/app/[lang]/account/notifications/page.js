"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { userAPI } from "@/lib/api";
import {
  Bell, MessageSquare, CalendarCheck, Star, CheckCircle,
  Package, CreditCard, X, Check, CheckCheck,
} from "lucide-react";

const T = {
  en: {
    title: "Notifications",
    unread: (c) => `${c} unread`,
    allCaughtUp: "All caught up",
    markAllRead: "Mark all read",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    empty: "All caught up!",
    emptyDesc: "No notifications to show here.",
    tabs: { all: "All", unread: "Unread", messages: "Messages", bookings: "Bookings", reviews: "Reviews", system: "System" },
  },
  hy: {
    title: "Ծանուցումներ",
    unread: (c) => `${c} չկարդացված`,
    allCaughtUp: "Բոլորը կարդացված է",
    markAllRead: "Նշել բոլորը կարդացված",
    today: "Այսօր",
    yesterday: "Երեկ",
    thisWeek: "Այս շաբաթ",
    empty: "Բոլորը կարդացված է!",
    emptyDesc: "Ծանուցումներ չկան",
    tabs: { all: "Բոլոր", unread: "Չկարդացված", messages: "Հաղորդագրություններ", bookings: "Ամրագրում", reviews: "Կարծիքներ", system: "Համակարգ" },
  },
  ru: {
    title: "Уведомления",
    unread: (c) => `${c} непрочитанных`,
    allCaughtUp: "Всё прочитано",
    markAllRead: "Прочитать все",
    today: "Сегодня",
    yesterday: "Вчера",
    thisWeek: "На этой неделе",
    empty: "Всё прочитано!",
    emptyDesc: "Уведомлений нет.",
    tabs: { all: "Все", unread: "Непрочитанные", messages: "Сообщения", bookings: "Заказы", reviews: "Отзывы", system: "Система" },
  },
};

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
  cancelled: X,
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

// Where to navigate when user clicks a notification
const TYPE_ROUTE = {
  inquiry:      "/account/messages",
  message:      "/account/messages",
  booking:      "/account/orders",
  cancelled:    "/account/orders",
  review:       "/account/reviews",
  profile:      "/account/settings",
  listing:      "/account/saved",
  subscription: "/account/settings",
  payment:      "/account/orders",
};

function getGroupKey(iso) {
  if (!iso) return "this_week";
  const h = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (h < 24) return "today";
  if (h < 48) return "yesterday";
  return "this_week";
}

const GROUP_KEYS = ["today", "yesterday", "this_week"];

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

export default function AccountNotificationsPage() {
  const { lang } = useParams();
  const router   = useRouter();
  const t = T[lang] || T.en;

  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [readSet, setReadSet] = useState(new Set());

  const FILTER_TABS = [
    { value: "all",      label: t.tabs.all },
    { value: "unread",   label: t.tabs.unread },
    { value: "messages", label: t.tabs.messages },
    { value: "bookings", label: t.tabs.bookings },
    { value: "reviews",  label: t.tabs.reviews },
    { value: "system",   label: t.tabs.system },
  ];

  const GROUP_LABELS = { today: t.today, yesterday: t.yesterday, this_week: t.thisWeek };

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

  const handleClick = async (n) => {
    if (!isRead(n.id)) {
      setReadSet(p => new Set([...p, n.id]));
      try { await userAPI.markNotifRead(n.id); } catch {}
    }
    const route = TYPE_ROUTE[n.type];
    if (route) router.push(`/${lang}${route}`);
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
            {t.title}
            {unreadCount > 0 && (
              <span className="ml-2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-surface-400 mt-0.5">{unreadCount > 0 ? t.unread(unreadCount) : t.allCaughtUp}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl hover:bg-brand-100 cursor-pointer border-none transition-colors">
            <CheckCheck size={14} /> {t.markAllRead}
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
          <p className="font-semibold text-surface-700">{t.empty}</p>
          <p className="text-sm text-surface-400 mt-1">{t.emptyDesc}</p>
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
              const clickable = !!TYPE_ROUTE[n.type];
              return (
                <div key={n.id} onClick={() => handleClick(n)}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                    !read ? "bg-brand-50/30" : ""
                  } ${clickable ? "cursor-pointer hover:bg-surface-50" : "cursor-default"}`}
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
