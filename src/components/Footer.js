"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Apple, Play, ArrowRight, Shield } from "lucide-react";

function getColumns(lang) {
  return [
    { title: "Products", links: [
      { label: "Cakes", href: `/${lang}/category` },
      { label: "Catering", href: `/${lang}/category` },
      { label: "Balloons", href: `/${lang}/category` },
      { label: "Flowers", href: `/${lang}/category` },
      { label: "DJ & Music", href: `/${lang}/category` },
      { label: "Venues", href: `/${lang}/category` },
    ]},
    { title: "Support", links: [
      { label: "Track Order", href: `/${lang}/track-order` },
      { label: "Help Center", href: `/${lang}/help` },
      { label: "FAQs", href: `/${lang}/faq` },
      { label: "Return Policy", href: `/${lang}/returns` },
      { label: "Contact Us", href: `/${lang}/contact` },
    ]},
    { title: "Company", links: [
      { label: "Our Story", href: `/${lang}/about` },
      { label: "Reviews", href: `/${lang}/reviews` },
      { label: "Careers", href: `/${lang}/careers` },
      { label: "Press", href: `/${lang}/press` },
      { label: "Blog", href: `/${lang}/blog` },
    ]},
    { title: "Partners", links: [
      { label: "Partner Policy", href: `/${lang}/partner-policy` },
      { label: "Apply Now", href: `/${lang}/apply` },
      { label: "Vendor Resources", href: `/${lang}/vendor-resources` },
    ]},
  ];
}

const socials = [
  { icon: Facebook,  label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter,   label: "Twitter" },
  { icon: Youtube,   label: "YouTube" },
];

export default function Footer({ lang = "en" }) {
  const columns = getColumns(lang);

  return (
    <footer className="bg-white border-t border-surface-200">
      <div className="max-w-container mx-auto px-6 md:px-8 pt-16 pb-0">

        {/* Top row */}
        <div className="flex justify-between flex-wrap gap-12 pb-12 border-b border-surface-200">

          {/* Brand */}
          <div className="max-w-[240px]">
            <Link href={`/${lang}`} className="text-xl font-bold mb-4 block no-underline text-surface-900">Salooote</Link>
            <p className="text-surface-500 text-sm leading-relaxed mb-6">
              Your one-stop destination for seamless event planning — cakes, catering, flowers, and more.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label }, i) => (
                <a key={i} href="#" aria-label={label}
                   className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all group">
                  <Icon size={15} className="text-surface-500 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {columns.map((col, i) => (
            <div key={i}>
              <p className="font-semibold text-sm mb-4 text-surface-900">{col.title}</p>
              {col.links.map((link, j) => (
                <Link key={j} href={link.href}
                   className="block text-surface-500 no-underline text-sm leading-[2] hover:text-surface-900 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          {/* App */}
          <div>
            <p className="font-semibold text-sm mb-4 text-surface-900">Get the App</p>
            {[
              { icon: Apple, store: "App Store",   sub: "Download on the" },
              { icon: Play,  store: "Google Play",  sub: "Get it on" },
            ].map(({ icon: Icon, store, sub }, i) => (
              <a key={i} href="#"
                 className="flex items-center gap-3 bg-surface-100 rounded-xl px-4 py-3 mb-3 hover:bg-surface-200 transition-colors no-underline">
                <Icon size={18} className="text-surface-700" />
                <div>
                  <div className="text-[10px] text-surface-500 leading-tight">{sub}</div>
                  <div className="text-sm font-semibold text-surface-900 leading-tight">{store}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-b border-surface-200">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="font-semibold text-base mb-1 text-surface-900">Stay in the loop</p>
              <p className="text-surface-500 text-sm">Get products, deals, and event planning tips.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-[280px] flex items-center bg-white rounded-xl px-4 border border-surface-200 focus-within:border-brand-500 transition-colors">
                <input
                  type="email" placeholder="Enter your email"
                  className="flex-1 bg-transparent border-none outline-none text-sm text-surface-900 placeholder:text-surface-400 py-3"
                />
              </div>
              <button className="bg-brand-600 text-white border-none rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-brand-700 transition-colors flex-shrink-0">
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center py-5 flex-wrap gap-4">
          <p className="text-xs text-surface-400">&copy; {new Date().getFullYear()} Salooote, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-surface-400">
            <Link href={`/${lang}/privacy`} className="hover:text-surface-700 transition-colors no-underline text-surface-400">Privacy Policy</Link>
            <span className="text-surface-300">·</span>
            <Link href={`/${lang}/terms`} className="hover:text-surface-700 transition-colors no-underline text-surface-400">Terms of Service</Link>
          </div>
          <div className="flex gap-2 items-center">
            {["Visa", "Mastercard", "Amex", "PayPal"].map((card, i) => (
              <span key={i} className="bg-surface-100 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-surface-500 tracking-wider border border-surface-200">
                {card.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
