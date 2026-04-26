import { getDictionary } from "@/lib/getDictionary";
import { headers } from "next/headers";
import VendorProfileClient from "@/app/vendor/[slug]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const fallbackName = slug.replace(/-/g, " ");

  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "salooote.am";
  const pageUrl = `https://${host}/${lang}/vendor/${slug}`;

  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const res = await fetch(`${API}/vendors/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("vendor fetch failed");
    const data = await res.json();
    const v = data?.data;
    if (!v) throw new Error("no vendor");

    const name = v.business_name || fallbackName;
    const rawDesc = v.description || "";
    const description = rawDesc.replace(/<[^>]*>/g, "").trim() || `${name} on Salooote.am`;
    const image = v.logo_url || v.cover_url || null;

    return {
      title: `${name} — Salooote.am`,
      description,
      alternates: { canonical: pageUrl },
      openGraph: {
        title: `${name} — Salooote.am`,
        description,
        url: pageUrl,
        siteName: "Salooote.am",
        ...(image && { images: [{ url: image, width: 1200, height: 630, alt: name }] }),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} — Salooote.am`,
        description,
        ...(image && { images: [image] }),
      },
    };
  } catch {
    return {
      title: `${fallbackName} — Salooote.am`,
      description: `${fallbackName} on Salooote.am`,
      alternates: { canonical: pageUrl },
      openGraph: { title: `${fallbackName} — Salooote.am`, url: pageUrl, type: "website" },
    };
  }
}

export default async function VendorSlugPage({ params }) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  return <VendorProfileClient lang={lang} slug={slug} dict={dict} />;
}
