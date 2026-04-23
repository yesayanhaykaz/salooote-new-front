"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { authAPI, userAPI } from "@/lib/api";
import {
  ShoppingBag, Heart, MessageSquare, Bell,
  Package, ChevronRight, Star, CalendarHeart, Send,
} from "lucide-react";

const T = {
  en: {
    welcomeBack: "Welcome back",
    subtitle: "Here's what's happening with your account.",
    myOrders: "My Orders",
    savedItems: "Saved Items",
    activeInquiries: "Active Inquiries",
    unreadNotifs: "Unread Notifs",
    recentOrders: "Recent Orders",
    recentInquiries: "Recent Inquiries",
    recentActivity: "Recent Activity",
    quickLinks: "Quick Links",
    viewAll: "View all",
    noOrders: "No orders yet.",
    noInquiries: "No inquiries yet.",
    sendOne: "Send one",
    noNotifications: "No notifications.",
    messages: "Messages",
    myEvents: "My Events",
    inquiries: "Inquiries",
    myReviews: "My Reviews",
    notifications: "Notifications",
    noSubject: "(No subject)",
  },
  hy: {
    welcomeBack: "Բարի վերադարձ",
    subtitle: "Ահա թե ինչ է կատարվում ձեր հաշվով:",
    myOrders: "Իմ Պատվերները",
    savedItems: "Պահված",
    activeInquiries: "Ակտիվ Հարցումներ",
    unreadNotifs: "Չկարդացված",
    recentOrders: "Վերջին Պատվերները",
    recentInquiries: "Վերջին Հարցումները",
    recentActivity: "Վերջին Գործողություններ",
    quickLinks: "Արագ Հղումներ",
    viewAll: "Բոլորը",
    noOrders: "Դեռ պատվեր չկա:",
    noInquiries: "Դեռ հարցում չկա:",
    sendOne: "Ուղարկել",
    noNotifications: "Ծаноуцումներ չկան:",
    messages: "Հաղ-ներ",
    myEvents: "Իմ Միջ-ները",
    inquiries: "Հարցումներ",
    myReviews: "Կարծիքներ",
    notifications: "Ծаноуцումներ",
    noSubject: "(Թեմա չկա)",
  },
  ru: {
    welcomeBack: "С возвращением",
    subtitle: "Вот что происходит с вашим аккаунтом.",
    myOrders: "Мои Заказы",
    savedItems: "Сохранённое",
    activeInquiries: "Активные Запросы",
    unreadNotifs: "Непрочитанные",
    recentOrders: "Последние Заказы",
    recentInquiries: "Последние Запросы",
    recentActivity: "Последние Уведомления",
    quickLinks: "Быстрые Ссылки",
    viewAll: "Все",
    noOrders: "Заказов пока нет.",
    noInquiries: "Запросов пока нет.",
    sendOne: "Отправить",
    noNotifications: "Уведомлений нет.",
    messages: "Сообщения",
    myEvents: "Мои Мероприятия",
    inquiries: "Запросы",
    myReviews: "Отзывы",
    notifications: "Уведомления",
    noSubject: "(Без темы)",
  },
};

const STATUS_STYLES = {
  pending:    "bg-amber-50  text-amber-600  border-amber-200",
  confirmed:  "bg-blue-50   text-blue-600   border-blue-200",
  processing: "bg-blue-50   text-blue-600   border-blue-200",
  shipped:    "bg-violet-50 text-violet-600 border-violet-200",
  delivered:  "bg-green-50  text-green-600  border-green-200",
  cancelled:  "bg-red-50    text-red-500    border-red-200",
  new:        "bg-blue-50   text-blue-600   border-blue-200",
  replied:    "bg-violet-50 text-violet-600 border-violet-200",
  closed:     "bg-surface-100 text-surface-500 border-surface-200",
};

