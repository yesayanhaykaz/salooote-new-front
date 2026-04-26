"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowUpRight, Star, MapPin, ShieldCheck, Truck, Clock,
  Heart, Cake, Flower2, PartyPopper, Camera, Music, UtensilsCrossed,
  Search, CheckCircle2, Quote, Users, Calendar, Zap, BadgeCheck,
} from "lucide-react";

/* ──────────────────────────────────────────────────
   Trilingual UI strings
   ────────────────────────────────────────────────── */
const T = {
  en: {
    heroBadge: "Plan. Book. Celebrate.",
    heroLine1: "Plan your dream",
    heroAccent: "events",
    heroLine2: "all in one place.",
    heroSub: "Discover Armenia's most loved vendors, curated by our team — from cakes and flowers to venues, photographers and entertainers.",
    searchPlaceholder: "Try birthday cake, wedding photographer…",
    searchCta: "Search",
    chips: ["Cakes", "Flowers", "Photographers", "Venues", "Music"],
    ctaPrimary: "Plan with Sali AI",
    ctaSecondary: "Browse vendors",
    trustVerified: "Verified vendors",
    trustVerifiedSub: "Hand-picked by our team",
    trustDelivery: "Same-day delivery",
    trustDeliverySub: "Across Yerevan",
    trustRating: "4.9 average rating",
    trustRatingSub: "From 6,400+ reviews",
    trustEvents: "15,000+ events",
    trustEventsSub: "Planned with Salooote",
    catEyebrow: "Browse by category",
    catTitle: "Everything for the perfect day.",
    catSub: "From the smallest detail to the biggest moment — every category, every vendor, in one place.",
    catViewAll: "All categories",
    catVendors: "vendors",
    vendorEyebrow: "Editor's picks",
    vendorTitle: "Vendors our team loves",
    vendorSub: "Hand-picked businesses with glowing reviews and reliable delivery — every single one is verified.",
    vendorViewAll: "View all vendors",
    vendorView: "View profile",
    vendorReviews: "reviews",
    aiBadge: "Meet Sali",
    aiTitle: "Take the guesswork out of",
    aiAccent: "event planning.",
    aiSub: "Tell Sali what you're imagining. She suggests vendors, builds your timeline, and keeps you on budget — in Armenian, English or Russian.",
    aiFeatures: ["Personalized vendor matches", "Auto-generated checklists", "Real-time budget tracking", "Booking & reminders in chat"],
    aiPrimary: "Try Sali for free",
    aiSecondary: "How it works",
    howEyebrow: "How it works",
    howTitle: "Plan in three simple steps.",
    howSub: "From idea to celebration, Salooote makes the whole journey effortless.",
    howSteps: [
      { t: "Tell us what you need", s: "Pick an event type, set a budget, or just chat with Sali — our AI planner." },
      { t: "Browse curated vendors", s: "We surface the best matches based on your style, guest count and budget." },
      { t: "Book in one place", s: "Confirm details, pay securely in chat, and we'll handle reminders for you." },
    ],
    testEyebrow: "Real celebrations",
    testTitle: "Loved by thousands of Armenian families.",
    finalEyebrow: "Made in Armenia, with love",
    finalTitle: "Ready to plan something unforgettable?",
    finalSub: "Join 15,000+ celebrations powered by verified vendors and a planner that actually gets it.",
    finalPrimary: "Start planning",
    finalSecondary: "Become a vendor",
  },
  hy: {
    heroBadge: "Պլանավորիր. Ամրագրիր. Տոնիր.",
    heroLine1: "Պլանավորիր երազանքիդ",
    heroAccent: "միջոցառումները",
    heroLine2: "մեկ տեղում.",
    heroSub: "Բացահայտիր Հայաստանի լավագույն մատակարարներին՝ տորթից ու ծաղիկներից մինչև սրահներ, լուսանկարիչներ և կատարողներ։",
    searchPlaceholder: "Փորձիր՝ ծննդյան տորթ, հարսանյաց լուսանկարիչ…",
    searchCta: "Որոնել",
    chips: ["Տորթեր", "Ծաղիկներ", "Լուսանկարիչներ", "Սրահներ", "Երաժշտություն"],
    ctaPrimary: "Պլանավորել Sali-ի հետ",
    ctaSecondary: "Մատակարարներ",
    trustVerified: "Ստուգված մատակարարներ",
    trustVerifiedSub: "Ընտրված մեր թիմի կողմից",
    trustDelivery: "Նույն օրվա առաքում",
    trustDeliverySub: "Երևան քաղաքով",
    trustRating: "4.9 միջին գնահատական",
    trustRatingSub: "6 400+ կարծիք",
    trustEvents: "15 000+ միջոցառում",
    trustEventsSub: "Կազմակերպված Salooote-ի հետ",
    catEyebrow: "Կատեգորիաներ",
    catTitle: "Ամեն ինչ կատարյալ օրվա համար։",
    catSub: "Ամենափոքր մանրուքից մինչև ամենամեծ պահը — բոլոր կատեգորիաները մեկ տեղում։",
    catViewAll: "Բոլորը",
    catVendors: "մատակարար",
    vendorEyebrow: "Խմբագրի ընտրություն",
    vendorTitle: "Մեր սիրած մատակարարները",
    vendorSub: "Ձեռքով ընտրված բիզնեսներ՝ հիանալի կարծիքներով և հուսալի առաքմամբ։",
    vendorViewAll: "Բոլոր մատակարարները",
    vendorView: "Նայել պրոֆիլը",
    vendorReviews: "կարծիք",
    aiBadge: "Ծանոթացիր Sali-ի հետ",
    aiTitle: "Հանիր կասկածները",
    aiAccent: "պլանավորումից։",
    aiSub: "Պատմիր Sali-ին քո պատկերացումը. նա կառաջարկի մատակարարներ, կկառուցի ժամանակացույց և կպահի բյուջեն։",
    aiFeatures: ["Անհատական մատակարարներ", "Ավտոմատ ստուգաթերթեր", "Բյուջեի վերահսկում", "Ամրագրում զրույցում"],
    aiPrimary: "Փորձիր անվճար",
    aiSecondary: "Ինչպես է աշխատում",
    howEyebrow: "Ինչպես է աշխատում",
    howTitle: "Պլանավորիր երեք հեշտ քայլով։",
    howSub: "Գաղափարից մինչև տոնակատարություն — Salooote-ը կդարձնի ճանապարհը հեշտ։",
    howSteps: [
      { t: "Պատմիր՝ ինչ ես ուզում", s: "Ընտրիր միջոցառման տեսակը, սահմանիր բյուջե կամ զրուցիր Sali-ի հետ։" },
      { t: "Թերթիր մատակարարները", s: "Մենք կցուցադրենք քո ոճին, հյուրերի քանակին ու բյուջեին համապատասխան լավագույնները։" },
      { t: "Ամրագրիր մեկ տեղում", s: "Հաստատիր մանրամասները, վճարիր անվտանգ — մնացածը մենք կանենք։" },
    ],
    testEyebrow: "Իրական տոներ",
    testTitle: "Սիրված հազարավոր ընտանիքների կողմից։",
    finalEyebrow: "Ստեղծված է Հայաստանում սիրով",
    finalTitle: "Պատրա՞ստ ես պլանավորել անմոռանալին։",
    finalSub: "Միացիր 15 000+ տոնակատարությունների, որոնք իրականացվել են ստուգված մատակարարների հետ։",
    finalPrimary: "Սկսել պլանավորումը",
    finalSecondary: "Դարձիր մատակարար",
  },
  ru: {
    heroBadge: "Планируйте. Бронируйте. Празднуйте.",
    heroLine1: "Планируйте идеальные",
    heroAccent: "события",
    heroLine2: "в одном месте.",
    heroSub: "Откройте лучших поставщиков Армении — от тортов и цветов до залов, фотографов и артистов.",
    searchPlaceholder: "Попробуйте: торт на день рождения, свадебный фотограф…",
    searchCta: "Найти",
    chips: ["Торты", "Цветы", "Фотографы", "Залы", "Музыка"],
    ctaPrimary: "Планировать с Sali",
    ctaSecondary: "Поставщики",
    trustVerified: "Проверенные поставщики",
    trustVerifiedSub: "Отобраны нашей командой",
    trustDelivery: "Доставка в день заказа",
    trustDeliverySub: "По всему Еревану",
    trustRating: "4.9 средний рейтинг",
    trustRatingSub: "Более 6 400 отзывов",
    trustEvents: "15 000+ событий",
    trustEventsSub: "Спланированы с Salooote",
    catEyebrow: "По категориям",
    catTitle: "Всё для идеального дня.",
    catSub: "От мельчайшей детали до главного момента — все категории и поставщики в одном месте.",
    catViewAll: "Все категории",
    catVendors: "поставщиков",
    vendorEyebrow: "Выбор редакции",
    vendorTitle: "Поставщики, которых мы любим",
    vendorSub: "Отобранные вручную бизнесы с отличными отзывами и надёжной доставкой.",
    vendorViewAll: "Все поставщики",
    vendorView: "Посмотреть профиль",
    vendorReviews: "отзывов",
    aiBadge: "Знакомьтесь, Sali",
    aiTitle: "Уберите догадки из",
    aiAccent: "планирования событий.",
    aiSub: "Расскажите Sali, что вы представляете. Она подберёт поставщиков, составит план и удержит бюджет — на армянском, английском или русском.",
    aiFeatures: ["Подбор поставщиков под вас", "Автоматический чек-лист", "Контроль бюджета в реальном времени", "Бронирование и напоминания в чате"],
    aiPrimary: "Попробовать бесплатно",
    aiSecondary: "Как это работает",
    howEyebrow: "Как это работает",
    howTitle: "Планируйте в три простых шага.",
    howSub: "От идеи до праздника — Salooote делает путь лёгким.",
    howSteps: [
      { t: "Расскажите, что нужно", s: "Выберите тип события, задайте бюджет или просто поговорите с Sali." },
      { t: "Просмотрите поставщиков", s: "Мы покажем лучшие варианты под ваш стиль, гостей и бюджет." },
      { t: "Забронируйте в одном месте", s: "Подтвердите детали, оплатите безопасно — остальное за нами." },
    ],
    testEyebrow: "Настоящие праздники",
    testTitle: "Любимы тысячами армянских семей.",
    finalEyebrow: "Сделано в Армении с любовью",
    finalTitle: "Готовы спланировать что-то незабываемое?",
    finalSub: "Присоединяйтесь к 15 000+ праздникам с проверенными поставщиками и планировщиком, который понимает.",
    finalPrimary: "Начать планировать",
    finalSecondary: "Стать поставщиком",
  },
};

