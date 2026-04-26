import FAQPageClient from "@/components/FAQPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Frequently Asked Questions — Salooote.am",
    description: "Find answers to the most common questions about Salooote — orders, payments, vendors, and more.",
    alternates: {
      canonical: `https://salooote.am/${lang}/faq`,
      languages: { en: "https://salooote.am/en/faq", hy: "https://salooote.am/hy/faq", ru: "https://salooote.am/ru/faq" },
    },
    openGraph: {
      title: "Frequently Asked Questions — Salooote.am",
      description: "Find answers to the most common questions about Salooote — orders, payments, vendors, and more.",
      url: `https://salooote.am/${lang}/faq`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Frequently Asked Questions — Salooote.am",
      description: "Find answers to the most common questions about Salooote — orders, payments, vendors, and more.",
      images: ["/og-default.jpg"],
    },
  };
}

export default async function FAQPage({ params }) {
  const { lang } = await params;
  return <FAQPageClient lang={lang} />;
}
