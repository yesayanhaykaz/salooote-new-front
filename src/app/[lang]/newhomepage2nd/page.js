import { getDictionary } from "@/lib/getDictionary";
import NewHomepage2Client from "@/components/NewHomepage2Client";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Salooote — Celebrate everything",
    description:
      "Birthdays, weddings, baby showers — Salooote brings every Armenian celebration together in one beautiful place.",
    alternates: { canonical: `https://salooote.am/${lang}/newhomepage2nd` },
  };
}

export default async function NewHomepage2Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <NewHomepage2Client lang={lang} dict={dict} />;
}
