import { getDictionary } from "@/lib/getDictionary";
import VendorProfileClient from "@/app/vendor/[slug]/page";

export async function generateStaticParams() {
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
  const fallbackName = slug.replace(/-/g, " ");
  const canonical = `https://salooote.am/${lang}/vendor/${slug}`;

  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const res = await fetch(`${API}/vendors/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("vendor fetch failed");
    const data = await res.json();
    const v = data?.data;
    if (!v) throw new Error("no vendor");

    const name = v.business_name || fallbackName;
    const description = v.description || `View ${name}'s products, services and reviews on Salooote.am`;
    const image = v.logo_url || v.cover_url || "https://salooote.am/og-default.jpg";

    return {
      title: `${name} — Salooote.am`,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${name} — Salooote.am`,
        description,
        url: canonical,
        siteName: "Salooote.am",
        images: [{ url: image, width: 1200, height: 630, alt: name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} — Salooote.am`,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: `${fallbackName} — Salooote.am`,
      description: `View ${fallbackName}'s products, services and reviews on Salooote.am`,
      alternates: { canonical },
    };
  }
}

export default async function VendorSlugPage({ params }) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  return <VendorProfileClient lang={lang} slug={slug} dict={dict} />;
}
