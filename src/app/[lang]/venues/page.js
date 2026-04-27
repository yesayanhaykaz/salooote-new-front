import { getDictionary } from "@/lib/getDictionary";
import VenuesClient from "@/app/venues/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const titles = { en: "Venues & Halls — Salooote.am", hy: "Վայրեր ու դահլիճներ — Salooote.am", ru: "Площадки и залы — Salooote.am" };
  const descs = {
    en: "Find wedding halls, restaurants, cafés, churches and outdoor venues for your event in Armenia.",
    hy: "Գտեք հարսանյաց դահլիճներ, ռեստորաններ, սրճարաններ և բաց վայրեր Հայաստանում:",
    ru: "Найдите свадебные залы, рестораны, кафе и площадки на открытом воздухе в Армении.",
  };
  const title = titles[lang] || titles.en;
  const description = descs[lang] || descs.en;
  const pageUrl = `https://development.salooote.am/${lang}/venues`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: "https://development.salooote.am/en/venues",
        hy: "https://development.salooote.am/hy/venues",
        ru: "https://development.salooote.am/ru/venues",
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
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

export default async function VenuesPage({ params }) {
  const { lang } = await params;
  return <VenuesClient lang={lang} />;
}
