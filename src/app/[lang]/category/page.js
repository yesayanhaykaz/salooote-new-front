import { getDictionary } from "@/lib/getDictionary";
import CategoryClient from "@/app/category/page";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.categoryTitle,
    description: dict.meta.categoryDesc,
    openGraph: {
      title: dict.meta.categoryTitle,
      description: dict.meta.categoryDesc,
      url: `https://salooote.am/${lang}/category`,
      siteName: "Salooote.am",
      images: [{ url: "https://salooote.am/images/flowers-roses.jpg", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://salooote.am/${lang}/category`,
      languages: { en: "https://salooote.am/en/category", hy: "https://salooote.am/hy/category", ru: "https://salooote.am/ru/category" },
    },
  };
}

export default function CategoryPage() {
  return <CategoryClient />;
}
