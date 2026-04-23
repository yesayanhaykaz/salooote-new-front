"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, clearAuth, authAPI } from "@/lib/api";
import {
  User, Package, Bookmark, Settings, LogOut,
  Bell, MessageSquare, Star, LayoutDashboard, ChevronRight,
  CalendarHeart, Send,
} from "lucide-react";

const T = {
  en: { dashboard: "Dashboard", myOrders: "My Orders", messages: "Messages", myEvents: "My Events", inquiries: "Inquiries", myReviews: "My Reviews", savedItems: "Saved Items", notifications: "Notifications", settings: "Settings", signOut: "Sign Out" },
  hy: { dashboard: "Վահանակ", myOrders: "Իմ Պատվերները", messages: "Հաղ-ներ", myEvents: "Իմ Միջ-ները", inquiries: "Հարցումներ", myReviews: "Կարծիքներ", savedItems: "Պահված", notifications: "Ծانоуцումներ", settings: "Կարգ-ումներ", signOut: "Ելք" },
  ru: { dashboard: "Главная", myOrders: "Мои Заказы", messages: "Сообщения", myEvents: "Мои Мероприятия", inquiries: "Запросы", myReviews: "Отзывы", savedItems: "Сохранённое", notifications: "Уведомления", settings: "Настройки", signOut: "Выйти" },
};

export default function AccountLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { lang } = useParams();
  const t = T[lang] || T.en;
  const [user,  setUser]  = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace(`/${lang}/login`); return; }
    authAPI.me()
      .then(res => { setUser(res?.data || res); setReady(true); })
      .catch(() => { clearAuth(); router.replace(`/${lang}/login`); });
  }, [lang]);

  const handleLogout = () => { clearAuth(); router.push(`/${lang}/login`); };

  const initials = user
    ? ((user.first_name?.[0] || "") + (user.last_name?.[0] || "")).toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
    : "";
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email
    : "";

  const nav = [
    { icon: LayoutDashboard, label: t.dashboard,     href: `/${lang}/account` },
    { icon: Package,         label: t.myOrders,      href: `/${lang}/account/orders` },
    { icon: MessageSquare,   label: t.messages,      href: `/${lang}/account/messages` },
    { icon: CalendarHeart,   label: t.myEvents,      href: `/${lang}/account/events` },
    { icon: Send,            label: t.inquiries,     href: `/${lang}/account/inquiries` },
    { icon: Star,            label: t.myReviews,     href: `/${lang}/account/reviews` },
    { icon: Bookmark,        label: t.savedItems,    href: `/${lang}/account/saved` },
    { icon: Bell,            label: t.notifications, href: `/${lang}/account/notifications` },
    { icon: Settings,        label: t.settings,      href: `/${lang}/account/settings` },
  ];

  if (!ready) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-container mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-[240px] flex-shrink-0">
          {/* User card */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5 mb-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden">
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  : initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-surface-900 text-sm truncate">{displayName}</p>
                <p className="text-xs text-surface-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
            {nav.map(({ icon: Icon, label, href }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium no-underline transition-colors border-b border-surface-100 last:border-0 ${
                    active ? "bg-brand-50 text-brand-600" : "text-surface-700 hover:bg-surface-50 hover:text-surface-900"
                  }`}
                >
                  <Icon size={16} className={active ? "text-brand-500" : "text-surface-400"} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="text-brand-400" />}
                </Link>
              );
            })}
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left border-none bg-transparent cursor-pointer transition-colors"
            >
              <LogOut size={16} /> {t.signOut}
            </button>
          </nav>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
