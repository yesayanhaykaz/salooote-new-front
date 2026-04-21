"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { userAPI, isLoggedIn } from "@/lib/api";
import {
  ArrowLeft, MapPin, Phone, User, FileText,
  CheckCircle2, Loader2, ShoppingBag, Shield, ChevronRight,
  Package, AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { lang } = useParams();
  const { cartItems, cartTotal, itemsByVendor, clearCart, hydrated } = useCart();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
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

  const handlePlaceOrder = async () => {
    if (!form.full_name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Please fill in your name, phone, and delivery address.");
      return;
    }
    setError("");
    setLoading(true);

    const shipping_address = [form.address.trim(), form.city.trim()].filter(Boolean).join(", ");
    const notes = form.notes.trim() || undefined;
    const createdIds = [];

    try {
      // One order per vendor group
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID = (v) => UUID_RE.test(v);

      const vendorGroups = Object.values(itemsByVendor);

      // Filter out groups with no real vendor_id
      const validGroups = vendorGroups.filter(g => isUUID(g.vendor_id));
      if (validGroups.length === 0) {
        setError("Some items are missing vendor information. Please remove them and try again.");
        setLoading(false);
        return;
      }

      for (const group of validGroups) {
        // Filter items with valid product UUIDs
        const validItems = group.items.filter(i => isUUID(i.product_id || i.id));
        if (validItems.length === 0) continue;

        const payload = {
          vendor_id:       group.vendor_id,
          shipping_name:   form.full_name.trim(),
          shipping_address: shipping_address,
          shipping_phone:  form.phone.trim(),
          shipping_city:   form.city.trim() || undefined,
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
      setError(err.message || "Failed to place order. Please try again.");
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
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-surface-400 text-sm mb-1">
            {orderIds.length > 1
              ? `${orderIds.length} orders have been sent to the vendors.`
              : "Your order has been sent to the vendor."}
          </p>
          <p className="text-surface-400 text-sm mb-8">
            You'll get a notification when your order is confirmed.
          </p>

          <div className="flex flex-col gap-3">
            <Link href={`/${lang}/account/orders`} className="no-underline">
              <button className="w-full bg-brand-600 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                <Package size={15} /> Track My Orders
              </button>
            </Link>
            <Link href={`/${lang}/products`} className="no-underline">
              <button className="w-full bg-white text-surface-700 border border-surface-200 rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-surface-50 transition-colors">
                Continue Shopping
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

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-container mx-auto px-6 md:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/${lang}/cart`} className="flex items-center gap-2 text-surface-500 hover:text-brand-600 no-underline text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <span className="text-surface-200">/</span>
          <h1 className="text-2xl font-bold text-surface-900">Checkout</h1>
        </div>

        <div className="flex gap-8 flex-wrap lg:flex-nowrap">

          {/* ── Left: Delivery form ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Delivery details */}
            <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
              <h2 className="font-bold text-surface-900 text-sm mb-5 flex items-center gap-2">
                <MapPin size={15} className="text-brand-500" /> Delivery Details
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" />
                    <input
                      name="full_name" value={form.full_name} onChange={set}
                      placeholder="Your full name"
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" />
                    <input
                      name="phone" value={form.phone} onChange={set}
                      placeholder="+374 XX XXX XXX"
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">Delivery Address *</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" />
                    <input
                      name="address" value={form.address} onChange={set}
                      placeholder="Street address"
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">City</label>
                  <input
                    name="city" value={form.city} onChange={set}
                    placeholder="Yerevan"
                    className={inputCls}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                    <FileText size={12} className="inline mr-1" />Order Notes (optional)
                  </label>
                  <textarea
                    name="notes" value={form.notes} onChange={set}
                    rows={3}
                    placeholder="Any special requests or delivery instructions…"
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Order breakdown by vendor */}
            {vendorGroups.length > 0 && (
              <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
                <h2 className="font-bold text-surface-900 text-sm mb-5 flex items-center gap-2">
                  <ShoppingBag size={15} className="text-brand-500" /> Your Items
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
                          <span>Subtotal ({group.vendor_name})</span>
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
                  <span className="text-sm text-surface-500">Delivery</span>
                  <span className="text-sm font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-surface-900">Total</span>
                  <span className="font-bold text-brand-600 text-xl">{cartTotal.toLocaleString()} ֏</span>
                </div>
              </div>

              {/* Invalid items warning */}
              {invalidItems.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ {invalidItems.length} item{invalidItems.length !== 1 ? "s" : ""} can't be ordered (missing vendor info) and will be skipped.
                  </p>
                </div>
              )}

              {/* Multi-vendor notice */}
              {vendorGroups.length > 1 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                  <p className="text-xs text-amber-700 font-medium">
                    📦 Your cart has items from {vendorGroups.length} vendors — {vendorGroups.length} separate orders will be placed.
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
                  ? <><Loader2 size={15} className="animate-spin" /> Placing Order…</>
                  : <><ShoppingBag size={15} /> Place Order <ChevronRight size={14} /></>
                }
              </button>

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
