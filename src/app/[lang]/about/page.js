import AboutPageClient from "@/components/AboutPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Our Story — Salooote.am",
    description: "Learn how Salooote was founded to make event planning in Armenia effortless.",
    alternates: {
      canonical: `https://salooote.am/${lang}/about`,
      languages: { en: "https://salooote.am/en/about", hy: "https://salooote.am/hy/about", ru: "https://salooote.am/ru/about" },
    },
    openGraph: {
      title: "Our Story — Salooote.am",
      description: "Learn how Salooote was founded to make event planning in Armenia effortless.",
      url: `https://salooote.am/${lang}/about`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Our Story — Salooote.am",
      description: "Learn how Salooote was founded to make event planning in Armenia effortless.",
      images: ["/og-default.jpg"],
    },
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  return <AboutPageClient lang={lang} />;
}
