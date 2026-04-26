import { getDictionary } from "@/lib/getDictionary";
import VendorProductClient from "@/app/vendor/[slug]/product/[productSlug]/page";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang, vendor, product } = await params;
  const name = product.charAt(0).toUpperCase() + product.slice(1).replace(/-/g, " ");
  const vendorName = vendor.charAt(0).toUpperCase() + vendor.slice(1).replace(/-/g, " ");
  return {
    title: `${name} by ${vendorName} — Salooote.am`,
    description: `Buy ${name} from ${vendorName} on Salooote.am`,
    alternates: {
      canonical: `https://salooote.am/${lang}/${vendor}/${product}`,
    },
  };
}

export default async function VendorProductPage({ params }) {
  const { lang, vendor, product } = await params;
  const dict = await getDictionary(lang);
  return <VendorProductClient lang={lang} vendorSlug={vendor} productSlug={product} dict={dict} />;
}