/* ──────────────────────────────────────────────────
   Demo data
   ────────────────────────────────────────────────── */
const CATEGORIES = [
  { slug: "cakes",       name: { en: "Cakes & Desserts", hy: "Տորթեր ու անուշեղեն", ru: "Торты и десерты" },   img: "/images/wedding-cake.jpg",      icon: Cake,             count: 142, accent: "from-rose-500/0 to-rose-600/80" },
  { slug: "flowers",     name: { en: "Flowers & Decor",  hy: "Ծաղիկներ ու դեկոր",   ru: "Цветы и декор" },     img: "/images/flowers-roses.jpg",     icon: Flower2,          count: 96,  accent: "from-fuchsia-500/0 to-fuchsia-600/80" },
  { slug: "balloons",    name: { en: "Balloons & Party", hy: "Փուչիկներ ու դեկոր",  ru: "Шары и декор" },      img: "/images/balloons-blue.jpg",     icon: PartyPopper,      count: 64,  accent: "from-sky-500/0 to-sky-600/80" },
  { slug: "photography", name: { en: "Photography",      hy: "Լուսանկարչություն",    ru: "Фотография" },        img: "/images/wedding-ceremony.jpg",  icon: Camera,           count: 88,  accent: "from-amber-500/0 to-amber-600/80" },
  { slug: "music",       name: { en: "DJ & Music",       hy: "DJ ու երաժշտություն", ru: "DJ и музыка" },       img: "/images/hero-dj.jpg",           icon: Music,            count: 41,  accent: "from-violet-500/0 to-violet-600/80" },
  { slug: "catering",    name: { en: "Catering",         hy: "Քեյթերինգ",            ru: "Кейтеринг" },         img: "/images/catering-buffet.jpg",   icon: UtensilsCrossed,  count: 53,  accent: "from-emerald-500/0 to-emerald-600/80" },
];

