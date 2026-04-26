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
  };
}

export default async function FAQPage({ params }) {
  const { lang } = await params;
  return <FAQPageClient lang={lang} />;
}
