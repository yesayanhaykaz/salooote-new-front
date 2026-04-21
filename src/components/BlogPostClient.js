"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowLeft, Calendar, Clock, User, Tag, Send, ChevronRight } from "lucide-react";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-600">
      <Tag size={10} />
      {category}
    </span>
  );
}

function ArticleBody({ content }) {
  // Render safe HTML-style content with prose styling
  return (
    <div
      className="
        [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:font-bold [&>h2]:text-surface-900
        [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:leading-snug
        [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-surface-900
        [&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:leading-snug
        [&>p]:text-[15px] [&>p]:leading-relaxed [&>p]:text-surface-700
        [&>p]:mb-4
        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul]:text-[15px] [&>ul]:text-surface-700
        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>ol]:text-[15px] [&>ol]:text-surface-700
        [&>li]:mb-1.5
        [&>blockquote]:border-l-4 [&>blockquote]:border-brand-300
        [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-surface-500 [&>blockquote]:my-6
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function SidebarCard({ post, lang }) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-100">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-surface-800 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-1">
          {post.title}
        </p>
        <span className="flex items-center gap-1 text-[11px] text-surface-400">
          <Clock size={10} />
          {post.readTime}
        </span>
      </div>
      <ChevronRight size={14} className="text-surface-300 group-hover:text-brand-500 transition-colors shrink-0 mt-1" />
    </Link>
  );
}

function RelatedCard({ post, lang }) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="group block">
      <motion.div
        className="rounded-2xl overflow-hidden bg-white shadow-card border border-surface-100"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative h-40 overflow-hidden bg-surface-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-4">
          <div className="mb-2">
            <CategoryBadge category={post.category} />
          </div>
          <h4 className="text-sm font-bold text-surface-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-surface-400">
            <Calendar size={10} />
            {formatDate(post.date)}
            <span>·</span>
            <Clock size={10} />
            {post.readTime}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-7 md:p-8 text-white">
      <h3 className="text-xl font-bold mb-2">Stay inspired</h3>
      <p className="text-brand-100 text-sm leading-relaxed mb-5">
        Get the latest event planning tips, vendor spotlights, and seasonal ideas — delivered to your inbox.
      </p>
      {submitted ? (
        <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-3 text-sm font-medium">
          <span>Done!</span>
          <span>You're subscribed! Thanks for joining.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/15 border border-white/20 placeholder-brand-200 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-600 text-sm font-semibold hover:bg-brand-50 transition-colors shrink-0"
          >
            <Send size={14} />
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

export default function BlogPostClient({ post, relatedPosts, lang, dict }) {
  return (
    <div className="bg-surface-50 min-h-screen">
      {/* Back button */}
      <div className="max-w-container mx-auto px-4 md:px-8 pt-6 pb-2">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-600 transition-colors group"
        >
          <motion.span
            className="inline-flex items-center gap-2"
            whileHover={{ x: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <ArrowLeft size={15} />
            Back to Blog
          </motion.span>
        </Link>
      </div>

      <div className="max-w-container mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          {/* Main content */}
          <article>
            {/* Hero image */}
            <ScrollReveal variant="scaleUp" className="mb-8">
              <motion.div
                className="relative h-72 md:h-[420px] w-full rounded-2xl overflow-hidden bg-surface-100"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1200px) 100vw, 860px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </ScrollReveal>

            {/* Meta */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <CategoryBadge category={post.category} />
                <span className="flex items-center gap-1.5 text-xs text-surface-400">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>
            </ScrollReveal>

            {/* Title */}
            <ScrollReveal variant="fadeUp" delay={0.15}>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 leading-tight mb-5">
                {post.title}
              </h1>
            </ScrollReveal>

            {/* Author row */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="flex items-center gap-3 pb-6 mb-8 border-b border-surface-200">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface-100 shrink-0">
                  <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-800">{post.author}</p>
                  <div className="flex items-center gap-2 text-xs text-surface-400 mt-0.5">
                    <Calendar size={11} />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Article body */}
            <ScrollReveal variant="fadeUp" delay={0.25}>
              <ArticleBody content={post.content} />
            </ScrollReveal>

            {/* Newsletter CTA */}
            <ScrollReveal variant="fadeUp" className="mt-12">
              <NewsletterBox />
            </ScrollReveal>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <ScrollReveal variant="fadeUp" className="mt-14">
                <h2 className="text-xl font-bold text-surface-900 mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedPosts.map((rp) => (
                    <RelatedCard key={rp.slug} post={rp} lang={lang} />
                  ))}
                </div>
              </ScrollReveal>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* More articles */}
              <ScrollReveal variant="slideLeft" delay={0.3}>
                <div className="bg-white rounded-2xl border border-surface-100 shadow-soft p-5">
                  <h3 className="text-sm font-bold text-surface-900 mb-4 uppercase tracking-wide">
                    More Articles
                  </h3>
                  <div className="space-y-1">
                    {relatedPosts.map((rp) => (
                      <SidebarCard key={rp.slug} post={rp} lang={lang} />
                    ))}
                  </div>
                  <Link
                    href={`/${lang}/blog`}
                    className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors w-full pt-4 border-t border-surface-100"
                  >
                    View all posts <ChevronRight size={14} />
                  </Link>
                </div>
              </ScrollReveal>

              {/* Sidebar newsletter teaser */}
              <ScrollReveal variant="slideLeft" delay={0.4}>
                <div className="rounded-2xl bg-brand-50 border border-brand-100 p-5">
                  <p className="text-sm font-bold text-brand-700 mb-1">Get weekly tips</p>
                  <p className="text-xs text-brand-500 leading-relaxed mb-3">
                    Subscribe to the Salooote newsletter for event planning inspiration.
                  </p>
                  <Link
                    href={`/${lang}/blog`}
                    className="block text-center px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
                  >
                    Subscribe
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
