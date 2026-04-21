"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Trash2, Plus, Minus, ChevronRight, Shield, Truck, Tag, ArrowLeft, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Get lang from URL
  const lang = typeof window !== "undefined"
    ? (window.location.pathname.split("/")[1] || "en")
    : "en";

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-container mx-auto px-6 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Link href={`/${lang}/products`} className="flex items-center gap-2 text-surface-500 hover:text-brand-600 no-underline text-sm font-medium">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <span className="text-surface-200">/</span>
            <h1 className="text-2xl font-bold text-surface-900">Your Cart</h1>
          </div>
          <div className="text-center py-32 bg-white rounded-2xl border border-surface-200">
            <ShoppingCart size={48} className="text-surface-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Your cart is empty</h2>
            <p className="text-surface-400 mb-6">Discover amazing products for your next event</p>
            <Link href={`/${lang}/products`}>
              <button className="bg-brand-600 text-white border-none rounded-xl px-8 py-3 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-container mx-auto px-6 md:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/${lang}/products`} className="flex items-center gap-2 text-surface-500 hover:text-brand-600 no-underline text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <span className="text-surface-200">/</span>
          <h1 className="text-2xl font-bold text-surface-900">Your Cart</h1>
          <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2.5 py-1 rounded-full border border-brand-100">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
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
                { icon: Shield, text: "Secure checkout" },
                { icon: Truck,  text: "Fast delivery" },
                { icon: Tag,    text: "Best price guarantee" },
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
              <h2 className="font-bold text-surface-900 text-base mb-5">Order Summary</h2>

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
                  <span className="font-bold text-surface-900">Total</span>
                  <span className="font-bold text-brand-600 text-xl">{cartTotal.toLocaleString()} ֏</span>
                </div>
              </div>

              <Link href={`/${lang}/checkout`} className="no-underline block">
                <button className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 mb-3">
                  Proceed to Checkout <ChevronRight size={15} />
                </button>
              </Link>

              <p className="text-center text-xs text-surface-400 flex items-center justify-center gap-1.5">
                <Shield size={11} /> Secured with SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
