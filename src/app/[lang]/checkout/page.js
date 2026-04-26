"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { userAPI, isLoggedIn } from "@/lib/api";
import {
  ArrowLeft, MapPin, Phone, User, FileText, Calendar,
  CheckCircle2, Loader2, ShoppingBag, Shield, ChevronRight,
  Package, AlertCircle, Truck, ChevronLeft,
} from "lucide-react";

const T = {
  en: {
    backToCart: "Back to cart",
    checkout: "Checkout",
    deliveryDetails: "Delivery details",
    fullName: "Full name", fullNameRequired: "Full name *",
    fullNamePh: "Your full name",
    phone: "Phone number", phoneRequired: "Phone number *",
    phonePh: "+374 XX XXX XXX",
    address: "Delivery address", addressRequired: "Delivery address *",
    addressPh: "Street address",
    city: "City *", cityPh: "Yerevan",
    deliveryDate: "Delivery date *",
    deliveryDateHint: "Choose your preferred delivery / event date",
    notes: "Order notes (optional)",
    notesPh: "Any special requests or delivery instructions…",
    yourItems: "Your items",
    summary: "Order summary",
    subtotal: "Subtotal",
    deliveryRow: "Delivery",
    deliveryFree: "Free",
    total: "Total",
    placeOrder: "Place order",
    placing: "Placing order…",
    sslSecured: "Secured with SSL encryption",
    multiVendorNotice: "Your cart has items from multiple vendors — separate orders will be placed.",
    invalidItemsNotice: "items can't be ordered (missing vendor info) and will be skipped.",
    successTitle: "Order placed! 🎉",
    successOne: "Your order has been sent to the vendor.",
    successMany: "orders have been sent to the vendors.",
    successHint: "You'll get a notification when your order is confirmed.",
    trackOrders: "Track my orders",
    continueShopping: "Continue shopping",
    errorMissing: "Please fill in your name, phone, delivery address, city, and delivery date.",
    errorVendorless: "Some items are missing vendor information. Please remove them and try again.",
    errorGeneric: "Failed to place order. Please try again.",
    deliveryFee: "Delivery fee",
  },
  hy: {
    backToCart: "Վերադառնալ զամբյուղ",
    checkout: "Վճարում",
    deliveryDetails: "Առաքման տվյալներ",
    fullName: "Անուն Ազգանուն", fullNameRequired: "Անուն Ազգանուն *",
    fullNamePh: "Ձեր անուն-ազգանունը",
    phone: "Հեռախոս", phoneRequired: "Հեռախոս *",
    phonePh: "+374 XX XXX XXX",
    address: "Առաքման հասցե", addressRequired: "Առաքման հասցե *",
    addressPh: "Փողոց, շենք",
    city: "Քաղաք *", cityPh: "Երևան",
    deliveryDate: "Առաքման ամսաթիվ *",
    deliveryDateHint: "Ընտրեք առաքման / միջոցառման ցանկալի օրը",
    notes: "Նշումներ (ոչ պարտադիր)",
    notesPh: "Հատուկ խնդրանքներ կամ առաքման ցուցումներ…",
    yourItems: "Ձեր ապրանքները",
    summary: "Պատվերի ամփոփում",
    subtotal: "Միջանկյալ գումար",
    deliveryRow: "Առաքում",
    deliveryFree: "Անվճար",
    total: "Ընդամենը",
    placeOrder: "Հաստատել պատվերը",
    placing: "Հաստատվում է…",
    sslSecured: "Պաշտպանված SSL գաղտնագրությամբ",
    multiVendorNotice: "Ձեր զամբյուղում կան տարբեր վաճառողների ապրանքներ — կկատարվեն առանձին պատվերներ։",
    invalidItemsNotice: "ապրանք չի կարող պատվիրվել (բացակայում է վաճառողի տվյալը) և կբացառվի։",
    successTitle: "Պատվերը կատարված է! 🎉",
    successOne: "Ձեր պատվերն ուղարկվել է վաճառողին։",
    successMany: "պատվեր ուղարկվել է վաճառողներին։",
    successHint: "Կստանաք ծանուցում, երբ պատվերը հաստատվի։",
    trackOrders: "Տեսնել իմ պատվերները",
    continueShopping: "Շարունակել գնումները",
    errorMissing: "Խնդրում ենք լրացնել անուն, հեռախոս, հասցե, քաղաք և ամսաթիվ։",
    errorVendorless: "Որոշ ապրանքներ չունեն վաճառողի տվյալներ։ Հեռացրեք դրանք և կրկին փորձեք։",
    errorGeneric: "Չհաջողվեց պատվիրել։ Կրկին փորձեք։",
    deliveryFee: "Առաքման վճար",
  },
  ru: {
    backToCart: "Назад в корзину",
    checkout: "Оформление",
    deliveryDetails: "Данные доставки",
    fullName: "ФИО", fullNameRequired: "ФИО *",
    fullNamePh: "Ваше полное имя",
    phone: "Телефон", phoneRequired: "Телефон *",
    phonePh: "+374 XX XXX XXX",
    address: "Адрес доставки", addressRequired: "Адрес доставки *",
    addressPh: "Улица, дом",
    city: "Город *", cityPh: "Ереван",
    deliveryDate: "Дата доставки *",
    deliveryDateHint: "Выберите желаемую дату доставки / события",
    notes: "Комментарии (необязательно)",
    notesPh: "Особые пожелания или указания…",
    yourItems: "Ваши товары",
    summary: "Сводка заказа",
    subtotal: "Сумма",
    deliveryRow: "Доставка",
    deliveryFree: "Бесплатно",
    total: "Итого",
    placeOrder: "Оформить заказ",
    placing: "Оформление…",
    sslSecured: "Защищено SSL-шифрованием",
    multiVendorNotice: "В корзине товары от разных продавцов — будут оформлены отдельные заказы.",
    invalidItemsNotice: "товаров нельзя заказать (нет данных продавца) и они будут пропущены.",
    successTitle: "Заказ оформлен! 🎉",
    successOne: "Ваш заказ отправлен продавцу.",
    successMany: "заказов отправлено продавцам.",
    successHint: "Вы получите уведомление, когда заказ подтвердят.",
    trackOrders: "Мои заказы",
    continueShopping: "Продолжить покупки",
    errorMissing: "Пожалуйста, заполните имя, телефон, адрес, город и дату доставки.",
    errorVendorless: "У некоторых товаров нет данных продавца. Удалите их и попробуйте снова.",
    errorGeneric: "Не удалось оформить заказ. Попробуйте ещё раз.",
    deliveryFee: "Стоимость доставки",
  },
};

