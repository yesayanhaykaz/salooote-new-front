import { getDictionary } from "@/lib/getDictionary";
import ContactPageClient from "@/components/ContactPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.contactPage?.title || "Contact Us"} — Salooote.am`,
    description: dict.contactPage?.subtitle || "Get in touch with the Salooote team.",
    alternates: {
      canonical: `https://salooote.am/${lang}/contact`,
      languages: {
        en: "https://salooote.am/en/contact",
        hy: "https://salooote.am/hy/contact",
        ru: "https://salooote.am/ru/contact",
      },
    },
    openGraph: {
      title: `${dict.contactPage?.title || "Contact Us"} — Salooote.am`,
      description: dict.contactPage?.subtitle || "Get in touch with the Salooote team.",
      url: `https://salooote.am/${lang}/contact`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.contactPage?.title || "Contact Us"} — Salooote.am`,
      description: dict.contactPage?.subtitle || "Get in touch with the Salooote team.",
      images: ["/og-default.jpg"],
    },
  };
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <ContactPageClient lang={lang} dict={dict} />;
}
