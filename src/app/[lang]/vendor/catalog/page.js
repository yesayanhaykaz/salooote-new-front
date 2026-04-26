import { getDictionary } from "@/lib/getDictionary";
import VendorCatalogClient from "@/app/vendor/catalog/page";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.vendor.viewStore} — Salooote.am`,
    description: dict.meta.vendorDesc,
    alternates: {
      canonical: `https://salooote.am/${lang}/vendor/catalog`,
      languages: { en: "https://salooote.am/en/vendor/catalog", hy: "https://salooote.am/hy/vendor/catalog", ru: "https://salooote.am/ru/vendor/catalog" },
    },
    openGraph: {
      title: `${dict.vendor.viewStore} — Salooote.am`,
      description: dict.meta.vendorDesc,
      url: `https://salooote.am/${lang}/vendor/catalog`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.vendor.viewStore} — Salooote.am`,
      description: dict.meta.vendorDesc,
      images: ["/og-default.jpg"],
    },
  };
}

export default function VendorCatalogPage() {
  return <VendorCatalogClient />;
}
