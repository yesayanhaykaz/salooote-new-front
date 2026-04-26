"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Trash2, Plus, Minus, ChevronRight, Shield, Truck, Tag, ArrowLeft, ShoppingCart } from "lucide-react";

const T = {
  en: {
    continue: "Continue shopping",
    yourCart: "Your cart",
    items: "items",
    item: "item",
    empty: "Your cart is empty",
    emptyBody: "Discover amazing products for your next event",
    browse: "Browse products",
    summary: "Order summary",
    total: "Total",
    checkout: "Proceed to checkout",
    sslSecured: "Secured with SSL encryption",
    secureCheckout: "Secure checkout",
    fastDelivery: "Fast delivery",
    bestPrice: "Best price guarantee",
  },
  hy: {
    continue: "Շարունակել գնումները",
    yourCart: "Իմ զամբյուղը",
    items: "ապրանք",
    item: "ապրանք",
    empty: "Զամբյուղը դատարկ է",
    emptyBody: "Բացահայտեք հրաշալի ապրանքներ ձեր հաջորդ իրադարձության համար",
    browse: "Թերթել ապրանքները",
    summary: "Պատվերի ամփոփում",
    total: "Ընդամենը",
    checkout: "Շարունակել վճարման",
    sslSecured: "Պաշտպանված SSL գաղտնագրությամբ",
    secureCheckout: "Անվտանգ վճարում",
    fastDelivery: "Արագ առաքում",
    bestPrice: "Լավագույն գին",
  },
  ru: {
    continue: "Продолжить покупки",
    yourCart: "Корзина",
    items: "товаров",
    item: "товар",
    empty: "Корзина пуста",
    emptyBody: "Найдите отличные товары для следующего события",
    browse: "Перейти к товарам",
    summary: "Сводка заказа",
    total: "Итого",
    checkout: "Перейти к оформлению",
    sslSecured: "Защищено SSL-шифрованием",
    secureCheckout: "Безопасная оплата",
    fastDelivery: "Быстрая доставка",
    bestPrice: "Лучшая цена",
  },
};

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seg = window.location.pathname.split("/")[1];
    if (seg === "en" || seg === "hy" || seg === "ru") setLang(seg);
  }, []);

  const t = T[lang] || T.en;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-container mx-auto px-6 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Link href={`/${lang}/products`} className="flex items-center gap-2 text-surface-500 hover:text-brand-600 no-underline text-sm font-medium">
              <ArrowLeft size={16} /> {t.continue}
            </Link>
            <span className="text-surface-200">/</span>
            <h1 className="text-2xl font-bold text-surface-900">{t.yourCart}</h1>
          </div>
          <div className="text-center py-32 bg-white rounded-2xl border border-surface-200">
            <ShoppingCart size={48} className="text-surface-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-surface-900 mb-2">{t.empty}</h2>
            <p className="text-surface-400 mb-6">{t.emptyBody}</p>
            <Link href={`/${lang}/products`}>
              <button className="bg-brand-600 text-white border-none rounded-xl px-8 py-3 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                {t.browse}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cartCount = cartItems.length;
  const cartCountLabel = cartCount === 1 ? t.item : t.items;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-container mx-auto px-6 md:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Link href={`/${lang}/products`} className="flex items-center gap-2 text-surface-500 hover:text-brand-600 no-underline text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> {t.continue}
          </Link>
          <span className="text-surface-200">/</span>
          <h1 className="text-2xl font-bold text-surface-900">{t.yourCart}</h1>
          <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2.5 py-1 rounded-full border border-brand-100">
            {cartCount} {cartCountLabel}
          </span>
        </div>

        <div className="flex gap-8 flex-wrap lg:flex-nowrap">

          {/* Items */}
          <div className="flex-1 min-w-0 space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-surface-200 flex items-center gap-4 p-5 flex-wrap hover:border-surface-300 transition-colors">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-2xl">🛍️</div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-[160px]">
                  <p className="font-semibold text-sm text-surface-900 mb-0.5">{item.name}</p>
                  {item.variant && <p className="text-xs text-surface-400 mb-0.5">{item.variant}</p>}
                  {item.vendor_name && <p className="text-xs text-surface-400 mb-1">{item.vendor_name}</p>}
                  <p className="font-bold text-brand-600 text-base">{Number(item.price).toLocaleString()} ֏</p>
                </div>

                {/* Qty */}
                <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.qty - 1)}
                    className="w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer hover:bg-surface-100 transition-colors">
                    <Minus size={13} className="text-surface-600" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-surface-800">{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, item.qty + 1)}
                    className="w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer hover:bg-surface-100 transition-colors">
                    <Plus size={13} className="text-surface-600" />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="font-bold text-surface-900 text-base min-w-[80px] text-right">
                  {(Number(item.price) * item.qty).toLocaleString()} ֏
                </p>

                {/* Remove */}
                <button onClick={() => removeFromCart(item.id)}
                  className="border-none bg-transparent cursor-pointer p-2 rounded-xl hover:bg-red-50 transition-colors group">
                  <Trash2 size={15} className="text-surface-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))}

            {/* Trust row */}
            <div className="flex gap-6 flex-wrap pt-2">
              {[
                { icon: Shield, text: t.secureCheckout },
                { icon: Truck,  text: t.fastDelivery },
                { icon: Tag,    text: t.bestPrice },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-surface-400 text-xs">
                  <Icon size={13} className="text-brand-400" /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
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
                <div className="flex justify-between">
                  <span className="font-bold text-surface-900">{t.total}</span>
                  <span className="font-bold text-brand-600 text-xl">{cartTotal.toLocaleString()} ֏</span>
                </div>
              </div>

              <Link href={`/${lang}/checkout`} className="no-underline block">
                <button className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 mb-3">
                  {t.checkout} <ChevronRight size={15} />
                </button>
              </Link>

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
