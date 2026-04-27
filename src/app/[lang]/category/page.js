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
      url: `https://development.salooote.am/${lang}/category`,
      siteName: "Salooote.am",
      images: [{ url: "https://development.salooote.am/images/flowers-roses.jpg", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://development.salooote.am/${lang}/category`,
      languages: { en: "https://development.salooote.am/en/category", hy: "https://development.salooote.am/hy/category", ru: "https://development.salooote.am/ru/category" },
    },
  };
}

export default async function CategoryPage({ params }) {
  const { lang } = await params;
  return <CategoryClient lang={lang} />;
}
