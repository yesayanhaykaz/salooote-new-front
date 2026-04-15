const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  hy: () => import("@/dictionaries/hy.json").then((m) => m.default),
  ru: () => import("@/dictionaries/ru.json").then((m) => m.default),
};

export const getDictionary = async (locale) => {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};

export const LOCALES = ["en", "hy", "ru"];
export const DEFAULT_LOCALE = "en";

export const LOCALE_NAMES = {
  en: "English",
  hy: "Հայerеn",
  ru: "Русский",
};

export const LOCALE_FLAGS = {
  en: "🇬🇧",
  hy: "🇦🇲",
  ru: "🇷🇺",
};
