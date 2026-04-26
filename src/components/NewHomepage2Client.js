"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowUpRight, Star, Search, Heart, Send, MapPin,
  Cake, Flower2, PartyPopper, Camera, Music, UtensilsCrossed,
  Gift, MessageCircle, Wand2, Zap, Calendar, Crown, BadgeCheck, Clock,
  CheckCircle2,
} from "lucide-react";

/* ──────────────────────────────────────────────────
   Trilingual UI strings
   ────────────────────────────────────────────────── */
const T = {
  en: {
    badge: "AI Planner now in Armenian, Russian & English",
    h1Pre: "Make every",
    h1Post: "unforgettable.",
    rotate: ["birthday", "wedding", "baby shower", "engagement", "anniversary"],
    sub: "Armenia's most beautiful celebrations start here. Cakes, flowers, venues, photographers — all in one place, with an AI that plans alongside you.",
    searchPlaceholder: "What are you celebrating?",
    askAI: "Ask AI",
    chips: [
      { name: "Cakes", icon: Cake },
      { name: "Flowers", icon: Flower2 },
      { name: "Balloons", icon: PartyPopper },
      { name: "Photography", icon: Camera },
      { name: "DJ & Music", icon: Music },
      { name: "Catering", icon: UtensilsCrossed },
      { name: "Gifts", icon: Gift },
    ],
    trustVendors: "850+ verified vendors",
    trustRating: "4.9 from 6,400+ reviews",
    trustEvents: "15K+ events planned",
    momentsEyebrow: "Browse moments",
    momentsTitle: "Pick the moment.",
    momentsTitle2: "We'll bring it to life.",
    momentsAll: "All events",
    momentsExplore: "Explore",
    momentsCta: "Plan it",
    trendingEyebrow: "Trending now",
    trendingTitle: "What everyone's loving",
    trendingAll: "See all",
    vendorEyebrow: "Trusted by thousands",
    vendorTitle: "The best of Armenia, in one place",
    vendorVisit: "Visit profile",
    statsLabel: "Events celebrated",
    statsLabel2: "Verified vendors",
    statsLabel3: "Average rating",
    statsLabel4: "AI assistant",
    aiBadge: "Meet Sali",
    aiTitle: "Your AI event planner that",
    aiAccent: "actually gets it.",
    aiSub: "Tell Sali what you're imagining. She'll suggest vendors, build your checklist, and stay on budget — in Armenian, English, or Russian.",
    aiFeatures: ["Personalized vendor matches", "Auto-generated event checklist", "Real-time budget tracking", "Booking & reminders, all in chat"],
    aiCta: "Try Sali for free",
    finalBadge: "Made in Armenia, with love",
    finalTitle1: "Let's celebrate",
    finalTitle2: "something beautiful.",
    finalSub: "Whether it's a wedding for 200 or a birthday for 5 — we'll make it unforgettable.",
    finalPrimary: "Plan with AI",
    finalSecondary: "Browse vendors",
    activity: [
      { name: "Anush", action: "booked a tiered rose cake", time: "2 min ago", icon: Cake, color: "bg-rose-100 text-rose-600" },
      { name: "Lilit", action: "saved a photographer in Yerevan", time: "5 min ago", icon: Camera, color: "bg-amber-100 text-amber-600" },
      { name: "Davit", action: "added Glow Decor to favorites", time: "12 min ago", icon: PartyPopper, color: "bg-violet-100 text-violet-600" },
    ],
    activityTitle: "Live on Salooote",
    activityHere: "happening now",
  },
  hy: {
    badge: "AI պլանավորողը արդեն հայերեն, ռուսերեն ու անգլերեն",
    h1Pre: "Դարձրու ամեն",
    h1Post: "անմոռանալի։",
    rotate: ["ծնունդ", "հարսանիք", "բեյբի շաուեր", "նշանադրություն", "տարեդարձ"],
    sub: "Հայաստանի ամենագեղեցիկ տոնակատարությունները սկսվում են այստեղ։ Տորթեր, ծաղիկներ, սրահներ, լուսանկարիչներ — ամեն ինչ մեկ տեղում AI պլանավորողի հետ։",
    searchPlaceholder: "Ի՞նչ ես տոնում",
    askAI: "Հարցրու AI-ին",
    chips: [
      { name: "Տորթեր", icon: Cake },
      { name: "Ծաղիկներ", icon: Flower2 },
      { name: "Փուչիկներ", icon: PartyPopper },
      { name: "Լուսանկարչություն", icon: Camera },
      { name: "DJ ու երաժշտություն", icon: Music },
      { name: "Քեյթերինգ", icon: UtensilsCrossed },
      { name: "Նվերներ", icon: Gift },
    ],
    trustVendors: "850+ ստուգված մատակարար",
    trustRating: "4.9 (6 400+ կարծիք)",
    trustEvents: "15 000+ միջոցառում",
    momentsEyebrow: "Տոնական պահեր",
    momentsTitle: "Ընտրիր պահը։",
    momentsTitle2: "Մենք կիրականացնենք։",
    momentsAll: "Բոլոր միջոցառումները",
    momentsExplore: "Տես",
    momentsCta: "Պլանավորիր",
    trendingEyebrow: "Թրենդային հիմա",
    trendingTitle: "Ինչ են սիրում բոլորը",
    trendingAll: "Բոլորը",
    vendorEyebrow: "Հազարավորների վստահությունը",
    vendorTitle: "Հայաստանի լավագույնը մեկ տեղում",
    vendorVisit: "Նայել պրոֆիլը",
    statsLabel: "Տոնակատարություն",
    statsLabel2: "Ստուգված մատակարար",
    statsLabel3: "Միջին գնահատական",
    statsLabel4: "AI օգնական",
    aiBadge: "Ծանոթացիր Sali-ի հետ",
    aiTitle: "Քո AI պլանավորողը, որը",
    aiAccent: "իսկապես հասկանում է։",
    aiSub: "Պատմիր Sali-ին քո պատկերացումը։ Նա կառաջարկի մատակարարներ, կկառուցի ստուգաթերթ ու կպահի բյուջեն։",
    aiFeatures: ["Անհատական մատակարարներ", "Ավտո ստուգաթերթ", "Բյուջեի վերահսկում", "Ամրագրում զրույցում"],
    aiCta: "Փորձիր անվճար",
    finalBadge: "Ստեղծված է Հայաստանում սիրով",
    finalTitle1: "Տոնենք",
    finalTitle2: "ինչ-որ գեղեցիկ բան։",
    finalSub: "Լինի դա հարսանիք 200 հոգու, թե ծնունդ 5-ի — մենք կդարձնենք անմոռանալին։",
    finalPrimary: "Պլանավորել AI-ով",
    finalSecondary: "Մատակարարներ",
    activity: [
      { name: "Անուշը", action: "ամրագրեց բազմահարկ տորթ", time: "2 րոպե առաջ", icon: Cake, color: "bg-rose-100 text-rose-600" },
      { name: "Լիլիթը", action: "պահպանեց լուսանկարիչ Երևանում", time: "5 րոպե առաջ", icon: Camera, color: "bg-amber-100 text-amber-600" },
      { name: "Դավիթը", action: "ավելացրեց Glow Decor-ը", time: "12 րոպե առաջ", icon: PartyPopper, color: "bg-violet-100 text-violet-600" },
    ],
    activityTitle: "Salooote-ում հենց հիմա",
    activityHere: "միանում են",
  },
  ru: {
    badge: "AI планировщик уже на армянском, русском и английском",
    h1Pre: "Сделай каждый",
    h1Post: "незабываемым.",
    rotate: ["день рождения", "свадьба", "беби шауэр", "помолвка", "годовщина"],
    sub: "Самые красивые праздники Армении начинаются здесь. Торты, цветы, залы, фотографы — всё в одном месте с AI, который планирует вместе с вами.",
    searchPlaceholder: "Что вы празднуете?",
    askAI: "Спросить AI",
    chips: [
      { name: "Торты", icon: Cake },
      { name: "Цветы", icon: Flower2 },
      { name: "Шары", icon: PartyPopper },
      { name: "Фото", icon: Camera },
      { name: "DJ и музыка", icon: Music },
      { name: "Кейтеринг", icon: UtensilsCrossed },
      { name: "Подарки", icon: Gift },
    ],
    trustVendors: "850+ проверенных поставщиков",
    trustRating: "4.9 из 6 400+ отзывов",
    trustEvents: "15K+ событий",
    momentsEyebrow: "Праздничные моменты",
    momentsTitle: "Выберите момент.",
    momentsTitle2: "Мы воплотим его в жизнь.",
    momentsAll: "Все события",
    momentsExplore: "Открыть",
    momentsCta: "Планировать",
    trendingEyebrow: "В тренде сейчас",
    trendingTitle: "Что нравится всем",
    trendingAll: "Все",
    vendorEyebrow: "Доверие тысяч",
    vendorTitle: "Лучшее Армении в одном месте",
    vendorVisit: "Посмотреть профиль",
    statsLabel: "Праздников",
    statsLabel2: "Поставщиков",
    statsLabel3: "Средний рейтинг",
    statsLabel4: "AI помощник",
    aiBadge: "Знакомьтесь, Sali",
    aiTitle: "Ваш AI планировщик, который",
    aiAccent: "правда понимает.",
    aiSub: "Расскажите Sali, что вы представляете. Она подберёт поставщиков, составит чек-лист и удержит бюджет — на армянском, английском или русском.",
    aiFeatures: ["Персональный подбор поставщиков", "Авто чек-лист события", "Контроль бюджета онлайн", "Бронирование и напоминания в чате"],
    aiCta: "Попробовать бесплатно",
    finalBadge: "Сделано в Армении с любовью",
    finalTitle1: "Давайте отметим",
    finalTitle2: "что-то прекрасное.",
    finalSub: "Будь то свадьба на 200 или день рождения на 5 — мы сделаем это незабываемым.",
    finalPrimary: "Планировать с AI",
    finalSecondary: "Поставщики",
    activity: [
      { name: "Ануш", action: "забронировала ярусный торт", time: "2 мин назад", icon: Cake, color: "bg-rose-100 text-rose-600" },
      { name: "Лилит", action: "сохранила фотографа в Ереване", time: "5 мин назад", icon: Camera, color: "bg-amber-100 text-amber-600" },
      { name: "Давид", action: "добавил Glow Decor в избранное", time: "12 мин назад", icon: PartyPopper, color: "bg-violet-100 text-violet-600" },
    ],
    activityTitle: "Сейчас на Salooote",
    activityHere: "присоединяются",
  },
};

