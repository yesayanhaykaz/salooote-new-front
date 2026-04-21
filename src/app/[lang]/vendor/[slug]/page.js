import { getDictionary } from "@/lib/getDictionary";
import VendorProfileClient from "@/app/vendor/[slug]/page";

export async function generateStaticParams() {
  // Pre-render common language variants; additional slugs resolved at runtime
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }].flatMap(l =>
    ["salooote", "royal-bakes", "yerevan-flowers"].map(slug => ({
      lang: l.lang,
      slug,
    }))
  );
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    title: `${name} — Salooote.am`,
    description: `View ${name}'s products, services and reviews on Salooote.am`,
    alternates: {
      canonical: `https://salooote.am/${lang}/vendor/${slug}`,
    },
  };
}

export default async function VendorSlugPage({ params }) {
  const { lang, slug } = await params;
  return <VendorProfileClient lang={lang} slug={slug} />;
}
