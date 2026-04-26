import { ScrollReveal } from "@/components/ScrollReveal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: "Return Policy — Salooote",
    description: "Learn about Salooote's 30-day return policy, eligible items, and refund timeline.",
    alternates: { canonical: `https://salooote.am/${lang}/returns` },
    openGraph: {
      title: "Return Policy — Salooote",
      description: "Learn about Salooote's 30-day return policy, eligible items, and refund timeline.",
      url: `https://salooote.am/${lang}/returns`,
      siteName: "Salooote.am",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Return Policy — Salooote",
      description: "Learn about Salooote's 30-day return policy, eligible items, and refund timeline.",
      images: ["/og-default.jpg"],
    },
  };
}

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h1 className="text-4xl font-bold text-surface-900 mb-3">Return Policy</h1>
            <p className="text-surface-400 mb-8 leading-relaxed">
              Last updated: April 2025
            </p>

            {/* Key Info Box */}
            <div className="bg-brand-50 border-l-4 border-brand-500 rounded-r-2xl px-5 py-4 mb-10">
              <p className="font-semibold text-surface-900 mb-2">Key Points at a Glance</p>
              <ul className="space-y-1 text-sm text-surface-700">
                <li>• 30-day return window from date of delivery</li>
                <li>• Refunds processed within 7–10 business days</li>
                <li>• Perishable and custom items are non-refundable</li>
                <li>• Contact support@salooote.am to initiate a return</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">Overview</h2>
            <p className="text-surface-700 leading-relaxed">
              We want you to be completely satisfied with your Salooote experience. If something isn't right,
              you may return eligible items within 30 days of delivery. Returns are subject to the conditions
              outlined below and must be coordinated through our support team.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">Eligible Items</h2>
            <ul className="text-surface-700 leading-relaxed space-y-2">
              <li>• Unopened, unused physical products (decorations, gifts, supplies)</li>
              <li>• Items with manufacturing defects or damage on arrival</li>
              <li>• Products significantly different from the vendor's description</li>
              <li>• Incorrect items delivered (wrong color, size, or product)</li>
              <li>• Services that were not rendered as agreed</li>
            </ul>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">Non-Eligible Items</h2>
            <ul className="text-surface-700 leading-relaxed space-y-2">
              <li>• Perishable goods (fresh flowers, cakes, food & catering)</li>
              <li>• Custom or personalized items made to order</li>
              <li>• Digital goods or downloadable content</li>
              <li>• Items returned after the 30-day window</li>
              <li>• Products showing signs of use, damage, or alteration by the customer</li>
              <li>• Event services already performed (DJ sets, photography, venue hire)</li>
            </ul>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">How to Return</h2>
            <ol className="text-surface-700 leading-relaxed space-y-3">
              <li><span className="font-semibold text-surface-900">1. Initiate the request.</span> Email support@salooote.am with your order number, a description of the issue, and photos if applicable.</li>
              <li><span className="font-semibold text-surface-900">2. Approval review.</span> Our team will review your request within 2 business days and confirm eligibility.</li>
              <li><span className="font-semibold text-surface-900">3. Return the item.</span> If approved, we'll provide a return address and any prepaid shipping label where applicable.</li>
              <li><span className="font-semibold text-surface-900">4. Item inspection.</span> Once we receive the returned item, our team inspects it within 2 business days.</li>
              <li><span className="font-semibold text-surface-900">5. Refund issued.</span> Approved refunds are processed back to your original payment method.</li>
            </ol>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">Refund Timeline</h2>
            <p className="text-surface-700 leading-relaxed">
              Once a return is approved and the item is received or verified, refunds are processed within{" "}
              <strong>7–10 business days</strong>. The time to appear in your account depends on your bank or
              payment provider. PayPal refunds typically appear within 3–5 business days. For Armenian bank
              transfers, allow up to 10 business days.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-xl font-bold text-surface-900 mt-8 mb-3">Contact</h2>
            <p className="text-surface-700 leading-relaxed">
              Questions about your return? Reach us at{" "}
              <a href="mailto:support@salooote.am" className="text-brand-600 hover:underline font-medium">
                support@salooote.am
              </a>{" "}
              or call <strong>+374 10 000 000</strong> (Mon–Fri, 9am–6pm).
            </p>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
