import { getDictionary } from "@/lib/getDictionary";
import ReviewsClient from "@/app/reviews/page";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.vendor.reviews} — Salooote.am`,
    description: dict.meta.homeDesc,
    alternates: {
      canonical: `https://salooote.am/${lang}/reviews`,
      languages: { en: "https://salooote.am/en/reviews", hy: "https://salooote.am/hy/reviews", ru: "https://salooote.am/ru/reviews" },
    },
  };
}

export default function ReviewsPage() {
  return <ReviewsClient />;
}
