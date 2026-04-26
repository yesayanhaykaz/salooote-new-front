import { Zap, Heart, Globe } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Careers at Salooote",
    description: "Join Salooote and help build Armenia's event economy. View open positions.",
    alternates: { canonical: `https://salooote.am/${lang}/careers` },
    openGraph: {
      title: "Careers at Salooote",
      description: "Join Salooote and help build Armenia's event economy. View open positions.",
      url: `https://salooote.am/${lang}/careers`,
      siteName: "Salooote.am",
      images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Careers at Salooote",
      description: "Join Salooote and help build Armenia's event economy. View open positions.",
      images: ["/images/hero-dj.jpg"],
    },
  };
}

const jobs = [
  {
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Yerevan / Remote",
    type: "Full-time",
    desc: "Build fast, accessible, and delightful product experiences using Next.js, Tailwind CSS, and Framer Motion.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Yerevan / Remote",
    type: "Full-time",
    desc: "Shape the visual and interaction language of Salooote's web and mobile products from research to pixel-perfect delivery.",
  },
  {
    title: "Vendor Success Manager",
    department: "Operations",
    location: "Yerevan",
    type: "Full-time",
    desc: "Partner with our vendors to ensure they succeed on the platform — onboarding, training, and growth strategies.",
  },
  {
    title: "Marketing Lead",
    department: "Marketing",
    location: "Yerevan / Remote",
    type: "Full-time",
    desc: "Own Salooote's go-to-market strategy: brand campaigns, social media, influencer partnerships, and growth initiatives.",
  },
];

const perks = [
  { icon: Zap, title: "Fast-moving team", desc: "Ship features weekly in a lean, high-ownership environment." },
  { icon: Heart, title: "Mission-driven", desc: "We're building something people genuinely love and use every day." },
  { icon: Globe, title: "Flexible & remote-friendly", desc: "Most roles are remote-eligible. Work from wherever you do your best thinking." },
];

function CareersClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-brand-50">
        <div className="max-w-container mx-auto px-4 md:px-8 text-center">
          <ScrollReveal>
            <h1 className="text-5xl font-bold text-surface-900 mb-4">Join our team</h1>
            <p className="text-surface-500 text-lg max-w-lg mx-auto">
              We're building Armenia's event economy. Come work on something that matters.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-surface-900 mb-6">Open Positions</h2>
            <div className="space-y-4">
              {jobs.map((job, i) => (
                <div key={i} className="bg-surface-50 border border-surface-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-bold text-surface-900">{job.title}</h3>
                      <span className="bg-brand-50 text-brand-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {job.department}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-surface-400 mb-2">
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                    </div>
                    <p className="text-sm text-surface-500 leading-relaxed">{job.desc}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href={`mailto:careers@salooote.am?subject=Application: ${job.title}`}
                      className="inline-block border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Apply
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* No-match CTA */}
          <ScrollReveal>
            <div className="mt-8 bg-brand-50 border border-brand-100 rounded-2xl px-6 py-5 text-center">
              <p className="text-surface-700 text-sm">
                Don't see your role?{" "}
                <a href="mailto:careers@salooote.am" className="text-brand-600 font-semibold hover:underline">
                  Send us your CV at careers@salooote.am
                </a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Culture / Perks */}
      <section className="py-16 bg-surface-50">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">Why Salooote?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {perks.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="bg-white border border-surface-100 rounded-2xl p-6">
                  <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-brand-600" />
                  </div>
                  <p className="font-bold text-surface-900 mb-2">{title}</p>
                  <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

export default function CareersPage({ params }) {
  return <CareersClient />;
}
