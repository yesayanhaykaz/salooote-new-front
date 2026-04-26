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
    openGraph: {
      title: "Apply to Become a Vendor — Salooote.am",
      description: "Join Salooote's marketplace as a vendor. Apply in minutes and reach thousands of event planners.",
      url: `https://salooote.am/${lang}/apply`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Apply to Become a Vendor — Salooote.am",
      description: "Join Salooote's marketplace as a vendor. Apply in minutes and reach thousands of event planners.",
      images: ["/images/hero-dj.jpg"],
    },
  };
}

export default function ApplyPage() {
  return <ApplyPageClient />;
}
