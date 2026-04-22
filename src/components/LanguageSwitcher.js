"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { LOCALES, LOCALE_NAMES } from "@/lib/getDictionary";

export default function LanguageSwitcher({ currentLang }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (locale) => {
    // Replace current locale segment in pathname
    const segments = pathname.split("/");
    segments[1] = locale;
    const newPath = segments.join("/") || "/";

    // Persist preference in cookie (1 year)
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;

    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-200 bg-white text-sm font-medium text-surface-700 hover:border-brand-300 hover:text-brand-600 transition-all cursor-pointer"
      >
        <span className="uppercase text-xs font-bold">{currentLang}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-surface-200 shadow-lg py-1 z-50 min-w-[140px] overflow-hidden"
            >
              {LOCALES.map((locale) => (
                <button
                  key={locale}
                  onClick={() => switchLocale(locale)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left cursor-pointer border-0 transition-colors ${
                    locale === currentLang
                      ? "bg-brand-50 text-brand-600 font-semibold"
                      : "bg-white text-surface-700 hover:bg-surface-50"
                  }`}
                >
                  <span>{LOCALE_NAMES[locale]}</span>
                  {locale === currentLang && (
                    <Check size={14} className="ml-auto text-brand-500" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
