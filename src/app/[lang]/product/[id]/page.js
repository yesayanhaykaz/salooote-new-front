import { getDictionary } from "@/lib/getDictionary";
import ProductDetailClient from "@/app/product/[id]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const pageUrl = `https://development.salooote.am/${lang}/product/${id}`;
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const res = await fetch(`${API}/products/${id}?locale=${lang}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("product fetch failed");
    const data = await res.json();
    const p = data?.data;
    if (!p) throw new Error("no product");

    const name = p.name || "Product";
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
      title: "Product — Salooote.am",
      alternates: { canonical: pageUrl },
      openGraph: { title: "Product — Salooote.am", url: pageUrl, type: "website" },
    };
  }
}

export default async function ProductIdPage({ params }) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  return <ProductDetailClient productId={id} lang={lang} dict={dict} />;
}