const MOMENTS = [
  { slug: "wedding",   key: { en: "Weddings",      hy: "Հարսանիք",       ru: "Свадьбы" },        img: "/images/wedding-arch-beach.jpg", grad: "from-rose-600/85 via-rose-600/30 to-rose-500/0",     icon: Heart },
  { slug: "birthday",  key: { en: "Birthdays",     hy: "Ծնունդներ",      ru: "Дни рождения" },   img: "/images/cupcakes.jpg",           grad: "from-amber-600/85 via-amber-500/30 to-rose-500/0",   icon: Cake },
  { slug: "kids-party",key: { en: "Kids Parties",  hy: "Մանկական",       ru: "Детские" },        img: "/images/party-balloons.jpg",     grad: "from-emerald-600/85 via-cyan-500/30 to-cyan-400/0", icon: Gift },
  { slug: "corporate", key: { en: "Corporate",     hy: "Կորպորատիվ",     ru: "Корпоратив" },     img: "/images/event-dinner.jpg",       grad: "from-slate-900/90 via-slate-800/40 to-slate-700/0", icon: Crown },
  { slug: "engagement",key: { en: "Engagements",   hy: "Նշանադրություն", ru: "Помолвки" },       img: "/images/wedding-dance.jpg",      grad: "from-fuchsia-600/85 via-fuchsia-500/30 to-rose-500/0", icon: Sparkles },
  { slug: "baptism",   key: { en: "Baptisms",      hy: "Կնունք",          ru: "Крестины" },       img: "/images/balloons-blue.jpg",      grad: "from-sky-600/85 via-sky-500/30 to-violet-500/0",   icon: PartyPopper },
];

