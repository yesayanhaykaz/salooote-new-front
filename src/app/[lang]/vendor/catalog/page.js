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
  };
}

export default function VendorCatalogPage() {
  return <VendorCatalogClient />;
}
