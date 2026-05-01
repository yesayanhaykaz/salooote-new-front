"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSaved } from "@/lib/saved-context";
import { Heart, X, Store, Package, Briefcase } from "lucide-react";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    title: "Saved Items",
    countOne: "1 saved item",
    countMany: (n) => `${n} saved items`,
    emptyTagline: "Your favourites, all in one place",
    nothingSaved: "Nothing saved yet",
    nothingDesc: "Browse vendors and products to save your favourites.",
    browse: "Browse Products",
    savedOn: "Saved",
    vendor: "Vendor",
    product: "Product",
    service: "Service",
    unnamed: "Unnamed item",
  },
  hy: {
    title: "Պահված նյութեր",
    countOne: "1 պահված նյութ",
    countMany: (n) => `${n} պահված նյութ`,
    emptyTagline: "Ձեր նախընտրածները մեկ տեղում",
    nothingSaved: "Դեռ ոչինչ չի պահվել",
    nothingDesc: "Ծննդյան կամ հարսանիքի ծառայությունները դիտելիս սրտի կոճակով պահեք",
    browse: "Դիտել ապրանքները",
    savedOn: "Պահված",
    vendor: "Վաճառող",
    product: "Ապրանք",
    service: "Ծառայություն",
    unnamed: "Անանուն",
  },
  ru: {
    title: "Сохранённое",
    countOne: "1 сохранённый элемент",
    countMany: (n) => `${n} сохранённых элементов`,
    emptyTagline: "Ваши избранные — в одном месте",
    nothingSaved: "Ничего не сохранено",
    nothingDesc: "Просматривайте поставщиков и продукты, чтобы добавлять в избранное.",
    browse: "Смотреть продукты",
    savedOn: "Сохранено",
    vendor: "Поставщик",
    product: "Продукт",
    service: "Услуга",
    unnamed: "Без названия",
  },
};

const TYPE_ICONS  = { vendor: Store, product: Package, service: Briefcase };
const TYPE_STYLES = {
  vendor:  { bg: "bg-violet-50",  icon: "text-violet-400",  badge: "bg-violet-50 text-violet-600 border-violet-200"  },
  product: { bg: "bg-blue-50",    icon: "text-blue-400",    badge: "bg-blue-50 text-blue-600 border-blue-200"        },
  service: { bg: "bg-emerald-50", icon: "text-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

function SavedCard({ item, t, onRemove, removing }) {
  const type  = item.target_type || "product";
  const Icon  = TYPE_ICONS[type] || Package;
  const style = TYPE_STYLES[type] || TYPE_STYLES.product;
  const name  = item.name || item.target_name || null;
  const label = t[type] || type;
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:shadow-md hover:border-surface-300 transition-all flex flex-col group">
      {/* Image / placeholder header */}
      <div className={`relative h-36 ${style.bg} flex items-center justify-center overflow-hidden`}>
        {item.image_url ? (
          <img src={item.image_url} alt={name || label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <Icon size={44} className={`${style.icon} opacity-25`} />
        )}
        {/* Remove button */}
        <button
          onClick={() => onRemove(item.target_id)}
          disabled={removing}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-surface-400 transition-colors cursor-pointer border-none shadow-sm"
          aria-label="Remove">
          {removing ? (
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <X size={13} />
          )}
        </button>
      </div>

      {/* Card body */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border w-fit ${style.badge}`}>
          <Icon size={9} /> {label}
        </span>

        {name ? (
          <p className="text-sm font-semibold text-surface-900 truncate leading-snug">{name}</p>
        ) : (
          <p className="text-sm text-surface-400 italic truncate">{t.unnamed}</p>
        )}

        {dateStr && (
          <p className="text-[11px] text-surface-400">{t.savedOn} {dateStr}</p>
        )}
      </div>
    </div>
  );
}

export default function AccountSavedPage() {
  const { lang } = useParams();
  const t = T[lang] || T.en;
  const { savedMap, unsaveItem: ctxUnsave, hydrated } = useSaved();
  const [removing, setRemoving] = useState({});

  const saved   = Object.values(savedMap);
  const loading = !hydrated;

  const unsave = async (targetId) => {
    setRemoving(p => ({ ...p, [targetId]: true }));
    await ctxUnsave(targetId);
    setRemoving(p => ({ ...p, [targetId]: false }));
  };

  const subtitle = saved.length === 0
    ? t.emptyTagline
    : saved.length === 1
      ? t.countOne
      : t.countMany(saved.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">{t.title}</h1>
        <p className="text-sm text-surface-400 mt-0.5">{subtitle}</p>
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
          <p className="font-semibold text-surface-700 text-base">{t.nothingSaved}</p>
          <p className="text-sm text-surface-400 mt-1 mb-5 max-w-xs">{t.nothingDesc}</p>
          <Link href={`/${lang}/products`}
            className="bg-brand-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold no-underline hover:bg-brand-700 transition-colors">
            {t.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(item => (
            <SavedCard
              key={item.id}
              item={item}
              t={t}
              onRemove={unsave}
              removing={!!removing[item.target_id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
