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
      url: `https://salooote.am/${lang}/category/${slug}/${subslug}`,
      siteName: "Salooote.am",
    },
    alternates: {
      canonical: `https://salooote.am/${lang}/category/${slug}/${subslug}`,
      languages: {
        en: `https://salooote.am/en/category/${slug}/${subslug}`,
        hy: `https://salooote.am/hy/category/${slug}/${subslug}`,
        ru: `https://salooote.am/ru/category/${slug}/${subslug}`,
      },
    },
  };
}

export default async function SubcategoryPage({ params }) {
  const { lang, slug, subslug } = await params;
  // slug = parent category slug, subslug = this subcategory slug
  return <CategoryClient lang={lang} slug={subslug} parentSlug={slug} />;
}
