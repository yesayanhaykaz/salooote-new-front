import { getDictionary } from "@/lib/getDictionary";
import ReviewsClient from "@/app/reviews/page";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.reviewsPage?.heroTitle || dict.vendor?.reviews || "Reviews"} — Salooote.am`,
    description: dict.reviewsPage?.heroSubtitle || dict.meta.homeDesc,
    alternates: {
      canonical: `https://salooote.am/${lang}/reviews`,
      languages: {
        en: "https://salooote.am/en/reviews",
        hy: "https://salooote.am/hy/reviews",
        ru: "https://salooote.am/ru/reviews",
      },
    },
    openGraph: {
      title: `${dict.reviewsPage?.heroTitle || dict.vendor?.reviews || "Reviews"} — Salooote.am`,
      description: dict.reviewsPage?.heroSubtitle || dict.meta.homeDesc,
      url: `https://salooote.am/${lang}/reviews`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.reviewsPage?.heroTitle || dict.vendor?.reviews || "Reviews"} — Salooote.am`,
      description: dict.reviewsPage?.heroSubtitle || dict.meta.homeDesc,
      images: ["/images/hero-dj.jpg"],
    },
  };
}

export default async function ReviewsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <ReviewsClient lang={lang} dict={dict} />;
}
