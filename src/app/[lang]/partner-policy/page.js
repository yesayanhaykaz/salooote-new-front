import { ScrollReveal } from "@/components/ScrollReveal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Partner Policy — Salooote",
    description: "Terms and policies for vendors and partners on the Salooote marketplace.",
    alternates: { canonical: `https://salooote.am/${lang}/partner-policy` },
    openGraph: {
      title: "Partner Policy — Salooote",
      description: "Terms and policies for vendors and partners on the Salooote marketplace.",
      url: `https://salooote.am/${lang}/partner-policy`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Partner Policy — Salooote",
      description: "Terms and policies for vendors and partners on the Salooote marketplace.",
      images: ["/og-default.jpg"],
    },
  };
}

export default function PartnerPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h1 className="text-4xl font-bold text-surface-900 mb-2">Partner Policy</h1>
            <p className="text-surface-400 mb-8">Last updated: April 2025</p>

            {/* Key Terms Box */}
            <div className="bg-brand-50 border-l-4 border-brand-500 rounded-r-2xl px-5 py-4 mb-10">
              <p className="font-semibold text-surface-900 mb-2">Key Terms Summary</p>
              <ul className="space-y-1 text-sm text-surface-700">
                <li>• 15% commission on all transactions processed through Salooote</li>
                <li>• Monthly payouts on the 15th of each month</li>
                <li>• Partners must maintain a minimum 4.0 star rating</li>
                <li>• 30-day notice required for voluntary termination</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">1. Introduction</h2>
            <p className="text-surface-700 leading-relaxed">
              This Partner Policy governs the relationship between Salooote, Inc. ("Salooote", "we", "us") and vendors
              ("Partner", "you") who list services or products on the Salooote marketplace. By registering as a partner
              or continuing to use our platform, you agree to the terms outlined in this policy.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">2. Commission Structure</h2>
            <p className="text-surface-700 leading-relaxed mb-3">
              Salooote charges a <strong>15% commission</strong> on the total value of each transaction completed
              through our platform. This includes the product or service price plus any delivery fees set by the partner.
            </p>
            <ol className="text-surface-700 leading-relaxed space-y-2">
              <li>1. Commission is calculated on the gross order value before taxes.</li>
              <li>2. No commission is charged on cancelled or refunded orders.</li>
              <li>3. Promotional discounts funded by Salooote do not affect your commission base.</li>
              <li>4. The commission rate may change with 30 days' written notice.</li>
            </ol>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">3. Payment Terms</h2>
            <p className="text-surface-700 leading-relaxed">
              Earnings are paid out <strong>monthly on the 15th</strong> for all orders fulfilled in the previous
              calendar month. Payments are made via bank transfer to the account on file. Minimum payout threshold
              is AMD 10,000. Balances below this amount roll over to the following month.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">4. Prohibited Items</h2>
            <ol className="text-surface-700 leading-relaxed space-y-2">
              <li>1. Alcohol or controlled substances (unless explicitly licensed)</li>
              <li>2. Counterfeit goods or trademark-infringing products</li>
              <li>3. Services that violate Armenian law</li>
              <li>4. Misleading or deceptive product descriptions</li>
              <li>5. Adult content or material inappropriate for a general audience</li>
            </ol>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">5. Quality Standards</h2>
            <p className="text-surface-700 leading-relaxed">
              Partners are required to maintain a minimum average rating of <strong>4.0 stars</strong> across all
              reviews. Partners falling below this threshold will receive a 30-day improvement notice. Failure to
              improve may result in temporary suspension or removal from the platform.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">6. Termination Policy</h2>
            <p className="text-surface-700 leading-relaxed">
              Either party may terminate the partnership with <strong>30 days' written notice</strong>. Salooote
              reserves the right to immediately suspend or terminate a partner account in cases of fraud, repeated
              policy violations, or significant harm to customers. Outstanding earnings will be paid within 60 days
              of termination.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">7. Contact</h2>
            <p className="text-surface-700 leading-relaxed">
              For policy questions or disputes, contact our Partner Relations team at{" "}
              <a href="mailto:partners@salooote.am" className="text-brand-600 hover:underline font-medium">
                partners@salooote.am
              </a>
              .
            </p>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
