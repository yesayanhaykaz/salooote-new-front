"use client";
import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { Package, ChevronDown, ChevronUp, ShoppingBag, Star } from "lucide-react";

/* ================= TRANSLATIONS ================= */

const translations = {
  en: {
    myOrders: "My Orders",
    ordersCount: (c) => `${c} order${c !== 1 ? "s" : ""}`,

    filters: {
      All: "All",
      Pending: "Pending",
      Confirmed: "Confirmed",
      Processing: "Processing",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    },

    empty: {
      title: "No orders found",
      all: "You haven't placed any orders yet.",
      filtered: "No orders with this status.",
    },

    review: {
      title: "Write a Review",
      order: (id) => `Order #${id}`,
      placeholder: "Share your experience...",
      cancel: "Cancel",
      submit: "Submit Review",
      submitting: "Submitting...",
    },

    order: {
      vendorFallback: (id) => `Vendor ···${id}`,
      itemsCount: (c) => `${c} item${c !== 1 ? "s" : ""}`,
      showItems: (c) => `Show ${c} items`,
      hideItems: "Hide items",
      writeReview: "Write a Review",
      itemFallback: (i) => `Item ${i}`,
    },
  },

  hy: {
    myOrders: "Իմ պատվերները",
    ordersCount: (c) => `${c} պատվեր`,

    filters: {
      All: "Բոլորը",
      Pending: "Սպասման մեջ",
      Confirmed: "Հաստատված",
      Processing: "Ընթացքում",
      Shipped: "Ուղարկված",
      Delivered: "Առաքված",
      Cancelled: "Չեղարկված",
    },

    empty: {
      title: "Պատվերներ չեն գտնվել",
      all: "Դուք դեռ պատվեր չեք կատարել",
      filtered: "Այս կարգավիճակով պատվերներ չկան",
    },

    review: {
      title: "Գրել կարծիք",
      order: (id) => `Պատվեր #${id}`,
      placeholder: "Կիսվեք ձեր փորձով...",
      cancel: "Չեղարկել",
      submit: "Ուղարկել կարծիքը",
      submitting: "Ուղարկվում է...",
    },

    order: {
      vendorFallback: (id) => `Վաճառող ···${id}`,
      itemsCount: (c) => `${c} ապրանք`,
      showItems: (c) => `Ցուցադրել ${c} ապրանք`,
      hideItems: "Թաքցնել ապրանքները",
      writeReview: "Գրել կարծիք",
      itemFallback: (i) => `Ապրանք ${i}`,
    },
  },

  ru: {
    myOrders: "Мои заказы",
    ordersCount: (c) => `${c} заказ${c !== 1 ? "ов" : ""}`,

    filters: {
      All: "Все",
      Pending: "В ожидании",
      Confirmed: "Подтвержден",
      Processing: "В обработке",
      Shipped: "Отправлен",
      Delivered: "Доставлен",
      Cancelled: "Отменен",
    },

    empty: {
      title: "Заказы не найдены",
      all: "Вы еще не сделали ни одного заказа",
      filtered: "Нет заказов с таким статусом",
    },

    review: {
      title: "Написать отзыв",
      order: (id) => `Заказ #${id}`,
      placeholder: "Поделитесь своим опытом...",
      cancel: "Отмена",
      submit: "Отправить отзыв",
      submitting: "Отправка...",
    },

    order: {
      vendorFallback: (id) => `Продавец ···${id}`,
      itemsCount: (c) => `${c} товар${c !== 1 ? "а" : ""}`,
      showItems: (c) => `Показать ${c} товаров`,
      hideItems: "Скрыть товары",
      writeReview: "Написать отзыв",
      itemFallback: (i) => `Товар ${i}`,
    },
  },
};

/* ================= COMPONENT ================= */

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

export default function AccountOrdersPage() {
  const [lang, setLang] = useState("hy"); // change default if needed
  const t = translations[lang];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewDone, setReviewDone] = useState({});

  useEffect(() => {
    userAPI.orders({ limit: 50 })
      .then(res => setOrders(res?.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-5">

      {/* Language Switch */}
      <div className="flex gap-2">
        {["en","hy","ru"].map(l => (
          <button key={l} onClick={() => setLang(l)} className="text-xs border px-2 py-1 rounded">
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t.myOrders}</h1>
        <span className="text-sm">{t.ordersCount(orders.length)}</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1 border rounded-full text-sm">
            {t.filters[f]}
          </button>
        ))}
      </div>

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <ShoppingBag size={24}/>
          <p className="font-semibold">{t.empty.title}</p>
          <p className="text-sm">
            {activeFilter === "All" ? t.empty.all : t.empty.filtered}
          </p>
        </div>
      )}

      {/* Orders */}
      {filtered.map(order => {
        const items = order.items || [];
        const expanded = expandedId === order.id;

        return (
          <div key={order.id} className="border rounded-xl p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">
                  {t.review.order(order.id?.slice(-8))}
                </p>
                <p className="text-xs">
                  {order.vendor_name || t.order.vendorFallback(order.vendor_id?.slice(-4))}
                </p>
              </div>
            </div>

            <div className="text-sm mt-2">
              {formatDate(order.created_at)} · {order.total} ֏ · {t.order.itemsCount(items.length)}
            </div>

            <div className="flex gap-3 mt-3">
              {items.length > 0 && (
                <button onClick={() => setExpandedId(expanded ? null : order.id)}>
                  {expanded ? t.order.hideItems : t.order.showItems(items.length)}
                </button>
              )}

              {(order.status === "completed" || order.status === "delivered") && !reviewDone[order.id] && (
                <button onClick={() => setReviewOrder(order)}>
                  {t.order.writeReview}
                </button>
              )}
            </div>

            {expanded && items.map((item, i) => (
              <div key={i} className="text-xs flex justify-between mt-2">
                <span>{item.product_name || t.order.itemFallback(i+1)}</span>
                <span>× {item.quantity} · {item.unit_price} ֏</span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-bold">{t.review.title}</h3>
            <p className="text-sm">{t.review.order(reviewOrder.id?.slice(-8))}</p>

            <textarea
              placeholder={t.review.placeholder}
              value={reviewText}
              onChange={(e)=>setReviewText(e.target.value)}
              className="w-full border mt-3 p-2"
            />

            <div className="flex gap-2 mt-4">
              <button onClick={()=>setReviewOrder(null)}>
                {t.review.cancel}
              </button>

              <button disabled={!reviewText.trim()}>
                {submittingReview ? t.review.submitting : t.review.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}