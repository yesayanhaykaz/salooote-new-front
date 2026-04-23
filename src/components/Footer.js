"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Apple, ArrowRight } from "lucide-react";

// Payment brand SVG icons
function VisaIcon() {
  return (
    <svg width="46" height="28" viewBox="0 0 46 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="46" height="28" rx="4" fill="#1A1F71"/>
      <text x="23" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" fontStyle="italic" letterSpacing="-0.5">VISA</text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg width="46" height="28" viewBox="0 0 46 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="46" height="28" rx="4" fill="#fff" stroke="#e5e7eb"/>
      <circle cx="17" cy="14" r="8" fill="#EB001B"/>
      <circle cx="29" cy="14" r="8" fill="#F79E1B"/>
      <path d="M23 7.53a8 8 0 0 1 0 12.94A8 8 0 0 1 23 7.53z" fill="#FF5F00"/>
    </svg>
  );
}
function AmexIcon() {
  return (
    <svg width="46" height="28" viewBox="0 0 46 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="46" height="28" rx="4" fill="#007BC1"/>
      <text x="23" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#FFFFFF" letterSpacing="1.5">AMEX</text>
    </svg>
  );
}
function PayPalIcon() {
  return (
    <svg width="54" height="28" viewBox="0 0 54 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="54" height="28" rx="4" fill="#fff" stroke="#e5e7eb"/>
      <text x="8" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#003087">Pay</text>
      <text x="28" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#009cde">Pal</text>
    </svg>
  );
}
// Google Play icon
function GooglePlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  { label: "PayPal",     Icon: PayPalIcon },
];

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
            <a href="#"
               className="flex items-center gap-3 bg-black rounded-xl px-4 py-2.5 mb-3 hover:bg-gray-900 transition-colors no-underline">
              <Apple size={20} className="text-white flex-shrink-0" />
              <div>
                <div className="text-[9px] text-gray-400 leading-tight font-medium">Download on the</div>
                <div className="text-sm font-semibold text-white leading-tight">App Store</div>
              </div>
            </a>
            <a href="#"
               className="flex items-center gap-3 bg-black rounded-xl px-4 py-2.5 hover:bg-gray-900 transition-colors no-underline">
              <GooglePlayIcon />
              <div>
                <div className="text-[9px] text-gray-400 leading-tight font-medium">Get it on</div>
                <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
              </div>
            </a>
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
