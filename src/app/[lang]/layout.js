import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { DictionaryProvider } from "@/lib/DictionaryContext";
import { getDictionary, LOCALES } from "@/lib/getDictionary";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const ogLocaleMap = { en: "en_US", hy: "hy_AM", ru: "ru_RU" };
  const keywordsMap = {
    en: "event planning, weddings Armenia, party vendors, birthday catering, Yerevan events",
    hy: "միջոցառումների կազմակերպում, հարսանիք Հայաստան, ծննդյան երեկույթ, Երևան",
    ru: "организация мероприятий, свадьба Армения, день рождения, Ереван, кейтеринг",
  };

  return {
    metadataBase: new URL("https://salooote.am"),
    title: dict.meta.homeTitle,
    description: dict.meta.homeDesc,
    keywords: keywordsMap[lang] || keywordsMap.en,
    openGraph: {
      title: dict.meta.homeTitle,
      description: dict.meta.homeDesc,
      url: `https://salooote.am/${lang}`,
      siteName: dict.meta.siteName,
      locale: ogLocaleMap[lang] || "en_US",
      type: "website",
      images: [
        {
          url: "https://salooote.am/images/hero-dj.jpg",
          width: 1200,
          height: 630,
          alt: "Salooote.am",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.homeTitle,
      description: dict.meta.homeDesc,
      images: ["https://salooote.am/images/hero-dj.jpg"],
    },
    alternates: {
      canonical: `https://salooote.am/${lang}`,
      languages: {
        en: "https://salooote.am/en",
        hy: "https://salooote.am/hy",
        ru: "https://salooote.am/ru",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <DictionaryProvider dict={dict} lang={lang}>
        <CartProvider>
          <ScrollProgress />
          <Header lang={lang} dict={dict} />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <Footer lang={lang} dict={dict} />
          <OrganizationJsonLd />
          <WebsiteJsonLd lang={lang} />
        </CartProvider>
      </DictionaryProvider>
    </>
  );
}
