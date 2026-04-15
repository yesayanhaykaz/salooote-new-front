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
  };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
