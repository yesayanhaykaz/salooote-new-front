import { getDictionary } from "@/lib/getDictionary";
import CategoryClient from "@/app/category/page";

// Subcategory pages are rendered on-demand (not pre-built) since the
// list of subcategory slugs is dynamic / DB-driven.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang, slug, subslug } = await params;
  const dict = await getDictionary(lang);
  const parentTitle = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  const subTitle    = subslug.charAt(0).toUpperCase() + subslug.slice(1).replace(/-/g, " ");
  const title = `${subTitle} — ${parentTitle} — Salooote.am`;
  return {
    title,
    description: dict.meta.categoryDesc,
    openGraph: {
      title,
      description: dict.meta.categoryDesc,
      url: `https://development.salooote.am/${lang}/category/${slug}/${subslug}`,
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
      canonical: `https://development.salooote.am/${lang}/category/${slug}/${subslug}`,
      languages: {
        en: `https://development.salooote.am/en/category/${slug}/${subslug}`,
        hy: `https://development.salooote.am/hy/category/${slug}/${subslug}`,
        ru: `https://development.salooote.am/ru/category/${slug}/${subslug}`,
      },
    },
  };
}

export default async function SubcategoryPage({ params }) {
  const { lang, slug, subslug } = await params;
  // slug = parent category slug, subslug = this subcategory slug
  return <CategoryClient lang={lang} slug={subslug} parentSlug={slug} />;
}
