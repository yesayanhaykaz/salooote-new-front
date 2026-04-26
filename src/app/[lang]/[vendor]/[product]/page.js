import { getDictionary } from "@/lib/getDictionary";
import { headers } from "next/headers";
import VendorProductClient from "@/app/vendor/[slug]/product/[productSlug]/page";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang, vendor, product } = await params;
  const fallbackName = decodeURIComponent(product).replace(/-/g, " ");
  const fallbackVendor = decodeURIComponent(vendor).replace(/-/g, " ");

  // Use actual request host so og:url matches what was shared (iMessage follows og:url)
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "salooote.am";
  const proto = "https";
  const pageUrl = `${proto}://${host}/${lang}/${vendor}/${product}`;

  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const vRes = await fetch(`${API}/vendors/slug/${vendor}`, { next: { revalidate: 3600 } });
    if (!vRes.ok) throw new Error("vendor fetch failed");
    const vData = await vRes.json();
    const vendorId = vData?.data?.id;
    if (!vendorId) throw new Error("no vendor id");

    const pRes = await fetch(`${API}/products/by-slug?vendor_id=${vendorId}&slug=${encodeURIComponent(product)}&locale=${lang}`, { next: { revalidate: 3600 } });
    if (!pRes.ok) throw new Error("product fetch failed");
    const pData = await pRes.json();
    const p = pData?.data;
    if (!p) throw new Error("no product");

    const name = p.name || fallbackName;
    const rawDesc = p.short_description || p.description || "";
    const description = rawDesc.replace(/<[^>]*>/g, "").trim() || `${name} — Salooote.am`;
    const image = p.thumbnail_url || p.images?.[0]?.url || null;

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
      description: `${fallbackName} — ${fallbackVendor} on Salooote.am`,
      alternates: { canonical: pageUrl },
      openGraph: { title: `${fallbackName} — Salooote.am`, url: pageUrl, type: "website" },
    };
  }
}

export default async function VendorProductPage({ params }) {
  const { lang, vendor, product } = await params;
  const dict = await getDictionary(lang);
  return <VendorProductClient lang={lang} vendorSlug={vendor} productSlug={product} dict={dict} />;
}
