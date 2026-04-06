"use client";
import { useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, ChevronRight, ArrowLeft, CheckCircle2, Shield } from "lucide-react";

const STEPS = ["Cart", "Shipping", "Payment", "Confirm"];

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [step] = useState(2);

  return (
    <div className="min-h-screen bg-surface-50">

      {/* Progress bar */}
      <div className="bg-white border-b border-surface-200 py-4">
        <div className="max-w-[880px] mx-auto px-6 flex items-center justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 ${i <= step ? "text-surface-700" : "text-surface-300"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step  ? "bg-brand-600 text-white"
                  : i === step ? "bg-brand-50 text-brand-600 border-2 border-brand-500"
                  : "bg-surface-100 text-surface-400"
                }`}>
                  {i < step ? <CheckCircle2 size={13} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-surface-700" : "text-surface-400"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px ${i < step ? "bg-brand-400" : "bg-surface-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[880px] mx-auto px-6 md:px-8 py-10">
        <div className="flex gap-8 flex-wrap lg:flex-nowrap">

          {/* ── Forms ── */}
          <div className="flex-1 space-y-5">

            {/* Shipping */}
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h2 className="font-bold text-surface-900 text-base mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {["First Name", "Last Name", "Email", "Phone", "Street Address", "Apartment / Suite", "City", "Postal Code"].map((ph, i) => (
                  <input
                    key={i} placeholder={ph}
                    className={`px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-400 outline-none transition-all ${[4, 6].includes(i) ? "col-span-2" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h2 className="font-bold text-surface-900 text-base mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                Payment Method
              </h2>

              <div className="flex gap-3 mb-5">
                {[{ v: "card", l: "Credit / Debit" }, { v: "paypal", l: "PayPal" }, { v: "apple", l: "Apple Pay" }].map(({ v, l }) => (
                  <button
                    key={v} onClick={() => setMethod(v)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all ${
                      method === v
                        ? "border-brand-500 bg-brand-50 text-brand-600"
                        : "border-surface-200 bg-white text-surface-500 hover:border-surface-300"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {method === "card" && (
                <div className="space-y-3">
                  <div className="flex items-center border border-surface-200 rounded-xl px-4 py-3 focus-within:border-brand-500 transition-all bg-surface-50">
                    <CreditCard size={15} className="text-surface-400 mr-3" />
                    <input placeholder="Card number" className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-surface-400" />
                    <div className="flex gap-1">
                      {["VISA", "MC"].map((c, i) => (
                        <span key={i} className="text-[9px] font-bold text-surface-400 border border-surface-200 rounded px-1.5 py-0.5">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM / YY" className="px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-400 outline-none" />
                    <div className="flex items-center border border-surface-200 rounded-xl px-4 py-3 bg-surface-50 focus-within:border-brand-500 transition-all">
                      <input placeholder="CVV" className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-surface-400" />
                      <Lock size={13} className="text-surface-300" />
                    </div>
                  </div>
                  <input placeholder="Cardholder name" className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-400 outline-none" />
                </div>
              )}

              {method !== "card" && (
                <div className="text-center py-8 bg-surface-50 rounded-xl border border-dashed border-surface-200">
                  <p className="text-surface-400 text-sm">
                    You'll be redirected to {method === "paypal" ? "PayPal" : "Apple Pay"} to complete your payment.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-surface-400">
              <Shield size={13} className="text-brand-400" />
              Your payment information is encrypted and secure.
            </div>
          </div>

          {/* ── Summary ── */}
          <div className="w-full lg:w-[300px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-surface-200 p-6 sticky top-24">
              <h2 className="font-bold text-surface-900 text-base mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-[180px] overflow-y-auto hide-scrollbar">
                {[
                  { name: "Premium Wedding Cake", price: 250, img: "/images/wedding-cake.jpg" },
                  { name: "Flower Arrangement",   price: 65,  img: "/images/flowers-roses.jpg" },
                  { name: "Party Bundle",          price: 45,  img: "/images/party-balloons.jpg" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100 relative">
                      <img src={item.img} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-surface-700 truncate">{item.name}</p>
                    </div>
                    <p className="text-sm font-bold text-surface-800 flex-shrink-0">${item.price}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-100 pt-4 space-y-2 mb-5">
                {[["Subtotal", "$360.00"], ["Discount (SAVE10)", "-$36.00"], ["Delivery", "FREE"]].map(([k, v], i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-surface-400">{k}</span>
                    <span className={`font-semibold ${v.includes("-") ? "text-sage-600" : "text-surface-700"}`}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-surface-100">
                  <span className="font-bold text-surface-900 text-sm">Total</span>
                  <span className="font-bold text-brand-600 text-lg">$324.00</span>
                </div>
              </div>

              <button className="btn-primary w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 mb-4">
                <Lock size={14} /> Place Order
              </button>

              <div className="flex items-center justify-center gap-2">
                {["VISA", "MC", "AMEX", "PP"].map((c, i) => (
                  <span key={i} className="text-[9px] font-bold text-surface-400 border border-surface-200 rounded px-2 py-1">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
