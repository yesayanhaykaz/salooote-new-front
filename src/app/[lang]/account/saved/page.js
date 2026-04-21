"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { userAPI, vendorsAPI } from "@/lib/api";
import { useSaved } from "@/lib/saved-context";
import { Heart, X, Store, Package, Briefcase } from "lucide-react";

const TYPE_ICONS  = { vendor: Store, product: Package, service: Briefcase };
const TYPE_COLORS = {
  vendor:  { bg: "bg-violet-50", color: "text-violet-500", badge: "bg-violet-50 text-violet-600 border-violet-200" },
  product: { bg: "bg-blue-50",   color: "text-blue-500",   badge: "bg-blue-50 text-blue-600 border-blue-200" },
  service: { bg: "bg-green-50",  color: "text-green-500",  badge: "bg-green-50 text-green-600 border-green-200" },
};

const TABS = ["All", "Vendors", "Products", "Services"];

export default function AccountSavedPage() {
  const { lang } = useParams();
  const { savedMap, unsaveItem: ctxUnsave, saveItem: ctxSave, hydrated } = useSaved();
  const [vendors,  setVendors]  = useState([]);
  const [saving,   setSaving]   = useState({});
  const [activeTab, setTab]     = useState("All");

  // Derive saved array from context map
  const saved = Object.values(savedMap);
  const loading = !hydrated;

  useEffect(() => {
    vendorsAPI.list({ limit: 8 })
      .then(res => setVendors(res?.data || []))
      .catch(() => {});
  }, []);

  const unsave = async (targetId) => {
    setSaving(p => ({ ...p, [targetId]: true }));
    await ctxUnsave(targetId);
    setSaving(p => ({ ...p, [targetId]: false }));
  };

  const saveVendor = async (vendorId) => {
    setSaving(p => ({ ...p, [vendorId]: true }));
    await ctxSave("vendor", vendorId);
    setSaving(p => ({ ...p, [vendorId]: false }));
  };

  const savedVendorIds = new Set(saved.filter(s => s.target_type === "vendor").map(s => s.target_id));
  const filtered = activeTab === "All" ? saved : saved.filter(s => s.target_type === activeTab.toLowerCase().slice(0, -1) || s.target_type === activeTab.toLowerCase());
  // handle plural tab names
  const filteredItems = activeTab === "All" ? saved
    : activeTab === "Vendors"  ? saved.filter(s => s.target_type === "vendor")
    : activeTab === "Products" ? saved.filter(s => s.target_type === "product")
    : saved.filter(s => s.target_type === "service");

  const counts = {
    vendors:  saved.filter(s => s.target_type === "vendor").length,
    products: saved.filter(s => s.target_type === "product").length,
    services: saved.filter(s => s.target_type === "service").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Saved Items</h1>
        <p className="text-sm text-surface-400 mt-0.5">Your favourites, all in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Vendors",  value: counts.vendors,  icon: Store,    ...TYPE_COLORS.vendor },
          { label: "Products", value: counts.products, icon: Package,  ...TYPE_COLORS.product },
          { label: "Services", value: counts.services, icon: Briefcase,...TYPE_COLORS.service },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 leading-none">{s.value}</p>
              <p className="text-xs text-surface-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-xl px-2 py-1.5 w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border-none ${
              activeTab === tab ? "bg-brand-600 text-white" : "text-surface-500 hover:bg-surface-100 bg-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <Heart size={24} className="text-brand-300" />
          </div>
          <p className="font-semibold text-surface-700">Nothing saved yet</p>
          <p className="text-sm text-surface-400 mt-1 mb-4">
            {activeTab === "All" ? "Browse vendors and products to save your favourites." : `No saved ${activeTab.toLowerCase()} yet.`}
          </p>
          <Link href={`/${lang}/products`}
            className="bg-brand-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold no-underline hover:bg-brand-700 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const Icon = TYPE_ICONS[item.target_type] || Package;
            const tc   = TYPE_COLORS[item.target_type] || TYPE_COLORS.product;
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4 flex items-start justify-between gap-3 hover:border-surface-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={tc.color} />
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${tc.badge}`}>
                      {item.target_type}
                    </span>
                    <p className="text-xs text-surface-500 mt-0.5 font-mono">···{item.target_id?.slice(-12)}</p>
                    {item.created_at && (
                      <p className="text-[11px] text-surface-400 mt-1">
                        Saved {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => unsave(item.target_id)} disabled={saving[item.target_id]}
                  className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-surface-400 transition-colors cursor-pointer border-none flex-shrink-0">
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Discover Vendors */}
      {vendors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-surface-900">Discover Vendors</h2>
            <p className="text-xs text-surface-400">Save vendors you like</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vendors.map(v => {
              const alreadySaved = savedVendorIds.has(v.id);
              const isSaving = saving[v.id];
              const initials = ([v.first_name, v.last_name].filter(Boolean).map(s => s[0]).join("") || (v.business_name || v.name || "V").slice(0, 2)).toUpperCase();
              return (
                <div key={v.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4 flex flex-col gap-3 hover:border-surface-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 truncate">{v.business_name || v.name || "Vendor"}</p>
                      {v.city && <p className="text-xs text-surface-400 truncate">{v.city}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => !alreadySaved && saveVendor(v.id)}
                    disabled={alreadySaved || isSaving}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                      alreadySaved
                        ? "border-brand-200 bg-brand-50 text-brand-600 cursor-default"
                        : "border-surface-200 text-surface-600 hover:bg-surface-50 bg-white"
                    }`}
                  >
                    <Heart size={12} className={alreadySaved ? "fill-brand-500 text-brand-500" : ""} />
                    {isSaving ? "Saving…" : alreadySaved ? "Saved" : "Save"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
