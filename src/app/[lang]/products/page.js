import { getDictionary } from "@/lib/getDictionary";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import ProductsPageClient from "@/components/ProductsPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const title = dict.meta.productsTitle;
  const description = dict.meta.productsDesc;
  const ogLocale =
    lang === "hy" ? "hy_AM" : lang === "ru" ? "ru_RU" : "en_US";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://salooote.am/${lang}/products`,
      siteName: "Salooote.am",
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: "https://salooote.am/images/cupcakes.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://salooote.am/${lang}/products`,
      languages: {
        en: "https://salooote.am/en/products",
        hy: "https://salooote.am/hy/products",
        ru: "https://salooote.am/ru/products",
      },
    },
  };
}

export default async function ProductsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const breadcrumbs = [
    { name: dict.nav.home, href: `/${lang}` },
    { name: "Products", href: `/${lang}/products` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ProductsPageClient dict={dict} lang={lang} />
    </>
  );
}
