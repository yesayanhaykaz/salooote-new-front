"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

const tabs = ["General", "Orders", "Vendors", "Payments"];

const faqData = {
  General: [
    { q: "What is Salooote?", a: "Salooote is Armenia's premier event planning marketplace, connecting customers with top-rated vendors for cakes, catering, flowers, music, venues, and more." },
    { q: "Is Salooote available outside Yerevan?", a: "Yes! We have vendors across 50+ cities in Armenia. Availability varies by location — enter your city when browsing to see local vendors." },
    { q: "Do I need an account to order?", a: "You can browse without an account, but you'll need to sign up to place orders and track your purchases." },
    { q: "Is my data safe with Salooote?", a: "Absolutely. We use industry-standard encryption and never sell your personal data. See our Privacy Policy for full details." },
    { q: "How do I leave a review?", a: "After your order is marked delivered, you'll receive an email prompt to rate and review the vendor. You can also review from your order history." },
    { q: "Can I use Salooote for corporate events?", a: "Yes! Many of our vendors cater to corporate clients. Contact us at support@salooote.am for volume pricing and dedicated support." },
  ],
  Orders: [
    { q: "How do I place an order?", a: "Browse vendors, choose a product or service, add to cart, and complete checkout. You'll receive a confirmation email immediately." },
    { q: "Can I modify my order after placing it?", a: "Modifications are possible within 1 hour of placing your order. Contact the vendor directly or reach out to our support team." },
    { q: "How do I track my order?", a: "Visit the Track Order page and enter your order number and email. You'll see real-time status updates." },
    { q: "What if my order arrives damaged?", a: "Contact us within 48 hours of delivery with photos. We'll arrange a replacement or full refund." },
    { q: "Can I schedule a delivery for a specific date?", a: "Yes, most vendors allow scheduling. You'll see available dates during checkout. Some categories like flowers and cakes require 24–72 hours notice." },
  ],
  Vendors: [
    { q: "How are vendors vetted?", a: "All vendors go through identity verification, quality checks, and must maintain a minimum 4.0 star rating. We also conduct periodic audits." },
    { q: "Can I contact a vendor before ordering?", a: "Yes! Each vendor profile has a 'Message' button. You can ask questions about customization, pricing, or availability." },
    { q: "What if a vendor cancels my order?", a: "In the rare event a vendor cancels, you'll be notified immediately and receive a full refund within 3–5 business days." },
    { q: "How do vendor ratings work?", a: "Ratings are calculated from verified customer reviews only. Each review is submitted after a completed order and cannot be edited after 30 days." },
    { q: "Can I become a vendor?", a: "Absolutely! Visit our Apply page to submit your application. We review all applications within 3–5 business days." },
  ],
  Payments: [
    { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, and local Armenian bank transfers (Arca, Visa Armenia)." },
    { q: "When is my card charged?", a: "Your card is charged immediately upon placing an order. For custom orders, we may charge a deposit upfront." },
    { q: "How do refunds work?", a: "Approved refunds are processed within 7–10 business days back to your original payment method." },
    { q: "Is checkout secure?", a: "Yes. All transactions are processed via PCI-DSS compliant payment gateways. We never store your full card details." },
    { q: "Do you offer installment payments?", a: "Installment options are available for orders over AMD 50,000 through our partner banks. Select 'Pay in installments' at checkout." },
    { q: "Can I get an invoice for my order?", a: "Yes. Go to your order history and click 'Download Invoice'. Corporate invoices with VAT details are available on request." },
  ],
};

export default function FAQPageClient() {
  const [activeTab, setActiveTab] = useState("General");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const currentFaqs = faqData[activeTab].filter(
    (faq) => !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-4xl font-bold text-surface-900 mb-3">Frequently Asked Questions</h1>
            <p className="text-surface-400 mb-6">Everything you need to know about Salooote.</p>
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              placeholder="Search questions..."
              className="w-full border-2 border-surface-200 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setOpenIndex(null); }}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-2xl mx-auto space-y-3">
            {currentFaqs.length === 0 && (
              <p className="text-center text-surface-400 py-8">No results found. Try a different search.</p>
            )}
            {currentFaqs.map((faq, i) => (
              <div key={i} className="border border-surface-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors">
                  <span className="font-medium text-surface-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown size={16} className={`text-brand-500 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 pb-5 pt-3 text-sm text-surface-500 leading-relaxed border-t border-surface-100">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
