import { getDictionary } from "@/lib/getDictionary";
import BlogClient from "@/components/BlogClient";
import { BLOG_POSTS } from "@/lib/blogPosts";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Blog — Salooote.am",
    description:
      "Event planning tips, vendor spotlights, and inspiration for your next celebration.",
    alternates: {
      canonical: `https://salooote.am/${lang}/blog`,
      languages: {
        en: "https://salooote.am/en/blog",
        hy: "https://salooote.am/hy/blog",
        ru: "https://salooote.am/ru/blog",
      },
    },
    openGraph: {
      title: "Blog — Salooote.am",
      description: "Event planning tips, vendor spotlights, and inspiration for your next celebration.",
      url: `https://salooote.am/${lang}/blog`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog — Salooote.am",
      description: "Event planning tips, vendor spotlights, and inspiration for your next celebration.",
      images: ["/images/hero-dj.jpg"],
    },
  };
}

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <BlogClient posts={BLOG_POSTS} lang={lang} dict={dict} />;
}
