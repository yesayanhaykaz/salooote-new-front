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
      canonical: `https://development.salooote.am/${lang}/vendor/catalog`,
      languages: { en: "https://development.salooote.am/en/vendor/catalog", hy: "https://development.salooote.am/hy/vendor/catalog", ru: "https://development.salooote.am/ru/vendor/catalog" },
    },
    openGraph: {
      title: `${dict.vendor.viewStore} — Salooote.am`,
      description: dict.meta.vendorDesc,
      url: `https://development.salooote.am/${lang}/vendor/catalog`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.vendor.viewStore} — Salooote.am`,
      description: dict.meta.vendorDesc,
      images: ["/images/hero-dj.jpg"],
    },
  };
}

export default function VendorCatalogPage() {
  return <VendorCatalogClient />;
}
