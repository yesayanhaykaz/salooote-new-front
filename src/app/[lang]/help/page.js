import HelpPageClient from "@/components/HelpPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Help Center — Salooote.am",
    description: "Find answers to common questions about orders, payments, returns, vendors, and your account.",
    alternates: {
      canonical: `https://salooote.am/${lang}/help`,
      languages: { en: "https://salooote.am/en/help", hy: "https://salooote.am/hy/help", ru: "https://salooote.am/ru/help" },
    },
  };
}

export default async function HelpPage({ params }) {
  const { lang } = await params;
  return <HelpPageClient lang={lang} />;
}
