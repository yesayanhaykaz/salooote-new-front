import { getDictionary } from "@/lib/getDictionary";
import CartClient from "@/app/cart/page";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.cartTitle,
    alternates: {
      canonical: `https://salooote.am/${lang}/cart`,
      languages: { en: "https://salooote.am/en/cart", hy: "https://salooote.am/hy/cart", ru: "https://salooote.am/ru/cart" },
    },
  };
}

export default function CartPage() {
  return <CartClient />;
}