const TRENDING = [
  { id: 1, name: { en: "Three-tier Rose Cake", hy: "Եռահարկ վարդագույն տորթ", ru: "Трёхъярусный торт «Роза»" }, vendor: "Royal Bakes",     price: 45000, original: 60000, img: "/images/wedding-cake.jpg",   rating: 4.9 },
  { id: 2, name: { en: "Premium Balloon Arch", hy: "Փրեմիում փուչիկների կամար", ru: "Премиум арка из шаров" },     vendor: "Glow Decor",      price: 28000, original: null,  img: "/images/party-balloons.jpg", rating: 4.8 },
  { id: 3, name: { en: "Bridal Bouquet — Roses", hy: "Հարսնական ծաղկեփունջ", ru: "Букет невесты — розы" },         vendor: "Yerevan Flowers", price: 18000, original: 22000, img: "/images/flowers-roses.jpg",  rating: 5.0 },
  { id: 4, name: { en: "Cookie Box — 24 pcs", hy: "Թխվածքաբլիթներ — 24 հատ", ru: "Коробка печенья — 24 шт" },     vendor: "Sweet Avenue",    price: 9500,  original: null,  img: "/images/cookies-box.jpg",    rating: 4.9 },
];

const TOP_VENDORS = [
  { slug: "royal-bakes",     name: "Royal Bakes",     cat: { en: "Cakes & Desserts", hy: "Տորթեր ու անուշեղեն", ru: "Торты и десерты" }, rating: 4.9, img: "/images/wedding-cake2.jpg" },
  { slug: "yerevan-flowers", name: "Yerevan Flowers", cat: { en: "Flowers & Decor",  hy: "Ծաղիկներ ու դեկոր",   ru: "Цветы и декор" },   rating: 4.8, img: "/images/flowers-roses.jpg" },
  { slug: "salooote",        name: "Sunset Studio",   cat: { en: "Photography",      hy: "Լուսանկարչություն",    ru: "Фотография" },       rating: 5.0, img: "/images/wedding-arch-beach.jpg" },
];