const FEATURED_VENDORS = [
  { slug: "salooote",        name: "Royal Bakes",     cat: { en: "Cakes & Desserts", hy: "Տորթեր ու անուշեղեն", ru: "Торты и десерты" }, rating: 4.9, reviews: 312, city: "Yerevan", img: "/images/wedding-cake2.jpg",    tag: { en: "Top Pick", hy: "Թոփ", ru: "Лидер" } },
  { slug: "yerevan-flowers", name: "Yerevan Flowers", cat: { en: "Flowers & Decor",  hy: "Ծաղիկներ ու դեկոր",   ru: "Цветы и декор" },   rating: 4.8, reviews: 198, city: "Yerevan", img: "/images/flowers-roses.jpg",    tag: { en: "New", hy: "Նոր", ru: "Новый" } },
  { slug: "royal-bakes",     name: "Sunset Studio",   cat: { en: "Photography",      hy: "Լուսանկարչություն",    ru: "Фотография" },       rating: 5.0, reviews: 124, city: "Gyumri",  img: "/images/wedding-arch-beach.jpg", tag: { en: "Pro", hy: "Փրո", ru: "Про" } },
];

const TESTIMONIALS = {
  en: [
    { quote: "Salooote took the chaos out of our wedding. Every vendor delivered exactly what they promised.", name: "Anush & Davit", role: "Wedding · Yerevan, 2025", img: "/images/wedding-arch-beach.jpg" },
    { quote: "Booked everything for my daughter's birthday in one evening. The photos were absolutely stunning.", name: "Mariam K.", role: "Birthday · Yerevan", img: "/images/cupcakes.jpg" },
  ],
  hy: [
    { quote: "Salooote-ը մեր հարսանիքից հանեց ամեն խառնաշփոթը։ Բոլոր մատակարարները հանձնեցին հենց այն, ինչ խոստացել էին։", name: "Անուշ ու Դավիթ", role: "Հարսանիք · Երևան, 2025", img: "/images/wedding-arch-beach.jpg" },
    { quote: "Մի երեկոյում ամրագրեցի ամեն ինչ դստերս ծննդյան համար։ Լուսանկարները շքեղ էին։", name: "Մարիամ Կ.", role: "Ծնունդ · Երևան", img: "/images/cupcakes.jpg" },
  ],
  ru: [
    { quote: "Salooote убрал весь хаос с нашей свадьбы. Каждый поставщик сделал ровно то, что обещал.", name: "Ануш и Давид", role: "Свадьба · Ереван, 2025", img: "/images/wedding-arch-beach.jpg" },
    { quote: "Забронировала всё для дня рождения дочки за один вечер. Фотографии получились потрясающими.", name: "Мариам К.", role: "День рождения · Ереван", img: "/images/cupcakes.jpg" },
  ],
};

