import { getDictionary } from "@/lib/getDictionary";
import PaymentClient from "@/app/payment/page";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.meta.checkoutTitle || "Checkout"} — Salooote.am`,
    robots: { index: false },
    alternates: {
      canonical: `https://salooote.am/${lang}/payment`,
      languages: { en: "https://salooote.am/en/payment", hy: "https://salooote.am/hy/payment", ru: "https://salooote.am/ru/payment" },
    },
  };
}

export default function PaymentPage() {
  return <PaymentClient />;
}
