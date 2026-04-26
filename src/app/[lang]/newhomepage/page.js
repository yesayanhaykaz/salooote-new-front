import { getDictionary } from "@/lib/getDictionary";
import NewHomepageClient from "@/components/NewHomepageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Salooote — Plan unforgettable events",
    description:
      "Discover Armenia's best vendors for cakes, flowers, venues, photography and more — all in one beautiful place.",
    alternates: { canonical: `https://salooote.am/${lang}/newhomepage` },
  };
}

export default async function NewHomepagePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <NewHomepageClient lang={lang} dict={dict} />;
}
