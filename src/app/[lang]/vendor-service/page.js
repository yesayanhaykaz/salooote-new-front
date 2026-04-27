import { getDictionary } from "@/lib/getDictionary";
import VendorServiceClient from "@/app/vendor-service/page";

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
      canonical: `https://development.salooote.am/${lang}/vendor-service`,
      languages: { en: "https://development.salooote.am/en/vendor-service", hy: "https://development.salooote.am/hy/vendor-service", ru: "https://development.salooote.am/ru/vendor-service" },
    },
    openGraph: {
      title: dict.meta.vendorTitle,
      description: dict.meta.vendorDesc,
      url: `https://development.salooote.am/${lang}/vendor-service`,
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

export default function VendorServicePage() {
  return <VendorServiceClient />;
}
