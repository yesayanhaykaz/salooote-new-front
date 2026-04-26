import { Download, ExternalLink } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Press & Media — Salooote",
    description: "Press kit, media coverage, and brand assets for Salooote.",
    alternates: { canonical: `https://salooote.am/${lang}/press` },
    openGraph: {
      title: "Press & Media — Salooote",
      description: "Press kit, media coverage, and brand assets for Salooote.",
      url: `https://salooote.am/${lang}/press`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Press & Media — Salooote",
      description: "Press kit, media coverage, and brand assets for Salooote.",
      images: ["/og-default.jpg"],
    },
  };
}

const coverage = [
  { outlet: "Hetq", initials: "HQ", headline: "Armenian startup Salooote raises seed round to expand event marketplace", date: "March 2025" },
  { outlet: "CivilNet", initials: "CN", headline: "How Salooote is digitizing Armenia's event planning industry", date: "January 2025" },
  { outlet: "Forbes AM", initials: "FA", headline: "The 10 most promising Armenian tech startups of 2024", date: "December 2024" },
  { outlet: "Yerevan Today", initials: "YT", headline: "Salooote hits 800+ vendors as demand for online event planning surges", date: "October 2024" },
];

function PressClient() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-surface-900 mb-2">Press & Media</h1>
            <p className="text-surface-400">Resources for journalists, bloggers, and media partners.</p>
          </div>
        </ScrollReveal>

        {/* Press Kit */}
        <ScrollReveal>
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 mb-12 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-surface-900 mb-1">Press Kit</h2>
              <p className="text-sm text-surface-500">Company overview, founder bios, product screenshots, and approved messaging in one package.</p>
            </div>
            <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors flex-shrink-0">
              <Download size={16} />
              Download Press Kit
            </button>
          </div>
        </ScrollReveal>

        {/* Media Coverage */}
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-surface-900 mb-6">Media Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            {coverage.map((article, i) => (
              <div key={i} className="border border-surface-100 rounded-2xl p-5 hover:border-brand-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-surface-500 font-bold text-sm flex-shrink-0">
                    {article.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-brand-600 font-semibold mb-1">{article.outlet}</p>
                    <p className="font-medium text-surface-900 text-sm leading-snug mb-2">{article.headline}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-surface-400">{article.date}</p>
                      <button className="text-xs text-surface-400 hover:text-brand-600 transition-colors flex items-center gap-1">
                        <ExternalLink size={12} /> Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Brand Assets */}
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-surface-900 mb-4">Brand Assets</h2>
          <p className="text-surface-500 text-sm mb-5">Official logos for use in press articles and partner materials. Please follow our brand guidelines.</p>
          <div className="flex gap-3 flex-wrap mb-14">
            <button className="flex items-center gap-2 border-2 border-surface-200 hover:border-brand-500 text-surface-700 hover:text-brand-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              <Download size={15} />
              Logo — SVG
            </button>
            <button className="flex items-center gap-2 border-2 border-surface-200 hover:border-brand-500 text-surface-700 hover:text-brand-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              <Download size={15} />
              Logo — PNG
            </button>
          </div>
        </ScrollReveal>

        {/* Press Contact */}
        <ScrollReveal>
          <div className="bg-surface-50 border border-surface-100 rounded-2xl px-6 py-6">
            <h2 className="text-lg font-bold text-surface-900 mb-2">Press Contact</h2>
            <p className="text-sm text-surface-500 mb-3">
              For media inquiries, interview requests, or to receive our press kit, contact:
            </p>
            <a href="mailto:press@salooote.am" className="text-brand-600 font-semibold hover:underline text-sm">
              press@salooote.am
            </a>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

export default function PressPage({ params }) {
  return <PressClient />;
}
