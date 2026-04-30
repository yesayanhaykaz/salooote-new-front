"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSaved } from "@/lib/saved-context";
import { Heart, X, Store, Package, Briefcase } from "lucide-react";

const TYPE_ICONS  = { vendor: Store, product: Package, service: Briefcase };
const TYPE_COLORS = {
  vendor:  { bg: "bg-violet-50", color: "text-violet-500", badge: "bg-violet-50 text-violet-600 border-violet-200" },
  product: { bg: "bg-blue-50",   color: "text-blue-500",   badge: "bg-blue-50 text-blue-600 border-blue-200" },
  service: { bg: "bg-green-50",  color: "text-green-500",  badge: "bg-green-50 text-green-600 border-green-200" },
};

export default function AccountSavedPage() {
  const { lang } = useParams();
  const { savedMap, unsaveItem: ctxUnsave, hydrated } = useSaved();
  const [removing, setRemoving] = useState({});

  const saved   = Object.values(savedMap);
  const loading = !hydrated;

  const unsave = async (targetId) => {
    setRemoving(p => ({ ...p, [targetId]: true }));
    await ctxUnsave(targetId);
    setRemoving(p => ({ ...p, [targetId]: false }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Saved Items</h1>
        <p className="text-sm text-surface-400 mt-0.5">
          {saved.length > 0 ? `${saved.length} saved item${saved.length !== 1 ? "s" : ""}` : "Your favourites, all in one place"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : saved.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <Heart size={24} className="text-brand-300" />
          </div>
          <p className="font-semibold text-surface-700">Nothing saved yet</p>
          <p className="text-sm text-surface-400 mt-1 mb-4">Browse vendors and products to save your favourites.</p>
          <Link href={`/${lang}/products`}
            className="bg-brand-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold no-underline hover:bg-brand-700 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(item => {
            const Icon = TYPE_ICONS[item.target_type] || Package;
            const tc   = TYPE_COLORS[item.target_type] || TYPE_COLORS.product;
            const displayName = item.name || item.target_name || null;

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:border-surface-300 transition-colors flex flex-col">
                {/* Image / gradient header */}
                <div className={`h-32 ${tc.bg} flex items-center justify-center relative`}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={displayName || item.target_type} className="w-full h-full object-cover" />
                  ) : (
                    <Icon size={40} className={`${tc.color} opacity-30`} />
                  )}
                  <button
                    onClick={() => unsave(item.target_id)}
                    disabled={removing[item.target_id]}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-surface-400 transition-colors cursor-pointer border-none shadow-sm"
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3.5 flex flex-col gap-1 flex-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize w-fit ${tc.badge}`}>
                    {item.target_type}
                  </span>
                  {displayName ? (
                    <p className="text-sm font-semibold text-surface-900 truncate mt-0.5">{displayName}</p>
                  ) : (
                    <p className="text-xs font-mono text-surface-400 mt-0.5 truncate">···{item.target_id?.slice(-12)}</p>
                  )}
                  {item.created_at && (
                    <p className="text-[11px] text-surface-400 mt-0.5">
                      Saved {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
