"use client";
import { useState } from "react";
import { ShoppingBag, CreditCard, RotateCcw, Store, User, Settings, ChevronRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

const topics = [
  { icon: ShoppingBag, title: "Orders & Delivery", desc: "Track orders, delivery timelines, and shipping info." },
  { icon: CreditCard, title: "Payments", desc: "Payment methods, billing, and invoices." },
  { icon: RotateCcw, title: "Returns & Refunds", desc: "Return eligibility, process, and refund timelines." },
  { icon: Store, title: "Vendor Questions", desc: "How vendors work, reviews, and disputes." },
  { icon: User, title: "Account & Profile", desc: "Manage your profile, preferences, and security." },
  { icon: Settings, title: "Technical Issues", desc: "App bugs, errors, and performance issues." },
];

const faqs = [
  { q: "How do I place an order?", a: "Browse vendors, select a service or product, add it to your cart, and proceed to checkout. Payment is processed securely." },
  { q: "Can I cancel my order?", a: "You can cancel orders within 24 hours of placing them. After that, cancellation depends on the vendor's policy." },
  { q: "How long does delivery take?", a: "Delivery times vary by vendor and product type. You'll see an estimated delivery window on the product page before checkout." },
  { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, American Express, and PayPal. Local bank transfers are also available for Armenian customers." },
  { q: "How do I contact a vendor?", a: "Once you've placed an order, you can message the vendor directly from your order details page. Response times are typically within a few hours." },
];

export default function HelpPageClient() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-surface-900 mb-3">Help Center</h1>
            <p className="text-surface-400 mb-6">What can we help you with?</p>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full border-2 border-surface-200 rounded-2xl px-5 py-4 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {topics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <div key={i} className="bg-surface-50 border border-surface-100 rounded-2xl p-5 flex items-start gap-4 hover:border-brand-200 hover:bg-brand-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-surface-900 text-sm mb-1">{topic.title}</p>
                    <p className="text-xs text-surface-400 leading-relaxed">{topic.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-surface-300 group-hover:text-brand-500 flex-shrink-0 mt-0.5 transition-colors" />
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-surface-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-surface-100 rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className="font-medium text-surface-900 text-sm">{faq.q}</span>
                    <ChevronDown size={16} className={`text-brand-500 flex-shrink-0 ml-3 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm text-surface-500 leading-relaxed border-t border-surface-100 pt-3">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="text-center">
            <p className="text-surface-500 text-sm mb-4">Still need help?</p>
            <button className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Chat with us
            </button>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
