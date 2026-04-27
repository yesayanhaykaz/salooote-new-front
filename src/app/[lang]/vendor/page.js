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
      canonical: `https://development.salooote.am/${lang}/vendor`,
      languages: { en: "https://development.salooote.am/en/vendor", hy: "https://development.salooote.am/hy/vendor", ru: "https://development.salooote.am/ru/vendor" },
    },
    openGraph: {
      title: dict.meta.vendorTitle,
      description: dict.meta.vendorDesc,
      url: `https://development.salooote.am/${lang}/vendor`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.vendorTitle,
      description: dict.meta.vendorDesc,
      images: ["/images/hero-dj.jpg"],
    },
  };
}

export default function VendorPage() {
  return <VendorClient />;
}
