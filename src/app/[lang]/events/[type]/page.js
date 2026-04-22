import { getDictionary } from "@/lib/getDictionary";
import EventTypeClient from "./EventTypeClient";

export async function generateStaticParams() {
  const langs = ["en", "hy", "ru"];
  const types = ["wedding", "birthday", "corporate", "engagement", "anniversary", "kids-party"];
  return langs.flatMap(lang => types.map(type => ({ lang, type })));
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { lang, type } = await params;
  const labels = {
    wedding: "Wedding Planning",
    birthday: "Birthday Parties",
    corporate: "Corporate Events",
    engagement: "Engagements",
    anniversary: "Anniversaries",
    "kids-party": "Kids' Parties",
  };
  const name = labels[type] || type.replace(/-/g, " ");
  return {
    title: `${name} — Salooote.am`,
    description: `Find the best vendors for your ${name.toLowerCase()} in Armenia. Cakes, flowers, catering, music and more on Salooote.am`,
  };
}

export default async function EventTypePage({ params }) {
  const { lang, type } = await params;
  const dict = await getDictionary(lang);
  return <EventTypeClient lang={lang} type={type} dict={dict} />;
}
