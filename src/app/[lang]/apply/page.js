import ApplyPageClient from "@/components/ApplyPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Apply to Become a Vendor — Salooote.am",
    description: "Join Salooote's marketplace as a vendor. Apply in minutes and reach thousands of event planners.",
    alternates: {
      canonical: `https://salooote.am/${lang}/apply`,
      languages: { en: "https://salooote.am/en/apply", hy: "https://salooote.am/hy/apply", ru: "https://salooote.am/ru/apply" },
    },
  };
}

export default function ApplyPage() {
  return <ApplyPageClient />;
}
