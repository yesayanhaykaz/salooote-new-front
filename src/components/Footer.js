"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook, Instagram, Youtube, ArrowRight, ChevronDown,
  Phone, Mail, MapPin, Apple, Sparkles,
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

/* Mobile accordion section — collapses on small screens, always-open on md+ */
function FooterSection({ title, links, dictGroup, defaultLinkLabels = {} }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-surface-200 md:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="md:hidden w-full flex items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm text-surface-900">{title}</span>
        <ChevronDown
          size={18}
          className={`text-surface-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <p className="hidden md:block font-semibold text-sm mb-4 text-surface-900">{title}</p>
      <ul
        className={`md:!max-h-none md:!opacity-100 md:!pb-0 overflow-hidden transition-all duration-300 ease-out
          ${open ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"}
          space-y-3 md:space-y-2.5`}
      >
        {links.map((l) => (
          <li key={l.key}>
            <Link
              href={l.href}
              className="text-surface-500 no-underline text-sm hover:text-brand-600 transition-colors active:text-brand-700 inline-block py-0.5"
            >
              {dictGroup?.[l.key] || defaultLinkLabels[l.key] || l.key}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

  const phone1 = f.contact?.phone || "+374 60 72 77 17";
  const email = f.contact?.email || "hello@salooote.am";
  const address = f.contact?.address || "Yerevanyan 22, Yerevan, Armenia";

  return (
    <footer className="bg-white border-t border-surface-200">
      <div className="max-w-container mx-auto px-5 sm:px-6 md:px-8 pt-10 sm:pt-12 pb-0">

        {/* ── Brand block (always visible on top) ── */}
        <div className="md:hidden pb-8 border-b border-surface-200">
          <Link href={`/${lang}`} className="inline-flex items-center mb-4 no-underline">
            <Image
              src="/images/logo.png"
              alt="Salooote"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority={false}
            />
          </Link>
          <p className="text-surface-500 text-sm leading-relaxed mb-5">
            {f.brandTagline || "Armenia's premier event planning marketplace — cakes, flowers, venues, photography, and more, all in one place."}
          </p>

          {/* Mobile contact tiles */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <a
              href={`tel:${phone1.replace(/\s/g, "")}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-surface-50 border border-surface-100 hover:border-brand-200 hover:bg-brand-50/50 transition-colors no-underline"
            >
              <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Phone size={14} />
              </span>
              <span className="text-xs font-semibold text-surface-900 truncate">{f.callUs || "Call us"}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-surface-50 border border-surface-100 hover:border-brand-200 hover:bg-brand-50/50 transition-colors no-underline"
            >
              <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Mail size={14} />
              </span>
              <span className="text-xs font-semibold text-surface-900 truncate">{f.emailUs || "Email"}</span>
            </a>
          </div>

          <div className="flex items-start gap-2 text-xs text-surface-500 mb-5">
            <MapPin size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{address}</span>
          </div>

          {/* Socials */}
          <div className="flex gap-2">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-2xl bg-surface-50 border border-surface-100 flex items-center justify-center hover:bg-brand-600 hover:border-brand-600 hover:text-white transition-all group"
              >
                <Icon size={17} className="text-surface-600 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Top: brand + 4 link columns + app (desktop) ── */}
        <div className="md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-8 lg:gap-10 md:pb-12 md:border-b md:border-surface-200">

          {/* Brand (desktop only — mobile shows the version above) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-2 max-w-[300px]">
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

            <div className="space-y-2.5 mb-6">
              <a href={`tel:${phone1.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm text-surface-600 hover:text-brand-600 transition-colors no-underline">
                <Phone size={14} className="text-brand-500 flex-shrink-0" />
                <span>{phone1}</span>
              </a>
              {f.contact?.phone2 && (
                <a href={`tel:${f.contact.phone2.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm text-surface-600 hover:text-brand-600 transition-colors no-underline">
                  <Phone size={14} className="text-brand-500 flex-shrink-0" />
                  <span>{f.contact.phone2}</span>
                </a>
              )}
              <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-sm text-surface-600 hover:text-brand-600 transition-colors no-underline">
                <Mail size={14} className="text-brand-500 flex-shrink-0" />
                <span>{email}</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-surface-600">
                <MapPin size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all group">
                  <Icon size={15} className="text-surface-500 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — accordion on mobile, plain list on md+ */}
          <FooterSection
            title={f.sections?.products || "Shop"}
            links={shopLinks}
            dictGroup={f.products}
          />
          <FooterSection
            title={f.sections?.support || "Support"}
            links={supportLinks}
            dictGroup={f.support}
          />
          <FooterSection
            title={f.sections?.company || "Company"}
            links={companyLinks}
            dictGroup={f.company}
          />

          {/* Partners + App */}
          <div className="md:block">
            <FooterSection
              title={f.sections?.partners || "Partners"}
              links={partnerLinks}
              dictGroup={f.partners}
            />

            <div className="hidden md:block mt-6">
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
        </div>

        {/* ── Mobile-only: app downloads side-by-side ── */}
        <div className="md:hidden py-6 border-b border-surface-200">
          <p className="font-semibold text-sm mb-3 text-surface-900">{f.sections?.app || "Get the app"}</p>
          <div className="grid grid-cols-2 gap-2.5">
            <a href="#" className="flex items-center gap-2 bg-surface-900 hover:bg-black active:scale-[0.98] rounded-2xl px-3 py-3 transition-all no-underline">
              <Apple size={20} className="text-white flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[8px] text-white/60 leading-tight font-medium uppercase tracking-wider">{f.appStore || "Download on the"}</div>
                <div className="text-xs font-semibold text-white leading-tight truncate">App Store</div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-2 bg-surface-900 hover:bg-black active:scale-[0.98] rounded-2xl px-3 py-3 transition-all no-underline">
              <GooglePlayIcon />
              <div className="min-w-0">
                <div className="text-[8px] text-white/60 leading-tight font-medium uppercase tracking-wider">{f.playStore || "Get it on"}</div>
                <div className="text-xs font-semibold text-white leading-tight truncate">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* ── Newsletter ── */}
        <div className="py-7 sm:py-8 border-b border-surface-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6">
            <div className="md:max-w-[400px]">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-600 mb-1.5">
                <Sparkles size={12} /> {f.newsletter?.eyebrow || "Newsletter"}
              </div>
              <p className="font-display font-semibold text-lg sm:text-xl mb-1.5 text-surface-900 tracking-tight">
                {f.newsletter?.title || "Stay in the loop"}
              </p>
              <p className="text-surface-500 text-sm leading-relaxed">
                {f.newsletter?.subtitle || "New vendors, seasonal deals, and event-planning tips — straight to your inbox."}
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
              <div className="flex-1 md:w-[300px] flex items-center bg-white rounded-2xl px-4 border border-surface-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <Mail size={15} className="text-surface-400 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder={f.newsletter?.placeholder || "Enter your email"}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-surface-900 placeholder:text-surface-400 py-3"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-600 text-white border-none rounded-2xl px-5 py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex-shrink-0 shadow-md shadow-brand-500/20"
              >
                {f.newsletter?.submit || "Subscribe"} <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom ── */}
        <div className="py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-6">
          {/* Payment + Legal — stacked on mobile */}
          <div className="flex items-center gap-2 order-1 md:order-3 md:ml-auto">
            {PAYMENT_ICONS.map(({ label, Icon }) => (
              <div key={label} title={label} className="flex-shrink-0">
                <Icon />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs order-2 md:order-2">
            <Link href={`/${lang}/privacy`} className="text-surface-500 hover:text-surface-800 transition-colors no-underline">{f.legal?.privacy || "Privacy Policy"}</Link>
            <span className="text-surface-300">·</span>
            <Link href={`/${lang}/terms`} className="text-surface-500 hover:text-surface-800 transition-colors no-underline">{f.legal?.terms || "Terms of Service"}</Link>
          </div>

          <p className="text-xs text-surface-400 order-3 md:order-1">
            {(f.copyright || "© {year} Salooote, Inc. All rights reserved.").replace("{year}", year)}
          </p>
        </div>
      </div>
    </footer>
  );
}
