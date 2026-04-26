"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook, Instagram, Youtube, ArrowRight,
  Phone, Mail, MapPin, Apple,
} from "lucide-react";

// Real social URLs — update once accounts are confirmed
const SOCIALS = [
  { Icon: Facebook,  label: "Facebook",  href: "https://www.facebook.com/salooote.am" },
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/salooote_co" },
  { Icon: Youtube,   label: "YouTube",   href: "https://www.youtube.com/@salooote1278" },
];

// Payment brand SVG icons (kept inline for crispness, no external deps)
function VisaIcon() {
  return (
    <svg width="42" height="26" viewBox="0 0 46 28" xmlns="http://www.w3.org/2000/svg">
      <rect width="46" height="28" rx="4" fill="#1A1F71"/>
      <text x="23" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill="#FFF" fontStyle="italic" letterSpacing="-0.5">VISA</text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg width="42" height="26" viewBox="0 0 46 28" xmlns="http://www.w3.org/2000/svg">
      <rect width="46" height="28" rx="4" fill="#fff" stroke="#e5e7eb"/>
      <circle cx="17" cy="14" r="8" fill="#EB001B"/>
      <circle cx="29" cy="14" r="8" fill="#F79E1B"/>
      <path d="M23 7.53a8 8 0 0 1 0 12.94A8 8 0 0 1 23 7.53z" fill="#FF5F00"/>
    </svg>
  );
}
function AmexIcon() {
  return (
    <svg width="42" height="26" viewBox="0 0 46 28" xmlns="http://www.w3.org/2000/svg">
      <rect width="46" height="28" rx="4" fill="#007BC1"/>
      <text x="23" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#FFF" letterSpacing="1.5">AMEX</text>
    </svg>
  );
}
function GooglePlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 1.5L13.5 10L2.5 18.5V1.5Z" fill="url(#gp_grad1)"/>
      <path d="M2.5 1.5L10.5 9.5L13.5 6.5L4.5 1.5H2.5Z" fill="#00BCD4"/>
      <path d="M2.5 18.5L10.5 10.5L13.5 13.5L4.5 18.5H2.5Z" fill="#FF3D00"/>
      <path d="M13.5 6.5L17.5 10L13.5 13.5L10.5 10.5V9.5L13.5 6.5Z" fill="#FFD600"/>
      <defs>
        <linearGradient id="gp_grad1" x1="2.5" y1="1.5" x2="2.5" y2="18.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E676"/>
          <stop offset="1" stopColor="#00897B"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

const PAYMENT_ICONS = [
  { label: "Visa",       Icon: VisaIcon },
  { label: "Mastercard", Icon: MastercardIcon },
  { label: "Amex",       Icon: AmexIcon },
];

export default function Footer({ lang = "en", dict }) {
  const f = dict?.footer || {};
  const year = new Date().getFullYear();

  // Link group definitions — labels come from dict, hrefs are static
  const shopLinks = [
    { key: "cakes",    href: `/${lang}/category/cakes-desserts` },
    { key: "catering", href: `/${lang}/category/catering-food` },
    { key: "balloons", href: `/${lang}/category/flowers-decor` },
    { key: "flowers",  href: `/${lang}/category/flowers-decor` },
    { key: "djMusic",  href: `/${lang}/category/music-entertainment` },
    { key: "venues",   href: `/${lang}/category/venues-halls` },
  ];
  const supportLinks = [
    { key: "trackOrder", href: `/${lang}/track-order` },
    { key: "helpCenter", href: `/${lang}/help` },
    { key: "faqs",       href: `/${lang}/faq` },
    { key: "returns",    href: `/${lang}/returns` },
    { key: "contact",    href: `/${lang}/contact` },
  ];
  const companyLinks = [
    { key: "story",   href: `/${lang}/about` },
    { key: "reviews", href: `/${lang}/reviews` },
    { key: "careers", href: `/${lang}/careers` },
    { key: "press",   href: `/${lang}/press` },
    { key: "blog",    href: `/${lang}/blog` },
  ];
  const partnerLinks = [
    { key: "policy",    href: `/${lang}/partner-policy` },
    { key: "apply",     href: `/${lang}/apply` },
    { key: "resources", href: `/${lang}/vendor-resources` },
  ];

  return (
    <footer className="bg-white border-t border-surface-200">

      <div className="max-w-container mx-auto px-6 md:px-8 pt-12 pb-0">

        {/* ── Top: brand + 4 link columns + app ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10 pb-12 border-b border-surface-200">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 max-w-[300px]">
            <Link href={`/${lang}`} className="inline-flex items-center mb-5 no-underline">
              <Image
                src="/images/logo.png"
                alt="Salooote"
                width={140}
                height={40}
                className="h-10 w-auto"
                priority={false}
              />
            </Link>
            <p className="text-surface-500 text-sm leading-relaxed mb-6">
              {f.brandTagline || "Armenia's premier event planning marketplace — cakes, flowers, venues, photography, and more, all in one place."}
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              <a href={`tel:${(f.contact?.phone || "+374 60 72 77 17").replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm text-surface-600 hover:text-brand-600 transition-colors no-underline">
                <Phone size={14} className="text-brand-500 flex-shrink-0" />
                <span>{f.contact?.phone || "+374 60 72 77 17"}</span>
              </a>
              {f.contact?.phone2 && (
                <a href={`tel:${f.contact.phone2.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm text-surface-600 hover:text-brand-600 transition-colors no-underline">
                  <Phone size={14} className="text-brand-500 flex-shrink-0" />
                  <span>{f.contact.phone2}</span>
                </a>
              )}
              <a href={`mailto:${f.contact?.email || "hello@salooote.am"}`} className="flex items-center gap-2.5 text-sm text-surface-600 hover:text-brand-600 transition-colors no-underline">
                <Mail size={14} className="text-brand-500 flex-shrink-0" />
                <span>{f.contact?.email || "hello@salooote.am"}</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-surface-600">
                <MapPin size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
                <span>{f.contact?.address || "Yerevanyan 22, Yerevan, Armenia"}</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all group">
                  <Icon size={15} className="text-surface-500 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-semibold text-sm mb-4 text-surface-900">{f.sections?.products || "Shop"}</p>
            <ul className="space-y-2.5">
              {shopLinks.map(l => (
                <li key={l.key}>
                  <Link href={l.href} className="text-surface-500 no-underline text-sm hover:text-brand-600 transition-colors">
                    {f.products?.[l.key] || l.key}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="font-semibold text-sm mb-4 text-surface-900">{f.sections?.support || "Support"}</p>
            <ul className="space-y-2.5">
              {supportLinks.map(l => (
                <li key={l.key}>
                  <Link href={l.href} className="text-surface-500 no-underline text-sm hover:text-brand-600 transition-colors">
                    {f.support?.[l.key] || l.key}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-semibold text-sm mb-4 text-surface-900">{f.sections?.company || "Company"}</p>
            <ul className="space-y-2.5">
              {companyLinks.map(l => (
                <li key={l.key}>
                  <Link href={l.href} className="text-surface-500 no-underline text-sm hover:text-brand-600 transition-colors">
                    {f.company?.[l.key] || l.key}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners + App */}
          <div>
            <p className="font-semibold text-sm mb-4 text-surface-900">{f.sections?.partners || "Partners"}</p>
            <ul className="space-y-2.5 mb-6">
              {partnerLinks.map(l => (
                <li key={l.key}>
                  <Link href={l.href} className="text-surface-500 no-underline text-sm hover:text-brand-600 transition-colors">
                    {f.partners?.[l.key] || l.key}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="font-semibold text-sm mb-3 text-surface-900">{f.sections?.app || "Get the app"}</p>
            <div className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-2.5 bg-surface-900 hover:bg-black rounded-xl px-3 py-2 transition-colors no-underline">
                <Apple size={18} className="text-white flex-shrink-0" />
                <div>
                  <div className="text-[8px] text-white/60 leading-tight font-medium uppercase tracking-wider">{f.appStore || "Download on the"}</div>
                  <div className="text-xs font-semibold text-white leading-tight">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2.5 bg-surface-900 hover:bg-black rounded-xl px-3 py-2 transition-colors no-underline">
                <GooglePlayIcon />
                <div>
                  <div className="text-[8px] text-white/60 leading-tight font-medium uppercase tracking-wider">{f.playStore || "Get it on"}</div>
                  <div className="text-xs font-semibold text-white leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ── Newsletter ── */}
        <div className="py-8 border-b border-surface-200">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="max-w-[400px]">
              <p className="font-semibold text-base mb-1 text-surface-900">{f.newsletter?.title || "Stay in the loop"}</p>
              <p className="text-surface-500 text-sm leading-relaxed">{f.newsletter?.subtitle || "New vendors, seasonal deals, and event-planning tips — straight to your inbox."}</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-[300px] flex items-center bg-white rounded-2xl px-4 border border-surface-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <Mail size={15} className="text-surface-400 mr-2" />
                <input
                  type="email"
                  required
                  placeholder={f.newsletter?.placeholder || "Enter your email"}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-surface-900 placeholder:text-surface-400 py-3"
                />
              </div>
              <button type="submit" className="bg-brand-600 text-white border-none rounded-2xl px-5 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-brand-700 hover:-translate-y-0.5 transition-all flex-shrink-0 shadow-md shadow-brand-500/20">
                {f.newsletter?.submit || "Subscribe"} <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom ── */}
        <div className="flex justify-between items-center py-6 flex-wrap gap-4">
          <p className="text-xs text-surface-400">
            {(f.copyright || "© {year} Salooote, Inc. All rights reserved.").replace("{year}", year)}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href={`/${lang}/privacy`} className="text-surface-400 hover:text-surface-700 transition-colors no-underline">{f.legal?.privacy || "Privacy Policy"}</Link>
            <span className="text-surface-300">·</span>
            <Link href={`/${lang}/terms`} className="text-surface-400 hover:text-surface-700 transition-colors no-underline">{f.legal?.terms || "Terms of Service"}</Link>
          </div>
          <div className="flex gap-2 items-center">
            {PAYMENT_ICONS.map(({ label, Icon }) => (
              <div key={label} title={label} className="flex-shrink-0">
                <Icon />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
