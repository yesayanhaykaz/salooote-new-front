import { CartProvider } from "@/lib/cart-context";
import { SavedProvider } from "@/lib/saved-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import AIAssistantV2Client from "@/components/AIAssistantV2Client";
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

  const SITE = "https://development.salooote.am";
  const OG_IMG = `${SITE}/images/hero-dj.jpg`;

  return {
    metadataBase: new URL(SITE),
    title: dict.meta.homeTitle,
    description: dict.meta.homeDesc,
    keywords: keywordsMap[lang] || keywordsMap.en,
    openGraph: {
      title: dict.meta.homeTitle,
      description: dict.meta.homeDesc,
      url: `${SITE}/${lang}`,
      siteName: dict.meta.siteName,
      locale: ogLocaleMap[lang] || "en_US",
      type: "website",
      images: [{ url: OG_IMG, width: 1200, height: 630, alt: "Salooote.am" }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.homeTitle,
      description: dict.meta.homeDesc,
      images: [OG_IMG],
    },
    alternates: {
      canonical: `${SITE}/${lang}`,
      languages: {
        en: `${SITE}/en`,
        hy: `${SITE}/hy`,
        ru: `${SITE}/ru`,
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
        <SavedProvider>
          <ScrollProgress />
          <Header lang={lang} dict={dict} />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
            <AIAssistantV2Client lang={lang} />
          </main>
          <Footer lang={lang} dict={dict} />
          <OrganizationJsonLd />
          <WebsiteJsonLd lang={lang} />
        </SavedProvider>
        </CartProvider>
      </DictionaryProvider>
    </>
  );
}