// City-based delivery fees (AMD). 0 = free.
// Easy to swap for backend-driven values later.
const DELIVERY_FEES_AMD = {
  yerevan:    0,
  ереван:     0,
  երևան:      0,
  // Outside Yerevan defaults to a flat rate
  default:    1500,
};

function deliveryFeeForCity(city = "") {
  const c = city.trim().toLowerCase();
  if (!c) return 0;
  if (DELIVERY_FEES_AMD[c] != null) return DELIVERY_FEES_AMD[c];
  return DELIVERY_FEES_AMD.default;
}

// Min selectable delivery date is tomorrow (so vendors have prep time)
function minDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const MONTH_NAMES = {
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  hy: ["Հունվար","Փետրվար","Մարտ","Ապրիլ","Մայիս","Հունիս","Հուլիս","Օգոստոս","Սեպտեմբեր","Հոկտեմբեր","Նոյեմբեր","Դեկտեմբեր"],
  ru: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
};
const DAY_NAMES = {
  en: ["Su","Mo","Tu","We","Th","Fr","Sa"],
  hy: ["Կ","Ե","Ե","Չ","Հ","Ու","Շ"],
  ru: ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
};

function formatDisplayDate(iso, lang) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
  return `${d} ${months[m - 1]} ${y}`;
}

