import { getDictionary } from "@/lib/getDictionary";
import SignupPageClient from "@/components/SignupPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const title = dict.meta.signupTitle;
  const ogLocale =
    lang === "hy" ? "hy_AM" : lang === "ru" ? "ru_RU" : "en_US";

  return {
    title,
    openGraph: {
      title,
      url: `https://development.salooote.am/${lang}/signup`,
      siteName: "Salooote.am",
      locale: ogLocale,
      type: "website",
    },
    alternates: {
      canonical: `https://development.salooote.am/${lang}/signup`,
    },
  };
}

export default async function SignupPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <SignupPageClient dict={dict} lang={lang} />;
}
