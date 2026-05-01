import TrackOrderPageClient from "@/components/TrackOrderPageClient";

const meta = {
  en: {
    title: "Track Your Order — Salooote.am",
    description: "Track the status of your Salooote order in real time.",
  },
  hy: {
    title: "Հետևել պատվերին — Salooote.am",
    description: "Հետևեք ձեր Salooote պատվերի ընթացքին իրական ժամանակում։",
  },
  ru: {
    title: "Отследить заказ — Salooote.am",
    description: "Отслеживайте статус вашего заказа Salooote в реальном времени.",
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = params;
  const t = meta[lang] || meta.en;

  return {
    title: t.title,
    description: t.description,
    robots: { index: false },
    alternates: {
      canonical: `https://development.salooote.am/${lang}/track-order`,
    },
  };
}

export default function TrackOrderPage({ params }) {
  return <TrackOrderPageClient lang={params.lang} />;
}