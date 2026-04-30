"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, clearAuth, authAPI, userAPI } from "@/lib/api";
import {
  User, Package, Bookmark, Settings, LogOut,
  Bell, MessageSquare, Star, LayoutDashboard, ChevronRight,
  CalendarHeart, Send, Trash2, Eye, EyeOff, AlertTriangle, X,
} from "lucide-react";

const T = {
  en: {
    dashboard: "Dashboard", myOrders: "My Orders", messages: "Messages",
    myEvents: "My Events", inquiries: "Inquiries", myReviews: "My Reviews",
    savedItems: "Saved Items", notifications: "Notifications", settings: "Settings",
    signOut: "Sign Out", deleteAccount: "Delete Account",
    deleteModal: {
      title: "Delete Account",
      desc: "This action is permanent and cannot be undone. All your data will be erased.",
      passwordLabel: "Enter your password to confirm",
      passwordPlaceholder: "Your password",
      cancel: "Cancel",
      confirm: "Delete My Account",
      confirming: "Deleting…",
    },
  },
hy: {
  dashboard: "Վահանակ",
  myOrders: "Իմ պատվերները",
  messages: "Հաղորդագրություններ",
  myEvents: "Իմ միջոցառումները",
  inquiries: "Հարցումներ",
  myReviews: "Կարծիքներ",
  savedItems: "Պահվածներ",
  notifications: "Ծանուցումներ",
  settings: "Կարգավորումներ",
  signOut: "Ելք",
  deleteAccount: "Ջնջել հաշիվը",
  deleteModal: {
    title: "Ջնջել հաշիվը",
    desc: "Այս գործողությունը անդառնալի է։ Ձեր բոլոր տվյալները կջնջվեն։",
    passwordLabel: "Հաստատման համար մուտքագրեք գաղտնաբառը",
    passwordPlaceholder: "Գաղտնաբառ",
    cancel: "Չեղարկել",
    confirm: "Ջնջել",
    confirming: "Ջնջվում է…",
  },
},
  ru: {
    dashboard: "Главная", myOrders: "Заказы", messages: "Сообщения",
    myEvents: "События", inquiries: "Запросы", myReviews: "Отзывы",
    savedItems: "Сохранённое", notifications: "Уведомления", settings: "Настройки",
    signOut: "Выйти", deleteAccount: "Удалить аккаунт",
    deleteModal: {
      title: "Удалить аккаунт",
      desc: "Это действие необратимо. Все ваши данные будут удалены навсегда.",
      passwordLabel: "Введите пароль для подтверждения",
      passwordPlaceholder: "Ваш пароль",
      cancel: "Отмена",
      confirm: "Удалить аккаунт",
      confirming: "Удаление…",
    },
  },
};

function DeleteAccountModal({ lang, onClose, onDeleted }) {
  const m = (T[lang] || T.en).deleteModal;
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");

  async function handleDelete(e) {
    e.preventDefault();
    if (!password.trim()) { setError("Password is required."); return; }
    setDeleting(true); setError("");
    try {
      await userAPI.deleteAccount(password);
      clearAuth();
      onDeleted();
    } catch (err) {
      setError(err.message || "Failed to delete account. Please check your password.");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
              <X size={15} className="text-surface-400" />
            </button>
          </div>
          <h2 className="text-base font-bold text-surface-900 mb-1">{m.title}</h2>
          <p className="text-sm text-surface-500 leading-relaxed mb-5">{m.desc}</p>

          <form onSubmit={handleDelete} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{m.passwordLabel}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder={m.passwordPlaceholder}
                  className="w-full px-4 py-2.5 pr-11 text-sm border border-surface-200 rounded-xl outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 border-none bg-transparent cursor-pointer p-0">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
                {m.cancel}
              </button>
              <button type="submit" disabled={deleting || !password.trim()}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
                {deleting ? m.confirming : m.confirm}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AccountLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { lang } = useParams();
  const t = T[lang] || T.en;
  const [user,        setUser]        = useState(null);
  const [ready,       setReady]       = useState(false);
  const [showDelete,  setShowDelete]  = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace(`/${lang}/login`); return; }
    authAPI.me()
      .then(res => { setUser(res?.data || res); setReady(true); })
      .catch(() => { clearAuth(); router.replace(`/${lang}/login`); });
  }, [lang]);

  const handleLogout = () => { clearAuth(); router.push(`/${lang}/login`); };
  const handleDeleted = () => router.push(`/${lang}/login`);

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

            {/* Sign out */}
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left border-none border-t border-surface-100 bg-transparent cursor-pointer transition-colors"
            >
              <LogOut size={16} /> {t.signOut}
            </button>

            {/* Delete account */}
            <button onClick={() => setShowDelete(true)}
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-surface-400 hover:bg-red-50 hover:text-red-500 w-full text-left border-none bg-transparent cursor-pointer transition-colors"
            >
              <Trash2 size={16} /> {t.deleteAccount}
            </button>
          </nav>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {showDelete && (
        <DeleteAccountModal
          lang={lang}
          onClose={() => setShowDelete(false)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
