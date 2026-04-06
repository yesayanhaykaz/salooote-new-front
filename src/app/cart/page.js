"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SAMPLE_PRODUCTS } from "@/lib/data";
import { Trash2, Plus, Minus, ChevronRight, Tag, Shield, Truck, ArrowLeft } from "lucide-react";

const productImages = {
  1: "/images/wedding-cake.jpg", 2: "/images/party-balloons.jpg",
  3: "/images/flowers-roses.jpg", 4: "/images/cupcakes.jpg", 5: "/images/catering-setup.jpg",
};

export default function CartPage() {
  const [items, setItems] = useState(
    SAMPLE_PRODUCTS.slice(0, 3).map(p => ({ ...p, qty: 1, img: productImages[p.id] || null }))
  );
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id, delta) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const delivery  = subtotal > 100 ? 0 : 15;
  const total     = subtotal - discount + delivery;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-container mx-auto px-6 md:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="flex items-center gap-2 text-surface-500 hover:text-brand-600 transition-colors no-underline text-sm font-medium">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <span className="text-surface-200">/</span>
          <h1 className="text-2xl font-bold text-surface-900">Your Cart</h1>
          <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2.5 py-1 rounded-full border border-brand-100">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-surface-200">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Your cart is empty</h2>
            <p className="text-surface-400 mb-6 text-base">Discover amazing products for your next event</p>
            <Link href="/products">
              <button className="btn-primary bg-brand-600 text-white border-none rounded-xl px-8 py-3 text-sm font-semibold cursor-pointer">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-8 flex-wrap lg:flex-nowrap">

            {/* Cart items */}
            <div className="flex-1 min-w-0 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-surface-200 flex items-center gap-4 p-5 flex-wrap">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100">
                    {item.img
                      ? <Image src={item.img} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                      : <div className={`w-full h-full bg-gradient-to-br ${item.gradient}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <p className="font-semibold text-sm text-surface-800 mb-0.5">{item.name}</p>
                    <p className="text-xs text-surface-400 mb-2">{item.vendor}</p>
                    <p className="font-bold text-brand-600 text-base">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer hover:bg-surface-100 transition-colors">
                      <Minus size={13} className="text-surface-600" />
                    </button>
                    <span className="w-9 text-center text-sm font-bold text-surface-800">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer hover:bg-surface-100 transition-colors">
                      <Plus size={13} className="text-surface-600" />
                    </button>
                  </div>
                  <p className="font-bold text-surface-900 text-base min-w-[64px] text-right">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => remove(item.id)} className="border-none bg-transparent cursor-pointer p-2 rounded-xl hover:bg-surface-100 transition-colors group">
                    <Trash2 size={15} className="text-surface-400 group-hover:text-accent-500 transition-colors" />
                  </button>
                </div>
              ))}

              {/* Trust row */}
              <div className="flex gap-6 flex-wrap pt-2">
                {[
                  { icon: Shield, text: "Secure payment" },
                  { icon: Truck,  text: "Free delivery over $100" },
                  { icon: Tag,    text: "Price guarantee" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 text-surface-400 text-xs">
                    <Icon size={13} className="text-brand-400" /> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-[340px] flex-shrink-0">
              <div className="bg-white rounded-xl border border-surface-200 p-6 sticky top-24">
                <h2 className="font-bold text-surface-900 text-base mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-surface-800">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-sage-600">Promo discount (10%)</span>
                      <span className="font-semibold text-sage-600">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Delivery</span>
                    <span className="font-semibold text-surface-800">{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}</span>
                  </div>
                  <div className="h-px bg-surface-100" />
                  <div className="flex justify-between">
                    <span className="font-bold text-surface-900">Total</span>
                    <span className="font-bold text-brand-600 text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo */}
                <div className="flex gap-2 mb-5">
                  <div className="flex-1 flex items-center border border-surface-200 rounded-xl px-3 py-2.5 focus-within:border-brand-500 transition-colors">
                    <Tag size={13} className="text-surface-400 mr-2" />
                    <input
                      value={promo} onChange={e => setPromo(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-surface-400"
                    />
                  </div>
                  <button
                    onClick={() => setPromoApplied(promo.length > 0)}
                    className="bg-surface-100 text-surface-700 border-none rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                <Link href="/payment" className="no-underline">
                  <button className="btn-primary w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 mb-3">
                    Checkout — ${total.toFixed(2)} <ChevronRight size={15} />
                  </button>
                </Link>

                <p className="text-center text-xs text-surface-400 flex items-center justify-center gap-1.5">
                  <Shield size={11} /> Secured by SSL encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
