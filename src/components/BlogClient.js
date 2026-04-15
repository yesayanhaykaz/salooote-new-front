"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Calendar, Clock, User, ArrowRight, BookOpen, Tag } from "lucide-react";

const TABS = ["All", "Weddings", "Birthdays", "Corporate", "Tips"];

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

function FeaturedPost({ post, lang }) {
  return (
    <ScrollReveal variant="fadeUp" className="mb-14">
      <Link href={`/${lang}/blog/${post.slug}`} className="group block">
        <motion.div
          className="rounded-2xl overflow-hidden bg-white shadow-elevated border border-surface-100 grid grid-cols-1 md:grid-cols-2"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Image */}
          <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-600 text-white shadow">
                ★ Featured
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-7 md:p-10 flex flex-col justify-center">
            <div className="mb-3">
              <CategoryBadge category={post.category} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 leading-snug mb-3 group-hover:text-brand-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-surface-500 text-[15px] leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-surface-400 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {post.readTime}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-surface-100 shrink-0">
                <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" />
              </div>
              <span className="text-sm font-medium text-surface-700">{post.author}</span>
              <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                Read article <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </ScrollReveal>
  );
}

function BlogCard({ post, lang, index }) {
  return (
    <StaggerItem>
      <Link href={`/${lang}/blog/${post.slug}`} className="group block h-full">
        <motion.div
          className="h-full rounded-2xl overflow-hidden bg-white shadow-card border border-surface-100 flex flex-col"
          whileHover={{ y: -4, boxShadow: "0 16px 40px -8px rgba(0,0,0,0.12)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-surface-100 shrink-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="mb-3">
              <CategoryBadge category={post.category} />
            </div>
            <h3 className="text-base font-bold text-surface-900 leading-snug mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-surface-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
              <div className="w-7 h-7 rounded-full overflow-hidden relative bg-surface-100 shrink-0">
                <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-surface-700 truncate">{post.author}</p>
                <div className="flex items-center gap-2 text-[11px] text-surface-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(post.date)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </StaggerItem>
  );
}

export default function BlogClient({ posts, lang, dict }) {
  const [activeTab, setActiveTab] = useState("All");

  const featuredPost = posts.find((p) => p.featured);
  const filteredPosts = posts.filter((p) => {
    const notFeatured = !p.featured;
    const matchesTab = activeTab === "All" || p.category === activeTab;
    return notFeatured && matchesTab;
  });
  // If filtering by a category that includes the featured post, show it too (non-featured view)
  const allFiltered =
    activeTab === "All"
      ? posts.filter((p) => !p.featured)
      : posts.filter((p) => p.category === activeTab);

  const displayPosts = activeTab === "All" ? filteredPosts : allFiltered;

  return (
    <div className="bg-surface-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-surface-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-50 blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-brand-50 blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-20 relative">
          <ScrollReveal variant="fadeUp">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-brand-50 to-brand-100 text-brand-600 border border-brand-200 mb-5">
                <BookOpen size={15} />
                Salooote Blog
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-4 leading-tight">
                Event Planning
                <span className="text-brand-600"> Inspiration</span>
              </h1>
              <p className="text-surface-500 text-lg leading-relaxed">
                Expert tips, vendor spotlights, and ideas to make every celebration unforgettable.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-container mx-auto px-4 md:px-8 py-12">
        {/* Featured post */}
        {featuredPost && activeTab === "All" && (
          <FeaturedPost post={featuredPost} lang={lang} />
        )}

        {/* Filter tabs */}
        <ScrollReveal variant="fadeUp" className="mb-10">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-surface-100 shadow-soft w-full md:w-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  style={{ color: activeTab === tab ? "#fff" : undefined }}
                >
                  {activeTab === tab && (
                    <motion.span
                      layoutId="blog-tab-pill"
                      className="absolute inset-0 bg-brand-600 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      activeTab === tab
                        ? "text-white"
                        : "text-surface-600 hover:text-surface-900"
                    }`}
                  >
                    {tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Posts grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {displayPosts.length > 0 ? (
              <StaggerContainer
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                staggerDelay={0.08}
              >
                {displayPosts.map((post, i) => (
                  <BlogCard key={post.slug} post={post} lang={lang} index={i} />
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-20 text-surface-400">
                <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No posts in this category yet.</p>
                <p className="text-sm mt-1">Check back soon!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
