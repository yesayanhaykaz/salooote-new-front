import { getDictionary } from "@/lib/getDictionary";
import LoginPageClient from "@/components/LoginPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const title = dict.meta.loginTitle;
  const ogLocale =
    lang === "hy" ? "hy_AM" : lang === "ru" ? "ru_RU" : "en_US";

  return {
    title,
    openGraph: {
      title,
      url: `https://salooote.am/${lang}/login`,
      siteName: "Salooote.am",
      locale: ogLocale,
      type: "website",
    },
    alternates: {
      canonical: `https://salooote.am/${lang}/login`,
    },
  };
}

export default async function LoginPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <LoginPageClient dict={dict} lang={lang} />;
}
