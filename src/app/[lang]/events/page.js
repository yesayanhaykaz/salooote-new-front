import { getDictionary } from "@/lib/getDictionary";
import EventsIndexClient from "./EventsIndexClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const titles = {
    en: "Browse all event types — Salooote",
    hy: "Բոլոր միջոցառումների տեսակները — Salooote",
    ru: "Все типы мероприятий — Salooote",
  };
  const descs = {
    en: "Weddings, birthdays, baptisms, baby showers and more — find the right vendors for every Armenian celebration on Salooote.",
    hy: "Հարսանիքներ, ծնունդներ, մկրտություններ, մանկական տոներ և շատ ավելին՝ Salooote հարթակում։",
    ru: "Свадьбы, дни рождения, крещения, детские праздники и многое другое — найдите подходящих поставщиков на Salooote.",
  };
  const title = titles[lang] || titles.en;
  const description = descs[lang] || descs.en;
  return {
    title,
    description,
    alternates: { canonical: `https://development.salooote.am/${lang}/events` },
    openGraph: {
      title,
      description,
      url: `https://development.salooote.am/${lang}/events`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-dj.jpg"],
    },
  };
}

export default async function EventsIndexPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <EventsIndexClient lang={lang} dict={dict} />;
}