/* ──────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────── */
export default function NewHomepage2Client({ lang = "en", dict = {} }) {
  const t = T[lang] || T.en;
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];
  const [wordIdx, setWordIdx] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setWordIdx((i) => (i + 1) % t.rotate.length), 2400);
    return () => clearInterval(id);
  }, [t.rotate.length, reduce]);

  const onSearch = (e) => {
    e?.preventDefault?.();
    const q = search.trim();
    window.location.href = q ? `/${lang}/planner?q=${encodeURIComponent(q)}` : `/${lang}/planner`;
  };

  return (
    <div className="bg-[#fdfaf6] text-surface-900 selection:bg-rose-300/60 overflow-hidden">
      {/* ════════════ HERO ════════════ */}
      <section className="relative">
        {/* Aurora background */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-[#fdfaf6] to-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[760px] rounded-full bg-rose-200/40 blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-[520px] h-[520px] rounded-full bg-amber-200/35 blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[460px] h-[460px] rounded-full bg-fuchsia-200/30 blur-[120px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-14 sm:pt-24 pb-14 sm:pb-20 text-center">
          {/* AI chip */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-rose-200/70 text-surface-700 px-4 py-1.5 text-xs font-semibold mb-7 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            {t.badge}
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display font-semibold tracking-[-0.025em] text-[2.7rem] sm:text-[4rem] lg:text-[5.6rem] leading-[1.0] text-surface-900"
          >
            {t.h1Pre} <br className="sm:hidden" />
            <span className="relative inline-block min-w-[7ch] align-baseline">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="inline-block bg-gradient-to-r from-rose-500 via-rose-600 to-brand-600 bg-clip-text text-transparent"
                >
                  {t.rotate[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            <br />
            {t.h1Post}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-7 text-base sm:text-xl text-surface-600 max-w-[680px] mx-auto leading-relaxed"
          >
            {t.sub}
          </motion.p>

          {/* Floating glass search */}
          <motion.form
            onSubmit={onSearch}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 max-w-[660px] mx-auto"
          >
            <div className="flex items-center gap-2 rounded-full bg-white border border-surface-200 shadow-[0_30px_70px_-20px_rgba(225,29,92,0.28)] p-1.5 pl-5 focus-within:border-rose-300 focus-within:shadow-[0_30px_70px_-15px_rgba(225,29,92,0.4)] transition-all">
              <Search size={18} className="text-surface-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-surface-800 placeholder:text-surface-400 py-2"
              />
              <button
                type="submit"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white text-sm font-semibold px-5 py-3 hover:scale-[1.02] hover:shadow-lg transition-all"
              >
                <Sparkles size={15} /> {t.askAI}
              </button>
              <button
                type="submit"
                className="sm:hidden inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white w-11 h-11"
                aria-label={t.askAI}
              >
                <Sparkles size={16} />
              </button>
            </div>

            {/* quick chips */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {t.chips.map(({ name, icon: Icon }) => (
                <Link
                  key={name}
                  href={`/${lang}/products?q=${encodeURIComponent(name)}`}
                  className="group inline-flex items-center gap-1.5 bg-white/70 hover:bg-white border border-surface-200 hover:border-rose-200 backdrop-blur text-xs sm:text-sm font-medium text-surface-700 px-3.5 py-2 rounded-full transition"
                >
                  <Icon size={13} className="text-rose-500" />
                  {name}
                </Link>
              ))}
            </div>
          </motion.form>

          {/* Trust strip */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-surface-500"
          >
            <span className="inline-flex items-center gap-2"><Zap size={14} className="text-amber-500 fill-amber-500" /> {t.trustVendors}</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-surface-300" />
            <span className="inline-flex items-center gap-2"><Star size={14} className="text-rose-500 fill-rose-500" /> {t.trustRating}</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-surface-300" />
            <span className="inline-flex items-center gap-2"><Calendar size={14} className="text-emerald-600" /> {t.trustEvents}</span>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-surface-200/70 bg-white/60 backdrop-blur-sm py-4 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-[marquee2_30s_linear_infinite]">
            {[...Array(2)].flatMap((_, k) =>
              ["Birthday", "Wedding", "Baby Shower", "Anniversary", "Corporate", "Engagement", "Kids Party", "Christmas", "Baptism"].map((m, i) => (
                <span key={`${k}-${i}`} className="inline-flex items-center gap-3 text-sm sm:text-base font-display font-medium text-surface-400">
                  <Sparkles size={14} className="text-rose-400" />
                  {m}
                </span>
              ))
            )}
          </div>
          <style jsx>{`
            @keyframes marquee2 {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </section>

      {/* ════════════ MOMENTS GRID ════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-3">
              <span className="w-6 h-px bg-rose-300" />
              {t.momentsEyebrow}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.4rem] font-semibold tracking-[-0.02em] leading-[1.05]">
              {t.momentsTitle}<br className="sm:hidden" /> <span className="text-surface-500">{t.momentsTitle2}</span>
            </h2>
          </div>
          <Link href={`/${lang}/events`} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-rose-600 transition group flex-shrink-0">
            {t.momentsAll} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {MOMENTS.map((m, i) => {
            const Icon = m.icon;
            const name = m.key[lang] || m.key.en;
            return (
              <motion.div
                key={m.slug}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease }}
                className={`${i === 0 ? "lg:col-span-2 lg:row-span-2 col-span-2" : ""}`}
              >
                <Link
                  href={`/${lang}/events/${m.slug}`}
                  className={`group relative block overflow-hidden rounded-3xl ${i === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-[560px] lg:h-full" : "aspect-[4/5]"} bg-surface-100`}
                >
                  <Image
                    src={m.img}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 50vw, 33vw"}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${m.grad}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* top-right icon chip */}
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-rose-600 shadow-lg">
                    <Icon size={18} />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold px-2.5 py-1 mb-3">
                      <Sparkles size={11} /> {t.momentsExplore}
                    </div>
                    <div className={`font-display font-semibold text-white tracking-[-0.01em] ${i === 0 ? "text-3xl sm:text-5xl lg:text-6xl" : "text-xl sm:text-2xl"}`}>
                      {name}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-white/90 text-sm font-medium">
                      {t.momentsCta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════════ TRENDING NOW ════════════ */}
      <section className="bg-white border-y border-surface-100">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14">
            <div className="max-w-[640px]">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-3">
                <Zap size={13} className="fill-rose-500 text-rose-500" /> {t.trendingEyebrow}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-semibold tracking-[-0.02em] leading-[1.05]">
                {t.trendingTitle}
              </h2>
            </div>
            <Link href={`/${lang}/products`} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-surface-700 hover:text-rose-600 transition group flex-shrink-0">
              {t.trendingAll} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {TRENDING.map((p, i) => {
              const off = p.original ? Math.round((1 - p.price / p.original) * 100) : 0;
              const name = p.name[lang] || p.name.en;
              return (
                <motion.div
                  key={p.id}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease }}
                >
                  <Link
                    href={`/${lang}/products`}
                    className="group block bg-white rounded-3xl border border-surface-100 hover:border-rose-200 hover:shadow-[0_24px_50px_-20px_rgba(225,29,92,0.25)] hover:-translate-y-1 transition-all overflow-hidden"
                  >
                    <div className="relative aspect-square bg-surface-100 overflow-hidden">
                      <Image src={p.img} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                      {off > 0 && (
                        <span className="absolute top-3 left-3 rounded-full bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 shadow">
                          -{off}%
                        </span>
                      )}
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-surface-700 hover:text-rose-600 transition shadow" aria-label="Save">
                        <Heart size={15} />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <Star size={11} className="fill-amber-500 text-amber-500" /> {p.rating}
                      </div>
                      <div className="mt-1 text-[15px] font-semibold text-surface-900 leading-snug line-clamp-2">{name}</div>
                      <div className="mt-0.5 text-xs text-surface-500">{p.vendor}</div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-base font-bold text-surface-900">{p.price.toLocaleString()} ֏</span>
                        {p.original && <span className="text-xs text-surface-400 line-through">{p.original.toLocaleString()} ֏</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════ TOP VENDORS ════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center max-w-[680px] mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-3">
            <span className="w-6 h-px bg-rose-300" />
            {t.vendorEyebrow}
            <span className="w-6 h-px bg-rose-300" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-semibold tracking-[-0.02em] leading-[1.05]">
            {t.vendorTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TOP_VENDORS.map((v, i) => {
            const cat = v.cat[lang] || v.cat.en;
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
                  className="group block bg-white rounded-3xl overflow-hidden border border-surface-100 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.18)] transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image src={v.img} alt={v.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-surface-800 shadow">
                      <Star size={12} className="text-amber-500 fill-amber-500" /> {v.rating} top-rated
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">{cat}</div>
                    <div className="mt-1 text-xl font-display font-semibold text-surface-900 tracking-tight">{v.name}</div>
                    <div className="mt-2 text-sm text-surface-500 inline-flex items-center gap-1"><MapPin size={13} /> Yerevan, Armenia</div>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600">
                      {t.vendorVisit} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════════ STATS BANNER + LIVE FEED ════════════ */}
      <section className="px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Stats card */}
          <div className="lg:col-span-2 relative rounded-[2rem] bg-gradient-to-br from-surface-900 via-[#1a0f3d] to-[#2d1b5e] text-white p-9 sm:p-12 overflow-hidden">
            <div aria-hidden className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-rose-500/20 blur-3xl" />
            <div aria-hidden className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/20 blur-3xl" />
            <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {[
                { n: "15K+", l: t.statsLabel },
                { n: "850+", l: t.statsLabel2 },
                { n: "4.9★", l: t.statsLabel3 },
                { n: "24/7", l: t.statsLabel4 },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                    {s.n}
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-white/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live activity feed */}
          <div className="rounded-[2rem] bg-white border border-surface-100 p-6 sm:p-7 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">{t.activityTitle}</div>
                <div className="text-sm font-display font-semibold text-surface-900">{t.activityHere}</div>
              </div>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>

            <div className="space-y-3">
              {t.activity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-surface-800 leading-snug">
                        <span className="font-semibold">{a.name}</span> {a.action}
                      </div>
                      <div className="text-[11px] text-surface-400 mt-0.5 inline-flex items-center gap-1">
                        <Clock size={10} /> {a.time}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ AI SPOTLIGHT ════════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1.5 text-xs font-semibold mb-5">
              <Wand2 size={14} /> {t.aiBadge}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-semibold tracking-[-0.02em] leading-[1.05] text-surface-900">
              {t.aiTitle}{" "}
              <span className="bg-gradient-to-r from-rose-500 to-brand-600 bg-clip-text text-transparent">{t.aiAccent}</span>
            </h2>
            <p className="mt-5 text-surface-600 text-base sm:text-lg max-w-[520px] leading-relaxed">
              {t.aiSub}
            </p>

            <div className="mt-7 space-y-3">
              {t.aiFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-surface-700">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-brand-600 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={13} />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/planner`}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-brand-600 text-white px-6 py-3.5 font-semibold text-sm shadow-[0_14px_30px_-10px_rgba(225,29,92,0.55)] hover:scale-[1.02] hover:shadow-[0_20px_44px_-10px_rgba(225,29,92,0.7)] transition-all"
              >
                <Sparkles size={16} /> {t.aiCta}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Phone mockup with chat */}
          <div className="relative">
            <div className="relative mx-auto max-w-[440px]">
              {/* glow */}
              <div aria-hidden className="absolute -inset-8 bg-gradient-to-tr from-rose-300/40 to-amber-200/40 rounded-[3rem] blur-3xl -z-10" />

              <div className="relative bg-white rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(225,29,92,0.35)] border border-surface-100 p-5 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-surface-100">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-brand-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-surface-900">Sali · AI Planner</div>
                    <div className="text-[11px] text-emerald-600 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                    </div>
                  </div>
                </div>

                <div className="bg-surface-50 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-surface-800 max-w-[85%]">
                  Hi! I&apos;m planning my daughter&apos;s 5th birthday. Pink theme, 20 kids 🎀
                </div>
                <div className="bg-gradient-to-br from-rose-500 to-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm ml-auto max-w-[85%] shadow-md">
                  How fun! ✨ Here&apos;s my plan:
                  <div className="mt-2 space-y-1.5 text-white/95">
                    <div className="inline-flex items-center gap-1.5"><Cake size={12} /> Pink cloud cake — Royal Bakes</div>
                    <div className="inline-flex items-center gap-1.5"><PartyPopper size={12} /> Balloon arch — Glow Decor</div>
                    <div className="inline-flex items-center gap-1.5"><Camera size={12} /> Sunset Studio for photos</div>
                  </div>
                  <div className="mt-2 text-[11px] text-white/80">Total est. ~85,000 ֏ — within budget 💝</div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 bg-surface-50 rounded-full px-4 py-2.5 text-xs text-surface-400">Type a message…</div>
                  <button className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-brand-600 text-white flex items-center justify-center" aria-label="Send">
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {/* floating decoration cards */}
              <motion.div
                animate={reduce ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-8 hidden sm:flex bg-white rounded-2xl border border-surface-100 shadow-xl px-3 py-2.5 items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center"><Cake size={14} /></div>
                <div>
                  <div className="text-xs font-semibold text-surface-900">3 cakes matched</div>
                  <div className="text-[10px] text-surface-500">in your budget</div>
                </div>
              </motion.div>
              <motion.div
                animate={reduce ? {} : { y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -right-6 hidden sm:flex bg-white rounded-2xl border border-surface-100 shadow-xl px-3 py-2.5 items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><Star size={14} className="fill-amber-500" /></div>
                <div>
                  <div className="text-xs font-semibold text-surface-900">Top-rated</div>
                  <div className="text-[10px] text-surface-500">verified vendors</div>
                </div>
              </motion.div>
              <motion.div
                animate={reduce ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-10 hidden lg:flex bg-white rounded-2xl border border-surface-100 shadow-xl px-3 py-2.5 items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><BadgeCheck size={14} /></div>
                <div>
                  <div className="text-xs font-semibold text-surface-900">Booked!</div>
                  <div className="text-[10px] text-surface-500">in 2 minutes</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FINAL CTA ════════════ */}
      <section className="relative px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-[1180px] mx-auto relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-rose-500 via-rose-600 to-brand-600 text-white p-10 sm:p-16 text-center shadow-[0_30px_80px_-20px_rgba(225,29,92,0.55)]">
          <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-white/40 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-white/30 blur-3xl" />
          </div>
          <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-semibold mb-6">
              <Heart size={13} className="fill-white" /> {t.finalBadge}
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[4rem] font-semibold tracking-[-0.02em] leading-[1.02]">
              {t.finalTitle1} <br className="sm:hidden" /> {t.finalTitle2}
            </h2>
            <p className="mt-5 text-white/90 max-w-[560px] mx-auto text-base sm:text-lg">
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
                href={`/${lang}/vendor`}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 backdrop-blur text-white px-7 py-4 font-semibold text-sm hover:bg-white/25 transition"
              >
                <MessageCircle size={16} /> {t.finalSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
