import { getDictionary } from "@/lib/getDictionary";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const title = dict.meta.homeTitle;
  const description = dict.meta.homeDesc;
  const ogLocale =
    lang === "hy" ? "hy_AM" : lang === "ru" ? "ru_RU" : "en_US";

  return {
    title,
    description,
    keywords:
      lang === "hy"
        ? "միջոցառումների կազմակերպում, հայկական հարսանիք, tort,ծաղիկ, ռեստորան Երևան"
        : lang === "ru"
        ? "организация мероприятий, свадьба Ереван, торты, цветы, кейтеринг Армения"
        : "event planning Armenia, wedding vendors Yerevan, party supplies, cakes flowers catering",
    openGraph: {
      title,
      description,
      url: `https://salooote.am/${lang}`,
      siteName: "Salooote.am",
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: "https://salooote.am/images/hero-dj.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://salooote.am/${lang}`,
      languages: {
        en: "https://salooote.am/en",
        hy: "https://salooote.am/hy",
        ru: "https://salooote.am/ru",
      },
    },
  };
}

// Renders nothing — the global AI assistant in the layout shows its landing
// view when the path is the root locale (see AIAssistantV2Client).
export default function Page() {
  return null;
}
