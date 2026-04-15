import TrackOrderPageClient from "@/components/TrackOrderPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Track Your Order — Salooote.am",
    description: "Track the status of your Salooote order in real time.",
    robots: { index: false },
    alternates: {
      canonical: `https://salooote.am/${lang}/track-order`,
    },
  };
}

export default function TrackOrderPage() {
  return <TrackOrderPageClient />;
}
