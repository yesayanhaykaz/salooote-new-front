"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { userAPI } from "@/lib/api";
import { Package, ChevronDown, ChevronUp, ShoppingBag, MapPin, Calendar, ExternalLink } from "lucide-react";

const T = {
  en: {
    title: "My Orders",
    count: (c) => `${c} order${c !== 1 ? "s" : ""}`,
    filters: { All: "All", Pending: "Pending", Confirmed: "Confirmed", Processing: "Processing", Shipped: "Shipped", Delivered: "Delivered", Cancelled: "Cancelled" },
    emptyTitle: "No orders found",
    emptyAll: "You haven't placed any orders yet.",
    emptyFiltered: "No orders with this status.",
    showItems: (c) => `Show ${c} items`,
    hideItems: "Hide items",
    qty: "Qty",
    delivery: "Delivery",
    address: "Address",
    vendor: "Vendor",
  },
  hy: {
    title: "Իմ պատվերները",
    count: (c) => `${c} պատվեր`,
    filters: { All: "Բոլորը", Pending: "Սպասում", Confirmed: "Հաստատված", Processing: "Ընթացքում", Shipped: "Ուղարկված", Delivered: "Առաքված", Cancelled: "Չեղարկված" },
    emptyTitle: "Պատվերներ չկան",
    emptyAll: "Դուք դեռ պատվեր չեք կատարել",
    emptyFiltered: "Այս կարգավիճակով պատվերներ չկան",
    showItems: (c) => `Ցուցադրել ${c} ապրանք`,
    hideItems: "Թաքցնել",
    qty: "Քան.",
    delivery: "Առաքում",
    address: "Հասցե",
    vendor: "Վաճառող",
  },
  ru: {
    title: "Мои заказы",
    count: (c) => `${c} заказ${c > 1 ? "а" : ""}`,
    filters: { All: "Все", Pending: "В ожидании", Confirmed: "Подтверждён", Processing: "В обработке", Shipped: "Отправлен", Delivered: "Доставлен", Cancelled: "Отменён" },
    emptyTitle: "Заказы не найдены",
    emptyAll: "Вы ещё не сделали ни одного заказа",
    emptyFiltered: "Нет заказов с таким статусом",
    showItems: (c) => `Показать ${c} товаров`,
    hideItems: "Скрыть",
    qty: "Кол-во",
    delivery: "Доставка",
    address: "Адрес",
    vendor: "Продавец",
  },
};

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  pending:    "bg-amber-50 text-amber-600 border-amber-200",
  confirmed:  "bg-blue-50 text-blue-600 border-blue-200",
  processing: "bg-blue-50 text-blue-600 border-blue-200",
  shipped:    "bg-violet-50 text-violet-600 border-violet-200",
  delivered:  "bg-green-50 text-green-600 border-green-200",
  cancelled:  "bg-red-50 text-red-500 border-red-200",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AccountOrdersPage() {
  const { lang } = useParams();
  const t = T[lang] || T.en;

  const [orders,      setOrders]     = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [activeFilter, setFilter]    = useState("All");
  const [expandedId,  setExpandedId] = useState(null);

  useEffect(() => {
    userAPI.orders({ limit: 50 })
      .then(res => setOrders(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">{t.title}</h1>
          <p className="text-sm text-surface-400 mt-0.5">{t.count(orders.length)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              activeFilter === f
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"
            }`}
          >
            {t.filters[f]}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-50 flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-surface-300" />
          </div>
          <p className="font-semibold text-surface-700">{t.emptyTitle}</p>
          <p className="text-sm text-surface-400 mt-1">{activeFilter === "All" ? t.emptyAll : t.emptyFiltered}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map(order => {
            const items     = order.items || [];
            const expanded  = expandedId === order.id;
            const statusKey = order.status?.toLowerCase() || "";
            const statusCls = STATUS_STYLES[statusKey] || "bg-surface-100 text-surface-500 border-surface-200";

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:border-surface-300 transition-colors">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-brand-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <p className="text-sm font-bold text-surface-900">
                            #{order.id?.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-surface-400 mt-0.5">
                            {t.vendor}: {order.vendor_name || `···${order.vendor_id?.slice(-6)}`}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize flex-shrink-0 ${statusCls}`}>
                          {order.status || "—"}
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(order.created_at)}
                        </span>
                        {order.total != null && (
                          <span className="font-bold text-brand-600 text-sm">
                            {order.total?.toLocaleString()} {order.currency?.toUpperCase() || "AMD"}
                          </span>
                        )}
                        {items.length > 0 && (
                          <span>{items.length} item{items.length !== 1 ? "s" : ""}</span>
                        )}
                      </div>

                      {/* Delivery info */}
                      {(order.delivery_date || order.delivery_address) && (
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-surface-500">
                          {order.delivery_date && (
                            <span className="flex items-center gap-1">
                              <Calendar size={11} className="text-brand-400" />
                              {t.delivery}: {formatDate(order.delivery_date)}
                            </span>
                          )}
                          {order.delivery_address && (
                            <span className="flex items-center gap-1">
                              <MapPin size={11} className="text-brand-400" />
                              {order.delivery_address}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-surface-50">
                      <button
                        onClick={() => setExpandedId(expanded ? null : order.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer border-none bg-transparent transition-colors"
                      >
                        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {expanded ? t.hideItems : t.showItems(items.length)}
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded items */}
                {expanded && items.length > 0 && (
                  <div className="border-t border-surface-100 bg-surface-50 px-5 py-3 space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.product_name || ""} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            {item.product_id ? (
                              <Link href={`/${lang}/product/${item.product_id}`}
                                className="font-semibold text-surface-900 hover:text-brand-600 transition-colors no-underline flex items-center gap-1 truncate">
                                {item.product_name || `Item ${i + 1}`}
                                <ExternalLink size={10} className="flex-shrink-0 opacity-50" />
                              </Link>
                            ) : (
                              <span className="font-semibold text-surface-900">{item.product_name || `Item ${i + 1}`}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-surface-500 flex-shrink-0 ml-3">
                          <span>{t.qty}: {item.quantity || 1}</span>
                          {item.unit_price != null && (
                            <span className="font-bold text-surface-700">
                              {item.unit_price?.toLocaleString()} {order.currency?.toUpperCase() || "AMD"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
