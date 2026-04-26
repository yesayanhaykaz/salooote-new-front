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
  return {
    title: titles[lang] || titles.en,
    description: descs[lang] || descs.en,
    alternates: { canonical: `https://salooote.am/${lang}/events` },
  };
}

export default async function EventsIndexPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <EventsIndexClient lang={lang} dict={dict} />;
}
