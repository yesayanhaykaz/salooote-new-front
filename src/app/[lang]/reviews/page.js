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
  };
}

export default async function ReviewsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <ReviewsClient lang={lang} dict={dict} />;
}
