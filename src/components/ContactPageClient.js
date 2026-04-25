"use client";
import { useState } from "react";
import {
  Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube,
  Sparkles, Send, ArrowRight, CheckCircle2, Loader2,
} from "lucide-react";

const SOCIALS = [
  { Icon: Facebook,  label: "Facebook",  href: "https://www.facebook.com/salooote.am" },
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/salooote_co" },
  { Icon: Youtube,   label: "YouTube",   href: "https://www.youtube.com/@salooote1278" },
];

const PHONE_MAIN = "+374 60 72 77 17";
const PHONE_ALT  = "+374 33 72 77 10";
const EMAIL      = "hello@salooote.am";

function openAIChat() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("salooote:openChat"));
  }
}

export default function ContactPageClient({ lang = "en", dict = {} }) {
  const t = dict.contactPage || {};
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", consent: false });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function onSubmit(e) {
    e?.preventDefault?.();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-16 pb-10 md:pt-24 md:pb-14 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-rose-100 text-rose-600 rounded-full px-3 py-1 text-[11.5px] font-semibold mb-5">
            <Sparkles size={13} />
            {t.eyebrow || "We're here for you"}
          </div>
          <h1 className="font-display text-[34px] md:text-[52px] font-bold text-surface-900 leading-[1.05] tracking-tight max-w-[700px] mb-4">
            {t.title || "Talk to the Salooote team"}
          </h1>
          <p className="text-surface-500 text-[15.5px] md:text-[17px] leading-relaxed max-w-[640px]">
            {t.subtitle || "Got a question about a vendor, an order, or a partnership? We answer fast — usually within a few hours."}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-20 md:pb-28">
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12">
          {/* Form card */}
          <div className="bg-white border border-surface-100 rounded-3xl shadow-soft p-6 md:p-9">
            {sent ? (
              <SuccessCard t={t} reset={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "", consent: false }); }} />
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <h2 className="font-display text-[22px] md:text-[26px] font-bold text-surface-900 mb-1">
                    {t.formTitle || "Send us a message"}
                  </h2>
                  <p className="text-surface-500 text-[13.5px]">{t.formSubtitle || "We typically reply within 24 hours."}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t.name || "Your name"}>
                    <input
                      type="text" required value={form.name} onChange={update("name")}
                      placeholder={t.namePlaceholder || "How should we call you?"}
                      className="w-full border border-surface-200 rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition bg-white"
                    />
                  </Field>
                  <Field label={t.email || "Email"}>
                    <input
                      type="email" required value={form.email} onChange={update("email")}
                      placeholder={t.emailPlaceholder || "you@example.com"}
                      className="w-full border border-surface-200 rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition bg-white"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t.phone || "Phone (optional)"}>
                    <input
                      type="tel" value={form.phone} onChange={update("phone")}
                      placeholder={t.phonePlaceholder || "+374 …"}
                      className="w-full border border-surface-200 rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition bg-white"
                    />
                  </Field>
                  <Field label={t.subject || "What's it about?"}>
                    <select
                      value={form.subject} onChange={update("subject")} required
                      className="w-full border border-surface-200 rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition bg-white"
                    >
                      <option value="">{t.subjectPlaceholder || "Select a subject"}</option>
                      <option value="order">{t.subjectOrder || "Order issue"}</option>
                      <option value="vendor">{t.subjectVendor || "Vendor question"}</option>
                      <option value="partnership">{t.subjectPartnership || "Become a partner"}</option>
                      <option value="planning">{t.subjectPlanning || "Plan an event with you"}</option>
                      <option value="other">{t.subjectOther || "Something else"}</option>
                    </select>
                  </Field>
                </div>

                <Field label={t.message || "Your message"}>
                  <textarea
                    required rows={5} value={form.message} onChange={update("message")}
                    placeholder={t.messagePlaceholder || "Tell us a bit more so we can help quickly."}
                    className="w-full border border-surface-200 rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition bg-white resize-none"
                  />
                </Field>

                <label className="flex items-start gap-3 text-[12.5px] text-surface-600 cursor-pointer select-none">
                  <input type="checkbox" required checked={form.consent} onChange={update("consent")} className="mt-1 accent-brand-600 cursor-pointer" />
                  <span>{t.consent || "I agree to be contacted about my request."}</span>
                </label>

                <button
                  type="submit" disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-glow disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? (<><Loader2 size={16} className="animate-spin" /> {t.sending || "Sending…"}</>) : (<><Send size={16} /> {t.send || "Send message"}</>)}
                </button>
              </form>
            )}
          </div>

          {/* Info column */}
          <div className="space-y-5">
            {/* AI CTA */}
            <button
              onClick={openAIChat}
              className="group block w-full text-left rounded-3xl bg-gradient-to-br from-brand-600 via-rose-500 to-rose-400 p-6 md:p-7 text-white shadow-glow relative overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-2.5 py-1 text-[11px] font-semibold mb-3">
                <Sparkles size={12} /> AI
              </div>
              <p className="font-display text-[20px] font-bold mb-1.5 leading-tight">{t.aiCtaTitle || "Not sure what you need?"}</p>
              <p className="text-white/85 text-[13px] leading-relaxed mb-5">{t.aiCtaSubtitle || "Describe your event in your own words and our AI assistant will instantly suggest vendors, packages and ideas."}</p>
              <span className="inline-flex items-center gap-1.5 bg-white text-brand-700 rounded-full px-4 py-2 text-[12.5px] font-semibold group-hover:gap-2.5 transition-all">
                {t.aiCtaButton || "Try the AI planner"}
                <ArrowRight size={14} />
              </span>
            </button>

            <div className="bg-white border border-surface-100 rounded-3xl shadow-soft p-6 md:p-7">
              <h2 className="font-display text-[20px] font-bold text-surface-900 mb-5">{t.infoTitle || "Get in touch"}</h2>

              <div className="space-y-3.5">
                <ContactRow
                  icon={Phone}
                  label={t.callMain || "Main line"}
                  value={PHONE_MAIN}
                  href={`tel:${PHONE_MAIN.replace(/\s/g, "")}`}
                />
                <ContactRow
                  icon={Phone}
                  label={t.callSecondary || "Secondary line"}
                  value={PHONE_ALT}
                  href={`tel:${PHONE_ALT.replace(/\s/g, "")}`}
                />
                <ContactRow
                  icon={Mail}
                  label={t.emailLabel || "Email"}
                  value={EMAIL}
                  href={`mailto:${EMAIL}`}
                />
                <ContactRow
                  icon={MapPin}
                  label={t.addressLabel || "Address"}
                  value={t.address || "Yerevanyan 22, Yerevan, Armenia"}
                />
                <ContactRow
                  icon={Clock}
                  label={t.hoursLabel || "Working hours"}
                  value={t.hoursValue || "Mon–Sat · 09:00 – 20:00"}
                />
              </div>

              <hr className="my-6 border-surface-100" />

              <p className="text-[12.5px] font-semibold text-surface-700 mb-3">{t.followUs || "Follow Salooote"}</p>
              <div className="flex gap-2.5">
                {SOCIALS.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-2xl bg-surface-50 flex items-center justify-center text-surface-500 hover:bg-rose-50 hover:text-brand-600 transition-colors"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-3xl overflow-hidden border border-surface-100 shadow-soft">
              <iframe
                title="Salooote location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=44.498%2C40.180%2C44.520%2C40.196&amp;layer=mapnik"
                className="w-full h-56 md:h-64 block"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-surface-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const inner = (
    <>
      <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0">
        <Icon size={17} className="text-brand-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] uppercase tracking-wider text-surface-400 font-semibold">{label}</p>
        <p className="text-[14px] font-semibold text-surface-900 truncate">{value}</p>
      </div>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-3.5 rounded-2xl px-2 py-1.5 -mx-2 hover:bg-rose-50/50 transition-colors no-underline">
      {inner}
    </a>
  ) : (
    <div className="flex items-center gap-3.5 px-0 py-1.5">{inner}</div>
  );
}

function SuccessCard({ t, reset }) {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 mx-auto mb-5 flex items-center justify-center">
        <CheckCircle2 size={28} className="text-emerald-500" />
      </div>
      <p className="font-display text-[24px] font-bold text-surface-900 mb-2">{t.sentTitle || "Thank you — message received!"}</p>
      <p className="text-surface-500 text-[14px] mb-6">{t.sentBody || "We'll get back to you within 24 hours."}</p>
      <button
        type="button" onClick={reset}
        className="inline-flex items-center gap-1.5 text-brand-600 font-semibold text-[13.5px] hover:text-brand-700 cursor-pointer"
      >
        {t.sendAnother || "Send another message"} <ArrowRight size={14} />
      </button>
    </div>
  );
}
