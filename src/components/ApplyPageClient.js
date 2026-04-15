"use client";
import { useState } from "react";
import { CheckCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

const categories = ["Cakes & Bakery", "Catering", "Flowers", "Balloons & Decorations", "DJ & Music", "Venue", "Photography", "Other"];
const priceRanges = ["AMD 5,000–20,000", "AMD 20,000–50,000", "AMD 50,000–150,000", "AMD 150,000+"];
const experienceOptions = ["Less than 1 year", "1–3 years", "3–5 years", "5+ years"];

export default function ApplyPageClient() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "", category: "", phone: "", city: "",
    services: "", priceRange: "", experience: "", agreeTerms: false,
  });

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.type === "checkbox" ? e.target.checked : e.target.value });

  const steps = ["Business Info", "Services", "Review & Submit"];

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-surface-900 mb-2">Apply to Become a Vendor</h1>
            <p className="text-surface-400 mb-8 text-sm">Join 850+ vendors on Armenia's top event marketplace.</p>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-brand-50 rounded-2xl border border-brand-100">
                <CheckCircle size={48} className="text-brand-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-surface-900 mb-2">Application Submitted!</h2>
                <p className="text-surface-500 text-sm">We'll review your application and get back to you within 3–5 business days.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-8">
                  {steps.map((label, i) => {
                    const num = i + 1;
                    const isComplete = step > num;
                    const isActive = step === num;
                    return (
                      <div key={i} className="flex items-center gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                          isComplete || isActive ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-400"
                        }`}>
                          {isComplete ? <CheckCircle size={14} /> : num}
                        </div>
                        <span className={`text-xs hidden md:block ${isActive ? "text-brand-600 font-semibold" : "text-surface-400"}`}>{label}</span>
                        {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step > num ? "bg-brand-400" : "bg-surface-100"}`} />}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-surface-50 border border-surface-100 rounded-2xl p-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="font-bold text-surface-900 mb-5">Step 1: Business Info</h2>
                        <div className="space-y-4">
                          {[
                            { label: "Business Name", field: "businessName", type: "text", placeholder: "e.g. Sweet Dreams Bakery" },
                            { label: "Phone", field: "phone", type: "tel", placeholder: "+374 XX XXX XXX" },
                            { label: "City", field: "city", type: "text", placeholder: "e.g. Yerevan" },
                          ].map(({ label, field, type, placeholder }) => (
                            <div key={field}>
                              <label className="block text-sm font-medium text-surface-700 mb-1">{label}</label>
                              <input type={type} value={form[field]} onChange={update(field)} placeholder={placeholder}
                                className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
                            </div>
                          ))}
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                            <select value={form.category} onChange={update("category")}
                              className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition bg-white">
                              <option value="">Select a category</option>
                              {categories.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="font-bold text-surface-900 mb-5">Step 2: Services</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">What do you offer?</label>
                            <textarea value={form.services} onChange={update("services")} rows={4} placeholder="Describe your products or services..."
                              className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition resize-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Average Price Range</label>
                            <select value={form.priceRange} onChange={update("priceRange")}
                              className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition bg-white">
                              <option value="">Select a price range</option>
                              {priceRanges.map((p) => <option key={p}>{p}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Years in Business</label>
                            <select value={form.experience} onChange={update("experience")}
                              className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition bg-white">
                              <option value="">Select experience</option>
                              {experienceOptions.map((e) => <option key={e}>{e}</option>)}
                            </select>
                          </div>
                          <div className="border-2 border-dashed border-surface-200 rounded-xl p-5 text-center cursor-pointer hover:border-brand-400 transition-colors">
                            <p className="text-sm text-surface-400">Click to upload your logo</p>
                            <p className="text-xs text-surface-300 mt-1">PNG, JPG, SVG — max 5MB</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="font-bold text-surface-900 mb-5">Step 3: Review & Submit</h2>
                        <div className="space-y-3 mb-5">
                          {[
                            { label: "Business Name", value: form.businessName || "—" },
                            { label: "Category", value: form.category || "—" },
                            { label: "Phone", value: form.phone || "—" },
                            { label: "City", value: form.city || "—" },
                            { label: "Services", value: form.services || "—" },
                            { label: "Price Range", value: form.priceRange || "—" },
                            { label: "Experience", value: form.experience || "—" },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between text-sm border-b border-surface-100 pb-2">
                              <span className="text-surface-500">{label}</span>
                              <span className="text-surface-900 font-medium text-right max-w-[60%] truncate">{value}</span>
                            </div>
                          ))}
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer mb-5">
                          <input type="checkbox" checked={form.agreeTerms} onChange={update("agreeTerms")} className="mt-0.5 accent-brand-600" />
                          <span className="text-sm text-surface-600">
                            I agree to Salooote's <a href="#" className="text-brand-600 hover:underline">Partner Policy</a> and <a href="#" className="text-brand-600 hover:underline">Terms of Service</a>.
                          </span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 mt-6">
                    {step > 1 && (
                      <button onClick={() => setStep(step - 1)}
                        className="flex-1 border-2 border-surface-200 text-surface-700 font-semibold py-3 rounded-xl text-sm hover:border-surface-300 transition-colors">
                        Back
                      </button>
                    )}
                    {step < 3 ? (
                      <button onClick={() => setStep(step + 1)}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button onClick={() => form.agreeTerms && setSubmitted(true)} disabled={!form.agreeTerms}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                        Submit Application
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
