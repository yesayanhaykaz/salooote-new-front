"use client";
import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { Package, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  pending:    "bg-amber-50  text-amber-600  border-amber-200",
  confirmed:  "bg-blue-50   text-blue-600   border-blue-200",
  processing: "bg-blue-50   text-blue-600   border-blue-200",
  shipped:    "bg-violet-50 text-violet-600 border-violet-200",
  delivered:  "bg-green-50  text-green-600  border-green-200",
  cancelled:  "bg-red-50    text-red-500    border-red-200",
};

function Badge({ status }) {
  const cls = STATUS_STYLES[status?.toLowerCase()] || "bg-surface-100 text-surface-500 border-surface-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${cls}`}>
      {status || "—"}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AccountOrdersPage() {
  const [orders,       setOrders]      = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [activeFilter, setFilter]      = useState("All");
  const [expandedId,   setExpandedId]  = useState(null);

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
        <h1 className="text-xl font-bold text-surface-900">My Orders</h1>
        <span className="text-sm text-surface-400">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
              activeFilter === f
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            {f}
            {f === "All" && orders.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">{orders.length}</span>
            )}
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
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-surface-400" />
          </div>
          <p className="font-semibold text-surface-700">No orders found</p>
          <p className="text-sm text-surface-400 mt-1">
            {activeFilter === "All" ? "You haven't placed any orders yet." : "No orders with this status."}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(order => {
            const expanded = expandedId === order.id;
            const items = order.items || [];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:border-surface-300 transition-colors">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Package size={20} className="text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <p className="text-sm font-bold text-surface-900">Order #{order.id?.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-surface-400 mt-0.5">
                            {order.vendor_name || `Vendor ···${order.vendor_id?.slice(-4) || ""}`}
                          </p>
                        </div>
                        <Badge status={order.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-xs text-surface-400">{formatDate(order.created_at)}</span>
                        {order.total != null && (
                          <>
                            <span className="text-surface-200">·</span>
                            <span className="text-sm font-bold text-brand-600">{Number(order.total).toLocaleString()} ֏</span>
                          </>
                        )}
                        {items.length > 0 && (
                          <>
                            <span className="text-surface-200">·</span>
                            <span className="text-xs text-surface-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-surface-50">
                      <button onClick={() => setExpandedId(prev => prev === order.id ? null : order.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer border-none bg-transparent"
                      >
                        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {expanded ? "Hide items" : `Show ${items.length} items`}
                      </button>
                    </div>
                  )}
                </div>

                {expanded && items.length > 0 && (
                  <div className="border-t border-surface-100 bg-surface-50 px-5 py-3 space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-surface-100 last:border-0">
                        <span className="text-surface-700 font-medium">{item.product_name || `Item ${i + 1}`}</span>
                        <div className="flex items-center gap-4 text-surface-500">
                          <span>× {item.quantity || 1}</span>
                          {item.unit_price != null && (
                            <span className="font-bold text-surface-800">{Number(item.unit_price).toLocaleString()} ֏</span>
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
