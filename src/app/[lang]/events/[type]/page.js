import { getDictionary } from "@/lib/getDictionary";
import EventTypeClient from "./EventTypeClient";

export async function generateStaticParams() {
  const langs = ["en", "hy", "ru"];
  const types = ["wedding", "birthday", "corporate", "engagement", "anniversary", "kids-party", "balloons", "cakes", "cartoon-characters", "gifts", "romantic", "baptism", "baby-tooth", "christmas"];
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
  const title = `${name} — Salooote.am`;
  const description = `Find the best vendors for your ${name.toLowerCase()} in Armenia. Cakes, flowers, catering, music and more on Salooote.am`;
  return {
    title,
    description,
    alternates: { canonical: `https://salooote.am/${lang}/events/${type}` },
    openGraph: {
      title,
      description,
      url: `https://salooote.am/${lang}/events/${type}`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.jpg"],
    },
  };
}

export default async function EventTypePage({ params }) {
  const { lang, type } = await params;
  const dict = await getDictionary(lang);
  return <EventTypeClient lang={lang} type={type} dict={dict} />;
}