function Badge({ status }) {
  const cls = STATUS_STYLES[status?.toLowerCase()] || "bg-surface-100 text-surface-500 border-surface-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}>
      {status || "—"}
    </span>
  );
}

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
  return `${days}d ago`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AccountDashboard() {
  const { lang } = useParams();
  const t = T[lang] || T.en;
  const [user,      setUser]      = useState(null);
  const [orders,    setOrders]    = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [notifs,    setNotifs]    = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      authAPI.me(),
      userAPI.orders({ limit: 3 }),
      userAPI.inquiries({ limit: 3 }),
      userAPI.notifications({ limit: 5 }),
      userAPI.saved({ limit: 1 }),
    ]).then(([u, o, i, n, s]) => {
      if (u.status === "fulfilled") setUser(u.value?.data || u.value);
      if (o.status === "fulfilled") setOrders(o.value?.data || []);
      if (i.status === "fulfilled") setInquiries(i.value?.data || []);
      if (n.status === "fulfilled") setNotifs(n.value?.data || []);
      if (s.status === "fulfilled") setSavedCount(s.value?.meta?.total ?? s.value?.data?.length ?? 0);
    }).finally(() => setLoading(false));
  }, []);

  const firstName    = user?.first_name || user?.email?.split("@")[0] || "there";
  const unread       = notifs.filter(n => !n.is_read).length;
  const activeInquiries = inquiries.filter(i => !["cancelled", "closed", "completed"].includes(i.status)).length;

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">{t.welcomeBack}, {firstName}! 👋</h1>
        <p className="text-surface-400 text-sm mt-1">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t.myOrders,        value: orders.length,    icon: ShoppingBag,   bg: "bg-violet-50", color: "text-violet-500", href: `/${lang}/account/orders` },
          { label: t.savedItems,      value: savedCount,       icon: Heart,         bg: "bg-pink-50",   color: "text-brand-500",  href: `/${lang}/account/saved` },
          { label: t.activeInquiries, value: activeInquiries,  icon: MessageSquare, bg: "bg-blue-50",   color: "text-blue-500",   href: `/${lang}/account/inquiries` },
          { label: t.unreadNotifs,    value: unread,           icon: Bell,          bg: "bg-amber-50",  color: "text-amber-500",  href: `/${lang}/account/notifications` },
        ].map(s => (
          <Link key={s.label} href={s.href} className="no-underline bg-white rounded-2xl border border-surface-200 shadow-sm p-4 flex items-center gap-3 hover:border-surface-300 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 leading-none">{s.value}</p>
              <p className="text-xs text-surface-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left — Orders + Inquiries */}
        <div className="xl:col-span-2 space-y-6">

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-surface-900">{t.recentOrders}</h2>
              <Link href={`/${lang}/account/orders`} className="text-xs text-brand-600 font-semibold hover:text-brand-700 no-underline flex items-center gap-1">
                {t.viewAll} <ChevronRight size={12} />
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="py-12 text-center text-sm text-surface-400">{t.noOrders}</div>
            ) : (
              <div className="divide-y divide-surface-50">
                {orders.map(order => (
                  <div key={order.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Package size={15} className="text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900">Order #{order.id?.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-surface-400">{order.vendor_name || formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge status={order.status} />
                      {order.total != null && (
                        <span className="text-xs font-bold text-brand-600">{Number(order.total).toLocaleString()} ֏</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-surface-900">{t.recentInquiries}</h2>
              <Link href={`/${lang}/account/inquiries`} className="text-xs text-brand-600 font-semibold hover:text-brand-700 no-underline flex items-center gap-1">
                {t.viewAll} <ChevronRight size={12} />
              </Link>
            </div>
            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-sm text-surface-400">
                {t.noInquiries}{" "}
                <Link href={`/${lang}/account/inquiries`} className="text-brand-600 font-semibold no-underline">{t.sendOne}</Link>
              </div>
            ) : (
              <div className="divide-y divide-surface-50">
                {inquiries.map(inq => (
                  <div key={inq.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={15} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 truncate">{inq.subject || t.noSubject}</p>
                      <p className="text-xs text-surface-400">{timeAgo(inq.created_at)}</p>
                    </div>
                    <Badge status={inq.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Notifications + Quick Links */}
        <div className="space-y-6">

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-surface-900">{t.recentActivity}</h2>
              <Link href={`/${lang}/account/notifications`} className="text-xs text-brand-600 font-semibold hover:text-brand-700 no-underline flex items-center gap-1">
                {t.viewAll} <ChevronRight size={12} />
              </Link>
            </div>
            {notifs.length === 0 ? (
              <div className="py-10 text-center text-sm text-surface-400">{t.noNotifications}</div>
            ) : (
              <div className="divide-y divide-surface-50">
                {notifs.map(n => {
                  const isUnread = !n.is_read;
                  return (
                    <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 ${isUnread ? "bg-brand-50/30" : ""}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnread ? "bg-brand-100" : "bg-surface-100"}`}>
                        <Bell size={14} className={isUnread ? "text-brand-600" : "text-surface-400"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug truncate ${isUnread ? "font-semibold text-surface-900" : "font-medium text-surface-700"}`}>{n.title}</p>
                        {n.body && <p className="text-[11px] text-surface-400 mt-0.5 line-clamp-1">{n.body}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-brand-600 block" />}
                        <span className="text-[10px] text-surface-400">{timeAgo(n.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-surface-900 mb-3">{t.quickLinks}</h2>
            <div className="space-y-1">
              {[
                { href: `/${lang}/account/saved`,        label: t.savedItems,     icon: Heart,         color: "text-brand-500",  bg: "bg-brand-50" },
                { href: `/${lang}/account/orders`,        label: t.myOrders,       icon: ShoppingBag,   color: "text-violet-500", bg: "bg-violet-50" },
                { href: `/${lang}/account/messages`,      label: t.messages,       icon: MessageSquare, color: "text-blue-500",   bg: "bg-blue-50" },
                { href: `/${lang}/account/events`,        label: t.myEvents,       icon: CalendarHeart, color: "text-rose-500",   bg: "bg-rose-50" },
                { href: `/${lang}/account/inquiries`,     label: t.inquiries,      icon: Send,          color: "text-indigo-500", bg: "bg-indigo-50" },
                { href: `/${lang}/account/reviews`,       label: t.myReviews,      icon: Star,          color: "text-amber-500",  bg: "bg-amber-50" },
                { href: `/${lang}/account/notifications`, label: t.notifications,  icon: Bell,          color: "text-surface-500",bg: "bg-surface-100" },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors no-underline group"
                >
                  <div className={`w-7 h-7 rounded-lg ${l.bg} flex items-center justify-center flex-shrink-0`}>
                    <l.icon size={13} className={l.color} />
                  </div>
                  <span className="text-sm text-surface-700 group-hover:text-surface-900 flex-1">{l.label}</span>
                  <ChevronRight size={13} className="text-surface-300 group-hover:text-surface-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
