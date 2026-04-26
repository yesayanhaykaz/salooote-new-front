import { getDictionary } from "@/lib/getDictionary";
import ProductDetailClient from "@/app/product/[id]/page";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  return {
    title: `Product — Salooote.am`,
    alternates: {
      canonical: `https://salooote.am/${lang}/product/${id}`,
    },
  };
}

export default async function ProductIdPage({ params }) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  return <ProductDetailClient productId={id} lang={lang} dict={dict} />;
}
