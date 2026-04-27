import { getDictionary } from "@/lib/getDictionary";
import CategoryClient from "@/app/category/page";

export async function generateStaticParams() {
  const slugs = [
    "cakes-desserts",
    "catering-food",
    "flowers-decor",
    "photography-videography",
    "music-entertainment",
    "venues-halls",
    "beauty-makeup",
    "gifts-souvenirs",
    "kids-entertainment",
    "invitation-printing",
    "transportation",
    "planning-coordination",
    "lighting-equipment",
    "clothing-accessories",
    "cakes", "catering", "flowers", "party", "gifts",
    "dj-music", "venues", "photography", "decoration",
  ];
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }].flatMap(l =>
    slugs.map(slug => ({ lang: l.lang, slug }))
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
      url: `https://development.salooote.am/${lang}/category/${slug}`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.meta.categoryDesc,
      images: ["/images/hero-dj.jpg"],
    },
    alternates: {
      canonical: `https://development.salooote.am/${lang}/category/${slug}`,
      languages: {
        en: `https://development.salooote.am/en/category/${slug}`,
        hy: `https://development.salooote.am/hy/category/${slug}`,
        ru: `https://development.salooote.am/ru/category/${slug}`,
      },
    },
  };
}

export default async function CategorySlugPage({ params }) {
  const { lang, slug } = await params;
  return <CategoryClient lang={lang} slug={slug} />;
}