/* ──────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────── */
export default function NewHomepageClient({ lang = "en", dict = {} }) {
  const t = T[lang] || T.en;
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];
  const [search, setSearch] = useState("");

  const testimonials = TESTIMONIALS[lang] || TESTIMONIALS.en;

  const onSearch = (e) => {
    e?.preventDefault?.();
    const q = search.trim();
    window.location.href = q ? `/${lang}/products?q=${encodeURIComponent(q)}` : `/${lang}/products`;
  };

  return (
    <div className="bg-[#fbf9f5] text-surface-900 selection:bg-rose-200/70">
      {/* ═════════════════ HERO ═════════════════ */}
      <section className="relative overflow-hidden">
        {/* ambient orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 -left-32 w-[640px] h-[640px] rounded-full bg-rose-200/35 blur-[120px]" />
          <div className="absolute top-32 -right-32 w-[520px] h-[520px] rounded-full bg-amber-100/55 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-fuchsia-100/40 blur-[120px]" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-rose-100 text-rose-700 px-3.5 py-1.5 text-xs font-semibold mb-6 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600" />
              </span>
              {t.heroBadge}
            </div>

            <h1 className="font-display font-semibold text-[2.7rem] sm:text-[3.6rem] lg:text-[4.6rem] leading-[1.02] tracking-[-0.02em] text-surface-900">
              {t.heroLine1}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-rose-500 via-rose-600 to-brand-600 bg-clip-text text-transparent">
                  {t.heroAccent}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  className="absolute left-0 right-0 -bottom-1 w-full h-3"
                  preserveAspectRatio="none"
                >
                  <path d="M2 8 C 50 2, 150 12, 198 6" stroke="rgb(244 63 94 / 0.35)" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>{" "}
              <br className="hidden sm:block" />
              {t.heroLine2}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-surface-600 max-w-[580px] leading-relaxed">
              {t.heroSub}
            </p>

            {/* Premium search-bar */}
            <form onSubmit={onSearch} className="mt-8 max-w-[600px]">
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-surface-200/80 shadow-[0_18px_40px_-18px_rgba(225,29,92,0.18)] p-2 pl-4 focus-within:border-rose-300 focus-within:shadow-[0_18px_40px_-12px_rgba(225,29,92,0.28)] transition-all">
                <Search size={18} className="text-surface-400 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base text-surface-800 placeholder:text-surface-400 py-1"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-surface-900 text-white text-sm font-semibold px-4 sm:px-5 py-2.5 hover:bg-surface-800 transition-colors flex items-center gap-1.5"
                >
                  {t.searchCta}
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {t.chips.map((chip) => (
                  <Link
                    key={chip}
                    href={`/${lang}/products?q=${encodeURIComponent(chip)}`}
                    className="text-xs font-medium text-surface-600 bg-white/70 hover:bg-white border border-surface-200 hover:border-rose-200 transition px-3 py-1.5 rounded-full"
                  >
                    {chip}
                  </Link>
                ))}
              </div>
            </form>

            {/* Dual CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/planner`}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white px-6 py-3.5 font-semibold text-sm shadow-[0_14px_30px_-10px_rgba(225,29,92,0.55)] hover:shadow-[0_20px_44px_-10px_rgba(225,29,92,0.7)] hover:-translate-y-0.5 transition-all"
              >
                <Sparkles size={16} />
                {t.ctaPrimary}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/${lang}/vendor`}
                className="group inline-flex items-center gap-2 rounded-full bg-white border border-surface-200 text-surface-800 px-6 py-3.5 font-semibold text-sm hover:bg-surface-50 hover:border-surface-300 transition-colors"
              >
                {t.ctaSecondary}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* mini trust row */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-surface-500">
              <span className="inline-flex items-center gap-1.5"><BadgeCheck size={14} className="text-emerald-600" /> {t.trustVerified}</span>
              <span className="inline-flex items-center gap-1.5"><Truck size={14} className="text-brand-600" /> {t.trustDelivery}</span>
              <span className="inline-flex items-center gap-1.5"><Star size={14} className="text-amber-500 fill-amber-500" /> {t.trustRating}</span>
            </div>
          </motion.div>

          {/* Hero collage */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="lg:col-span-5 relative"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative h-[210px] sm:h-[280px] rounded-3xl overflow-hidden shadow-[0_24px_60px_-22px_rgba(0,0,0,0.28)]">
                <Image src="/images/wedding-cake.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="relative h-[210px] sm:h-[280px] rounded-3xl overflow-hidden mt-10 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.28)]">
                <Image src="/images/flowers-roses.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="relative h-[210px] sm:h-[280px] rounded-3xl overflow-hidden -mt-10 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.28)]">
                <Image src="/images/wedding-ceremony.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="relative h-[210px] sm:h-[280px] rounded-3xl overflow-hidden shadow-[0_24px_60px_-22px_rgba(0,0,0,0.28)]">
                <Image src="/images/party-balloons.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            </div>

            {/* floating rating chip */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease }}
              className="hidden sm:flex absolute -left-5 top-12 items-center gap-2.5 rounded-2xl bg-white border border-surface-100 shadow-2xl px-4 py-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-brand-600 flex items-center justify-center text-white">
                <Star size={16} className="fill-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-surface-900">4.9 / 5</div>
                <div className="text-[11px] text-surface-500 -mt-0.5">15K+ events</div>
              </div>
            </motion.div>

            {/* floating verified chip */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease }}
              className="hidden sm:flex absolute -right-3 bottom-10 items-center gap-2.5 rounded-2xl bg-white border border-surface-100 shadow-2xl px-4 py-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-surface-900">850+ vendors</div>
                <div className="text-[11px] text-surface-500 -mt-0.5">{t.trustVerified}</div>
              </div>
            </motion.div>

            {/* floating live booking chip */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6, ease }}
              className="hidden lg:flex absolute -left-2 -bottom-3 items-center gap-2.5 rounded-full bg-white/95 backdrop-blur border border-surface-100 shadow-xl px-3.5 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-surface-700">3 just booked in Yerevan</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════ TRUST STRIP ═════════════════ */}
      <section className="border-y border-surface-200/70 bg-white/60 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-7 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { i: BadgeCheck, t: t.trustVerified, s: t.trustVerifiedSub, c: "text-emerald-600 bg-emerald-50" },
            { i: Truck,      t: t.trustDelivery, s: t.trustDeliverySub, c: "text-brand-600 bg-rose-50" },
            { i: Star,       t: t.trustRating,   s: t.trustRatingSub,   c: "text-amber-600 bg-amber-50" },
            { i: Calendar,   t: t.trustEvents,   s: t.trustEventsSub,   c: "text-violet-600 bg-violet-50" },
          ].map(({ i: Icon, t: title, s: sub, c }) => (
            <div key={title} className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl ${c} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-surface-900 truncate">{title}</div>
                <div className="text-xs text-surface-500 truncate">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════ CATEGORIES ═════════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-3">
              <span className="w-6 h-px bg-rose-300" />
              {t.catEyebrow}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-semibold tracking-[-0.02em] text-surface-900 leading-[1.05]">
              {t.catTitle}
            </h2>
            <p className="text-surface-600 mt-3 text-base sm:text-lg leading-relaxed">
              {t.catSub}
            </p>
          </div>
          <Link
            href={`/${lang}/category`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-rose-600 transition group flex-shrink-0"
          >
            {t.catViewAll}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            const name = c.name[lang] || c.name.en;
            return (
              <motion.div
                key={c.slug}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
              >
                <Link
                  href={`/${lang}/category/${c.slug}`}
                  className="group relative block overflow-hidden rounded-3xl aspect-[4/5] sm:aspect-[5/6] bg-surface-100"
                >
                  <Image
                    src={c.img}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${c.accent}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  {/* top-left icon chip */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-rose-600 shadow-md">
                    <Icon size={17} />
                  </div>

                  {/* count chip */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold px-2.5 py-1">
                    <Users size={10} />
                    {c.count} {t.catVendors}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-base sm:text-xl font-semibold text-white tracking-tight truncate">{name}</div>
                      <div className="mt-1 text-xs text-white/75 inline-flex items-center gap-1">
                        Discover <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all group-hover:bg-white group-hover:text-rose-600 flex-shrink-0">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link href={`/${lang}/category`} className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600">
            {t.catViewAll} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═════════════════ FEATURED VENDORS ═════════════════ */}
      <section className="bg-white border-y border-surface-200/70">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14">
            <div className="max-w-[640px]">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-3">
                <span className="w-6 h-px bg-rose-300" />
                {t.vendorEyebrow}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-semibold tracking-[-0.02em] text-surface-900 leading-[1.05]">
                {t.vendorTitle}
              </h2>
              <p className="text-surface-600 mt-3 text-base sm:text-lg leading-relaxed">
                {t.vendorSub}
              </p>
            </div>
            <Link
              href={`/${lang}/vendor`}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-rose-600 transition group flex-shrink-0"
            >
              {t.vendorViewAll} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {FEATURED_VENDORS.map((v, i) => {
              const cat = v.cat[lang] || v.cat.en;
              const tag = v.tag[lang] || v.tag.en;
              return (
                <motion.div
                  key={v.slug}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease }}
                >
                  <Link
                    href={`/${lang}/vendor/${v.slug}`}
                    className="group block bg-white rounded-3xl overflow-hidden border border-surface-100 hover:border-rose-200 hover:-translate-y-1 hover:shadow-[0_30px_60px_-22px_rgba(0,0,0,0.18)] transition-all duration-500"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={v.img}
                        alt={v.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-surface-800 shadow">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {v.rating}
                      </div>
                      <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 shadow">
                        <Zap size={11} className="fill-white" /> {tag}
                      </div>
                      <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-surface-700 hover:text-rose-600 transition" aria-label="Save">
                        <Heart size={16} />
                      </button>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">{cat}</div>
                      <div className="mt-1 text-lg sm:text-xl font-display font-semibold text-surface-900 tracking-tight">{v.name}</div>
                      <div className="mt-2 text-sm text-surface-500 inline-flex items-center gap-1.5">
                        <MapPin size={13} /> {v.city} · {v.reviews} {t.vendorReviews}
                      </div>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-surface-900 group-hover:text-rose-600 transition">
                        {t.vendorView} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════ HOW IT WORKS ═════════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center max-w-[680px] mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-3">
            <span className="w-6 h-px bg-rose-300" />
            {t.howEyebrow}
            <span className="w-6 h-px bg-rose-300" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-semibold tracking-[-0.02em] text-surface-900 leading-[1.05]">
            {t.howTitle}
          </h2>
          <p className="text-surface-600 mt-4 text-base sm:text-lg leading-relaxed">
            {t.howSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          {/* connecting line */}
          <div aria-hidden className="hidden md:block absolute top-[3.75rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

          {t.howSteps.map((step, i) => {
            const Icon = [Sparkles, Search, CheckCircle2][i];
            return (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="relative bg-white rounded-3xl border border-surface-100 p-6 sm:p-8 hover:border-rose-200 hover:shadow-[0_20px_50px_-20px_rgba(225,29,92,0.18)] transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-brand-600 flex items-center justify-center text-white shadow-[0_10px_24px_-8px_rgba(225,29,92,0.55)]">
                    <Icon size={20} />
                  </div>
                  <div className="text-5xl sm:text-6xl font-display font-semibold text-surface-100 select-none leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-semibold text-surface-900 tracking-tight">{step.t}</div>
                <p className="text-sm text-surface-600 mt-2 leading-relaxed">{step.s}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═════════════════ AI PLANNER BAND ═════════════════ */}
      <section className="px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-surface-900 via-[#1a0f3d] to-[#2d1b5e] text-white p-8 sm:p-14 lg:p-16">
          {/* glows */}
          <div aria-hidden className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full bg-rose-500/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-20 w-[400px] h-[400px] rounded-full bg-violet-500/30 blur-3xl" />
          <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold mb-5">
                <Sparkles size={14} /> {t.aiBadge}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.4rem] font-semibold tracking-[-0.02em] leading-[1.05]">
                {t.aiTitle}{" "}
                <span className="bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                  {t.aiAccent}
                </span>
              </h2>
              <p className="mt-5 text-white/75 max-w-[560px] leading-relaxed text-base sm:text-lg">
                {t.aiSub}
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.aiFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-brand-600 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={13} />
                    </span>
                    {f}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${lang}/planner`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white text-surface-900 px-6 py-3.5 font-semibold text-sm hover:scale-[1.02] hover:shadow-2xl transition-all"
                >
                  <Sparkles size={16} /> {t.aiPrimary}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={`/${lang}/about`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur text-white px-6 py-3.5 font-semibold text-sm hover:bg-white/15 transition"
                >
                  {t.aiSecondary}
                </Link>
              </div>
            </div>

            {/* AI chat preview */}
            <div className="lg:col-span-5">
              <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 space-y-3 shadow-2xl">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-brand-600 flex items-center justify-center shadow-lg">
                    <Sparkles size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">Sali — AI Planner</div>
                    <div className="text-[11px] text-white/60 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online · replies in seconds
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.04] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/85 max-w-[88%]">
                  Hosting a 50-guest birthday with a pink theme. Need cake, balloons & a photographer ✨
                </div>
                <div className="bg-gradient-to-br from-rose-500/30 to-brand-600/30 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3.5 text-sm text-white/95 ml-auto max-w-[92%] shadow-lg">
                  <div className="font-semibold mb-1.5">3 perfect matches in Yerevan ✨</div>
                  <div className="space-y-1.5 text-white/90">
                    <div className="inline-flex items-center gap-1.5"><Cake size={13} className="text-rose-200" /> Tiered rose cake — Royal Bakes</div>
                    <div className="inline-flex items-center gap-1.5"><PartyPopper size={13} className="text-amber-200" /> Balloon arch — Glow Decor</div>
                    <div className="inline-flex items-center gap-1.5"><Camera size={13} className="text-emerald-200" /> Sunset Studio — photos</div>
                  </div>
                  <div className="mt-2.5 text-[11px] text-white/70">Total est. 95,000 ֏ — within budget 💝</div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white/40">Reply to Sali…</div>
                  <button className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-brand-600 flex items-center justify-center" aria-label="Send">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════ TESTIMONIALS ═════════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="text-center max-w-[680px] mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-3">
            <span className="w-6 h-px bg-rose-300" />
            {t.testEyebrow}
            <span className="w-6 h-px bg-rose-300" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-semibold tracking-[-0.02em] text-surface-900 leading-[1.05]">
            {t.testTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((q, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="relative bg-gradient-to-br from-white to-rose-50/50 border border-rose-100/60 rounded-3xl p-7 sm:p-9 hover:shadow-[0_24px_60px_-22px_rgba(225,29,92,0.18)] transition-shadow"
            >
              <Quote size={32} className="text-rose-300 mb-4" />
              <p className="font-display text-xl sm:text-[1.7rem] leading-[1.4] text-surface-800 tracking-[-0.01em]">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="mt-7 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-rose-100">
                  <Image src={q.img} alt={q.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-surface-900 truncate">{q.name}</div>
                  <div className="text-xs text-surface-500 truncate">{q.role}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════════════════ FINAL CTA ═════════════════ */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-[1180px] mx-auto rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-rose-500 via-rose-600 to-brand-600 text-white p-10 sm:p-16 text-center shadow-[0_30px_80px_-20px_rgba(225,29,92,0.55)] relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-xs font-semibold mb-6">
              <Heart size={13} className="fill-white" /> {t.finalEyebrow}
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.8rem] font-semibold tracking-[-0.02em] leading-[1.04]">
              {t.finalTitle}
            </h2>
            <p className="mt-5 text-white/90 max-w-[580px] mx-auto text-base sm:text-lg">
              {t.finalSub}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${lang}/planner`}
                className="group inline-flex items-center gap-2 rounded-full bg-white text-rose-600 px-7 py-4 font-semibold text-sm hover:scale-[1.03] transition-transform shadow-xl"
              >
                <Sparkles size={16} /> {t.finalPrimary}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/${lang}/apply`}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/30 backdrop-blur text-white px-7 py-4 font-semibold text-sm hover:bg-white/20 transition"
              >
                {t.finalSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
