import { BookOpen, Star, DollarSign, Share2, Camera, FileText, Video, Calendar, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Vendor Resources — Salooote",
    description: "Guides, tools, and webinars to help Salooote vendors grow their business.",
    alternates: { canonical: `https://salooote.am/${lang}/vendor-resources` },
    openGraph: {
      title: "Vendor Resources — Salooote",
      description: "Guides, tools, and webinars to help Salooote vendors grow their business.",
      url: `https://salooote.am/${lang}/vendor-resources`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Vendor Resources — Salooote",
      description: "Guides, tools, and webinars to help Salooote vendors grow their business.",
      images: ["/images/hero-dj.jpg"],
    },
  };
}

const gettingStarted = [
  { icon: BookOpen, title: "Setup Guide", desc: "Step-by-step instructions to configure your profile, add services, and go live.", cta: "Read Guide" },
  { icon: Star, title: "How to Get Reviews", desc: "Best practices for requesting reviews and building your reputation on Salooote.", cta: "Read Guide" },
  { icon: DollarSign, title: "Pricing Tips", desc: "Data-driven strategies to price your services competitively and increase bookings.", cta: "Download PDF" },
];

const marketingTools = [
  { icon: Share2, title: "Social Media Kit", desc: "Ready-to-use templates for Instagram, Facebook, and TikTok to promote your Salooote profile.", cta: "Download Kit" },
  { icon: Camera, title: "Photography Tips", desc: "How to photograph your products and services to maximize conversions on your listing.", cta: "Read Guide" },
  { icon: FileText, title: "Writing Great Descriptions", desc: "Copywriting frameworks to craft compelling service descriptions that convert.", cta: "Read Guide" },
];

const webinars = [
  { date: "April 24, 2025", title: "Maximizing Your Salooote Profile for Wedding Season", time: "6:00 PM Yerevan" },
  { date: "May 8, 2025", title: "Pricing Strategy Workshop: How to Compete and Win", time: "6:00 PM Yerevan" },
  { date: "May 22, 2025", title: "Getting More Reviews: Real Tactics from Top Vendors", time: "6:00 PM Yerevan" },
];

function ResourceSection({ title, items }) {
  return (
    <div className="mb-14">
      <h2 className="text-2xl font-bold text-surface-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-surface-50 border border-surface-100 rounded-2xl p-5 hover:border-brand-200 transition-colors group">
              <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-600" />
              </div>
              <h3 className="font-bold text-surface-900 mb-2 text-sm">{item.title}</h3>
              <p className="text-xs text-surface-500 leading-relaxed mb-4">{item.desc}</p>
              <button className="text-xs font-semibold text-brand-600 flex items-center gap-1 hover:gap-2 transition-all">
                {item.cta} <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VendorResourcesClient() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-surface-900 mb-2">Vendor Resources</h1>
            <p className="text-surface-400">Everything you need to succeed on Salooote.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <ResourceSection title="Getting Started" items={gettingStarted} />
        </ScrollReveal>

        <ScrollReveal>
          <ResourceSection title="Marketing Tools" items={marketingTools} />
        </ScrollReveal>

        {/* Webinars */}
        <ScrollReveal>
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-surface-900 mb-6">Upcoming Webinars</h2>
            <div className="space-y-4">
              {webinars.map((w, i) => (
                <div key={i} className="border border-surface-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Video size={20} className="text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-surface-900 text-sm">{w.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-surface-400">
                      <Calendar size={12} />
                      <span>{w.date}</span>
                      <span>·</span>
                      <span>{w.time}</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Footer Links */}
        <ScrollReveal>
          <div className="bg-surface-50 border border-surface-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <p className="font-semibold text-surface-900 mb-1">Vendor Portal</p>
              <p className="text-sm text-surface-500">Manage your listings, orders, and earnings.</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a href="/vendor" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors text-center">
                Go to Vendor Portal
              </a>
              <a href="mailto:vendorsupport@salooote.am" className="text-sm text-brand-600 hover:underline text-center">
                vendorsupport@salooote.am
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

export default function VendorResourcesPage({ params }) {
  return <VendorResourcesClient />;
}
