const BASE_URL = "https://development.salooote.am";
const LOCALES  = ["en", "hy", "ru"];

const staticRoutes = [
  "",
  "/products",
  "/category",
  "/vendor",
  "/vendor-service",
  "/vendor/catalog",
  "/login",
  "/signup",
  "/cart",
  "/reviews",
];

export default function sitemap() {
  const entries = [];

  for (const locale of LOCALES) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/products" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${route}`])
          ),
        },
      });
    }
  }

  return entries;
}
