"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@salooote.am", href: "mailto:support@salooote.am" },
  { icon: Phone, label: "Phone", value: "+374 10 000 000", href: "tel:+37410000000" },
  { icon: MapPin, label: "Address", value: "Yerevan, Armenia", href: null },
  { icon: Clock, label: "Hours", value: "Mon–Fri 9am–6pm", href: null },
];

const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-surface-900 mb-2">Contact Us</h1>
            <p className="text-surface-400">We'd love to hear from you. Reach out any time.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ScrollReveal>
            {sent ? (
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-8 text-center">
                <p className="text-2xl font-bold text-brand-600 mb-2">Message sent!</p>
                <p className="text-surface-500 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-4 text-brand-600 text-sm font-medium hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <div className="bg-surface-50 border border-surface-100 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-5">Send us a message</h2>
                <div className="space-y-4">
                  {[
                    { label: "Name", field: "name", type: "text", placeholder: "Your name" },
                    { label: "Email", field: "email", type: "email", placeholder: "you@example.com" },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-surface-700 mb-1">{label}</label>
                      <input type={type} value={form[field]} onChange={update(field)} placeholder={placeholder}
                        className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Subject</label>
                    <select value={form.subject} onChange={update("subject")}
                      className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition bg-white">
                      <option value="">Select a subject</option>
                      <option value="order">Order Issue</option>
                      <option value="vendor">Vendor Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Message</label>
                    <textarea value={form.message} onChange={update("message")} placeholder="How can we help?" rows={5}
                      className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition resize-none" />
                  </div>
                  <button onClick={() => setSent(true)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h2 className="text-lg font-semibold text-surface-900 mb-5">Get in touch</h2>
              <div className="space-y-4 mb-6">
                {contactInfo.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-4 bg-surface-50 border border-surface-100 rounded-2xl px-4 py-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-brand-600" />
                      </div>
                      <div>
                        <p className="text-xs text-surface-400 font-medium">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-semibold text-surface-900 hover:text-brand-600 transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-sm font-semibold text-surface-900">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-surface-100 rounded-2xl h-48 flex items-center justify-center mb-6">
                <span className="text-surface-500 text-sm">Yerevan, Armenia</span>
              </div>
              <div>
                <p className="text-sm font-medium text-surface-700 mb-3">Follow us</p>
                <div className="flex gap-3">
                  {socials.map(({ icon: Icon, label, href }, i) => (
                    <a key={i} href={href} aria-label={label}
                      className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-brand-100 hover:text-brand-600 transition-colors text-surface-500">
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
