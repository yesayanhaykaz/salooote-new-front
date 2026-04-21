"use client";
import { ScrollReveal } from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";

const stats = [
  { label: "Events", end: "15K+" },
  { label: "Vendors", end: "850+" },
  { label: "Cities", end: "50+" },
  { label: "Rating", end: "4.9" },
];

const timeline = [
  { year: "2022", title: "Founded", desc: "Salooote was born in Yerevan with a simple mission: make event planning accessible to everyone in Armenia." },
  { year: "2023", title: "First 1,000 Vendors", desc: "We hit a major milestone — 1,000 verified vendors on the platform, from bakers to photographers." },
  { year: "2024", title: "Launched AI Planner", desc: "Our AI-powered event planner helps customers discover and book vendors faster than ever." },
  { year: "2025", title: "Expanded Across Armenia", desc: "Salooote now serves 50+ cities, bringing world-class event services to every corner of Armenia." },
];

const team = [
  { name: "Ani Petrosyan", role: "Co-Founder & CEO" },
  { name: "Davit Harutyunyan", role: "Co-Founder & CTO" },
  { name: "Narine Hovhannisyan", role: "Head of Vendor Relations" },
  { name: "Gor Mkrtchyan", role: "Head of Product" },
];

const values = [
  { title: "Vendor-first", desc: "We grow when our vendors grow. Every feature is built with vendor success in mind." },
  { title: "Transparency", desc: "Clear pricing, honest reviews, and no hidden fees — always." },
  { title: "Joy", desc: "We believe celebrations should be stress-free. We handle the logistics so you can focus on the moments." },
];

export default function AboutPageClient() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-20 bg-brand-50">
        <div className="max-w-container mx-auto px-4 md:px-8 text-center">
          <ScrollReveal>
            <h1 className="text-5xl font-bold text-surface-900 mb-4 leading-tight">We make celebrations easy.</h1>
            <p className="text-surface-500 text-lg max-w-xl mx-auto">
              Salooote connects families and businesses across Armenia with the best event vendors — cakes, catering, flowers, music, and more.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-14 border-b border-surface-100">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="bg-surface-50 rounded-2xl py-6 px-4">
                  <p className="text-3xl font-bold text-brand-600 mb-1"><CountUp end={stat.end} /></p>
                  <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-surface-900 mb-4">Our Mission</h2>
                <p className="text-surface-600 leading-relaxed mb-4">
                  Every celebration — whether a birthday, wedding, corporate event, or simple family gathering — deserves to be memorable. Yet planning one is often overwhelming.
                </p>
                <p className="text-surface-600 leading-relaxed">
                  We built Salooote to change that. By bringing together Armenia's best vendors in one trusted marketplace, we make it effortless to plan, book, and enjoy any event.
                </p>
              </div>
              <div className="bg-surface-100 rounded-2xl h-64 flex items-center justify-center">
                <span className="text-surface-400 text-sm">Mission image placeholder</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-surface-50">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-surface-900 mb-10 text-center">Our Journey</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.year.slice(2)}
                    </div>
                    {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-brand-200 mt-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-xs text-brand-600 font-semibold mb-0.5">{item.year}</p>
                    <p className="font-bold text-surface-900 mb-1">{item.title}</p>
                    <p className="text-sm text-surface-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-surface-900 mb-8 text-center">Meet the Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: "linear-gradient(135deg, #e11d5c, #f43f7e)" }}>
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <p className="font-semibold text-surface-900 text-sm">{member.name}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-surface-50">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-surface-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((val, i) => (
                <div key={i} className="bg-white border border-surface-100 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 mb-4 flex items-center justify-center">
                    <span className="text-brand-600 font-bold text-lg">{i + 1}</span>
                  </div>
                  <p className="font-bold text-surface-900 mb-2">{val.title}</p>
                  <p className="text-sm text-surface-500 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
