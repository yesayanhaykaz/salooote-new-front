import { getDictionary } from "@/lib/getDictionary";
import ProductClient from "@/app/product/page";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `Premium Wedding Cake — Salooote.am`,
    description: `View product details, pricing and vendor information on Salooote.am. ${dict.meta.productsDesc}`,
    openGraph: {
      title: `Premium Wedding Cake — Salooote.am`,
      images: [{ url: "https://salooote.am/images/wedding-cake.jpg", width: 1200, height: 630 }],
      url: `https://salooote.am/${lang}/product`,
    },
    alternates: {
      canonical: `https://salooote.am/${lang}/product`,
      languages: { en: "https://salooote.am/en/product", hy: "https://salooote.am/hy/product", ru: "https://salooote.am/ru/product" },
    },
  };
}

export default function ProductPage({ params }) {
  return (
    <>
      <ProductJsonLd product={{ name: "Premium Wedding Cake", price: 250, stock: 5, rating: 4.9 }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/en" },
        { name: "Products", href: "/en/products" },
        { name: "Premium Wedding Cake", href: "/en/product" },
      ]} />
      <ProductClient />
    </>
  );
}
