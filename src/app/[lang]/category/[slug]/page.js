import { getDictionary } from "@/lib/getDictionary";
import CategoryClient from "@/app/category/page";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }].flatMap(l =>
    ["cakes", "catering", "flowers", "party", "gifts", "dj-music", "venues", "photography", "decoration"].map(slug => ({
      lang: l.lang,
      slug,
    }))
  );
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const title = `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")} — Salooote.am`;
  return {
    title,
    description: dict.meta.categoryDesc,
    openGraph: {
      title,
      description: dict.meta.categoryDesc,
      url: `https://salooote.am/${lang}/category/${slug}`,
      siteName: "Salooote.am",
    },
    alternates: {
      canonical: `https://salooote.am/${lang}/category/${slug}`,
      languages: {
        en: `https://salooote.am/en/category/${slug}`,
        hy: `https://salooote.am/hy/category/${slug}`,
        ru: `https://salooote.am/ru/category/${slug}`,
      },
    },
  };
}

export default async function CategorySlugPage({ params }) {
  const { lang, slug } = await params;
  return <CategoryClient lang={lang} slug={slug} />;
}
