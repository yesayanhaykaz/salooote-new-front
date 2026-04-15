import ContactPageClient from "@/components/ContactPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Contact Us — Salooote.am",
    description: "Get in touch with the Salooote team. We're here to help with orders, vendor questions, and partnerships.",
    alternates: {
      canonical: `https://salooote.am/${lang}/contact`,
      languages: { en: "https://salooote.am/en/contact", hy: "https://salooote.am/hy/contact", ru: "https://salooote.am/ru/contact" },
    },
  };
}

export default function ContactPage() {
  return <ContactPageClient />;
}