function DatePicker({ value, onChange, minDate, lang, hint, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const today = new Date();
  const initDate = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState((initDate || today).getFullYear());
  const [viewMonth, setViewMonth] = useState((initDate || today).getMonth());

  const minParts = minDate.split("-").map(Number);
  const minTs = new Date(minParts[0], minParts[1] - 1, minParts[2]).getTime();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
  const days   = DAY_NAMES[lang]   || DAY_NAMES.en;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function selectDay(day) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(iso);
    setOpen(false);
  }

  function isDayDisabled(day) {
    const ts = new Date(viewYear, viewMonth, day).getTime();
    return ts < minTs;
  }

  function isSelected(day) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return iso === value;
  }

  function isToday(day) {
    return viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full px-4 py-3 text-sm border rounded-xl outline-none transition-all bg-white flex items-center gap-3 text-left cursor-pointer ${
          open ? "border-brand-400 ring-2 ring-brand-100" : "border-surface-200 hover:border-surface-300"
        } ${!value ? "text-surface-300" : "text-surface-900"}`}
      >
        <Calendar size={14} className="text-surface-300 flex-shrink-0" />
        <span className="flex-1">{value ? formatDisplayDate(value, lang) : label}</span>
        <ChevronRight size={14} className={`text-surface-300 flex-shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 bg-white rounded-2xl border border-surface-200 shadow-xl p-4 w-[300px]">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-100 transition-colors border-none bg-transparent cursor-pointer">
              <ChevronLeft size={16} className="text-surface-600" />
            </button>
            <span className="text-sm font-bold text-surface-900">{months[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-100 transition-colors border-none bg-transparent cursor-pointer">
              <ChevronRight size={16} className="text-surface-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {days.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-surface-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const disabled = isDayDisabled(day);
              const selected = isSelected(day);
              const todayMark = isToday(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={`h-8 w-8 mx-auto rounded-full text-xs font-medium transition-all border-none cursor-pointer flex items-center justify-center ${
                    selected
                      ? "bg-brand-600 text-white font-bold shadow-sm"
                      : disabled
                      ? "text-surface-200 cursor-not-allowed bg-transparent"
                      : todayMark
                      ? "bg-brand-50 text-brand-600 font-bold hover:bg-brand-100"
                      : "text-surface-700 bg-transparent hover:bg-surface-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {hint && <p className="text-[11px] text-surface-400 mt-3 text-center">{hint}</p>}
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lang } = useParams();
  const t = T[lang] || T.en;
  const { cartItems, cartTotal, itemsByVendor, clearCart, hydrated } = useCart();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    delivery_date: "",
    notes: "",
  });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error,   setError]     = useState("");
  const [orderIds, setOrderIds] = useState([]);

  // Auth guard
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(`/${lang}/login?redirect=/${lang}/checkout`);
    }
  }, [lang]);

  // Redirect empty cart
  useEffect(() => {
    if (hydrated && cartItems.length === 0 && !success) {
      router.replace(`/${lang}/products`);
    }
  }, [hydrated, cartItems.length, success]);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // Compute delivery fee dynamically based on city
  const deliveryFee = useMemo(() => deliveryFeeForCity(form.city), [form.city]);
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!form.full_name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.delivery_date) {
      setError(t.errorMissing);
      return;
    }
    setError("");
    setLoading(true);

    const shipping_address = [form.address.trim(), form.city.trim()].filter(Boolean).join(", ");
    const notes = form.notes.trim() || undefined;
    const createdIds = [];

    try {
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID = (v) => UUID_RE.test(v);

      const vendorGroups = Object.values(itemsByVendor);

      const validGroups = vendorGroups.filter(g => isUUID(g.vendor_id));
      if (validGroups.length === 0) {
        setError(t.errorVendorless);
        setLoading(false);
        return;
      }

      for (const group of validGroups) {
        const validItems = group.items.filter(i => isUUID(i.product_id || i.id));
        if (validItems.length === 0) continue;

        const payload = {
          vendor_id:        group.vendor_id,
          shipping_name:    form.full_name.trim(),
          shipping_address: shipping_address,
          shipping_phone:   form.phone.trim(),
          shipping_city:    form.city.trim() || undefined,
          delivery_date:    form.delivery_date,
          delivery_fee:     deliveryFee || undefined,
          notes,
          currency: "AMD",
          items: validItems.map(i => ({
            product_id: i.product_id || i.id,
            quantity:   i.qty,
            unit_price: Number(i.price),
          })),
        };
        const res = await userAPI.createOrder(payload);
        const orderId = res?.data?.id || res?.id;
        if (orderId) createdIds.push(orderId);
      }

      setOrderIds(createdIds);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">{t.successTitle}</h1>
          <p className="text-surface-400 text-sm mb-1">
            {orderIds.length > 1
              ? `${orderIds.length} ${t.successMany}`
              : t.successOne}
          </p>
          <p className="text-surface-400 text-sm mb-8">{t.successHint}</p>

          <div className="flex flex-col gap-3">
            <Link href={`/${lang}/account/orders`} className="no-underline">
              <button className="w-full bg-brand-600 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                <Package size={15} /> {t.trackOrders}
              </button>
            </Link>
            <Link href={`/${lang}/products`} className="no-underline">
              <button className="w-full bg-white text-surface-700 border border-surface-200 rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-surface-50 transition-colors">
                {t.continueShopping}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const vendorGroups = Object.values(itemsByVendor);
  const invalidItems = cartItems.filter(i => !UUID_RE.test(i.vendor_id));
  const inputCls = "w-full px-4 py-3 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white placeholder:text-surface-300";
  const minDate = minDeliveryDate();

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-container mx-auto px-6 md:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Link href={`/${lang}/cart`} className="flex items-center gap-2 text-surface-500 hover:text-brand-600 no-underline text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> {t.backToCart}
          </Link>
          <span className="text-surface-200">/</span>
          <h1 className="text-2xl font-bold text-surface-900">{t.checkout}</h1>
        </div>

        <div className="flex gap-8 flex-wrap lg:flex-nowrap">

          {/* ── Left: Delivery form ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Delivery details */}
            <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
              <h2 className="font-bold text-surface-900 text-sm mb-5 flex items-center gap-2">
                <MapPin size={15} className="text-brand-500" /> {t.deliveryDetails}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.fullNameRequired}</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" />
                    <input
                      name="full_name" value={form.full_name} onChange={set}
                      placeholder={t.fullNamePh}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.phoneRequired}</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" />
                    <input
                      name="phone" value={form.phone} onChange={set}
                      placeholder={t.phonePh}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.addressRequired}</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" />
                    <input
                      name="address" value={form.address} onChange={set}
                      placeholder={t.addressPh}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.city}</label>
                  <input
                    name="city" value={form.city} onChange={set}
                    placeholder={t.cityPh}
                    className={inputCls}
                  />
                </div>

                {/* Delivery date */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.deliveryDate}</label>
                  <DatePicker
                    value={form.delivery_date}
                    onChange={(iso) => setForm(p => ({ ...p, delivery_date: iso }))}
                    minDate={minDate}
                    lang={lang || "en"}
                    hint={t.deliveryDateHint}
                    label={t.deliveryDateHint}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                    <FileText size={12} className="inline mr-1" />{t.notes}
                  </label>
                  <textarea
                    name="notes" value={form.notes} onChange={set}
                    rows={3}
                    placeholder={t.notesPh}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Order breakdown by vendor */}
            {vendorGroups.length > 0 && (
              <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
                <h2 className="font-bold text-surface-900 text-sm mb-5 flex items-center gap-2">
                  <ShoppingBag size={15} className="text-brand-500" /> {t.yourItems}
                </h2>
                <div className="space-y-5">
                  {vendorGroups.map((group) => (
                    <div key={group.vendor_id}>
                      {vendorGroups.length > 1 && (
                        <p className="text-xs font-bold text-surface-500 uppercase tracking-wide mb-2">
                          {group.vendor_name || "Vendor"}
                        </p>
                      )}
                      <div className="space-y-3">
                        {group.items.map(item => (
                          <div key={item.id || item.product_id} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-surface-100 flex-shrink-0 overflow-hidden">
                              {item.image
                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-lg">🛍️</div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-surface-800 truncate">{item.name}</p>
                              {item.variant && <p className="text-xs text-surface-400">{item.variant}</p>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-surface-900">
                                {(Number(item.price) * item.qty).toLocaleString()} ֏
                              </p>
                              <p className="text-xs text-surface-400">× {item.qty}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {vendorGroups.length > 1 && (
                        <div className="mt-3 pt-3 border-t border-surface-100 flex justify-between text-xs font-semibold text-surface-500">
                          <span>{t.subtotal} ({group.vendor_name})</span>
                          <span className="text-surface-800">
                            {group.items.reduce((s, i) => s + Number(i.price) * i.qty, 0).toLocaleString()} ֏
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Summary + Place Order ── */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-surface-200 p-6 sticky top-24 shadow-sm">
              <h2 className="font-bold text-surface-900 text-base mb-5">{t.summary}</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-surface-500 truncate flex-1 mr-2">{item.name} × {item.qty}</span>
                    <span className="font-medium text-surface-800 flex-shrink-0">
                      {(Number(item.price) * item.qty).toLocaleString()} ֏
                    </span>
                  </div>
                ))}
                <div className="h-px bg-surface-100 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">{t.subtotal}</span>
                  <span className="font-medium text-surface-800">{cartTotal.toLocaleString()} ֏</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500 inline-flex items-center gap-1">
                    <Truck size={11} /> {t.deliveryRow}
                  </span>
                  {deliveryFee === 0
                    ? <span className="text-sm font-medium text-green-600">{t.deliveryFree}</span>
                    : <span className="text-sm font-medium text-surface-800">{deliveryFee.toLocaleString()} ֏</span>
                  }
                </div>
                <div className="h-px bg-surface-100 my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-surface-900">{t.total}</span>
                  <span className="font-bold text-brand-600 text-xl">{grandTotal.toLocaleString()} ֏</span>
                </div>
              </div>

              {/* Invalid items warning */}
              {invalidItems.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ {invalidItems.length} {t.invalidItemsNotice}
                  </p>
                </div>
              )}

              {/* Multi-vendor notice */}
              {vendorGroups.length > 1 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                  <p className="text-xs text-amber-700 font-medium">
                    📦 {t.multiVendorNotice.replace("multiple vendors", `${vendorGroups.length} vendors`)}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> {t.placing}</>
                  : <><ShoppingBag size={15} /> {t.placeOrder} <ChevronRight size={14} /></>
                }
              </button>

              <p className="text-center text-xs text-surface-400 flex items-center justify-center gap-1.5">
                <Shield size={11} /> {t.sslSecured}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
