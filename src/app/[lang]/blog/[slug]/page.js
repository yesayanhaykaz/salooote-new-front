import { getDictionary } from "@/lib/getDictionary";
import BlogPostClient from "@/components/BlogPostClient";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const langs = ["en", "hy", "ru"];
  return langs.flatMap((lang) => BLOG_POSTS.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — Salooote.am`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: `https://development.salooote.am${post.image}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: `https://development.salooote.am/${lang}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { lang, slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const dict = await getDictionary(lang);
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  return (
    <BlogPostClient
      post={post}
      relatedPosts={relatedPosts}
      lang={lang}
      dict={dict}
    />
  );
}
