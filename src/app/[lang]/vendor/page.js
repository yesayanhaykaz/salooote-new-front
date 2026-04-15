import { getDictionary } from "@/lib/getDictionary";
import VendorClient from "@/app/vendor/page";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.vendorTitle,
    description: dict.meta.vendorDesc,
    alternates: {
      canonical: `https://salooote.am/${lang}/vendor`,
      languages: { en: "https://salooote.am/en/vendor", hy: "https://salooote.am/hy/vendor", ru: "https://salooote.am/ru/vendor" },
    },
  };
}

export default function VendorPage() {
  return <VendorClient />;
}
