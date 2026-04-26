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
    openGraph: {
      title: "Help Center — Salooote.am",
      description: "Find answers to common questions about orders, payments, returns, vendors, and your account.",
      url: `https://salooote.am/${lang}/help`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Help Center — Salooote.am",
      description: "Find answers to common questions about orders, payments, returns, vendors, and your account.",
      images: ["/og-default.jpg"],
    },
  };
}

export default async function HelpPage({ params }) {
  const { lang } = await params;
  return <HelpPageClient lang={lang} />;
}
